import { sortedDays } from "./format";

export function pivot<T>(
  rows: readonly T[],
  day: (row: T) => string,
  group: (row: T) => string,
  value: (row: T) => number,
): { days: string[]; groups: Map<string, number[]> } {
  const days = sortedDays(rows.map(day));
  const index = new Map(days.map((item, position) => [item, position]));
  const groups = new Map<string, number[]>();
  for (const row of rows) {
    const key = group(row);
    let values = groups.get(key);
    if (!values) {
      values = days.map(() => 0);
      groups.set(key, values);
    }
    values[index.get(day(row)) ?? 0] += value(row);
  }
  return { days, groups };
}

export function topGroups(groups: Map<string, number[]>, limit: number): [string, number[]][] {
  return [...groups.entries()]
    .sort((a, b) => b[1].reduce((sum, value) => sum + value, 0) - a[1].reduce((sum, value) => sum + value, 0))
    .slice(0, limit);
}
