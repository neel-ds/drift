import { useDrift } from "@/contexts/DriftContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSolPrice } from "@/lib/getSolPrice";
import { openMarketLongPosition } from "@/lib/perps/openMarketLongPosition";
import { openMarketShortPosition } from "@/lib/perps/openMarketShortPosition";
import { openLimitLongPosition } from "@/lib/perps/openLimitLongPosition";
import { openLimitShortPosition } from "@/lib/perps/openLimitShortPosition";
import { Loader2 } from "lucide-react";

function Widget({ type }: { type: "MARKET" | "LIMIT" }) {
  const { driftClient, subaccounts, balances } = useDrift();
  const [amount, setAmount] = useState<number | undefined>();
  const [price, setPrice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: solPrice, isLoading: isPriceLoading } = useQuery({
    queryKey: ["solPrice"],
    queryFn: getSolPrice,
    staleTime: 5000,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (solPrice) {
      const formattedPrice = Number(solPrice).toFixed(4);
      setPrice(formattedPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedPrice = Number(solPrice).toFixed(4);

  const handleLong = async () => {
    if (!driftClient || !amount) return;
    setIsLoading(true);
    try {
      if (type === "MARKET") {
        await openMarketLongPosition(driftClient, amount);
      } else {
        if (!price) return;
        await openLimitLongPosition(driftClient, amount, Number(price));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShort = async () => {
    if (!driftClient || !amount) return;
    setIsLoading(true);
    try {
      if (type === "MARKET") {
        await openMarketShortPosition(driftClient, amount);
      } else {
        if (!price) return;
        await openLimitShortPosition(driftClient, amount, Number(price));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const user = driftClient?.getUser();
  const activeSubaccount = user?.getUserAccountPublicKey().toBase58();

  const activeSubaccountIndex = subaccounts.findIndex(
    (subaccount) => subaccount === activeSubaccount,
  );

  return (
    <Tabs defaultValue="LONG">
      <TabsList className="w-full border border-neutral-800">
        <TabsTrigger
          value="LONG"
          className="data-[state=active]:bg-green-300 data-[state=active]:text-black text-green-300 "
        >
          LONG
        </TabsTrigger>
        <TabsTrigger
          value="SHORT"
          className="data-[state=active]:bg-red-400 data-[state=active]:text-black text-red-400 "
        >
          SHORT
        </TabsTrigger>
      </TabsList>
      <TabsContent value="LONG">
        <div className="flex flex-col gap-1 py-5 border-t border-neutral-800 text-center text-neutral-400">
          <Label htmlFor="amount" className="text-xs text-neutral-400">
            Trade Size (SOL)
          </Label>
          <Input
            id="amount"
            value={amount}
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-neutral-900"
          />
          <div className="flex text-xs items-center justify-between mb-3">
            <p>Available Balance</p>
            <span className="flex gap-1.5 items-center">
              {balances[activeSubaccountIndex]?.balance.toFixed(2)} SOL
              <Button
                variant="link"
                size="xs"
                className="text-xs hover:text-white"
                onClick={() => setAmount(balances[activeSubaccountIndex]?.balance / 2)}
              >
                50%
              </Button>
              <Button
                variant="link"
                size="xs"
                className="text-xs hover:text-white"
                onClick={() => setAmount(balances[activeSubaccountIndex]?.balance * 0.75)}
              >
                75%
              </Button>
            </span>
          </div>

          <Label htmlFor="price" className="text-xs text-neutral-400">
            {type === "MARKET" ? "Mark Price" : "Limit Price"}
          </Label>
          <Input
            id="price"
            value={
              type === "MARKET" ? (isPriceLoading ? "Fetching..." : "$" + formattedPrice) : price
            }
            onChange={(e) => {
              if (type === "LIMIT") {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                const parts = value.split(".");
                if (parts.length <= 2) {
                  setPrice(value);
                }
              }
            }}
            type="text"
            className="bg-neutral-900 disabled:opacity-100"
            disabled={type === "MARKET"}
          />

          <Button
            className="mt-3 bg-emerald-300 hover:bg-emerald-400 text-black"
            onClick={handleLong}
            disabled={isLoading || !amount || (type === "LIMIT" && !price)}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Opening Position...
              </>
            ) : (
              "Long"
            )}
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="SHORT">
        <div className="flex flex-col gap-1 py-5 border-t border-neutral-800 text-center text-neutral-400">
          <Label htmlFor="amount" className="text-xs text-neutral-400">
            Trade Size (SOL)
          </Label>
          <Input
            id="amount"
            value={amount}
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-neutral-900"
          />
          <div className="flex text-xs items-center justify-between mb-3">
            <p>Available Balance</p>
            <span className="flex gap-1.5 items-center">
              {balances[activeSubaccountIndex]?.balance.toFixed(2)} SOL
              <Button
                variant="link"
                size="xs"
                className="text-xs hover:text-white"
                onClick={() => setAmount(balances[activeSubaccountIndex]?.balance / 2)}
              >
                50%
              </Button>
              <Button
                variant="link"
                size="xs"
                className="text-xs hover:text-white"
                onClick={() => setAmount(balances[activeSubaccountIndex]?.balance * 0.75)}
              >
                75%
              </Button>
            </span>
          </div>

          <Label htmlFor="price" className="text-xs text-neutral-400">
            {type === "MARKET" ? "Mark Price" : "Limit Price"}
          </Label>
          <Input
            id="price"
            value={
              type === "MARKET" ? (isPriceLoading ? "Fetching..." : "$" + formattedPrice) : price
            }
            onChange={(e) => {
              if (type === "LIMIT") {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                const parts = value.split(".");
                if (parts.length <= 2) {
                  setPrice(value);
                }
              }
            }}
            type="text"
            className="bg-neutral-900 disabled:opacity-100"
            disabled={type === "MARKET"}
          />

          <Button
            className="mt-3 bg-red-400 hover:bg-red-400/90 text-black"
            onClick={handleShort}
            disabled={isLoading || !amount || (type === "LIMIT" && !price)}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Opening Position...
              </>
            ) : (
              "Short"
            )}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default function Trade() {
  return (
    <div className="flex flex-col w-full md:w-1/3 2xl:w-1/4 bg-zinc-900 border border-neutral-800 p-3 h-fit">
      <Tabs defaultValue="MARKET">
        <TabsList className="w-full h-10 mb-3">
          <TabsTrigger
            value="MARKET"
            className="px-5 data-[state=active]:bg-transparent data-[state=active]:bg-clip-text data-[state=active]:text-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-300 data-[state=active]:via-purple-400 data-[state=active]:to-cyan-400 data-[state=active]:border-b data-[state=active]:border-fuchsia-300"
          >
            MARKET
          </TabsTrigger>
          <TabsTrigger
            value="LIMIT"
            className="px-5 data-[state=active]:bg-transparent data-[state=active]:bg-clip-text data-[state=active]:text-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-300 data-[state=active]:via-purple-400 data-[state=active]:to-cyan-400 data-[state=active]:border-b data-[state=active]:border-fuchsia-300"
          >
            LIMIT
          </TabsTrigger>
        </TabsList>
        <TabsContent value="MARKET">
          <Widget type="MARKET" />
        </TabsContent>
        <TabsContent value="LIMIT">
          <Widget type="LIMIT" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
