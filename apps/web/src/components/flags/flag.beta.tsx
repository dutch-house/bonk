import { env } from "@/env";
import { Alert, AlertDescription } from "@bonk/ui/components/ui/alert";
import { cn } from "@bonk/ui/utils/dom";
import { InfoCircledIcon } from "@radix-ui/react-icons/dist";
import type { ComponentProps } from "react";

type FlagBetaAlert = ComponentProps<typeof Alert>;
const FlagBetaAlert = ({
	variant = "info",
	className,
	children,
	...rest
}: FlagBetaAlert) => {
	const isEnabled = env.VITE_FLAG_BETA;
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
				<InfoCircledIcon className="size-4" />
				<p>This is an early version of the application and may contain bugs.</p>
			</AlertDescription>
		</Alert>
	);
};
export default FlagBetaAlert;
