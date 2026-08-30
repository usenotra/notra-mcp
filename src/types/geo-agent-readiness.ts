import type { Organization } from "./api.js";
import type { GeoScanStatus } from "./geo-common.js";

export interface GeoAgentReadinessReport {
  id: string;
  status: GeoScanStatus;
  targetUrl: string;
  score: number | null;
  scoreLabel: string | null;
  scoreBreakdown: {
    essential: { earned: number; available: number; passing: number; total: number };
    recommended: { earned: number; available: number; passing: number; total: number };
    bonus: { points: number; positiveSignals: number };
  } | null;
  issues: Array<{
    id: string;
    name: string;
    tier: "essential" | "recommended" | "bonus";
    result: "failed" | "partial";
    details: string | null;
    recommendation: string | null;
  }>;
  eligibleChecks: number | null;
  reportUrl: string | null;
  errorMessage: string | null;
  scannedAt: string | null;
  createdAt: string;
}

export interface GeoAgentReadinessResponse {
  targetUrl: string;
  report: GeoAgentReadinessReport | null;
  scan: GeoAgentReadinessReport | null;
  history: Array<{
    id: string;
    score: number | null;
    failedCount: number;
    partialCount: number;
    scannedAt: string;
  }>;
  organization: Organization;
}

export interface StartGeoAgentReadinessScanResponse {
  reportId: string;
  alreadyRunning: boolean;
  organization: Organization;
}
