// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

// Default values for auction creation
const DEFAULT_TOTAL_SUPPLY = 1000000n;
const DEFAULT_START_PRICE = parseEther("1"); // 1 ETH
const DEFAULT_RESERVED_PRICE = parseEther("0.1"); // 0.1 ETH

const AuctionInitiatorModule = buildModule("AuctionInitiatorModule", (m) => {
	const tokenName = m.getParameter<string>("tokenName", "AuctionToken");
	const tokenSymbol = m.getParameter<string>("tokenSymbol", "ATKN");
	const totalSupply = m.getParameter("totalSupply", DEFAULT_TOTAL_SUPPLY);
	const startPrice = m.getParameter("startPrice", DEFAULT_START_PRICE);
	const reservedPrice = m.getParameter("reservedPrice", DEFAULT_RESERVED_PRICE);

	// Retrieve the deployer's account
	const deployer = m.getAccount(0); // 0 is typically the deployer index

	// Deploy the AuctionMarket contract with the deployer's address
	const auctionInitiator = m.contract("AuctionInitiator", []);

	// Create a new auction after deployment
	const auctionMarket = m.call(auctionInitiator, "createAuction", [
		tokenName,
		tokenSymbol,
		totalSupply,
		startPrice,
		reservedPrice,
	]);

	return { auctionInitiator };
});

export default AuctionInitiatorModule;
