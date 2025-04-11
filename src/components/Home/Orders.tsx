import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getUserPerpsAndOrders } from "@/lib/orders/getUserPerpsAndOrders";
import { useDrift } from "@/contexts/DriftContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BN, convertToNumber, OrderType, PositionDirection } from "@drift-labs/sdk";
import { tokens } from "@/constants/token";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { cancelOrderById } from "@/lib/orders/cancelOrderById";
import { Button } from "../ui/button";

export default function Orders() {
  const [isCancelling, setIsCancelling] = useState(false);
  const { driftClient } = useDrift();

  const { data, isLoading } = useQuery({
    queryKey: ["userPerps"],
    queryFn: () => getUserPerpsAndOrders({ driftClient }),
    staleTime: 2000,
    refetchInterval: 2000,
    enabled: !!driftClient,
  });

  const getPositionType = (baseAssetAmount: BN) => {
    const amount = new BN(baseAssetAmount, 16);
    if (amount.gt(new BN(0))) return "LONG";
    if (amount.lt(new BN(0))) return "SHORT";
    return "None";
  };

  const getDirectionString = (direction: PositionDirection) => {
    if ("long" in direction) return "LONG";
    if ("short" in direction) return "SHORT";
    return "None";
  };

  const getOrderTypeString = (orderType: OrderType) => {
    if ("limit" in orderType) return "LIMIT";
    if ("market" in orderType) return "MARKET";
    return "None";
  };

  return (
    <div className="border-t border-neutral-700">
      <Tabs defaultValue="positions">
        <TabsList className="border border-neutral-800 h-10">
          <TabsTrigger
            value="positions"
            className="data-[state=active]:bg-transparent border-r border-neutral-800"
          >
            Positions{" "}
            {data?.position && convertToNumber(data?.position.baseAssetAmount) !== 0 ? (
              <span className="text-[10px] bg-neutral-700/50 px-1.5 rounded-full w-fit">1</span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-transparent">
            Orders{" "}
            {data?.orders && data?.orders.length > 0 ? (
              <span className="text-[10px] bg-neutral-700/50 px-1.5 rounded-full w-fit">
                {data?.orders.length}
              </span>
            ) : null}
          </TabsTrigger>
        </TabsList>

        {/* POSITIONS LIST */}
        <TabsContent value="positions">
          {isLoading ? (
            <div className="h-[20rem] border-t border-neutral-700 text-xs text-center text-neutral-400">
              Fetching positions...
            </div>
          ) : (
            <div className="h-[20rem] overflow-y-auto border-t border-neutral-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Market</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>P&L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.position && convertToNumber(data?.position.baseAssetAmount) !== 0 ? (
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={tokens.SOL.uri} />
                            <AvatarFallback>{tokens.SOL.symbol.slice(0, 3)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p>SOL-PERP</p>
                            <span
                              className={`${getPositionType(data.position.baseAssetAmount) === "LONG" ? "bg-emerald-400/50" : "bg-red-400/50"} px-1 w-fit text-[10px]`}
                            >
                              {getPositionType(data.position.baseAssetAmount)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {Math.abs(convertToNumber(data.position.baseAssetAmount)) / 1000} SOL
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell
                        className={
                          Math.abs(convertToNumber(data.pnl)) >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        ${Math.abs(convertToNumber(data.pnl)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="py-10 text-xs text-center text-neutral-400">
                        No open positions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ORDERS LIST */}
        <TabsContent value="orders">
          {isLoading ? (
            <div className="h-[20rem] border-t border-neutral-700 text-xs text-center text-neutral-400">
              Fetching orders...
            </div>
          ) : data?.orders ? (
            <div className="h-[20rem] overflow-y-auto border-t border-neutral-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Market</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.orders.length > 0 ? (
                    data.orders.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src={tokens.SOL.uri} />
                              <AvatarFallback>{tokens.SOL.symbol.slice(0, 3)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <p>SOL-PERP</p>
                              <span
                                className={`${getDirectionString(order.direction) === "LONG" ? "bg-emerald-400/50" : "bg-red-400/50"} px-1 w-fit text-[10px]`}
                              >
                                {getDirectionString(order.direction)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getOrderTypeString(order.orderType)}</TableCell>
                        <TableCell>{convertToNumber(order.baseAssetAmount) / 1000} SOL</TableCell>
                        <TableCell>${convertToNumber(order.price)}</TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            size="xs"
                            className="cursor-pointer bg-red-400/50 py-0.5 px-1 [&_svg:not([class*='size-'])]:size-4"
                            onClick={() => {
                              cancelOrderById({
                                driftClient,
                                orderId: order.orderId,
                                setIsCancelling,
                              });
                            }}
                            disabled={isCancelling}
                          >
                            {isCancelling ? <Loader2 className="animate-spin" /> : <X />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="py-10 text-xs text-center text-neutral-400">
                        No open orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="h-[20rem] border-t border-neutral-700 text-xs text-center text-neutral-400">
              No open orders found
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
