import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { formatCount, formatDay } from "./format";

export type Series = {
  key: string;
  label: string;
  color: string;
  values: number[];
  dashed?: boolean;
};

const PAD = { top: 8, right: 8, bottom: 22, left: 40 };

function useWidth(fallback = 640) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setWidth(Math.max(240, Math.round(element.clientWidth)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((candidate) => candidate * magnitude >= value) ?? 10;
  return step * magnitude;
}

function tickIndexes(count: number, max = 6): number[] {
  if (count <= max) return Array.from({ length: count }, (_, index) => index);
  const step = (count - 1) / (max - 1);
  return Array.from({ length: max }, (_, index) => Math.round(index * step));
}

function Legend({
  series,
  hidden,
  onToggle,
}: {
  series: Series[];
  hidden: Set<string>;
  onToggle: (key: string) => void;
}) {
  if (series.length < 2) return null;
  return (
    <div className="nv-legend">
      {series.map((item) => (
        <button key={item.key} type="button" aria-pressed={!hidden.has(item.key)} onClick={() => onToggle(item.key)}>
          <span className="nv-swatch" style={{ background: item.color }} />
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function TimeChart({
  days,
  series,
  height = 200,
  stacked = false,
  variant = "area",
  format = formatCount,
}: {
  days: string[];
  series: Series[];
  height?: number;
  stacked?: boolean;
  variant?: "area" | "line" | "bar";
  format?: (value: number) => string;
}) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [hover, setHover] = useState<number | null>(null);
  const { ref, width: WIDTH } = useWidth();
  const visible = series.filter((item) => !hidden.has(item.key));
  const innerWidth = WIDTH - PAD.left - PAD.right;
  const innerHeight = height - PAD.top - PAD.bottom;

  const stacks = useMemo(() => {
    const base = days.map(() => 0);
    return visible.map((item) => {
      const lower = [...base];
      const upper = item.values.map((value, index) => (stacked ? lower[index] : 0) + (value ?? 0));
      if (stacked) upper.forEach((value, index) => (base[index] = value));
      return { item, lower: stacked ? lower : days.map(() => 0), upper };
    });
  }, [days, visible, stacked]);

  const max = niceMax(Math.max(0, ...stacks.flatMap((stack) => stack.upper)));
  const x = (index: number) =>
    variant === "bar"
      ? PAD.left + ((index + 0.5) / Math.max(days.length, 1)) * innerWidth
      : PAD.left + (days.length <= 1 ? innerWidth / 2 : (index / (days.length - 1)) * innerWidth);
  const y = (value: number) => PAD.top + innerHeight - (value / max) * innerHeight;

  const toggle = (key: string) =>
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else if (next.size < series.length - 1) next.add(key);
      return next;
    });

  const onMove = (event: MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = ((event.clientX - rect.left) / rect.width) * WIDTH;
    const ratio = (position - PAD.left) / innerWidth;
    const index =
      variant === "bar" ? Math.floor(ratio * days.length) : Math.round(ratio * Math.max(days.length - 1, 0));
    setHover(index >= 0 && index < days.length ? index : null);
  };

  const barWidth = Math.max(
    2,
    (innerWidth / Math.max(days.length, 1)) * (stacked ? 0.7 : 0.7 / Math.max(visible.length, 1)),
  );

  return (
    <div className="nv-chart" ref={ref}>
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={`${series.map((item) => item.label).join(", ")} by day`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {[0, 0.5, 1].map((fraction) => (
          <g key={fraction}>
            <line
              className="nv-gridline"
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={y(max * fraction)}
              y2={y(max * fraction)}
            />
            <text className="nv-axis" x={PAD.left - 6} y={y(max * fraction) + 3} textAnchor="end">
              {format(max * fraction)}
            </text>
          </g>
        ))}
        {tickIndexes(days.length, Math.max(2, Math.floor(WIDTH / 90))).map((index) => (
          <text key={index} className="nv-axis" x={x(index)} y={height - 6} textAnchor="middle">
            {formatDay(days[index])}
          </text>
        ))}
        {stacks.map(({ item, lower, upper }, seriesIndex) => {
          if (variant === "bar") {
            return (
              <g key={item.key} fill={item.color}>
                {upper.map((value, index) => {
                  const offset = stacked ? 0 : (seriesIndex - (visible.length - 1) / 2) * barWidth;
                  const top = y(value);
                  const bottom = y(lower[index]);
                  return (
                    <rect
                      key={index}
                      x={x(index) - barWidth / 2 + offset}
                      y={top}
                      width={barWidth}
                      height={Math.max(0, bottom - top)}
                      rx={1.5}
                      opacity={hover === null || hover === index ? 1 : 0.55}
                    />
                  );
                })}
              </g>
            );
          }
          const line = upper.map((value, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(value)}`).join("");
          const area =
            line +
            lower
              .map((value, index) => [index, value] as const)
              .reverse()
              .map(([index, value]) => `L${x(index)},${y(value)}`)
              .join("") +
            "Z";
          return (
            <g key={item.key}>
              {variant === "area" ? <path d={area} fill={item.color} opacity={stacked ? 0.35 : 0.14} /> : null}
              <path
                d={line}
                fill="none"
                stroke={item.color}
                strokeWidth={1.75}
                strokeDasharray={item.dashed ? "4 4" : undefined}
                strokeLinejoin="round"
              />
            </g>
          );
        })}
        {hover !== null && variant !== "bar" ? (
          <g>
            <line className="nv-gridline" x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerHeight} />
            {stacks.map(({ item, upper }) => (
              <circle key={item.key} cx={x(hover)} cy={y(upper[hover])} r={3} fill={item.color} />
            ))}
          </g>
        ) : null}
      </svg>
      {hover !== null ? (
        <div
          className="nv-tooltip"
          style={{
            left: `${(x(hover) / WIDTH) * 100}%`,
            transform: x(hover) > WIDTH / 2 ? "translateX(calc(-100% - 8px))" : "translateX(8px)",
          }}
        >
          <div className="nv-tooltip-day">{formatDay(days[hover])}</div>
          {visible.map((item) => (
            <div className="nv-tooltip-row" key={item.key}>
              <span>
                <span className="nv-swatch" style={{ background: item.color }} />
                {item.label}
              </span>
              <strong>{format(item.values[hover] ?? 0)}</strong>
            </div>
          ))}
        </div>
      ) : null}
      <Legend series={series} hidden={hidden} onToggle={toggle} />
    </div>
  );
}

export type Slice = { label: string; value: number; color: string };

export function Donut({ slices, center, caption }: { slices: Slice[]; center: string; caption?: string }) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg
      viewBox="0 0 180 180"
      role="img"
      aria-label={slices.map((slice) => `${slice.label} ${slice.value}`).join(", ")}
    >
      <g transform="rotate(-90 90 90)">
        {slices.map((slice) => {
          const length = (slice.value / total) * circumference;
          const dash = `${Math.max(0, length - 2)} ${circumference}`;
          const element = (
            <circle
              key={slice.label}
              cx={90}
              cy={90}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={18}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
            />
          );
          offset += length;
          return element;
        })}
      </g>
      <text x={90} y={88} textAnchor="middle" fontSize={22} fontWeight={600} fill="currentColor">
        {center}
      </text>
      {caption ? (
        <text x={90} y={108} textAnchor="middle" fontSize={11} className="nv-axis">
          {caption}
        </text>
      ) : null}
    </svg>
  );
}

export function BarList({
  rows,
}: {
  rows: { label: string; value: number; max?: number; display: string; color: string }[];
}) {
  const max = Math.max(...rows.map((row) => row.max ?? row.value), 1);
  return (
    <div className="nv-list">
      {rows.map((row) => (
        <div className="nv-row" key={row.label}>
          <span className="nv-row-label" title={row.label}>
            {row.label}
          </span>
          <div className="nv-bar-track">
            <div className="nv-bar-fill" style={{ width: `${(row.value / max) * 100}%`, background: row.color }} />
          </div>
          <span className="nv-row-value">{row.display}</span>
        </div>
      ))}
    </div>
  );
}

export function SplitBar({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = parts.reduce((sum, part) => sum + part.value, 0);
  if (total === 0) return <div className="nv-bar-track" />;
  return (
    <div className="nv-bar-track" role="img" aria-label={parts.map((part) => `${part.label} ${part.value}`).join(", ")}>
      {parts.map((part) => (
        <div
          key={part.label}
          className="nv-bar-fill"
          title={`${part.label}: ${part.value}`}
          style={{ width: `${(part.value / total) * 100}%`, background: part.color }}
        />
      ))}
    </div>
  );
}

function wrapLabel(label: string, width = 16): string[] {
  const lines: string[] = [];
  for (const word of label.split(" ")) {
    const last = lines[lines.length - 1];
    if (last && `${last} ${word}`.length <= width) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines.slice(0, 2);
}

export function Gauge({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <svg viewBox="0 0 160 160" role="img" aria-label={`${label} ${Math.round(clamped)} of 100`}>
      <circle cx={80} cy={80} r={radius} fill="none" stroke="var(--grid)" strokeWidth={12} />
      <circle
        cx={80}
        cy={80}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={`${(clamped / 100) * circumference} ${circumference}`}
        transform="rotate(-90 80 80)"
      />
      <text x={80} y={84} textAnchor="middle" fontSize={32} fontWeight={600} fill="currentColor">
        {Math.round(clamped)}
      </text>
      <text x={80} y={106} textAnchor="middle" fontSize={11} className="nv-axis">
        {wrapLabel(label).map((line, index) => (
          <tspan key={line} x={80} dy={index ? 13 : 0}>
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  );
}
