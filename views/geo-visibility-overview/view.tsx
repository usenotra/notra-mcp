import { BarList } from "../shared/charts";
import { formatCount, formatPercent, sumBy } from "../shared/format";
import { engineFamily, isAnswerEngine } from "../shared/engines";
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

const ENGINE_LIMIT = 15;

type EngineRow = Output["engines"][number];

function groupEngines(rows: EngineRow[]) {
  const products = new Map<string, { engine: string; checks: number; mentions: number; citations: number }>();
  for (const row of rows) {
    const product = engineFamily(row.engine);
    const total = products.get(product) ?? { engine: product, checks: 0, mentions: 0, citations: 0 };
    total.checks += row.checks;
    total.mentions += row.mentions;
    total.citations += row.citations;
    products.set(product, total);
  }
  return [...products.values()].map((total) => ({
    ...total,
    mentionRate: total.checks ? total.mentions / total.checks : 0,
  }));
}

export default function GeoVisibilityOverview() {
  return (
    <NotraView<Output>
      title="AI visibility by engine"
      isEmpty={(output) => !output.configured || !output.engines.some((engine) => isAnswerEngine(engine.engine))}
      emptyMessage="No visibility checks yet. Run a GEO scan to start tracking."
    >
      {(output, theme) => {
        const tracked = output.engines.filter((engine) => isAnswerEngine(engine.engine));
        const checks = sumBy(tracked, (engine) => engine.checks);
        const mentions = sumBy(tracked, (engine) => engine.mentions);
        const products = groupEngines(tracked);
        const sorted = [...products].sort((a, b) => b.mentionRate - a.mentionRate || b.checks - a.checks);
        const engines = sorted.filter((engine) => engine.mentions > 0).slice(0, ENGINE_LIMIT);
        const hidden = sorted.length - engines.length;
        return (
          <>
            <Kpis
              items={[
                { label: "Mention rate", value: formatPercent(checks ? mentions / checks : null) },
                { label: "Mentions", value: formatCount(mentions) },
                { label: "Checks", value: formatCount(checks) },
                { label: "Citations", value: formatCount(sumBy(tracked, (engine) => engine.citations)) },
              ]}
            />
            <Card
              title="Mention rate per engine"
              footer={
                hidden ? `${hidden} more ${hidden === 1 ? "engine" : "engines"} with fewer or no mentions` : undefined
              }
            >
              <BarList
                rows={engines.map((engine, index) => ({
                  label: engine.engine,
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
