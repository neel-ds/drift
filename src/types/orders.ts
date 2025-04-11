import { DriftClient } from "@drift-labs/sdk";

interface CancelOrderProps {
  driftClient: DriftClient | null;
  orderId: number;
  setIsCancelling: (isCancelling: boolean) => void;
}

interface GetPerpsAndOrdersProps {
  driftClient: DriftClient | null;
}

export type { CancelOrderProps, GetPerpsAndOrdersProps };
