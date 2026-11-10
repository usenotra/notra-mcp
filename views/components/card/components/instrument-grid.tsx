import { cn } from "cn";

import type { InstrumentGridProps } from "../types/card";

export function InstrumentGrid({ children, className }: InstrumentGridProps) {
  return <div className={cn("grid gap-3", className)}>{children}</div>;
}
