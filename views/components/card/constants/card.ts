import type { CardLabels } from "../types/card";

/** Header and body classes for each dualtone `InstrumentModule` layout. */
export const INSTRUMENT_SURFACE_CLASSES = {
  panel: {
    header: "min-h-24 content-start rounded-t-[14px] pt-4 pb-9",
    content:
      "border-table-card-border bg-table-card shadow-table-card relative -mt-5 flex flex-1 flex-col rounded-[14px] border p-6",
  },
  table: {
    header:
      "min-h-[4.25rem] content-center items-center rounded-t-[14px] pt-3 pb-8",
    content:
      "border-table-card-border bg-table-card shadow-table-card relative -mt-5 flex flex-1 flex-col rounded-[14px] border p-4",
  },
  "table-compact": {
    header:
      "min-h-14 content-center items-center rounded-t-[14px] pt-1.5 pb-6.5",
    content:
      "border-table-card-border bg-table-card shadow-table-card relative -mt-5 flex flex-1 flex-col rounded-[14px] border p-4",
  },
  bare: {
    header: "px-1",
    content: "flex flex-1 flex-col p-0",
  },
} as const;

export const CARD_LABELS: CardLabels = {
  moreInfo: "More info",
};
