import type { GEO_PICK_REASONS } from "../constants/geo-pick-reasons.js";
import type { Organization } from "./api.js";
import type { GeoWindowParams } from "./geo-common.js";

export interface GeoSparklinePoint {
  day: string;
  value: number;
}

export interface GeoVisibilityOverviewResponse {
  configured: boolean;
  engines: Array<{
    engine: string;
    checks: number;
    mentions: number;
    mentionRate: number;
    citations: number;
    visibility: number;
    visibilityRate: number;
    avgPosition: number | null;
    lastCheckedAt: string;
  }>;
  organization: Organization;
}

export interface GeoVisibilityTimeseriesResponse {
  configured: boolean;
  points: Array<{
    day: string;
    engine: string;
    checks: number;
    mentions: number;
    citations: number;
    visibility: number;
    avgPosition?: number | null;
  }>;
  organization: Organization;
}

export interface GeoVisibilityPromptResultsResponse {
  configured: boolean;
  results: Array<{
    promptId: string;
    engine: string;
    prompt: string;
    answer: string;
    mentioned: boolean;
    ownedSourceCited: boolean;
    position: number | null;
    sentiment: string | null;
    competitors: string[];
    excerpt: string;
    searchQueries: string[];
    sources: Array<{ title: string; url: string; domain: string }>;
    lastCheckedAt: string;
  }>;
  organization: Organization;
}

export interface GeoVisibilityCompetitorShareResponse {
  configured: boolean;
  points: Array<{ brand: string; mentions: number; trend?: GeoSparklinePoint[] }>;
  timeseries: Array<{ brand: string; day: string; mentions: number }>;
  organization: Organization;
}

export interface GeoPromptResultSummaryParams {
  days?: number;
  from?: string;
  to?: string;
  cursor?: string;
  limit?: number;
  engine?: string;
  mentioned?: boolean;
  query?: string;
}

export interface GeoPromptResultSummariesResponse {
  configured: boolean;
  results: Array<{
    checkId: string;
    promptId: string;
    engine: string;
    prompt: string;
    mentioned: boolean;
    ownedSourceCited: boolean;
    position: number | null;
    sentiment: string | null;
    competitors: string[];
    lastCheckedAt: string;
    scanId: string;
    answerExcerpt: string;
    sourceDomains: string[];
  }>;
  nextCursor: string | null;
  organization: Organization;
}

export interface GeoPromptResultDetailResponse {
  result: GeoVisibilityPromptResultsResponse["results"][number] & {
    finishReason: string | null;
    promptTokens: number | null;
    outputTokens: number | null;
    reasoningTokens: number | null;
    truncated: boolean | null;
  };
  organization: Organization;
}

export interface GeoVisibilityLanguageShareResponse {
  configured: boolean;
  points: Array<{
    language: string;
    checks: number;
    mentions: number;
    mentionRate: number;
    citations: number;
    visibility: number;
    visibilityRate: number;
    avgPosition: number | null;
    trend?: GeoSparklinePoint[];
  }>;
  organization: Organization;
}

export interface GeoVisibilityCompetitorDetailResponse {
  configured: boolean;
  points: Array<{ day: string; mentions: number; checks: number }>;
  prompts: Array<{
    promptId: string;
    prompt: string;
    engine: string;
    capturedAt: string;
    mentioned: boolean;
    position: number | null;
  }>;
  organization: Organization;
}

export interface GeoCompetitorShareParams {
  days?: number;
  from?: string;
  to?: string;
  brands?: string[];
  limit: number;
  includeTrends: boolean;
}

interface GeoBrandShare {
  mentions: number;
  share: number;
}

export interface GeoCompetitorShareSummary {
  configured: boolean;
  totalBrands: number;
  totalMentions: number;
  points: Array<GeoBrandShare & { brand: string; trend?: GeoSparklinePoint[] }>;
  otherBrands: GeoBrandShare & { count: number };
  timeseries?: GeoVisibilityCompetitorShareResponse["timeseries"];
  organization: Organization;
}

export type GeoPickReason = (typeof GEO_PICK_REASONS)[number];

export interface GeoPickReasonShare {
  reason: GeoPickReason;
  count: number;
  share: number;
}

export interface GeoPickReasonsParams extends GeoWindowParams {
  brand?: string;
  limit?: number;
}

export interface GeoPickReasonsResponse {
  configured: boolean;
  pending: number;
  brands: Array<{
    brand: string;
    own: boolean;
    picks: number;
    reasons: GeoPickReasonShare[];
    engines: Array<{ engine: string; picks: number; reasons: GeoPickReasonShare[] }>;
  }>;
  organization: Organization;
}

export interface GeoPickReasonEvidenceParams extends GeoWindowParams {
  brand: string;
  reason: GeoPickReason;
  engine?: string;
}

export interface GeoPickReasonEvidenceResponse {
  evidence: Array<{
    checkId: string;
    promptId: string;
    prompt: string;
    engine: string;
    capturedAt: string;
    pick: "top_pick" | "recommended";
    quote: string;
  }>;
  organization: Organization;
}
