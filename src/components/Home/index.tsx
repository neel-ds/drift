"use client";

import { tokens } from "@/constants/token";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { useDrift } from "@/contexts/DriftContext";

export default function Home() {
  const { driftClient } = useDrift();

  const handleClick = async () => {
    if (!driftClient) return;
    console.log("Drift Client is ready");
  };

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
        <div className="border-t border-neutral-700">
          <Tabs defaultValue="positions">
            <TabsList className="border border-neutral-800 h-10">
              <TabsTrigger
                value="positions"
                className="data-[state=active]:bg-transparent border-r border-neutral-800"
              >
                Positions
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-transparent">
                Orders
              </TabsTrigger>
            </TabsList>
            <TabsContent value="positions">
              <div className="py-16 border-t border-neutral-700 text-center text-neutral-400">
                No positions found
                <Button onClick={handleClick}>Get positions</Button>
              </div>
            </TabsContent>
            <TabsContent value="orders">
              <div className="py-16 border-t border-neutral-700 text-center text-neutral-400">
                No orders found
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* TRADING WIDGETS */}
      <div className="flex flex-col w-full md:w-1/3 2xl:w-1/4 bg-zinc-900 border border-neutral-800 p-3 h-fit">
        <Tabs defaultValue="long">
          <TabsList className="w-full border border-neutral-800">
            <TabsTrigger
              value="long"
              className="data-[state=active]:bg-green-300 data-[state=active]:text-black text-green-300 "
            >
              LONG
            </TabsTrigger>
            <TabsTrigger
              value="short"
              className="data-[state=active]:bg-red-400 data-[state=active]:text-black text-red-400 "
            >
              SHORT
            </TabsTrigger>
          </TabsList>
          <TabsContent value="long">
            <div className="py-16 text-center text-neutral-400">Make long positions here</div>
          </TabsContent>
          <TabsContent value="short">
            <div className="py-16 text-center text-neutral-400">Make short positions here</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
