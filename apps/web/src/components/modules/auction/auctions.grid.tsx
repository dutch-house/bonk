import { cn } from "@bonk/ui/utils/dom";
import { type HTMLMotionProps, motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import type { Address } from "viem";
import AuctionCard from "./auction.card";

type AuctionsGrid = PropsWithChildren &
	HTMLMotionProps<"section"> & {
		auctions: Address[];
	};
export const AuctionsGrid = ({
	auctions = [],
	className,
	children,
	...props
}: AuctionsGrid) => {
	// if (!auctions.length) return null;
	return (
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
				"relative",
				"grid grid-flow-row-dense auto-rows-fr gap-2",
				"grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-flow-rows-dense xl:auto-rows-fr",
				className,
			)}
			{...props}
		>
			{!!auctions.length &&
				auctions.map((address) => (
					<AuctionCard
						address={address}
						key={`auction-${address}`}
						className={cn("*:p-4 *:space-y-0 *:!text-xs")}
					/>
				))}
			{!auctions.length &&
				Array.from({ length: 6 }, (_, idx) => idx).map((id) => (
					<AuctionCard
						key={`auction-${id}`}
						className={cn(
							"*:p-4 *:space-y-0 *:!text-xs",
							id > 1 && "max-sm:hidden",
							id > 3 && "max-md:hidden",
						)}
					/>
				))}
			{children}
		</motion.section>
	);
};

export default AuctionsGrid;
