import { AppBaseUrl, AppDescription, AppName } from "@/data/static/app";
import { Helmet, type HelmetProps } from "react-helmet-async";

type SEO = HelmetProps;
export const SEO = (props: SEO) => {
	return (
		<Helmet defaultTitle={AppName} titleTemplate={"%s"} {...props}>
			<html lang="en" />
			<meta charSet="utf-8" />
			{/* base element */}
			<base target="_blank" href={AppBaseUrl()} />

			{/* multiple meta elements */}
			<meta name="description" content={AppDescription} />

			<link
				rel="icon"
				type="image/svg+xml"
				href="/assets/brand/bonk.icon.svg"
			/>

			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		</Helmet>
	);
};
