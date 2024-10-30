import AppPackage from "@/../package.json";

export const AppName = AppPackage.name;
export const DebugPrefix = `@${AppName.toUpperCase()}`;
export const AppVersion = AppPackage.version;
export const AppDescription = AppPackage.description;
export const AppBaseUrl = (
	options: {
		isAbsolute?: boolean;
	} = {
		isAbsolute: false,
	},
) => {
	if (!options.isAbsolute && typeof window !== "undefined") return ""; // Browser should use relative URL
	if (import.meta.env.VITE_VERCEL_URL)
		return `https://${import.meta.env.VITE_VERCEL_URL}`; // SSR should use Vercel URL
	return `http://localhost:${import.meta.env.VITE_APP_PORT ?? 5173}`; // Development SSR should use localhost
};

export const PersistVersion: number = 0.1;
