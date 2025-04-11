import { OpenPerpPositionProps } from "@/types/perps";
import { OrderType, PositionDirection } from "@drift-labs/sdk";
import { toast } from "sonner";

/**
 * Opens a market short position on the SOL-PERP market
 * @param driftClient - The Drift client instance
 * @param amount - The amount of SOL to trade
 * @returns Promise<void>
 * @throws Error if the position cannot be opened
 */
export const openMarketShortPosition = async ({ driftClient, amount }: OpenPerpPositionProps) => {
  if (!driftClient) return;

  try {
    const orderParams = {
      orderType: OrderType.MARKET,
      marketIndex: 0,
      direction: PositionDirection.SHORT,
      baseAssetAmount: driftClient.convertToPerpPrecision(amount),
    };

    await driftClient.placePerpOrder(orderParams);
    toast.success("Market short position opened successfully");
  } catch (error) {
    console.error("Error opening market short position:", error);
    toast.error("Failed to open market short position");
    throw error;
  }
};
