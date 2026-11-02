import type { Organization } from "./api.js";
import type { GeoAgentReadinessReport } from "./geo-agent-readiness.js";
import type { GeoContentGapsResponse } from "./geo-brief.js";
import type { GeoWindowParams } from "./geo-common.js";
import type { GeoShelfListResponse } from "./geo-shelf.js";
import type { GeoTrafficOverviewResponse } from "./geo-traffic.js";
import type { GeoVisibilityCompetitorShareResponse, GeoVisibilityOverviewResponse } from "./geo-visibility.js";

export interface GeoSentimentBucket {
  totalChecks: number;
  mentions: number;
  positive: number;
  neutral: number;
  negative: number;
  lastCheckedAt: string | null;
  score: number | null;
  classifiedMentions: number;
  unknownMentions: number;
  notMentioned: number;
  positiveShare: number | null;
  neutralShare: number | null;
  negativeShare: number | null;
  classificationCoverage: number | null;
}

export interface GeoSentimentResponse {
  configured: true;
  summary: GeoSentimentBucket;
  engines: Array<GeoSentimentBucket & { engine: string }>;
  points: Array<GeoSentimentBucket & { day: string }>;
  comparison?: {
    current: { from: string; to: string };
    previous: { from: string; to: string };
    summary: GeoSentimentBucket;
    points: Array<GeoSentimentBucket & { day: string }>;
    delta: number | null;
  };
  organization: Organization;
}

export interface GeoSentimentEvidenceResponse {
  items: Array<{
    id: string;
    scanId: string;
    promptId: string;
    prompt: string;
    engine: string;
    language: string;
    capturedAt: string;
    answer: string;
    excerpt: string;
  }>;
  nextCursor: string | null;
  organization: Organization;
}

export interface GeoSentimentAnalysisResponse {
  status: "ready" | "pending" | "stale" | "failed" | "unavailable";
  result: {
    fingerprint: string;
    generatedAt: string;
    sampled: number;
    eligible: number;
    themes: Array<{
      title: string;
      polarity: "positive" | "negative";
      claims: Array<{
        statement: string;
        evidence: Array<{
          checkId: string;
          quote: string;
          prompt: string;
          engine: string;
          capturedAt: string;
        }>;
      }>;
      evidence: Array<{
        checkId: string;
        quote: string;
        prompt: string;
        engine: string;
        capturedAt: string;
      }>;
    }>;
  } | null;
  message: string | null;
  organization: Organization;
}

export interface GeoChangesResponse {
  previousScan: { id: string; finishedAt: string | null } | null;
  currentScan: { id: string; finishedAt: string | null } | null;
  summary: {
    gained: number;
    lost: number;
    positionImproved: number;
    positionDropped: number;
    citationsAdded: number;
    citationsRemoved: number;
  };
  events: Array<{
    kind:
      | "gained_mention"
      | "lost_mention"
      | "position_improved"
      | "position_dropped"
      | "competitor_displaced"
      | "citation_added"
      | "citation_removed"
      | "new_engine";
    promptId: string;
    prompt: string;
    engine: string;
    previous: { mentioned: boolean; position: number | null } | null;
    current: { mentioned: boolean; position: number | null };
    competitors: string[];
    domains: string[];
  }>;
  organization: Organization;
}

export interface GeoPromptHistoryResponse {
  configured: boolean;
  promptId: string;
  checks: Array<{
    id: string;
    scanId: string;
    engine: string;
    mentioned: boolean;
    ownedSourceCited?: boolean;
    position: number | null;
    sentiment: string | null;
    competitors: string[];
    language: string;
    capturedAt: string;
  }>;
  organization: Organization;
}

export interface GeoSnapshotResponse {
  generatedAt: string;
  window: GeoWindowParams;
  visibility: {
    configured: boolean;
    checks: number;
    mentions: number;
    mentionRate: number;
    citations: number;
    visibility: number;
    visibilityRate: number;
    avgPosition: number | null;
    engines: GeoVisibilityOverviewResponse["engines"];
  };
  sentiment: GeoSentimentResponse["summary"] | null;
  changes: GeoChangesResponse["summary"] | null;
  competitors: { tracked: number; leaders: GeoVisibilityCompetitorShareResponse["points"] } | null;
  contentGaps: {
    hasScanData: boolean;
    promptGapCount: number;
    searchGapCount: number;
    topPromptGaps: GeoContentGapsResponse["promptGaps"];
    topSearchGaps: GeoContentGapsResponse["searchGaps"];
  } | null;
  shelf: { returnedSources: number; hasMore: boolean; topSources: GeoShelfListResponse["sources"] } | null;
  agentReadiness: {
    targetUrl: string;
    status: GeoAgentReadinessReport["status"] | "not_scanned";
    score: number | null;
    scoreLabel: string | null;
    topIssues: GeoAgentReadinessReport["issues"];
  } | null;
  traffic: {
    configured: boolean;
    totals: GeoTrafficOverviewResponse["totals"];
    topSources: GeoTrafficOverviewResponse["sources"];
  } | null;
  recommendedNextActions: GeoNextAction[];
  warnings: Array<{ section: string; message: string }>;
  organization: Organization;
}

export interface GeoNextAction {
  priority: "high" | "medium" | "low";
  action: string;
  reason: string;
  /** The MCP tool that performs this action, or null when it needs the dashboard. */
  tool: string | null;
  arguments: Record<string, unknown> | null;
  /** True when calling the tool books AI credits; confirm with the user first. */
  usesCredits: boolean;
}
