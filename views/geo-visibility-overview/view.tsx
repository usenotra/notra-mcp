import { BarList } from "../shared/charts";
import { formatCount, formatPercent, sumBy, engineLabel } from "../shared/format";
import { Card, Kpis, NotraView } from "../shared/layout";
import { seriesColor } from "../shared/palette";

type Output = {
  configured: boolean;
  engines: {
    engine: string;
    checks: number;
    mentions: number;
    mentionRate: number;
    citations: number;
    visibilityRate: number;
    avgPosition: number | null;
  }[];
};

export default function GeoVisibilityOverview() {
  return (
    <NotraView<Output>
      title="AI visibility by engine"
      isEmpty={(output) => !output.configured || output.engines.length === 0}
      emptyMessage="No visibility checks yet. Run a GEO scan to start tracking."
    >
      {(output, theme) => {
        const checks = sumBy(output.engines, (engine) => engine.checks);
        const mentions = sumBy(output.engines, (engine) => engine.mentions);
        const engines = [...output.engines].sort((a, b) => b.mentionRate - a.mentionRate);
        return (
          <>
            <Kpis
              items={[
                { label: "Mention rate", value: formatPercent(checks ? mentions / checks : null) },
                { label: "Mentions", value: formatCount(mentions) },
                { label: "Checks", value: formatCount(checks) },
                { label: "Citations", value: formatCount(sumBy(output.engines, (engine) => engine.citations)) },
              ]}
            />
            <Card title="Mention rate per engine">
              <BarList
                rows={engines.map((engine, index) => ({
                  label: engineLabel(engine.engine),
                  value: engine.mentionRate,
                  max: 1,
                  display: `${formatPercent(engine.mentionRate)} · ${formatCount(engine.mentions)}/${formatCount(engine.checks)}`,
                  color: seriesColor(index, theme),
                }))}
              />
            </Card>
          </>
        );
      }}
    </NotraView>
  );
}
