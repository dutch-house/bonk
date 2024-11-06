# SC4053 - Blockchain Technology Project — _🃏 bonk_

**🃏 bonk** is your gateway to secure, transparent and fair decentralized dutch auctions. 
This dApp (decentralised application) empowers users to participate in secure, trust-less bidding—where every bid counts and decentralisation is at the core.

> Dutch auctions decentralised to bid smart and own fast.<br/>
>
> - [🌐 dApp](https://b0nk.vercel.app/)
> - [✨ Presentation](https://youtu.be/eCf8tE585q8) / [Preview](https://youtu.be/CgLnSbSFAgQ)

<br/>

<p align="center">
  <img src="https://github.com/user-attachments/assets/4a9853f5-6391-4f6c-8915-6e8c178e370f" alt="Project Cover"
    width="960px"
  />
</p>


## Getting Started

### Pre-requisites
#### Running in a Container
- Docker
- Dev Container extension ([VSCode](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers))

#### Running Locally
- [PNPM](https://pnpm.io/installation)

### 🛠️ Installation and Set Up
1. Clone repository
    ```bash
    git clone git@github.com:crystalcheong/bonk.git
    cd bonk
    ```
2. Duplicate `.env.example` to create `.env` file
    ```bash
    cp -n packages/service/.env.example packages/service/.env
    cp -n apps/web/.env.example apps/web/.env
    ```
3. Install dependencies
    ```bash
    pnpm i
    ```
3. Start the application
    ```bash
    pnpm run dev
    ```
  > [!TIP]
  > Copy the Hardhat generated network accounts, for testing in localhost

4. In a new terminal tab, deploy smart contracts
    ```bash
    cd ./packages/service
    pnpm run deploy:local
    ```
    Once deployed, update `apps/web/.env`,<br/>
    ```env
    VITE_BONK_AUCTION_INITIATOR_ADDRESS=<auction-initiator-address>
    ```
5. Regenerate ABI
    ```bash
    cd ../../apps/web
    pnpm run generate
    ```
---

## Deployment

### 1. Deploy to Sepolia testnet on [Alchemy](https://www.alchemy.com/)
  1.1. Set the following variables in `packages/service/.env`:
  ```env
  SEPOLIA_GATEWAY_URL=https://eth-sepolia.g.alchemy.com/v2/<alchemy-api-key>
  SEPOLIA_PRIVATE_KEY=<metamask-private-key>
  ```
  1.2. Open a new terminal tab in the serivce packge
  ```bash
  cd packages/service
  ```
  1.3. Compile and test the smart contracts
  ```bash
  pnpm run build
  pnpm run test
  ```
  1.4. Deploy to Sepolia testnet
  ```bash
  pnpm run deploy:sepolia
  ```

### 2. Host web application on Vercel
  1.1. Set the following variables in `apps/web/.env`:
  ```env
  VITE_ALCHEMY_API_KEY=<alchemy-api-key>
  VITE_BONK_AUCTION_INITIATOR_ADDRESS=<deployed-auction-initiator-address>
  ```
  1.2. Open a new terminal tab in the web packge
  ```bash
  cd apps/web
  ```
  1.3. Build the project and generate the ABI Hooks
  ```bash
  pnpm run build
  pnpm run generate
  ```
  1.4. Deploy to [Vercel](https://vercel.com/docs/frameworks/vite)

---

## Project Structure

**Frontend (`apps/web`)**<br/>
Built on TypeScript with React and Vite bundling. Wagmi dependency to manage wallet connections, fully type-safe interactions with the RPC, and to generate ABI directly from the deployed contract address. 

**Smart Contracts (`packages/service`)**<br/>
containing our Solidity smart contracts, test scripts and typings generated with Typechain that the frontend references directly

![Untitled-2024-11-06-0946 (1)](https://github.com/user-attachments/assets/916e58bd-7773-4ee9-86cb-42e868a509b0)
 
## How the Contracts Work
![Untitled-2024-11-06-0946](https://github.com/user-attachments/assets/5a0700d9-e4a5-4def-b101-ed559079bb5c)

**AuctionInitiator**<br/> 
This contract allows anyone to create a new auction. It tracks all auctions created by different users, acting as the starting point for every new auction process.

**AuctionMarket**<br/> 
This contract handles the auction mechanics. It manages the bidding process, tracks token commitments, calculates clearing prices, and distributes tokens at the end of the auction. Essentially, it’s the heart of the auction operation.

**AuctionToken**<br/> 
This is where the custom ERC-20 token for the auction is defined. It manages token transfers, tracks balances, mints new tokens, and burns unsold tokens to maintain supply integrity.

---

## Team Members

- Crystal Cheong Yu Qing (U2121134A)
- Seah Kai Heng (U2021104L)
- Nguyen Ngoc Minh Nghia (U2120213H)

---

_This repository is submitted as a project work for Nanyang Technological University's [SC4053 - Blockchain Technology course](https://www.nanyangmods.com/modules/cz4153-blockchain-technology-3-0-au/)._
