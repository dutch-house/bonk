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

