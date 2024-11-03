import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "../../utils/dom";

type Progress = React.ComponentPropsWithoutRef<
	typeof ProgressPrimitive.Root
> & {
	indicator?: React.ComponentPropsWithoutRef<
		typeof ProgressPrimitive.Indicator
	>;
};
const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	Progress
>(({ indicator, className, value, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={cn(
			"relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
			className,
		)}
		{...props}
	>
		<ProgressPrimitive.Indicator
			{...indicator}
			className={cn(
				"h-full w-full flex-1 bg-primary transition-all",
				indicator?.className,
			)}
			style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
		/>
	</ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
