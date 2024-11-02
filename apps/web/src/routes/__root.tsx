import Nav from "@/components/layouts/nav";
import { SEO } from "@/components/layouts/seo";
import RouterProvider from "@/components/providers/router";
import { Toaster } from "@bonk/ui/components/ui/toast";
import {
	Outlet,
	createRootRoute,
	useRouterState,
} from "@tanstack/react-router";
import { Fragment, Suspense, lazy } from "react";

const FlagDownAlert = lazy(() => import("@/components/flags/flag.down"));
const FlagBetaAlert = lazy(() => import("@/components/flags/flag.beta"));
const Footer = lazy(() => import("@/components/layouts/footer"));

export const Route = createRootRoute({
	component: () => {
		const matches = useRouterState({ select: (s) => s.matches });
		const { title }: { title?: string } = [...matches].pop()?.loaderData ?? {
			title: undefined,
		};

		return (
			<Fragment>
				<SEO title={title} />
				<Toaster richColors position="bottom-right" className="z-[100]" />

				<Nav />

				<Suspense>
					<FlagBetaAlert />
				</Suspense>
				<Suspense>
					<FlagDownAlert />
				</Suspense>

				<Outlet />

				<Nav.Dock />

				<Suspense>
					<Footer />
				</Suspense>

				<Suspense>
					<RouterProvider.Devtools />
				</Suspense>
			</Fragment>
		);
	},
});
