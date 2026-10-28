import type { Organization } from "./api.js";
import type { GeoImportIssue } from "./geo-common.js";
import type { ImportSource } from "./import.js";

export interface GeoPrompt {
  id: string;
  prompt: string;
  enabled: boolean;
  source: "custom" | "auto";
  createdAt: string | null;
}

export interface GeoPromptListResponse {
  configured: boolean;
  prompts: GeoPrompt[];
  organization: Organization;
}

export interface GeoPromptResponse {
  prompt: GeoPrompt;
  organization: Organization;
}

export interface GeoPromptDeleteResponse {
  id: string;
  organization: Organization;
}

export type ImportGeoPromptsRequest = ImportSource<{ prompt: string; enabled?: boolean }>;

export interface ImportGeoPromptsResponse {
  imported: number;
  updated: number;
  skipped: number;
  issues: GeoImportIssue[];
  organization: Organization;
}

export interface GeoPromptSuggestion {
  id: string;
  prompt: string;
  title: string | null;
  source: "search_console";
  keywords: { query: string; clicks: number; impressions: number; position: number }[];
  createdAt: string;
}

export interface GeoPromptSuggestionListResponse {
  suggestions: GeoPromptSuggestion[];
  organization: Organization;
}

export interface DismissGeoPromptSuggestionResponse {
  id: string;
  dismissed: boolean;
  organization: Organization;
}
