// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./AuctionToken.sol";

// AuctionMarket contract (to be created by AuctionInitator contract)
contract AuctionMarket {
  AuctionToken private _token;
  address private _creator;

  uint256 private _totalSupply;
  uint256 private _startPrice;
  uint256 private _reservedPrice;

  uint256 private _startTime;
  uint256 private constant _duration = 20 minutes;

  // Keep track of token distribution status
  bool private _tokensDistributed = false;

  // Reentrancy guard
  bool private _locked = false;

  struct Bid {
    address bidder;
    uint256 commitment;
  }

  // Keep track of bids, commitments, last bid to evaluate clearing price and distribute tokens
  Bid[] private _bids;
  uint256 private _totalCommitment = 0;
  mapping(address => uint256) private _commitmentByBidder;
  uint256 private _lastBid;

  event RefundFailed(address recipient, uint256 amount);
  event TransferFailed(address recipient, uint256 amount);

  constructor(
    string memory tokenName,
    string memory tokenSymbol,
    uint256 totalSupply,
    uint256 startPrice,
    uint256 reservedPrice,
    address creator
  ) {
    // Create a new AuctionToken ERC20 contract
    AuctionToken token = new AuctionToken(tokenName, tokenSymbol, totalSupply);
    _token = token;

    // Set prices and total supply
    _startPrice = startPrice;
    _reservedPrice = reservedPrice;
    _totalSupply = totalSupply;

    // Set start time
    _startTime = block.timestamp;

    // Set creator - ethers will be transfered to the creator after token distribution
    _creator = creator;
  }

  // Reentrancy modifier
  modifier nonReentrant() {
    require(!_locked, "Reentrant call detected");
    _locked = true;
    _;
    _locked = false;
  }

  // Getters
  function getToken() external view returns (AuctionToken) {
    return _token;
  }

  function getCreator() external view returns (address) {
    return _creator;
  }

  function getTotalSupply() external view returns (uint256) {
    return _totalSupply;
  }

  function getStartPrice() external view returns (uint256) {
    return _startPrice;
  }

  function getReservedPrice() external view returns (uint256) {
    return _reservedPrice;
  }

  function getStartTime() external view returns (uint256) {
    return _startTime;
  }

  function getDuration() external pure returns (uint256) {
    return _duration;
  }

  function getTokensDistributed() external view returns (bool) {
    return _tokensDistributed;
  }

  function getTotalCommitment() external view returns (uint256) {
    return _totalCommitment;
  }

  function getCommitmentByBidder(
    address bidder
  ) external view returns (uint256) {
    return _commitmentByBidder[bidder];
  }

  // Public functions for dutch auction logic
  function getCurrentPrice() public view returns (uint256) {
    if (block.timestamp < _startTime) {
      return _startPrice;
    } else if (block.timestamp >= _startTime + _duration) {
      return _reservedPrice;
    } else {
      uint256 discount = ((_startPrice - _reservedPrice) *
        (block.timestamp - _startTime)) / _duration;
      return (_startPrice - discount);
    }
  }

  function getAuctionEnded() public view returns (bool) {
    return
      block.timestamp >= _startTime + _duration ||
      (_totalCommitment * 10 ** _token.decimals()) / getCurrentPrice() >=
      _totalSupply;
  }

  function getClearingPrice() public view returns (uint256) {
    // require(getAuctionEnded(), "Auction not ended yet");
    if (!getAuctionEnded()) {
      return getCurrentPrice();
    }

    // Sell at reserved price
    if (
      (_totalCommitment * 10 ** _token.decimals()) / _reservedPrice <=
      _totalSupply
    ) {
      return _reservedPrice;
    }

    // Sell at clearance price > reserved price
    if (
      (_totalCommitment * 10 ** _token.decimals()) / _lastBid >= _totalSupply
    ) {
      return _lastBid;
    } else {
      return (_totalCommitment * 10 ** _token.decimals()) / _totalSupply;
    }
  }

  // External functions for Dutch Auction logic
  function getRemainingSupply() external view returns (uint256) {
    uint256 currentDemand = (_totalCommitment * 10 ** _token.decimals()) /
      getCurrentPrice();

    if (_totalSupply > currentDemand) {
      return _totalSupply - currentDemand;
    } else {
      return 0;
    }
  }

  function placeBid() external payable nonReentrant {
    require(!getAuctionEnded(), "Auction ended");
    require(msg.sender != _creator, "Creator cannot place a bid");
    require(msg.value > 0, "Bid value must be more than 0");

    // Step 1: Calculate the current auction price using Dutch auction logic
    uint256 currentPrice = getCurrentPrice();

    // Step 2: Calculate the number of tokens the current bid amount can purchase at the current price
    uint256 tokensPurchasable = (msg.value * 10 ** _token.decimals()) /
      currentPrice;

    // Step 3: Check the remaining token supply available for distribution
    uint256 currentDemand = (_totalCommitment * 10 ** _token.decimals()) /
      currentPrice;
    uint256 remainingSupply = _totalSupply > currentDemand
      ? _totalSupply - currentDemand
      : 0;

    // Step 4: Ensure there is sufficient remaining supply for the bid
    require(
      tokensPurchasable <= remainingSupply,
      "Insufficient tokens remaining for this bid"
    );

    // Save last bid price for reference in clearing price calculation
    _lastBid = currentPrice;

    // Add total commitment
    _totalCommitment += msg.value;
    _commitmentByBidder[msg.sender] += msg.value;

    // Save bid
    _bids.push(Bid({bidder: msg.sender, commitment: msg.value}));
  }

  event DebugRefund(uint256 tokensPurchased, uint256 cost, uint256 refund);

  function distributeTokens() external nonReentrant {
    require(
      msg.sender == _creator || _commitmentByBidder[msg.sender] > 0,
      "Only the creator or bidders can distribute tokens"
    );
    require(getAuctionEnded(), "Auction not ended yet");
    require(!_tokensDistributed, "Tokens already distributed");

    uint256 tokensToDistribute = _totalSupply;

    for (uint256 i = 0; i < _bids.length && tokensToDistribute > 0; i++) {
      uint256 tokensPurchased = (_bids[i].commitment *
        10 ** _token.decimals()) / getClearingPrice();

      // Demand exceeds supply. Refund excess ethers to bidder
      if (tokensPurchased > tokensToDistribute) {
        tokensPurchased = tokensToDistribute;
      }

      uint256 cost = (tokensPurchased * getClearingPrice()) /
        10 ** _token.decimals();
      uint256 refund = _bids[i].commitment - cost;

      // Log refund information
      emit DebugRefund(tokensPurchased, cost, refund);

      if (refund > 0) {
        bool sent = payable(_bids[i].bidder).send(refund);
        if (!sent) {
          emit RefundFailed(_bids[i].bidder, refund);
        }
      }

      // Update supply and transfer ERC20 tokens to bidder
      tokensToDistribute -= tokensPurchased;
      bool transfered = _token.transfer(_bids[i].bidder, tokensPurchased);
      if (!transfered) {
        emit TransferFailed(_bids[i].bidder, tokensPurchased);
      }
    }

    // Burn remaining tokens
    uint256 remainingTokens = _token.balanceOf(address(this));
    if (remainingTokens > 0) {
      _token.burn(remainingTokens);
    }

    // Transfer the remaining ether to the contract creator
    payable(_creator).transfer(address(this).balance);

    _tokensDistributed = true;
  }

  // New function to allow the creator to withdraw remaining funds after the auction ends
  function withdraw() external nonReentrant {
    require(msg.sender == _creator, "Only the creator can withdraw funds");
    require(_tokensDistributed, "Tokens must be distributed before withdrawal");

    uint256 balance = address(this).balance;
    require(balance > 0, "No funds to withdraw");

    payable(_creator).transfer(balance);
  }
}
