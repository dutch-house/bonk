import "@/styles/globals.css";

import ReduxProvider from "@/components/providers/redux";
import RouterProvider from "@/components/providers/router";
import ThemeProvider from "@/components/providers/theme";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import QueryProvider from "./components/providers/query";
import WagmiProvider from "./components/providers/wagmi";

// Render the app
// biome-ignore lint/style/noNonNullAssertion: default
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<ReduxProvider>
				<ThemeProvider>
					<HelmetProvider>
						<WagmiProvider>
							<QueryProvider>
								<RouterProvider />
							</QueryProvider>
						</WagmiProvider>
					</HelmetProvider>
				</ThemeProvider>
			</ReduxProvider>
		</StrictMode>,
	);
}
