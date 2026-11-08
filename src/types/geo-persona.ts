import type { Organization } from "./api.js";

export interface GeoPersonaProfile {
  goals: string[];
  painPoints: string[];
  currentStack: string[];
  buyingTriggers: string[];
  objections: string[];
}

export interface GeoPersonaMemory {
  id: string;
  kind: string;
  content: string;
}

export interface GeoPersona {
  id: string;
  name: string;
  role: string;
  company: string;
  summary: string;
  searchStyle: string;
  profile: GeoPersonaProfile;
  conversationPrompts: string[];
  enabled: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  memories: GeoPersonaMemory[];
}

export interface GeoPersonaListResponse {
  configured: boolean;
  personas: GeoPersona[];
  organization: Organization;
}

export interface GeoPersonaResponse {
  persona: GeoPersona;
  organization: Organization;
}

export interface GeoPersonaArchiveResponse {
  id: string;
  organization: Organization;
}

export interface UpdateGeoPersonaRequest {
  enabled?: boolean;
  name?: string;
  role?: string;
  company?: string;
  summary?: string;
  searchStyle?: string;
  profile?: Partial<GeoPersonaProfile>;
}

export interface GeoPersonaResultSource {
  title: string;
  url: string;
  domain: string;
}

export interface GeoPersonaResult {
  scanId: string;
  turn: number;
  engine: string;
  prompt: string;
  answer: string;
  mentioned: boolean;
  position: number | null;
  sentiment: string | null;
  excerpt: string;
  searchQueries: string[];
  sources: GeoPersonaResultSource[];
  snapshotVersion: string | null;
  lastCheckedAt: string;
}

export interface GeoPersonaResultsResponse {
  results: GeoPersonaResult[];
  scans: { id: string; capturedAt: string }[];
  selectedScanId: string | null;
  organization: Organization;
}

export interface GeoPersonaActivityPoint {
  personaId: string;
  snapshotVersion: string;
  day: string;
  lastCheckedAt: string;
  checks: number;
  mentions: number;
}

export interface GeoPersonaActivityResponse {
  from: string;
  to: string;
  points: GeoPersonaActivityPoint[];
  organization: Organization;
}

export interface RunGeoPersonaResponse {
  checks: number;
  mentions: number;
  engines: string[];
  queuedScanId?: string | null;
  queuedEngines?: string[];
  organization: Organization;
}

export interface GenerateGeoPersonasRequest {
  personaId?: string;
  brief?: string;
  promptsOnly?: true;
}

export type GeoPersonaGenerationStatus = "queued" | "running" | "completed" | "failed";

export interface GeoPersonaGenerationJob {
  id: string;
  status: GeoPersonaGenerationStatus;
  personaId: string | null;
  startedAt: string;
  error: string | null;
}

export interface GeoPersonaGenerationResponse {
  job: GeoPersonaGenerationJob | null;
  organization: Organization;
}
