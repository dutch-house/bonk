# Bonk

`packages/service`
```bash
pnpm run compile
pnpm run test
pnpm run node
```

in another tab,
```bash
pnpm run deploy:local
```

in apps/web/.env,
`VITE_BONK_AUCTION_INITIATOR_ADDRESS=<the deployed AuctionInitiator address>`

---

`apps/web`

```bash
pnpm run generate
pnpm run dev
```


---

Faucets
- https://faucetlink.to/sepolia
- https://cloud.google.com/application/web3/faucet/ethereum/sepolia


Dependencies Issues
- https://github.com/NomicFoundation/hardhat/issues/4762#issuecomment-2352671446