import AuctionCreate from "@/components/modules/auction/auction.create";
import AuctionsGrid from "@/components/modules/auction/auctions.grid";
import { useReadAuctionInitiatorGetAllAuctions } from "@/wagmi.gen";
import Button from "@bonk/ui/components/ui/button";
import { cn } from "@bonk/ui/utils/dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/auctions/")({
	component: AuctionsPage,
	loader: () => ({
		title: "All Auctions",
	}),
});

function AuctionsPage() {
	//#startregion  //*======== CLIENT ===========
	const {
		data = [],
		refetch,
		isLoading,
	} = useReadAuctionInitiatorGetAllAuctions();
	//#endregion  //*======== CLIENT ===========

	return (
		<main className={cn("page-container", "flex flex-col gap-16", "mt-8")}>
			<section className="space-y-8">
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
					<h1
						className={cn(
							"text-pretty font-black leading-none tracking-tighter",
							"text-4xl",
							"bg-gradient-to-br text-transparent bg-gradient-stop bg-clip-text",
							"dark:from-white dark:via-white dark:via-30% dark:to-white/30",
							"from-black via-black via-30% to-black/30",
						)}
					>
						Auctions
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
							disabled={isLoading}
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

				<AuctionsGrid auctions={data}>
					{!isLoading && !data.length && <AuctionsGrid.Empty />}
				</AuctionsGrid>
			</section>
		</main>
	);
}
