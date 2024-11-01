import { getTruncatedAddress } from "@/utils/account";
import AnimateFade from "@bonk/ui/components/flairs/animate.fade";
import BackgroundSquares from "@bonk/ui/components/flairs/background.squares";
import Button, {
	type ButtonProps,
	ButtonVariants,
} from "@bonk/ui/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@bonk/ui/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@bonk/ui/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@bonk/ui/components/ui/popover";
import { cn } from "@bonk/ui/utils/dom";
import { CheckIcon, ShieldQuestionIcon, WalletIcon } from "lucide-react";
import { type HTMLAttributes, useState } from "react";
import { toast } from "sonner";
import type { Chain } from "viem";
import { localhost } from "viem/chains";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";

const Wallet = () => {
	const { isConnected } = useAccount();
	return !isConnected ? <Wallet.Connect /> : <Wallet.Account />;
};
export default Wallet;

type WalletConnect = ButtonProps;
const WalletConnect = ({ className, children, ...props }: WalletConnect) => {
	const { isConnected } = useAccount();
	const { connectors, connectAsync } = useConnect();
	const { switchChainAsync } = useSwitchChain();

	if (isConnected) return null;
	return (
		<Dialog>
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
						<WalletIcon className="size-4" />
						<span>Connect Wallet</span>
					</>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Connect Wallet</DialogTitle>
					<DialogDescription>
						Select your preferred connection method to participate and start
						bidding.
					</DialogDescription>
				</DialogHeader>

				<section
					className={cn(
						"flex flex-col gap-2 place-items-center place-content-center",
						"*:w-full",
					)}
				>
					{connectors.map((connector) => (
						<Button
							key={`wallet-connector-${connector.uid}`}
							onClick={async () => {
								const chainId = localhost.id;
								const result = await connectAsync({ connector, chainId });
								if (result.chainId !== chainId) {
									await switchChainAsync({ chainId });
								}
							}}
						>
							{connector.name}
						</Button>
					))}
				</section>
			</DialogContent>
		</Dialog>
	);
};
Wallet.Connect = WalletConnect;

const WalletAccount = () => {
	const { address, isConnected } = useAccount();
	const { disconnect } = useDisconnect();

	if (!isConnected) return null;
	return (
		<Button
			className={cn(
				ButtonVariants({
					size: "sm",
				}),
				"group transition-all",
			)}
			onClick={() => disconnect()}
		>
			<WalletIcon className="size-4" />

			<span className="group-hover:hidden text-pretty w-24">
				{getTruncatedAddress({ address })}
			</span>
			<span className="hidden group-hover:block text-pretty w-24">
				Disconnect
			</span>
		</Button>
	);
};
Wallet.Account = WalletAccount;

type WalletChains = ButtonProps;
const WalletChains = ({ className, children, ...props }: WalletChains) => {
	//#startregion  //*======== CHAIN ===========
	const { chains, switchChainAsync } = useSwitchChain();
	const { chain: currentChain, isConnected, isConnecting } = useAccount();
	//#endregion  //*======== CHAIN ===========

	//#startregion  //*======== STATES ===========
	const [open, setOpen] = useState<boolean>(false);
	const [chainId, setChainId] = useState<Chain["id"]>();
	//#endregion  //*======== STATES ===========

	const onSwitch = async (id: typeof chainId) => {
		if (!id || currentChain?.id === id) return;

		toast.promise(switchChainAsync({ chainId: id }), {
			loading: "Switching...",
			success: (data: Chain) => {
				setChainId(data.id);
				return `Connected to ${data.name}`;
			},
			error: "Oops, something went wrong",
		});
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				className={cn(
					ButtonVariants({
						variant: "ghost",
						size: "sm",
					}),
					"space-x-2 capitalize",
					className,
				)}
				{...props}
			>
				<span className="relative flex size-2">
					<span
						className={cn(
							"animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
							isConnected ? "bg-green-400" : "bg-red-400",
							isConnecting && "bg-orange-400",
						)}
					/>
					<span
						className={cn(
							"relative inline-flex rounded-full size-2 ",
							isConnected && !!currentChain ? "bg-green-500" : "bg-red-500",
							isConnecting && "bg-orange-500",
						)}
					/>
				</span>
				<span>{currentChain?.name ?? "Not Connected"}</span>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandInput placeholder="Search chains..." className="h-9" />
					<CommandList>
						<CommandEmpty>No chain found.</CommandEmpty>
						<CommandGroup>
							{chains.map((chain) => (
								<CommandItem
									key={`switch-chain-${chain.id}`}
									value={`${chain.id}`}
									onSelect={(idStr) => {
										const id = +idStr;
										setOpen(false);
										onSwitch(id);
									}}
								>
									{chain.name}
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4",
											currentChain?.id === chain.id
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
Wallet.Chains = WalletChains;

type WalletRequired = HTMLAttributes<HTMLDivElement>;
export const WalletRequired = ({
	className,
	children,
	...props
}: WalletRequired) => {
	return (
		<>
			<BackgroundSquares
				duration={3}
				repeatDelay={1}
				className={cn(
					"opacity-20",
					"[mask-image:radial-gradient(80vw_circle_at_center,white,transparent)]",
				)}
			/>

			<AnimateFade
				delay={0.25}
				inView
				className={cn(
					"w-full",
					"flex flex-col place-items-center gap-y-4",
					"my-8",
					className,
				)}
				{...props}
			>
				<div
					className={cn(
						"bg-primary/10 rounded-full",
						"size-12",
						"flex place-items-center place-content-center",
					)}
				>
					<ShieldQuestionIcon className="text-primary size-6" />
				</div>

				<h3
					className={cn(
						"text-2xl font-bold leading-none tracking-tight text-pretty whitespace-break-spaces text-center",
						"max-sm:max-w-40",
					)}
				>
					Authentication Required
				</h3>

				<p className="text-sm text-gray-500 mb-4 text-center text-balance whitespace-break-spaces max-w-prose max-sm:px-6 sm:w-9/12">
					Looking for more? Connect your preferred wallet to unlock the secrets
					within.
				</p>

				<Wallet.Connect className="w-2/3 sm:w-2/5 max-w-prose [&>svg]:hidden" />
				{children}
			</AnimateFade>
		</>
	);
};
Wallet.Required = WalletRequired;
