import {
	AppActions,
	AppSelectors,
	Theme as ThemeTypes,
} from "@/data/stores/app";
import { useRootDispatch, useRootSelector } from "@/data/stores/root";
import Button, { type ButtonProps } from "@bonk/ui/components/ui/button";
import { cn } from "@bonk/ui/utils/dom";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

type Theme = ButtonProps;
const Theme = ({ className, children, ...props }: Theme) => {
	const dispatch = useRootDispatch();
	const [themeMode, setThemeMode] = [
		useRootSelector(AppSelectors.state).theme,
		AppActions.setTheme,
	];

	const isDarkMode = themeMode === ThemeTypes.enum.dark;
	const ThemeModeIcon = isDarkMode ? MoonIcon : SunIcon;

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
			<ThemeModeIcon className="size-4 group-active:animate-bounce" />
			{children}
		</Button>
	);
};

export default Theme;
