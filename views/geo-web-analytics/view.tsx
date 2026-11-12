import { BarList, TimeChart } from "../shared/charts";
import { formatCount } from "../shared/format";
import { Card, Kpis, NotraView } from "../shared/layout";
import { pick, PRIMARY, SECONDARY, seriesColor } from "../shared/palette";

type Output = {
  configured: boolean;
  hosts: { host: string; views: number }[];
  totals: {
    views: number;
    previousViews: number;
    visitors: number;
    previousVisitors: number;
    sessions: number;
    previousSessions: number;
    aiVisitors: number;
    previousAiVisitors: number;
  };
  points: { day: string; views: number; visitors: number }[];
};

export default function GeoWebAnalytics() {
  return (
    <NotraView<Output>
      title="Website analytics"
      subtitle={(output) => output.hosts.map((host) => host.host).join(", ") || undefined}
      isEmpty={(output) => !output.configured}
      emptyMessage="Website analytics is not set up. Add notra.js to your site from the dashboard."
    >
      {(output, theme) => {
        const points = [...output.points].sort((a, b) => a.day.localeCompare(b.day));
        const { totals } = output;
        return (
          <>
            <Kpis
              items={[
                {
                  label: "Visitors",
                  value: formatCount(totals.visitors),
                  current: totals.visitors,
                  previous: totals.previousVisitors,
                },
                {
                  label: "Page views",
                  value: formatCount(totals.views),
                  current: totals.views,
                  previous: totals.previousViews,
                },
                {
                  label: "Sessions",
                  value: formatCount(totals.sessions),
                  current: totals.sessions,
                  previous: totals.previousSessions,
                },
                {
                  label: "From AI",
                  value: formatCount(totals.aiVisitors),
                  current: totals.aiVisitors,
                  previous: totals.previousAiVisitors,
                },
              ]}
            />
            <Card title="Visitors and views per day">
              <TimeChart
                days={points.map((point) => point.day)}
                series={[
                  {
                    key: "views",
                    label: "Page views",
                    color: pick(PRIMARY, theme),
                    values: points.map((point) => point.views),
                  },
                  {
                    key: "visitors",
                    label: "Visitors",
                    color: pick(SECONDARY, theme),
                    values: points.map((point) => point.visitors),
                  },
                ]}
              />
            </Card>
            {output.hosts.length > 1 ? (
              <Card title="Views per host">
                <BarList
                  rows={output.hosts.map((host, index) => ({
                    label: host.host,
                    value: host.views,
                    display: formatCount(host.views),
                    color: seriesColor(index, theme),
                  }))}
                />
              </Card>
            ) : null}
          </>
        );
      }}
    </NotraView>
  );
}
