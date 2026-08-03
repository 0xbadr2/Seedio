# 🌱 Seedio

**Decentralized File Storage on Shelby Protocol (Aptos Blockchain)**

Seedio is a Web3 dApp that lets users securely upload, store, and manage files on Shelby's decentralized storage network — powered by Aptos wallet authentication and cryptographic commitments on-chain.

---

## 🚀 Live App

🔗 [seedio-rho.vercel.app](https://seedio-apt.vercel.app/)

---

## 📖 Overview

Traditional cloud storage relies on centralized servers that can go down, get censored, or be controlled by a single provider. **Seedio** demonstrates a different model — files are erasure-coded, cryptographically committed, and distributed across a decentralized network of storage providers on **Shelby Protocol**, with ownership and integrity anchored on the **Aptos blockchain**.

This project was built to explore real-world Web3 storage infrastructure — connecting a live Aptos wallet, signing on-chain transactions, and interacting directly with Shelby's testnet.

---

## ❓ Why Shelby?

Shelby Protocol was chosen as the storage layer for this project because it offers:

- **Verifiable, cryptographically committed storage** — every file's integrity is provable via Merkle root commitments registered on-chain
- **Erasure-coded resilience** — files are split into chunksets and chunks, so no single point of failure can destroy or corrupt data
- **Aptos-native architecture** — built directly on Aptos using Move smart contracts, offering high throughput and low latency
- **Read-intensive, low-latency design** — purpose-built for real Web3 use cases like media, datasets, and collaborative apps, not just static backups

Building on Shelby gave a practical, hands-on way to learn decentralized storage architecture instead of just reading about it.

---

## ✨ Features

- 🔐 **Aptos Wallet Integration** — Connect via Petra Wallet using the official Aptos Wallet Adapter
- 📤 **File Upload** — Upload files to Shelby's decentralized storage network (Shelbynet Testnet)
- 📁 **File Management** — View, organize, and track previously uploaded files
- 🔒 **Access Control Options** — Choose between encrypted, public, and private storage types
- 🎨 **Modern Web3 UI** — Dark theme, multiple color palettes, smooth animations, fully responsive
- 🌐 **On-chain Verification** — Every upload is backed by a cryptographic commitment hash registered on Aptos

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Blockchain | Aptos (Move smart contracts) |
| Storage Protocol | Shelby Protocol |
| Wallet | Petra Wallet via `@aptos-labs/wallet-adapter-react` |
| SDK | `@shelby-protocol/sdk`, `@shelby-protocol/react` |
| State/Data | `@tanstack/react-query` |
| Deployment | Vercel |

---

## 🧩 How It Works

1. **Connect Wallet** — User connects their Aptos-compatible wallet (Petra) via the official Aptos Wallet Adapter
2. **Select File** — User chooses a file to upload through drag-and-drop or file picker
3. **Erasure Coding** — The file is split into chunksets and encoded using Clay erasure codes for redundancy
4. **Commitment & Signing** — A cryptographic commitment (Merkle root) is generated and signed via the connected wallet
5. **On-chain Registration** — The commitment is registered on the Aptos blockchain through a signed transaction
6. **Distributed Upload** — Encoded chunks are transmitted to Shelby's decentralized storage providers
7. **Verification** — Users can view their uploaded files, each backed by a verifiable on-chain commitment hash

---

## 🗺️ Roadmap

- [x] Wallet connect integration (Petra / Aptos Wallet Adapter)
- [x] UI/UX design with multiple theme variants
- [x] File upload flow (UI + local state)
- [ ] Full production-grade wallet-adapter signer integration for live blob uploads
- [ ] Real-time on-chain commitment hash display per file
- [ ] File download / retrieval flow from Shelby network
- [ ] Shared file access (multi-user permissions)
- [ ] Staking dashboard integration
- [ ] Mainnet deployment support

---

## 📦 Installation

```bash
git clone https://github.com/0xbadr2/seedio.git
cd seedio
npm install --legacy-peer-deps
```

Create a `.npmrc` file in the root with:
Run locally:
```bash
npm run dev
```

---

## 🔑 Environment Requirements

- [Petra Wallet](https://petra.app) browser extension installed
- Aptos Labs API key (from [developers.aptoslabs.com](https://developers.aptoslabs.com)) for Shelby Testnet API access
- Node.js 18+

---

## 📸 Screenshots

*(Add screenshots of your app here — Overview, Files view, Upload flow, etc.)*

---

## 🙏 Credits

**Built by [Badr](https://github.com/0xbadr2)**
🔗 [X (Twitter)](https://x.com/0xBadr2)

**Build on Shelby **
- 🌐 [Website](https://shelby.xyz)
- 📚 [Docs](https://docs.shelby.xyz)
- 💻 [GitHub](https://github.com/shelby)
- 💬 [Discord](https://discord.gg/shelbyserves)
- 🐦 [X](https://x.com/shelbyserves)

---

## 📄 License

© 2026 Seedio. All Rights Reserved.
