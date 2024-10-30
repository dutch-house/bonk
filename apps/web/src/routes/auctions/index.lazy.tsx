import AuctionCard from "@/components/modules/auction/auction.card";
import AuctionCreate from "@/components/modules/auction/auction.create";
import { useReadAuctionInitiatorGetAllAuctions } from "@/wagmi.gen";
import Button from "@bonk/ui/components/ui/button";
import { cn } from "@bonk/ui/utils/dom";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createLazyFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createLazyFileRoute("/auctions/")({
	component: AuctionsPage,
});

function AuctionsPage() {
	//#startregion  //*======== CLIENT ===========
	const {
		data: auctions = [],
		refetch,
		isLoading,
	} = useReadAuctionInitiatorGetAllAuctions();
	//#endregion  //*======== CLIENT ===========

	return (
		<main className={cn("page-container", "flex flex-col gap-16", "mt-8")}>
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
				className={cn("relative flex flex-col gap-2")}
			>
				<h1 className="h1 text-3xl text-pretty truncate">Auctions</h1>
			</motion.header>

			<section>
				<AuctionCreate />

				<Button
					onClick={() => refetch()}
					disabled={isLoading}
					className="capitalize space-x-2"
					variant="secondary"
				>
					<ReloadIcon className="size-4" />
					<span className="sr-only sm:not-sr-only">refresh</span>
				</Button>
			</section>

			<motion.section
				variants={{
					hidden: { y: "100%", opacity: 0 },
					visible: {
						y: "0%",
						opacity: 1,
						transition: {
							staggerChildren: 0.09,
						},
					},
					exit: { y: "100%", opacity: 0 },
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				initial="hidden"
				animate="visible"
				exit="exit"
				className={cn(
					"grid grid-flow-row-dense auto-rows-fr gap-2",
					"grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-flow-rows-dense xl:auto-rows-fr",
				)}
			>
				{auctions.map((address) => (
					<AuctionCard
						auction={address}
						key={`auction-${address}`}
						className={cn("*:p-4 *:space-y-0 *:!text-xs")}
					/>
				))}
			</motion.section>
		</main>
	);
}
