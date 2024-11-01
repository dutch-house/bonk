import BackgroundSquares from "@bonk/ui/components/flairs/background.squares";
import { cn } from "@bonk/ui/utils/dom";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import Hero from "./-views/index.hero";
import How from "./-views/index.how";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<Fragment>
			<BackgroundSquares
				numSquares={30}
				maxOpacity={0.1}
				duration={3}
				repeatDelay={1}
				className={cn(
					"[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
					"absolute inset-x-0 inset-y-[-30%]",
				)}
			/>
			<main className={cn("page-container", "flex flex-col gap-16", "mt-8")}>
				<Hero />
				<How />
			</main>
		</Fragment>
	);
}
