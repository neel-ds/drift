"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <nav className="w-full fixed px-3 py-1.5 flex items-center justify-between bg-foreground border-b border-neutral-800 z-10">
      {/* MAIN LOGO */}
      <Link href="/" className="flex items-center gap-2 font-bold">
        <Image src="/drift.png" alt="Drift" width={24} height={24} className="rounded-full" />
        Drift
      </Link>

      {/* LOGIN CTA */}
      <Button
        className="bg-gradient-to-r from-orange-300 via-violet-500 to-sky-400 text-black"
        size="sm"
      >
        Connect
      </Button>
    </nav>
  );
}
