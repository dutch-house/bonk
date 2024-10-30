// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const DEFAULT_TOTAL_SUPPLY = 1000000n;
const DEFAULT_START_PRICE = parseEther("1");
const DEFAULT_RESERVED_PRICE = parseEther("0.1");

const AuctionMarketModule = buildModule("AuctionMarketModule", (m) => {
	const tokenName = m.getParameter<string>("tokenName", "AuctionToken");
	const tokenSymbol = m.getParameter<string>("tokenSymbol", "ATKN");
	const totalSupply = m.getParameter("totalSupply", DEFAULT_TOTAL_SUPPLY);
	const startPrice = m.getParameter("startPrice", DEFAULT_START_PRICE);
	const reservedPrice = m.getParameter("reservedPrice", DEFAULT_RESERVED_PRICE);

	// Retrieve the deployer's account
	const deployer = m.getAccount(0); // 0 is typically the deployer index

	// Deploy the AuctionMarket contract with the deployer's address
	const auctionDutch = m.contract("AuctionMarket", [
		tokenName,
		tokenSymbol,
		totalSupply,
		startPrice,
		reservedPrice,
		deployer,
	]);

	return { auctionDutch };
});

export default AuctionMarketModule;
