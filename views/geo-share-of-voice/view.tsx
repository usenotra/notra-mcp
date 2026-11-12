import { BarList, Donut, TimeChart } from "../shared/charts";
import { pivot } from "../shared/data";
import { formatCount, formatPercent } from "../shared/format";
import { Card, NotraView } from "../shared/layout";
import { MUTED, pick, seriesColor } from "../shared/palette";

type Output = {
  configured: boolean;
  totalBrands: number;
  totalMentions: number;
  points: { brand: string; mentions: number; share: number; trend?: { day: string; value: number }[] }[];
  otherBrands: { mentions: number; share: number; count: number };
};

export default function GeoShareOfVoice() {
  return (
    <NotraView<Output>
      title="Share of voice"
      subtitle={(output) => `${formatCount(output.totalMentions)} brand mentions across ${output.totalBrands} brands`}
      isEmpty={(output) => !output.configured || output.totalMentions === 0}
      emptyMessage="No brand mentions yet. Add competitors and run a GEO scan."
    >
      {(output, theme) => {
        const brands = [...output.points].sort((a, b) => b.mentions - a.mentions);
        const color = (index: number) => seriesColor(index, theme);
        const slices = [
          ...brands.map((brand, index) => ({ label: brand.brand, value: brand.mentions, color: color(index) })),
          ...(output.otherBrands.count > 0
            ? [
                {
                  label: `Other brands (${output.otherBrands.count})`,
                  value: output.otherBrands.mentions,
                  color: pick(MUTED, theme),
                },
              ]
            : []),
        ];
        const leader = brands[0];
        const rows = brands.flatMap((brand) => (brand.trend ?? []).map((point) => ({ ...point, brand: brand.brand })));
        const trend = rows.length
          ? pivot(
              rows,
              (row) => row.day,
              (row) => row.brand,
              (row) => row.value,
            )
          : undefined;
        return (
          <>
            <Card>
              <div className="nv-split">
                <Donut slices={slices} center={formatPercent(leader?.share ?? 0)} caption={leader?.brand} />
                <BarList
                  rows={slices.map((slice) => ({
                    label: slice.label,
                    value: slice.value,
                    display: `${formatPercent(slice.value / Math.max(output.totalMentions, 1))} · ${formatCount(slice.value)}`,
                    color: slice.color,
                  }))}
                />
              </div>
            </Card>
            {trend ? (
              <Card title="Mentions per day">
                <TimeChart
                  days={trend.days}
                  variant="line"
                  series={brands
                    .map((brand, index) => ({
                      key: brand.brand,
                      label: brand.brand,
                      color: color(index),
                      values: trend.groups.get(brand.brand) ?? [],
                    }))
                    .filter((series) => trend.groups.has(series.key))}
                />
              </Card>
            ) : null}
          </>
        );
      }}
    </NotraView>
  );
}
