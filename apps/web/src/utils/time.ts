import { z } from "zod";

export const delay = (ms = 500) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const unix = (date: Date): number => (date.getTime() / 1000) | 0;

export const formatTimestamp = (
	date: Date,
	delimiter = "",
	options?: Intl.DateTimeFormatOptions,
): string => {
	return new Intl.DateTimeFormat("en-SG", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		...options,
	})
		.format(date)
		.replace(/\//g, delimiter);
};

export const formatDatetime = (
	str: string,
	options?: Intl.DateTimeFormatOptions,
): string => {
	const parsedDatetime = z.string().datetime().safeParse(str);
	if (!parsedDatetime.success) return "-";

	return new Intl.DateTimeFormat("en-SG", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		...options,
	})
		.format(new Date(str))
		.toUpperCase();
};

export const formatCountdown = ({
	minutes = 0,
	seconds = 0,
}: Partial<{
	minutes: number;
	seconds: number;
}>) => {
	const minutesString = minutes < 10 ? `0${minutes}` : minutes;
	const secondsString = seconds < 10 ? `0${seconds}` : seconds;
	return `${minutesString}:${secondsString}`;
};

export const parseEpoch = (epoch: number) => {
	const days = Math.floor(epoch / (1000 * 60 * 60 * 24));
	const hours = Math.floor((epoch % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((epoch % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((epoch % (1000 * 60)) / 1000);

	return { days, hours, minutes, seconds };
};
