import {
	AppActions,
	AppSelectors,
	Theme as ThemeTypes,
} from "@/data/stores/app";
import { useRootDispatch, useRootSelector } from "@/data/stores/root";
import Button, { type ButtonProps } from "@bonk/ui/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@bonk/ui/components/ui/tabs";
import { cn } from "@bonk/ui/utils/dom";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import type { IconProps } from "@radix-ui/react-icons/dist/types";

const ThemeIcon: Record<
	ThemeTypes,
	React.ForwardRefExoticComponent<
		IconProps & React.RefAttributes<SVGSVGElement>
	>
> = {
	[ThemeTypes.enum.dark]: MoonIcon,
	[ThemeTypes.enum.light]: SunIcon,
};

type Theme = ButtonProps & {
	icon?: IconProps;
};
const Theme = ({ className, children, icon = {}, ...props }: Theme) => {
	const dispatch = useRootDispatch();
	const [themeMode, setThemeMode] = [
		useRootSelector(AppSelectors.state).theme,
		AppActions.setTheme,
	];

	const isDarkMode = themeMode === ThemeTypes.enum.dark;
	const ThemeModeIcon = ThemeIcon[themeMode];

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => {
				const inverseThemeMode = isDarkMode
					? ThemeTypes.enum.light
					: ThemeTypes.enum.dark;
				dispatch(setThemeMode(inverseThemeMode));
			}}
			className={cn("group", className)}
			{...props}
		>
			<ThemeModeIcon
				{...icon}
				className={cn("size-4 group-active:animate-bounce", icon?.className)}
			/>
			{children}
		</Button>
	);
};
export default Theme;

const ThemeTabs = () => {
	const dispatch = useRootDispatch();
	const [themeMode, setThemeMode] = [
		useRootSelector(AppSelectors.state).theme,
		AppActions.setTheme,
	];

	return (
		<Tabs
			value={themeMode}
			onValueChange={(theme) => {
				const parsedTheme = ThemeTypes.safeParse(theme);
				if (!parsedTheme.success) return;
				dispatch(setThemeMode(parsedTheme.data));
			}}
			className="w-fit"
		>
			<TabsList
				className={cn("h-auto p-0.5", "*:p-1 *:text-xs *:rounded-full")}
			>
				{ThemeTypes.options.map((theme) => {
					const Icon = ThemeIcon[theme];
					return (
						<TabsTrigger
							key={`theme-tab-${theme}`}
							value={theme}
							className="capitalize"
						>
							<Icon className="size-3" />
							<span className="sr-only">{theme}</span>
						</TabsTrigger>
					);
				})}
			</TabsList>
		</Tabs>
	);
};

Theme.Tabs = ThemeTabs;
