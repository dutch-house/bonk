import {
	CHAIN_DECIMALS,
	CHAIN_DENOM,
	DEFINITIONS,
} from "@/data/clients/bonk/constants";
import { type Auction, AuctionStatus } from "@/data/clients/bonk/schema";
import { logger } from "@/utils/debug";
import {
	useReadAuctionMarketGetClearingPrice,
	useReadAuctionMarketGetCommitmentByBidder,
	useReadAuctionMarketGetCurrentPrice,
	useReadAuctionMarketGetRemainingSupply,
	useReadAuctionMarketGetReservedPrice,
	useReadAuctionMarketGetStartPrice,
	useReadAuctionMarketGetTokensDistributed,
	useReadAuctionMarketGetTotalCommitment,
	useReadAuctionMarketGetTotalSupply,
	useReadAuctionTokenBalanceOf,
	useWriteAuctionMarketDistributeTokens,
	useWriteAuctionMarketWithdraw,
} from "@/wagmi.gen";
import Button, {
	ButtonVariants,
	type ButtonProps,
} from "@bonk/ui/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@bonk/ui/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@bonk/ui/components/ui/table";
import { Toaster } from "@bonk/ui/components/ui/toast";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@bonk/ui/components/ui/tooltip";
import { cn, copyToClipboard } from "@bonk/ui/utils/dom";
import {
	BanknoteIcon,
	CoinsIcon,
	CopyIcon,
	CurrencyIcon,
	LoaderIcon,
	ReceiptTextIcon,
	TicketCheckIcon,
	XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import { formatEther, formatUnits } from "viem";
import { useAccount, useBalance, useWaitForTransactionReceipt } from "wagmi";

type AuctionDistribute = ButtonProps & {
	auction: Auction;
};
const AuctionDistribute = ({
	auction,
	className,
	children,
	...props
}: AuctionDistribute) => {
	//#startregion  //*======== WALLET ===========
	const { address: account, chainId, isConnected, chain } = useAccount();
	const isCreator = account === auction.creatorAddress;
	const isDistributable = isCreator && !auction.tokensDistributed;
	const isEnabled = isConnected || !account;
	//#endregion  //*======== WALLET ===========

	//#startregion  //*======== CLIENT ===========
	const { refetch } = useReadAuctionMarketGetTokensDistributed({
		address: auction.address,
		query: {
			enabled: false,
		},
	});
	const { data: totalCommitment = 0n } = useReadAuctionMarketGetTotalCommitment(
		{
			address: auction.address,
		},
	);
	const { data: reservedPrice = 0n } = useReadAuctionMarketGetReservedPrice({
		address: auction.address,
	});
	const { data: currentPrice = 0n } = useReadAuctionMarketGetCurrentPrice({
		address: auction.address,
	});
	const { data: startPrice = 0n } = useReadAuctionMarketGetStartPrice({
		address: auction.address,
	});
	const { data: clearingPrice = 0n } = useReadAuctionMarketGetClearingPrice({
		address: auction.address,
		query: {
			enabled: auction.status !== AuctionStatus.enum.ended,
		},
	});
	const { data: totalSupply = 0n } = useReadAuctionMarketGetTotalSupply({
		address: auction.address,
	});
	const { data: remainingSupply = 0n } = useReadAuctionMarketGetRemainingSupply(
		{
			address: auction.address,
		},
	);
	const { data: accountTokens = 0n } = useReadAuctionTokenBalanceOf({
		address: auction.tokenAddress,
		args: account && [account],
		query: {
			enabled: isEnabled && !isDistributable,
		},
	});
	const { data: accountCommitments = 0n } =
		useReadAuctionMarketGetCommitmentByBidder({
			address: auction.address,
			args: account && [account],
			query: {
				enabled: isEnabled && !isDistributable,
			},
		});
	const { data: balance } = useBalance({
		address: auction.tokenAddress,
		query: {
			enabled: isEnabled && isCreator && !isDistributable,
		},
	});
	const { writeContractAsync: distributeAsync, data: distributeTxHash } =
		useWriteAuctionMarketDistributeTokens();
	const { writeContractAsync: withdrawAsync, data: withdrawTxHash } =
		useWriteAuctionMarketWithdraw();
	const { refetch: refetchReceipt } = useWaitForTransactionReceipt({
		hash: distributeTxHash || withdrawTxHash,
		query: {
			enabled: !!withdrawTxHash || !!distributeTxHash,
		},
	});
	//#endregion  //*======== CLIENT ===========

	const onWithdraw = async () => {
		if (!isEnabled || isDistributable) return;
		logger(
			{ breakpoint: "AuctionDistribute/onWithdraw]" },
			{
				account,
			},
		);

		const txToast = toast("useWriteAuctionMarketWithdraw");

		toast.loading("Loading...", {
			id: txToast,
			icon: <LoaderIcon className="size-4" />,
			description: "Confirm the transaction in your wallet",
		});

		await withdrawAsync(
			{
				account,
				chainId,
				address: auction.address,
			},
			{
				onSuccess: async (hash) => {
					logger(
						{ breakpoint: "AuctionDistribute/onWithdraw/success]" },
						{
							hash,
						},
					);
					toast.success("Transaction Confirmed", {
						id: txToast,
						icon: <TicketCheckIcon className="size-4" />,
						description: "Request was confirmed",
					});

					toast.loading("Sending Transaction...", {
						id: txToast,
						icon: <LoaderIcon className="size-4" />,
					});

					const receipt = await refetchReceipt();

					if (receipt.isSuccess) {
						toast.success("Transaction Success", {
							id: txToast,
							icon: <TicketCheckIcon className="size-4" />,
							description: "Request was successfully completed",
						});
					}

					refetch();
				},
				onError: (error) =>
					toast.error("Transaction Failed...", {
						id: txToast,
						icon: <XCircleIcon className="size-4" />,
						description: "Request was cancelled/failed to complete",
						action: (
							<Button
								size={"icon"}
								variant={"outline"}
								onClick={() => {
									copyToClipboard(
										`AuctionDistribute/onWithdraw/error: ${error.message}`,
									);
									toast.dismiss();
								}}
								className="ml-auto"
							>
								<CopyIcon className="size-4" />
							</Button>
						),
					}),
			},
		);
	};
	const onDistribute = async () => {
		if (!isEnabled || !isDistributable) return;
		logger(
			{ breakpoint: "AuctionDistribute/onDistribute]" },
			{
				account,
			},
		);

		const txToast = toast("useWriteAuctionMarketDistributeTokens");

		toast.loading("Loading...", {
			id: txToast,
			icon: <LoaderIcon className="size-4" />,
			description: "Confirm the transaction in your wallet",
		});

		await distributeAsync(
			{
				account,
				chainId,
				address: auction.address,
			},
			{
				onSuccess: async (hash) => {
					logger(
						{ breakpoint: "AuctionCreateForm/onSubmit/success]" },
						{
							hash,
						},
					);
					toast.success("Transaction Confirmed", {
						id: txToast,
						icon: <TicketCheckIcon className="size-4" />,
						description: "Request was confirmed",
					});

					toast.loading("Sending Transaction...", {
						id: txToast,
						icon: <LoaderIcon className="size-4" />,
					});

					const receipt = await refetchReceipt();

					if (receipt.isSuccess) {
						toast.success("Transaction Success", {
							id: txToast,
							icon: <TicketCheckIcon className="size-4" />,
							description: "Request was successfully completed",
						});
					}
					refetch();
				},
				onError: (error) =>
					toast.error("Transaction Failed...", {
						id: txToast,
						icon: <XCircleIcon className="size-4" />,
						description: "Request was cancelled/failed to complete",
						action: (
							<Button
								size={"icon"}
								variant={"outline"}
								onClick={() => {
									copyToClipboard(`Error/AuctionDistribute: ${error.message}`);
									toast.dismiss();
								}}
								className="ml-auto"
							>
								<CopyIcon className="size-4" />
							</Button>
						),
					}),
			},
		);
	};

	return (
		<Dialog>
			<DialogTrigger
				className={cn(
					ButtonVariants({
						size: "sm",
					}),
					"space-x-2 group",
					className,
				)}
				{...props}
			>
				{children ?? (
					<>
						<ReceiptTextIcon className="size-4 group-hover:rotate-45" />
						<span>Summary</span>
					</>
				)}
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Auction Summary</DialogTitle>
					<DialogDescription className="text-balance max-w-prose">
						{isDistributable
							? "Review auction outcomes and distribute tokens to successful bidders."
							: "Review your contribution and expected token allocation from this auction."}
					</DialogDescription>
				</DialogHeader>

				<Table>
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
						<TableRow>
							<TableCell>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger className="capitalize underline-offset-4 underline decoration-dotted hover:decoration-solid decoration-muted-foreground cursor-help">
											Start Price
										</TooltipTrigger>
										<TooltipContent className="max-w-80 text-pretty normal-case">
											{DEFINITIONS["Start Price"]}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</TableCell>
							<TableCell>
								<span className="font-semibold">
									{Number.parseFloat(
										Math.max(0, Number(formatEther(startPrice))).toFixed(4),
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
										Math.max(
											0,
											Number(formatEther(clearingPrice)),
											Number(formatEther(currentPrice)),
										).toFixed(4),
									).toString()}
								</span>
								<span className="text-muted-foreground">
									{chain?.nativeCurrency?.symbol ?? CHAIN_DENOM}
								</span>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>

				<Table>
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
											Total Supply
										</TooltipTrigger>
										<TooltipContent className="max-w-80 text-pretty normal-case">
											{DEFINITIONS["Total Supply"]}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</TableCell>
							<TableCell>
								<span className="font-semibold">
									{formatUnits(totalSupply, CHAIN_DECIMALS)}
								</span>
								<span className="text-muted-foreground">
									{auction.tokenSymbol}
								</span>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Remaining Supply</TableCell>
							<TableCell>
								<span className="font-semibold">
									{formatUnits(remainingSupply, CHAIN_DECIMALS)}
								</span>
								<span className="text-muted-foreground">
									{auction.tokenSymbol}
								</span>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								{auction.tokensDistributed
									? "Distributed Supply"
									: "Distributable Supply"}
							</TableCell>
							<TableCell>
								<span className="font-semibold">
									{formatUnits(remainingSupply, CHAIN_DECIMALS)}
								</span>
								<span className="text-muted-foreground">
									{auction.tokenSymbol}
								</span>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>

				<Table>
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
								<CurrencyIcon className="size-5 text-muted-foreground" />
								{!isCreator && "Your "}
								{auction.tokensDistributed
									? "Net Commitment (after refund)"
									: "Total Commitment"}
							</TableCell>
							<TableCell>
								<span className="font-semibold">
									{Number.parseFloat(
										Math.max(
											0,
											Number(
												formatEther(
													isCreator ? totalCommitment : accountCommitments,
												),
											),
										).toFixed(4),
									).toString()}
								</span>
								<span className="text-muted-foreground">
									{chain?.nativeCurrency?.symbol ?? CHAIN_DENOM}
								</span>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<CoinsIcon className="size-5 text-muted-foreground" />
								<span>
									{!isCreator &&
										`Your ${
											auction.tokensDistributed
												? "Tokens Received"
												: "Estimated Allocation"
										}`}
									{isCreator &&
										(auction.tokensDistributed
											? "Tokens Distributed"
											: "Tokens Allocated")}
								</span>
							</TableCell>
							<TableCell>
								<span className="font-semibold">
									{isCreator &&
										Number.parseFloat(
											Math.max(
												0,
												Number(formatEther(totalSupply - remainingSupply)),
											).toFixed(4),
										).toString()}

									{!isCreator &&
										auction.tokensDistributed &&
										Number.parseFloat(
											Math.max(0, Number(formatEther(accountTokens))).toFixed(
												4,
											),
										).toString()}

									{!isCreator &&
										!auction.tokensDistributed &&
										Number.parseFloat(
											clearingPrice > 0
												? Math.max(
														0,
														Number(accountCommitments / clearingPrice),
													).toFixed(4)
												: "0",
										).toString()}
								</span>
								<span className="text-muted-foreground">
									{auction.tokenSymbol}
								</span>
							</TableCell>
						</TableRow>

						{isCreator && (
							<TableRow>
								<TableCell>
									<BanknoteIcon className="size-5 text-muted-foreground" />
									<span>Balance Funds</span>
								</TableCell>
								<TableCell>
									<span className="font-semibold">
										{Number.parseFloat(
											Math.max(
												0,
												Number(
													formatUnits(
														balance?.value ?? 0n,
														balance?.decimals ?? CHAIN_DECIMALS,
													),
												),
											).toFixed(4),
										).toString()}
									</span>
									<span className="text-muted-foreground">
										{balance?.symbol ??
											chain?.nativeCurrency?.symbol ??
											CHAIN_DENOM}
									</span>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{isCreator && (
					<DialogFooter className="flex flex-row flex-wrap place-items-center place-content-between gap-x-4 gap-y-2 w-full *:flex-1">
						<Button
							size="sm"
							className={cn("space-x-2 group", className)}
							onClick={onDistribute}
							disabled={!isEnabled || !isDistributable}
						>
							<span>Distribute Tokens</span>
						</Button>

						<Button
							size="sm"
							className={cn("space-x-2 group", className)}
							onClick={onWithdraw}
							disabled={
								!isEnabled || isDistributable || !Number(balance?.value)
							}
						>
							<span>Withdraw Funds</span>
						</Button>
					</DialogFooter>
				)}

				<Toaster richColors position="bottom-center" />
			</DialogContent>
		</Dialog>
	);
};

export default AuctionDistribute;
