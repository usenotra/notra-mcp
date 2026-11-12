import { BarList, TimeChart } from "../shared/charts";
import { pivot } from "../shared/data";
import { formatCount, formatPercent, sumBy, titleCase } from "../shared/format";
import { Card, Kpis, NotraView } from "../shared/layout";
import { TYPE_LABELS, typeColor, type VisitorType } from "../shared/traffic";
import { seriesColor } from "../shared/palette";

type Daily = { day: string; journeys: number }[];

type Output = {
  configured: boolean;
  sources: {
    source: string;
    visitorType: "crawler" | "ai_referral" | "human" | "unknown";
    journeys: number;
    previousJourneys: number;
    pages: number;
    deepCrawls: number;
    daily: Daily;
  }[];
  pages: { path: string; journeys: number; daily: Daily }[];
  totalPages: number;
  previousTotalPages: number;
};

export default function GeoJourneys() {
  return (
    <NotraView<Output>
      title="AI journeys"
      isEmpty={(output) => !output.configured || output.sources.length === 0}
      emptyMessage="No AI journeys recorded yet."
    >
      {(output, theme) => {
        const journeys = sumBy(output.sources, (source) => source.journeys);
        const previous = sumBy(output.sources, (source) => source.previousJourneys);
        const deep = sumBy(output.sources, (source) => source.deepCrawls);
        const rows = output.sources.flatMap((source) =>
          source.daily.map((day) => ({ ...day, visitorType: source.visitorType })),
        );
        const trend = pivot(
          rows,
          (row) => row.day,
          (row) => row.visitorType,
          (row) => row.journeys,
        );
        return (
          <>
            <Kpis
              items={[
                { label: "Journeys", value: formatCount(journeys), current: journeys, previous },
                {
                  label: "Pages reached",
                  value: formatCount(output.totalPages),
                  current: output.totalPages,
                  previous: output.previousTotalPages,
                },
                { label: "Deep crawls", value: formatPercent(journeys ? deep / journeys : null) },
              ]}
            />
            <Card title="Journeys per day">
              <TimeChart
                days={trend.days}
                stacked
                series={[...trend.groups.entries()].map(([type, values]) => ({
                  key: type,
                  label: TYPE_LABELS[type as VisitorType] ?? titleCase(type),
                  color: typeColor(type as VisitorType, theme),
                  values,
                }))}
              />
            </Card>
            <Card title="Top pages">
              <BarList
                rows={[...output.pages]
                  .sort((a, b) => b.journeys - a.journeys)
                  .slice(0, 8)
                  .map((page, index) => ({
                    label: page.path,
                    value: page.journeys,
                    display: formatCount(page.journeys),
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
