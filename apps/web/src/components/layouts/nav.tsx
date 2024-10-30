import { ButtonVariants } from "@bonk/ui/components/ui/button";
import { cn } from "@bonk/ui/utils/dom";
import type { LucideIcon } from "lucide-react";
import Theme from "./theme";

import { Separator } from "@bonk/ui/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@bonk/ui/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import { GavelIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import Logo from "./logo";
import Wallet from "./wallet";

//#startregion  //*======== CONSTANTS ===========
const Routes: (ComponentProps<typeof Link> & {
	icon: LucideIcon;
	label: string;
})[] = [
	{
		to: "/auctions",
		icon: GavelIcon,
		label: "Auctions",
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
				)}
			>
				<Logo />

				<div className="flex flex-1 flex-row place-content-end gap-2">
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
				<Theme className="rounded-full" />
				<Wallet />
			</main>
		</nav>
	);
};
export default Nav;
