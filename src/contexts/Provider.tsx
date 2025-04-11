"use client";

import React, { type FC, useMemo } from "react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { DriftProvider } from "./DriftContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface WalletProps {
  children: React.ReactNode;
}

export const Provider: FC<WalletProps> = ({ children }) => {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <DriftProvider>{children}</DriftProvider>
        </WalletModalProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
};
