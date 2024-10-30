import { AppSelectors, Theme } from "@/data/stores/app";
import { useRootSelector } from "@/data/stores/root";
import { type PropsWithChildren, useEffect } from "react";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
	const { theme } = useRootSelector(AppSelectors.state);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove(...Theme.options);

		root.classList.add(theme);
	}, [theme]);

	return children;
};

export default ThemeProvider;
