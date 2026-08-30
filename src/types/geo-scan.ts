import type { Organization, Pagination } from "./api.js";
import type { GeoScanStatus } from "./geo-common.js";

export interface GeoScan {
  id: string;
  projectId: string;
  status: GeoScanStatus;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
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
