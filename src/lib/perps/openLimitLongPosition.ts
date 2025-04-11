import { DriftClient } from "@drift-labs/sdk";
import { OrderType, PositionDirection } from "@drift-labs/sdk";
import { toast } from "sonner";

/**
 * Opens a limit long position on the SOL-PERP market
 * @param driftClient - The Drift client instance
 * @param amount - The amount of SOL to trade
 * @param price - The limit price for the order
 * @returns Promise<void>
 * @throws Error if the position cannot be opened
 */
export const openLimitLongPosition = async (
  driftClient: DriftClient,
  amount: number,
  price: number,
): Promise<void> => {
  try {
    const orderParams = {
      orderType: OrderType.LIMIT,
      marketIndex: 0,
      direction: PositionDirection.LONG,
      baseAssetAmount: driftClient.convertToPerpPrecision(amount),
      price: driftClient.convertToPricePrecision(price),
    };

    await driftClient.placePerpOrder(orderParams);
    toast.success("Limit long position opened successfully");
  } catch (error) {
    console.error("Error opening limit long position:", error);
    toast.error("Failed to open limit long position");
    throw error;
  }
};
