import type {
  GeoCompetitorDeleteSummary,
  GeoCompetitorListResponse,
  GeoCompetitorUpsertSummary,
} from "../types/geo-competitor.js";

/**
 * The competitor endpoints answer every write with the full list, which can
 * hold up to 2,000 entries. Agents only need the row they touched.
 */
export function summarizeCompetitorUpsert(
  name: string,
  response: GeoCompetitorListResponse,
): GeoCompetitorUpsertSummary {
  const key = name.trim().toLowerCase();
  return {
    competitor: response.competitors.find((competitor) => competitor.name.trim().toLowerCase() === key) ?? null,
    totalCompetitors: response.competitors.length,
    organization: response.organization,
  };
}

export function summarizeCompetitorDelete(
  name: string,
  response: GeoCompetitorListResponse,
): GeoCompetitorDeleteSummary {
  return { deleted: name, totalCompetitors: response.competitors.length, organization: response.organization };
}
