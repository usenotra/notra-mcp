import { BarList, TimeChart } from "./charts";
import { pivot } from "./data";
import { formatCount, titleCase } from "./format";
import { Card } from "./layout";
import { MUTED, pick, PRIMARY, REFERRAL, SECONDARY, seriesColor, type Theme } from "./palette";

export type VisitorType = "crawler" | "ai_referral" | "human" | "unknown";

export type TrafficSource = {
  source: string;
  visitorType: VisitorType;
  agent: string;
  visits: number;
  previousVisits?: number;
};

export type TrafficPoint = { day: string; visitorType: VisitorType; source: string; visits: number };

export const TYPE_LABELS: Record<VisitorType, string> = {
  crawler: "AI crawlers",
  ai_referral: "AI referrals",
  human: "People",
  unknown: "Unknown",
};

export function typeColor(type: VisitorType, theme: Theme): string {
  if (type === "crawler") return pick(PRIMARY, theme);
  if (type === "ai_referral") return pick(REFERRAL, theme);
  if (type === "human") return pick(SECONDARY, theme);
  return pick(MUTED, theme);
}

export function TrafficCharts({
  points,
  sources,
  theme,
}: {
  points: TrafficPoint[];
  sources: TrafficSource[];
  theme: Theme;
}) {
  const byType = pivot(
    points,
    (point) => point.day,
    (point) => point.visitorType,
    (point) => point.visits,
  );
  const types = (["crawler", "ai_referral", "human", "unknown"] as const).filter((type) => byType.groups.has(type));
  const top = [...sources].sort((a, b) => b.visits - a.visits).slice(0, 8);
  return (
    <>
      <Card title="Visits per day">
        <TimeChart
          days={byType.days}
          stacked
          series={types.map((type) => ({
            key: type,
            label: TYPE_LABELS[type],
            color: typeColor(type, theme),
            values: byType.groups.get(type) ?? [],
          }))}
        />
      </Card>
      {top.length ? (
        <Card title="Top sources">
          <BarList
            rows={top.map((source, index) => ({
              label: `${source.agent || titleCase(source.source)} · ${TYPE_LABELS[source.visitorType]}`,
              value: source.visits,
              display: formatCount(source.visits),
              color: seriesColor(index, theme),
            }))}
          />
        </Card>
      ) : null}
    </>
  );
}
