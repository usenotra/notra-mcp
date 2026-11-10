import { formatCount } from "../shared/format";
import { Kpis, NotraView } from "../shared/layout";
import { TrafficCharts, type TrafficPoint, type TrafficSource } from "../shared/traffic";

type Output = {
  agentReach: {
    url: string;
    configured: boolean;
    totals: { crawled: number; cited: number; referred: number; total: number };
    sources: TrafficSource[];
    points: TrafficPoint[];
  } | null;
};

export default function PostAgentReach() {
  return (
    <NotraView<Output>
      title="Post agent reach"
      subtitle={(output) => output.agentReach?.url}
      isEmpty={(output) => !output.agentReach}
      emptyMessage="This post is not live on a Notra Site yet."
    >
      {(output, theme) => {
        const reach = output.agentReach!;
        if (!reach.configured) return <p className="nv-state">AI traffic tracking is off for this site.</p>;
        return (
          <>
            <Kpis
              items={[
                { label: "Total AI visits", value: formatCount(reach.totals.total) },
                { label: "Crawled", value: formatCount(reach.totals.crawled) },
                { label: "Cited", value: formatCount(reach.totals.cited) },
                { label: "Referred", value: formatCount(reach.totals.referred) },
              ]}
            />
            <TrafficCharts points={reach.points} sources={reach.sources} theme={theme} />
          </>
        );
      }}
    </NotraView>
  );
}
