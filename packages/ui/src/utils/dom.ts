import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single string for applying CSS classes.
 * @param {...ClassValue[]} inputs - The class values to be combined.
 * @returns {string} - A string representing the combined class values.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const copyToClipboard = (content: string) =>
	navigator.clipboard.writeText(content);
