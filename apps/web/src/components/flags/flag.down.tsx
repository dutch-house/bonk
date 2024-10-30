import { env } from "@/env";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@bonk/ui/components/ui/alert";
import { cn } from "@bonk/ui/utils/dom";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons/dist";
import type { ComponentProps } from "react";

type FlagDownAlert = ComponentProps<typeof Alert>;
const FlagDownAlert = ({
	variant = "warning",
	className,
	children,
	...rest
}: FlagDownAlert) => {
	const isEnabled = env.VITE_FLAG_DOWN;
	if (!isEnabled) return null;
	return (
		<Alert
			variant={variant}
			className={cn(
				"*:content-container",
				"px-0",
				"rounded-none w-full py-1",
				className,
			)}
			{...rest}
		>
			<AlertDescription className="flex flex-row place-items-center gap-2 w-full">
				<ExclamationTriangleIcon className="size-4" />
				<p>
					This app is currently undergoing maintenance and will be back soon.
				</p>
			</AlertDescription>
		</Alert>
	);
};
export default FlagDownAlert;

type FeatureDownAlert = ComponentProps<typeof Alert>;
export const FeatureDownAlert = ({
	variant = "warning",
	children,
	...rest
}: FeatureDownAlert) => {
	const isEnabled = env.VITE_FLAG_DOWN;
	if (!isEnabled) return null;
	return (
		<Alert variant={variant} {...rest}>
			<ExclamationTriangleIcon className="size-4" />
			<AlertTitle className="capitalize font-semibold">
				Feature disabled
			</AlertTitle>
			<AlertDescription>
				This feature is temporarily unavailable as part of the ongoing
				maintenance.
			</AlertDescription>
			{children}
		</Alert>
	);
};
FlagDownAlert.Feature = FeatureDownAlert;
