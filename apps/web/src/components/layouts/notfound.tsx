import AnimateFade from "@bonk/ui/components/flairs/animate.fade";
import BackgroundSquares from "@bonk/ui/components/flairs/background.squares";
import Button from "@bonk/ui/components/ui/button";
import { cn } from "@bonk/ui/utils/dom";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { BadgeHelpIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

type NotFound = HTMLAttributes<HTMLDivElement> & {
	text?: string | ReactNode;
};
const NotFound = ({ text, className, children, ...props }: NotFound) => {
	return (
		<AnimateFade
			delay={0.25}
			inView
			className={cn(
				"content-container",
				"flex flex-col place-items-center gap-y-4",
				"my-8",
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
					"text-2xl font-bold leading-none tracking-tight text-pretty whitespace-break-spaces text-center",
					"max-sm:max-w-40",
				)}
			>
				Uh-oh! Looks like you&apos;re lost.
			</h3>

			<p className="text-sm text-gray-500 mb-4 text-center text-balance whitespace-break-spaces max-w-prose max-sm:px-6 sm:w-9/12">
				{text ??
					"Oops! The page you are looking for doesn't exist or has been moved."}
			</p>

			{children}

			<Link to="/">
				<Button className="space-x-1 group">
					<ArrowLeftIcon className="size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
					<span>Back to home</span>
				</Button>
			</Link>
		</AnimateFade>
	);
};

export default NotFound;

const NotFoundPage = () => {
	return (
		<>
			<BackgroundSquares
				duration={3}
				repeatDelay={1}
				className={cn(
					"opacity-20",
					"[mask-image:radial-gradient(80vw_circle_at_center,white,transparent)]",
				)}
			/>
			<main
				className={cn(
					"page-container",
					"flex flex-col gap-6 place-items-center place-content-center",
					"mt-8",
				)}
			>
				<NotFound />
			</main>
		</>
	);
};
NotFound.Page = NotFoundPage;
