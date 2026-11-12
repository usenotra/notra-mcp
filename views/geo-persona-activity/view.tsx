import { TimeChart } from "../shared/charts";
import { sortedDays, formatPercent } from "../shared/format";
import { Card, NotraView } from "../shared/layout";
import { seriesColor } from "../shared/palette";

type Output = {
  from: string;
  to: string;
  points: { personaId: string; snapshotVersion: string; day: string; checks: number; mentions: number }[];
  personas?: { id: string; name: string }[];
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
        const names = new Map((output.personas ?? []).map((persona) => [persona.id, persona.name]));
        const series = personas.map((persona, index) => {
          const values = days.map((day) => {
            const rows = output.points.filter((point) => point.personaId === persona && point.day === day);
            const checks = rows.reduce((sum, row) => sum + row.checks, 0);
            return checks ? rows.reduce((sum, row) => sum + row.mentions, 0) / checks : null;
          });
          return {
            key: persona,
            label: names.get(persona) ?? `Persona ${persona.slice(0, 8)}`,
            color: seriesColor(index, theme),
            values,
          };
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
