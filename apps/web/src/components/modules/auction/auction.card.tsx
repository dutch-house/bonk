import { Auction, AuctionStatus } from "@/data/clients/bonk/schema";
import { getTruncatedAddress } from "@/utils/account";
import { formatCountdown, parseEpoch } from "@/utils/time";
import {
	useReadAuctionMarketGetAuctionEnded,
	useReadAuctionMarketGetCreator,
	useReadAuctionMarketGetDuration,
	useReadAuctionMarketGetStartTime,
	useReadAuctionMarketGetToken,
	useReadAuctionMarketGetTokensDistributed,
	useReadAuctionTokenName,
	useReadAuctionTokenSymbol,
} from "@/wagmi.gen";
import Badge from "@bonk/ui/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@bonk/ui/components/ui/card";
import Skeleton from "@bonk/ui/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@bonk/ui/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@bonk/ui/components/ui/tooltip";
import { cn } from "@bonk/ui/utils/dom";
import { type HTMLAttributes, useEffect, useMemo, useState } from "react";
import type { Address } from "viem";
import AuctionBid from "./auction.bid";
import AuctionDistribute from "./auction.distribute";

type AuctionCard = HTMLAttributes<HTMLDivElement> & {
	address?: Address;
};
const AuctionCard = ({
	address,
	children,
	className,
	...props
}: AuctionCard) => {
	//#startregion  //*======== CLIENT ===========
	const { data: creatorAddress } = useReadAuctionMarketGetCreator({
		address,
	});
	const { data: tokenAddress } = useReadAuctionMarketGetToken({
		address,
	});
	const { data: tokenName } = useReadAuctionTokenName({
		address: tokenAddress,
		query: {
			enabled: !!tokenAddress,
		},
	});
	const { data: tokenSymbol } = useReadAuctionTokenSymbol({
		address: tokenAddress,
		query: {
			enabled: !!tokenAddress,
		},
	});
	const { data: tokensDistributed = false } =
		useReadAuctionMarketGetTokensDistributed({ address });
	const { data: auctionEnded = false } = useReadAuctionMarketGetAuctionEnded({
		address,
	});
	const { data: auctionStartDatetime } = useReadAuctionMarketGetStartTime({
		address,
		query: {
			select: (epoch) => {
				return new Date(Number(epoch) * 1000);
			},
		},
	});
	const { data: auctionDurationMeta } = useReadAuctionMarketGetDuration({
		address,
		query: {
			enabled: !!auctionStartDatetime,
			select: (epoch) => {
				const duration = Number(epoch) * 1000;

				if (!auctionStartDatetime) {
					return {
						duration,
						endDate: undefined,
						countdown: 0,
					};
				}

				const endDate = new Date(auctionStartDatetime.getTime() + duration);
				const countdown = Math.max(0, endDate.getTime() - new Date().getTime());

				return {
					duration,
					endDate,
					countdown,
				};
			},
		},
	});
	//#endregion  //*======== CLIENT ===========

	//#startregion  //*======== STATES ===========
	const [countdown, setCountdown] = useState<number>(0);

	useMemo(() => {
		setCountdown(auctionDurationMeta?.countdown ?? 0);
	}, [auctionDurationMeta?.countdown]);

	useEffect(() => {
		if (!countdown) return;

		const interval = setInterval(() => {
			setCountdown((prevCountdown) => {
				if (prevCountdown <= 1000) {
					clearInterval(interval);
					return 0;
				}
				return prevCountdown - 1000;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [countdown]);
	//#endregion  //*======== STATES ===========

	const auction: Auction | undefined = useMemo(() => {
		if (
			!address ||
			!creatorAddress ||
			!tokenAddress ||
			!tokenName ||
			!tokenSymbol ||
			!auctionDurationMeta
		)
			return;

		const parsed = Auction.safeParse({
			address,
			creatorAddress,
			tokenAddress,
			tokenName,
			tokenSymbol,
			status: auctionEnded
				? "ended"
				: (auctionDurationMeta?.countdown ?? 0) > 0
					? "ongoing"
					: "finalising",
			tokensDistributed,
		});
		return parsed.success ? parsed.data : undefined;
	}, [
		address,
		creatorAddress,
		tokenAddress,
		tokenName,
		tokenSymbol,
		auctionEnded,
		auctionDurationMeta,
		tokensDistributed,
	]);

	return (
		<Card
			className={cn(
				"*:p-4 *:space-y-0 *:!text-xs",
				"flex flex-col",
				"[&>*:last-child]:mt-auto",
				className,
			)}
			{...props}
		>
			<CardHeader className="flex flex-row place-items-top place-content-between gap-2">
				{!auction ? (
					<Skeleton className="h-4 w-3/5 min-w-8" />
				) : (
					<CardTitle className="!text-sm text-truncate text-nowrap flex-1">
						{tokenName} ({tokenSymbol})
					</CardTitle>
				)}

				{!auction ? (
					<Skeleton className="h-4 w-2/6" />
				) : (
					<span className="capitalize underline-offset-4 underline cursor-pointer">
						{getTruncatedAddress({ address })}
					</span>
				)}
			</CardHeader>
			<CardContent className="!pt-0">
				<Table>
					<TableBody
						className={cn(
							"*:!bg-background *:!text-xs",
							"*:border-0 [&>tr>td:last-child]:text-right",
							"[&>tr]:border-b",
							"[&>tr>td]:font-semibold [&>tr>td:first-child]:text-muted-foreground [&>tr>td:first-child]:capitalize [&>tr>td:first-child]:font-medium",
							"[&>tr>td:last-child]:flex [&>tr>td:last-child]:flex-row [&>tr>td:last-child]:place-items-center [&>tr>td:last-child]:place-content-end  [&>tr>td:last-child]:flex-nowrap  [&>tr>td:last-child]:text-nowrap [&>tr>td:last-child]:truncate",
						)}
					>
						<TableRow>
							<TableCell>Status</TableCell>
							<TableCell>
								{!auction ? (
									<Skeleton className="h-4 w-full min-w-8" />
								) : (
									<Badge
										variant={auctionEnded ? "destructive" : "outline"}
										className={cn(
											"relative capitalize transition-all",
											"text-background dark:text-foreground",
											auction.status === AuctionStatus.enum.finalising &&
												"bg-amber-500 hover:bg-amber-500/80 dark:bg-amber-500/80",
											auction.status === AuctionStatus.enum.ongoing &&
												"bg-green-500 hover:bg-green-500/80 dark:bg-green-500/80",
										)}
									>
										{auction.status}
									</Badge>
								)}
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>Distribution</TableCell>
							<TableCell>
								{!auction ? (
									<Skeleton className="h-4 w-full min-w-8" />
								) : (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<Badge
													variant={
														tokensDistributed || !auctionEnded
															? "outline"
															: "default"
													}
													className={cn("relative capitalize transition-all")}
												>
													{tokensDistributed ? "distributed" : "undistributed"}
												</Badge>
											</TooltipTrigger>
											<TooltipContent className="max-w-80 text-pretty normal-case text-start">
												{!auctionEnded &&
													"Tokens will be distributed by the auction creator after the auction ends."}
												{auctionEnded &&
													(tokensDistributed
														? "Tokens have been distributed to bidders."
														: "Tokens are pending distribution by the creator.")}
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>Created by</TableCell>
							<TableCell className="uppercase">
								{!auction ? (
									<Skeleton className="h-4 w-full min-w-8" />
								) : (
									<span className="capitalize underline-offset-4 underline cursor-pointer">
										{getTruncatedAddress({ address: auction.creatorAddress })}
									</span>
								)}
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>Started At</TableCell>
							<TableCell className="uppercase">
								{!auction ? (
									<Skeleton className="h-4 w-full min-w-8" />
								) : auctionStartDatetime ? (
									new Intl.DateTimeFormat("en-SG", {
										year: "2-digit",
										month: "2-digit",
										day: "2-digit",
										hour: "2-digit",
										minute: "2-digit",
									}).format(auctionStartDatetime)
								) : (
									"???"
								)}
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>Duration</TableCell>
							<TableCell className="uppercase">
								{!auction ? (
									<Skeleton className="h-4 w-full min-w-8" />
								) : (
									formatCountdown({
										minutes: parseEpoch(countdown ?? 0).minutes,
										seconds: parseEpoch(countdown ?? 0).seconds,
									})
								)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>

			<CardFooter className="flex flex-row flex-wrap place-items-center place-content-between gap-2 *:flex-1">
				{!auction && <Skeleton className="h-8 w-full" />}

				{!!auction && auction.status !== "ongoing" && (
					<AuctionDistribute auction={auction} disabled={!auctionEnded} />
				)}

				{!!auction && auction.status === "ongoing" && (
					<AuctionBid auction={auction} disabled={auctionEnded} />
				)}
			</CardFooter>

			{children}
		</Card>
	);
};

export default AuctionCard;
