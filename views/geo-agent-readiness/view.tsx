import { Gauge, TimeChart } from "../shared/charts";
import { formatDay, titleCase } from "../shared/format";
import { Card, Kpis, NotraView } from "../shared/layout";
import { pick, PRIMARY } from "../shared/palette";

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
        const history = [...output.history]
          .filter((item) => item.score !== null)
          .sort((a, b) => a.scannedAt.localeCompare(b.scannedAt));
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
              <Card title="Open issues">
                <table className="nv-table">
                  <tbody>
                    {report.issues.slice(0, 8).map((issue) => (
                      <tr key={issue.id}>
                        <td>
                          {issue.name}
                          {issue.recommendation ? <div className="nv-subtitle">{issue.recommendation}</div> : null}
                        </td>
                        <td className="num">
                          <span className="nv-pill">{titleCase(issue.tier)}</span>{" "}
                          <span className="nv-pill">{issue.result}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ) : null}
            {report.scannedAt ? <p className="nv-subtitle">Scanned {formatDay(report.scannedAt)}</p> : null}
          </>
        );
      }}
    </NotraView>
  );
}
