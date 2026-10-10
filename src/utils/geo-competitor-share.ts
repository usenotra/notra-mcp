import type {
  GeoCompetitorShareParams,
  GeoCompetitorShareSummary,
  GeoVisibilityCompetitorShareResponse,
} from "../types/geo-visibility.js";

function shareOf(mentions: number, total: number): number {
  return total === 0 ? 0 : Math.round((mentions / total) * 10_000) / 10_000;
}

export function summarizeCompetitorShare(
  response: GeoVisibilityCompetitorShareResponse,
  { brands, limit, includeTrends }: Pick<GeoCompetitorShareParams, "brands" | "limit" | "includeTrends">,
): GeoCompetitorShareSummary {
  const totalMentions = response.points.reduce((sum, point) => sum + point.mentions, 0);
  const wanted = brands && new Set(brands.map((brand) => brand.toLowerCase()));
  const ranked = response.points
    .filter((point) => !wanted || wanted.has(point.brand.toLowerCase()))
    .sort((left, right) => right.mentions - left.mentions)
    .slice(0, limit);
  const returned = new Set(ranked.map((point) => point.brand));
  const returnedMentions = ranked.reduce((sum, point) => sum + point.mentions, 0);
  const otherMentions = totalMentions - returnedMentions;

  return {
    configured: response.configured,
    totalBrands: response.points.length,
    totalMentions,
    points: ranked.map(({ brand, mentions, trend }) => ({
      brand,
      mentions,
      share: shareOf(mentions, totalMentions),
      ...(includeTrends && trend ? { trend } : {}),
    })),
    otherBrands: {
      count: response.points.length - ranked.length,
      mentions: otherMentions,
      share: shareOf(otherMentions, totalMentions),
    },
    ...(includeTrends ? { timeseries: response.timeseries.filter((point) => returned.has(point.brand)) } : {}),
    organization: response.organization,
  };
}
