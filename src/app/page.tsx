import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center h-screen">
      <div className="flex gap-2 ">
        <Image src="/drift.png" alt="Drift" width={40} height={40} />
        <h1 className="text-4xl font-bold">Drift</h1>
      </div>
      <Button>Get Started</Button>
    </div>
  );
}
