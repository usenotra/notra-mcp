import type { Organization } from "./api.js";

export interface GeoSequence {
  id: string;
  name: string;
  steps: string[];
  enabled: boolean;
  createdAt: string;
}

export interface GeoSequenceListResponse {
  sequences: GeoSequence[];
  organization: Organization;
}

export interface GeoSequenceResponse {
  sequence: GeoSequence;
  organization: Organization;
}

export interface GeoSequenceDeleteResponse {
  id: string;
  organization: Organization;
}

export interface CreateGeoSequenceRequest {
  name: string;
  steps: string[];
}

export interface UpdateGeoSequenceRequest {
  name?: string;
  steps?: string[];
  enabled?: boolean;
}

export interface RunGeoSequenceResponse {
  checks: number;
  mentions: number;
  engines: string[];
  organization: Organization;
}
