const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en");

export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  return Math.abs(value) >= 10_000 ? compact.format(value) : whole.format(Math.round(value));
}

export function formatPercent(value: number | null | undefined, fraction = true): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  const percent = fraction ? value * 100 : value;
  return `${Math.abs(percent) >= 10 || percent === 0 ? Math.round(percent) : percent.toFixed(1)}%`;
}

export function formatMs(value: number | null | undefined): string {
  if (value === null || value === undefined) return "–";
  return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${Math.round(value)}ms`;
}

export function formatDay(day: string): string {
  const date = new Date(`${day.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return day;
  return date.toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" });
}

export function change(current: number, previous: number | null | undefined): number | null {
  if (previous === null || previous === undefined || previous === 0) return null;
  return (current - previous) / previous;
}

export function sortedDays(days: Iterable<string>): string[] {
  return [...new Set(days)].sort();
}

export function sumBy<T>(items: readonly T[], value: (item: T) => number): number {
  return items.reduce((total, item) => total + value(item), 0);
}

export function titleCase(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}
