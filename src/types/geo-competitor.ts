import type { GEO_COMPETITOR_KIND_VALUES } from "../constants/geo.js";
import type { Organization } from "./api.js";
import type { GeoImportIssue } from "./geo-common.js";
import type { ImportSource } from "./import.js";

export type GeoCompetitorKind = (typeof GEO_COMPETITOR_KIND_VALUES)[number];

export interface GeoCompetitor {
  id: string;
  name: string;
  domain: string | null;
  synonyms: string[];
  kind: GeoCompetitorKind;
  color: string | null;
}

export interface GeoCompetitorListResponse {
  competitors: GeoCompetitor[];
  organization: Organization;
}

export interface UpsertGeoCompetitorRequest {
  name: string;
  previousName?: string;
  domain: string | null;
  synonyms?: string[];
  kind?: GeoCompetitorKind;
  color?: string | null;
}

export interface SuggestGeoCompetitorsResponse {
  domain: string;
  field: string | null;
  competitors: Array<{
    name: string;
    domain: string | null;
    description: string | null;
    confidence: "high" | "medium" | null;
  }>;
  organization: Organization;
}

export type ImportGeoCompetitorsRequest = ImportSource<{
  name: string;
  domain?: string | null;
  kind?: GeoCompetitorKind;
  synonyms?: string[];
}>;

export interface ImportGeoCompetitorsResponse {
  imported: number;
  updated: number;
  skipped: number;
  issues: GeoImportIssue[];
  competitors: GeoCompetitor[];
  organization: Organization;
}
