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
			<main className={cn("page-container", "flex flex-col gap-16", "mt-8")}>
				<Hero />
				<How />
			</main>
		</Fragment>
	);
}
