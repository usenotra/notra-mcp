export interface Organization {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
}

export interface SourceMetadata {
  triggerId: string;
  lookbackWindow: string;
  triggerSourceType: string;
  repositories: Array<{ owner: string; repo: string }>;
  lookbackRange: { start: string; end: string };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  markdown: string;
  recommendations: string[];
  contentType: "changelog" | "linkedin_post" | "twitter_post" | "blog_post";
  sourceMetadata: SourceMetadata | null;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  limit: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  totalPages: number;
  totalItems: number;
}

export interface PostListResponse {
  organization: Organization;
  posts: Post[];
  pagination: Pagination;
}

export interface PostResponse {
  organization: Organization;
  post: Post | null;
}

export interface PostDeleteResponse {
  id: string;
  organization: Organization;
}

export const POST_STATUS_VALUES = ["draft", "published"] as const;
export const CONTENT_TYPE_VALUES = ["changelog", "linkedin_post", "twitter_post", "blog_post"] as const;

export type PostStatus = (typeof POST_STATUS_VALUES)[number];
export type ContentType = (typeof CONTENT_TYPE_VALUES)[number];
export type LookbackWindow = "current_day" | "yesterday" | "last_7_days" | "last_14_days" | "last_30_days";
export type ToneProfile = "Conversational" | "Professional" | "Casual" | "Formal";

export type Language =
  | "English" | "Spanish" | "French" | "German" | "Portuguese" | "Dutch"
  | "Italian" | "Japanese" | "Korean" | "Chinese" | "Arabic" | "Hindi"
  | "Russian" | "Turkish" | "Polish" | "Swedish" | "Danish" | "Norwegian"
  | "Finnish" | "Czech" | "Romanian" | "Hungarian" | "Greek" | "Thai"
  | "Vietnamese" | "Indonesian" | "Ukrainian" | "Hebrew";

export interface GeneratePostRequest {
  contentType: ContentType;
  lookbackWindow?: LookbackWindow;
  brandVoiceId?: string;
  brandIdentityId?: string | null;
  repositoryIds?: string[];
  github?: {
    repositories: Array<{ owner: string; repo: string }>;
  };
  dataPoints?: {
    includePullRequests?: boolean;
    includeCommits?: boolean;
    includeReleases?: boolean;
    includeLinearIssues?: boolean;
  };
  selectedItems?: {
    commitShas?: string[];
    pullRequestNumbers?: Array<{ repositoryId: string; number: number }>;
    releaseTagNames?: Array<string | { repositoryId: string; tagName: string }>;
  };
}

export type JobStatus = "queued" | "running" | "completed" | "failed";

export interface PostGenerationJob {
  id: string;
  organizationId: string;
  status: JobStatus;
  contentType: ContentType;
  lookbackWindow: LookbackWindow;
  repositoryIds: string[];
  brandVoiceId: string | null;
  workflowRunId: string | null;
  postId: string | null;
  error: string | null;
  source: "api" | "dashboard";
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export type PostGenerationEventType =
  | "queued" | "workflow_triggered" | "running" | "fetching_repositories"
  | "generating_content" | "post_created" | "completed" | "failed";

export interface PostGenerationEvent {
  id: string;
  jobId: string;
  type: PostGenerationEventType;
  message: string;
  createdAt: string;
  metadata: Record<string, string> | null;
}

export interface GeneratePostResponse {
  organization: Organization;
  job: PostGenerationJob;
}

export interface PostGenerationStatusResponse {
  job: PostGenerationJob;
  events: PostGenerationEvent[];
}

export interface BrandIdentity {
  id: string;
  name: string;
  isDefault: boolean;
  websiteUrl: string;
  companyName: string | null;
  companyDescription: string | null;
  toneProfile: ToneProfile | null;
  customTone: string | null;
  customInstructions: string | null;
  audience: string | null;
  language: Language | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrandIdentityListResponse {
  organization: Organization;
  brandIdentities: BrandIdentity[];
}

export interface BrandIdentityResponse {
  organization: Organization;
  brandIdentity: BrandIdentity | null;
}

export interface BrandIdentityDeleteResponse {
  id: string;
  organization: Organization;
  disabledSchedules: Array<{ id: string; name: string }>;
  disabledEvents: Array<{ id: string; name: string }>;
}

export interface UpdateBrandIdentityRequest {
  name?: string;
  websiteUrl?: string;
  companyName?: string | null;
  companyDescription?: string | null;
  toneProfile?: ToneProfile | null;
  customTone?: string | null;
  customInstructions?: string | null;
  audience?: string | null;
  language?: Language | null;
  isDefault?: true;
}

export interface GenerateBrandIdentityRequest {
  websiteUrl: string;
  name?: string;
}

export type BrandIdentityGenerationStep = "scraping" | "extracting" | "saving";

export interface BrandIdentityGenerationJob {
  id: string;
  organizationId: string;
  brandIdentityId: string | null;
  status: JobStatus;
  step: BrandIdentityGenerationStep | null;
  currentStep: number;
  totalSteps: number;
  workflowRunId: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface GenerateBrandIdentityResponse {
  organization: Organization;
  job: BrandIdentityGenerationJob;
}

export interface BrandIdentityGenerationStatusResponse {
  organization: Organization;
  job: BrandIdentityGenerationJob;
}

export interface GithubIntegration {
  id: string;
  displayName: string;
  owner: string;
  repo: string;
  defaultBranch: string;
}

export interface IntegrationsListResponse {
  github: GithubIntegration[];
  slack: Array<Record<string, string>>;
  linear: Array<Record<string, string>>;
  organization: Organization;
}

export interface CreateGithubIntegrationRequest {
  owner: string;
  repo: string;
  branch?: string | null;
  token?: string | null;
}

export interface CreateGithubIntegrationResponse {
  github: GithubIntegration;
  organization: Organization;
}

export interface UpdatePostRequest {
  title?: string;
  markdown?: string;
  status?: PostStatus;
}

export interface ListPostsParams {
  sort?: "asc" | "desc";
  limit?: number;
  page?: number;
  status?: PostStatus[];
  contentType?: ContentType[];
  brandIdentityId?: string[];
}

export interface ApiErrorResponse {
  code?: string;
  message?: string;
  error?: string;
}
