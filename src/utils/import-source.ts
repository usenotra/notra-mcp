import type { ImportSource } from "../types/import.js";

export function toImportSource<Row>(rows: Row[] | undefined, csv: string | undefined): ImportSource<Row> {
  if (rows !== undefined && csv === undefined) return { rows };
  if (csv !== undefined && rows === undefined) return { csv };
  throw new Error("Provide exactly one of rows or csv");
}
