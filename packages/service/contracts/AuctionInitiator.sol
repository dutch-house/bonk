// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./AuctionToken.sol";
import "./AuctionMarket.sol";

contract AuctionInitiator {
    mapping(address => AuctionMarket[]) private _auctionsByCreator;
    AuctionMarket[] private _allAuctions;

    // Events
    event AuctionCreated(address indexed creator, AuctionMarket auction);

    // Getters
    function getAllAuctions() external view returns (AuctionMarket[] memory) {
        return _allAuctions;
    }

    function getAuctionsByCreator(
        address creator
    ) external view returns (AuctionMarket[] memory) {
        return _auctionsByCreator[creator];
    }

    // Function to create a dutch auction contract
    function createAuction(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 totalSupply,
        uint256 startPrice,
        uint256 reservedPrice
    ) public returns (AuctionMarket) {
        require(
            startPrice > reservedPrice,
            "Start price must be greater than reserved price"
        );
        require(totalSupply > 0, "Total supply must be greater than zero");

        // Create a new AuctionMarket contract
        AuctionMarket newAuction = new AuctionMarket(
            tokenName,
            tokenSymbol,
            totalSupply,
            startPrice,
            reservedPrice,
            msg.sender
        );

        // Add the auction to the creator's list and to the total list
        _auctionsByCreator[msg.sender].push(newAuction);
        _allAuctions.push(newAuction);

        // Emit an event to notify
        emit AuctionCreated(msg.sender, newAuction);

        // Return the addresses of the new contracts
        return newAuction;
    }
}
