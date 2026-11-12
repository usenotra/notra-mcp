import { cn } from "cn";
import type { ReactNode } from "react";
import { InstrumentSection } from "@/components/card/components/instrument-module";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table/components/table";

export type Column = { label: string; numeric?: boolean; wrap?: boolean };

export function DataTable({
  title,
  readout,
  columns,
  rows,
}: {
  title: string;
  readout?: ReactNode;
  columns: Column[];
  rows: { key: string; cells: ReactNode[] }[];
}) {
  return (
    <InstrumentSection eyebrow={title} readout={readout} className="px-1">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.label} className={cn("h-9 text-xs", column.numeric && "text-right")}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.key}>
              {row.cells.map((cell, index) => (
                <TableCell
                  key={columns[index]?.label ?? index}
                  className={cn(
                    "h-11",
                    columns[index]?.numeric && "text-muted-foreground text-right",
                    columns[index]?.wrap && "py-2.5 whitespace-normal",
                  )}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </InstrumentSection>
  );
}
