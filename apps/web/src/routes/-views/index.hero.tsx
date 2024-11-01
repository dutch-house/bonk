import TextGradient from "@bonk/ui/components/flairs/text.gradient";
import Button from "@bonk/ui/components/ui/button";
import { cn } from "@bonk/ui/utils/dom";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SparkleIcon } from "lucide-react";

const Hero = () => {
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
			transition={{ duration: 0.3, ease: "easeInesOut" }}
			className={cn(
				"min-h-[50dvh] relative",
				"flex flex-col place-content-center place-items-center gap-8",
			)}
		>
			<div className="group/header flex flex-col place-content-center place-items-center gap-2">
				<TextGradient className="gap-x-1.5">
					<SparkleIcon className="size-4 text-[#ffaa40]" />
					<span
						className={cn(
							"inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent",
							"animate-gradient",
						)}
					>
						A New Era of Auctions Begins
					</span>
				</TextGradient>

				<header className="relative">
					<h1
						className={cn(
							"text-pretty font-bold leading-none tracking-tighter text-center",
							"text-5xl sm:text-6xl",
							"bg-gradient-to-br text-transparent bg-gradient-stop bg-clip-text",
							"dark:from-white dark:via-white dark:via-30% dark:to-white/30",
							"from-black via-black via-30% to-black/30",
						)}
					>
						Bid, Bond, Bonk
					</h1>
				</header>

				<p
					className={cn(
						"text-lg",
						"w-11/12 max-w-prose",
						"text-center leading-snug text-balance whitespace-break-spaces font-medium",
						"bg-gradient-to-br text-transparent bg-gradient-stop bg-clip-text",
						"dark:from-white/70 dark:via-white/70 dark:via-40% dark:to-white/30",
						"from-black/70 via-black/70 via-40% to-black/30",
					)}
				>
					Secure, transparent, and fair decentralized auctions. Your gateway to
					a new era of digital ownership.
				</p>
			</div>

			<Link to="/auctions">
				<Button className="space-x-1 group" size={"lg"}>
					<span>Start bidding now</span>
					<ArrowRightIcon className="size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
				</Button>
			</Link>
		</motion.section>
	);
};

export default Hero;
