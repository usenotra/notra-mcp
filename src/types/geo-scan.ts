import type { Organization, Pagination } from "./api.js";
import type { GeoScanStatus } from "./geo-common.js";

export interface GeoScan {
  id: string;
  projectId: string;
  status: GeoScanStatus;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
  summary: GeoScanSummary;
  errorCode: string | null;
  errorMessage: string | null;
  failedStage: "handoff" | "execution" | "stale" | null;
  retryable: boolean | null;
}

interface GeoScanSummary {
  plannedChecks: number | null;
  completedChecks: number;
  mentionCount: number;
  failedChecks: number;
  engines: GeoScanEngineSummary[];
}

interface GeoScanEngineSummary {
  engine: string;
  plannedChecks: number | null;
  completedChecks: number;
  mentionCount: number;
  failedChecks: number;
}

export interface CreateGeoScanResponse {
  scanId: string;
  statusUrl: string;
  organization: Organization;
}

export interface ListGeoScansParams {
  limit?: number;
  page?: number;
}

export interface GeoScanListResponse {
  scans: GeoScan[];
  pagination: Pagination;
  organization: Organization;
}

export interface GeoScanResponse {
  scan: GeoScan;
  organization: Organization;
}
