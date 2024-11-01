import Wallet from "@/components/layouts/wallet";
import AuctionCreate from "@/components/modules/auction/auction.create";
import AuctionsGrid from "@/components/modules/auction/auctions.grid";
import { useReadAuctionInitiatorGetAuctionsByCreator } from "@/wagmi.gen";
import Button from "@bonk/ui/components/ui/button";
import { cn } from "@bonk/ui/utils/dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

export const Route = createFileRoute("/auctions/manage")({
	component: ManageAuctionsPage,
	loader: () => ({
		title: "Manage Auctions",
	}),
});

function ManageAuctionsPage() {
	//#startregion  //*======== WALLET ===========
	const { address: account, isConnected } = useAccount();
	//#endregion  //*======== WALLET ===========

	//#startregion  //*======== CLIENT ===========
	const {
		data = [],
		refetch,
		isLoading,
	} = useReadAuctionInitiatorGetAuctionsByCreator({
		args: account && [account],
		query: {
			enabled: isConnected && !!account,
		},
	});
	//#endregion  //*======== CLIENT ===========

	return (
		<main className={cn("page-container", "flex flex-col gap-16", "mt-8")}>
			<section className="space-y-6">
				<motion.header
					variants={{
						hidden: {
							opacity: 0,
							scale: 1.5,
						},
						visible: {
							opacity: 1,
							scale: 1,
							transition: {
								staggerChildren: 0.09,
							},
						},
					}}
					initial="hidden"
					animate={"visible"}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className={cn(
						"relative",
						"flex flex-col gap-2",
						"sm:flex-row flex-wrap sm:place-items-center sm:place-content-between",
					)}
				>
					<h1 className="text-3xl text-pretty truncate flex-1">
						Manage Auctions
					</h1>

					<aside
						className={cn(
							"flex flex-row flex-wrap place-items-center gap-x-2",
							"place-content-between sm:place-content-end",
						)}
					>
						<AuctionCreate className="max-sm:flex-1" />

						<Button
							onClick={() => refetch()}
							disabled={isLoading || !isConnected}
							className="capitalize space-x-2 group"
							variant="ghost"
						>
							<ReloadIcon
								className={cn("size-4", "group-hover:animate-spin")}
							/>
							<span className="sr-only sm:not-sr-only">refresh</span>
						</Button>
					</aside>
				</motion.header>

				{isConnected && <AuctionsGrid auctions={data} />}
				{!isConnected && <Wallet.Required />}
			</section>
		</main>
	);
}
