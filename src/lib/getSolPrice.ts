import axios from "axios";

/**
 * Fetches the current price of SOL from the Jup API
 * @returns The price of SOL in USD
 * @throws Error if the API request fails
 */
export const getSolPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(
      "https://lite-api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112",
    );
    const solPrice = response.data.data.So11111111111111111111111111111111111111112.price;
    return solPrice;
  } catch (error) {
    console.error("Error fetching SOL price:", error);
    return 0;
  }
};
