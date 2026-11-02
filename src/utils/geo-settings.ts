import type { GeoSettings, GeoSettingsPatch, UpdateGeoSettingsRequest } from "../types/geo-settings.js";

/** Fields the API requires on every write; the rest keep their stored value when omitted. */
const REQUIRED_FIELDS = [
  "companyName",
  "aliases",
  "languages",
  "engines",
  "enforceZdr",
  "nonZdrApprovedEngines",
  "enabled",
  "scanIntervalHours",
] as const satisfies readonly (keyof UpdateGeoSettingsRequest)[];

/**
 * The API replaces the whole settings document, so agents had to echo every
 * field from get_geo_settings. This fills the required fields the caller left
 * out from the stored settings, turning the tool into a partial update.
 */
export function mergeGeoSettings(current: GeoSettings | null, patch: GeoSettingsPatch): UpdateGeoSettingsRequest {
  const changed = Object.entries(patch).filter(([, value]) => value !== undefined);
  if (changed.length === 0) {
    throw new Error("Pass at least one setting to change. Call get_geo_settings to see the current values.");
  }

  const merged: Record<string, unknown> = Object.fromEntries(changed);
  const missing: string[] = [];
  for (const field of REQUIRED_FIELDS) {
    if (merged[field] !== undefined) {
      continue;
    }
    if (current) {
      merged[field] = current[field];
    } else {
      missing.push(field);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `This project has no GEO settings yet, so the first update must set every required field. Missing: ${missing.join(", ")}. Use engine IDs from list_geo_engines.`,
    );
  }
  return merged as unknown as UpdateGeoSettingsRequest;
}
