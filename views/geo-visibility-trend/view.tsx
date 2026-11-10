import { TimeChart } from "../shared/charts";
import { pivot, topGroups } from "../shared/data";
import { formatCount, formatPercent, sumBy, engineLabel } from "../shared/format";
import { Card, Kpis, NotraView } from "../shared/layout";
import { pick, PRIMARY, seriesColor } from "../shared/palette";

type Output = {
  configured: boolean;
  points: { day: string; engine: string; checks: number; mentions: number; citations: number; visibility: number }[];
};

export default function GeoVisibilityTrend() {
  return (
    <NotraView<Output>
      title="AI visibility trend"
      subtitle={(output) => `${new Set(output.points.map((point) => point.engine)).size} engines tracked`}
      isEmpty={(output) => !output.configured || output.points.length === 0}
      emptyMessage="No visibility checks yet. Run a GEO scan to start tracking."
    >
      {(output, theme) => {
        const total = pivot(
          output.points,
          (point) => point.day,
          () => "all",
          (point) => point.mentions,
        );
        const engines = pivot(
          output.points,
          (point) => point.day,
          (point) => point.engine,
          (point) => point.mentions,
        );
        const checks = sumBy(output.points, (point) => point.checks);
        const mentions = sumBy(output.points, (point) => point.mentions);
        const half = Math.floor(total.days.length / 2);
        const values = total.groups.get("all") ?? [];
        const firstHalf = values.slice(0, half).reduce((sum, value) => sum + value, 0);
        const secondHalf = values.slice(values.length - half).reduce((sum, value) => sum + value, 0);
        return (
          <>
            <Kpis
              items={[
                { label: "Mentions", value: formatCount(mentions), current: secondHalf, previous: firstHalf },
                { label: "Checks", value: formatCount(checks) },
                { label: "Mention rate", value: formatPercent(checks ? mentions / checks : null) },
                { label: "Citations", value: formatCount(sumBy(output.points, (point) => point.citations)) },
              ]}
            />
            <Card title="Mentions per day">
              <TimeChart
                days={engines.days}
                series={[
                  { key: "all", label: "All engines", color: pick(PRIMARY, theme), values },
                  ...topGroups(engines.groups, 6).map(([engine, engineValues], index) => ({
                    key: engine,
                    label: engineLabel(engine),
                    color: seriesColor(index + 1, theme),
                    values: engineValues,
                  })),
                ]}
                variant="line"
              />
            </Card>
          </>
        );
      }}
    </NotraView>
  );
}
