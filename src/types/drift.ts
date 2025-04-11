import { DriftClient } from "@drift-labs/sdk";

type Balance = {
  balance: number;
  balanceInUSD: number;
};

interface DriftContextType {
  driftClient: DriftClient | null;
  isLoading: boolean;
  error: Error | null;
  subaccounts: string[];
  balances: Balance[];
  isNewUser: boolean;
  refetch: () => void;
  refetchBalances: () => void;
}

export type { Balance, DriftContextType };
