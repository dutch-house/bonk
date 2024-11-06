# SC4053 - Blockchain Technology Project — _🃏 bonk_

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

_This repository is submitted as a project work for Nanyang Technological University's [SC4053 - Blockchain Technology course](https://www.nanyangmods.com/modules/cz4153-blockchain-technology-3-0-au/)._
