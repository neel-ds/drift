"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-5 h-screen">
      <h1 className="text-7xl font-bold text-amber-500">404</h1>
      <p className="text-lg text-neutral-500">Page not found. Let&apos;s explore more.</p>
      <Button onClick={() => router.push("/")} className="group">
        <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-all" /> Home
      </Button>
    </div>
  );
}
