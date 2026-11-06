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

export interface PostAgentReachResponse {
  agentReach: {
    postId: string;
    siteId: string;
    path: string;
    url: string;
    configured: boolean;
    totals: { crawled: number; cited: number; referred: number; total: number };
    sources: GeoTrafficOverviewResponse["sources"];
    points: GeoTrafficOverviewResponse["points"];
  } | null;
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

export type GeoMcpEventStatus = "ok" | "tool_error" | "rpc_error";

export interface GeoMcpIntent {
  intent: string;
  tool: string;
  calls: number;
  errors: number;
}

export interface GeoMcpAnalyticsResponse {
  configured: boolean;
  server: { name: string; version: string; protocolVersion: string } | null;
  totals: {
    requests: number;
    previousRequests: number;
    toolCalls: number;
    previousToolCalls: number;
    errors: number;
    previousErrors: number;
    sessions: number;
    previousSessions: number;
    users: number;
    previousUsers: number;
    p95Ms: number;
    previousP95Ms: number;
  };
  daily: Array<{
    day: string;
    toolsCall: number;
    resourcesRead: number;
    promptsGet: number;
    other: number;
    errors: number;
  }>;
  tools: Array<{
    name: string;
    description: string;
    calls: number;
    errors: number;
    users: number;
    avgResponseBytes: number;
    p50Ms: number;
    p95Ms: number;
    uiResource: string;
  }>;
  clients: Array<{ name: string; sessions: number; requests: number; errors: number; lastSeenAt: string }>;
  errorRequests: Array<{
    capturedAt: string;
    clientName: string;
    clientVersion: string;
    method: string;
    target: string;
    status: GeoMcpEventStatus;
    errorCode: number;
    errorMessage: string;
    durationMs: number;
    model: string;
  }>;
  models: Array<{ name: string; sessions: number; calls: number; errors: number }>;
  intents: GeoMcpIntent[];
  elicitations: Array<{
    method: string;
    tool: string;
    requests: number;
    accepted: number;
    declined: number;
    cancelled: number;
    errors: number;
  }>;
  uiRenders: Array<{ resource: string; tools: string[]; renders: number; sessions: number; errors: number }>;
  catalog: { listedAt: string; unusedTools: Array<{ name: string; description: string }> } | null;
  organization: Organization;
}

export interface GeoMcpToolNeighbor {
  tool: string;
  calls: number;
  afterFailure: number;
}

export interface GeoMcpToolDetailResponse {
  before: GeoMcpToolNeighbor[];
  after: GeoMcpToolNeighbor[];
  failures: Array<{
    message: string;
    clientName: string;
    status: GeoMcpEventStatus;
    errorCode: number;
    calls: number;
    lastSeenAt: string;
  }>;
  intents: GeoMcpIntent[];
  organization: Organization;
}

interface GeoWebScript {
  url: string;
  pinnedUrl: string;
  integrity: string;
}

export interface GeoIngestSetupResponse {
  ingestUrl: string;
  snippet: string;
  snippets: {
    next: string;
    nuxt: string;
    netlify: string;
    tanstack: string;
    astro: string;
    sveltekit: string;
    reactRouter: string;
  };
  drainUrls: { vercel: string; cloudflare: string };
  /** notra.js fields, missing when web analytics is not enabled for the workspace. */
  webKey?: string;
  webSnippet?: string;
  webScript?: GeoWebScript;
  webPlusScript?: GeoWebScript;
  organization: Organization;
}
