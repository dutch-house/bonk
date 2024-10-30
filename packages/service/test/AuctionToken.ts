import { expect } from "chai";
import { ethers } from "hardhat";
import hre from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import type { AuctionToken } from "../types";

describe("AuctionToken", () => {
	let auctionToken: AuctionToken;
	let owner: HardhatEthersSigner;
	let addr1: HardhatEthersSigner;
	let addr2: HardhatEthersSigner;

	const initialSupply = hre.ethers.parseUnits("1000000", 18); // 1 million tokens with 18 decimals

	beforeEach(async () => {
		// Get the signers
		[owner, addr1, addr2] = await ethers.getSigners();

		// Deploy the AuctionToken contract
		const AuctionTokenFactory = await ethers.getContractFactory("AuctionToken");
		auctionToken = (await AuctionTokenFactory.deploy(
			"Auction Token",
			"ATKN",
			initialSupply,
		)) as AuctionToken;

		// Wait for the deployment to be mined
		await auctionToken.waitForDeployment();
	});

	describe("Deployment", () => {
		it("Should have the correct name, symbol, and decimals", async () => {
			expect(await auctionToken.name()).to.equal("Auction Token");
			expect(await auctionToken.symbol()).to.equal("ATKN");
			expect(await auctionToken.decimals()).to.equal(18);
		});

		it("Should deploy the contract with the correct initial supply", async () => {
			expect(await auctionToken.totalSupply()).to.equal(initialSupply);
			expect(await auctionToken.balanceOf(owner.address)).to.equal(
				initialSupply,
			);
		});

		it("Should assign the total supply to the owner", async () => {
			const ownerBalance = await auctionToken.balanceOf(owner.address);
			expect(await auctionToken.totalSupply()).to.equal(initialSupply);
			expect(ownerBalance).to.equal(initialSupply);
		});
	});

	describe("Withdrawals", () => {
		it("Should transfer tokens between accounts", async () => {
			// Transfer 1000 tokens from owner to addr1
			const transferAmount = hre.ethers.parseUnits("1000", 18);
			await auctionToken.transfer(addr1.address, transferAmount);

			const addr1Balance = await auctionToken.balanceOf(addr1.address);
			expect(addr1Balance).to.equal(transferAmount);

			const ownerBalance = await auctionToken.balanceOf(owner.address);
			expect(ownerBalance).to.equal(initialSupply - transferAmount);
		});

		it("Should fail if sender doesn’t have enough tokens", async () => {
			const initialOwnerBalance = await auctionToken.balanceOf(owner.address);

			// Try to send 1 token from addr1 (0 tokens) to owner.
			// `addr1` has no tokens, so this should revert with custom error.
			await expect(
				auctionToken
					.connect(addr1)
					.transfer(owner.address, hre.ethers.parseUnits("1", 18)),
			).to.be.revertedWithCustomError(auctionToken, "ERC20InsufficientBalance");

			// Owner balance should not have changed.
			expect(await auctionToken.balanceOf(owner.address)).to.equal(
				initialOwnerBalance,
			);
		});

		it("Should update allowances and transfer tokens via transferFrom", async () => {
			const approveAmount = hre.ethers.parseUnits("500", 18);
			const transferAmount = hre.ethers.parseUnits("200", 18);

			// Owner approves addr1 to spend 500 tokens on their behalf
			await auctionToken.approve(addr1.address, approveAmount);

			// Addr1 transfers 200 tokens from owner to addr2
			await auctionToken
				.connect(addr1)
				.transferFrom(owner.address, addr2.address, transferAmount);

			const addr2Balance = await auctionToken.balanceOf(addr2.address);
			expect(addr2Balance).to.equal(transferAmount);

			const remainingAllowance = await auctionToken.allowance(
				owner.address,
				addr1.address,
			);
			expect(remainingAllowance).to.equal(approveAmount - transferAmount);
		});

		it("Should burn tokens correctly", async () => {
			const burnAmount = hre.ethers.parseUnits("1000", 18);

			// Burn tokens from owner's account
			await auctionToken.burn(burnAmount);

			const ownerBalance = await auctionToken.balanceOf(owner.address);
			const totalSupply = await auctionToken.totalSupply();

			expect(ownerBalance).to.equal(initialSupply - burnAmount);
			expect(totalSupply).to.equal(initialSupply - burnAmount);
		});

		it("Should fail to burn more tokens than the balance", async () => {
			const burnAmount = initialSupply + hre.ethers.parseUnits("1", 18); // More than total supply

			// Attempt to burn more tokens than are in the owner's account
			await expect(auctionToken.burn(burnAmount)).to.be.revertedWithCustomError(
				auctionToken,
				"ERC20InsufficientBalance",
			);
		});
	});
});
