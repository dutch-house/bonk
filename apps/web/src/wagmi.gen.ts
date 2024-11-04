import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// auctionInitiator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const auctionInitiatorAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'auction',
        internalType: 'contract AuctionMarket',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AuctionCreated',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenName', internalType: 'string', type: 'string' },
      { name: 'tokenSymbol', internalType: 'string', type: 'string' },
      { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'startPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'reservedPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createAuction',
    outputs: [
      { name: '', internalType: 'contract AuctionMarket', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllAuctions',
    outputs: [
      { name: '', internalType: 'contract AuctionMarket[]', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'creator', internalType: 'address', type: 'address' }],
    name: 'getAuctionsByCreator',
    outputs: [
      { name: '', internalType: 'contract AuctionMarket[]', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
] as const

export const auctionInitiatorAddress =
  '0xCCf336000738089f5b9831E9Afeb9e31b3CEcf96' as const

export const auctionInitiatorConfig = {
  address: auctionInitiatorAddress,
  abi: auctionInitiatorAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// auctionMarket
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const auctionMarketAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'tokenName', internalType: 'string', type: 'string' },
      { name: 'tokenSymbol', internalType: 'string', type: 'string' },
      { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'startPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'reservedPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'creator', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokensPurchased',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'cost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'refund',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DebugRefund',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RefundFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferFailed',
  },
  {
    type: 'function',
    inputs: [],
    name: 'distributeTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAuctionEnded',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClearingPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'bidder', internalType: 'address', type: 'address' }],
    name: 'getCommitmentByBidder',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCreator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRemainingSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReservedPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStartPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStartTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getToken',
    outputs: [
      { name: '', internalType: 'contract AuctionToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTokensDistributed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalCommitment',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'placeBid',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// auctionToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const auctionTokenAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'name_', internalType: 'string', type: 'string' },
      { name: 'symbol_', internalType: 'string', type: 'string' },
      { name: 'preMint_', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionInitiatorAbi}__
 */
export const useReadAuctionInitiator = /*#__PURE__*/ createUseReadContract({
  abi: auctionInitiatorAbi,
  address: auctionInitiatorAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionInitiatorAbi}__ and `functionName` set to `"getAllAuctions"`
 */
export const useReadAuctionInitiatorGetAllAuctions =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionInitiatorAbi,
    address: auctionInitiatorAddress,
    functionName: 'getAllAuctions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionInitiatorAbi}__ and `functionName` set to `"getAuctionsByCreator"`
 */
export const useReadAuctionInitiatorGetAuctionsByCreator =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionInitiatorAbi,
    address: auctionInitiatorAddress,
    functionName: 'getAuctionsByCreator',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link auctionInitiatorAbi}__
 */
export const useWriteAuctionInitiator = /*#__PURE__*/ createUseWriteContract({
  abi: auctionInitiatorAbi,
  address: auctionInitiatorAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link auctionInitiatorAbi}__ and `functionName` set to `"createAuction"`
 */
export const useWriteAuctionInitiatorCreateAuction =
  /*#__PURE__*/ createUseWriteContract({
    abi: auctionInitiatorAbi,
    address: auctionInitiatorAddress,
    functionName: 'createAuction',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link auctionInitiatorAbi}__
 */
export const useSimulateAuctionInitiator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: auctionInitiatorAbi,
    address: auctionInitiatorAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link auctionInitiatorAbi}__ and `functionName` set to `"createAuction"`
 */
export const useSimulateAuctionInitiatorCreateAuction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: auctionInitiatorAbi,
    address: auctionInitiatorAddress,
    functionName: 'createAuction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link auctionInitiatorAbi}__
 */
export const useWatchAuctionInitiatorEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: auctionInitiatorAbi,
    address: auctionInitiatorAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link auctionInitiatorAbi}__ and `eventName` set to `"AuctionCreated"`
 */
export const useWatchAuctionInitiatorAuctionCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: auctionInitiatorAbi,
    address: auctionInitiatorAddress,
    eventName: 'AuctionCreated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__
 */
export const useReadAuctionMarket = /*#__PURE__*/ createUseReadContract({
  abi: auctionMarketAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getAuctionEnded"`
 */
export const useReadAuctionMarketGetAuctionEnded =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getAuctionEnded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getClearingPrice"`
 */
export const useReadAuctionMarketGetClearingPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getClearingPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getCommitmentByBidder"`
 */
export const useReadAuctionMarketGetCommitmentByBidder =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getCommitmentByBidder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getCreator"`
 */
export const useReadAuctionMarketGetCreator =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getCreator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getCurrentPrice"`
 */
export const useReadAuctionMarketGetCurrentPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getCurrentPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getDuration"`
 */
export const useReadAuctionMarketGetDuration =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getDuration',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getRemainingSupply"`
 */
export const useReadAuctionMarketGetRemainingSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getRemainingSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getReservedPrice"`
 */
export const useReadAuctionMarketGetReservedPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getReservedPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getStartPrice"`
 */
export const useReadAuctionMarketGetStartPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getStartPrice',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getStartTime"`
 */
export const useReadAuctionMarketGetStartTime =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getStartTime',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getToken"`
 */
export const useReadAuctionMarketGetToken = /*#__PURE__*/ createUseReadContract(
  { abi: auctionMarketAbi, functionName: 'getToken' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getTokensDistributed"`
 */
export const useReadAuctionMarketGetTokensDistributed =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getTokensDistributed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getTotalCommitment"`
 */
export const useReadAuctionMarketGetTotalCommitment =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getTotalCommitment',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"getTotalSupply"`
 */
export const useReadAuctionMarketGetTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionMarketAbi,
    functionName: 'getTotalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link auctionMarketAbi}__
 */
export const useWriteAuctionMarket = /*#__PURE__*/ createUseWriteContract({
  abi: auctionMarketAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"distributeTokens"`
 */
export const useWriteAuctionMarketDistributeTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: auctionMarketAbi,
    functionName: 'distributeTokens',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"placeBid"`
 */
export const useWriteAuctionMarketPlaceBid =
  /*#__PURE__*/ createUseWriteContract({
    abi: auctionMarketAbi,
    functionName: 'placeBid',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteAuctionMarketWithdraw =
  /*#__PURE__*/ createUseWriteContract({
    abi: auctionMarketAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link auctionMarketAbi}__
 */
export const useSimulateAuctionMarket = /*#__PURE__*/ createUseSimulateContract(
  { abi: auctionMarketAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"distributeTokens"`
 */
export const useSimulateAuctionMarketDistributeTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: auctionMarketAbi,
    functionName: 'distributeTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"placeBid"`
 */
export const useSimulateAuctionMarketPlaceBid =
  /*#__PURE__*/ createUseSimulateContract({
    abi: auctionMarketAbi,
    functionName: 'placeBid',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link auctionMarketAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateAuctionMarketWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: auctionMarketAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link auctionMarketAbi}__
 */
export const useWatchAuctionMarketEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: auctionMarketAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link auctionMarketAbi}__ and `eventName` set to `"DebugRefund"`
 */
export const useWatchAuctionMarketDebugRefundEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: auctionMarketAbi,
    eventName: 'DebugRefund',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link auctionMarketAbi}__ and `eventName` set to `"RefundFailed"`
 */
export const useWatchAuctionMarketRefundFailedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: auctionMarketAbi,
    eventName: 'RefundFailed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link auctionMarketAbi}__ and `eventName` set to `"TransferFailed"`
 */
export const useWatchAuctionMarketTransferFailedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: auctionMarketAbi,
    eventName: 'TransferFailed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionTokenAbi}__
 */
export const useReadAuctionToken = /*#__PURE__*/ createUseReadContract({
  abi: auctionTokenAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadAuctionTokenAllowance = /*#__PURE__*/ createUseReadContract(
  { abi: auctionTokenAbi, functionName: 'allowance' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadAuctionTokenBalanceOf = /*#__PURE__*/ createUseReadContract(
  { abi: auctionTokenAbi, functionName: 'balanceOf' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadAuctionTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: auctionTokenAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadAuctionTokenName = /*#__PURE__*/ createUseReadContract({
  abi: auctionTokenAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadAuctionTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: auctionTokenAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadAuctionTokenTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: auctionTokenAbi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link auctionTokenAbi}__
 */
export const useWriteAuctionToken = /*#__PURE__*/ createUseWriteContract({
  abi: auctionTokenAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteAuctionTokenApprove = /*#__PURE__*/ createUseWriteContract(
  { abi: auctionTokenAbi, functionName: 'approve' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteAuctionTokenBurn = /*#__PURE__*/ createUseWriteContract({
  abi: auctionTokenAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteAuctionTokenTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: auctionTokenAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteAuctionTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: auctionTokenAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link auctionTokenAbi}__
 */
export const useSimulateAuctionToken = /*#__PURE__*/ createUseSimulateContract({
  abi: auctionTokenAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateAuctionTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: auctionTokenAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateAuctionTokenBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: auctionTokenAbi,
    functionName: 'burn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateAuctionTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: auctionTokenAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link auctionTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateAuctionTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: auctionTokenAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link auctionTokenAbi}__
 */
export const useWatchAuctionTokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: auctionTokenAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link auctionTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchAuctionTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: auctionTokenAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link auctionTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchAuctionTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: auctionTokenAbi,
    eventName: 'Transfer',
  })
