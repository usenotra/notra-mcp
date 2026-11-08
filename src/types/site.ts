import type { Organization } from "./api.js";
import type { SITE_AUTHOR_LINK_FIELDS, SITE_AUTHOR_PAGE_LAYOUT_VALUES } from "../constants/site.js";

type SiteAuthorLinkField = (typeof SITE_AUTHOR_LINK_FIELDS)[number];
type SiteAuthorPageLayout = (typeof SITE_AUTHOR_PAGE_LAYOUT_VALUES)[number];

export interface SiteSummary {
  id: string;
  name: string;
  url: string;
  status: string;
  live: boolean;
  blogMount: string | null;
}

export interface SiteListResponse {
  sites: SiteSummary[];
}

export type SiteAuthor = {
  id: string;
  ref: string;
  name: string;
  title: string | null;
  bio: string | null;
  avatar: string | null;
  avatarUrl: string | null;
  live: boolean;
  posts: number;
} & Record<SiteAuthorLinkField, string | null>;

export interface SiteAuthorsResponse {
  site: { id: string; name: string };
  authors: SiteAuthor[];
  authorPage: SiteAuthorPageLayout;
  hasUnpublishedChanges: boolean;
}

export type UpsertSiteAuthorRequest = {
  name: string;
  title?: string | null;
  bio?: string | null;
  avatar?: string | null;
  previousId?: string;
  force?: boolean;
} & Partial<Record<SiteAuthorLinkField, string | null>>;

export interface ImportSiteAuthorsRequest {
  authorIds?: string[];
  replace?: boolean;
}

export interface ImportSiteAuthorsResponse extends SiteAuthorsResponse {
  imported: string[];
  avatarsSkipped: string[];
}

export interface SetSiteAuthorPageRequest {
  layout: SiteAuthorPageLayout;
}

export interface PublishSiteDesignRequest {
  message?: string;
}

export interface PublishSiteDesignResponse {
  published: boolean;
  commitSha: string | null;
  deploymentQueued: boolean;
}

export interface SiteDetail {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  status: "active" | "suspended";
  suspendedReason: string | null;
  repository: { id: string | null; owner: string; name: string } | null;
  productionBranch: string;
  rootDirectory: string;
  liveUrl: string;
  publicOrigin: string;
  aliasOrigin: string;
  mounts: { blog?: string; changelog?: string };
  previewsEnabled: boolean;
  previewVisibility: "public" | "protected";
  smartDeployments: boolean;
  analyticsEnabled: boolean;
  liveDeploymentId: string | null;
  rollbackActive: boolean;
  liveSince: string | null;
  createdAt: string;
}

export interface SiteDeployment {
  id: string;
  kind: "production" | "preview";
  previewKey: string | null;
  trigger: string;
  status: string;
  live: boolean;
  liveSince: string | null;
  branch: string;
  commitSha: string;
  commitMessage: string | null;
  commitAuthor: string | null;
  pullRequestNumber: number | null;
  url: string;
  fileCount: number | null;
  totalBytes: number | null;
  buildDurationMs: number | null;
  errorMessage: string | null;
  skipReason: string | null;
  diagnostics: Array<{
    severity: "error" | "warning";
    file: string | null;
    line?: number;
    column?: number;
    code: string;
    message: string;
  }>;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}

export interface SitePostPreview {
  status: string;
  live: boolean;
  deleting: boolean;
  errorMessage: string | null;
  expiresAt: string;
  hasPassword: boolean;
  url: string;
}

export interface GetSiteResponse {
  organization: Organization;
  site: SiteDetail;
  domains: Array<{
    id: string;
    hostname: string;
    kind: "subdomain" | "proxy";
    status: string;
    isPrimary: boolean;
    records: Array<{ type: string; name: string; value: string; purpose: string }>;
    lastError: string | null;
    verifiedAt: string | null;
  }>;
  previews: Array<{
    previewKey: string;
    deploymentId: string;
    visibility: "public" | "protected";
    url: string;
    branch: string | null;
    pullRequestNumber: number | null;
    commitSha: string | null;
    activatedAt: string;
  }>;
}

export interface ListSiteDeploymentsResponse {
  organization: Organization;
  deployments: SiteDeployment[];
}

export interface GetSiteDeploymentResponse {
  organization: Organization;
  deployment: SiteDeployment;
  log: string | null;
  logTruncated: boolean;
}

export interface StartSiteDeploymentResponse {
  organization: Organization;
  deployment: SiteDeployment;
}

export interface SitePostPreviewResponse {
  organization: Organization;
  preview: SitePostPreview | null;
}

export interface CreateSitePostPreviewRequest {
  postId: string;
  lifetime?: "1h" | "1d" | "3d" | "7d";
}

export interface PublishSitePostResponse {
  organization: Organization;
  operation: "created" | "updated";
  branchName: string;
  path: string;
  pullRequestNumber: number;
  pullRequestUrl: string;
}
