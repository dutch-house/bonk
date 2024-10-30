import "@nomicfoundation/hardhat-chai-matchers";
import { expect } from "chai";
import hre from "hardhat";
import type { AuctionInitiator } from "../types";

describe("AuctionInitiator", () => {
	async function deployFixture() {
		const [owner, otherAccount] = await hre.ethers.getSigners();

		// Deploy the AuctionInitiator contract
		const AuctionInitiatorFactory =
			await hre.ethers.getContractFactory("AuctionInitiator");
		const auctionInitiator =
			(await AuctionInitiatorFactory.deploy()) as AuctionInitiator;

		return { auctionInitiator, owner, otherAccount };
	}

	describe("Deployment", () => {
		it("Should deploy successfully", async () => {
			const { auctionInitiator } = await deployFixture();
			const auctionInitiatorAddress = await auctionInitiator.getAddress();
			expect(auctionInitiatorAddress).to.be.properAddress;
		});
	});

	describe("Create Auction", () => {
		it("Should create an auction and emit AuctionCreated event", async () => {
			const { auctionInitiator, owner } = await deployFixture();

			const tokenName = "TestToken";
			const tokenSymbol = "TTK";
			const totalSupply = hre.ethers.parseUnits("1000000", 18);
			const startPrice = hre.ethers.parseEther("1"); // 1 ETH
			const reservedPrice = hre.ethers.parseEther("0.1"); // 0.1 ETH

			// Call createAuction to create a new AuctionMarket
			const tx = await auctionInitiator.createAuction(
				tokenName,
				tokenSymbol,
				totalSupply,
				startPrice,
				reservedPrice,
			);

			// Wait for the transaction to be mined
			const receipt = await tx.wait();

			// Get the AuctionInitiator contract interface
			const auctionInitiatorInterface = auctionInitiator.interface;

			// Parse the logs from the receipt to find the AuctionCreated event
			const event = receipt?.logs
				.map((log) => {
					try {
						return auctionInitiatorInterface.parseLog(log);
					} catch (e) {
						return null; // Ignore logs that aren't related to this contract
					}
				})
				.find((parsedLog) => parsedLog?.name === "AuctionCreated");

			// Ensure the event was emitted and contains the expected data
			expect(event).to.exist;
			expect(event?.args.creator).to.equal(owner.address);
		});
	});

	describe("Get Auctions", () => {
		it("Should return all created auctions", async () => {
			const { auctionInitiator } = await deployFixture();

			const tokenName = "TestToken";
			const tokenSymbol = "TTK";
			const totalSupply = hre.ethers.parseUnits("1000000", 18);
			const startPrice = hre.ethers.parseEther("1"); // 1 ETH
			const reservedPrice = hre.ethers.parseEther("0.1"); // 0.1 ETH

			// Create two auctions
			await auctionInitiator.createAuction(
				tokenName,
				tokenSymbol,
				totalSupply,
				startPrice,
				reservedPrice,
			);
			await auctionInitiator.createAuction(
				tokenName,
				tokenSymbol,
				totalSupply,
				startPrice,
				reservedPrice,
			);

			// Retrieve all auctions
			const auctions = await auctionInitiator.getAllAuctions();

			// Expect two auctions to be created
			expect(auctions.length).to.equal(2);
		});

		it("Should return auctions by creator", async () => {
			const { auctionInitiator, owner, otherAccount } = await deployFixture();

			const tokenName = "TestToken";
			const tokenSymbol = "TTK";
			const totalSupply = hre.ethers.parseUnits("1000000", 18);
			const startPrice = hre.ethers.parseEther("1"); // 1 ETH
			const reservedPrice = hre.ethers.parseEther("0.1"); // 0.1 ETH

			// Create one auction from the owner
			await auctionInitiator.createAuction(
				tokenName,
				tokenSymbol,
				totalSupply,
				startPrice,
				reservedPrice,
			);

			// Switch to another account and create an auction from otherAccount
			await auctionInitiator
				.connect(otherAccount)
				.createAuction(
					tokenName,
					tokenSymbol,
					totalSupply,
					startPrice,
					reservedPrice,
				);

			// Retrieve all auctions for the owner
			const ownerAuctions = await auctionInitiator.getAuctionsByCreator(
				owner.address,
			);
			expect(ownerAuctions.length).to.equal(1);

			// Retrieve all auctions for the other account
			const otherAccountAuctions = await auctionInitiator.getAuctionsByCreator(
				otherAccount.address,
			);
			expect(otherAccountAuctions.length).to.equal(1);
		});
	});
});
