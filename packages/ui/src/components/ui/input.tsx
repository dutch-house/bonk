import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/dom";

export const InputVariants = cva(
	"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
);

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof InputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(InputVariants(), className)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export default Input;
