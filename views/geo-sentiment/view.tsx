import { SplitBar, TimeChart } from "../shared/charts";
import { formatCount, formatPercent } from "../shared/format";
import { engineFamily, isAnswerEngine } from "../shared/engines";
import { Card, Kpis, NotraView } from "../shared/layout";
import { SENTIMENT } from "../shared/palette";

type Counts = {
  mentions: number;
  positive: number;
  neutral: number;
  negative: number;
  score: number | null;
  positiveShare: number | null;
  negativeShare: number | null;
  classificationCoverage: number | null;
};

type Output = {
  configured: boolean;
  summary: Counts;
  engines: (Counts & { engine: string })[];
  points: (Counts & { day: string })[];
  comparison?: { summary: Counts } | null;
};

function groupEngines(rows: Output["engines"]) {
  const products = new Map<
    string,
    {
      engine: string;
      mentions: number;
      positive: number;
      neutral: number;
      negative: number;
      scored: number;
      weighted: number;
    }
  >();
  for (const row of rows) {
    const product = engineFamily(row.engine);
    const total = products.get(product) ?? {
      engine: product,
      mentions: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      scored: 0,
      weighted: 0,
    };
    total.mentions += row.mentions;
    total.positive += row.positive;
    total.neutral += row.neutral;
    total.negative += row.negative;
    if (row.score !== null) {
      const classified = row.positive + row.neutral + row.negative || row.mentions;
      total.scored += classified;
      total.weighted += row.score * classified;
    }
    products.set(product, total);
  }
  return [...products.values()].map((total) => ({
    ...total,
    score: total.scored ? total.weighted / total.scored : null,
  }));
}

export default function GeoSentiment() {
  return (
    <NotraView<Output>
      title="Brand sentiment"
      subtitle={(output) => `${formatCount(output.summary.mentions)} mentions classified`}
      isEmpty={(output) => !output.configured || output.summary.mentions === 0}
      emptyMessage="No classified mentions yet."
    >
      {(output, theme) => {
        const points = [...output.points].sort((a, b) => a.day.localeCompare(b.day));
        const previous = output.comparison?.summary;
        const parts = (counts: Pick<Counts, "positive" | "neutral" | "negative">) => [
          { label: "Positive", value: counts.positive, color: SENTIMENT.positive[theme] },
          { label: "Neutral", value: counts.neutral, color: SENTIMENT.neutral[theme] },
          { label: "Negative", value: counts.negative, color: SENTIMENT.negative[theme] },
        ];
        return (
          <>
            <Kpis
              items={[
                {
                  label: "Sentiment score",
                  value: output.summary.score === null ? "–" : `${Math.round(output.summary.score)}/100`,
                  current: output.summary.score ?? undefined,
                  previous: previous?.score,
                },
                { label: "Positive", value: formatPercent(output.summary.positiveShare) },
                { label: "Negative", value: formatPercent(output.summary.negativeShare) },
                { label: "Coverage", value: formatPercent(output.summary.classificationCoverage) },
              ]}
            />
            <Card title="Sentiment per day">
              <TimeChart
                days={points.map((point) => point.day)}
                variant="bar"
                stacked
                series={parts(output.summary).map((part) => ({
                  key: part.label,
                  label: part.label,
                  color: part.color,
                  values: points.map((point) => point[part.label.toLowerCase() as "positive" | "neutral" | "negative"]),
                }))}
              />
            </Card>
            <Card title="By engine">
              <div className="nv-list">
                {groupEngines(output.engines.filter((engine) => isAnswerEngine(engine.engine)))
                  .filter((engine) => engine.score !== null)
                  .sort((a, b) => b.mentions - a.mentions)
                  .map((engine) => (
                    <div className="nv-row" key={engine.engine}>
                      <span className="nv-row-label">{engine.engine}</span>
                      <SplitBar parts={parts(engine)} />
                      <span className="nv-row-value">{engine.score === null ? "–" : Math.round(engine.score)}</span>
                    </div>
                  ))}
              </div>
            </Card>
          </>
        );
      }}
    </NotraView>
  );
}
