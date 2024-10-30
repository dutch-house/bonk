import {
	useReadAuctionMarketGetAuctionEnded,
	useReadAuctionMarketGetToken,
	useReadAuctionMarketGetTokensDistributed,
	useReadAuctionTokenName,
	useReadAuctionTokenSymbol,
} from "@/wagmi.gen";
import Badge from "@bonk/ui/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@bonk/ui/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@bonk/ui/components/ui/table";
import { cn } from "@bonk/ui/utils/dom";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import type { HTMLAttributes } from "react";
import type { Address } from "viem";

type AuctionCard = HTMLAttributes<HTMLDivElement> & {
	auction: Address;
};
const AuctionCard = ({
	auction,
	children,
	className,
	...props
}: AuctionCard) => {
	//#startregion  //*======== CLIENT ===========
	const { data: tokenAddress } = useReadAuctionMarketGetToken({
		address: auction,
	});
	const { data: tokenName } = useReadAuctionTokenName({
		address: tokenAddress,
	});
	const { data: tokenSymbol } = useReadAuctionTokenSymbol({
		address: tokenAddress,
	});

	const { data: tokensDistributed } = useReadAuctionMarketGetTokensDistributed({
		address: auction,
	});
	const { data: auctionEnded } = useReadAuctionMarketGetAuctionEnded({
		address: auction,
	});
	//#endregion  //*======== CLIENT ===========

	return (
		<Card className={cn("*:p-4 *:space-y-0 *:!text-xs", className)} {...props}>
			<CardHeader className="flex flex-row place-items-center place-content-between gap-2">
				<CardTitle className="!text-sm text-pretty flex-1">
					{tokenName} ({tokenSymbol})
					{/* {getTruncatedAddress({ address: auction })} */}
				</CardTitle>

				<Link
					// to="/labs/$id"
					// params={{ id: lab.id }}
					className="flex flex-row gap-1 place-items-center underline-offset-4 underline cursor-pointer"
				>
					<span className="sr-only sm:not-sr-only capitalize ">view</span>
					<ExternalLinkIcon className="size-4" />
				</Link>
			</CardHeader>
			<CardContent className="!pt-0">
				<Table>
					<TableBody
						className={cn(
							"*:!bg-background *:!text-xs",
							"*:border-0 [&>tr>td:last-child]:text-right",
							"[&>tr]:border-b",
							"[&>tr>td]:font-semibold [&>tr>td:first-child]:text-muted-foreground [&>tr>td:first-child]:capitalize [&>tr>td:first-child]:font-medium",
							"[&>tr>td:last-child]:flex [&>tr>td:last-child]:flex-row [&>tr>td:last-child]:place-items-center [&>tr>td:last-child]:place-content-end",
						)}
					>
						<TableRow>
							<TableCell>Status</TableCell>
							<TableCell>
								<Badge
									variant={auctionEnded ? "secondary" : "default"}
									className={cn("relative capitalize transition-all")}
								>
									{auctionEnded ? "Ended" : "Ongoing"}
								</Badge>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>Distribution</TableCell>
							<TableCell>
								<Badge
									variant={"outline"}
									className={cn("relative capitalize transition-all")}
								>
									{tokensDistributed ? "distributed" : "undistributed"}
								</Badge>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default AuctionCard;
