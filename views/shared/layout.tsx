import { cn } from "cn";
import { ErrorBoundary, useToolContext, useViewTheme } from "mcp-use/react";
import { useEffect, type ReactNode } from "react";
import { InstrumentEmpty, InstrumentModule } from "@/components/card/components/instrument-module";
import { change, formatPercent } from "./format";
import type { Theme } from "./palette";
import "./styles.css";

type ViewProps<T> = {
  title: string;
  subtitle?: (output: T, input: Record<string, unknown> | undefined) => string | undefined;
  isEmpty?: (output: T) => boolean;
  emptyMessage?: string;
  children: (output: T, theme: Theme) => ReactNode;
};

export function NotraView<T>(props: ViewProps<T>) {
  const theme = useViewTheme();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  return (
    <div className="notra-view bg-background text-foreground flex min-h-full flex-col gap-3 p-4 font-sans antialiased">
      <ErrorBoundary>
        <ViewBody {...props} theme={theme} />
      </ErrorBoundary>
    </div>
  );
}

function ViewBody<T>({ title, subtitle, isEmpty, emptyMessage, children, theme }: ViewProps<T> & { theme: Theme }) {
  const context = useToolContext();

  let body: ReactNode;
  let detail: string | undefined;
  if (context.status === "pending") {
    body = <State message="Loading" busy />;
  } else if (context.status === "error") {
    body = <State message={context.error.message} />;
  } else {
    const output = context.toolOutput as T;
    detail = subtitle?.(output, context.toolInput as Record<string, unknown> | undefined);
    body =
      isEmpty?.(output) === true ? (
        <State message={emptyMessage ?? "No data for this period yet."} />
      ) : (
        children(output, theme)
      );
  }

  return (
    <>
      <header className="flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h1 className="text-foreground truncate text-base font-semibold tracking-tight">{title}</h1>
          {detail ? <p className="text-muted-foreground mt-0.5 truncate text-xs">{detail}</p> : null}
        </div>
        <span className="text-muted-foreground shrink-0 pt-1 text-xs">Notra</span>
      </header>
      {body}
    </>
  );
}

export function State({ message, busy = false }: { message: string; busy?: boolean }) {
  return (
    <Shell>
      <InstrumentEmpty message={message} busy={busy} className="min-h-32 px-4" />
    </Shell>
  );
}

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="border-shell-border bg-shell rounded-2xl border p-0.5">
      <div
        className={cn(
          "border-table-card-border bg-table-card shadow-table-card overflow-hidden rounded-[14px] border",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Delta({
  current,
  previous,
  lowerIsBetter = false,
}: {
  current: number;
  previous: number | null | undefined;
  lowerIsBetter?: boolean;
}) {
  const ratio = change(current, previous);
  if (ratio === null) return null;
  if (Math.abs(ratio) < 0.005) return null;
  const better = lowerIsBetter ? -ratio : ratio;
  const sign = ratio > 0 ? "+" : "";
  return (
    <span className={cn("text-xs font-medium tabular-nums", better > 0 ? "text-[var(--up)]" : "text-[var(--down)]")}>
      {sign}
      {formatPercent(ratio)}
    </span>
  );
}

export type KpiItem = {
  label: string;
  value: string;
  current?: number;
  previous?: number | null;
  lowerIsBetter?: boolean;
};

const KPI_COLUMNS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-1 @md:grid-cols-3",
  4: "grid-cols-2 @xl:grid-cols-4",
};

export function Kpis({ items }: { items: KpiItem[] }) {
  return (
    <Shell className="@container">
      <div className={cn("bg-table-row-border grid gap-px", KPI_COLUMNS[items.length] ?? "grid-cols-2")}>
        {items.map((item) => (
          <div className="bg-table-card min-w-0 px-4 py-3.5" key={item.label}>
            <p className="text-muted-foreground truncate text-xs">{item.label}</p>
            <div className="mt-1.5 flex items-baseline gap-x-2">
              <span className="text-2xl leading-none font-semibold tracking-tight tabular-nums">{item.value}</span>
              {item.current !== undefined ? (
                <Delta current={item.current} previous={item.previous} lowerIsBetter={item.lowerIsBetter} />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function Card({ title, footer, children }: { title?: string; footer?: string; children: ReactNode }) {
  const content = (
    <>
      {children}
      {footer ? <p className="text-muted-foreground mt-3 text-xs">{footer}</p> : null}
    </>
  );
  if (!title) return <Shell className="p-4">{content}</Shell>;
  return (
    <InstrumentModule eyebrow={title} variant="table-compact" className="flex-none" bodyClassName="p-4">
      {content}
    </InstrumentModule>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="border-border text-muted-foreground inline-flex rounded-full border px-2 py-0.5 text-[11px] whitespace-nowrap">
      {children}
    </span>
  );
}
