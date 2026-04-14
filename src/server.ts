import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import { NotraClient } from "./notra-client.js";
import { brandIdentityIdFilterSchema, contentTypeFilterSchema, statusFilterSchema } from "./post-filters.js";

const scheduleCronConfigSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly"]).describe("How often the schedule should run"),
  hour: z.number().int().min(0).max(23).describe("UTC hour to run at (0-23)"),
  minute: z.number().int().min(0).max(59).describe("UTC minute to run at (0-59)"),
  dayOfWeek: z.number().int().min(0).max(6).optional().describe("UTC weekday for weekly schedules (0=Sunday, 6=Saturday)"),
  dayOfMonth: z.number().int().min(1).max(31).optional().describe("UTC day of month for monthly schedules (1-31)"),
});

const schedulePayloadSchema = {
  name: z.string().min(1).max(120).describe("Schedule name (1-120 characters)"),
  sourceType: z.literal("cron").describe("Schedule trigger type"),
  sourceConfig: z.object({
    cron: scheduleCronConfigSchema,
  }).describe("Cron trigger configuration"),
  targets: z.object({
    repositoryIds: z.array(z.string().min(1)).min(1).describe("Repository IDs to include in the scheduled generation"),
  }).describe("Repositories the schedule should target"),
  outputType: z.enum(["changelog", "blog_post", "linkedin_post", "twitter_post"]).describe("Type of content to generate"),
  outputConfig: z.object({
    publishDestination: z.enum(["webflow", "framer", "custom"]).optional().describe("Where generated content should be published"),
    brandVoiceId: z.string().min(1).optional().describe("Brand voice ID to use for scheduled output"),
  }).optional().describe("Optional publishing and voice settings"),
  enabled: z.boolean().describe("Whether the schedule is active"),
  autoPublish: z.boolean().optional().describe("Whether to auto-publish generated content (default false)"),
  lookbackWindow: z
    .enum(["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"])
    .optional()
    .describe("Time window for gathering data before generation (default: last_7_days)"),
} as const;

function textResult<T>(data: T) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

async function handleError<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();
    return textResult(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      isError: true as const,
      content: [{ type: "text" as const, text: message }],
    };
  }
}

export function createServer(apiKey: string): McpServer {
  const client = new NotraClient(apiKey);

  const server = new McpServer({
    name: "notra",
    version: "1.0.4",
  });

  server.registerTool(
    "list_posts",
    {
      description: "List posts from Notra with optional filters for sorting, pagination, status, content type, and brand identity",
      inputSchema: {
        sort: z.enum(["asc", "desc"]).optional().describe("Sort by creation date"),
        limit: z.number().int().min(1).max(100).optional().describe("Items per page (1-100, default 10)"),
        page: z.number().int().min(1).optional().describe("Page number (default 1)"),
        status: statusFilterSchema,
        contentType: contentTypeFilterSchema,
        brandIdentityId: brandIdentityIdFilterSchema,
      },
    },
    async (params) => {
      return handleError(() =>
        client.listPosts({
          sort: params.sort,
          limit: params.limit,
          page: params.page,
          status: params.status,
          contentType: params.contentType,
          brandIdentityId: params.brandIdentityId,
        })
      );
    }
  );

  server.registerTool(
    "get_post",
    {
      description: "Get a single post by its ID, including full content in HTML and markdown",
      inputSchema: {
        postId: z.string().min(1).describe("The post ID to retrieve"),
      },
    },
    async ({ postId }) => {
      return handleError(() => client.getPost(postId));
    }
  );

  server.registerTool(
    "update_post",
    {
      description: "Update a post's title, markdown content, or publication status",
      inputSchema: {
        postId: z.string().min(1).describe("The post ID to update"),
        title: z.string().min(1).max(120).optional().describe("New title (1-120 characters)"),
        slug: z.string().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional().nullable().describe("New URL slug (lowercase kebab-case)"),
        markdown: z.string().min(1).optional().describe("New markdown content"),
        status: z.enum(["draft", "published"]).optional().describe("Set status to draft or published"),
      },
    },
    async ({ postId, ...body }) => {
      return handleError(() => client.updatePost(postId, body));
    }
  );

  server.registerTool(
    "delete_post",
    {
      description: "Delete a post by its ID",
      inputSchema: {
        postId: z.string().min(1).describe("The post ID to delete"),
      },
    },
    async ({ postId }) => {
      return handleError(() => client.deletePost(postId));
    }
  );

  server.registerTool(
    "generate_post",
    {
      description:
        "Queue an async post generation job. Notra will analyze your GitHub activity and generate content. Use get_post_generation_status to poll for completion.",
      inputSchema: {
        contentType: z
          .enum(["changelog", "blog_post", "linkedin_post", "twitter_post"])
          .describe("Type of content to generate"),
        lookbackWindow: z
          .enum(["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"])
          .optional()
          .describe("Time window for gathering data (default: last_7_days)"),
        brandVoiceId: z.string().min(1).optional().describe("Brand voice ID to use for generation"),
        brandIdentityId: z.string().min(1).optional().nullable().describe("Brand identity ID to use"),
        repositoryIds: z.array(z.string().min(1)).optional().describe("Repository IDs to include. Deprecated; prefer integrations.github."),
        linearIntegrationIds: z.array(z.string().min(1)).optional().describe("Linear integration IDs to include. Deprecated; prefer integrations.linear."),
        integrations: z
          .object({
            github: z.array(z.string().min(1)).min(1).optional().describe("GitHub integration IDs to include"),
            linear: z.array(z.string().min(1)).min(1).optional().describe("Linear integration IDs to include"),
          })
          .optional()
          .describe("Integration IDs to use for generation"),
        github: z
          .object({
            repositories: z
              .array(
                z.object({
                  owner: z.string().describe("GitHub repository owner"),
                  repo: z.string().describe("GitHub repository name"),
                })
              )
              .min(1),
          })
          .optional()
          .describe("GitHub repositories to analyze"),
        dataPoints: z
          .object({
            includePullRequests: z.boolean().optional().describe("Include pull requests (default true)"),
            includeCommits: z.boolean().optional().describe("Include commits (default true)"),
            includeReleases: z.boolean().optional().describe("Include releases (default true)"),
            includeLinearData: z.boolean().optional().describe("Include Linear data (default false)"),
          })
          .optional()
          .describe("Types of data to include in generation"),
        selectedItems: z
          .object({
            commitShas: z.array(z.string()).optional().describe("Specific commit SHAs to include"),
            pullRequestNumbers: z
              .array(
                z.object({
                  repositoryId: z.string(),
                  number: z.number(),
                })
              )
              .optional()
              .describe("Specific pull requests to include"),
            releaseTagNames: z
              .array(z.union([z.string(), z.object({ repositoryId: z.string(), tagName: z.string() })]))
              .optional()
              .describe("Specific release tags to include"),
            linearIssueIds: z
              .array(
                z.object({
                  integrationId: z.string().min(1),
                  issueId: z.string().min(1),
                })
              )
              .optional()
              .describe("Specific Linear issues to include"),
          })
          .optional()
          .describe("Specific items to include in generation"),
      },
    },
    async (params) => {
      return handleError(() => client.generatePost(params));
    }
  );

  server.registerTool(
    "get_post_generation_status",
    {
      description: "Check the status of an async post generation job. Returns job status and event log.",
      inputSchema: {
        jobId: z.string().min(1).describe("The generation job ID to check"),
      },
    },
    async ({ jobId }) => {
      return handleError(() => client.getPostGenerationStatus(jobId));
    }
  );

  server.registerTool(
    "list_brand_identities",
    {
      description: "List all brand identities configured for your organization",
      inputSchema: {},
    },
    async () => {
      return handleError(() => client.listBrandIdentities());
    }
  );

  server.registerTool(
    "get_brand_identity",
    {
      description: "Get a single brand identity by its ID, including tone, audience, and language settings",
      inputSchema: {
        brandIdentityId: z.string().min(1).describe("The brand identity ID to retrieve"),
      },
    },
    async ({ brandIdentityId }) => {
      return handleError(() => client.getBrandIdentity(brandIdentityId));
    }
  );

  server.registerTool(
    "update_brand_identity",
    {
      description: "Update a brand identity's settings including name, tone, audience, language, and more",
      inputSchema: {
        brandIdentityId: z.string().min(1).describe("The brand identity ID to update"),
        name: z.string().min(1).max(120).optional().describe("Brand identity name (1-120 characters)"),
        websiteUrl: z.string().min(1).optional().describe("Website URL"),
        companyName: z.string().min(1).optional().nullable().describe("Company name"),
        companyDescription: z.string().min(10).optional().nullable().describe("Company description (min 10 chars)"),
        toneProfile: z
          .enum(["Conversational", "Professional", "Casual", "Formal"])
          .optional()
          .nullable()
          .describe("Tone profile preset"),
        customTone: z.string().optional().nullable().describe("Custom tone description"),
        customInstructions: z.string().optional().nullable().describe("Custom instructions for content generation"),
        audience: z.string().min(10).optional().nullable().describe("Target audience description (min 10 chars)"),
        language: z
          .enum([
            "English", "Spanish", "French", "German", "Portuguese", "Dutch",
            "Italian", "Japanese", "Korean", "Chinese", "Arabic", "Hindi",
            "Russian", "Turkish", "Polish", "Swedish", "Danish", "Norwegian",
            "Finnish", "Czech", "Romanian", "Hungarian", "Greek", "Thai",
            "Vietnamese", "Indonesian", "Ukrainian", "Hebrew",
          ])
          .optional()
          .nullable()
          .describe("Content language"),
        isDefault: z.literal(true).optional().describe("Set as default brand identity"),
      },
    },
    async ({ brandIdentityId, ...body }) => {
      return handleError(() => client.updateBrandIdentity(brandIdentityId, body));
    }
  );

  server.registerTool(
    "delete_brand_identity",
    {
      description: "Delete a brand identity. Returns any schedules or events that were disabled as a result.",
      inputSchema: {
        brandIdentityId: z.string().min(1).describe("The brand identity ID to delete"),
      },
    },
    async ({ brandIdentityId }) => {
      return handleError(() => client.deleteBrandIdentity(brandIdentityId));
    }
  );

  server.registerTool(
    "generate_brand_identity",
    {
      description:
        "Queue async brand identity generation from a website URL. Notra will scrape the site and extract brand info. Use get_brand_identity_generation_status to poll for completion.",
      inputSchema: {
        websiteUrl: z.string().min(1).describe("Website URL to analyze for brand identity extraction"),
        name: z.string().min(1).max(120).optional().describe("Name for the brand identity (1-120 characters)"),
      },
    },
    async (params) => {
      return handleError(() => client.generateBrandIdentity(params));
    }
  );

  server.registerTool(
    "get_brand_identity_generation_status",
    {
      description: "Check the status of an async brand identity generation job",
      inputSchema: {
        jobId: z.string().min(1).describe("The generation job ID to check"),
      },
    },
    async ({ jobId }) => {
      return handleError(() => client.getBrandIdentityGenerationStatus(jobId));
    }
  );

  server.registerTool(
    "list_integrations",
    {
      description: "List all connected integrations (GitHub, Slack, Linear) for your organization",
      inputSchema: {},
    },
    async () => {
      return handleError(() => client.listIntegrations());
    }
  );

  server.registerTool(
    "create_github_integration",
    {
      description: "Connect a GitHub repository as an integration for content generation",
      inputSchema: {
        owner: z.string().min(1).describe("GitHub repository owner (user or organization)"),
        repo: z.string().min(1).describe("GitHub repository name"),
        branch: z.string().min(1).optional().nullable().describe("Default branch (auto-detected if not set)"),
        token: z.string().min(1).optional().nullable().describe("GitHub personal access token for private repos"),
      },
    },
    async (params) => {
      const body: { owner: string; repo: string; branch?: string; token?: string } = {
        owner: params.owner,
        repo: params.repo,
      };
      if (params.branch) body.branch = params.branch;
      if (params.token) body.token = params.token;
      return handleError(() => client.createGithubIntegration(body));
    }
  );

  server.registerTool(
    "delete_integration",
    {
      description: "Delete a GitHub or Linear integration. Returns any schedules or events that were disabled as a result.",
      inputSchema: {
        integrationId: z.string().min(1).describe("The integration ID to delete"),
      },
    },
    async ({ integrationId }) => {
      return handleError(() => client.deleteIntegration(integrationId));
    }
  );

  server.registerTool(
    "list_schedules",
    {
      description: "List scheduled content generation jobs, optionally filtered by repository IDs",
      inputSchema: {
        repositoryIds: z.array(z.string().min(1)).optional().describe("Only return schedules targeting these repository IDs"),
      },
    },
    async ({ repositoryIds }) => {
      return handleError(() => client.listSchedules({ repositoryIds }));
    }
  );

  server.registerTool(
    "create_schedule",
    {
      description: "Create a content generation schedule using a cron-style daily, weekly, or monthly trigger",
      inputSchema: schedulePayloadSchema,
    },
    async (params) => {
      return handleError(() => client.createSchedule(params));
    }
  );

  server.registerTool(
    "update_schedule",
    {
      description: "Update an existing content generation schedule",
      inputSchema: {
        scheduleId: z.string().min(1).describe("The schedule ID to update"),
        ...schedulePayloadSchema,
      },
    },
    async ({ scheduleId, ...body }) => {
      return handleError(() => client.updateSchedule(scheduleId, body));
    }
  );

  server.registerTool(
    "delete_schedule",
    {
      description: "Delete a content generation schedule by its ID",
      inputSchema: {
        scheduleId: z.string().min(1).describe("The schedule ID to delete"),
      },
    },
    async ({ scheduleId }) => {
      return handleError(() => client.deleteSchedule(scheduleId));
    }
  );

  return server;
}
