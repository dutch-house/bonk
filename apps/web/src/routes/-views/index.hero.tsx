import BackgroundRipple from "@bonk/ui/components/flairs/background.ripple";
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
			transition={{ duration: 0.5, ease: "easeInOut" }}
			className={cn(
				"min-h-[70dvh] relative",
				"flex flex-col place-content-center place-items-center gap-8",
				"[&>*:not(:first-child)]:relative [&>*:not(:first-child)]:z-10",
			)}
		>
			<BackgroundRipple
				className="-z-10 [mask-image:radial-gradient(100vw_circle_at_center,white,transparent)]"
				circle={{
					className: "bg-primary/50",
				}}
			/>
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
					<motion.h1
						initial="hidden"
						animate="visible"
						transition={{ duration: 1, ease: "easeInOut" }}
						variants={{
							hidden: { filter: "blur(10px)", opacity: 0 },
							visible: { filter: "blur(0px)", opacity: 1 },
						}}
						className={cn(
							"text-pretty font-bold leading-none tracking-tighter text-center",
							"text-5xl sm:text-6xl",
							"bg-gradient-to-br text-transparent bg-gradient-stop bg-clip-text",
							"dark:from-white dark:via-white dark:via-30% dark:to-white/30",
							"from-black via-black via-30% to-black/30",
						)}
					>
						Bid, Bond, Bonk
					</motion.h1>
				</header>

				<motion.p
					initial="hidden"
					animate="visible"
					transition={{ duration: 1.5, ease: "easeInOut" }}
					variants={{
						hidden: { filter: "blur(10px)", opacity: 0 },
						visible: { filter: "blur(0px)", opacity: 1 },
					}}
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
				</motion.p>
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
