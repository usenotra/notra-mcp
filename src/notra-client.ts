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
} from "./types.js";
import type { AuthContext } from "./types/auth.js";

const NOTRA_API_BASE = "https://api.usenotra.com";
const COMMA_SEPARATED_QUERY_PARAMS = new Set(["brandIdentityId", "repositoryIds"]);

interface RequestOptions<B = Record<string, string | number | boolean | null | undefined>> {
  params?: Record<string, string | string[] | number | boolean | undefined>;
  body?: B;
}

export class NotraClient {
  private token: string;
  private baseUrl: string;
  private auth?: AuthContext;

  constructor(auth: string | AuthContext, baseUrl: string = NOTRA_API_BASE) {
    this.token = typeof auth === "string" ? auth : auth.token;
    this.baseUrl = baseUrl;
    this.auth = typeof auth === "string" ? undefined : auth;
  }

  private assertScope(method: string, path: string) {
    if (!this.auth || this.auth.kind !== "oauth") {
      return;
    }

    const domain = path.split("/")[2];
    if (!domain) {
      return;
    }

    const access = method === "GET" ? "read" : "write";
    const requiredScope = `${domain}.${access}`;
    const fallbackScope = `api.${access}`;
    const scopes = new Set(this.auth.scopes);

    if (
      scopes.has(requiredScope) ||
      scopes.has(fallbackScope) ||
      scopes.has(`${domain}.*`) ||
      scopes.has("api.*") ||
      scopes.has("mcp") ||
      scopes.has("mcp.*") ||
      scopes.has("*")
    ) {
      return;
    }

    throw new Error(`OAuth token is missing required scope: ${requiredScope}`);
  }

  private async request<T, B = undefined>(method: string, path: string, options?: RequestOptions<B>): Promise<T> {
    this.assertScope(method, path);
    const url = new URL(`${this.baseUrl}${path}`);

    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
          if (COMMA_SEPARATED_QUERY_PARAMS.has(key)) {
            url.searchParams.set(key, value.join(","));
            continue;
          }

          for (const entry of value) {
            url.searchParams.append(key, entry);
          }
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const fetchOptions: RequestInit = { method, headers };
    if (options?.body && (method === "POST" || method === "PATCH" || method === "PUT")) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url.toString(), fetchOptions);

    let data: T | ApiErrorResponse;
    try {
      data = await response.json();
    } catch {
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
    this.assertScope(method, path);
    const url = new URL(`${this.baseUrl}${path}`);

    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value === undefined) continue;
        url.searchParams.set(key, String(value));
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream, application/json",
    };

    const fetchOptions: RequestInit = { method, headers };
    if (options?.body && (method === "POST" || method === "PATCH" || method === "PUT")) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url.toString(), fetchOptions);
    const text = await response.text();

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

    return {
      chatId: response.headers.get("x-chat-id"),
      stream: text,
    };
  }

  async listPosts(params?: ListPostsParams): Promise<PostListResponse> {
    return this.request<PostListResponse>("GET", "/v1/posts", {
      params: params as RequestOptions["params"],
    });
  }

  async getPost(postId: string): Promise<PostResponse> {
    return this.request<PostResponse>("GET", `/v1/posts/${encodeURIComponent(postId)}`);
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
    return this.request<BrandIdentityResponse>("GET", `/v1/brand-identities/${encodeURIComponent(brandIdentityId)}`);
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
      params: params as RequestOptions["params"],
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
}
