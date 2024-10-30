import { useEffect, useState } from "react";

export const useCountdown = (startDate: Date, duration: number) => {
	const endDate = new Date(startDate.getTime() + duration * 1000);
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

	const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
	);
	const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

	return { days, hours, minutes, seconds };
};

export default useCountdown;
