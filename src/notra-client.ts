import { GEO_LONG_RUNNING_TIMEOUT_MS } from "./constants/geo.js";
import type {
  ApiErrorResponse,
  BrandIdentityDeleteResponse,
  BrandIdentityGenerationStatusResponse,
  BrandIdentityListResponse,
  BrandIdentityResponse,
  ChatStreamResponse,
  CreateGithubIntegrationRequest,
  CreateGithubIntegrationResponse,
  CreateSkillRequest,
  DeleteSkillResponse,
  ExternalChannelSource,
  GetChatResponse,
  GetChatsResponse,
  GenerateBrandIdentityRequest,
  GenerateBrandIdentityResponse,
  GeneratePostRequest,
  GeneratePostResponse,
  IntegrationsListResponse,
  IntegrationDeleteResponse,
  ListPostsParams,
  ListSchedulesParams,
  PostDeleteResponse,
  PostGenerationStatusResponse,
  PostListResponse,
  PostResponse,
  ScheduleDeleteResponse,
  ScheduleListResponse,
  ScheduleResponse,
  SendChatMessageRequest,
  ChatSessionSummary,
  ListSkillsResponse,
  SkillResponse,
  UpdateScheduleRequest,
  UpdateBrandIdentityRequest,
  UpdatePostRequest,
  UpdateSkillRequest,
} from "./types/api.js";
import type { AuthContext } from "./types/auth.js";
import type {
  ApproveGeoContentBriefResponse,
  GeoContentBriefListResponse,
  GeoContentBriefResponse,
  GeoContentGapsResponse,
  PlanGeoContentBriefRequest,
  PlanGeoContentBriefResponse,
} from "./types/geo-brief.js";
import type { GeoAgentReadinessResponse, StartGeoAgentReadinessScanResponse } from "./types/geo-agent-readiness.js";
import type { GeoWindowParams } from "./types/geo-common.js";
import type {
  GeoCompetitorListResponse,
  ImportGeoCompetitorsRequest,
  ImportGeoCompetitorsResponse,
  SuggestGeoCompetitorsResponse,
  UpsertGeoCompetitorRequest,
} from "./types/geo-competitor.js";
import type {
  GeoPromptDeleteResponse,
  GeoPromptListResponse,
  GeoPromptResponse,
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
import type { GeoSettingsResponse, UpdateGeoSettingsRequest } from "./types/geo-settings.js";
import type {
  GeoIngestSetupResponse,
  GeoIngestTokenResponse,
  GeoTrafficJourneyResponse,
  GeoTrafficJourneysResponse,
  GeoTrafficLogParams,
  GeoTrafficLogResponse,
  GeoTrafficOverviewResponse,
  GeoTrafficPagesParams,
  GeoTrafficPagesResponse,
} from "./types/geo-traffic.js";
import type {
  GeoVisibilityCompetitorDetailResponse,
  GeoVisibilityCompetitorShareResponse,
  GeoVisibilityLanguageShareResponse,
  GeoVisibilityOverviewResponse,
  GeoVisibilityPromptResultsResponse,
  GeoVisibilityTimeseriesResponse,
} from "./types/geo-visibility.js";
import type {
  CreateProjectRequest,
  ProjectDeleteResponse,
  ProjectListResponse,
  ProjectResponse,
  UpdateProjectRequest,
} from "./types/project.js";
import type { RequestOptions } from "./types/request.js";
import { parseChatStream } from "./utils/chat-stream.js";
import { appendQueryParams } from "./utils/query-params.js";

const NOTRA_API_BASE = process.env.NOTRA_API_BASE ?? "https://api.usenotra.com";
const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
const DEFAULT_STREAM_TIMEOUT_MS = 180_000;

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

export class NotraClient {
  private token: string;
  private baseUrl: string;

  constructor(auth: string | AuthContext, baseUrl: string = NOTRA_API_BASE) {
    this.token = typeof auth === "string" ? auth : auth.token;
    this.baseUrl = baseUrl;
  }

  private async request<T, B = undefined>(method: string, path: string, options?: RequestOptions<B>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (options?.params) {
      appendQueryParams(url, options.params);
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const timeoutMs = options?.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
    const fetchOptions: RequestInit = { method, headers, signal: AbortSignal.timeout(timeoutMs) };
    if (options?.body && (method === "POST" || method === "PATCH" || method === "PUT")) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    let response: Response;
    try {
      response = await fetch(url.toString(), fetchOptions);
    } catch (error) {
      throw asTimeoutError(error, timeoutMs) ?? error;
    }

    let data: T | ApiErrorResponse;
    try {
      data = await response.json();
    } catch (error) {
      const timeout = asTimeoutError(error, timeoutMs);
      if (timeout) {
        throw timeout;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      throw new Error("Invalid JSON response from API");
    }

    if (!response.ok) {
      const errorBody = data as ApiErrorResponse;
      const message =
        typeof errorBody?.message === "string"
          ? errorBody.message
          : typeof errorBody?.error === "string"
            ? errorBody.error
            : `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return data as T;
  }

  private async requestText<B = undefined>(
    method: string,
    path: string,
    options?: RequestOptions<B>,
  ): Promise<ChatStreamResponse> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (options?.params) {
      appendQueryParams(url, options.params);
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream, application/json",
    };

    const timeoutMs = options?.timeoutMs ?? DEFAULT_STREAM_TIMEOUT_MS;
    const fetchOptions: RequestInit = { method, headers, signal: AbortSignal.timeout(timeoutMs) };
    if (options?.body && (method === "POST" || method === "PATCH" || method === "PUT")) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    let response: Response;
    try {
      response = await fetch(url.toString(), fetchOptions);
    } catch (error) {
      throw asTimeoutError(error, timeoutMs) ?? error;
    }

    let text: string;
    try {
      text = await response.text();
    } catch (error) {
      throw asTimeoutError(error, timeoutMs) ?? error;
    }

    if (!response.ok) {
      let errorBody: ApiErrorResponse | undefined;
      try {
        errorBody = JSON.parse(text) as ApiErrorResponse;
      } catch {
        errorBody = undefined;
      }
      const message =
        typeof errorBody?.message === "string"
          ? errorBody.message
          : typeof errorBody?.error === "string"
            ? errorBody.error
            : text || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    const parsed = parseChatStream(text);
    return {
      chatId: parsed.chatId ?? response.headers.get("x-chat-id"),
      text: parsed.text,
    };
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

  async updatePost(postId: string, body: UpdatePostRequest): Promise<PostResponse> {
    return this.request<PostResponse, UpdatePostRequest>("PATCH", `/v1/posts/${encodeURIComponent(postId)}`, { body });
  }

  async deletePost(postId: string): Promise<PostDeleteResponse> {
    return this.request<PostDeleteResponse>("DELETE", `/v1/posts/${encodeURIComponent(postId)}`);
  }

  async generatePost(body: GeneratePostRequest): Promise<GeneratePostResponse> {
    return this.request<GeneratePostResponse, GeneratePostRequest>("POST", "/v1/posts/generate", { body });
  }

  async getPostGenerationStatus(jobId: string): Promise<PostGenerationStatusResponse> {
    return this.request<PostGenerationStatusResponse>("GET", `/v1/posts/generate/${encodeURIComponent(jobId)}`);
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

  async deleteIntegration(integrationId: string): Promise<IntegrationDeleteResponse> {
    return this.request<IntegrationDeleteResponse>("DELETE", `/v1/integrations/${encodeURIComponent(integrationId)}`);
  }

  async listSchedules(params?: ListSchedulesParams): Promise<ScheduleListResponse> {
    return this.request<ScheduleListResponse>("GET", "/v1/schedules", {
      params,
    });
  }

  async createSchedule(body: UpdateScheduleRequest): Promise<ScheduleResponse> {
    return this.request<ScheduleResponse, UpdateScheduleRequest>("POST", "/v1/schedules", { body });
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

  async listChats(): Promise<GetChatsResponse> {
    return this.request<GetChatsResponse>("GET", "/v1/chats");
  }

  async createChat(body: SendChatMessageRequest): Promise<ChatStreamResponse> {
    return this.requestText<SendChatMessageRequest>("POST", "/v1/chats", { body });
  }

  async getChatByExternalChannel(
    source: Exclude<ExternalChannelSource, "dashboard">,
    id: string,
  ): Promise<ChatSessionSummary> {
    return this.request<ChatSessionSummary>("GET", "/v1/chats/by-external", {
      params: { source, id },
    });
  }

  async getChat(chatId: string): Promise<GetChatResponse> {
    return this.request<GetChatResponse>("GET", `/v1/chats/${encodeURIComponent(chatId)}`);
  }

  async postChatMessage(chatId: string, body: SendChatMessageRequest): Promise<ChatStreamResponse> {
    return this.requestText<SendChatMessageRequest>("POST", `/v1/chats/${encodeURIComponent(chatId)}`, { body });
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

  private geoPath(projectId: string, suffix: string): string {
    return `/v1/projects/${encodeURIComponent(projectId)}/geo${suffix}`;
  }

  async listProjects(): Promise<ProjectListResponse> {
    return this.request<ProjectListResponse>("GET", "/v1/projects");
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

  async getGeoVisibilityPromptResults(
    projectId: string,
    params?: GeoWindowParams,
  ): Promise<GeoVisibilityPromptResultsResponse> {
    return this.request<GeoVisibilityPromptResultsResponse>(
      "GET",
      this.geoPath(projectId, "/visibility/prompt-results"),
      { params },
    );
  }

  async getGeoVisibilityCompetitorShare(
    projectId: string,
    params?: GeoWindowParams,
  ): Promise<GeoVisibilityCompetitorShareResponse> {
    return this.request<GeoVisibilityCompetitorShareResponse>(
      "GET",
      this.geoPath(projectId, "/visibility/competitor-share"),
      { params },
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

  async listGeoContentGaps(projectId: string): Promise<GeoContentGapsResponse> {
    return this.request<GeoContentGapsResponse>("GET", this.geoPath(projectId, "/gaps"));
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

  async approveGeoContentBrief(projectId: string, briefId: string): Promise<ApproveGeoContentBriefResponse> {
    return this.request<ApproveGeoContentBriefResponse>(
      "POST",
      this.geoPath(projectId, `/briefs/${encodeURIComponent(briefId)}/approve`),
    );
  }

  async getGeoAgentReadiness(projectId: string): Promise<GeoAgentReadinessResponse> {
    return this.request<GeoAgentReadinessResponse>("GET", this.geoPath(projectId, "/agent-readiness"));
  }

  async startGeoAgentReadinessScan(projectId: string): Promise<StartGeoAgentReadinessScanResponse> {
    return this.request<StartGeoAgentReadinessScanResponse>("POST", this.geoPath(projectId, "/agent-readiness/scan"));
  }

  async getGeoTrafficOverview(projectId: string, params?: GeoWindowParams): Promise<GeoTrafficOverviewResponse> {
    return this.request<GeoTrafficOverviewResponse>("GET", this.geoPath(projectId, "/traffic/overview"), {
      params,
    });
  }

  async getGeoTrafficLog(projectId: string, params?: GeoTrafficLogParams): Promise<GeoTrafficLogResponse> {
    return this.request<GeoTrafficLogResponse>("GET", this.geoPath(projectId, "/traffic/log"), {
      params: {
        limit: params?.limit,
        visitorTypes: params?.visitorTypes,
        categories: params?.categories,
      },
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

  async getGeoIngestSetup(): Promise<GeoIngestSetupResponse> {
    return this.request<GeoIngestSetupResponse>("GET", "/v1/geo/ingest/setup");
  }

  async issueGeoIngestToken(projectId?: string): Promise<GeoIngestTokenResponse> {
    return this.request<GeoIngestTokenResponse>("POST", "/v1/geo/ingest/token", {
      params: { projectId },
    });
  }

  async rotateGeoIngestToken(projectId?: string): Promise<GeoIngestTokenResponse> {
    return this.request<GeoIngestTokenResponse>("POST", "/v1/geo/ingest/rotate-token", {
      params: { projectId },
    });
  }
}
