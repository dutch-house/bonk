import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox-viem";
import "tsconfig-paths/register";
import "@typechain/hardhat";

import type { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
	solidity: {
		version: "0.8.27",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		hardhat: {
			chainId: 1337,
			loggingEnabled: true,
		},
		// //? ref: https://docs.alchemy.com/docs/how-to-deploy-a-smart-contract-to-the-sepolia-testnet
		// sepolia: {
		// 	url: `${process.env.SEPOLIA_GATEWAY_URL}`,
		// 	accounts: [`${process.env.SEPOLIA_PRIVATE_KEY}`],
		// },
	},
	typechain: {
		outDir: "types",
		target: "ethers-v6",
	},
};

export default config;
