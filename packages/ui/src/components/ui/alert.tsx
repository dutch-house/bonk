import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../utils/dom";

export const AlertVariants = cva(
	"relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
	{
		variants: {
			variant: {
				default: "bg-background text-foreground bg-background-100/50",
				destructive:
					"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-red-100/50 dark:bg-red-800/30 dark:text-red-300",
				warning:
					"border-amber-700/50 dark:border-amber-300 text-amber-700 dark:text-amber-300 [&>svg]:text-amber-700 dark:[&>svg]:text-amber-300 bg-amber-100/50 dark:bg-amber-800/50",
				info: "border-blue-700/50 dark:border-blue-300 text-blue-700 dark:text-blue-300 [&>svg]:text-blue-700 dark:[&>svg]:text-blue-300 bg-blue-100/50 dark:bg-blue-800/50",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const Alert = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof AlertVariants>
>(({ className, variant, ...props }, ref) => (
	<div
		ref={ref}
		role="alert"
		className={cn(AlertVariants({ variant }), className)}
		{...props}
	/>
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h5
		ref={ref}
		className={cn("mb-1 font-medium leading-none tracking-tight", className)}
		{...props}
	/>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("text-sm [&_p]:leading-relaxed text-pretty", className)}
		{...props}
	/>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
