import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

const Client = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
	},
});

const QueryProvider = ({ children }: PropsWithChildren) => {
	return <QueryClientProvider client={Client}>{children}</QueryClientProvider>;
};

export default QueryProvider;
