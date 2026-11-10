import { TimeChart } from "../shared/charts";
import { sortedDays, formatPercent } from "../shared/format";
import { Card, NotraView } from "../shared/layout";
import { seriesColor } from "../shared/palette";

type Output = {
  from: string;
  to: string;
  points: { personaId: string; snapshotVersion: string; day: string; checks: number; mentions: number }[];
};

export default function GeoPersonaActivity() {
  return (
    <NotraView<Output>
      title="Persona mention rate"
      subtitle={(output) => `${new Set(output.points.map((point) => point.personaId)).size} personas`}
      isEmpty={(output) => output.points.length === 0}
      emptyMessage="No persona runs in this period yet."
    >
      {(output, theme) => {
        const days = sortedDays(output.points.map((point) => point.day));
        const personas = [...new Set(output.points.map((point) => point.personaId))];
        const series = personas.map((persona, index) => {
          const values = days.map((day) => {
            const rows = output.points.filter((point) => point.personaId === persona && point.day === day);
            const checks = rows.reduce((sum, row) => sum + row.checks, 0);
            return checks ? rows.reduce((sum, row) => sum + row.mentions, 0) / checks : 0;
          });
          return { key: persona, label: `Persona ${index + 1}`, color: seriesColor(index, theme), values };
        });
        return (
          <Card title="Mention rate per day">
            <TimeChart days={days} series={series} variant="line" format={(value) => formatPercent(value)} />
          </Card>
        );
      }}
    </NotraView>
  );
}
