import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@bonk/ui/components/ui/card";
import { cn } from "@bonk/ui/utils/dom";
import { motion } from "framer-motion";
import { Clock, Coins, TrendingDown } from "lucide-react";

export default function How() {
	return (
		<motion.section
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
				"min-h-[50dvh] relative",
				"flex flex-col place-content-center place-items-center gap-8",
			)}
		>
			<h2
				className={cn(
					"text-pretty font-bold leading-none tracking-tighter text-center",
					"text-4xl",
					"bg-gradient-to-br text-transparent bg-gradient-stop bg-clip-text",
					"dark:from-white dark:via-white dark:via-30% dark:to-white/30",
					"from-black via-black via-30% to-black/30",
				)}
			>
				How Dutch Auctions Work
			</h2>
			<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingDown className="size-6 text-primary" />
							<span className="font-bold">1. Set Starting Price</span>
						</CardTitle>
						<CardDescription className="text-base">
							The auction begins with a high starting price that gradually
							decreases over time.
						</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="size-6 text-primary" />
							<span className="font-bold">2. Price Decreases</span>
						</CardTitle>
						<CardDescription className="text-base">
							As time passes, the price continues to drop until a buyer decides
							to make a purchase.
						</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Coins className="size-6 text-primary" />
							<span className="font-bold">3. First Bid Wins</span>
						</CardTitle>
						<CardDescription className="text-base">
							The first bidder to accept the current price wins the auction and
							purchases the item.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		</motion.section>
	);
}
