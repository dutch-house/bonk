import { parseEpoch } from "@/utils/time";
import { useEffect, useState } from "react";

export const useCountdown = ({
	startDate,
	duration = 0,
}: { startDate?: Date; duration?: number }) => {
	const timeUnits = Object.fromEntries(
		["days", "hours", "minutes", "seconds"].map((key) => [key, 0]),
	);
	if (!startDate) return timeUnits;

	const endDate = new Date(startDate.getTime() + duration);
	const [countdown, setCountdown] = useState(
		endDate.getTime() - new Date().getTime(),
	);

	useEffect(() => {
		const interval = setInterval(() => {
			const timeLeft = endDate.getTime() - new Date().getTime();
			setCountdown(timeLeft >= 0 ? timeLeft : 0);
		}, 1000);

		return () => clearInterval(interval);
	}, [endDate]);

	return parseEpoch(countdown);
};

export default useCountdown;
