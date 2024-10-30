import { AppName } from "@/data/static/app";
import { cn } from "@bonk/ui/utils/dom";
import { Link } from "@tanstack/react-router";
import type { ComponentProps, HTMLAttributes } from "react";

type Logo = ComponentProps<typeof Link> & {
	icon?: boolean;
};
const Logo = ({ icon = false, className, ...link }: Logo) => {
	return (
		<Link
			to="/"
			className={cn(
				"[&>img]:h-7 cursor-pointer",
				"flex flex-row place-items-center gap-x-1",
				className,
			)}
			{...link}
		>
			<Logo.Icon />

			<img
				src={"/assets/brand/bonk.svg"}
				alt={AppName}
				className="invert dark:invert-0 !h-5"
			/>
		</Link>
	);
};

export default Logo;

type LogoIcon = HTMLAttributes<HTMLImageElement>;
const LogoIcon = (props: LogoIcon) => {
	return (
		<img
			src={"/assets/brand/bonk.icon.svg"}
			alt={AppName}
			aria-hidden={true}
			className="!invert-0"
			{...props}
		/>
	);
};
Logo.Icon = LogoIcon;
