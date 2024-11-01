import { ButtonVariants } from "@bonk/ui/components/ui/button";
import { cn } from "@bonk/ui/utils/dom";
import type { LucideIcon } from "lucide-react";

import { Dock, DockIcon } from "@bonk/ui/components/flairs/ui.dock";
import { Separator } from "@bonk/ui/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@bonk/ui/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import { GavelIcon, UserRoundCogIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import Logo from "./logo";
import Theme from "./theme";
import Wallet from "./wallet";

//#startregion  //*======== CONSTANTS ===========
const Routes: (ComponentProps<typeof Link> & {
	icon: LucideIcon;
	label: string;
})[] = [
	{
		to: "/auctions",
		icon: GavelIcon,
		label: "Browse Auctions",
	},
	{
		to: "/auctions/manage",
		icon: UserRoundCogIcon,
		label: "Manage Auctions",
	},
];
//#endregion  //*======== CONSTANTS ===========

type Nav = HTMLAttributes<HTMLDivElement>;
const Nav = ({ className, children, ...props }: Nav) => {
	return (
		<nav
			className={cn(
				"transition-all",
				"sticky inset-x-0 top-0 z-40",
				"py-2 max-sm:px-4",
				"bg-background/50 backdrop-blur",
				"border-b-2 border-b-border/50",
				"*:sm:content-container",
				className,
			)}
			{...props}
		>
			<main
				className={cn(
					"flex flex-row place-items-center max-sm:place-content-between gap-x-4",
					"max-sm:[&>*:not(:first-child)]:hidden",
				)}
			>
				<Logo />

				<div className={cn("flex flex-1 flex-row place-content-end gap-2")}>
					<TooltipProvider>
						{Routes.map((item) => {
							if (item.to === "/") return null;
							return (
								<Tooltip key={item.label}>
									<TooltipTrigger asChild>
										<Link
											to={item.to}
											aria-label={item.label}
											className={cn(
												ButtonVariants({ variant: "ghost", size: "icon" }),
												"rounded-full",
											)}
										>
											<item.icon className="size-4" />
										</Link>
									</TooltipTrigger>
									<TooltipContent>
										<p>{item.label}</p>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</TooltipProvider>
					{children}
				</div>
				<Separator
					orientation="vertical"
					className="h-full py-2 bg-primary/50"
				/>
				<Wallet />
			</main>
		</nav>
	);
};
export default Nav;

type NavDock = HTMLAttributes<HTMLDivElement>;
const NavDock = ({ className, children, ...props }: Nav) => {
	return (
		<TooltipProvider>
			<Dock
				magnification={60}
				distance={100}
				className={cn(
					"sm:hidden",
					"fixed inset-x-0 bottom-12 z-50",

					// "!place-items-center",
					className,
				)}
				{...props}
			>
				{Routes.map((item) => (
					<DockIcon
						key={`nav-dock-${item.label}`}
						className="bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 p-3"
					>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link to={item.to} aria-label={item.label}>
									<item.icon className="size-full" />
								</Link>
							</TooltipTrigger>
							<TooltipContent>{item.label}</TooltipContent>
						</Tooltip>
					</DockIcon>
				))}

				{children}
				<Separator orientation="vertical" className="h-full py-2" />
				<Theme
					className="size-10 rounded-full self-center"
					variant={"default"}
				/>
				<Wallet mini className="size-10 rounded-full self-center" />
			</Dock>
		</TooltipProvider>
	);
};
Nav.Dock = NavDock;
