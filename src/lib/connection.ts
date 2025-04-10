import { Connection } from "@solana/web3.js";

/**
 * Creates a connection to the Solana blockchain
 * @returns The connection to the Solana blockchain
 */
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

if (!RPC_URL) {
  throw new Error("RPC_URL is not defined");
}

export const CONNECTION = new Connection(RPC_URL, "confirmed");
