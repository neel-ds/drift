import axios from "axios";

export async function getBalance(
  addresses: string[],
): Promise<{ balanceInUSD: number; balance: number }[]> {
  const response = await axios.get(
    "https://lite-api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112",
  );
  const solPrice = response.data.data.So11111111111111111111111111111111111111112.price;

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
