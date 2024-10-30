import Wallet from "@/components/layouts/wallet";
import { logger } from "@/utils/debug";
import { delay } from "@/utils/time";
import {
	useReadAuctionInitiatorGetAllAuctions,
	useWriteAuctionInitiatorCreateAuction,
} from "@/wagmi.gen";
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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@bonk/ui/components/ui/form";
import Input from "@bonk/ui/components/ui/input";
import { Toaster } from "@bonk/ui/components/ui/toast";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@bonk/ui/components/ui/tooltip";
import { cn, copyToClipboard } from "@bonk/ui/utils/dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
	CopyIcon,
	HammerIcon,
	LoaderIcon,
	TicketCheckIcon,
	TicketXIcon,
} from "lucide-react";
import { type HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { z } from "zod";

const FormSchema = z.object({
	name: z.string().trim().min(1).max(10),
	symbol: z.string().trim().toUpperCase().min(3).max(5),
	totalSupply: z.coerce.number().int().positive().min(100).default(1000),
	startPrice: z.coerce.number().positive().min(1).default(1),
	reservedPrice: z.coerce.number().positive().default(0.5),
});
type FormSchema = z.infer<typeof FormSchema>;

type AuctionCreateForm = HTMLAttributes<HTMLFormElement> & {
	onFormSubmit?: (payload: FormSchema) => Promise<void>;
	onFormReset?: () => void;
};
const AuctionCreateForm = ({
	className,
	children,
	onFormSubmit,
	onFormReset,
	...props
}: AuctionCreateForm) => {
	//#startregion  //*======== WALLET ===========
	const { address: account, chainId, isConnected } = useAccount();
	const isEnabled = isConnected || !account;
	//#endregion  //*======== WALLET ===========

	//#startregion  //*======== CLIENT ===========
	const { refetch } = useReadAuctionInitiatorGetAllAuctions();
	const { writeContractAsync } = useWriteAuctionInitiatorCreateAuction();
	//#endregion  //*======== CLIENT ===========

	//#startregion  //*======== FORM ===========
	const form = useForm<FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: "",
			symbol: "",
			totalSupply: 1000,
			startPrice: 1,
			reservedPrice: 0.5,
		},
	});

	const onReset = async () => {
		form.reset();
		if (onFormReset) onFormReset();
	};

	const onSubmit = async (values: FormSchema) => {
		if (!isEnabled) return;
		logger(
			{ breakpoint: "AuctionCreateForm/onSubmit]" },
			{
				values,
			},
		);

		const txToast = toast("useWriteAuctionInitiatorCreateAuction");

		toast.loading("Loading...", {
			id: txToast,
			icon: <LoaderIcon className="size-4" />,
			description: "Confirm the transaction in your wallet",
		});

		await writeContractAsync(
			{
				account,
				chainId,
				args: [
					values.name,
					values.symbol,
					parseEther(values.totalSupply.toString()),
					parseEther(values.startPrice.toString()),
					parseEther(values.reservedPrice.toString()),
				],
			},
			{
				onSuccess: (hash) => {
					logger(
						{ breakpoint: "AuctionCreateForm/onSubmit/success]" },
						{
							hash,
						},
					);
					toast.success("Transaction Success...", {
						id: txToast,
						icon: <TicketCheckIcon className="size-4" />,
						description: "Request was successfully completed",
						// action: (
						// 	<Button
						// 		size={"icon"}
						// 		variant={"outline"}
						// 		onClick={() => {
						// 			copyToClipboard(hash);
						// 			toast.dismiss();
						// 		}}
						// 		className="ml-auto"
						// 	>
						// 		<CopyIcon className="size-4" />
						// 	</Button>
						// ),
					});

					refetch();
					if (onFormSubmit) onFormSubmit(values);
				},
				onError: (error) =>
					toast.error("Transaction Failed...", {
						id: txToast,
						icon: <TicketXIcon className="size-4" />,
						description: "Request was cancelled/failed to complete",
						action: (
							<Button
								size={"icon"}
								variant={"outline"}
								onClick={() => {
									copyToClipboard(`Error/AuctionCreate: ${error.message}`);
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
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="flex-1 min-w-full sm:min-w-fit">
							<FormLabel className="capitalize">Token {field.name}</FormLabel>
							<FormControl>
								<Input
									placeholder="Name of the token e.g. Ethereum"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="symbol"
					render={({ field }) => (
						<FormItem className="flex-1 min-w-full sm:min-w-fit">
							<FormLabel className="capitalize">Token {field.name}</FormLabel>
							<FormControl>
								<Input placeholder="Acronym of the token e.g. ETH" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="totalSupply"
					render={({ field }) => (
						<FormItem className="flex-1 min-w-full sm:min-w-fit">
							<FormLabel
								className={cn(
									"flex flex-wrap flex-row place-items-center place-content-between",
								)}
							>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger className="capitalize underline-offset-4 underline decoration-dotted hover:decoration-solid cursor-help">
											Total Supply
										</TooltipTrigger>
										<TooltipContent>
											The maximum number of tokens that can exist, excluding
											those burned
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</FormLabel>
							<FormControl>
								<Input
									type="number"
									min={1}
									onMouseEnter={(e) => {
										if (field.value.toString() === "0")
											e.currentTarget.value = "";
									}}
									onMouseLeave={(e) => {
										if (!Number.isSafeInteger(e.currentTarget.valueAsNumber))
											e.currentTarget.value = "0";
										field.onChange(e);
									}}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="startPrice"
					render={({ field }) => (
						<FormItem className="flex-1 min-w-full sm:min-w-fit">
							<FormLabel
								className={cn(
									"flex flex-wrap flex-row place-items-center place-content-between",
								)}
							>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger className="capitalize underline-offset-4 underline decoration-dotted hover:decoration-solid cursor-help">
											Start Price
										</TooltipTrigger>
										<TooltipContent>
											The initial bidding price or minimum offer for a token
											sale or auction.
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</FormLabel>
							<FormControl>
								<Input
									type="number"
									step={0.5}
									onMouseEnter={(e) => {
										if (field.value.toString() === "0")
											e.currentTarget.value = "";
									}}
									onMouseLeave={(e) => {
										if (Number.isNaN(e.currentTarget.valueAsNumber))
											e.currentTarget.value = "0";
										field.onChange(e);
									}}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="reservedPrice"
					render={({ field }) => (
						<FormItem className="flex-1 min-w-full sm:min-w-fit">
							<FormLabel
								className={cn(
									"flex flex-wrap flex-row place-items-center place-content-between",
								)}
							>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger className="capitalize underline-offset-4 underline decoration-dotted hover:decoration-solid decoration-muted-foreground cursor-help">
											Reserved Price
										</TooltipTrigger>
										<TooltipContent>
											The lowest acceptable price a seller will consider, below
											which the sale won&apos;t proceed.
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</FormLabel>
							<FormControl>
								<Input
									type="number"
									step={0.5}
									onMouseEnter={(e) => {
										if (field.value.toString() === "0")
											e.currentTarget.value = "";
									}}
									onMouseLeave={(e) => {
										if (Number.isNaN(e.currentTarget.valueAsNumber))
											e.currentTarget.value = "0";
										field.onChange(e);
									}}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{children}

				<div className="flex flex-row flex-wrap gap-2 place-items-center place-content-end">
					{isConnected ? (
						<Button
							type="submit"
							disabled={form.formState.isSubmitting || !isEnabled}
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

type AuctionCreate = ButtonProps;
const AuctionCreate = ({ className, children, ...props }: AuctionCreate) => {
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
					"space-x-2",
					className,
				)}
				{...props}
			>
				{children ?? (
					<>
						<HammerIcon className="size-4" />
						<span>Create</span>
					</>
				)}
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Auction Token</DialogTitle>
					<DialogDescription>
						Set up your unique auction token to attract bidders.
					</DialogDescription>
				</DialogHeader>

				<AuctionCreate.Form
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

export default AuctionCreate;
AuctionCreate.Form = AuctionCreateForm;
