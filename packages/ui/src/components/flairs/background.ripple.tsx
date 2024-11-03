import React, { type HTMLAttributes, type CSSProperties } from "react";

import type { ClassValue } from "clsx";
import { cn } from "../../utils/dom";

interface BackgroundRipple {
	mainCircleSize?: number;
	mainCircleOpacity?: number;
	numCircles?: number;
	className?: ClassValue;
	circle?: HTMLAttributes<HTMLDivElement>;
}

const BackgroundRipple = React.memo(function Ripple({
	mainCircleSize = 210,
	mainCircleOpacity = 0.24,
	numCircles = 8,
	className,
	circle,
}: BackgroundRipple) {
	return (
		<div
			className={cn(
				"pointer-events-none select-none absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)]",
				className,
			)}
		>
			{Array.from({ length: numCircles }, (_, i) => {
				const size = mainCircleSize + i * 70;
				const opacity = mainCircleOpacity - i * 0.03;
				const animationDelay = `${i * 0.06}s`;
				const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
				const borderOpacity = 5 + i * 5;
				const key = `cirle-${i}-${size}`;
				return (
					<div
						key={key}
						className={cn(
							`absolute animate-ripple rounded-full bg-foreground/25 shadow-xl border [--i:${i}]`,
							circle?.className,
						)}
						style={
							{
								width: `${size}px`,
								height: `${size}px`,
								opacity,
								animationDelay,
								borderStyle,
								borderWidth: "1px",
								borderColor: `hsl(var(--foreground), ${borderOpacity / 100})`,
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%) scale(1)",
								...circle?.style,
							} as CSSProperties
						}
					/>
				);
			})}
		</div>
	);
});

BackgroundRipple.displayName = "Ripple";

export default BackgroundRipple;
