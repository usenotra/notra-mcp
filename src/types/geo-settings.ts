import type { Organization } from "./api.js";

export interface GeoSettings {
  id: string;
  organizationId: string;
  projectId: string;
  companyName: string;
  aliases: string[];
  conversionPaths: string[];
  domains: string[];
  competitors: string[];
  languages: string[];
  engines: string[];
  enforceZdr: boolean;
  nonZdrApprovedEngines: string[];
  trackWithoutSearch: boolean;
  pausedAutoPromptIds: string[];
  removedAutoPromptIds: string[];
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

export interface GeoEngine {
  id: string;
  label: string;
  provider: string;
  zdr: "all" | "some" | "none";
  default: boolean;
  supportsGroundedChecks: boolean;
}

export interface GeoEngineListResponse {
  engines: GeoEngine[];
  organization: Organization;
}

export interface UpdateGeoSettingsRequest {
  companyName: string;
  aliases: string[];
  domains?: string[];
  conversionPaths?: string[];
  languages: string[];
  engines: string[];
  enforceZdr: boolean;
  nonZdrApprovedEngines: string[];
  trackWithoutSearch?: boolean;
  pausedAutoPromptIds?: string[];
  removedAutoPromptIds?: string[];
  enabled: boolean;
  scanIntervalHours: number;
}

export type GeoSettingsPatch = Partial<UpdateGeoSettingsRequest>;
