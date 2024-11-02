import { zeroAddress } from "viem";
import type { Address } from "viem";
import { z } from "zod";

export const zAddress = z
	.string()
	.startsWith("0x")
	.default(zeroAddress)
	.pipe(z.custom<Address>());

export const AuctionStatus = z.enum([
	"ended",
	"ongoing",
	"finalising",
	"created",
]);
export type AuctionStatus = z.infer<typeof AuctionStatus>;

export const Auction = z.object({
	startPrice: z.bigint().positive().default(0n).optional(),
	reservedPrice: z.bigint().positive().default(0n).optional(),
	tokensDistributed: z.boolean().default(false).optional(),

	address: zAddress,
	creatorAddress: zAddress,
	tokenAddress: zAddress,
	tokenName: z.string().trim().default(""),
	tokenSymbol: z.string().trim().toUpperCase().default(""),
	status: AuctionStatus.default("created"),
});
export type Auction = z.infer<typeof Auction>;

// * =====================================
// * AUCTION/REQUESTS

export const CreateAuctionRequest = z.object({
	name: z.string().trim().min(1).max(10),
	symbol: z.string().trim().toUpperCase().min(3).max(5),
	totalSupply: z.coerce
		.number()
		.int()
		.positive("Total supply must be greater than zero")
		.min(10)
		.default(1000),
	startPrice: z.coerce.number().positive().default(1),
	reservedPrice: z.coerce.number().positive().default(0.5),
});
export type CreateAuctionRequest = z.infer<typeof CreateAuctionRequest>;
