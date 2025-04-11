import { toast } from "sonner";
import { CancelOrderProps } from "@/types/orders";

/**
 * Cancels an order by its ID
 * @param driftClient - The drift client
 * @param orderId - The ID of the order to cancel
 * @param setIsCancelling - A function to set the state of the cancelling order
 */
export const cancelOrderById = async ({
  driftClient,
  orderId,
  setIsCancelling,
}: CancelOrderProps) => {
  if (!driftClient) return;
  try {
    setIsCancelling(true);
    await driftClient.cancelOrder(orderId);
    toast.success("Order cancelled");
  } catch (error) {
    console.error(error);
    toast.error("Failed to cancel order");
  } finally {
    setIsCancelling(false);
  }
};
