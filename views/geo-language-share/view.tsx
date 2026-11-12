import { BarList } from "../shared/charts";
import { formatCount, formatPercent } from "../shared/format";
import { Card, NotraView } from "../shared/layout";
import { seriesColor } from "../shared/palette";

type Output = {
  configured: boolean;
  points: { language: string; checks: number; mentions: number; mentionRate: number; citations: number }[];
};

export default function GeoLanguageShare() {
  return (
    <NotraView<Output>
      title="Visibility by language"
      isEmpty={(output) => !output.configured || output.points.length === 0}
      emptyMessage="No checks in other languages yet."
    >
      {(output, theme) => (
        <Card title="Mention rate per prompt language">
          <BarList
            rows={[...output.points]
              .sort((a, b) => b.mentionRate - a.mentionRate)
              .map((point, index) => ({
                label: point.language,
                value: point.mentionRate,
                max: 1,
                display: `${formatPercent(point.mentionRate)} · ${formatCount(point.mentions)}/${formatCount(point.checks)}`,
                color: seriesColor(index, theme),
              }))}
          />
        </Card>
      )}
    </NotraView>
  );
}
