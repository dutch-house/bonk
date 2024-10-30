import { type ContractConfig, defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import type { Address } from "viem/accounts";

import AuctionInitiatorAbi from "@bonk/service/contracts/AuctionInitiator.sol/AuctionInitiator.json" with {
	type: "json",
};
import AuctionMarketAbi from "@bonk/service/contracts/AuctionMarket.sol/AuctionMarket.json" with {
	type: "json",
};
import AuctionTokenAbi from "@bonk/service/contracts/AuctionToken.sol/AuctionToken.json" with {
	type: "json",
};

export default defineConfig({
	out: "src/wagmi.gen.ts",
	contracts: [
		{
			name: "auctionInitiator",
			abi: (AuctionInitiatorAbi as unknown as ContractConfig).abi,
			address:
				`0x${process.env.VITE_BONK_AUCTION_INITIATOR_ADDRESS}` as Address,
		},
		{
			name: "auctionMarket",
			abi: (AuctionMarketAbi as unknown as ContractConfig).abi,
		},
		{
			name: "auctionToken",
			abi: (AuctionTokenAbi as unknown as ContractConfig).abi,
		},
	],
	plugins: [react()],
});
