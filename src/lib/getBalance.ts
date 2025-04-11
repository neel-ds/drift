import axios from "axios";
import { getSolPrice } from "./getSolPrice";

/**
 * Gets the balance of a user
 * @param addresses - The addresses of the users to get the balance of
 * @returns The balance of the users
 */
export async function getBalance(
  addresses: string[],
): Promise<{ balanceInUSD: number; balance: number }[]> {
  const solPrice = await getSolPrice();

  const balancesResponse = await Promise.all(
    addresses.map(async (address) => {
      try {
        const response = await axios.get(`https://lite-api.jup.ag/ultra/v1/balances/${address}`);
        const data = response.data;

        if (data.error) {
          return { balanceInUSD: 0, balance: 0 };
        }

        const solBalance = data?.SOL;
        const uiAmount = solBalance?.uiAmount || 0;

        // Multiply balance with solPrice to get USD value
        return { balanceInUSD: uiAmount * solPrice, balance: uiAmount };
      } catch {
        return { balanceInUSD: 0, balance: 0 };
      }
    }),
  );

  return balancesResponse;
}
