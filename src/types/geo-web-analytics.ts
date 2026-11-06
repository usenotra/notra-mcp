import type { GEO_TRAFFIC_SITES_VALUES } from "../constants/geo.js";
import type { Organization } from "./api.js";
import type { GeoWindowParams } from "./geo-common.js";
import type { GeoVisitorType } from "./geo-traffic.js";

export interface GeoTrafficFilterParams extends GeoWindowParams {
  host?: string;
  path?: string;
  sites?: (typeof GEO_TRAFFIC_SITES_VALUES)[number];
}

interface GeoImportCoverage {
  provider: string;
  until: string;
  nativeStart: string | null;
}

interface GeoWebBreakdown {
  value: string;
  visitors: number;
  previousVisitors?: number | null;
}

export interface GeoWebAnalyticsResponse {
  configured: boolean;
  imported?: GeoImportCoverage | null;
  hosts: Array<{ host: string; siteId: string; views: number }>;
  totals: {
    views: number;
    previousViews: number;
    visitors: number;
    previousVisitors: number;
    sessions: number;
    previousSessions: number;
    engagedSessions: number;
    aiVisitors: number;
    previousAiVisitors: number;
  };
  points: Array<{ day: string; views: number; visitors: number }>;
  organization: Organization;
}

export interface GeoWebAnalyticsBreakdownsResponse {
  configured: boolean;
  imported?: GeoImportCoverage | null;
  pages: Array<{
    host: string;
    path: string;
    views: number;
    previousViews: number;
    visitors: number;
    landings: number;
    aiVisitors: number;
  }>;
  sources: Array<{
    group: string;
    source: string;
    aiProduct: string;
    sessions: number;
    previousSessions: number;
    visitors: number;
  }>;
  countries: GeoWebBreakdown[];
  devices: GeoWebBreakdown[];
  outcomes: Array<{ source: string; sessions: number; pagesPerSession: number; engagedRate: number }>;
  outboundLinks: Array<{ url: string; clicks: number; previousClicks: number; visitors: number }>;
  vitals: Array<{ metric: "lcp" | "inp" | "cls" | "fcp" | "ttfb"; p75: number; samples: number }>;
  errors: Array<{ message: string; source: string; events: number; views: number }>;
  languages: GeoWebBreakdown[];
  organization: Organization;
}

interface GeoJourneyDailyPoint {
  day: string;
  journeys: number;
}

export interface GeoTrafficJourneyStatsResponse {
  configured: boolean;
  sources: Array<{
    source: string;
    visitorType: GeoVisitorType;
    journeys: number;
    previousJourneys: number;
    pages: number;
    singleFetch: number;
    deepCrawls: number;
    lastSeenAt: string | null;
    daily: GeoJourneyDailyPoint[];
  }>;
  pages: Array<{
    path: string;
    journeys: number;
    previousJourneys: number;
    entries: number;
    lastSeenAt: string | null;
    daily: GeoJourneyDailyPoint[];
  }>;
  totalPages: number;
  previousTotalPages: number;
  organization: Organization;
}

export interface GeoAnalyticsImportsResponse {
  imports: Array<{
    id: string;
    projectId: string;
    provider: string;
    kind: "web" | "geo";
    sourceLabel: string;
    host: string;
    status: string;
    startDay: string | null;
    endDay: string | null;
    cutoffDay: string | null;
    chunksTotal: number;
    chunksDone: number;
    pageviewsImported: number;
    rowsWritten: number;
    capabilities: Record<string, boolean>;
    lastError: string | null;
    retryAt: string | null;
    createdAt: string;
    completedAt: string | null;
  }>;
  organization: Organization;
}
