import { TimeChart } from "../shared/charts";
import { formatCount, formatDay, formatPercent, sumBy, engineLabel } from "../shared/format";
import { Card, Kpis, NotraView } from "../shared/layout";
import { pick, SECONDARY } from "../shared/palette";

type Output = {
  configured: boolean;
  points: { day: string; mentions: number; checks: number }[];
  prompts: {
    promptId: string;
    prompt: string;
    engine: string;
    capturedAt: string;
    mentioned: boolean;
    position: number | null;
  }[];
};

export default function GeoCompetitorDetail() {
  return (
    <NotraView<Output>
      title="Competitor mentions"
      subtitle={(_, input) => (typeof input?.brand === "string" ? input.brand : undefined)}
      isEmpty={(output) => !output.configured || output.points.length === 0}
      emptyMessage="No checks mention this brand in the selected period."
    >
      {(output, theme) => {
        const points = [...output.points].sort((a, b) => a.day.localeCompare(b.day));
        const mentions = sumBy(points, (point) => point.mentions);
        const checks = sumBy(points, (point) => point.checks);
        const recent = output.prompts.filter((prompt) => prompt.mentioned).slice(0, 6);
        return (
          <>
            <Kpis
              items={[
                { label: "Mentions", value: formatCount(mentions) },
                { label: "Checks", value: formatCount(checks) },
                { label: "Mention rate", value: formatPercent(checks ? mentions / checks : null) },
              ]}
            />
            <Card title="Mentions per day">
              <TimeChart
                days={points.map((point) => point.day)}
                variant="bar"
                series={[
                  {
                    key: "mentions",
                    label: "Mentions",
                    color: pick(SECONDARY, theme),
                    values: points.map((point) => point.mentions),
                  },
                ]}
              />
            </Card>
            {recent.length ? (
              <Card title="Recent prompts that mention it">
                <table className="nv-table">
                  <thead>
                    <tr>
                      <th>Prompt</th>
                      <th>Engine</th>
                      <th className="num">Position</th>
                      <th className="num">Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((prompt) => (
                      <tr key={`${prompt.promptId}-${prompt.engine}-${prompt.capturedAt}`}>
                        <td>{prompt.prompt}</td>
                        <td>{engineLabel(prompt.engine)}</td>
                        <td className="num">{prompt.position ?? "–"}</td>
                        <td className="num">{formatDay(prompt.capturedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ) : null}
          </>
        );
      }}
    </NotraView>
  );
}
