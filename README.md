# Drift Trading Application

It's demo application for trading perpetual (PERPs) on the Drift Protocol. This application allows you to connect your Solana wallet, manage subaccounts, and trade SOL-PERP.

## Features

- Solana wallet integration
- Subaccount management
- Deposit and withdrawal of SOL
- SOL PERP trading widget

## Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or later)
- Node.js (v19.0.0 or later)
- Solana wallet (e.g., Phantom, Solflare)
- Helius RPC URL (for connecting to the Solana network)

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/neel-ds/drift.git
cd drift
```

2. Install dependencies using Bun:

```bash
bun install
```

3. Create a `.env` file in the root directory and add your Helius RPC URL:

```bash
cp .env.example .env

# Add you RPC URL
```

4. Start the development server:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

## Tech Stack

- Next.js v15
- React v19
- TypeScript
- Tailwind CSS v4
- Drift Protocol SDK
- Solana Web3.js
- TanStack Query
- Shadcn UI

## Limitations

- Currently supports only SOL-PERP trading
- Limited to SOL deposits and withdrawals
