"use client";

import { tokens } from "@/constants/token";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Trade from "./Trade";
import Orders from "./Orders";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row gap-2 pt-14 px-3 pb-3">
      {/* CHART & ORDERBOOK */}
      <div className="flex flex-col w-full md:w-2/3 xl:w-3/4 bg-zinc-900 border border-neutral-800">
        {/* TOKEN INFO */}
        <div className="w-fit flex items-center gap-2 px-4 py-2 border-r border-neutral-700">
          <Avatar>
            <AvatarImage src={tokens.SOL.uri} />
            <AvatarFallback>{tokens.SOL.symbol.slice(0, 3)}</AvatarFallback>
          </Avatar>

          <p className="text-xl font-medium text-neutral-200">SOL-PERP</p>
          <span className="ml-2 px-1 py-0.5 bg-zinc-700 text-xs text-neutral-300">20x</span>
        </div>

        {/* SOL-USDC GMGN CHART */}
        <div className="border-t border-neutral-700">
          <div className="h-[32rem]">
            <iframe
              src={`https://www.gmgn.cc/kline/sol/${tokens.SOL.address}`}
              className="w-full h-full"
              title={`${tokens.SOL.symbol} Chart`}
              allowFullScreen
            />
          </div>
        </div>

        {/* ORDERBOOK */}
        <Orders />
      </div>

      {/* TRADING WIDGET */}
      <Trade />
    </div>
  );
}
