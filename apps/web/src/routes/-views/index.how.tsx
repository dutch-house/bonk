import { CHAIN_DENOM, DEFINITIONS } from "@/data/clients/bonk/constants";
import AnimateFade from "@bonk/ui/components/flairs/animate.fade";
import Button from "@bonk/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@bonk/ui/components/ui/card";
import { Progress } from "@bonk/ui/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@bonk/ui/components/ui/tooltip";
import { cn } from "@bonk/ui/utils/dom";
import { motion } from "framer-motion";
import { ClockIcon, TrendingDownIcon, TrophyIcon } from "lucide-react";
import { useState } from "react";

const steps = [
	{
		title: "Set Starting Price",
		description: "The auction begins with a high starting price.",
		icon: ClockIcon,
	},
	{
		title: "Price Decreases",
		description: "As time passes, the price continues to drop.",
		icon: TrendingDownIcon,
	},
	{
		title: "First Bid Wins",
		description:
			"The first bidder to accept the current price wins the auction.",
		icon: TrophyIcon,
	},
];

export default function How() {
	//#startregion  //*======== STATES ===========
	const [step, setStep] = useState<number>(0);
	const [price, setPrice] = useState<number>(100);
	//#endregion  //*======== STATES ===========

	const onStep = (step: number) => {
		if (step < 2) {
			setStep(step + 1);
			setPrice(Math.max(step - 25, 25));
		} else {
			setStep(0);
			setPrice(100);
		}
	};

	return (
		<AnimateFade
			delay={0.25}
			inView
			className={cn(
				"content-container relative",
				"flex flex-col place-content-center place-items-center gap-8",
			)}
		>
			<motion.h2
				initial="hidden"
				animate="visible"
				transition={{ duration: 1, ease: "easeInOut", staggerChildren: 0.09 }}
				variants={{
					hidden: { filter: "blur(10px)", opacity: 0 },
					visible: { filter: "blur(0px)", opacity: 1 },
				}}
				className={cn(
					"text-pretty font-bold leading-none tracking-tighter text-center",
					"text-4xl",
					"bg-gradient-to-br text-transparent bg-gradient-stop bg-clip-text",
					"dark:from-white dark:via-white dark:via-30% dark:to-white/30",
					"from-black via-black via-30% to-black/30",
				)}
			>
				How Dutch Auctions Work
			</motion.h2>

			<section className="grid md:grid-cols-2 gap-12 items-center">
				<div className="space-y-8">
					{steps.map((guide, index) => (
						<Card
							key={`guide-${guide.title}`}
							onClick={() => onStep(index - 1)}
							className={`transition-all duration-300 ${step === index ? "border-primary shadow-lg" : "opacity-50"}`}
						>
							<CardContent className="p-6 flex items-start space-x-4">
								<guide.icon className="size-8 text-primary shrink-0" />
								<div>
									<h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
									<p className="text-muted-foreground">{guide.description}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<Card className="relative">
					<motion.div
						className="size-3/5 bg-primary/50 aspect-square blur-xl absolute -z-10"
						animate={{
							top: ["-1rem", "-1rem", "1rem", "1rem", "-1rem"],
							left: ["-1rem", "1rem", "1rem", "-1rem", "-1rem"],
							scale: [1, 1, 1],
						}}
						transition={{
							duration: 6,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "mirror",
						}}
					/>
					<motion.div
						className="size-3/5 bg-primary/50 aspect-square blur-xl absolute -z-10"
						animate={{
							bottom: ["-1rem", "-1rem", "1rem", "1rem", "-1rem"],
							right: ["-1rem", "1rem", "1rem", "-1rem", "-1rem"],
							scale: [1, 1, 1],
						}}
						transition={{
							duration: 6,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "mirror",
						}}
					/>
					<CardHeader>
						<CardTitle>Auction Simulation</CardTitle>
						<CardDescription>
							Watch how the price changes as the auction progresses
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col place-items-center place-content-center gap-4">
						<div className="flex flex-row place-items-center place gap-x-6 gap-y-4">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger className="text-start text-sm font-medium text-muted-foreground capitalize underline-offset-4 underline decoration-dotted hover:decoration-solid decoration-muted-foreground cursor-help">
										Current Price
									</TooltipTrigger>
									<TooltipContent className="max-w-80 text-pretty normal-case">
										{DEFINITIONS["Current Price"]}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<p className="text-5xl font-bold text-primary text-center">
								{price}
								&nbsp;
								<span className="text-xs text-muted-foreground">
									{CHAIN_DENOM}
								</span>
							</p>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							size="default"
							onClick={() => onStep(step)}
							className="w-full relative"
						>
							<span>{step < 2 ? "Advance Time" : "Reset Auction"}</span>

							<Progress
								value={((step + 1) / steps.length) * 100}
								className={cn(
									"absolute bottom-0 inset-x-0 z-30 h-1 bg-background/20",
								)}
								indicator={{
									className: "bg-background/50",
								}}
							/>
						</Button>
					</CardFooter>
				</Card>
			</section>
		</AnimateFade>
	);
}
