import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]),
	},
	clientPrefix: "VITE_",
	client: {
		// FLAGS
		VITE_FLAG_DOWN: z
			.string()
			/** @external https://env.t3.gg/docs/recipes#booleans */
			.transform((s) => s !== "false" && s !== "0")
			.pipe(z.boolean().default(false)),
		VITE_FLAG_BETA: z
			.string()
			/** @external https://env.t3.gg/docs/recipes#booleans */
			.transform((s) => s !== "false" && s !== "0")
			.pipe(z.boolean().default(false)),

		// ALCHEMY
		VITE_ALCHEMY_API_KEY: z.string().min(1),

		// BONK
		VITE_BONK_AUCTION_INITIATOR_ADDRESS: z
			.string()
			.trim()
			.min(1)
			.transform((v) => `0x${v}`),
	},
	runtimeEnv: import.meta.env,

	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
	 * This is especially useful for Docker builds.
	 */
	skipValidation: !!import.meta.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
