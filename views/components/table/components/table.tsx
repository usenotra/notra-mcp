import { cn } from "cn";
import type { ComponentProps } from "react";

import {
  Table as ShadcnTable,
  TableBody,
  TableCaption as ShadcnTableCaption,
  TableCell as ShadcnTableCell,
  TableFooter as ShadcnTableFooter,
  TableHead as ShadcnTableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
} from "@/components/ui/table";

const TABLE_CARD_CELLS_CLASS = [
  "[&>tbody>tr>td]:bg-table-card [&>tbody>tr>td]:border-table-row-border [&>tbody>tr>td]:border-b [&>tbody>tr>td]:transition-colors",
  "[&>tbody>tr:hover>td]:bg-muted",
  "[&>tbody>tr:first-child>td]:border-t-table-card-border [&>tbody>tr:first-child>td]:border-t",
  "[&>tbody>tr:last-child>td]:border-b-table-card-border",
  "[&>tbody>tr>td:first-child]:border-l-table-card-border [&>tbody>tr>td:first-child]:border-l",
  "[&>tbody>tr>td:last-child]:border-r-table-card-border [&>tbody>tr>td:last-child]:border-r",
  "[&>tbody>tr:first-child>td:first-child]:rounded-tl-[14px] [&>tbody>tr:first-child>td:last-child]:rounded-tr-[14px]",
  "[&>tbody>tr:last-child>td:first-child]:rounded-bl-[14px] [&>tbody>tr:last-child>td:last-child]:rounded-br-[14px]",
].join(" ");

function Table({ className, ...props }: ComponentProps<typeof ShadcnTable>) {
  return (
    <div className="border-table-shell-border bg-table-shell relative w-full min-w-0 rounded-2xl border p-0.5 *:data-[slot=table-container]:rounded-[14px]">
      <ShadcnTable
        className={cn(
          "border-separate border-spacing-0 tabular-nums",
          TABLE_CARD_CELLS_CLASS,
          className
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  className,
  ...props
}: ComponentProps<typeof ShadcnTableHeader>) {
  return (
    <ShadcnTableHeader
      className={cn("[&_tr]:border-b-0", className)}
      {...props}
    />
  );
}

function TableFooter({
  className,
  ...props
}: ComponentProps<typeof ShadcnTableFooter>) {
  return (
    <ShadcnTableFooter
      className={cn(
        "text-muted-foreground border-t-0 bg-transparent",
        className
      )}
      {...props}
    />
  );
}

function TableRow({
  className,
  ...props
}: ComponentProps<typeof ShadcnTableRow>) {
  return (
    <ShadcnTableRow
      className={cn(
        "group/row border-b-0 hover:bg-transparent has-aria-expanded:bg-transparent data-[state=selected]:bg-transparent",
        className
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  ...props
}: ComponentProps<typeof ShadcnTableHead>) {
  return (
    <ShadcnTableHead
      className={cn("text-muted-foreground px-4", className)}
      {...props}
    />
  );
}

function TableCell({
  className,
  ...props
}: ComponentProps<typeof ShadcnTableCell>) {
  return (
    <ShadcnTableCell
      className={cn("text-foreground h-12 px-4 py-0", className)}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: ComponentProps<typeof ShadcnTableCaption>) {
  return (
    <ShadcnTableCaption
      className={cn("mt-0 px-4 py-2.5", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
