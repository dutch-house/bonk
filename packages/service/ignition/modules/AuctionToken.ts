import "@nomicfoundation/hardhat-ethers";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import hre from "hardhat";

export default buildModule("AuctionTokenModule", (m) => {
	// Deploying AuctionToken contract with constructor arguments
	const auctionToken = m.contract("AuctionToken", [
		"Auction Token", // name
		"ATKN", // symbol
		hre.ethers.parseUnits("1000000", 18), // preMint (1 million tokens with 18 decimals)
	]);

	// Optionally, you can call functions on the deployed contract if needed
	// For example, transferring some tokens after deployment
	// m.call(auctionToken, "transfer", ["0xRecipientAddress", ethers.utils.parseUnits("1000", 18)]);

	return { auctionToken };
});
