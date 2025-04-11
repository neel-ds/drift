import { DriftClient } from "@drift-labs/sdk";
import { OrderType, PositionDirection } from "@drift-labs/sdk";
import { toast } from "sonner";

/**
 * Opens a market long position on the SOL-PERP market
 * @param driftClient - The Drift client instance
 * @param amount - The amount of SOL to trade
 * @returns Promise<void>
 * @throws Error if the position cannot be opened
 */
export const openMarketLongPosition = async (
  driftClient: DriftClient,
  amount: number,
): Promise<void> => {
  try {
    const orderParams = {
      orderType: OrderType.MARKET,
      marketIndex: 0,
      direction: PositionDirection.LONG,
      baseAssetAmount: driftClient.convertToPerpPrecision(amount),
    };

    await driftClient.placePerpOrder(orderParams);
    toast.success("Market long position opened successfully");
  } catch (error) {
    console.error("Error opening market long position:", error);
    toast.error("Failed to open market long position");
    throw error;
  }
};
