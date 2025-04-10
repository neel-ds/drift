/**
 * Formats a Solana address to a shorter format
 * @param address - The Solana address to format
 * @returns The formatted address
 */
export const formatAddress = (address: string) => {
  return address.slice(0, 4) + "..." + address.slice(-4);
};
