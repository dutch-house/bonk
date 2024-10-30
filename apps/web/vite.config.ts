import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/

export default ({ mode }: { mode: string }) => {
	// Load app-level env vars to node-level env vars.
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return defineConfig({
		plugins: [react(), TanStackRouterVite()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"~": path.resolve(__dirname, "./public"),
			},
		},
	});
};
