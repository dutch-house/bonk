import Wallet from "@/components/layouts/wallet";
import {
	CHAIN_DECIMALS,
	CHAIN_DENOM,
	DEFINITIONS,
} from "@/data/clients/bonk/constants";
import type { Auction } from "@/data/clients/bonk/schema";
import { LogLevel, logger } from "@/utils/debug";
import { delay } from "@/utils/time";
import {
	useReadAuctionMarketGetCommitmentByBidder,
	useReadAuctionMarketGetCurrentPrice,
	useReadAuctionMarketGetRemainingSupply,
	useReadAuctionMarketGetReservedPrice,
	useWriteAuctionMarketPlaceBid,
} from "@/wagmi.gen";
import { Alert, AlertDescription } from "@bonk/ui/components/ui/alert";
import Button, {
	type ButtonProps,
	ButtonVariants,
} from "@bonk/ui/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@bonk/ui/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@bonk/ui/components/ui/form";
import Input, { InputVariants } from "@bonk/ui/components/ui/input";
import { Label } from "@bonk/ui/components/ui/label";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
	CircleDollarSignIcon,
	CoinsIcon,
	CopyIcon,
	HandIcon,
	LoaderIcon,
	PiggyBankIcon,
	TicketCheckIcon,
	TicketXIcon,
} from "lucide-react";
import { type HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatEther, formatUnits, parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { z } from "zod";

const FormSchema = z.object({
	bid: z.coerce.number().positive("Bid value must be more than 0"),
});
type FormSchema = z.infer<typeof FormSchema>;

type AuctionBidForm = HTMLAttributes<HTMLFormElement> & {
	auction: Auction;
	onFormSubmit?: (payload: FormSchema) => Promise<void>;
	onFormReset?: () => void;
};
const AuctionBidForm = ({
	auction,
	className,
	children,
	onFormSubmit,
	onFormReset,
	...props
}: AuctionBidForm) => {
	//#startregion  //*======== WALLET ===========
	const { address: account, chainId, isConnected, chain } = useAccount();
	const isBiddable = account !== auction.creatorAddress;
	const isEnabled = (isConnected || !account) && isBiddable;
	//#endregion  //*======== WALLET ===========

	//#startregion  //*======== CLIENT ===========
	const { data: reservedPrice = 0n } = useReadAuctionMarketGetReservedPrice({
		address: auction.address,
	});
	const { data: currentPrice = 0n } = useReadAuctionMarketGetCurrentPrice({
		address: auction.address,
	});
	const { data: remainingSupply = 0n, refetch } =
		useReadAuctionMarketGetRemainingSupply({
			address: auction.address,
		});
	const { data: accountCommitments = 0n } =
		useReadAuctionMarketGetCommitmentByBidder({
			address: auction.address,
			args: account && [account],
			query: {
				enabled: isEnabled && isBiddable,
			},
		});
	const { writeContractAsync, data: bidTxHash } =
		useWriteAuctionMarketPlaceBid();
	const { refetch: refetchReceipt } = useWaitForTransactionReceipt({
		hash: bidTxHash,
		query: {
			enabled: !!bidTxHash,
		},
	});
	//#endregion  //*======== CLIENT ===========

	//#startregion  //*======== FORM ===========
	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			bid: 0,
		},
	});

	const onReset = async () => {
		form.reset();
		if (onFormReset) onFormReset();
	};

	const onSubmit = async (values: FormSchema) => {
		if (!isEnabled) return;
		logger(
			{ breakpoint: "AuctionBidForm/onSubmit]" },
			{
				values,
			},
		);

		const txToast = toast("useWriteAuctionMarketPlaceBid");

		toast.loading("Loading...", {
			id: txToast,
			icon: <LoaderIcon className="size-4" />,
			description: "Confirm the transaction in your wallet",
		});

		await writeContractAsync(
			{
				account,
				chainId,
				args: [],
				value: parseEther(values.bid.toString()),
				address: auction.address,
			},
			{
				onSuccess: async (hash) => {
					logger(
						{ breakpoint: "AuctionBidForm/onSubmit/success]" },
						{
							hash,
						},
					);
					toast.info("Transaction Confirmed", {
						id: txToast,
						icon: <TicketCheckIcon className="size-4" />,
						description: "Request was confirmed",
					});

					// toast.loading("Sending Transaction...", {
					// 	id: txToast,
					// 	icon: <LoaderIcon className="size-4" />,
					// });

					const receipt = await refetchReceipt();

					if (receipt.isSuccess) {
						toast.success("Transaction Success", {
							id: txToast,
							icon: <TicketCheckIcon className="size-4" />,
							description: "Request was successfully completed",
						});
					}

					refetch();

					if (onFormSubmit) onFormSubmit(values);
				},
				onError: (error) => {
					logger(
						{
							breakpoint: "AuctionBidForm/onSubmit/error]",
							level: LogLevel.Error,
						},
						error,
					);
					toast.error("Transaction Failed...", {
						id: txToast,
						icon: <TicketXIcon className="size-4" />,
						description: "Request was cancelled/failed to complete",
						action: (
							<Button
								size={"icon"}
								variant={"outline"}
								onClick={() => {
									copyToClipboard(`Error/AuctionBid: ${error.message}`);
									toast.dismiss();
								}}
								className="ml-auto"
							>
								<CopyIcon className="size-4" />
							</Button>
						),
					});
				},
			},
		);
	};
	//#endregion  //*======== FORM ===========

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn(
					"flex-1 min-w-full sm:min-w-fit",
					"flex flex-col gap-4",

					className,
				)}
				{...props}
			>
				<div className="grid grid-cols-3 gap-4">
					<div className="flex flex-col">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className="text-start text-sm font-medium text-muted-foreground capitalize underline-offset-4 underline decoration-dotted hover:decoration-solid decoration-muted-foreground cursor-help">
									Current Price
								</TooltipTrigger>
								<TooltipContent className="max-w-80 text-pretty normal-case">
									{DEFINITIONS["Current Price"]}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<p className="text-2xl font-bold">
							{Number.parseFloat(
								Math.max(0, Number(formatEther(currentPrice))).toFixed(4),
							).toString()}
							&nbsp;
							<span className="text-xs text-muted-foreground">
								{chain?.nativeCurrency?.symbol ?? CHAIN_DENOM}
							</span>
						</p>
					</div>

					<div className="flex flex-col">
						<span className="text-sm font-medium text-muted-foreground">
							Net Commitment
						</span>
						<p className="text-2xl font-bold">
							{Number.parseFloat(
								Math.max(0, Number(formatEther(accountCommitments))).toFixed(4),
							).toString()}
							&nbsp;
							<span className="text-xs text-muted-foreground">
								{chain?.nativeCurrency?.symbol ?? CHAIN_DENOM}
							</span>
						</p>
					</div>

					<div className="flex flex-col">
						<span className="text-sm font-medium text-muted-foreground">
							Tokens Allocated
						</span>
						<p className="text-2xl font-bold">
							~
							{Number.parseFloat(
								currentPrice > 0
									? Math.max(
											0,
											Number(accountCommitments / currentPrice),
										).toFixed(4)
									: "0",
							)}
							&nbsp;
							<span className="text-xs text-muted-foreground">
								{auction.tokenSymbol}
							</span>
						</p>
					</div>
				</div>

				<FormField
					control={form.control}
					name="bid"
					render={({ field }) => (
						<FormItem className="flex-1 min-w-full sm:min-w-fit">
							<FormLabel
								className={cn(
									"flex flex-wrap flex-row place-items-center place-content-between gap-y-2 gap-x-6",
								)}
							>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger className="capitalize underline-offset-4 underline decoration-dotted hover:decoration-solid decoration-muted-foreground cursor-help">
											Bid Commitment
										</TooltipTrigger>
										<TooltipContent className="max-w-80 text-pretty">
											{DEFINITIONS["Bid Commitment"]}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<FormDescription className="text-pretty leading-none">
									Reserved Price:&nbsp;
									{Number.parseFloat(
										Math.max(0, Number(formatEther(reservedPrice))).toFixed(4),
									).toString()}
									&nbsp;
									{chain?.nativeCurrency?.symbol ?? CHAIN_DENOM}
								</FormDescription>
							</FormLabel>
							<FormControl>
								<div
									className={cn(
										InputVariants(),
										"flex w-full place-items-center space-x-2",
										"focus-within:ring-1 focus-within:ring-ring",
									)}
								>
									<Input
										type="number"
										{...field}
										className={cn(
											"border-none !p-0 h-full",
											"focus-visible:ring-0 shadow-none",
										)}
										step={0.0001}
										min={Math.max(0, Number(formatEther(reservedPrice)))}
										max={Math.max(0, Number(formatEther(currentPrice)))}
										onFocus={(e) => {
											if (field.value.toString() === "0")
												e.currentTarget.value = "";
										}}
										onBlur={(e) => {
											if (Number.isNaN(e.currentTarget.valueAsNumber))
												e.currentTarget.value = "0";
											field.onChange(e);
										}}
									/>
									<Label htmlFor={field.name}>
										{chain?.nativeCurrency?.symbol ?? CHAIN_DENOM}
									</Label>
								</div>
							</FormControl>
							<FormMessage />

							<aside className="flex flex-row place-items-center place-content-between gap-2 *:flex-1 w-full">
								{Object.entries({
									min: reservedPrice,
									max: currentPrice,
								}).map(([label, preset]) => {
									const value = Number.parseFloat(
										Math.max(0, Number(formatEther(preset))).toFixed(4),
									);

									return (
										<Button
											key={`preset-${label}-${preset}`}
											type="button"
											variant={
												value - field.value === 0 ? "default" : "secondary"
											}
											onClick={() =>
												form.setValue(field.name, value, {
													shouldValidate: true,
												})
											}
											className="capitalize"
										>
											{label}
										</Button>
									);
								})}
							</aside>
						</FormItem>
					)}
				/>

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
								<CoinsIcon className="size-5 text-muted-foreground" />
								<span>Estimated Allocation</span>
							</TableCell>
							<TableCell>
								<span className="font-semibold">
									{Number.parseFloat(
										currentPrice > 0
											? Math.max(
													0,
													form.getValues("bid") /
														Number(formatEther(currentPrice)),
												).toFixed(4)
											: "0",
									).toString()}
								</span>
								<span className="text-muted-foreground">
									{auction.tokenSymbol}
								</span>
							</TableCell>
						</TableRow>

						{accountCommitments > 0n && form.getValues("bid") > 0 && (
							<TableRow className="!place-items-start">
								<TableCell>
									<CircleDollarSignIcon className="size-5 text-muted-foreground" />
									<span>Total Allocation </span>
								</TableCell>
								<TableCell className="!flex-col space-y-1 *:space-x-1 *:leading-none">
									<p>
										<span className="font-semibold">
											&#8776;&nbsp;
											{Number.parseFloat(
												currentPrice > 0
													? Math.max(
															0,
															// (Number(accountCommitments / currentPrice)) + (form.getValues("bid") / Number(formatEther(currentPrice))),
															Number(accountCommitments / currentPrice) +
																form.getValues("bid") /
																	Number(formatEther(currentPrice)),
														).toFixed(4)
													: "0",
											)}
										</span>
										<span className="text-muted-foreground">
											{auction.tokenSymbol}
										</span>
									</p>
								</TableCell>
							</TableRow>
						)}

						<TableRow>
							<TableCell>
								<PiggyBankIcon className="size-5 text-muted-foreground" />
								<span>Remaining Supply</span>
							</TableCell>
							<TableCell>
								<span className="font-semibold">
									~&nbsp;
									{Math.ceil(
										Number.parseFloat(
											Math.max(
												0,
												Number(
													formatUnits(
														remainingSupply,
														chain?.nativeCurrency?.decimals ?? CHAIN_DECIMALS,
													),
												),
											).toFixed(4),
										),
									)}
								</span>
								<span className="text-muted-foreground">
									{auction.tokenSymbol}
								</span>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>

				{children}

				{!isBiddable && (
					<Alert variant={"destructive"}>
						<AlertDescription className="flex flex-row place-items-center gap-2 w-full">
							<ExclamationTriangleIcon className="size-4" />
							<p className="!leading-tight">
								As the creator, you are not permitted to participate in bidding.
							</p>
						</AlertDescription>
					</Alert>
				)}

				<div className="flex flex-row flex-wrap gap-2 place-items-center place-content-end">
					{isConnected ? (
						<Button
							type="submit"
							disabled={
								form.formState.isSubmitting ||
								!isEnabled ||
								!form.formState.isValid
							}
							className="space-x-2"
						>
							{form.formState.isSubmitting && (
								<ReloadIcon className="size-4 animate-spin" />
							)}
							<span>Submit</span>
						</Button>
					) : (
						<Wallet.Connect
							className={cn(
								ButtonVariants({
									size: "default",
								}),
							)}
						/>
					)}

					<Button
						type="button"
						disabled={form.formState.isSubmitting}
						onClick={onReset}
						variant={"outline"}
						className="space-x-2"
					>
						{form.formState.isSubmitting && (
							<ReloadIcon className="size-4 animate-spin" />
						)}
						<span>Reset</span>
					</Button>
				</div>
			</form>
		</Form>
	);
};

type AuctionBid = ButtonProps & {
	auction: Auction;
};
const AuctionBid = ({ auction, className, children, ...props }: AuctionBid) => {
	//#startregion  //*======== STATE ===========
	const [open, setOpen] = useState<boolean>(false);
	//#endregion  //*======== STATE ===========

	return (
		<Dialog open={open} onOpenChange={setOpen}>
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
						<HandIcon className="size-4 group-hover:rotate-12" />
						<span>Bid</span>
					</>
				)}
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Place Bid</DialogTitle>
					<DialogDescription>
						Participate in the auction by entering your bid amount. Ensure your
						bid meets the minimum requirements.
					</DialogDescription>
				</DialogHeader>

				<AuctionBid.Form
					auction={auction}
					onFormSubmit={async () => {
						await delay();
						setOpen(false);
						return;
					}}
				/>
				<Toaster richColors position="bottom-center" />
			</DialogContent>
		</Dialog>
	);
};

export default AuctionBid;
AuctionBid.Form = AuctionBidForm;
