import type { GEO_TRAFFIC_CATEGORY_VALUES, GEO_TRAFFIC_VISITOR_TYPE_VALUES } from "../constants/geo.js";
import type { Organization } from "./api.js";
import type { GeoWindowParams } from "./geo-common.js";

export type GeoTrafficVisitorTypeFilter = (typeof GEO_TRAFFIC_VISITOR_TYPE_VALUES)[number];
export type GeoTrafficCategory = (typeof GEO_TRAFFIC_CATEGORY_VALUES)[number];
export type GeoVisitorType = "crawler" | "ai_referral" | "human" | "unknown";

export interface GeoTrafficOverviewResponse {
  configured: boolean;
  totals: { crawler: number; aiReferral: number };
  sources: Array<{
    source: string;
    visitorType: GeoVisitorType;
    agent: string;
    category: string;
    confidence: string;
    visits: number;
    previousVisits?: number;
    markdownVisits: number;
    paths: number;
    lastSeenAt: string;
  }>;
  points: Array<{ day: string; visitorType: GeoVisitorType; source: string; visits: number }>;
  organization: Organization;
}

export interface GeoTrafficLogParams {
  limit?: number;
  visitorTypes?: GeoTrafficVisitorTypeFilter[];
  categories?: GeoTrafficCategory[];
}

export interface GeoTrafficLogResponse {
  configured: boolean;
  log: Array<{
    capturedAt: string;
    visitorType: GeoVisitorType;
    source: string;
    agent: string;
    category: string;
    confidence: string;
    path: string;
    host: string;
    country: string;
    ua: string;
    journeyId: string;
    wantsMarkdown: boolean;
  }>;
  total: number;
  organization: Organization;
}

export interface GeoTrafficJourneysResponse {
  configured: boolean;
  journeys: Array<{
    journeyId: string;
    source: string;
    visitorType: GeoVisitorType;
    pages: number;
    distinctPaths: number;
    firstSeenAt: string;
    lastSeenAt: string;
    samplePaths: string[];
  }>;
  organization: Organization;
}

export interface GeoTrafficJourneyResponse {
  configured: boolean;
  events: Array<{
    capturedAt: string;
    path: string;
    host: string;
    method: string;
    referer: string;
    country: string;
    agent: string;
    category: string;
  }>;
  organization: Organization;
}

export interface GeoTrafficPagesParams extends GeoWindowParams {
  limit?: number;
  visitorType?: GeoTrafficVisitorTypeFilter;
}

export interface GeoTrafficPagesResponse {
  configured: boolean;
  pages: Array<{
    path: string;
    source: string;
    visitorType: GeoVisitorType;
    visits: number;
    previousVisits?: number;
    lastSeenAt: string;
  }>;
  organization: Organization;
}

export interface GeoIngestSetupResponse {
  ingestUrl: string;
  snippet: string;
  snippets: { next: string; nuxt: string; netlify: string };
  organization: Organization;
}

export interface GeoIngestTokenResponse extends GeoIngestSetupResponse {
  token: string;
}
