import { OpenLimitPositionProps } from "@/types/perps";
import { OrderType, PositionDirection } from "@drift-labs/sdk";
import { toast } from "sonner";

/**
 * Opens a limit short position on the SOL-PERP market
 * @param driftClient - The Drift client instance
 * @param amount - The amount of SOL to trade
 * @param price - The limit price for the order
 * @returns Promise<void>
 * @throws Error if the position cannot be opened
 */
export const openLimitShortPosition = async ({
  driftClient,
  amount,
  price,
}: OpenLimitPositionProps) => {
  if (!driftClient) return;

  try {
    const orderParams = {
      orderType: OrderType.LIMIT,
      marketIndex: 0,
      direction: PositionDirection.SHORT,
      baseAssetAmount: driftClient.convertToPerpPrecision(amount),
      price: driftClient.convertToPricePrecision(price),
    };

    await driftClient.placePerpOrder(orderParams);
    toast.success("Limit short position opened successfully");
  } catch (error) {
    console.error("Error opening limit short position:", error);
    toast.error("Failed to open limit short position");
    throw error;
  }
};
