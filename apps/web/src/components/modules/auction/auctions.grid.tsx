import { cn } from "@bonk/ui/utils/dom";
import { type HTMLMotionProps, motion } from "framer-motion";
import { BadgeHelpIcon } from "lucide-react";
import type { HTMLAttributes, PropsWithChildren } from "react";
import type { Address } from "viem";
import AuctionCard from "./auction.card";
import AuctionCreate from "./auction.create";

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

type AuctionsEmpty = HTMLAttributes<HTMLDivElement>;
const AuctionsEmpty = ({ className, children, ...props }: AuctionsEmpty) => {
	return (
		<div
			className={cn(
				"transition-all",
				"bg-background/50 backdrop-blur-sm",
				"absolute inset-0 z-30",

				"flex flex-col place-items-center md:place-content-center gap-y-4 py-8",
				className,
			)}
			{...props}
		>
			<div
				className={cn(
					"bg-primary/10 rounded-full",
					"size-12",
					"flex place-items-center place-content-center",
				)}
			>
				<BadgeHelpIcon className="text-primary size-6" />
			</div>

			<h3
				className={cn(
					"text-2xl font-bold leading-none tracking-tight text-balance whitespace-break-spaces text-center",
				)}
			>
				Huh, it seems empty here.
			</h3>

			<p className="text-sm text-gray-500 mb-4 text-center text-balance whitespace-break-spaces max-w-prose max-sm:px-6 sm:w-9/12">
				There's nothing listed yet. Create one to kick things off.
			</p>

			<AuctionCreate className="max-w-sm w-10/12" />

			{children}
		</div>
	);
};
AuctionsGrid.Empty = AuctionsEmpty;
