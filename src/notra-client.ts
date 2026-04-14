import type {
  ApiErrorResponse,
  BrandIdentityDeleteResponse,
  BrandIdentityGenerationStatusResponse,
  BrandIdentityListResponse,
  BrandIdentityResponse,
  CreateGithubIntegrationRequest,
  CreateGithubIntegrationResponse,
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
  UpdateScheduleRequest,
  UpdateBrandIdentityRequest,
  UpdatePostRequest,
} from "./types.js";

const NOTRA_API_BASE = "https://api.usenotra.com";
const COMMA_SEPARATED_QUERY_PARAMS = new Set(["status", "contentType", "brandIdentityId", "repositoryIds"]);

interface RequestOptions<B = Record<string, string | number | boolean | null | undefined>> {
  params?: Record<string, string | string[] | number | boolean | undefined>;
  body?: B;
}

export class NotraClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = NOTRA_API_BASE) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async request<T, B = undefined>(method: string, path: string, options?: RequestOptions<B>): Promise<T> {
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
      Authorization: `Bearer ${this.apiKey}`,
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
        typeof errorBody?.message === "string" ? errorBody.message :
        typeof errorBody?.error === "string" ? errorBody.error :
        `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return data as T;
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
    return this.request<BrandIdentityResponse, UpdateBrandIdentityRequest>("PATCH", `/v1/brand-identities/${encodeURIComponent(brandIdentityId)}`, { body });
  }

  async deleteBrandIdentity(brandIdentityId: string): Promise<BrandIdentityDeleteResponse> {
    return this.request<BrandIdentityDeleteResponse>("DELETE", `/v1/brand-identities/${encodeURIComponent(brandIdentityId)}`);
  }

  async generateBrandIdentity(body: GenerateBrandIdentityRequest): Promise<GenerateBrandIdentityResponse> {
    return this.request<GenerateBrandIdentityResponse, GenerateBrandIdentityRequest>("POST", "/v1/brand-identities/generate", { body });
  }

  async getBrandIdentityGenerationStatus(jobId: string): Promise<BrandIdentityGenerationStatusResponse> {
    return this.request<BrandIdentityGenerationStatusResponse>("GET", `/v1/brand-identities/generate/${encodeURIComponent(jobId)}`);
  }

  async listIntegrations(): Promise<IntegrationsListResponse> {
    return this.request<IntegrationsListResponse>("GET", "/v1/integrations");
  }

  async createGithubIntegration(body: CreateGithubIntegrationRequest): Promise<CreateGithubIntegrationResponse> {
    return this.request<CreateGithubIntegrationResponse, CreateGithubIntegrationRequest>("POST", "/v1/integrations/github", { body });
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
    return this.request<ScheduleResponse, UpdateScheduleRequest>("PATCH", `/v1/schedules/${encodeURIComponent(scheduleId)}`, { body });
  }

  async deleteSchedule(scheduleId: string): Promise<ScheduleDeleteResponse> {
    return this.request<ScheduleDeleteResponse>("DELETE", `/v1/schedules/${encodeURIComponent(scheduleId)}`);
  }
}
