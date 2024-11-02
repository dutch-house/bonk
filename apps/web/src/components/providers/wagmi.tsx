import { env } from "@/env";
import type { PropsWithChildren } from "react";
import { http, createPublicClient, createTestClient, fallback } from "viem";
import { WagmiProvider as Wagmi, type WagmiProviderProps } from "wagmi";

import { createConfig } from "wagmi";
import { localhost, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, metaMask } from "wagmi/connectors";

const SepoliaClient = createPublicClient({
	chain: sepolia,
	transport: http(
		`https://eth-sepolia.g.alchemy.com/v2/${env.VITE_ALCHEMY_API_KEY}`,
	),
});

const LocalhostClient = createTestClient({
	chain: localhost,
	mode: "hardhat",
	transport: fallback([
		http("http://0.0.0.0:8545"),
		http("http://127.0.0.1:8545"),
	]),
});

export const WagmiConfig = createConfig({
	syncConnectedChain: true,
	chains: [sepolia, localhost],
	client: ({ chain }) => {
		switch (chain.id) {
			case sepolia.id:
				return SepoliaClient;
			default:
				return LocalhostClient;
		}
	},
	connectors: [
		metaMask({
			dappMetadata: {
				name: "bonk",
			},
			preferDesktop: true,
			shouldShimWeb3: true,
		}),
		coinbaseWallet({
			appName: "bonk",
		}),
		injected({
			shimDisconnect: true,
		}),
	],
});

type WagmiProvider = PropsWithChildren<WagmiProviderProps>;
export const WagmiProvider = ({
	children,
	config = WagmiConfig,
	...props
}: WagmiProvider) => (
	<Wagmi config={config} {...props}>
		{children}
	</Wagmi>
);
export default WagmiProvider;
