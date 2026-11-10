import type { ReactNode } from "react";

export type InstrumentModuleVariant =
  | "flat"
  | "panel"
  | "table"
  | "table-compact";

export interface InstrumentGridProps {
  children: ReactNode;
  className?: string;
}

export interface InstrumentModuleProps {
  eyebrow: string;
  description?: ReactNode;
  hint?: ReactNode;
  readout?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  variant?: InstrumentModuleVariant;
  bareBody?: boolean;
}

export interface InstrumentRevealProps {
  active: boolean;
  order?: number;
  children: ReactNode;
  className?: string;
}

export interface InstrumentEmptyProps {
  seed?: string;
  message: string;
  className?: string;
  busy?: boolean;
  action?: ReactNode;
  preview?: ReactNode;
}

export interface InstrumentHintProps {
  hint: ReactNode;
}

export interface CardLabels {
  moreInfo: string;
}

export interface CardLabelsProviderProps {
  labels?: Partial<CardLabels>;
  children: ReactNode;
}
