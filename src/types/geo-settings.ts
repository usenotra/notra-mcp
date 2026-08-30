import type { Organization } from "./api.js";

export interface GeoSettings {
  id: string;
  organizationId: string;
  projectId: string;
  companyName: string;
  aliases: string[];
  competitors: string[];
  languages: string[];
  engines: string[];
  enforceZdr: boolean;
  nonZdrApprovedEngines: string[];
  enabled: boolean;
  scanIntervalHours: number;
  scanStartedAt: string | null;
  lastScanAt: string | null;
  isScanning: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GeoSettingsResponse {
  configured: boolean;
  settings: GeoSettings | null;
  organization: Organization;
}

export interface UpdateGeoSettingsRequest {
  companyName: string;
  aliases: string[];
  languages: string[];
  engines: string[];
  enforceZdr: boolean;
  nonZdrApprovedEngines: string[];
  enabled: boolean;
  scanIntervalHours: number;
}
