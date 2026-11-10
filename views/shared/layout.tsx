import { ErrorBoundary, useToolContext, useViewTheme } from "mcp-use/react";
import type { ReactNode } from "react";
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
  return (
    <div className="notra-view" data-theme={theme}>
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
    body = <div className="nv-skeleton" aria-label="Loading" />;
  } else if (context.status === "error") {
    body = <p className="nv-state">{context.error.message}</p>;
  } else {
    const output = context.toolOutput as T;
    detail = subtitle?.(output, context.toolInput as Record<string, unknown> | undefined);
    body =
      isEmpty?.(output) === true ? (
        <p className="nv-state">{emptyMessage ?? "No data for this period yet."}</p>
      ) : (
        children(output, theme)
      );
  }

  return (
    <>
      <header className="nv-header">
        <div>
          <h1 className="nv-title">{title}</h1>
          {detail ? <p className="nv-subtitle">{detail}</p> : null}
        </div>
        <span className="nv-brand">Notra</span>
      </header>
      {body}
    </>
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
  const direction = better > 0.005 ? "up" : better < -0.005 ? "down" : "flat";
  const sign = ratio > 0 ? "+" : "";
  return (
    <span className="nv-delta" data-direction={direction}>
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

export function Kpis({ items }: { items: KpiItem[] }) {
  return (
    <div className="nv-kpis">
      {items.map((item) => (
        <div className="nv-kpi" key={item.label}>
          <div className="nv-kpi-label">{item.label}</div>
          <div className="nv-kpi-value">
            {item.value}
            {item.current !== undefined ? (
              <Delta current={item.current} previous={item.previous} lowerIsBetter={item.lowerIsBetter} />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Card({ title, footer, children }: { title?: string; footer?: string; children: ReactNode }) {
  return (
    <section className="nv-card">
      {title ? <h2 className="nv-card-title">{title}</h2> : null}
      {children}
      {footer ? <p className="nv-subtitle nv-card-footer">{footer}</p> : null}
    </section>
  );
}
