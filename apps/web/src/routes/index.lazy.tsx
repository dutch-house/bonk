import { cn } from "@bonk/ui/utils/dom";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const { isConnected, chain, address, chainId } = useAccount();

	return (
		<main className={cn("page-container", "flex flex-col gap-16", "mt-8")}>
			<h1>WIP</h1>

			<section>
				<p>Connected: {isConnected ? "T" : "F"}</p>
				<p>Address: {address}</p>
				<p>
					Chain: {chain?.name} | {chainId}
				</p>
			</section>
		</main>
	);
}
