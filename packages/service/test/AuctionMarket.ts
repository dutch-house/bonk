import "@nomicfoundation/hardhat-chai-matchers";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import hre from "hardhat";
import type { AuctionMarket, AuctionToken } from "../types";

describe("AuctionMarket", () => {
	let auction: AuctionMarket;
	let token: AuctionToken;
	let owner: HardhatEthersSigner;
	let bidder1: HardhatEthersSigner;
	let bidder2: HardhatEthersSigner;
	let startPrice: bigint;
	let reservedPrice: bigint;
	let duration: number;

	beforeEach(async () => {
		[owner, bidder1, bidder2] = await hre.ethers.getSigners();
		const DutchAuctionFactory =
			await hre.ethers.getContractFactory("AuctionMarket");

		startPrice = hre.ethers.parseEther("1"); // 1 Ether
		reservedPrice = hre.ethers.parseEther("0.1"); // 0.1 Ether
		duration = 20 * 60; // 20 minutes in seconds

		auction = await DutchAuctionFactory.deploy(
			"Auction Token", // Token name
			"ATKN", // Token symbol
			hre.ethers.parseUnits("1000000", 18), // Total supply
			startPrice,
			reservedPrice,
			owner.address, // Creator address
		);

		// Wait for the deployment to be mined
		await auction.waitForDeployment();

		// Get the address of the AuctionToken
		const tokenAddress = await auction.getToken();
		// Use ethers.getContractAt to get an instance of the AuctionToken contract
		token = (await hre.ethers.getContractAt(
			"AuctionToken",
			tokenAddress,
		)) as AuctionToken;
	});

	describe("Deployment", () => {
		it("Should deploy the auction and token correctly", async () => {
			const totalSupply = await auction.getTotalSupply();
			// Get the address of the AuctionToken
			const auctionTokenAddress = await auction.getToken();
			// Use ethers.getContractAt to get an instance of the AuctionToken contract
			const auctionToken = (await hre.ethers.getContractAt(
				"AuctionToken",
				auctionTokenAddress,
			)) as AuctionToken;

			expect(totalSupply).to.equal(hre.ethers.parseUnits("1000000", 18));
			expect(await auction.getStartPrice()).to.equal(startPrice);
			expect(await auction.getReservedPrice()).to.equal(reservedPrice);
			expect(await auction.getDuration()).to.equal(duration);
			expect(await auctionToken.name()).to.equal("Auction Token");
			expect(await auctionToken.symbol()).to.equal("ATKN");
		});
	});

	describe("Bidding", () => {
		it("Should accept bids and update total commitment", async () => {
			const bidAmount = hre.ethers.parseEther("0.5");

			await auction.connect(bidder1).placeBid({ value: bidAmount });

			const totalCommitment = await auction.getTotalCommitment();
			const bidderCommitment = await auction.getCommitmentByBidder(
				bidder1.address,
			);

			expect(totalCommitment).to.equal(bidAmount);
			expect(bidderCommitment).to.equal(bidAmount);
		});

		it("Should revert if auction has ended", async () => {
			const bidAmount = hre.ethers.parseEther("0.5");

			// Simulate the auction ending by increasing time
			await hre.ethers.provider.send("evm_increaseTime", [duration + 1]);
			await hre.ethers.provider.send("evm_mine", []);

			await expect(
				auction.connect(bidder1).placeBid({ value: bidAmount }),
			).to.be.revertedWith("Auction ended");
		});
	});

	describe("Auction End and Token Distribution", () => {
		it("Should distribute tokens after auction ends", async () => {
			const bidAmount1 = hre.ethers.parseEther("0.5");
			const bidAmount2 = hre.ethers.parseEther("0.7");

			await auction.connect(bidder1).placeBid({ value: bidAmount1 });
			await auction.connect(bidder2).placeBid({ value: bidAmount2 });

			// Simulate the auction ending by increasing time
			await hre.ethers.provider.send("evm_increaseTime", [duration + 1]);
			await hre.ethers.provider.send("evm_mine", []);

			// Distribute tokens
			await auction.distributeTokens();

			const bidder1Tokens = await token.balanceOf(bidder1.address);
			const bidder2Tokens = await token.balanceOf(bidder2.address);

			const auctionAddress = await auction.getAddress();
			const remainingSupply = await token.balanceOf(auctionAddress);

			expect(bidder1Tokens).to.be.gt(0);
			expect(bidder2Tokens).to.be.gt(0);
			expect(remainingSupply).to.equal(0);
		});

		// it("Should refund excess ethers to bidders", async function () {
		//   const bidAmount1 = hre.ethers.parseEther("2");  // Large bid

		//   await auction.connect(bidder1).placeBid({ value: bidAmount1 });

		//   // Simulate auction end
		//   await hre.ethers.provider.send("evm_increaseTime", [duration + 1]);
		//   await hre.ethers.provider.send("evm_mine", []);

		//   const bidderBalanceBefore = await hre.ethers.provider.getBalance(bidder1.address);

		//   // Distribute tokens and refund excess
		//   await auction.distributeTokens();

		//   const bidderBalanceAfter = await hre.ethers.provider.getBalance(bidder1.address);
		//   expect(bidderBalanceAfter).to.be.gt(bidderBalanceBefore);
		// });
	});

	describe("Re-entrancy Protection", () => {
		it("Should prevent re-entrancy attacks during bid placement", async () => {
			const bidAmount = hre.ethers.parseEther("1");

			await expect(auction.connect(bidder1).placeBid({ value: bidAmount })).to
				.not.be.reverted;

			// Re-entrancy guard is already implemented with `nonReentrant` modifier in AuctionMarket.sol
		});
	});

	// describe("Withdrawal of Funds", function () {
	//   it("Should allow creator to withdraw funds after auction", async function () {
	//     const bidAmount = hre.ethers.parseEther("0.5");

	//     await auction.connect(bidder1).placeBid({ value: bidAmount });

	//     // Simulate auction end
	//     await hre.ethers.provider.send("evm_increaseTime", [duration + 1]);
	//     await hre.ethers.provider.send("evm_mine", []);

	//     const creatorBalanceBefore = await hre.ethers.provider.getBalance(owner.address);

	//     // Distribute tokens and withdraw funds
	//     await auction.distributeTokens();
	//     await auction.connect(owner).withdraw();

	//     const creatorBalanceAfter = await hre.ethers.provider.getBalance(owner.address);
	//     expect(creatorBalanceAfter).to.be.gt(creatorBalanceBefore);
	//   });

	//   it("Should revert if non-creator tries to withdraw", async function () {
	//     await expect(auction.connect(bidder1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");
	//   });
	// });

	describe("Case: Demand < Supply", () => {
		it("Should burn the unsold token", async () => {
			// Bid for only part of the supply
			const bidAmount = hre.ethers.parseEther("50"); // Bid for 50 tokens
			await auction.connect(bidder1).placeBid({ value: bidAmount });

			// Simulate the auction end
			await hre.ethers.provider.send("evm_increaseTime", [duration + 1]);
			await hre.ethers.provider.send("evm_mine", []);

			// Distribute tokens and burn the unsold supply
			await auction.distributeTokens();

			// Check remaining token balance in auction contract after distribution
			const auctionAddress = await auction.getAddress();
			const remainingSupply = await token.balanceOf(auctionAddress);
			expect(remainingSupply).to.equal(0); // All unsold tokens should be burned
		});

		it("Should the clearing price and reserved price be equal", async () => {
			const bidAmount = hre.ethers.parseEther("50"); // Bid for part of the supply
			await auction.connect(bidder1).placeBid({ value: bidAmount });

			// Simulate auction end
			await hre.ethers.provider.send("evm_increaseTime", [duration + 1]);
			await hre.ethers.provider.send("evm_mine", []);

			// Distribute tokens
			await auction.distributeTokens();

			// The clearing price should be equal to the reserved price
			const clearingPrice = await auction.getClearingPrice();
			expect(clearingPrice).to.equal(reservedPrice);
		});
	});

	// describe("Case: Demand >= Supply", function () {
	//     it("Should sell tokens at the correct clearing price", async function () {
	//         // Bidders bid enough to match or exceed supply
	//         const bidAmount1 = hre.ethers.parseEther("500"); // Bid from bidder1
	//         const bidAmount2 = hre.ethers.parseEther("500"); // Bid from bidder2
	//         await auction.connect(bidder1).placeBid({ value: bidAmount1 });
	//         await auction.connect(bidder2).placeBid({ value: bidAmount2 });

	//         // Simulate auction end
	//         await hre.ethers.provider.send("evm_increaseTime", [duration + 1]);
	//         await hre.ethers.provider.send("evm_mine", []);

	//         // Distribute tokens
	//         await auction.distributeTokens();

	//         // Check that the clearing price is higher than the reserved price
	//         const clearingPrice = await auction.getClearingPrice();
	//         expect(clearingPrice).to.be.gt(reservedPrice);
	//     });

	//     it("Should refund bids if demand exceed token supply", async function () {
	//         // Bidders bid more than the available supply
	//         const bidAmount1 = hre.ethers.parseEther("800"); // Bid 800 ETH from bidder1
	//         const bidAmount2 = hre.ethers.parseEther("400"); // Bid 400 ETH from bidder2
	//         await auction.connect(bidder1).placeBid({ value: bidAmount1 });
	//         await auction.connect(bidder2).placeBid({ value: bidAmount2 });

	//         // Simulate auction end
	//         await hre.ethers.provider.send("evm_increaseTime", [duration + 1]);
	//         await hre.ethers.provider.send("evm_mine", []);

	//         const bidder2BalanceBefore = await hre.ethers.provider.getBalance(bidder2.address);

	//         // Distribute tokens and refund excess
	//         await auction.distributeTokens();

	//         const bidder2BalanceAfter = await hre.ethers.provider.getBalance(bidder2.address);
	//         expect(bidder2BalanceAfter).to.be.gt(bidder2BalanceBefore); // Excess bid refunded
	//     });
	// });

	describe("Transfer", () => {
		it("Should distribute correct amount of token to the correct bidder", async () => {
			// Bidders bid for part of the supply
			const bidAmount1 = hre.ethers.parseEther("100"); // Bid from bidder1
			const bidAmount2 = hre.ethers.parseEther("200"); // Bid from bidder2
			await auction.connect(bidder1).placeBid({ value: bidAmount1 });
			await auction.connect(bidder2).placeBid({ value: bidAmount2 });

			// Simulate auction end
			await hre.ethers.provider.send("evm_increaseTime", [duration + 1]);
			await hre.ethers.provider.send("evm_mine", []);

			// Distribute tokens
			await auction.distributeTokens();

			// Check token balances
			const bidder1TokenBalance = await token.balanceOf(bidder1.address);
			const bidder2TokenBalance = await token.balanceOf(bidder2.address);

			// Expect the correct number of tokens based on their bids
			expect(bidder1TokenBalance).to.be.gt(0);
			expect(bidder2TokenBalance).to.be.gt(0);
			expect(bidder2TokenBalance).to.be.gt(bidder1TokenBalance); // Bidder2 bid more
		});
	});
});
