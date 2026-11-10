import { Gauge, TimeChart } from "../shared/charts";
import { formatDay, titleCase } from "../shared/format";
import { Card, Kpis, NotraView, Pill } from "../shared/layout";
import { pick, PRIMARY } from "../shared/palette";
import { DataTable } from "../shared/table";

type Tier = { earned: number; available: number; passing: number; total: number };

type Output = {
  targetUrl: string;
  report: {
    status: "running" | "completed" | "failed";
    score: number | null;
    scoreLabel: string | null;
    scoreBreakdown: { essential: Tier; recommended: Tier; bonus: { points: number } } | null;
    issues: { id: string; name: string; tier: string; result: "failed" | "partial"; recommendation: string | null }[];
    scannedAt: string | null;
  } | null;
  history: { id: string; score: number | null; scannedAt: string }[];
  comparison: { previousScore: number | null } | null;
};

function scoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export default function GeoAgentReadiness() {
  return (
    <NotraView<Output>
      title="Agent readiness"
      subtitle={(output) => output.targetUrl}
      isEmpty={(output) => !output.report || output.report.score === null}
      emptyMessage="No completed readiness scan yet. Start one with start_geo_agent_readiness_scan."
    >
      {(output, theme) => {
        const report = output.report!;
        const score = report.score ?? 0;
        const breakdown = report.scoreBreakdown;
        const history = [
          ...new Map(
            [...output.history]
              .filter((item) => item.score !== null)
              .sort((a, b) => a.scannedAt.localeCompare(b.scannedAt))
              .map((item) => [item.scannedAt.slice(0, 10), item]),
          ).values(),
        ];
        return (
          <>
            <Card>
              <div className="nv-split">
                <Gauge value={score} label={report.scoreLabel ?? "Score"} color={scoreColor(score)} />
                <Kpis
                  items={[
                    {
                      label: "Score",
                      value: `${Math.round(score)}/100`,
                      current: score,
                      previous: output.comparison?.previousScore,
                    },
                    ...(breakdown
                      ? [
                          {
                            label: "Essential checks",
                            value: `${breakdown.essential.passing}/${breakdown.essential.total}`,
                          },
                          {
                            label: "Recommended",
                            value: `${breakdown.recommended.passing}/${breakdown.recommended.total}`,
                          },
                          { label: "Bonus points", value: String(breakdown.bonus.points) },
                        ]
                      : []),
                  ]}
                />
              </div>
            </Card>
            {history.length > 1 ? (
              <Card title="Score history">
                <TimeChart
                  days={history.map((item) => item.scannedAt)}
                  variant="line"
                  height={140}
                  series={[
                    {
                      key: "score",
                      label: "Score",
                      color: pick(PRIMARY, theme),
                      values: history.map((item) => item.score ?? 0),
                    },
                  ]}
                />
              </Card>
            ) : null}
            {report.issues.length ? (
              <DataTable
                title="Open issues"
                readout={report.scannedAt ? `Scanned ${formatDay(report.scannedAt)}` : undefined}
                columns={[
                  { label: "Check", wrap: true },
                  { label: "Status", numeric: true },
                ]}
                rows={report.issues.slice(0, 8).map((issue) => ({
                  key: issue.id,
                  cells: [
                    <div>
                      <div className="font-medium">{issue.name}</div>
                      {issue.recommendation ? (
                        <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{issue.recommendation}</p>
                      ) : null}
                    </div>,
                    <div className="flex flex-col items-end gap-1">
                      <Pill>{titleCase(issue.tier)}</Pill>
                      <Pill>{titleCase(issue.result)}</Pill>
                    </div>,
                  ],
                }))}
              />
            ) : null}
          </>
        );
      }}
    </NotraView>
  );
}
