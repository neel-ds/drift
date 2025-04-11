import { DriftClient } from "@drift-labs/sdk";

/**
 * Gets the user's perps and orders
 * @param driftClient - The drift client
 * @returns The user's perps and orders
 */
export const getUserPerpsAndOrders = async (driftClient: DriftClient | null) => {
  if (!driftClient) return null;
  const user = driftClient.getUser();

  const position = user.getPerpPosition(0);
  const pnl = user.getUnrealizedPNL();
  const orders = user.getOpenOrders();

  return {
    position,
    pnl,
    orders,
  };
};
