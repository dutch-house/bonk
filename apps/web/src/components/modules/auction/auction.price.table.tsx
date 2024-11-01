import { CHAIN_DENOM, DEFINITIONS } from "@/data/clients/bonk/constants";
import { type Auction, AuctionStatus } from "@/data/clients/bonk/schema";
import {
	useReadAuctionMarketGetClearingPrice,
	useReadAuctionMarketGetCurrentPrice,
	useReadAuctionMarketGetReservedPrice,
} from "@/wagmi.gen";
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
import type { ComponentProps } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

type AuctionPriceTable = ComponentProps<typeof Table> & {
	auction: Auction;
};
const AuctionPriceTable = ({
	auction,
	children,
	...props
}: AuctionPriceTable) => {
	//#startregion  //*======== WALLET ===========
	const { chain } = useAccount();
	//#endregion  //*======== WALLET ===========

	//#startregion  //*======== CLIENT ===========
	const { data: reservedPrice = 0n } = useReadAuctionMarketGetReservedPrice({
		address: auction.address,
	});
	const { data: currentPrice = 0n } = useReadAuctionMarketGetCurrentPrice({
		address: auction.address,
	});
	const { data: clearingPrice = 0n } = useReadAuctionMarketGetClearingPrice({
		address: auction.address,
		query: {
			enabled: auction.status !== AuctionStatus.enum.ended,
		},
	});
	//#endregion  //*======== CLIENT ===========

	return (
		<Table {...props}>
			<TableBody
				className={cn(
					"*:border-0 [&>tr>td:last-child]:text-right",
					"[&>tr:not(:last-child)]:!border-b [&>tr]:flex [&>tr]:flex-row [&>tr]:place-items-center [&>tr]:place-content-between",
					"[&>tr>td]:font-semibold [&>tr>td:first-child]:text-muted-foreground [&>tr>td:first-child]:capitalize [&>tr>td:first-child]:flex-1 [&>tr>td:first-child]:text-nowrap",
					"[&>tr>td]:inline-flex [&>tr>td]:flex-row [&>tr>td]:place-items-center [&>tr>td]:gap-x-1",
					"[&>tr>td:last-child]:place-content-end",
				)}
			>
				<TableRow>
					<TableCell>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className="capitalize underline-offset-4 underline decoration-dotted hover:decoration-solid decoration-muted-foreground cursor-help">
									Clearing Price
								</TooltipTrigger>
								<TooltipContent className="max-w-80 text-pretty normal-case">
									{DEFINITIONS["Clearing Price"]}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</TableCell>
					<TableCell>
						<span className="font-semibold">
							{Number.parseFloat(
								Math.max(0, Number(formatEther(clearingPrice))).toFixed(4),
							).toString()}
						</span>
						<span className="text-muted-foreground">
							{chain?.nativeCurrency?.symbol ?? CHAIN_DENOM}
						</span>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className="capitalize underline-offset-4 underline decoration-dotted hover:decoration-solid decoration-muted-foreground cursor-help">
									Current Price
								</TooltipTrigger>
								<TooltipContent className="max-w-80 text-pretty normal-case">
									{DEFINITIONS["Current Price"]}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</TableCell>
					<TableCell>
						<span className="font-semibold">
							{Number.parseFloat(
								Math.max(0, Number(formatEther(currentPrice))).toFixed(4),
							).toString()}
						</span>
						<span className="text-muted-foreground">
							{chain?.nativeCurrency?.symbol ?? CHAIN_DENOM}
						</span>
					</TableCell>
				</TableRow>

				<TableRow>
					<TableCell>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className="capitalize underline-offset-4 underline decoration-dotted hover:decoration-solid decoration-muted-foreground cursor-help">
									Reserved Price
								</TooltipTrigger>
								<TooltipContent className="max-w-80 text-pretty normal-case">
									{DEFINITIONS["Reserved Price"]}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</TableCell>
					<TableCell>
						<span className="font-semibold">
							{Number.parseFloat(
								Math.max(0, Number(formatEther(reservedPrice))).toFixed(4),
							).toString()}
						</span>
						<span className="text-muted-foreground">
							{chain?.nativeCurrency?.symbol ?? CHAIN_DENOM}
						</span>
					</TableCell>
				</TableRow>

				{children}
			</TableBody>
		</Table>
	);
};

export default AuctionPriceTable;
