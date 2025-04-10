"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { DriftClient } from "@drift-labs/sdk";
import { CONNECTION } from "@/lib/connection";

interface DriftContextType {
  driftClient: DriftClient | null;
  isLoading: boolean;
  error: Error | null;
}

const DriftContext = createContext<DriftContextType>({
  driftClient: null,
  isLoading: false,
  error: null,
});

export const useDrift = () => useContext(DriftContext);

export function DriftProvider({ children }: { children: ReactNode }) {
  const wallet = useAnchorWallet();
  const [driftClient, setDriftClient] = useState<DriftClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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
        setError(null);
      } catch (err) {
        setError(err as Error);
        setDriftClient(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDrift();
  }, [wallet]);

  return (
    <DriftContext.Provider value={{ driftClient, isLoading, error }}>
      {children}
    </DriftContext.Provider>
  );
}
