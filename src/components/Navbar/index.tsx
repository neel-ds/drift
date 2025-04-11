"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { formatAddress } from "@/lib/formatAddress";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Account from "./Account";

const WalletButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(({ WalletMultiButton }) => WalletMultiButton),
  { ssr: false },
);

export default function Navbar() {
  const { publicKey, connecting } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!(connection && connecting)) {
      setIsLoading(false);
    }
  }, [connection, connecting]);

  return (
    <nav className="w-full fixed px-3 py-1.5 flex items-center justify-between bg-foreground border-b border-neutral-800 z-10">
      {/* MAIN LOGO */}
      <Link href="/" className="flex items-center gap-2 font-bold">
        <Image src="/drift.png" alt="Drift" width={24} height={24} className="rounded-full" />
        Drift
      </Link>

      {/* Connect Wallet CTA */}
      {isLoading ? (
        <Button
          className="bg-gradient-to-r from-orange-300 via-violet-500 to-sky-400 text-neutral-900 px-6"
          size="sm"
        >
          <Loader2 className="w-4 h-4 animate-spin" /> Loading...
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          {/* Solana Wallet Adapter */}
          <WalletButton
            style={{
              background: "linear-gradient(to right, #fdba74, #8b5cf6, #38bdf8)",
              borderRadius: "1px",
              padding: "1rem 1rem",
              height: "0.2rem",
              color: "#171717",
            }}
          >
            {publicKey ? formatAddress(publicKey.toBase58()) : "Connect"}
          </WalletButton>

          {/* Account Drawer */}
          {publicKey && <Account />}
        </div>
      )}
    </nav>
  );
}
