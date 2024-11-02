import Button, {
	type ButtonProps,
	ButtonVariants,
} from "@bonk/ui/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@bonk/ui/components/ui/dialog";
import { Separator } from "@bonk/ui/components/ui/separator";
import { cn } from "@bonk/ui/utils/dom";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
	BookOpenIcon,
	BoxesIcon,
	ExternalLinkIcon,
	GitBranchIcon,
	type LucideIcon,
} from "lucide-react";
import type { HTMLAttributes } from "react";
import { useBlockNumber } from "wagmi";
import Theme from "./theme";
import Wallet from "./wallet";

type Footer = HTMLAttributes<HTMLDivElement>;
const Footer = ({ className, children, ...props }: Footer) => {
	return (
		<footer
			className={cn(
				"transition-all",
				"py-2 max-sm:px-4",
				"bg-background/50 backdrop-blur",
				"border-t",
				"*:sm:content-container",
				className,
			)}
			{...props}
		>
			<main
				className={cn(
					"flex flex-row place-items-center max-sm:place-content-between gap-x-4",
					"*:flex-1",
				)}
			>
				<div className="flex flex-row place-items-center place-content-start gap-x-4 max-sm:hidden">
					<Wallet.Chains />
					<Separator
						orientation="vertical"
						className="h-full py-2 bg-primary/50"
					/>
					<Theme.Tabs />
				</div>

				<div className="flex flex-row place-items-center place-content-between sm:place-content-end gap-x-2 *:shrink-0">
					<Footer.Block />
					<Footer.Help />
				</div>
			</main>
		</footer>
	);
};
export default Footer;

type FooterBlock = ButtonProps;
const FooterBlock = ({ className, children, ...props }: FooterBlock) => {
	const { data: blockNumber = 0n } = useBlockNumber();

	return (
		<Button
			size={"sm"}
			variant={"ghost"}
			className={cn("space-x-1", className)}
			{...props}
		>
			<BoxesIcon className="size-3" />
			<span className="text-xs">Block {Number(blockNumber)}</span>
		</Button>
	);
};
Footer.Block = FooterBlock;

const References: {
	href: string;
	icon: LucideIcon;
	label: string;
	description?: string;
}[] = [
	{
		href: "https://github.com/crystalcheong/bonk",
		icon: GitBranchIcon,
		label: "Github",
		description: "View the project source code",
	},
	{
		href: "https://hardhat.org/docs",
		icon: BookOpenIcon,
		label: "Hardhat Docs",
		description: "Learn about Hardhat for Ethereum development",
	},
	{
		href: "https://docs.soliditylang.org/en/v0.8.28/",
		icon: BookOpenIcon,
		label: "Solidity Docs",
		description: "Refer to the official Solidity documentation",
	},
	{
		href: "https://wagmi.sh/",
		icon: BookOpenIcon,
		label: "Wagmi Docs",
		description: "Documentation for Wagmi React hooks for Web3",
	},
];

type FooterHelp = ButtonProps;
const FooterHelp = ({ className, children, ...props }: FooterHelp) => {
	return (
		<Dialog>
			<DialogTrigger
				className={cn(
					ButtonVariants({
						size: "sm",
						variant: "ghost",
					}),
					"space-x-1",
					className,
				)}
				{...props}
			>
				{children ?? (
					<>
						<QuestionMarkCircledIcon className="size-3" />
						<span>About</span>
					</>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>About</DialogTitle>
					<DialogDescription className="max-w-prose text-pretty text-start">
						This application is submitted as a project work for Nanyang
						Technological University's SC4053 - Blockchain Technology course.
					</DialogDescription>
				</DialogHeader>
				<Separator />

				{References.map((item) => (
					<a
						key={`help-${item.label}`}
						href={item.href}
						target="_blank"
						className={cn(
							ButtonVariants({
								size: "sm",
								variant: "ghost",
							}),
							"flex flex-row place-items-start place-content-between gap-x-4",
							"py-2.5 h-auto",
						)}
						rel="noreferrer"
					>
						<item.icon className="size-5 shrink-0" />
						<div className="flex flex-col gap-0.5 flex-1 *:leading-none">
							<span className="font-semibold text-base">{item.label}</span>
							<span className="text-muted-foreground text-sm text-pretty">
								{item.description}
							</span>
						</div>
						<ExternalLinkIcon className="size-5 hidden sm:block" />
					</a>
				))}
			</DialogContent>
		</Dialog>
	);
};
Footer.Help = FooterHelp;
