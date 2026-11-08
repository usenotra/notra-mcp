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
