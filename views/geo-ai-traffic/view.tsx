import { formatCount } from "../shared/format";
import { Kpis, NotraView } from "../shared/layout";
import { TrafficCharts, type TrafficPoint, type TrafficSource } from "../shared/traffic";

type Output = {
  configured: boolean;
  totals: { crawler: number; cited: number; aiReferral: number; conversions: number | null };
  previousConversions: number | null;
  sources: TrafficSource[];
  points: TrafficPoint[];
};

export default function GeoAiTraffic() {
  return (
    <NotraView<Output>
      title="AI traffic"
      subtitle={(output) => `${output.sources.length} sources`}
      isEmpty={(output) => !output.configured}
      emptyMessage="AI traffic tracking is not set up. Call get_geo_ingest_setup for setup steps."
    >
      {(output, theme) => (
        <>
          <Kpis
            items={[
              { label: "Crawler visits", value: formatCount(output.totals.crawler) },
              { label: "Cited", value: formatCount(output.totals.cited) },
              { label: "AI referrals", value: formatCount(output.totals.aiReferral) },
              {
                label: "Conversions",
                value: formatCount(output.totals.conversions),
                current: output.totals.conversions ?? undefined,
                previous: output.previousConversions,
              },
            ]}
          />
          <TrafficCharts points={output.points} sources={output.sources} theme={theme} />
        </>
      )}
    </NotraView>
  );
}
