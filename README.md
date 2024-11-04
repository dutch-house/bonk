### SC4053 - Blockchain Technology Project — _🃏 bonk

**🃏 bonk** is your gateway to secure, transparent and fair decentralized dutch auctions. 
This dApp (decentralised application) empowers users to participate in secure, trustless bidding—where every bid counts and decentralisation is at the core.

> Dutch auctions decentralised to bid smart and own fast.<br/>
>
> - [dApp](https://b0nk.vercel.app/)

<br/>

<p align="center">
  <img src="https://github.com/user-attachments/assets/4a9853f5-6391-4f6c-8915-6e8c178e370f" alt="Project Cover"
    width="960px"
  />
</p>


---

#### 🛠️ Installation and Set Up

- Clone repository

  ```bash
  git clone git@github.com:crystalcheong/bonk.git
  ```

- Install dependencies
  ```bash
  pnpm install
  ```

> [!IMPORTANT]
> Required environment variables in the following packages: `apps/web`, `packages/service`
>
> - Duplicate `.env.example` to create `*.env` files
>   - `.env` — The default file used to store your dev, production, and test variables
>   - `.env.local` — Overrides all environment files except the test file (including the default .env file)

- Starting the server<br/>
  **Frontend** (`apps/web`): `http://localhost:${VITE_APP_PORT}`<br/>
  **Hardhat Node** (`packages/service`): `http://localhost:8545`<br/>
  ```bash
   pnpm run dev
  ```

  In a new terminal tab, deploy the contracts<br/>
  ```bash
   cd ./packages/service
   pnpm run deploy:local
  ```

  Once deployed, update `apps/web/.env`,<br/>
  `VITE_BONK_AUCTION_INITIATOR_ADDRESS=<auction-initiator-address>`

---

#### 📦 Deployment

1. Generate ABI
```bash
cd ./apps/web
pnpm run generate
```


---

_This repository is submitted as a project work for Nanyang Technological University's [SC4053 - Blockchain Technology course](https://www.nanyangmods.com/modules/cz4153-blockchain-technology-3-0-au/)._
