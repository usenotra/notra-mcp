import type { GEO_BRIEF_SOURCE_KIND_VALUES, GEO_CONTENT_SUBTYPE_VALUES } from "../constants/geo.js";
import type { Organization } from "./api.js";

export type GeoContentSubtype = (typeof GEO_CONTENT_SUBTYPE_VALUES)[number];
export type GeoBriefSourceKind = (typeof GEO_BRIEF_SOURCE_KIND_VALUES)[number];
export type GeoBriefStatus = "draft" | "approved" | "writing" | "completed" | "failed";

export interface GeoBriefRef {
  briefId: string;
  status: GeoBriefStatus;
  postId: string | null;
  workingTitle: string | null;
}

export interface GeoContentGapsResponse {
  promptGaps: Array<{
    id: string;
    prompt: string;
    title: string | null;
    engines: string[];
    competitors: string[];
    ownMentionRate: number;
    engineCoverage: number;
    opportunity: number;
    brief: GeoBriefRef | null;
  }>;
  searchGaps: Array<{
    id: string;
    prompt: string;
    title: string | null;
    impressions: number | null;
    brief: GeoBriefRef | null;
  }>;
  hasScanData: boolean;
  organization: Organization;
}

export interface GeoBriefDocument {
  targetPrompt: string;
  intent: string;
  contentSubtype: GeoContentSubtype;
  workingTitle: string;
  audience: string;
  jobToBeDone: string;
  sections: Array<{ heading: string; goal: string; claims: string[] }>;
  questionsToAnswer: string[];
  internalLinks: Array<{ url: string; anchor: string; why: string }>;
  acceptanceChecklist: string[];
}

export interface GeoContentBriefListResponse {
  briefs: Array<{
    id: string;
    topic: string;
    workingTitle: string;
    status: GeoBriefStatus;
    postId: string | null;
    createdAt: string;
  }>;
  organization: Organization;
}

export interface PlanGeoContentBriefRequest {
  topic: string;
  autoApprove?: boolean;
  contentSubtype?: GeoContentSubtype;
  brandVoiceIds?: string[];
  competitorIds?: string[];
  sitemapId?: string;
  sourceKind?: GeoBriefSourceKind;
  sourceId?: string;
}

export interface PlanGeoContentBriefResponse {
  briefId: string;
  brief: GeoBriefDocument;
  status: GeoBriefStatus;
  runId: string | null;
  postId: string | null;
  organization: Organization;
}

export interface GeoContentBriefResponse {
  brief: {
    id: string;
    topic: string;
    brief: GeoBriefDocument;
    status: GeoBriefStatus;
    autoApproved: boolean;
    runId: string | null;
    postId: string | null;
    humanized: boolean;
    error: string | null;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
  };
  organization: Organization;
}

export interface ApproveGeoContentBriefResponse {
  runId: string;
  organization: Organization;
}
