import { DriftClient } from "@drift-labs/sdk";

interface OpenPerpPositionProps {
  driftClient: DriftClient | null;
  amount: number;
}

interface OpenLimitPositionProps extends OpenPerpPositionProps {
  price: number;
}

export type { OpenPerpPositionProps, OpenLimitPositionProps };
