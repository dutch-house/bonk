import NotFound from "@/components/layouts/notfound";
import { routeTree } from "@/routes.gen";
import {
	RouterProvider as TsRouterProvider,
	createRouter,
} from "@tanstack/react-router";
import { lazy } from "react";

// Create a new router instance
const Router = createRouter({
	routeTree,
	defaultNotFoundComponent: NotFound.Page,
});
// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof Router;
	}
}

const RouterProvider = () => <TsRouterProvider router={Router} />;
export default RouterProvider;

export const Devtools =
	process.env.NODE_ENV === "production"
		? () => null // Render nothing in production
		: lazy(() =>
				// Lazy load in development
				import("@tanstack/router-devtools").then((res) => ({
					default: res.TanStackRouterDevtools,
					// For Embedded Mode
					// default: res.TanStackRouterDevtoolsPanel
				})),
			);

RouterProvider.Devtools = Devtools;
