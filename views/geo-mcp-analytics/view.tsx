import { TimeChart } from "../shared/charts";
import { formatCount, formatMs, formatPercent } from "../shared/format";
import { Card, Kpis, NotraView } from "../shared/layout";
import { MUTED, pick, PRIMARY, REFERRAL, SECONDARY } from "../shared/palette";

type Output = {
  configured: boolean;
  server: { name: string; version: string } | null;
  totals: {
    requests: number;
    previousRequests: number;
    toolCalls: number;
    previousToolCalls: number;
    errors: number;
    previousErrors: number;
    sessions: number;
    previousSessions: number;
    users: number;
    previousUsers: number;
    p95Ms: number;
    previousP95Ms: number;
  };
  daily: { day: string; toolsCall: number; resourcesRead: number; promptsGet: number; other: number; errors: number }[];
  tools: { name: string; calls: number; errors: number; p95Ms: number }[];
};

export default function GeoMcpAnalytics() {
  return (
    <NotraView<Output>
      title="MCP server analytics"
      subtitle={(output) => (output.server ? `${output.server.name} ${output.server.version}` : undefined)}
      isEmpty={(output) => !output.configured}
      emptyMessage="No MCP usage recorded yet. Track your server with @usenotra/geo/mcp."
    >
      {(output, theme) => {
        const { totals } = output;
        const daily = [...output.daily].sort((a, b) => a.day.localeCompare(b.day));
        const tools = [...output.tools].sort((a, b) => b.calls - a.calls).slice(0, 8);
        return (
          <>
            <Kpis
              items={[
                {
                  label: "Tool calls",
                  value: formatCount(totals.toolCalls),
                  current: totals.toolCalls,
                  previous: totals.previousToolCalls,
                },
                {
                  label: "Sessions",
                  value: formatCount(totals.sessions),
                  current: totals.sessions,
                  previous: totals.previousSessions,
                },
                {
                  label: "Users",
                  value: formatCount(totals.users),
                  current: totals.users,
                  previous: totals.previousUsers,
                },
                { label: "Error rate", value: formatPercent(totals.requests ? totals.errors / totals.requests : null) },
                {
                  label: "p95 latency",
                  value: formatMs(totals.p95Ms),
                  current: totals.p95Ms,
                  previous: totals.previousP95Ms,
                  lowerIsBetter: true,
                },
              ]}
            />
            <Card title="Requests per day">
              <TimeChart
                days={daily.map((day) => day.day)}
                stacked
                series={[
                  {
                    key: "toolsCall",
                    label: "tools/call",
                    color: pick(PRIMARY, theme),
                    values: daily.map((day) => day.toolsCall),
                  },
                  {
                    key: "resourcesRead",
                    label: "resources/read",
                    color: pick(SECONDARY, theme),
                    values: daily.map((day) => day.resourcesRead),
                  },
                  {
                    key: "promptsGet",
                    label: "prompts/get",
                    color: pick(REFERRAL, theme),
                    values: daily.map((day) => day.promptsGet),
                  },
                  { key: "other", label: "Other", color: pick(MUTED, theme), values: daily.map((day) => day.other) },
                ]}
              />
            </Card>
            {tools.length ? (
              <Card title="Top tools">
                <table className="nv-table">
                  <thead>
                    <tr>
                      <th>Tool</th>
                      <th className="num">Calls</th>
                      <th className="num">Errors</th>
                      <th className="num">p95</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tools.map((tool) => (
                      <tr key={tool.name}>
                        <td>{tool.name}</td>
                        <td className="num">{formatCount(tool.calls)}</td>
                        <td className="num">{formatPercent(tool.calls ? tool.errors / tool.calls : null)}</td>
                        <td className="num">{formatMs(tool.p95Ms)}</td>
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
