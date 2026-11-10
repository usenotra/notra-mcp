import { GEO_LONG_RUNNING_TIMEOUT_MS } from "./constants/geo.js";
import { ORGANIZATION_ID_HEADER } from "./constants/organization.js";
import { SITE_PUBLISH_TIMEOUT_MS } from "./constants/site.js";
import type {
  BrandColorDeleteResponse,
  BrandColorListResponse,
  BrandColorResponse,
  BrandIdentityDeleteResponse,
  BrandIdentityGenerationStatusResponse,
  BrandIdentityListResponse,
  BrandIdentityResponse,
  CreateBrandColorRequest,
  CreatePostRequest,
  CreateGithubIntegrationRequest,
  CreateGithubIntegrationResponse,
  CreateSkillRequest,
  DeleteSkillResponse,
  GenerateBrandIdentityRequest,
  GenerateBrandIdentityResponse,
  GeneratePostRequest,
  GeneratePostResponse,
  IntegrationsListResponse,
  IntegrationDeleteResponse,
  GithubActivityResponse,
  ListGithubActivityParams,
  ListPostsParams,
  ListScheduleRunsParams,
  ListSchedulesParams,
  PostDeleteResponse,
  PostGenerationStatusResponse,
  CreatePostPullRequestRequest,
  CreatePostPullRequestResponse,
  PostListResponse,
  PostResponse,
  RunScheduleResponse,
  ScheduleDeleteResponse,
  ScheduleListResponse,
  ScheduleResponse,
  ScheduleRunListResponse,
  ListSkillsResponse,
  SkillResponse,
  UpdateScheduleRequest,
  CreateScheduleRequest,
  UpdateBrandColorRequest,
  UpdateBrandIdentityRequest,
  UpdatePostRequest,
  UpdateSkillRequest,
} from "./types/api.js";
import type { AuthContext } from "./types/auth.js";
import type {
  ImportSiteAuthorsRequest,
  ImportSiteAuthorsResponse,
  PublishSiteDesignRequest,
  PublishSiteDesignResponse,
  SetSiteAuthorPageRequest,
  SiteAuthorsResponse,
  SiteListResponse,
  UpsertSiteAuthorRequest,
} from "./types/site.js";
import type { CancelPostScheduleResponse, PostScheduleResponse, SchedulePostRequest } from "./types/post-schedule.js";
import type {
  EventTriggerDeleteResponse,
  EventTriggerListResponse,
  EventTriggerRequest,
  EventTriggerResponse,
  ListEventTriggersParams,
} from "./types/event-trigger.js";
import type {
  ListWebhookDeliveriesParams,
  WebhookDeliveryListResponse,
  WebhookDeliveryResponse,
  WebhookEndpointListResponse,
  WebhookIdResponse,
} from "./types/webhook.js";
import type {
  FeedbackListResponse,
  FeedbackResponse,
  ListFeedbackParams,
  UpdateFeedbackRequest,
} from "./types/feedback.js";
import type {
  ApproveGeoContentBriefResponse,
  GeoContentBriefListResponse,
  GeoContentBriefResponse,
  GeoContentGapsResponse,
  PlanGeoContentBriefRequest,
  PlanGeoContentBriefResponse,
  UpdateGeoContentBriefRequest,
  UpdateGeoContentGapResponse,
} from "./types/geo-brief.js";
import type { GeoAgentReadinessResponse, StartGeoAgentReadinessScanResponse } from "./types/geo-agent-readiness.js";
import type { GeoWindowParams } from "./types/geo-common.js";
import type {
  GeoChangesResponse,
  GeoPromptHistoryResponse,
  GeoSentimentAnalysisResponse,
  GeoSentimentEvidenceResponse,
  GeoSentimentResponse,
} from "./types/geo-diagnostics.js";
import type {
  GeoCompetitorListResponse,
  ImportGeoCompetitorsRequest,
  ImportGeoCompetitorsResponse,
  SuggestGeoCompetitorsResponse,
  UpsertGeoCompetitorRequest,
} from "./types/geo-competitor.js";
import type {
  GenerateGeoPersonasRequest,
  GeoPersonaActivityResponse,
  GeoPersonaArchiveResponse,
  GeoPersonaGenerationResponse,
  GeoPersonaListResponse,
  GeoPersonaResponse,
  GeoPersonaResultsResponse,
  RunGeoPersonaResponse,
  UpdateGeoPersonaRequest,
} from "./types/geo-persona.js";
import type {
  DismissGeoPromptSuggestionResponse,
  GeoPromptDeleteResponse,
  GeoPromptListResponse,
  GeoPromptResponse,
  GeoPromptSuggestionListResponse,
  ImportGeoPromptsRequest,
  ImportGeoPromptsResponse,
} from "./types/geo-prompt.js";
import type {
  CreateGeoScanResponse,
  GeoScanListResponse,
  GeoScanResponse,
  ListGeoScansParams,
} from "./types/geo-scan.js";
import type {
  CreateGeoSequenceRequest,
  GeoSequenceDeleteResponse,
  GeoSequenceListResponse,
  GeoSequenceResponse,
  RunGeoSequenceResponse,
  UpdateGeoSequenceRequest,
} from "./types/geo-sequence.js";
import type { GeoEngineListResponse, GeoSettingsResponse, UpdateGeoSettingsRequest } from "./types/geo-settings.js";
import type {
  GeoIngestSetupResponse,
  GeoMcpAnalyticsResponse,
  GeoMcpToolDetailResponse,
  GeoTrafficJourneyResponse,
  GeoTrafficJourneysResponse,
  GeoTrafficLogParams,
  GeoTrafficLogResponse,
  GeoTrafficOverviewResponse,
  GeoTrafficPagesParams,
  GeoTrafficPagesResponse,
  PostAgentReachResponse,
} from "./types/geo-traffic.js";
import type {
  GeoAnalyticsImportsResponse,
  GeoTrafficFilterParams,
  GeoTrafficJourneyStatsResponse,
  GeoWebAnalyticsBreakdownsResponse,
  GeoWebAnalyticsUtmParams,
  GeoWebAnalyticsUtmResponse,
  GeoWebAnalyticsResponse,
} from "./types/geo-web-analytics.js";
import type {
  GeoPromptResultDetailResponse,
  GeoPromptResultSummariesResponse,
  GeoPromptResultSummaryParams,
  GeoVisibilityCompetitorDetailResponse,
  GeoVisibilityCompetitorShareResponse,
  GeoVisibilityLanguageShareResponse,
  GeoVisibilityOverviewResponse,
  GeoVisibilityTimeseriesResponse,
} from "./types/geo-visibility.js";
import type { GeoShelfListResponse } from "./types/geo-shelf.js";
import type {
  CreateProjectRequest,
  ProjectDeleteResponse,
  ProjectListResponse,
  ProjectResponse,
  UpdateProjectRequest,
} from "./types/project.js";
import type { RequestOptions, RequestTimeoutOptions } from "./types/request.js";
import type {
  CreateSitePostPreviewRequest,
  GetSiteDeploymentResponse,
  GetSiteResponse,
  ListSiteDeploymentsResponse,
  PublishSitePostResponse,
  SitePostPreviewResponse,
  StartSiteDeploymentResponse,
} from "./types/site.js";
import type { WorkspaceContextResponse } from "./types/workspace.js";
import { describeApiError } from "./utils/api-error.js";
import { withoutHiddenReadinessChecks } from "./utils/geo-agent-readiness.js";
import { appendQueryParams } from "./utils/query-params.js";
import { describeOrganizationError } from "./utils/organization.js";
import { createRequestSignal } from "./utils/request-scope.js";

function sitePath(siteId: string, suffix: string): string {
  return `/v1/sites/${encodeURIComponent(siteId)}${suffix}`;
}

const NOTRA_API_BASE = process.env.NOTRA_API_BASE ?? "https://api.usenotra.com";

/**
 * Maps an `AbortSignal.timeout` abort (which can fire during the fetch call or
 * while reading the response body) to a readable error; returns undefined for
 * any other error so callers can fall through to their own handling.
 */
function asTimeoutError(error: unknown, timeoutMs: number): Error | undefined {
  if (error instanceof Error && error.name === "TimeoutError") {
    return new Error(`Notra API request timed out after ${timeoutMs / 1000}s`);
  }
  return undefined;
}

/**
 * Maps an abort (MCP client disconnect or caller cancellation) to a readable
 * error, so cancelled calls are not misreported as HTTP or parse failures.
 */
function asCancellationError(error: unknown): Error | undefined {
  if (error instanceof Error && error.name === "AbortError") {
    return new Error("Notra API request was cancelled");
  }
  return undefined;
}

function requestHeaders(auth: AuthContext, accept: string, withoutOrganization = false): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${auth.token}`,
    "Content-Type": "application/json",
    Accept: accept,
  };
  // OAuth tokens are bound to their consent workspace; only API keys select one per request.
  if (auth.kind === "apiKey" && auth.organizationId && !withoutOrganization) {
    headers[ORGANIZATION_ID_HEADER] = auth.organizationId;
  }
  return headers;
}

export class NotraClient {
  private resolveAuth: () => AuthContext;
  private baseUrl: string;

  constructor(auth: string | AuthContext | (() => AuthContext), baseUrl: string = NOTRA_API_BASE) {
    if (typeof auth === "function") {
      this.resolveAuth = auth;
    } else {
      const fixed: AuthContext = typeof auth === "string" ? { kind: "apiKey", token: auth } : auth;
      this.resolveAuth = () => fixed;
    }
    this.baseUrl = baseUrl;
  }

  private get auth(): AuthContext {
    return this.resolveAuth();
  }

  private async request<T, B = undefined>(method: string, path: string, options?: RequestOptions<B>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (options?.params) {
      appendQueryParams(url, options.params);
    }

    const headers = requestHeaders(this.auth, "application/json", options?.withoutOrganization);

    const timeoutMs = options?.timeoutMs ?? 30_000;
    const fetchOptions: RequestInit = { method, headers, signal: createRequestSignal(timeoutMs, options?.signal) };
    if (options?.body && (method === "POST" || method === "PATCH" || method === "PUT")) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    let response: Response;
    try {
      response = await fetch(url.toString(), fetchOptions);
    } catch (error) {
      throw asTimeoutError(error, timeoutMs) ?? asCancellationError(error) ?? error;
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch (error) {
      const timeout = asTimeoutError(error, timeoutMs);
      if (timeout) {
        throw timeout;
      }
      const cancelled = asCancellationError(error);
      if (cancelled) {
        throw cancelled;
      }
      if (!response.ok) {
        throw new Error(describeApiError(response, undefined, (message) => message));
      }
      throw new Error("Invalid JSON response from API");
    }

    if (!response.ok) {
      throw new Error(describeApiError(response, data, (message) => describeOrganizationError(message, this.auth)));
    }

    return data as T;
  }

  async listPosts(params?: ListPostsParams): Promise<PostListResponse> {
    return this.request<PostListResponse>("GET", "/v1/posts", {
      params,
    });
  }

  async getPost(postId: string): Promise<PostResponse> {
    const data = await this.request<PostResponse>("GET", `/v1/posts/${encodeURIComponent(postId)}`);
    if (!data.post) {
      throw new Error(`Post not found: ${postId}`);
    }
    return data;
  }

  async getPostAgentReach(postId: string, params?: GeoWindowParams): Promise<PostAgentReachResponse> {
    return this.request<PostAgentReachResponse>("GET", `/v1/posts/${encodeURIComponent(postId)}/agent-reach`, {
      params,
    });
  }

  async getSite(siteId: string): Promise<GetSiteResponse> {
    return this.request<GetSiteResponse>("GET", sitePath(siteId, ""));
  }

  async listSiteDeployments(siteId: string, params?: { limit?: number }): Promise<ListSiteDeploymentsResponse> {
    return this.request<ListSiteDeploymentsResponse>("GET", sitePath(siteId, "/deployments"), { params });
  }

  async getSiteDeployment(siteId: string, deploymentId: string): Promise<GetSiteDeploymentResponse> {
    return this.request<GetSiteDeploymentResponse>(
      "GET",
      sitePath(siteId, `/deployments/${encodeURIComponent(deploymentId)}`),
    );
  }

  async startSiteDeployment(siteId: string): Promise<StartSiteDeploymentResponse> {
    return this.request<StartSiteDeploymentResponse>("POST", sitePath(siteId, "/deployments"));
  }

  async redeploySiteDeployment(siteId: string, deploymentId: string): Promise<StartSiteDeploymentResponse> {
    return this.request<StartSiteDeploymentResponse>(
      "POST",
      sitePath(siteId, `/deployments/${encodeURIComponent(deploymentId)}/redeploy`),
    );
  }

  async createSitePostPreview(siteId: string, body: CreateSitePostPreviewRequest): Promise<SitePostPreviewResponse> {
    return this.request<SitePostPreviewResponse, CreateSitePostPreviewRequest>(
      "POST",
      sitePath(siteId, "/post-previews"),
      { body },
    );
  }

  async getSitePostPreview(siteId: string, postId: string): Promise<SitePostPreviewResponse> {
    return this.request<SitePostPreviewResponse>(
      "GET",
      sitePath(siteId, `/post-previews/${encodeURIComponent(postId)}`),
    );
  }

  async publishPostToSite(siteId: string, postId: string): Promise<PublishSitePostResponse> {
    return this.request<PublishSitePostResponse, { postId: string }>("POST", sitePath(siteId, "/publications"), {
      body: { postId },
      timeoutMs: SITE_PUBLISH_TIMEOUT_MS,
    });
  }

  async updatePost(postId: string, body: UpdatePostRequest): Promise<PostResponse> {
    return this.request<PostResponse, UpdatePostRequest>("PATCH", `/v1/posts/${encodeURIComponent(postId)}`, { body });
  }

  async deletePost(postId: string): Promise<PostDeleteResponse> {
    return this.request<PostDeleteResponse>("DELETE", `/v1/posts/${encodeURIComponent(postId)}`);
  }

  async createPost(body: CreatePostRequest): Promise<PostResponse> {
    return this.request<PostResponse, CreatePostRequest>("POST", "/v1/posts", { body });
  }

  async generatePost(body: GeneratePostRequest): Promise<GeneratePostResponse> {
    return this.request<GeneratePostResponse, GeneratePostRequest>("POST", "/v1/posts/generate", { body });
  }

  async createPostPullRequest(
    postId: string,
    body: CreatePostPullRequestRequest,
  ): Promise<CreatePostPullRequestResponse> {
    return this.request<CreatePostPullRequestResponse, CreatePostPullRequestRequest>(
      "POST",
      `/v1/posts/${encodeURIComponent(postId)}/pull-request`,
      { body },
    );
  }

  async getPostGenerationStatus(jobId: string): Promise<PostGenerationStatusResponse> {
    return this.request<PostGenerationStatusResponse>("GET", `/v1/posts/generate/${encodeURIComponent(jobId)}`);
  }

  async getPostSchedule(postId: string): Promise<PostScheduleResponse> {
    return this.request<PostScheduleResponse>("GET", `/v1/posts/${encodeURIComponent(postId)}/schedule`);
  }

  async schedulePost(postId: string, body: SchedulePostRequest): Promise<PostScheduleResponse> {
    return this.request<PostScheduleResponse, SchedulePostRequest>(
      "POST",
      `/v1/posts/${encodeURIComponent(postId)}/schedule`,
      { body },
    );
  }

  async cancelPostSchedule(postId: string): Promise<CancelPostScheduleResponse> {
    return this.request<CancelPostScheduleResponse>("DELETE", `/v1/posts/${encodeURIComponent(postId)}/schedule`);
  }

  async listBrandIdentities(): Promise<BrandIdentityListResponse> {
    return this.request<BrandIdentityListResponse>("GET", "/v1/brand-identities");
  }

  async getBrandIdentity(brandIdentityId: string): Promise<BrandIdentityResponse> {
    const data = await this.request<BrandIdentityResponse>(
      "GET",
      `/v1/brand-identities/${encodeURIComponent(brandIdentityId)}`,
    );
    if (!data.brandIdentity) {
      throw new Error(`Brand identity not found: ${brandIdentityId}`);
    }
    return data;
  }

  async updateBrandIdentity(brandIdentityId: string, body: UpdateBrandIdentityRequest): Promise<BrandIdentityResponse> {
    return this.request<BrandIdentityResponse, UpdateBrandIdentityRequest>(
      "PATCH",
      `/v1/brand-identities/${encodeURIComponent(brandIdentityId)}`,
      { body },
    );
  }

  async deleteBrandIdentity(brandIdentityId: string): Promise<BrandIdentityDeleteResponse> {
    return this.request<BrandIdentityDeleteResponse>(
      "DELETE",
      `/v1/brand-identities/${encodeURIComponent(brandIdentityId)}`,
    );
  }

  async listBrandColors(brandIdentityId: string): Promise<BrandColorListResponse> {
    return this.request<BrandColorListResponse>(
      "GET",
      `/v1/brand-identities/${encodeURIComponent(brandIdentityId)}/colors`,
    );
  }

  async createBrandColor(brandIdentityId: string, body: CreateBrandColorRequest): Promise<BrandColorResponse> {
    return this.request<BrandColorResponse, CreateBrandColorRequest>(
      "POST",
      `/v1/brand-identities/${encodeURIComponent(brandIdentityId)}/colors`,
      { body },
    );
  }

  async updateBrandColor(
    brandIdentityId: string,
    colorId: string,
    body: UpdateBrandColorRequest,
  ): Promise<BrandColorResponse> {
    return this.request<BrandColorResponse, UpdateBrandColorRequest>(
      "PATCH",
      `/v1/brand-identities/${encodeURIComponent(brandIdentityId)}/colors/${encodeURIComponent(colorId)}`,
      { body },
    );
  }

  async deleteBrandColor(brandIdentityId: string, colorId: string): Promise<BrandColorDeleteResponse> {
    return this.request<BrandColorDeleteResponse>(
      "DELETE",
      `/v1/brand-identities/${encodeURIComponent(brandIdentityId)}/colors/${encodeURIComponent(colorId)}`,
    );
  }

  async generateBrandIdentity(body: GenerateBrandIdentityRequest): Promise<GenerateBrandIdentityResponse> {
    return this.request<GenerateBrandIdentityResponse, GenerateBrandIdentityRequest>(
      "POST",
      "/v1/brand-identities/generate",
      { body },
    );
  }

  async getBrandIdentityGenerationStatus(jobId: string): Promise<BrandIdentityGenerationStatusResponse> {
    return this.request<BrandIdentityGenerationStatusResponse>(
      "GET",
      `/v1/brand-identities/generate/${encodeURIComponent(jobId)}`,
    );
  }

  async listIntegrations(): Promise<IntegrationsListResponse> {
    return this.request<IntegrationsListResponse>("GET", "/v1/integrations");
  }

  async createGithubIntegration(body: CreateGithubIntegrationRequest): Promise<CreateGithubIntegrationResponse> {
    return this.request<CreateGithubIntegrationResponse, CreateGithubIntegrationRequest>(
      "POST",
      "/v1/integrations/github",
      { body },
    );
  }

  async listGithubActivity(integrationId: string, params?: ListGithubActivityParams): Promise<GithubActivityResponse> {
    return this.request<GithubActivityResponse>(
      "GET",
      `/v1/integrations/github/${encodeURIComponent(integrationId)}/activity`,
      { params },
    );
  }

  async deleteIntegration(integrationId: string): Promise<IntegrationDeleteResponse> {
    return this.request<IntegrationDeleteResponse>("DELETE", `/v1/integrations/${encodeURIComponent(integrationId)}`);
  }

  async listSchedules(params?: ListSchedulesParams): Promise<ScheduleListResponse> {
    return this.request<ScheduleListResponse>("GET", "/v1/schedules", {
      params,
    });
  }

  async createSchedule(body: CreateScheduleRequest): Promise<ScheduleResponse> {
    return this.request<ScheduleResponse, CreateScheduleRequest>("POST", "/v1/schedules", { body });
  }

  async updateSchedule(scheduleId: string, body: UpdateScheduleRequest): Promise<ScheduleResponse> {
    return this.request<ScheduleResponse, UpdateScheduleRequest>(
      "PATCH",
      `/v1/schedules/${encodeURIComponent(scheduleId)}`,
      { body },
    );
  }

  async deleteSchedule(scheduleId: string): Promise<ScheduleDeleteResponse> {
    return this.request<ScheduleDeleteResponse>("DELETE", `/v1/schedules/${encodeURIComponent(scheduleId)}`);
  }

  async runSchedule(scheduleId: string): Promise<RunScheduleResponse> {
    return this.request<RunScheduleResponse>("POST", `/v1/schedules/${encodeURIComponent(scheduleId)}/run`);
  }

  async listScheduleRuns(scheduleId: string, params?: ListScheduleRunsParams): Promise<ScheduleRunListResponse> {
    return this.request<ScheduleRunListResponse>("GET", `/v1/schedules/${encodeURIComponent(scheduleId)}/runs`, {
      params,
    });
  }

  async listSites(): Promise<SiteListResponse> {
    return this.request<SiteListResponse>("GET", "/v1/sites");
  }

  async listSiteAuthors(siteId: string): Promise<SiteAuthorsResponse> {
    return this.request<SiteAuthorsResponse>("GET", `/v1/sites/${encodeURIComponent(siteId)}/authors`);
  }

  async upsertSiteAuthor(
    siteId: string,
    authorId: string,
    body: UpsertSiteAuthorRequest,
  ): Promise<SiteAuthorsResponse> {
    return this.request<SiteAuthorsResponse, UpsertSiteAuthorRequest>(
      "PUT",
      `/v1/sites/${encodeURIComponent(siteId)}/authors/${encodeURIComponent(authorId)}`,
      { body },
    );
  }

  async deleteSiteAuthor(siteId: string, authorId: string, force?: boolean): Promise<SiteAuthorsResponse> {
    return this.request<SiteAuthorsResponse>(
      "DELETE",
      `/v1/sites/${encodeURIComponent(siteId)}/authors/${encodeURIComponent(authorId)}`,
      { params: force ? { force: "true" } : undefined },
    );
  }

  async importSiteAuthors(siteId: string, body: ImportSiteAuthorsRequest): Promise<ImportSiteAuthorsResponse> {
    return this.request<ImportSiteAuthorsResponse, ImportSiteAuthorsRequest>(
      "POST",
      `/v1/sites/${encodeURIComponent(siteId)}/authors/import`,
      { body },
    );
  }

  async setSiteAuthorPage(siteId: string, body: SetSiteAuthorPageRequest): Promise<SiteAuthorsResponse> {
    return this.request<SiteAuthorsResponse, SetSiteAuthorPageRequest>(
      "PATCH",
      `/v1/sites/${encodeURIComponent(siteId)}/author-page`,
      { body },
    );
  }

  async publishSiteDesign(siteId: string, body: PublishSiteDesignRequest): Promise<PublishSiteDesignResponse> {
    return this.request<PublishSiteDesignResponse, PublishSiteDesignRequest>(
      "POST",
      `/v1/sites/${encodeURIComponent(siteId)}/publish`,
      { body, timeoutMs: 120_000 },
    );
  }

  async listSkills(): Promise<ListSkillsResponse> {
    return this.request<ListSkillsResponse>("GET", "/v1/skills");
  }

  async createSkill(body: CreateSkillRequest): Promise<SkillResponse> {
    return this.request<SkillResponse, CreateSkillRequest>("POST", "/v1/skills", { body });
  }

  async getSkill(name: string): Promise<SkillResponse> {
    return this.request<SkillResponse>("GET", `/v1/skills/${encodeURIComponent(name)}`);
  }

  async updateSkill(name: string, body: UpdateSkillRequest): Promise<SkillResponse> {
    return this.request<SkillResponse, UpdateSkillRequest>("PATCH", `/v1/skills/${encodeURIComponent(name)}`, { body });
  }

  async deleteSkill(name: string): Promise<DeleteSkillResponse> {
    return this.request<DeleteSkillResponse>("DELETE", `/v1/skills/${encodeURIComponent(name)}`);
  }

  async listEventTriggers(params?: ListEventTriggersParams): Promise<EventTriggerListResponse> {
    return this.request<EventTriggerListResponse>("GET", "/v1/event-triggers", { params });
  }

  async createEventTrigger(body: EventTriggerRequest): Promise<EventTriggerResponse> {
    return this.request<EventTriggerResponse, EventTriggerRequest>("POST", "/v1/event-triggers", { body });
  }

  async getEventTrigger(triggerId: string): Promise<EventTriggerResponse> {
    return this.request<EventTriggerResponse>("GET", `/v1/event-triggers/${encodeURIComponent(triggerId)}`);
  }

  async updateEventTrigger(triggerId: string, body: EventTriggerRequest): Promise<EventTriggerResponse> {
    return this.request<EventTriggerResponse, EventTriggerRequest>(
      "PATCH",
      `/v1/event-triggers/${encodeURIComponent(triggerId)}`,
      { body },
    );
  }

  async deleteEventTrigger(triggerId: string): Promise<EventTriggerDeleteResponse> {
    return this.request<EventTriggerDeleteResponse>("DELETE", `/v1/event-triggers/${encodeURIComponent(triggerId)}`);
  }

  async listWebhookEndpoints(): Promise<WebhookEndpointListResponse> {
    return this.request<WebhookEndpointListResponse>("GET", "/v1/webhooks");
  }

  async deleteWebhookEndpoint(endpointId: string): Promise<WebhookIdResponse> {
    return this.request<WebhookIdResponse>("DELETE", `/v1/webhooks/${encodeURIComponent(endpointId)}`);
  }

  async listWebhookDeliveries(params?: ListWebhookDeliveriesParams): Promise<WebhookDeliveryListResponse> {
    return this.request<WebhookDeliveryListResponse>("GET", "/v1/webhooks/deliveries", { params });
  }

  async getWebhookDelivery(deliveryId: string): Promise<WebhookDeliveryResponse> {
    return this.request<WebhookDeliveryResponse>("GET", `/v1/webhooks/deliveries/${encodeURIComponent(deliveryId)}`);
  }

  async retryWebhookDelivery(deliveryId: string): Promise<WebhookIdResponse> {
    return this.request<WebhookIdResponse>("POST", `/v1/webhooks/deliveries/${encodeURIComponent(deliveryId)}/retry`);
  }

  async listFeedback(params?: ListFeedbackParams): Promise<FeedbackListResponse> {
    return this.request<FeedbackListResponse>("GET", "/v1/feedback", { params });
  }

  async getFeedback(feedbackId: string): Promise<FeedbackResponse> {
    return this.request<FeedbackResponse>("GET", `/v1/feedback/${encodeURIComponent(feedbackId)}`);
  }

  async updateFeedback(feedbackId: string, body: UpdateFeedbackRequest): Promise<FeedbackResponse> {
    return this.request<FeedbackResponse, UpdateFeedbackRequest>(
      "PATCH",
      `/v1/feedback/${encodeURIComponent(feedbackId)}`,
      { body },
    );
  }

  private geoPath(projectId: string, suffix: string): string {
    return `/v1/projects/${encodeURIComponent(projectId)}/geo${suffix}`;
  }

  async listProjects(): Promise<ProjectListResponse> {
    return this.request<ProjectListResponse>("GET", "/v1/projects");
  }

  async getWorkspaceContext(includePending = false, withoutOrganization = false): Promise<WorkspaceContextResponse> {
    return this.request<WorkspaceContextResponse>("GET", "/v1/me/workspaces", {
      params: includePending ? { includePending: true } : undefined,
      withoutOrganization,
    });
  }

  async createProject(body: CreateProjectRequest): Promise<ProjectResponse> {
    return this.request<ProjectResponse, CreateProjectRequest>("POST", "/v1/projects", { body });
  }

  async getProject(projectId: string): Promise<ProjectResponse> {
    return this.request<ProjectResponse>("GET", `/v1/projects/${encodeURIComponent(projectId)}`);
  }

  async updateProject(projectId: string, body: UpdateProjectRequest): Promise<ProjectResponse> {
    return this.request<ProjectResponse, UpdateProjectRequest>(
      "PATCH",
      `/v1/projects/${encodeURIComponent(projectId)}`,
      { body },
    );
  }

  async deleteProject(projectId: string): Promise<ProjectDeleteResponse> {
    return this.request<ProjectDeleteResponse>("DELETE", `/v1/projects/${encodeURIComponent(projectId)}`);
  }

  async getGeoSettings(projectId: string): Promise<GeoSettingsResponse> {
    return this.request<GeoSettingsResponse>("GET", this.geoPath(projectId, "/settings"));
  }

  async listGeoEngines(projectId: string): Promise<GeoEngineListResponse> {
    return this.request<GeoEngineListResponse>("GET", this.geoPath(projectId, "/engines"));
  }

  async updateGeoSettings(projectId: string, body: UpdateGeoSettingsRequest): Promise<GeoSettingsResponse> {
    return this.request<GeoSettingsResponse, UpdateGeoSettingsRequest>("PATCH", this.geoPath(projectId, "/settings"), {
      body,
    });
  }

  async listGeoPrompts(projectId: string): Promise<GeoPromptListResponse> {
    return this.request<GeoPromptListResponse>("GET", this.geoPath(projectId, "/prompts"));
  }

  async createGeoPrompt(projectId: string, prompt: string): Promise<GeoPromptResponse> {
    return this.request<GeoPromptResponse, { prompt: string }>("POST", this.geoPath(projectId, "/prompts"), {
      body: { prompt },
    });
  }

  async updateGeoPrompt(projectId: string, promptId: string, enabled: boolean): Promise<GeoPromptResponse> {
    return this.request<GeoPromptResponse, { enabled: boolean }>(
      "PATCH",
      this.geoPath(projectId, `/prompts/${encodeURIComponent(promptId)}`),
      { body: { enabled } },
    );
  }

  async deleteGeoPrompt(projectId: string, promptId: string): Promise<GeoPromptDeleteResponse> {
    return this.request<GeoPromptDeleteResponse>(
      "DELETE",
      this.geoPath(projectId, `/prompts/${encodeURIComponent(promptId)}`),
    );
  }

  async importGeoPrompts(projectId: string, body: ImportGeoPromptsRequest): Promise<ImportGeoPromptsResponse> {
    return this.request<ImportGeoPromptsResponse, ImportGeoPromptsRequest>(
      "POST",
      this.geoPath(projectId, "/prompts/import"),
      { body },
    );
  }

  async listGeoPromptSuggestions(projectId: string): Promise<GeoPromptSuggestionListResponse> {
    return this.request<GeoPromptSuggestionListResponse>("GET", this.geoPath(projectId, "/prompts/suggestions"));
  }

  async acceptGeoPromptSuggestion(projectId: string, suggestionId: string): Promise<GeoPromptResponse> {
    return this.request<GeoPromptResponse>(
      "POST",
      this.geoPath(projectId, `/prompts/suggestions/${encodeURIComponent(suggestionId)}/accept`),
    );
  }

  async dismissGeoPromptSuggestion(
    projectId: string,
    suggestionId: string,
  ): Promise<DismissGeoPromptSuggestionResponse> {
    return this.request<DismissGeoPromptSuggestionResponse>(
      "POST",
      this.geoPath(projectId, `/prompts/suggestions/${encodeURIComponent(suggestionId)}/dismiss`),
    );
  }

  async listGeoSequences(projectId: string): Promise<GeoSequenceListResponse> {
    return this.request<GeoSequenceListResponse>("GET", this.geoPath(projectId, "/sequences"));
  }

  async createGeoSequence(projectId: string, body: CreateGeoSequenceRequest): Promise<GeoSequenceResponse> {
    return this.request<GeoSequenceResponse, CreateGeoSequenceRequest>("POST", this.geoPath(projectId, "/sequences"), {
      body,
    });
  }

  async updateGeoSequence(
    projectId: string,
    sequenceId: string,
    body: UpdateGeoSequenceRequest,
  ): Promise<GeoSequenceResponse> {
    return this.request<GeoSequenceResponse, UpdateGeoSequenceRequest>(
      "PATCH",
      this.geoPath(projectId, `/sequences/${encodeURIComponent(sequenceId)}`),
      { body },
    );
  }

  async deleteGeoSequence(projectId: string, sequenceId: string): Promise<GeoSequenceDeleteResponse> {
    return this.request<GeoSequenceDeleteResponse>(
      "DELETE",
      this.geoPath(projectId, `/sequences/${encodeURIComponent(sequenceId)}`),
    );
  }

  async runGeoSequence(projectId: string, sequenceId: string): Promise<RunGeoSequenceResponse> {
    return this.request<RunGeoSequenceResponse>(
      "POST",
      this.geoPath(projectId, `/sequences/${encodeURIComponent(sequenceId)}/run`),
      { timeoutMs: GEO_LONG_RUNNING_TIMEOUT_MS },
    );
  }

  async listGeoPersonas(projectId: string): Promise<GeoPersonaListResponse> {
    return this.request<GeoPersonaListResponse>("GET", this.geoPath(projectId, "/personas"));
  }

  async updateGeoPersona(
    projectId: string,
    personaId: string,
    body: UpdateGeoPersonaRequest,
  ): Promise<GeoPersonaResponse> {
    return this.request<GeoPersonaResponse, UpdateGeoPersonaRequest>(
      "PATCH",
      this.geoPath(projectId, `/personas/${encodeURIComponent(personaId)}`),
      { body },
    );
  }

  async archiveGeoPersona(projectId: string, personaId: string): Promise<GeoPersonaArchiveResponse> {
    return this.request<GeoPersonaArchiveResponse>(
      "DELETE",
      this.geoPath(projectId, `/personas/${encodeURIComponent(personaId)}`),
    );
  }

  async restoreGeoPersona(projectId: string, personaId: string): Promise<GeoPersonaResponse> {
    return this.request<GeoPersonaResponse>(
      "POST",
      this.geoPath(projectId, `/personas/${encodeURIComponent(personaId)}/restore`),
    );
  }

  async getGeoPersonaResults(
    projectId: string,
    personaId: string,
    scanId?: string,
  ): Promise<GeoPersonaResultsResponse> {
    return this.request<GeoPersonaResultsResponse>(
      "GET",
      this.geoPath(projectId, `/personas/${encodeURIComponent(personaId)}/results`),
      { params: { scanId } },
    );
  }

  async getGeoPersonaActivity(projectId: string, params?: GeoWindowParams): Promise<GeoPersonaActivityResponse> {
    return this.request<GeoPersonaActivityResponse>("GET", this.geoPath(projectId, "/personas/activity"), {
      params,
    });
  }

  async runGeoPersona(projectId: string, personaId: string): Promise<RunGeoPersonaResponse> {
    return this.request<RunGeoPersonaResponse>(
      "POST",
      this.geoPath(projectId, `/personas/${encodeURIComponent(personaId)}/run`),
      { timeoutMs: GEO_LONG_RUNNING_TIMEOUT_MS },
    );
  }

  async generateGeoPersonas(
    projectId: string,
    body: GenerateGeoPersonasRequest,
  ): Promise<GeoPersonaGenerationResponse> {
    return this.request<GeoPersonaGenerationResponse, GenerateGeoPersonasRequest>(
      "POST",
      this.geoPath(projectId, "/personas/generate"),
      { body },
    );
  }

  async getGeoPersonaGeneration(projectId: string): Promise<GeoPersonaGenerationResponse> {
    return this.request<GeoPersonaGenerationResponse>("GET", this.geoPath(projectId, "/personas/generation"));
  }

  async listGeoCompetitors(projectId: string): Promise<GeoCompetitorListResponse> {
    return this.request<GeoCompetitorListResponse>("GET", this.geoPath(projectId, "/competitors"));
  }

  async upsertGeoCompetitor(projectId: string, body: UpsertGeoCompetitorRequest): Promise<GeoCompetitorListResponse> {
    return this.request<GeoCompetitorListResponse, UpsertGeoCompetitorRequest>(
      "PUT",
      this.geoPath(projectId, "/competitors"),
      { body },
    );
  }

  async suggestGeoCompetitors(projectId: string, domain: string): Promise<SuggestGeoCompetitorsResponse> {
    return this.request<SuggestGeoCompetitorsResponse>("GET", this.geoPath(projectId, "/competitors/suggestions"), {
      params: { domain },
      timeoutMs: GEO_LONG_RUNNING_TIMEOUT_MS,
    });
  }

  async deleteGeoCompetitor(projectId: string, name: string): Promise<GeoCompetitorListResponse> {
    return this.request<GeoCompetitorListResponse>(
      "DELETE",
      this.geoPath(projectId, `/competitors/${encodeURIComponent(name)}`),
    );
  }

  async importGeoCompetitors(
    projectId: string,
    body: ImportGeoCompetitorsRequest,
  ): Promise<ImportGeoCompetitorsResponse> {
    return this.request<ImportGeoCompetitorsResponse, ImportGeoCompetitorsRequest>(
      "POST",
      this.geoPath(projectId, "/competitors/import"),
      { body },
    );
  }

  async createGeoScan(projectId: string): Promise<CreateGeoScanResponse> {
    return this.request<CreateGeoScanResponse>("POST", this.geoPath(projectId, "/scans"));
  }

  async rescanGeoPrompt(projectId: string, promptId: string): Promise<CreateGeoScanResponse> {
    return this.request<CreateGeoScanResponse>(
      "POST",
      this.geoPath(projectId, `/scans/prompts/${encodeURIComponent(promptId)}`),
    );
  }

  async listGeoScans(projectId: string, params?: ListGeoScansParams): Promise<GeoScanListResponse> {
    return this.request<GeoScanListResponse>("GET", this.geoPath(projectId, "/scans"), {
      params,
    });
  }

  async getGeoScan(projectId: string, scanId: string): Promise<GeoScanResponse> {
    return this.request<GeoScanResponse>("GET", this.geoPath(projectId, `/scans/${encodeURIComponent(scanId)}`));
  }

  async getGeoVisibilityOverview(projectId: string, params?: GeoWindowParams): Promise<GeoVisibilityOverviewResponse> {
    return this.request<GeoVisibilityOverviewResponse>("GET", this.geoPath(projectId, "/visibility/overview"), {
      params,
    });
  }

  async getGeoVisibilityTimeseries(
    projectId: string,
    params?: GeoWindowParams,
  ): Promise<GeoVisibilityTimeseriesResponse> {
    return this.request<GeoVisibilityTimeseriesResponse>("GET", this.geoPath(projectId, "/visibility/timeseries"), {
      params,
    });
  }

  async listGeoPromptResultSummaries(
    projectId: string,
    params?: GeoPromptResultSummaryParams,
  ): Promise<GeoPromptResultSummariesResponse> {
    return this.request<GeoPromptResultSummariesResponse>(
      "GET",
      this.geoPath(projectId, "/visibility/prompt-results/summaries"),
      { params },
    );
  }

  async getGeoPromptResultDetail(projectId: string, checkId: string): Promise<GeoPromptResultDetailResponse> {
    return this.request<GeoPromptResultDetailResponse>(
      "GET",
      this.geoPath(projectId, `/visibility/prompt-results/${encodeURIComponent(checkId)}`),
    );
  }

  async getGeoChanges(projectId: string, options?: RequestTimeoutOptions): Promise<GeoChangesResponse> {
    return this.request<GeoChangesResponse>("GET", this.geoPath(projectId, "/changes"), options);
  }

  async getGeoPromptHistory(projectId: string, promptId: string, scanId?: string): Promise<GeoPromptHistoryResponse> {
    return this.request<GeoPromptHistoryResponse>(
      "GET",
      this.geoPath(projectId, `/prompts/${encodeURIComponent(promptId)}/history`),
      { params: { scanId } },
    );
  }

  async getGeoSentiment(
    projectId: string,
    params?: GeoWindowParams,
    options?: RequestTimeoutOptions,
  ): Promise<GeoSentimentResponse> {
    return this.request<GeoSentimentResponse>("GET", this.geoPath(projectId, "/sentiment"), {
      params,
      ...options,
    });
  }

  async getGeoSentimentAnalysis(projectId: string, params?: GeoWindowParams): Promise<GeoSentimentAnalysisResponse> {
    return this.request<GeoSentimentAnalysisResponse>("GET", this.geoPath(projectId, "/sentiment/analysis"), {
      params,
    });
  }

  async listGeoSentimentEvidence(
    projectId: string,
    params?: GeoWindowParams & { cursor?: string },
  ): Promise<GeoSentimentEvidenceResponse> {
    return this.request<GeoSentimentEvidenceResponse>("GET", this.geoPath(projectId, "/sentiment/evidence"), {
      params,
    });
  }

  async listGeoShelfSources(
    projectId: string,
    params?: { offset?: number; limit?: number },
    options?: RequestTimeoutOptions,
  ): Promise<GeoShelfListResponse> {
    return this.request<GeoShelfListResponse>("GET", this.geoPath(projectId, "/shelf-sources"), {
      params,
      ...options,
    });
  }

  async getGeoVisibilityCompetitorShare(
    projectId: string,
    params?: GeoWindowParams,
    options?: RequestTimeoutOptions,
  ): Promise<GeoVisibilityCompetitorShareResponse> {
    return this.request<GeoVisibilityCompetitorShareResponse>(
      "GET",
      this.geoPath(projectId, "/visibility/competitor-share"),
      { params, ...options },
    );
  }

  async getGeoVisibilityLanguageShare(
    projectId: string,
    params?: GeoWindowParams,
  ): Promise<GeoVisibilityLanguageShareResponse> {
    return this.request<GeoVisibilityLanguageShareResponse>(
      "GET",
      this.geoPath(projectId, "/visibility/language-share"),
      { params },
    );
  }

  async getGeoVisibilityCompetitorDetail(
    projectId: string,
    brand: string,
    params?: GeoWindowParams,
  ): Promise<GeoVisibilityCompetitorDetailResponse> {
    return this.request<GeoVisibilityCompetitorDetailResponse>(
      "GET",
      this.geoPath(projectId, `/visibility/competitors/${encodeURIComponent(brand)}`),
      { params },
    );
  }

  async listGeoContentGaps(projectId: string, options?: RequestTimeoutOptions): Promise<GeoContentGapsResponse> {
    return this.request<GeoContentGapsResponse>("GET", this.geoPath(projectId, "/gaps"), options);
  }

  async updateGeoContentGap(
    projectId: string,
    promptId: string,
    ignored: boolean,
  ): Promise<UpdateGeoContentGapResponse> {
    return this.request<UpdateGeoContentGapResponse, { ignored: boolean }>(
      "PATCH",
      this.geoPath(projectId, `/gaps/${encodeURIComponent(promptId)}`),
      { body: { ignored } },
    );
  }

  async listGeoContentBriefs(projectId: string): Promise<GeoContentBriefListResponse> {
    return this.request<GeoContentBriefListResponse>("GET", this.geoPath(projectId, "/briefs"));
  }

  async planGeoContentBrief(projectId: string, body: PlanGeoContentBriefRequest): Promise<PlanGeoContentBriefResponse> {
    return this.request<PlanGeoContentBriefResponse, PlanGeoContentBriefRequest>(
      "POST",
      this.geoPath(projectId, "/briefs"),
      { body, timeoutMs: GEO_LONG_RUNNING_TIMEOUT_MS },
    );
  }

  async getGeoContentBrief(projectId: string, briefId: string): Promise<GeoContentBriefResponse> {
    return this.request<GeoContentBriefResponse>(
      "GET",
      this.geoPath(projectId, `/briefs/${encodeURIComponent(briefId)}`),
    );
  }

  async updateGeoContentBrief(
    projectId: string,
    briefId: string,
    body: UpdateGeoContentBriefRequest,
  ): Promise<GeoContentBriefResponse> {
    return this.request<GeoContentBriefResponse, UpdateGeoContentBriefRequest>(
      "PATCH",
      this.geoPath(projectId, `/briefs/${encodeURIComponent(briefId)}`),
      { body },
    );
  }

  async approveGeoContentBrief(projectId: string, briefId: string): Promise<ApproveGeoContentBriefResponse> {
    return this.request<ApproveGeoContentBriefResponse>(
      "POST",
      this.geoPath(projectId, `/briefs/${encodeURIComponent(briefId)}/approve`),
    );
  }

  async getGeoAgentReadiness(projectId: string, options?: RequestTimeoutOptions): Promise<GeoAgentReadinessResponse> {
    const response = await this.request<GeoAgentReadinessResponse>(
      "GET",
      this.geoPath(projectId, "/agent-readiness"),
      options,
    );
    return withoutHiddenReadinessChecks(response);
  }

  async startGeoAgentReadinessScan(projectId: string): Promise<StartGeoAgentReadinessScanResponse> {
    return this.request<StartGeoAgentReadinessScanResponse>("POST", this.geoPath(projectId, "/agent-readiness/scan"));
  }

  async getGeoTrafficOverview(
    projectId: string,
    params?: GeoTrafficFilterParams,
    options?: RequestTimeoutOptions,
  ): Promise<GeoTrafficOverviewResponse> {
    return this.request<GeoTrafficOverviewResponse>("GET", this.geoPath(projectId, "/traffic/overview"), {
      params,
      ...options,
    });
  }

  async getGeoTrafficLog(projectId: string, params?: GeoTrafficLogParams): Promise<GeoTrafficLogResponse> {
    return this.request<GeoTrafficLogResponse>("GET", this.geoPath(projectId, "/traffic/log"), {
      params,
    });
  }

  async listGeoTrafficJourneys(
    projectId: string,
    params?: GeoWindowParams & { limit?: number },
  ): Promise<GeoTrafficJourneysResponse> {
    return this.request<GeoTrafficJourneysResponse>("GET", this.geoPath(projectId, "/traffic/journeys"), {
      params,
    });
  }

  async getGeoTrafficJourney(
    projectId: string,
    journeyId: string,
    params?: GeoWindowParams,
  ): Promise<GeoTrafficJourneyResponse> {
    return this.request<GeoTrafficJourneyResponse>(
      "GET",
      this.geoPath(projectId, `/traffic/journeys/${encodeURIComponent(journeyId)}`),
      { params },
    );
  }

  async listGeoTrafficPages(projectId: string, params?: GeoTrafficPagesParams): Promise<GeoTrafficPagesResponse> {
    return this.request<GeoTrafficPagesResponse>("GET", this.geoPath(projectId, "/traffic/pages"), {
      params,
    });
  }

  async getGeoMcpAnalytics(projectId: string, params?: GeoWindowParams): Promise<GeoMcpAnalyticsResponse> {
    return this.request<GeoMcpAnalyticsResponse>("GET", this.geoPath(projectId, "/traffic/mcp"), { params });
  }

  async getGeoMcpToolDetail(
    projectId: string,
    toolName: string,
    params?: GeoWindowParams,
  ): Promise<GeoMcpToolDetailResponse> {
    return this.request<GeoMcpToolDetailResponse>(
      "GET",
      this.geoPath(projectId, `/traffic/mcp/tools/${encodeURIComponent(toolName)}`),
      { params },
    );
  }

  async getGeoIngestSetup(params?: { projectId?: string }): Promise<GeoIngestSetupResponse> {
    return this.request<GeoIngestSetupResponse>("GET", "/v1/geo/ingest/setup", { params });
  }

  async getGeoWebAnalytics(projectId: string, params?: GeoTrafficFilterParams): Promise<GeoWebAnalyticsResponse> {
    return this.request<GeoWebAnalyticsResponse>("GET", this.geoPath(projectId, "/traffic/web"), { params });
  }

  async getGeoWebAnalyticsBreakdowns(
    projectId: string,
    params?: GeoTrafficFilterParams,
  ): Promise<GeoWebAnalyticsBreakdownsResponse> {
    return this.request<GeoWebAnalyticsBreakdownsResponse>("GET", this.geoPath(projectId, "/traffic/web/breakdowns"), {
      params,
    });
  }

  async getGeoWebAnalyticsUtm(
    projectId: string,
    params: GeoWebAnalyticsUtmParams,
  ): Promise<GeoWebAnalyticsUtmResponse> {
    return this.request<GeoWebAnalyticsUtmResponse>("GET", this.geoPath(projectId, "/traffic/web/utm"), {
      params,
    });
  }

  async getGeoTrafficJourneyStats(
    projectId: string,
    params?: GeoWindowParams,
  ): Promise<GeoTrafficJourneyStatsResponse> {
    return this.request<GeoTrafficJourneyStatsResponse>("GET", this.geoPath(projectId, "/traffic/journey-stats"), {
      params,
    });
  }

  async listGeoAnalyticsImports(projectId: string): Promise<GeoAnalyticsImportsResponse> {
    return this.request<GeoAnalyticsImportsResponse>("GET", this.geoPath(projectId, "/traffic/imports"));
  }
}
