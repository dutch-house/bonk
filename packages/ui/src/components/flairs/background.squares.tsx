import { motion } from "framer-motion";
import { type SVGProps, useEffect, useId, useRef, useState } from "react";
import { cn } from "../../utils/dom";

type BackgroundSquares = Partial<
	SVGProps<SVGSVGElement> & {
		strokeDasharray: Pick<SVGProps<SVGPathElement>, "strokeDasharray">;
		pattern: SVGProps<SVGPatternElement>;

		numSquares: number;
		maxOpacity: number;
		duration: number;
		repeatDelay: number;
	}
>;

export default function BackgroundSquares({
	pattern = { width: 40, height: 40, x: -1, y: -1 },
	strokeDasharray = 0,

	numSquares = 50,
	maxOpacity = 0.5,
	duration = 4,
	repeatDelay = 0.5,

	className,
	...props
}: BackgroundSquares) {
	const id = useId();
	const containerRef = useRef(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [squares, setSquares] = useState(() => generateSquares(numSquares));

	function getPos() {
		return [
			Math.floor((Math.random() * dimensions.width) / +`${pattern.width ?? 0}`),
			Math.floor(
				(Math.random() * dimensions.height) / +`${pattern.height ?? 0}`,
			),
		];
	}

	// Adjust the generateSquares function to return objects with an id, x, and y
	function generateSquares(count: number) {
		return Array.from({ length: count }, (_, i) => ({
			id: i,
			pos: getPos(),
		}));
	}

	// Function to update a single square's position
	const updateSquarePosition = (id: number) => {
		setSquares((currentSquares) =>
			currentSquares.map((sq) =>
				sq.id === id
					? {
							...sq,
							pos: getPos(),
						}
					: sq,
			),
		);
	};

	// Update squares to animate in
	// biome-ignore lint/correctness/useExhaustiveDependencies(generateSquares): too excessive
	useEffect(() => {
		if (dimensions.width && dimensions.height) {
			setSquares(generateSquares(numSquares));
		}
	}, [dimensions, numSquares]);

	// Resize observer to update container dimensions
	// biome-ignore lint/correctness/useExhaustiveDependencies(containerRef): is needed
	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setDimensions({
					width: entry.contentRect.width,
					height: entry.contentRect.height,
				});
			}
		});

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				resizeObserver.unobserve(containerRef.current);
			}
		};
	}, [containerRef]);

	return (
		<svg
			ref={containerRef}
			aria-hidden={true}
			className={cn(
				"pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
				className,
			)}
			{...props}
		>
			<defs>
				<pattern id={id} patternUnits="userSpaceOnUse" {...pattern}>
					<path
						d={`M.5 ${pattern.height}V.5H${pattern.width}`}
						fill="none"
						strokeDasharray={strokeDasharray}
					/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${id})`} />
			<svg
				x={pattern.x}
				y={pattern.y}
				aria-hidden={true}
				className="overflow-visible"
			>
				{squares.map(({ pos: [x = 0, y = 0], id }, index) => (
					<motion.rect
						initial={{ opacity: 0 }}
						animate={{ opacity: maxOpacity }}
						transition={{
							duration,
							repeat: 1,
							delay: index * 0.1,
							repeatType: "reverse",
						}}
						onAnimationComplete={() => updateSquarePosition(id)}
						key={`sq-${id}-${x}-${y}`}
						width={+`${pattern.width ?? 0}` - 1}
						height={+`${pattern.height ?? 0}` - 1}
						x={x * +`${pattern.width ?? 0}` + 1}
						y={y * +`${pattern.height ?? 0}` + 1}
						fill="currentColor"
						strokeWidth="0"
					/>
				))}
			</svg>
		</svg>
	);
}
