"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { DriftClient } from "@drift-labs/sdk";
import { CONNECTION } from "@/lib/connection";
import { getBalance } from "@/lib/getBalance";

interface DriftContextType {
  driftClient: DriftClient | null;
  isLoading: boolean;
  error: Error | null;
  subaccounts: string[];
  balances: number[];
  isNewUser: boolean;
  refetch: () => void;
}

const DriftContext = createContext<DriftContextType>({
  driftClient: null,
  isLoading: false,
  error: null,
  subaccounts: [],
  balances: [],
  isNewUser: false,
  refetch: () => {},
});

export const useDrift = () => useContext(DriftContext);

export function DriftProvider({ children }: { children: ReactNode }) {
  const wallet = useAnchorWallet();
  const [driftClient, setDriftClient] = useState<DriftClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [subaccounts, setSubaccounts] = useState<string[]>([]);
  const [balances, setBalances] = useState<number[]>([]);
  const [isNewUser, setIsNewUser] = useState(false);

  const initializeDrift = async () => {
    if (!wallet) {
      setDriftClient(null);
      return;
    }

    try {
      setIsLoading(true);
      const provider = new AnchorProvider(CONNECTION, wallet, {
        commitment: "confirmed",
      });
      setProvider(provider);

      const client = new DriftClient({
        connection: CONNECTION,
        wallet: provider.wallet,
        env: "mainnet-beta",
      });

      await client.subscribe();
      setDriftClient(client);

      if (client.users.size === 0) {
        setIsNewUser(true);
        return;
      }

      const subaccounts = Array.from(client.users.values()).map((value) =>
        value.userAccountPublicKey.toBase58(),
      );

      setSubaccounts(subaccounts);

      const balances = await getBalance(subaccounts);
      const balancesInUsd = balances.map((balance) => balance.balanceInUSD);

      setBalances(balancesInUsd);

      setError(null);
    } catch (err) {
      setError(err as Error);
      setDriftClient(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeDrift();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const refetch = () => {
    initializeDrift();
  };

  return (
    <DriftContext.Provider
      value={{ driftClient, isLoading, error, subaccounts, balances, isNewUser, refetch }}
    >
      {children}
    </DriftContext.Provider>
  );
}
