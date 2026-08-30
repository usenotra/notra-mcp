import type { Organization } from "./api.js";

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
    position: number | null;
    sentiment: string | null;
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

export interface GeoVisibilityLanguageShareResponse {
  configured: boolean;
  points: Array<{
    language: string;
    checks: number;
    mentions: number;
    mentionRate: number;
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
