import type { JSONSchema } from "zod/v4/core";

export type ApiOperationId =
  | "acceptGeoPromptSuggestion"
  | "approveGeoContentBrief"
  | "archiveGeoPersona"
  | "cancelPostSchedule"
  | "createAgentSession"
  | "createBrandColor"
  | "createBrandIdentity"
  | "createEventTrigger"
  | "createGeoPrompt"
  | "createGeoPromptScan"
  | "createGeoScan"
  | "createGeoSequence"
  | "createGitHubIntegration"
  | "createPost"
  | "createPostGeneration"
  | "createPostPullRequest"
  | "createProject"
  | "createSchedule"
  | "createSitePostPreview"
  | "createSkill"
  | "createWebhookEndpoint"
  | "deleteBrandColor"
  | "deleteBrandIdentity"
  | "deleteEventTrigger"
  | "deleteGeoCompetitor"
  | "deleteGeoPrompt"
  | "deleteGeoSequence"
  | "deleteIntegration"
  | "deletePost"
  | "deleteProject"
  | "deleteSchedule"
  | "deleteSiteAuthor"
  | "deleteSkill"
  | "deleteWebhookEndpoint"
  | "dismissGeoPromptSuggestion"
  | "generateGeoPersonas"
  | "getBrandIdentity"
  | "getBrandIdentityGeneration"
  | "getChat"
  | "getChatByExternalChannel"
  | "getEventTrigger"
  | "getFeedback"
  | "getGeoAgentReadiness"
  | "getGeoContentBrief"
  | "getGeoIngestSetup"
  | "getGeoMcpAnalytics"
  | "getGeoMcpToolDetail"
  | "getGeoPersonaActivity"
  | "getGeoPersonaGeneration"
  | "getGeoPersonaResults"
  | "getGeoPromptHistory"
  | "getGeoPromptResultDetail"
  | "getGeoScan"
  | "getGeoSentiment"
  | "getGeoSentimentAnalysis"
  | "getGeoSettings"
  | "getGeoTrafficJourney"
  | "getGeoTrafficJourneyStats"
  | "getGeoTrafficLog"
  | "getGeoTrafficOverview"
  | "getGeoVisibilityCompetitorDetail"
  | "getGeoVisibilityCompetitorShare"
  | "getGeoVisibilityLanguageShare"
  | "getGeoVisibilityOverview"
  | "getGeoVisibilityPromptResults"
  | "getGeoVisibilityTimeseries"
  | "getGeoWebAnalytics"
  | "getGeoWebAnalyticsBreakdowns"
  | "getGeoWebAnalyticsUtm"
  | "getGitHubActivity"
  | "getPost"
  | "getPostAgentReach"
  | "getPostGeneration"
  | "getPostSchedule"
  | "getProject"
  | "getPublicApiStatus"
  | "getSite"
  | "getSiteDeployment"
  | "getSitePostPreview"
  | "getSkill"
  | "getWebhookDelivery"
  | "getWorkspaces"
  | "importGeoCompetitors"
  | "importGeoPrompts"
  | "importSiteAuthors"
  | "issueGeoIngestToken"
  | "listAgentChats"
  | "listBrandColors"
  | "listBrandIdentities"
  | "listChats"
  | "listEventTriggers"
  | "listFeedback"
  | "listGeoAnalyticsImports"
  | "listGeoChanges"
  | "listGeoCompetitors"
  | "listGeoContentBriefs"
  | "listGeoContentGaps"
  | "listGeoEngines"
  | "listGeoPersonas"
  | "listGeoPromptResultSummaries"
  | "listGeoPrompts"
  | "listGeoPromptSuggestions"
  | "listGeoScans"
  | "listGeoSentimentEvidence"
  | "listGeoSequences"
  | "listGeoShelfSources"
  | "listGeoTrafficJourneys"
  | "listGeoTrafficPages"
  | "listIntegrations"
  | "listPostAuthors"
  | "listPosts"
  | "listProjects"
  | "listScheduleRuns"
  | "listSchedules"
  | "listSiteAuthors"
  | "listSiteDeployments"
  | "listSites"
  | "listSkills"
  | "listWebhookDeliveries"
  | "listWebhookEndpoints"
  | "patchSkill"
  | "planGeoContentBrief"
  | "publishPostToSite"
  | "publishSite"
  | "redeploySiteDeployment"
  | "restoreGeoPersona"
  | "retryWebhookDelivery"
  | "rotateGeoIngestToken"
  | "runGeoPersona"
  | "runGeoSequence"
  | "runSchedule"
  | "schedulePost"
  | "sendAgentSessionMessage"
  | "startGeoAgentReadinessScan"
  | "startSiteDeployment"
  | "submitFeedback"
  | "submitOrganizationFeedback"
  | "suggestGeoCompetitors"
  | "updateBrandColor"
  | "updateBrandIdentity"
  | "updateEventTrigger"
  | "updateFeedback"
  | "updateGeoContentBrief"
  | "updateGeoContentGap"
  | "updateGeoPersona"
  | "updateGeoPrompt"
  | "updateGeoSequence"
  | "updateGeoSettings"
  | "updatePost"
  | "updateProject"
  | "updateSchedule"
  | "updateSiteAuthorPage"
  | "updateSiteSections"
  | "upsertGeoCompetitor"
  | "upsertSiteAuthor";

export const API_RESPONSE_SCHEMAS: Record<ApiOperationId, JSONSchema.BaseSchema> = {
  acceptGeoPromptSuggestion: {
    type: "object",
    properties: {
      prompt: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description:
              "Use as `promptId` in the prompt endpoints, including `GET /v1/projects/{projectId}/geo/prompts/{promptId}/history`. A UUID for custom prompts, a fixed slug such as `best-tools` for auto prompts.",
          },
          prompt: { type: "string" },
          enabled: { type: "boolean", description: "Whether project scans ask this prompt." },
          source: {
            type: "string",
            enum: ["custom", "auto"],
            description:
              "`custom` for prompts added by the user, `auto` for prompts Notra generates from the brand settings.",
          },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Labels on custom prompts. Always empty for auto prompts.",
          },
          createdAt: {
            type: ["string", "null"],
            description: "When the custom prompt was added. `null` for auto prompts.",
          },
        },
        required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["prompt", "organization"],
  },
  approveGeoContentBrief: {
    type: "object",
    properties: {
      runId: {
        type: "string",
        description: "Writer run started for the brief. Poll getGeoContentBrief for status and postId.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["runId", "organization"],
  },
  archiveGeoPersona: {
    type: "object",
    properties: {
      id: { type: "string", description: "Id of the archived persona." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["id", "organization"],
  },
  cancelPostSchedule: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      canceled: { type: "integer", description: "Destinations that were canceled or cleared." },
      inProgress: {
        type: "boolean",
        description: "True when a destination was already publishing; it cannot be stopped and finishes on its own.",
      },
    },
    required: ["organization", "canceled", "inProgress"],
  },
  createAgentSession: {
    type: "object",
    properties: { ok: { type: "boolean", enum: [true] }, sessionId: { type: "string" } },
    required: ["ok", "sessionId"],
  },
  createBrandColor: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      color: {
        type: "object",
        properties: {
          id: { type: "string", description: "Pass as colorId to update or delete the color." },
          role: {
            type: "string",
            enum: ["primary", "secondary", "accent", "background", "foreground", "neutral", "custom"],
          },
          name: { type: ["string", "null"] },
          lightValue: { type: "string", description: "Hex color for light mode." },
          darkValue: {
            type: ["string", "null"],
            description: "Hex color for dark mode. Null when the color has no dark variant.",
          },
          usage: { type: ["string", "null"], description: "Free-text note on where the color should be used." },
        },
        required: ["id", "role", "name", "lightValue", "darkValue", "usage"],
      },
    },
    required: ["organization", "color"],
  },
  createBrandIdentity: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      job: {
        type: "object",
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          brandIdentityId: {
            type: "string",
            description:
              "ID of the brand identity being analyzed. The identity is created immediately and its details are filled in as the job completes.",
          },
          status: {
            type: "string",
            enum: ["queued", "running", "completed", "failed"],
            description: "Job state. Stop polling once it is completed or failed.",
          },
          step: {
            type: ["string", "null"],
            enum: ["scraping", "extracting", "saving", null],
            description: "Current analysis step while the job is running.",
          },
          currentStep: {
            type: "integer",
            minimum: 0,
            description: "Progress through the analysis, out of totalSteps.",
          },
          totalSteps: { type: "integer", minimum: 1 },
          workflowRunId: {
            type: ["string", "null"],
            description: "Internal workflow run ID. Null until the analysis workflow has started.",
          },
          error: { type: ["string", "null"], description: "Failure reason when status is failed." },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          completedAt: {
            type: ["string", "null"],
            description: "When the job completed or failed. Null while it is queued or running.",
          },
        },
        required: [
          "id",
          "organizationId",
          "brandIdentityId",
          "status",
          "step",
          "currentStep",
          "totalSteps",
          "workflowRunId",
          "error",
          "createdAt",
          "updatedAt",
          "completedAt",
        ],
      },
    },
    required: ["organization", "job"],
  },
  createEventTrigger: {
    type: "object",
    properties: {
      eventTrigger: {
        type: "object",
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          name: {
            type: "string",
            description:
              'Event triggers cannot be named through the API or the dashboard, so this is the default "Untitled Schedule".',
          },
          sourceType: { type: "string", enum: ["github_webhook"] },
          sourceConfig: {
            type: "object",
            properties: {
              eventTypes: {
                type: "array",
                items: { type: "string", enum: ["release", "push"] },
                minItems: 1,
                description: "GitHub webhook events that start a run: published releases, pushes, or both.",
              },
              includePreReleases: {
                type: "boolean",
                default: true,
                description: "Whether releases marked as pre-releases on GitHub also start a run.",
              },
              ignoreCommitPatterns: {
                type: "array",
                items: { type: "string", minLength: 1, maxLength: 120 },
                maxItems: 10,
                default: [],
                description:
                  "Case-insensitive JavaScript regular expressions tested against each commit message of a push, matching anywhere unless anchored. A push is skipped only when every commit matches at least one pattern. Releases are not filtered.",
              },
            },
            required: ["eventTypes"],
          },
          targets: {
            type: "object",
            properties: {
              repositoryIds: {
                type: "array",
                items: { type: "string", minLength: 1 },
                minItems: 1,
                description:
                  "GitHub integration IDs whose webhook events start the trigger, as returned in the github array of GET /v1/integrations.",
              },
            },
            required: ["repositoryIds"],
          },
          outputType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
          outputConfig: {
            type: ["object", "null"],
            properties: {
              publishDestination: {
                type: "string",
                enum: ["webflow", "framer", "custom"],
                description:
                  "Deprecated and ignored. Auto-published posts are only marked as published in Notra; publish to GitHub or a Notra site from the post instead.",
                deprecated: true,
              },
              brandVoiceId: {
                type: "string",
                minLength: 1,
                description:
                  "Brand identity ID to write in. Falls back to the organization's default brand identity when unset or not found.",
              },
              notify: {
                type: "object",
                properties: { slack: { type: "boolean" }, email: { type: "boolean" } },
                required: ["slack", "email"],
                description:
                  "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
              },
            },
          },
          enabled: {
            type: "boolean",
            description: "Whether matching GitHub events start runs. Disabled triggers are stored but ignored.",
          },
          autoPublish: {
            type: "boolean",
            description:
              "Save generated changelogs and blog posts with status published instead of draft. This only marks them published in Notra; nothing is pushed to GitHub or a Notra site. Other output types always stay drafts.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "organizationId",
          "name",
          "sourceType",
          "sourceConfig",
          "targets",
          "outputType",
          "enabled",
          "autoPublish",
          "createdAt",
          "updatedAt",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["eventTrigger", "organization"],
  },
  createGeoPrompt: {
    type: "object",
    properties: {
      prompt: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description:
              "Use as `promptId` in the prompt endpoints, including `GET /v1/projects/{projectId}/geo/prompts/{promptId}/history`. A UUID for custom prompts, a fixed slug such as `best-tools` for auto prompts.",
          },
          prompt: { type: "string" },
          enabled: { type: "boolean", description: "Whether project scans ask this prompt." },
          source: {
            type: "string",
            enum: ["custom", "auto"],
            description:
              "`custom` for prompts added by the user, `auto` for prompts Notra generates from the brand settings.",
          },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Labels on custom prompts. Always empty for auto prompts.",
          },
          createdAt: {
            type: ["string", "null"],
            description: "When the custom prompt was added. `null` for auto prompts.",
          },
        },
        required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["prompt", "organization"],
  },
  createGeoPromptScan: {
    type: "object",
    properties: {
      scanId: {
        type: "string",
        description:
          "Id of the queued scan, readable right away via `GET /v1/projects/{projectId}/geo/scans/{scanId}`.",
      },
      statusUrl: {
        type: "string",
        description:
          "Relative URL of that scan, also sent as the `Location` header. Poll it until `status` leaves `running`.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["scanId", "statusUrl", "organization"],
  },
  createGeoScan: {
    type: "object",
    properties: {
      scanId: {
        type: "string",
        description:
          "Id of the queued scan, readable right away via `GET /v1/projects/{projectId}/geo/scans/{scanId}`.",
      },
      statusUrl: {
        type: "string",
        description:
          "Relative URL of that scan, also sent as the `Location` header. Poll it until `status` leaves `running`.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["scanId", "statusUrl", "organization"],
  },
  createGeoSequence: {
    type: "object",
    properties: {
      sequence: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          steps: {
            type: "array",
            items: { type: "string" },
            description: "Messages sent in order as one conversation with each engine.",
          },
          enabled: { type: "boolean", description: "Whether project scans play this conversation." },
          createdAt: { type: "string" },
        },
        required: ["id", "name", "steps", "enabled", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["sequence", "organization"],
  },
  createGitHubIntegration: {
    type: "object",
    properties: {
      github: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description:
              "GitHub integration ID. Use it in integrations.github for post generation, as integrationId for post pull requests and as repositoryId for scheduled GitHub publishing.",
          },
          displayName: {
            type: "string",
            description: "Label for the repository, owner/repo when created through the API.",
          },
          owner: {
            type: ["string", "null"],
            description:
              "Repository owner (user or organization). Null only for integrations connected before Notra stored the owner and repository name on the integration; every connection path sets both today.",
          },
          repo: {
            type: ["string", "null"],
            description: "Repository name without the owner. Null under the same condition as owner.",
          },
          defaultBranch: {
            type: ["string", "null"],
            description: "Branch Notra reads activity from. Null means the repository's default branch on GitHub.",
          },
        },
        required: ["id", "displayName", "owner", "repo", "defaultBranch"],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["github", "organization"],
  },
  createPost: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      post: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: {
            type: ["string", "null"],
            description: "URL slug. Only blog posts and changelogs have one; null when none is set.",
          },
          content: {
            type: "string",
            description:
              "Rendered HTML for text posts. For image posts, this is the public CDN URL of the rendered image.",
          },
          htmlUrl: {
            type: ["string", "null"],
            description: "Public CDN URL of the generated HTML artifact for image posts. Null for non-image posts.",
          },
          markdown: { type: ["string", "null"], description: "Markdown source for text posts. Null for image posts." },
          rawHtml: {
            type: ["string", "null"],
            description:
              "Legacy inline generated HTML for image posts. New generated image HTML is stored as htmlUrl. Null for non-image posts.",
          },
          recommendations: {
            type: ["string", "null"],
            description:
              "Publishing suggestions written by the generator as Markdown, such as when and where to share the post. Null when there are none.",
          },
          contentType: {
            type: "string",
            enum: ["changelog", "linkedin_post", "twitter_post", "blog_post", "investor_update", "image"],
          },
          sourceMetadata: {
            description:
              "Free-form JSON recorded by whatever produced the post, such as a generation run or chat. Null for posts created with POST /v1/posts. Posts from generation runs (POST /v1/posts/generate, schedules, event triggers and GEO content briefs) include brandVoiceId, the brand identity the run wrote in (absent when the workspace had none), which the brandIdentityId filter of GET /v1/posts reads.",
          },
          metadata: {
            type: ["object", "null"],
            properties: {
              coverImage: {
                type: ["object", "null"],
                properties: {
                  url: {
                    type: "string",
                    description:
                      "Absolute https URL, or a path to an image uploaded in Notra (starting with /api/uploads/).",
                  },
                  alt: { type: "string", description: "Alt text. Empty string when none is set." },
                },
                required: ["url", "alt"],
                description: "Cover image shown on post cards and social previews.",
              },
              tags: { type: "array", items: { type: "string" } },
              excerpt: {
                type: ["string", "null"],
                description:
                  "Summary shown on post cards and in meta descriptions. Null means it is derived from the first paragraph.",
              },
              authors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    slug: {
                      type: "string",
                      description: "Stable author handle; hosted sites list the author's posts at /author/{slug}.",
                    },
                    name: { type: "string" },
                    title: { type: ["string", "null"] },
                    avatarUrl: { type: ["string", "null"] },
                    url: { type: ["string", "null"], description: "Author's website." },
                    x: { type: ["string", "null"] },
                    linkedin: { type: ["string", "null"] },
                    github: { type: ["string", "null"] },
                    youtube: { type: ["string", "null"] },
                    bluesky: { type: ["string", "null"] },
                    mastodon: { type: ["string", "null"] },
                    threads: { type: ["string", "null"] },
                    instagram: { type: ["string", "null"] },
                  },
                  required: [
                    "id",
                    "slug",
                    "name",
                    "title",
                    "avatarUrl",
                    "url",
                    "x",
                    "linkedin",
                    "github",
                    "youtube",
                    "bluesky",
                    "mastodon",
                    "threads",
                    "instagram",
                  ],
                },
                description:
                  "Credited authors in display order. Authors deleted since they were assigned are omitted. On blog posts that publish to a Notra Sites site, authors whose id starts with site: come from the site's blog.json, unpublished Design changes included.",
              },
              featured: { type: "boolean", description: "Pinned to the top of the blog index on hosted sites." },
              noindex: {
                type: "boolean",
                description: "Asks search engines not to index the post and leaves it out of the sitemap.",
              },
              hidden: {
                type: "boolean",
                description:
                  "Reachable by direct link, but excluded from hosted site listings, feeds, search engine indexing, sitemaps and generated AI indexes. Not private.",
              },
              displayDate: {
                type: ["string", "null"],
                description: "Date shown on the post as YYYY-MM-DD. Null means the publish date is used.",
              },
            },
            required: ["coverImage", "tags", "excerpt", "authors", "featured", "noindex", "hidden", "displayDate"],
            description:
              "Cover image, tags, excerpt, authors and other site metadata. Set for blog posts and changelogs, null for every other content type.",
          },
          status: { type: "string", enum: ["draft", "published"] },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "title",
          "slug",
          "content",
          "htmlUrl",
          "markdown",
          "rawHtml",
          "recommendations",
          "contentType",
          "metadata",
          "status",
          "createdAt",
          "updatedAt",
        ],
      },
    },
    required: ["organization", "post"],
  },
  createPostGeneration: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      job: {
        type: "object",
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          status: {
            type: "string",
            enum: ["queued", "running", "completed", "failed", "skipped"],
            description: "Job state. Terminal states are completed, failed, and skipped.",
          },
          contentType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
          lookbackWindow: {
            type: "string",
            enum: ["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"],
          },
          repositoryIds: {
            type: "array",
            items: { type: "string" },
            description:
              "Selected GitHub integration IDs. Empty when no GitHub source was selected. Every connected GitHub integration is used only when neither a GitHub nor a Linear source was selected.",
          },
          brandVoiceId: {
            type: ["string", "null"],
            description:
              "Brand identity the post is written in: the requested one, else the default, else the most recently updated. Null when the organization has none.",
          },
          workflowRunId: {
            type: ["string", "null"],
            description: "Internal workflow run ID. Null until the generation workflow has started.",
          },
          postId: {
            type: ["string", "null"],
            description: "ID of the generated post. Set once the job reaches completed.",
          },
          error: {
            type: ["string", "null"],
            description:
              "Failure reason when status is failed, or why generation was skipped (for example no meaningful source activity) when status is skipped.",
          },
          errorCode: {
            type: ["string", "null"],
            description:
              "Stable machine-readable failure code when status is failed, such as NO_ACTIVITY_TYPES_SELECTED or NO_AVAILABLE_SOURCES. Absent or null for other failures and for older jobs.",
          },
          source: { type: "string", enum: ["api", "dashboard"], description: "Where the job was started." },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          completedAt: {
            type: ["string", "null"],
            description: "When the job reached completed, failed or skipped. Null while it is queued or running.",
          },
        },
        required: [
          "id",
          "organizationId",
          "status",
          "contentType",
          "lookbackWindow",
          "repositoryIds",
          "brandVoiceId",
          "workflowRunId",
          "postId",
          "error",
          "source",
          "createdAt",
          "updatedAt",
          "completedAt",
        ],
      },
    },
    required: ["organization", "job"],
  },
  createPostPullRequest: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      pullRequest: {
        type: "object",
        properties: {
          number: { type: "integer", exclusiveMinimum: 0 },
          url: { type: "string", format: "uri" },
          branchName: { type: "string", description: "Head branch of the pull request." },
          path: { type: "string", description: "Repository path of the post file on the branch." },
          operation: {
            type: "string",
            enum: ["created", "updated"],
            description:
              "created for a new draft pull request, updated when the post's open pull request was refreshed instead.",
          },
        },
        required: ["number", "url", "branchName", "path", "operation"],
      },
    },
    required: ["organization", "pullRequest"],
  },
  createProject: {
    type: "object",
    properties: {
      project: {
        type: "object",
        properties: {
          id: { type: "string", description: "Use as projectId in the endpoints under /v1/projects/{projectId}." },
          name: { type: "string" },
          brandSettingsId: {
            type: "string",
            description: "ID of the brand identity linked to the project, as listed by GET /v1/brand-identities.",
          },
          createdAt: { type: "string" },
        },
        required: ["id", "name", "brandSettingsId", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["project", "organization"],
  },
  createSchedule: {
    type: "object",
    properties: {
      schedule: {
        type: "object",
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          name: { type: "string" },
          sourceType: { type: "string", enum: ["cron"] },
          sourceConfig: {
            type: "object",
            properties: {
              cron: {
                type: "object",
                properties: {
                  frequency: {
                    type: "string",
                    enum: ["daily", "weekly", "monthly", "custom"],
                    description: "How often the schedule runs.",
                  },
                  hour: {
                    type: "integer",
                    minimum: 0,
                    maximum: 23,
                    description: "Hour of the day to run, in UTC (0-23).",
                  },
                  minute: {
                    type: "integer",
                    minimum: 0,
                    maximum: 59,
                    description: "Minute of the hour to run (0-59).",
                  },
                  dayOfWeek: {
                    type: "integer",
                    minimum: 0,
                    maximum: 6,
                    description:
                      "Day of the week for weekly schedules, 0 (Sunday) to 6 (Saturday). Required when frequency is weekly.",
                  },
                  dayOfMonth: {
                    type: "integer",
                    minimum: 1,
                    maximum: 31,
                    description:
                      "Day of the month for monthly schedules (1-31). Required when frequency is monthly. Months without that day are skipped, so 31 runs only in 31-day months.",
                  },
                  intervalDays: {
                    type: "integer",
                    minimum: 2,
                    maximum: 90,
                    description: "Run every N days (2-90). Required when frequency is custom.",
                  },
                  anchorDate: {
                    type: "string",
                    pattern: "^\\d{4}-\\d{2}-\\d{2}$",
                    description: "UTC calendar date (YYYY-MM-DD) a custom interval counts from. Defaults to today.",
                  },
                },
                required: ["frequency", "hour", "minute"],
              },
            },
            required: ["cron"],
          },
          targets: {
            type: "object",
            properties: {
              repositoryIds: {
                type: "array",
                items: { type: "string" },
                description:
                  "GitHub integration IDs to generate from, as returned in the github array of GET /v1/integrations.",
              },
              linearIntegrationIds: {
                type: "array",
                items: { type: "string" },
                description:
                  "Linear integration IDs to generate from, as returned in the linear array of GET /v1/integrations. When omitted, runs read every enabled Linear integration; send [] to read none.",
              },
            },
            required: ["repositoryIds"],
          },
          outputType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
          outputConfig: {
            type: ["object", "null"],
            properties: {
              publishDestination: {
                type: "string",
                enum: ["webflow", "framer", "custom"],
                description:
                  "Deprecated and ignored. Auto-published posts are only marked as published in Notra; publish to GitHub or a Notra site from the post instead.",
                deprecated: true,
              },
              brandVoiceId: {
                type: "string",
                minLength: 1,
                description: "Brand identity ID to write in. Defaults to the organization's default brand identity.",
              },
              instructions: {
                type: "string",
                minLength: 1,
                maxLength: 2000,
                description:
                  "Free-text brief for this schedule, passed to the writer on every run on top of the brand's custom instructions. Use it to steer the angle of the content, for example tutorial-style blog posts.",
              },
              notify: {
                type: "object",
                properties: { slack: { type: "boolean" }, email: { type: "boolean" } },
                required: ["slack", "email"],
                description:
                  "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
              },
            },
          },
          enabled: {
            type: "boolean",
            description: "Whether the schedule runs. Disabled schedules are stored but never fire.",
          },
          autoPublish: {
            type: "boolean",
            description:
              "Save generated changelogs and blog posts with status published instead of draft. This only marks them published in Notra; nothing is pushed to GitHub or a Notra site. Other output types always stay drafts.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          lookbackWindow: {
            type: "string",
            enum: ["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"],
            description: "How far back each run collects source activity.",
          },
        },
        required: [
          "id",
          "organizationId",
          "name",
          "sourceType",
          "sourceConfig",
          "targets",
          "outputType",
          "enabled",
          "autoPublish",
          "createdAt",
          "updatedAt",
          "lookbackWindow",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["schedule", "organization"],
  },
  createSitePostPreview: {
    type: "object",
    properties: {
      preview: {
        anyOf: [
          {
            type: "object",
            properties: {
              status: { type: "string", description: "Status of the preview's latest build." },
              live: { type: "boolean", description: "The preview is being served and has not expired." },
              deleting: { type: "boolean", description: "The preview is being removed." },
              errorMessage: { type: ["string", "null"], description: "Why the latest build failed or stopped." },
              expiresAt: { type: "string", description: "When the preview stops being served." },
              hasPassword: {
                type: "boolean",
                description: "People outside the workspace can open it with a password.",
              },
              url: { type: "string", description: "The post's page on the preview." },
            },
            required: ["status", "live", "deleting", "errorMessage", "expiresAt", "hasPassword", "url"],
          },
          { type: "null" },
        ],
        description: "Null when the post has no preview on this Site.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["preview", "organization"],
  },
  createSkill: {
    type: "object",
    properties: {
      skill: {
        allOf: [
          {
            type: "object",
            properties: {
              id: { type: "string" },
              name: {
                type: "string",
                description: "Unique within the organization. Use it as {name} in /v1/skills/{name}.",
              },
              description: { type: "string", description: "Short description of when the skill should be used." },
              isSystem: {
                type: "boolean",
                description:
                  "True for built-in skills provided by Notra. System skills can be edited but not renamed or deleted.",
              },
              updatedAt: { type: "string" },
            },
            required: ["id", "name", "description", "isSystem", "updatedAt"],
          },
          {
            type: "object",
            properties: {
              content: { type: "string", description: "Full skill instructions, typically Markdown." },
              createdAt: { type: "string" },
            },
            required: ["content", "createdAt"],
          },
        ],
      },
    },
    required: ["skill"],
  },
  createWebhookEndpoint: {
    type: "object",
    properties: {
      endpoint: {
        type: "object",
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          url: { type: "string", description: "HTTPS URL that receives signed POST requests." },
          events: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "post.generation.completed",
                "post.generation.failed",
                "post.generation.skipped",
                "brand_identity.generation.completed",
                "brand_identity.generation.failed",
                "post.published",
                "post.created",
                "post.updated",
                "post.deleted",
                "post.unpublished",
                "geo.scan.completed",
                "geo.scan.failed",
                "geo.alert.triggered",
              ],
            },
            description: "Event types delivered to this endpoint.",
          },
          enabled: { type: "boolean", description: "Disabled endpoints receive no deliveries." },
          createdAt: { type: "string" },
        },
        required: ["id", "organizationId", "url", "events", "enabled", "createdAt"],
      },
      secret: {
        type: "string",
        description:
          "Signing secret, starting with whsec_. Returned only here; use it to verify the x-notra-signature header on each request.",
      },
    },
    required: ["endpoint", "secret"],
  },
  deleteBrandColor: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      id: { type: "string" },
    },
    required: ["organization", "id"],
  },
  deleteBrandIdentity: {
    type: "object",
    properties: {
      id: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      disabledSchedules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Automation trigger ID." },
            name: {
              type: "string",
              description: 'Trigger name. Event triggers always have the default "Untitled Schedule".',
            },
          },
          required: ["id", "name"],
        },
        description:
          "Schedules that targeted the deleted resource. They are kept but set to enabled: false and stop running. IDs work with the /v1/schedules endpoints.",
      },
      disabledEvents: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Automation trigger ID." },
            name: {
              type: "string",
              description: 'Trigger name. Event triggers always have the default "Untitled Schedule".',
            },
          },
          required: ["id", "name"],
        },
        description:
          "Event triggers that targeted the deleted resource. They are kept but set to enabled: false and ignore GitHub events. IDs work with the /v1/event-triggers endpoints.",
      },
    },
    required: ["id", "organization", "disabledSchedules", "disabledEvents"],
  },
  deleteEventTrigger: {
    type: "object",
    properties: {
      id: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["id", "organization"],
  },
  deleteGeoCompetitor: {
    type: "object",
    properties: {
      competitors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "Competitor id. Competitors carried over from older settings use `legacy:` plus the lowercased name. Endpoints address competitors by `name`, not id.",
            },
            name: { type: "string", description: "Competitor name. Unique per project, compared case-insensitively." },
            domain: {
              type: ["string", "null"],
              description: "Competitor website domain, used to recognize citations of its site. `null` when unknown.",
            },
            synonyms: {
              type: "array",
              items: { type: "string" },
              description: "Alternate names counted as this competitor in answers.",
            },
            kind: {
              type: "string",
              enum: ["direct", "indirect"],
              description:
                "Your own label for the competitor: direct or indirect. Only shown as a label; mentions, share of voice and gaps count both kinds the same way.",
            },
            color: {
              type: ["string", "null"],
              description: "Custom chart color, or `null` to use the default palette.",
            },
          },
          required: ["id", "name", "domain", "synonyms", "kind", "color"],
        },
        description: "Tracked competitors, oldest first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["competitors", "organization"],
  },
  deleteGeoPrompt: {
    type: "object",
    properties: {
      id: { type: "string", description: "Id of the deleted prompt." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["id", "organization"],
  },
  deleteGeoSequence: {
    type: "object",
    properties: {
      id: { type: "string", description: "Id of the deleted sequence." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["id", "organization"],
  },
  deleteIntegration: {
    type: "object",
    properties: {
      id: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      disabledSchedules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Automation trigger ID." },
            name: {
              type: "string",
              description: 'Trigger name. Event triggers always have the default "Untitled Schedule".',
            },
          },
          required: ["id", "name"],
        },
        description:
          "Schedules that targeted the deleted resource. They are kept but set to enabled: false and stop running. IDs work with the /v1/schedules endpoints.",
      },
      disabledEvents: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Automation trigger ID." },
            name: {
              type: "string",
              description: 'Trigger name. Event triggers always have the default "Untitled Schedule".',
            },
          },
          required: ["id", "name"],
        },
        description:
          "Event triggers that targeted the deleted resource. They are kept but set to enabled: false and ignore GitHub events. IDs work with the /v1/event-triggers endpoints.",
      },
    },
    required: ["id", "organization", "disabledSchedules", "disabledEvents"],
  },
  deletePost: {
    type: "object",
    properties: {
      id: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["id", "organization"],
  },
  deleteProject: {
    type: "object",
    properties: {
      id: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["id", "organization"],
  },
  deleteSchedule: {
    type: "object",
    properties: {
      id: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["id", "organization"],
  },
  deleteSiteAuthor: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: { id: { type: "string" }, name: { type: "string" } },
        required: ["id", "name"],
      },
      authors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            ref: {
              type: "string",
              description:
                "Pass this in metadata.authorIds of PATCH /v1/posts/{postId} to credit the author on a blog post that publishes to this site.",
            },
            name: { type: "string" },
            title: { type: ["string", "null"] },
            bio: { type: ["string", "null"] },
            avatar: {
              type: ["string", "null"],
              description: "As written in blog.json: a site path such as /images/jane.png or an https URL.",
            },
            avatarUrl: { type: ["string", "null"], description: "The avatar as a full URL on the live site." },
            url: { type: ["string", "null"] },
            x: { type: ["string", "null"] },
            linkedin: { type: ["string", "null"] },
            github: { type: ["string", "null"] },
            youtube: { type: ["string", "null"] },
            bluesky: { type: ["string", "null"] },
            mastodon: { type: ["string", "null"] },
            threads: { type: ["string", "null"] },
            instagram: { type: ["string", "null"] },
            live: {
              type: "boolean",
              description:
                "The author is in the published blog.json. False while it only exists in unpublished changes.",
            },
            posts: { type: "integer", description: "Notra blog posts on this site that credit the author." },
          },
          required: [
            "id",
            "ref",
            "name",
            "title",
            "bio",
            "avatar",
            "avatarUrl",
            "url",
            "x",
            "linkedin",
            "github",
            "youtube",
            "bluesky",
            "mastodon",
            "threads",
            "instagram",
            "live",
            "posts",
          ],
        },
        description: "Authors in blog.json order, including unpublished changes.",
      },
      authorPage: {
        type: "string",
        enum: ["inline", "stacked"],
        description: "Layout of every author page: inline puts the avatar beside the name, stacked puts it above.",
      },
      hasUnpublishedChanges: {
        type: "boolean",
        description:
          "blog.json has staged Design changes that are not live yet. Publish them with POST /v1/sites/{siteId}/publish or from the dashboard.",
      },
    },
    required: ["site", "authors", "authorPage", "hasUnpublishedChanges"],
  },
  deleteSkill: { type: "object", properties: { success: { type: "boolean", enum: [true] } }, required: ["success"] },
  deleteWebhookEndpoint: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
  dismissGeoPromptSuggestion: {
    type: "object",
    properties: {
      id: { type: "string" },
      dismissed: {
        type: "boolean",
        description: "Always `true`. Dismissing an unknown or already handled suggestion returns 404.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["id", "dismissed", "organization"],
  },
  generateGeoPersonas: {
    type: "object",
    properties: {
      job: {
        type: ["object", "null"],
        properties: {
          id: { type: "string" },
          status: { type: "string", enum: ["queued", "running", "completed", "failed"] },
          personaId: {
            type: ["string", "null"],
            description: "Persona being regenerated, or `null` when the job creates new personas.",
          },
          startedAt: { type: "string", description: "When the job was queued." },
          error: {
            type: ["string", "null"],
            description: "Failure message when `status` is `failed`, otherwise `null`.",
          },
        },
        required: ["id", "status", "personaId", "startedAt", "error"],
        description:
          "The project's current or most recent generation job. Starting a generation while one is queued or running returns that job instead of a new one. `null` when no job was recorded in the last 7 days.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["job", "organization"],
  },
  getBrandIdentity: {
    type: "object",
    properties: {
      brandIdentity: {
        type: ["object", "null"],
        properties: {
          id: {
            type: "string",
            description: "Pass as brandIdentityId to post generation or the brandIdentityId filter of GET /v1/posts.",
          },
          name: { type: "string" },
          isDefault: {
            type: "boolean",
            description: "The organization's default brand identity, used when post generation omits brandIdentityId.",
          },
          websiteUrl: { type: "string", description: "Website the identity was analyzed from." },
          companyName: {
            type: ["string", "null"],
            description: "Filled in by the website analysis. Null until the analysis completes or when not set.",
          },
          companyDescription: {
            type: ["string", "null"],
            description: "Filled in by the website analysis. Null until the analysis completes or when not set.",
          },
          toneProfile: {
            type: ["string", "null"],
            description:
              "Preset tone: Conversational, Professional, Casual or Formal. Ignored while customTone is set.",
          },
          customTone: {
            type: ["string", "null"],
            description: "Free-text voice notes. When set, generation follows them instead of toneProfile.",
          },
          customInstructions: {
            type: ["string", "null"],
            description: "Extra writing instructions applied to generated content.",
          },
          audience: {
            type: ["string", "null"],
            description: "Target audience. Filled in by the website analysis; null until it completes or when not set.",
          },
          language: {
            type: ["string", "null"],
            description: "Language generated content is written in. Null means no language is enforced.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "name",
          "isDefault",
          "websiteUrl",
          "companyName",
          "companyDescription",
          "toneProfile",
          "customTone",
          "customInstructions",
          "audience",
          "language",
          "createdAt",
          "updatedAt",
        ],
        description: "Null when no brand identity with this ID exists in the organization; the response is still 200.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["brandIdentity", "organization"],
  },
  getBrandIdentityGeneration: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      job: {
        type: "object",
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          brandIdentityId: {
            type: "string",
            description:
              "ID of the brand identity being analyzed. The identity is created immediately and its details are filled in as the job completes.",
          },
          status: {
            type: "string",
            enum: ["queued", "running", "completed", "failed"],
            description: "Job state. Stop polling once it is completed or failed.",
          },
          step: {
            type: ["string", "null"],
            enum: ["scraping", "extracting", "saving", null],
            description: "Current analysis step while the job is running.",
          },
          currentStep: {
            type: "integer",
            minimum: 0,
            description: "Progress through the analysis, out of totalSteps.",
          },
          totalSteps: { type: "integer", minimum: 1 },
          workflowRunId: {
            type: ["string", "null"],
            description: "Internal workflow run ID. Null until the analysis workflow has started.",
          },
          error: { type: ["string", "null"], description: "Failure reason when status is failed." },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          completedAt: {
            type: ["string", "null"],
            description: "When the job completed or failed. Null while it is queued or running.",
          },
        },
        required: [
          "id",
          "organizationId",
          "brandIdentityId",
          "status",
          "step",
          "currentStep",
          "totalSteps",
          "workflowRunId",
          "error",
          "createdAt",
          "updatedAt",
          "completedAt",
        ],
      },
    },
    required: ["organization", "job"],
  },
  getChat: {
    type: "object",
    properties: {
      chat: {
        type: "object",
        properties: {
          chatId: { type: "string" },
          title: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          pinnedAt: { type: ["string", "null"] },
          externalChannelId: {
            type: ["object", "null"],
            properties: {
              source: { type: "string", enum: ["discord", "slack", "dashboard", "agent"] },
              id: { type: "string", maxLength: 200 },
            },
            required: ["source"],
          },
        },
        required: ["chatId", "title", "createdAt", "updatedAt", "pinnedAt"],
      },
      messages: { type: "array", items: {} },
    },
    required: ["chat", "messages"],
  },
  getChatByExternalChannel: {
    type: "object",
    properties: {
      chatId: { type: "string" },
      title: { type: "string" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
      pinnedAt: { type: ["string", "null"] },
      externalChannelId: {
        type: ["object", "null"],
        properties: {
          source: { type: "string", enum: ["discord", "slack", "dashboard", "agent"] },
          id: { type: "string", maxLength: 200 },
        },
        required: ["source"],
      },
    },
    required: ["chatId", "title", "createdAt", "updatedAt", "pinnedAt"],
  },
  getEventTrigger: {
    type: "object",
    properties: {
      eventTrigger: {
        type: "object",
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          name: {
            type: "string",
            description:
              'Event triggers cannot be named through the API or the dashboard, so this is the default "Untitled Schedule".',
          },
          sourceType: { type: "string", enum: ["github_webhook"] },
          sourceConfig: {
            type: "object",
            properties: {
              eventTypes: {
                type: "array",
                items: { type: "string", enum: ["release", "push"] },
                minItems: 1,
                description: "GitHub webhook events that start a run: published releases, pushes, or both.",
              },
              includePreReleases: {
                type: "boolean",
                default: true,
                description: "Whether releases marked as pre-releases on GitHub also start a run.",
              },
              ignoreCommitPatterns: {
                type: "array",
                items: { type: "string", minLength: 1, maxLength: 120 },
                maxItems: 10,
                default: [],
                description:
                  "Case-insensitive JavaScript regular expressions tested against each commit message of a push, matching anywhere unless anchored. A push is skipped only when every commit matches at least one pattern. Releases are not filtered.",
              },
            },
            required: ["eventTypes"],
          },
          targets: {
            type: "object",
            properties: {
              repositoryIds: {
                type: "array",
                items: { type: "string", minLength: 1 },
                minItems: 1,
                description:
                  "GitHub integration IDs whose webhook events start the trigger, as returned in the github array of GET /v1/integrations.",
              },
            },
            required: ["repositoryIds"],
          },
          outputType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
          outputConfig: {
            type: ["object", "null"],
            properties: {
              publishDestination: {
                type: "string",
                enum: ["webflow", "framer", "custom"],
                description:
                  "Deprecated and ignored. Auto-published posts are only marked as published in Notra; publish to GitHub or a Notra site from the post instead.",
                deprecated: true,
              },
              brandVoiceId: {
                type: "string",
                minLength: 1,
                description:
                  "Brand identity ID to write in. Falls back to the organization's default brand identity when unset or not found.",
              },
              notify: {
                type: "object",
                properties: { slack: { type: "boolean" }, email: { type: "boolean" } },
                required: ["slack", "email"],
                description:
                  "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
              },
            },
          },
          enabled: {
            type: "boolean",
            description: "Whether matching GitHub events start runs. Disabled triggers are stored but ignored.",
          },
          autoPublish: {
            type: "boolean",
            description:
              "Save generated changelogs and blog posts with status published instead of draft. This only marks them published in Notra; nothing is pushed to GitHub or a Notra site. Other output types always stay drafts.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "organizationId",
          "name",
          "sourceType",
          "sourceConfig",
          "targets",
          "outputType",
          "enabled",
          "autoPublish",
          "createdAt",
          "updatedAt",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["eventTrigger", "organization"],
  },
  getFeedback: {
    type: "object",
    properties: {
      feedback: {
        type: "object",
        properties: {
          id: { type: "string" },
          projectId: {
            type: ["string", "null"],
            description: "Project the feedback is filed under, or null for none.",
          },
          source: { type: "string", enum: ["mcp", "api", "sdk"], description: "Channel the feedback arrived through." },
          kind: {
            type: "string",
            enum: ["bug", "feature", "praise", "question", "other"],
            description:
              "What kind of feedback this is, as submitted or classified by Notra. other when classification failed.",
          },
          sentiment: {
            type: ["string", "null"],
            enum: ["negative", "neutral", "positive", null],
            description:
              "Overall sentiment, as submitted or classified by Notra. Null when it could not be classified.",
          },
          status: { type: "string", enum: ["new", "triaged", "resolved", "archived"], description: "Triage status." },
          title: {
            type: ["string", "null"],
            description: "Short summary, as submitted or written by Notra. Null when none could be written.",
          },
          message: { type: "string" },
          agentClient: { type: ["string", "null"] },
          agentModel: { type: ["string", "null"] },
          toolVersion: { type: ["string", "null"] },
          userAgent: { type: ["string", "null"] },
          contextUrl: { type: ["string", "null"] },
          externalId: { type: ["string", "null"] },
          idempotencyKey: { type: ["string", "null"] },
          metadata: {
            type: ["object", "null"],
            additionalProperties: {},
            description: "JSON submitted with the feedback, or null.",
          },
          resolvedAt: {
            type: ["string", "null"],
            description: "When the status was last set to resolved. Cleared when it changes to another status.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "projectId",
          "source",
          "kind",
          "sentiment",
          "status",
          "title",
          "message",
          "agentClient",
          "agentModel",
          "toolVersion",
          "userAgent",
          "contextUrl",
          "externalId",
          "idempotencyKey",
          "metadata",
          "resolvedAt",
          "createdAt",
          "updatedAt",
        ],
      },
    },
    required: ["feedback"],
  },
  getGeoAgentReadiness: {
    type: "object",
    properties: {
      targetUrl: {
        type: "string",
        description: "Website URL from the project's brand identity that scans run against.",
      },
      report: {
        type: ["object", "null"],
        properties: {
          id: { type: "string" },
          status: { type: "string", enum: ["running", "completed", "failed"] },
          targetUrl: { type: "string", description: "Website URL that was scanned." },
          score: {
            type: ["number", "null"],
            description: "Agent readiness score from 0 to 100. Null until the scan completes.",
          },
          scoreLabel: {
            type: ["string", "null"],
            description:
              "Label the Is Agentic scanner (is-agentic.com) gives the score, stored as returned. Its API defines it as free text, so treat it as display text rather than a fixed set of values. Null until the scan completes.",
          },
          scoreBreakdown: {
            type: ["object", "null"],
            properties: {
              essential: {
                type: "object",
                properties: {
                  earned: { type: "number", description: "Score points earned by the checks in this tier." },
                  available: { type: "number", description: "Score points this tier can contribute." },
                  passing: { type: "number", description: "Number of checks in this tier that passed." },
                  total: { type: "number", description: "Number of checks in this tier." },
                },
                required: ["earned", "available", "passing", "total"],
              },
              recommended: {
                type: "object",
                properties: {
                  earned: { type: "number", description: "Score points earned by the checks in this tier." },
                  available: { type: "number", description: "Score points this tier can contribute." },
                  passing: { type: "number", description: "Number of checks in this tier that passed." },
                  total: { type: "number", description: "Number of checks in this tier." },
                },
                required: ["earned", "available", "passing", "total"],
              },
              bonus: {
                type: "object",
                properties: {
                  points: { type: "number", description: "Extra score points earned from bonus signals." },
                  positiveSignals: { type: "number", description: "Number of bonus signals detected." },
                },
                required: ["points", "positiveSignals"],
              },
            },
            required: ["essential", "recommended", "bonus"],
            description: "Points and passing checks per tier. Null until the scan completes.",
          },
          issues: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "Stable check identifier, used to match the same check across scans.",
                },
                name: { type: "string" },
                tier: { type: "string", enum: ["essential", "recommended", "bonus"] },
                result: { type: "string", enum: ["failed", "partial"] },
                details: {
                  type: ["string", "null"],
                  description: "What the check found. Null when the scanner gave no details.",
                },
                recommendation: {
                  type: ["string", "null"],
                  description: "Suggested fix. Null when the scanner gave no recommendation.",
                },
              },
              required: ["id", "name", "tier", "result", "details", "recommendation"],
            },
            description: "Checks that failed or only partly passed. Passing checks are not listed.",
          },
          eligibleChecks: {
            type: ["integer", "null"],
            description: "Number of checks that applied to this website. Null until the scan completes.",
          },
          errorMessage: { type: ["string", "null"], description: "Why the scan failed. Null unless status is failed." },
          scannedAt: {
            type: ["string", "null"],
            description: "ISO timestamp of when the website was scanned. Null until the scan completes.",
          },
          createdAt: { type: "string" },
        },
        required: [
          "id",
          "status",
          "targetUrl",
          "score",
          "scoreLabel",
          "scoreBreakdown",
          "issues",
          "eligibleChecks",
          "errorMessage",
          "scannedAt",
          "createdAt",
        ],
        description: "Latest completed report, if any.",
      },
      scan: {
        allOf: [
          {
            type: ["object", "null"],
            properties: {
              id: { type: "string" },
              status: { type: "string", enum: ["running", "completed", "failed"] },
              targetUrl: { type: "string", description: "Website URL that was scanned." },
              score: {
                type: ["number", "null"],
                description: "Agent readiness score from 0 to 100. Null until the scan completes.",
              },
              scoreLabel: {
                type: ["string", "null"],
                description:
                  "Label the Is Agentic scanner (is-agentic.com) gives the score, stored as returned. Its API defines it as free text, so treat it as display text rather than a fixed set of values. Null until the scan completes.",
              },
              scoreBreakdown: {
                type: ["object", "null"],
                properties: {
                  essential: {
                    type: "object",
                    properties: {
                      earned: { type: "number", description: "Score points earned by the checks in this tier." },
                      available: { type: "number", description: "Score points this tier can contribute." },
                      passing: { type: "number", description: "Number of checks in this tier that passed." },
                      total: { type: "number", description: "Number of checks in this tier." },
                    },
                    required: ["earned", "available", "passing", "total"],
                  },
                  recommended: {
                    type: "object",
                    properties: {
                      earned: { type: "number", description: "Score points earned by the checks in this tier." },
                      available: { type: "number", description: "Score points this tier can contribute." },
                      passing: { type: "number", description: "Number of checks in this tier that passed." },
                      total: { type: "number", description: "Number of checks in this tier." },
                    },
                    required: ["earned", "available", "passing", "total"],
                  },
                  bonus: {
                    type: "object",
                    properties: {
                      points: { type: "number", description: "Extra score points earned from bonus signals." },
                      positiveSignals: { type: "number", description: "Number of bonus signals detected." },
                    },
                    required: ["points", "positiveSignals"],
                  },
                },
                required: ["essential", "recommended", "bonus"],
                description: "Points and passing checks per tier. Null until the scan completes.",
              },
              issues: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      description: "Stable check identifier, used to match the same check across scans.",
                    },
                    name: { type: "string" },
                    tier: { type: "string", enum: ["essential", "recommended", "bonus"] },
                    result: { type: "string", enum: ["failed", "partial"] },
                    details: {
                      type: ["string", "null"],
                      description: "What the check found. Null when the scanner gave no details.",
                    },
                    recommendation: {
                      type: ["string", "null"],
                      description: "Suggested fix. Null when the scanner gave no recommendation.",
                    },
                  },
                  required: ["id", "name", "tier", "result", "details", "recommendation"],
                },
                description: "Checks that failed or only partly passed. Passing checks are not listed.",
              },
              eligibleChecks: {
                type: ["integer", "null"],
                description: "Number of checks that applied to this website. Null until the scan completes.",
              },
              errorMessage: {
                type: ["string", "null"],
                description: "Why the scan failed. Null unless status is failed.",
              },
              scannedAt: {
                type: ["string", "null"],
                description: "ISO timestamp of when the website was scanned. Null until the scan completes.",
              },
              createdAt: { type: "string" },
            },
            required: [
              "id",
              "status",
              "targetUrl",
              "score",
              "scoreLabel",
              "scoreBreakdown",
              "issues",
              "eligibleChecks",
              "errorMessage",
              "scannedAt",
              "createdAt",
            ],
            description: "Latest completed report, if any.",
          },
          { description: "Latest run newer than the completed report, if any." },
        ],
      },
      history: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            score: {
              type: ["number", "null"],
              description: "Score from 0 to 100, or null when the scanner returned none.",
            },
            failedCount: { type: "integer", description: "Number of checks that failed in this scan." },
            partialCount: { type: "integer", description: "Number of checks that only partly passed in this scan." },
            scannedAt: {
              type: "string",
              description: "ISO timestamp of the scan, or of when the report was created if the scan time is unknown.",
            },
          },
          required: ["id", "score", "failedCount", "partialCount", "scannedAt"],
        },
        description: "Up to the 60 most recent completed scans, oldest first.",
      },
      comparison: {
        type: ["object", "null"],
        properties: {
          previousScore: {
            type: ["number", "null"],
            description: "Score of the scan before the latest one, from 0 to 100. Null when the scanner returned none.",
          },
          previousScannedAt: { type: "string", description: "ISO timestamp of the scan before the latest one." },
          resolved: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                tier: { type: "string", enum: ["essential", "recommended", "bonus"] },
                previousResult: {
                  type: ["string", "null"],
                  enum: ["failed", "partial", null],
                  description: "Result on the previous scan; null when the check passed.",
                },
                result: {
                  type: ["string", "null"],
                  enum: ["failed", "partial", null],
                  description: "Result on the latest scan; null when the check passes now.",
                },
              },
              required: ["id", "name", "tier", "previousResult", "result"],
            },
            description: "Checks that had an issue before and pass now.",
          },
          added: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                tier: { type: "string", enum: ["essential", "recommended", "bonus"] },
                previousResult: {
                  type: ["string", "null"],
                  enum: ["failed", "partial", null],
                  description: "Result on the previous scan; null when the check passed.",
                },
                result: {
                  type: ["string", "null"],
                  enum: ["failed", "partial", null],
                  description: "Result on the latest scan; null when the check passes now.",
                },
              },
              required: ["id", "name", "tier", "previousResult", "result"],
            },
            description: "Checks that passed before and have an issue now.",
          },
          improved: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                tier: { type: "string", enum: ["essential", "recommended", "bonus"] },
                previousResult: {
                  type: ["string", "null"],
                  enum: ["failed", "partial", null],
                  description: "Result on the previous scan; null when the check passed.",
                },
                result: {
                  type: ["string", "null"],
                  enum: ["failed", "partial", null],
                  description: "Result on the latest scan; null when the check passes now.",
                },
              },
              required: ["id", "name", "tier", "previousResult", "result"],
            },
            description: "Checks that went from failed to partial.",
          },
          worsened: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                tier: { type: "string", enum: ["essential", "recommended", "bonus"] },
                previousResult: {
                  type: ["string", "null"],
                  enum: ["failed", "partial", null],
                  description: "Result on the previous scan; null when the check passed.",
                },
                result: {
                  type: ["string", "null"],
                  enum: ["failed", "partial", null],
                  description: "Result on the latest scan; null when the check passes now.",
                },
              },
              required: ["id", "name", "tier", "previousResult", "result"],
            },
            description: "Checks that went from partial to failed.",
          },
        },
        required: ["previousScore", "previousScannedAt", "resolved", "added", "improved", "worsened"],
        description:
          "Checks that changed between the latest completed scan and the one before it. Null until there are two completed scans.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["targetUrl", "report", "scan", "history", "comparison", "organization"],
  },
  getGeoContentBrief: {
    type: "object",
    properties: {
      brief: {
        type: "object",
        properties: {
          id: { type: "string" },
          topic: { type: "string" },
          brief: {
            type: "object",
            properties: {
              targetPrompt: { type: "string", description: "The AI assistant prompt the article is written to win." },
              intent: { type: "string", description: "Search intent behind the target prompt." },
              contentSubtype: {
                type: "string",
                enum: ["guide", "comparison", "listicle", "how-to", "faq", "alternatives"],
                description: "Kind of blog post to write.",
              },
              workingTitle: { type: "string", description: "Planned article title, up to 120 characters." },
              audience: { type: "string", description: "Who the article is for." },
              jobToBeDone: { type: "string", description: "What the reader is trying to get done." },
              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    heading: { type: "string", description: "H2 heading for the section." },
                    goal: { type: "string", description: "One sentence on what the reader should take away." },
                    claims: {
                      type: "array",
                      items: { type: "string" },
                      description: "Up to 5 concrete, checkable claims the section must make.",
                    },
                  },
                  required: ["heading", "goal", "claims"],
                },
                description: "The outline, 3 to 8 sections in order.",
              },
              questionsToAnswer: {
                type: "array",
                items: { type: "string" },
                description: "Up to 8 questions the article's FAQ must answer directly.",
              },
              internalLinks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      description:
                        "Brand page to link. The planner is told to copy it from the project's sitemap; Notra does not check it.",
                    },
                    anchor: { type: "string", description: "Anchor text for the link." },
                    why: { type: "string", description: "Why the page belongs in the article." },
                  },
                  required: ["url", "anchor", "why"],
                },
                description: "Up to 6 links to the brand's own pages, picked from the project's sitemap pages.",
              },
              acceptanceChecklist: {
                type: "array",
                items: { type: "string" },
                description: "Up to 8 checks the finished article must pass, based on Notra's GEO writing rules.",
              },
              recommendedAngle: {
                type: "string",
                description:
                  "Why this article should earn the mention, based on current AI answers. Only filled when the brief was planned from scan evidence.",
              },
              competitorsToCounter: {
                type: "array",
                items: { type: "string" },
                description:
                  "Brands named in current AI answers and the claims that earned them the mention. Only filled when the brief was planned from scan evidence.",
              },
              sourcesToReference: {
                type: "array",
                items: { type: "string" },
                description:
                  "Domains cited in current AI answers. Only filled when the brief was planned from scan evidence.",
              },
              missingCoverage: {
                type: "array",
                items: { type: "string" },
                description:
                  "Facts or topics winning AI answers covered that the brand must now cover. Only filled when the brief was planned from scan evidence.",
              },
              baseline: {
                type: ["object", "null"],
                properties: {
                  sourcePromptId: { type: "string", description: "Prompt id the brief was planned from." },
                  mentionedEngines: { type: "number", description: "Engines whose latest answer mentioned the brand." },
                  totalEngines: { type: "number", description: "Engines with an answer in the last 30 days." },
                  engines: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        engine: { type: "string" },
                        mentioned: { type: "boolean" },
                        position: {
                          type: ["number", "null"],
                          description: "Position of the brand in the answer. Null when the answer gave it none.",
                        },
                      },
                      required: ["engine", "mentioned", "position"],
                    },
                    description: "Latest answer per engine.",
                  },
                  competitorMentions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { name: { type: "string" }, engines: { type: "number" } },
                      required: ["name", "engines"],
                    },
                    description: "Competitors named in the answers, with the number of engines naming each.",
                  },
                  citedDomains: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { domain: { type: "string" }, engines: { type: "number" } },
                      required: ["domain", "engines"],
                    },
                    description: "Domains cited in the answers, with the number of engines citing each.",
                  },
                  capturedAt: { type: ["string", "null"], description: "ISO timestamp of the newest answer used." },
                },
                required: [
                  "sourcePromptId",
                  "mentionedEngines",
                  "totalEngines",
                  "engines",
                  "competitorMentions",
                  "citedDomains",
                  "capturedAt",
                ],
                description:
                  "How AI engines answered the source prompt when the brief was planned, from answers in the last 30 days. Only set for briefs planned from a prompt gap or prompt; null when there were no recent answers.",
              },
            },
            required: [
              "targetPrompt",
              "intent",
              "contentSubtype",
              "workingTitle",
              "audience",
              "jobToBeDone",
              "sections",
              "questionsToAnswer",
              "internalLinks",
              "acceptanceChecklist",
            ],
            description:
              "The article plan. Notra's AI planner writes the text fields; updateGeoContentBrief can change them.",
          },
          status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
          autoApproved: {
            type: "boolean",
            description: "True when writing started automatically at planning time instead of through approval.",
          },
          runId: { type: ["string", "null"], description: "Latest writer run id. Null until the brief is approved." },
          postId: {
            type: ["string", "null"],
            description: "Post the brief writes into. Null when no post is linked, for example after it was deleted.",
          },
          humanized: { type: "boolean", description: "True when the writer's humanizing pass rewrote the draft post." },
          error: { type: ["string", "null"], description: "Why the last writer run failed. Null otherwise." },
          createdAt: { type: "string" },
          updatedAt: {
            type: "string",
            description: "Pass as expectedUpdatedAt to updateGeoContentBrief to avoid overwriting newer changes.",
          },
          completedAt: {
            type: ["string", "null"],
            description:
              "ISO timestamp of when the last writer run finished or failed. Null while writing or before approval.",
          },
        },
        required: [
          "id",
          "topic",
          "brief",
          "status",
          "autoApproved",
          "runId",
          "postId",
          "humanized",
          "error",
          "createdAt",
          "updatedAt",
          "completedAt",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["brief", "organization"],
  },
  getGeoIngestSetup: {
    type: "object",
    properties: {
      ingestUrl: { type: "string", description: "Endpoint the tracking snippet posts events to." },
      snippet: { type: "string", description: "Install snippet for the default framework (Next.js)." },
      snippets: {
        type: "object",
        properties: {
          next: { type: "string" },
          nuxt: { type: "string" },
          netlify: { type: "string" },
          tanstack: { type: "string" },
          astro: { type: "string" },
          sveltekit: { type: "string" },
          reactRouter: { type: "string" },
        },
        required: ["next", "nuxt", "netlify", "tanstack", "astro", "sveltekit", "reactRouter"],
      },
      drainUrls: {
        type: "object",
        properties: { vercel: { type: "string" }, cloudflare: { type: "string" } },
        required: ["vercel", "cloudflare"],
        description:
          "Endpoints a Vercel log drain or Cloudflare Logpush job posts request logs to, authenticated with the tracking token.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      webKey: {
        type: "string",
        description:
          "Public key for the notra.js browser script, bound to one project. Safe to put in page HTML; it only records human page views on that project's tracked domains and survives token rotation. Only present when web analytics is enabled for the workspace and it has a project.",
      },
      webSnippet: {
        type: "string",
        description:
          'Script tag that installs notra.js with the public key, pinned to the current build with its Subresource Integrity hash and crossorigin="anonymous". Build an auto-updating tag from webScript.url instead if you want new builds without copying the tag again. Only present when web analytics is enabled for the workspace.',
      },
      webScript: {
        type: "object",
        properties: {
          url: { type: "string", description: "Always serves the latest build." },
          pinnedUrl: { type: "string", description: "Serves exactly this build forever; it never updates." },
          integrity: {
            type: "string",
            description: 'Subresource Integrity value for pinnedUrl (sha384). Use it with crossorigin="anonymous".',
          },
          collectUrl: {
            type: "string",
            description:
              "Where page views go when the script loads from Notra's script host; set it as the tag's data-api.",
          },
        },
        required: ["url", "pinnedUrl", "integrity"],
        description:
          "notra.js: the auto-updating URL and the current build pinned with Subresource Integrity. Only present when web analytics is enabled for the workspace.",
      },
      webPlusScript: {
        type: "object",
        properties: {
          url: { type: "string", description: "Always serves the latest build." },
          pinnedUrl: { type: "string", description: "Serves exactly this build forever; it never updates." },
          integrity: {
            type: "string",
            description: 'Subresource Integrity value for pinnedUrl (sha384). Use it with crossorigin="anonymous".',
          },
          collectUrl: {
            type: "string",
            description:
              "Where page views go when the script loads from Notra's script host; set it as the tag's data-api.",
          },
        },
        required: ["url", "pinnedUrl", "integrity"],
        description:
          "notra.plus.js (notra.js with JavaScript error reporting), auto-updating and pinned. Only present when web analytics is enabled for the workspace.",
      },
    },
    required: ["ingestUrl", "snippet", "snippets", "drainUrls", "organization"],
  },
  getGeoMcpAnalytics: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description:
          "False when the traffic backend is not configured for this deployment; the payload is then empty rather than an error.",
      },
      server: {
        type: ["object", "null"],
        properties: { name: { type: "string" }, version: { type: "string" }, protocolVersion: { type: "string" } },
        required: ["name", "version", "protocolVersion"],
        description: "Server info from the newest event. Null before any.",
      },
      totals: {
        type: "object",
        properties: {
          requests: { type: "integer", description: "All MCP requests in the window, of every method." },
          previousRequests: { type: "integer" },
          toolCalls: { type: "integer", description: "tools/call requests." },
          previousToolCalls: { type: "integer" },
          errors: { type: "integer", description: "Requests whose status was tool_error or rpc_error." },
          previousErrors: { type: "integer" },
          sessions: { type: "integer", description: "Distinct MCP sessions." },
          previousSessions: { type: "integer" },
          users: { type: "integer", description: "Distinct end-user IDs your server reported." },
          previousUsers: { type: "integer" },
          p95Ms: { type: "integer", description: "95th percentile request duration in milliseconds." },
          previousP95Ms: { type: "integer" },
        },
        required: [
          "requests",
          "previousRequests",
          "toolCalls",
          "previousToolCalls",
          "errors",
          "previousErrors",
          "sessions",
          "previousSessions",
          "users",
          "previousUsers",
          "p95Ms",
          "previousP95Ms",
        ],
        description: "Each previous* value covers the window of the same length right before this one.",
      },
      daily: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
            toolsCall: { type: "integer" },
            resourcesRead: { type: "integer" },
            promptsGet: { type: "integer" },
            other: { type: "integer", description: "Requests of every other method." },
            errors: { type: "integer", description: "Requests whose status was tool_error or rpc_error." },
          },
          required: ["day", "toolsCall", "resourcesRead", "promptsGet", "other", "errors"],
        },
        description: "Requests per day, split by method.",
      },
      tools: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: {
              type: "string",
              description: "Description from the latest tools/list. Empty when not listed.",
            },
            calls: { type: "integer" },
            errors: { type: "integer", description: "Requests whose status was tool_error or rpc_error." },
            users: { type: "integer", description: "Distinct end-user IDs that called the tool." },
            avgResponseBytes: { type: "integer", description: "Average response size in bytes." },
            p50Ms: { type: "integer", description: "Median call duration in milliseconds." },
            p95Ms: { type: "integer", description: "95th percentile call duration in milliseconds." },
            uiResource: {
              type: "string",
              description: "MCP Apps ui:// resource the tool advertises. Empty when none.",
            },
          },
          required: [
            "name",
            "description",
            "calls",
            "errors",
            "users",
            "avgResponseBytes",
            "p50Ms",
            "p95Ms",
            "uiResource",
          ],
        },
        description: "Up to 50 tools, most called first.",
      },
      clients: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            sessions: { type: "integer" },
            requests: { type: "integer" },
            errors: { type: "integer", description: "Requests whose status was tool_error or rpc_error." },
            lastSeenAt: { type: "string", description: "ISO timestamp of the client's newest request." },
          },
          required: ["name", "sessions", "requests", "errors", "lastSeenAt"],
        },
        description: "Up to 50 MCP clients, most sessions first.",
      },
      errorRequests: {
        type: "array",
        items: {
          type: "object",
          properties: {
            capturedAt: { type: "string", description: "ISO timestamp." },
            clientName: { type: "string" },
            clientVersion: { type: "string" },
            method: { type: "string", description: "JSON-RPC method, such as tools/call." },
            target: { type: "string", description: "Tool name, resource URI or prompt name the request targeted." },
            status: { type: "string", enum: ["ok", "tool_error", "rpc_error"] },
            errorCode: { type: "integer" },
            errorMessage: { type: "string" },
            durationMs: { type: "integer" },
            model: {
              type: "string",
              description: "Model the agent reported via the optional _model parameter. Empty when not reported.",
            },
          },
          required: [
            "capturedAt",
            "clientName",
            "clientVersion",
            "method",
            "target",
            "status",
            "errorCode",
            "errorMessage",
            "durationMs",
            "model",
          ],
        },
        description: "Up to 100 most recent failed requests, newest first.",
      },
      models: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            sessions: { type: "integer" },
            calls: { type: "integer" },
            errors: { type: "integer", description: "Requests whose status was tool_error or rpc_error." },
          },
          required: ["name", "sessions", "calls", "errors"],
        },
        description: "Up to 50 models agents reported via the optional _model parameter, most calls first.",
      },
      intents: {
        type: "array",
        items: {
          type: "object",
          properties: {
            intent: { type: "string", description: "Intent the agent stated when calling the tool." },
            tool: { type: "string", description: "Tool the call went to." },
            calls: { type: "integer" },
            errors: { type: "integer", description: "Requests whose status was tool_error or rpc_error." },
          },
          required: ["intent", "tool", "calls", "errors"],
        },
        description: "Up to 50 most frequent intent and tool pairs.",
      },
      elicitations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            method: {
              type: "string",
              description: "Server-to-client request method, such as elicitation or sampling.",
            },
            tool: { type: "string", description: "Tool that triggered the request." },
            requests: { type: "integer" },
            accepted: { type: "integer" },
            declined: { type: "integer" },
            cancelled: { type: "integer" },
            errors: { type: "integer", description: "Requests whose status was tool_error or rpc_error." },
          },
          required: ["method", "tool", "requests", "accepted", "declined", "cancelled", "errors"],
        },
        description: "Requests your server sent to clients, with how users answered.",
      },
      uiRenders: {
        type: "array",
        items: {
          type: "object",
          properties: {
            resource: { type: "string", description: "ui:// resource URI." },
            tools: { type: "array", items: { type: "string" }, description: "Tools that advertise this resource." },
            renders: { type: "integer", description: "Successful reads of the resource." },
            sessions: { type: "integer", description: "Distinct sessions with a successful read." },
            errors: { type: "integer", description: "Requests whose status was tool_error or rpc_error." },
          },
          required: ["resource", "tools", "renders", "sessions", "errors"],
        },
        description: "MCP Apps interfaces hosts loaded, most renders first.",
      },
      catalog: {
        type: ["object", "null"],
        properties: {
          listedAt: { type: "string", description: "ISO timestamp of the latest tools/list response." },
          unusedTools: {
            type: "array",
            items: {
              type: "object",
              properties: { name: { type: "string" }, description: { type: "string" } },
              required: ["name", "description"],
            },
          },
        },
        required: ["listedAt", "unusedTools"],
        description:
          "Tools from the latest tools/list that were never called in the window. Null before a listing is seen.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: [
      "configured",
      "server",
      "totals",
      "daily",
      "tools",
      "clients",
      "errorRequests",
      "models",
      "intents",
      "elicitations",
      "uiRenders",
      "catalog",
      "organization",
    ],
  },
  getGeoMcpToolDetail: {
    type: "object",
    properties: {
      before: {
        type: "array",
        items: {
          type: "object",
          properties: {
            tool: { type: "string" },
            calls: { type: "integer", description: "Times this neighbor was adjacent to the tool." },
            afterFailure: {
              type: "integer",
              description: "Of those, how often the earlier call of the pair had failed.",
            },
          },
          required: ["tool", "calls", "afterFailure"],
        },
        description: "Tools called right before this one in the same session.",
      },
      after: {
        type: "array",
        items: {
          type: "object",
          properties: {
            tool: { type: "string" },
            calls: { type: "integer", description: "Times this neighbor was adjacent to the tool." },
            afterFailure: {
              type: "integer",
              description: "Of those, how often the earlier call of the pair had failed.",
            },
          },
          required: ["tool", "calls", "afterFailure"],
        },
        description: "Tools called right after this one in the same session.",
      },
      failures: {
        type: "array",
        items: {
          type: "object",
          properties: {
            message: { type: "string", description: "First 300 characters of the error message." },
            clientName: { type: "string" },
            status: { type: "string", enum: ["ok", "tool_error", "rpc_error"] },
            errorCode: { type: "integer" },
            calls: { type: "integer" },
            lastSeenAt: { type: "string", description: "ISO timestamp of the newest failure." },
          },
          required: ["message", "clientName", "status", "errorCode", "calls", "lastSeenAt"],
        },
        description: "Failures grouped by error message.",
      },
      intents: {
        type: "array",
        items: {
          type: "object",
          properties: {
            intent: { type: "string", description: "Intent the agent stated when calling the tool." },
            tool: { type: "string", description: "Tool the call went to." },
            calls: { type: "integer" },
            errors: { type: "integer", description: "Requests whose status was tool_error or rpc_error." },
          },
          required: ["intent", "tool", "calls", "errors"],
        },
        description: "Up to 20 most frequent intents for this tool.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["before", "after", "failures", "intents", "organization"],
  },
  getGeoPersonaActivity: {
    type: "object",
    properties: {
      from: { type: "string", description: "First UTC day covered (YYYY-MM-DD)." },
      to: {
        type: "string",
        description: "UTC day after the last day covered (YYYY-MM-DD). Exclusive end of the range.",
      },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            personaId: { type: "string" },
            snapshotVersion: {
              type: "string",
              description:
                "Hash of the persona context the answers were played with. Changes when the persona is edited.",
            },
            day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
            lastCheckedAt: { type: "string", description: "Latest answer captured that day." },
            checks: { type: "integer", description: "Persona answers captured that day across all turns and engines." },
            mentions: { type: "integer", description: "Of those, answers that mentioned the tracked brand." },
          },
          required: ["personaId", "snapshotVersion", "day", "lastCheckedAt", "checks", "mentions"],
        },
        description:
          "One point per persona, persona version and day that had answers. Days without answers are omitted.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["from", "to", "points", "organization"],
  },
  getGeoPersonaGeneration: {
    type: "object",
    properties: {
      job: {
        type: ["object", "null"],
        properties: {
          id: { type: "string" },
          status: { type: "string", enum: ["queued", "running", "completed", "failed"] },
          personaId: {
            type: ["string", "null"],
            description: "Persona being regenerated, or `null` when the job creates new personas.",
          },
          startedAt: { type: "string", description: "When the job was queued." },
          error: {
            type: ["string", "null"],
            description: "Failure message when `status` is `failed`, otherwise `null`.",
          },
        },
        required: ["id", "status", "personaId", "startedAt", "error"],
        description:
          "The project's current or most recent generation job. Starting a generation while one is queued or running returns that job instead of a new one. `null` when no job was recorded in the last 7 days.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["job", "organization"],
  },
  getGeoPersonaResults: {
    type: "object",
    properties: {
      results: {
        type: "array",
        items: {
          type: "object",
          properties: {
            scanId: { type: "string" },
            turn: { type: "integer", description: "Conversation turn, starting at 1." },
            engine: { type: "string" },
            prompt: { type: "string", description: "Message the persona sent on this turn." },
            answer: { type: "string" },
            mentioned: {
              type: "boolean",
              description: "Whether the answer named the tracked brand or one of its aliases.",
            },
            position: {
              type: ["number", "null"],
              description:
                "1-based rank of the brand in a list of recommended brands, or `null` when it is not mentioned or not in a list.",
            },
            sentiment: {
              type: ["string", "null"],
              description:
                "`positive`, `neutral` or `negative` toward the brand, or `null` when it is not mentioned or was not classified.",
            },
            excerpt: {
              type: "string",
              description: "Part of the answer around the mention, or its opening when the brand is not mentioned.",
            },
            searchQueries: {
              type: "array",
              items: { type: "string" },
              description: "Web searches the engine ran while answering.",
            },
            sources: {
              type: "array",
              items: {
                type: "object",
                properties: { title: { type: "string" }, url: { type: "string" }, domain: { type: "string" } },
                required: ["title", "url", "domain"],
              },
              description:
                "Sources the answer cited. `domain` is empty for answers stored before domains were recorded.",
            },
            snapshotVersion: {
              type: ["string", "null"],
              description:
                "Hash of the persona context this answer was played with. Changes when the persona is edited.",
            },
            lastCheckedAt: { type: "string", description: "When this answer was captured." },
          },
          required: [
            "scanId",
            "turn",
            "engine",
            "prompt",
            "answer",
            "mentioned",
            "position",
            "sentiment",
            "excerpt",
            "searchQueries",
            "sources",
            "snapshotVersion",
            "lastCheckedAt",
          ],
        },
        description: "Latest answer per turn and engine within the selected scan.",
      },
      scans: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            capturedAt: { type: "string", description: "When the last answer of that scan was captured." },
          },
          required: ["id", "capturedAt"],
        },
        description: "Up to 50 scans that played this persona, newest first. Pass an id as `scanId` to read that scan.",
      },
      selectedScanId: {
        type: ["string", "null"],
        description:
          "Scan the results come from, or `null` when the persona has not been played yet. An unknown `scanId` falls back to the latest scan.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["results", "scans", "selectedScanId", "organization"],
  },
  getGeoPromptHistory: {
    type: "object",
    properties: {
      configured: { type: "boolean", description: "Always `true` for a project-scoped request." },
      promptId: { type: "string", description: "The requested prompt id, echoed back." },
      checks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Check id, usable with the prompt-result detail endpoint." },
            scanId: { type: "string" },
            engine: { type: "string" },
            mentioned: { type: "boolean" },
            ownedSourceCited: {
              type: "boolean",
              description: "Whether the answer cited a page on the project's own site.",
            },
            position: {
              type: ["number", "null"],
              description:
                "1-based rank of the brand in a list of recommended brands, or `null` when it is not mentioned or not in a list.",
            },
            sentiment: {
              type: ["string", "null"],
              description:
                "`positive`, `neutral` or `negative` toward the brand, or `null` when it is not mentioned or was not classified.",
            },
            competitors: {
              type: "array",
              items: { type: "string" },
              description: "Competing brands the answer offered instead of the brand.",
            },
            language: {
              type: "string",
              description: "Language the prompt was asked in, such as `English`. An empty string means English.",
            },
            capturedAt: { type: "string" },
          },
          required: [
            "id",
            "scanId",
            "engine",
            "mentioned",
            "position",
            "sentiment",
            "competitors",
            "language",
            "capturedAt",
          ],
        },
        description:
          "Answers to this prompt, newest first. Without `scanId`, the latest 120 in the project's prompt language; with `scanId`, every answer from that scan.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "promptId", "checks", "organization"],
  },
  getGeoPromptResultDetail: {
    type: "object",
    properties: {
      result: {
        type: "object",
        properties: {
          promptId: { type: "string", description: "Prompt id; use it with getGeoPromptHistory." },
          engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
          prompt: { type: "string", description: "Prompt text sent to the engine." },
          answer: { type: "string", description: "Full answer text from the engine." },
          mentioned: { type: "boolean", description: "Whether the answer named your brand or one of its aliases." },
          ownedSourceCited: {
            type: "boolean",
            description: "Whether the answer cited a page on your website or tracked domains.",
          },
          position: {
            type: ["integer", "null"],
            description:
              "1-based rank of your brand when the answer lists brands. Null when not mentioned or not in a list.",
          },
          sentiment: {
            type: ["string", "null"],
            description: "Tone toward your brand: positive, neutral or negative. Null when not mentioned.",
          },
          competitors: {
            type: "array",
            items: { type: "string" },
            description: "Alternative brands the answer offered instead of yours, in order of first appearance.",
          },
          excerpt: {
            type: "string",
            description: "Up to 300 characters around the mention, or the start of the answer when not mentioned.",
          },
          searchQueries: {
            type: "array",
            items: { type: "string" },
            description: "Web searches the engine ran while answering, when reported.",
          },
          sources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string", description: "Source title, falling back to its domain or URL." },
                url: { type: "string" },
                domain: { type: "string", description: "Source domain; empty when it cannot be derived from the URL." },
              },
              required: ["title", "url", "domain"],
            },
            description: "Grounding sources the answer cited, deduplicated by URL.",
          },
          lastCheckedAt: { type: "string", description: "ISO timestamp when this answer was captured." },
          finishReason: {
            type: ["string", "null"],
            description: "Why the engine stopped generating, as reported by its API. Null when not reported.",
          },
          promptTokens: {
            type: ["integer", "null"],
            description: "Input tokens the engine reported. Null when not reported.",
          },
          outputTokens: {
            type: ["integer", "null"],
            description: "Output tokens the engine reported. Null when not reported.",
          },
          reasoningTokens: {
            type: ["integer", "null"],
            description: "Reasoning tokens the engine reported. Null when not reported.",
          },
          truncated: {
            type: ["boolean", "null"],
            description:
              "True when the answer hit the output length limit (finishReason is length). Null when finishReason is unknown.",
          },
        },
        required: [
          "promptId",
          "engine",
          "prompt",
          "answer",
          "mentioned",
          "ownedSourceCited",
          "position",
          "sentiment",
          "competitors",
          "excerpt",
          "searchQueries",
          "sources",
          "lastCheckedAt",
          "finishReason",
          "promptTokens",
          "outputTokens",
          "reasoningTokens",
          "truncated",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["result", "organization"],
  },
  getGeoScan: {
    type: "object",
    properties: {
      scan: {
        type: "object",
        properties: {
          id: { type: "string" },
          projectId: { type: "string" },
          status: { type: "string", enum: ["running", "completed", "failed"] },
          startedAt: { type: "string" },
          finishedAt: {
            type: ["string", "null"],
            description: "When the scan completed or failed, or `null` while running.",
          },
          createdAt: { type: "string" },
          summary: {
            type: "object",
            properties: {
              plannedChecks: {
                type: ["integer", "null"],
                minimum: 0,
                description: "Answers the scan planned to collect, or `null` when the scan recorded no plan.",
              },
              completedChecks: { type: "integer", minimum: 0, description: "Answers stored for this scan so far." },
              mentionCount: {
                type: "integer",
                minimum: 0,
                description: "Stored answers that mentioned the tracked brand.",
              },
              failedChecks: {
                type: "integer",
                minimum: 0,
                description: "Planned answers that failed and were not stored.",
              },
              engines: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    engine: { type: "string" },
                    plannedChecks: {
                      type: ["integer", "null"],
                      minimum: 0,
                      description:
                        "Answers planned for this engine, or `null` when the plan has no per-engine breakdown.",
                    },
                    completedChecks: { type: "integer", minimum: 0 },
                    mentionCount: { type: "integer", minimum: 0 },
                    failedChecks: { type: "integer", minimum: 0 },
                  },
                  required: ["engine", "plannedChecks", "completedChecks", "mentionCount", "failedChecks"],
                },
                description:
                  "The same counts per engine, sorted by engine id. Covers planned engines and engines with stored answers.",
              },
            },
            required: ["plannedChecks", "completedChecks", "mentionCount", "failedChecks", "engines"],
          },
          errorCode: {
            type: ["string", "null"],
            description:
              "Machine-readable failure code such as `scan_handoff_failed` or `scan_stale`. `null` unless `status` is `failed`.",
          },
          errorMessage: {
            type: ["string", "null"],
            description: "Human-readable failure reason. `null` unless `status` is `failed`.",
          },
          failedStage: {
            type: ["string", "null"],
            enum: ["handoff", "execution", "stale", null],
            description:
              "`handoff` when the scan could not be started, `execution` when it failed while running, `stale` when it stopped reporting progress and was closed. `null` unless `status` is `failed`.",
          },
          retryable: {
            type: ["boolean", "null"],
            description:
              "`true` when the failure was a timeout or a stale run, so starting a new scan is likely to work. `null` when unknown or the scan did not fail.",
          },
        },
        required: [
          "id",
          "projectId",
          "status",
          "startedAt",
          "finishedAt",
          "createdAt",
          "summary",
          "errorCode",
          "errorMessage",
          "failedStage",
          "retryable",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["scan", "organization"],
  },
  getGeoSentiment: {
    type: "object",
    properties: {
      configured: { type: "boolean", enum: [true], description: "Always `true` for a project-scoped request." },
      summary: {
        type: "object",
        properties: {
          totalChecks: {
            type: "integer",
            description:
              "Answers to tracked prompts in the project's prompt language. Sequence and persona answers are not counted.",
          },
          mentions: { type: "integer", description: "Answers that mentioned the tracked brand." },
          positive: { type: "integer", description: "Mentions classified as positive." },
          neutral: { type: "integer", description: "Mentions classified as neutral." },
          negative: { type: "integer", description: "Mentions classified as negative." },
          lastCheckedAt: {
            type: ["string", "null"],
            description: "Latest answer captured, or `null` when there are none.",
          },
          score: {
            type: ["number", "null"],
            description:
              "Sentiment score from 0 to 100: positive counts 100, neutral 50, negative 0, averaged over classified mentions. `null` without classified mentions.",
          },
          classifiedMentions: {
            type: "integer",
            description: "Mentions with a sentiment: positive + neutral + negative.",
          },
          unknownMentions: { type: "integer", description: "Mentions without a sentiment classification." },
          notMentioned: { type: "integer", description: "Answers that did not mention the brand." },
          positiveShare: {
            type: ["number", "null"],
            description:
              "Share of classified mentions that are positive, from 0 to 1. `null` without classified mentions.",
          },
          neutralShare: {
            type: ["number", "null"],
            description:
              "Share of classified mentions that are neutral, from 0 to 1. `null` without classified mentions.",
          },
          negativeShare: {
            type: ["number", "null"],
            description:
              "Share of classified mentions that are negative, from 0 to 1. `null` without classified mentions.",
          },
          classificationCoverage: {
            type: ["number", "null"],
            description: "Share of mentions that have a sentiment, from 0 to 1. `null` without mentions.",
          },
        },
        required: [
          "totalChecks",
          "mentions",
          "positive",
          "neutral",
          "negative",
          "lastCheckedAt",
          "score",
          "classifiedMentions",
          "unknownMentions",
          "notMentioned",
          "positiveShare",
          "neutralShare",
          "negativeShare",
          "classificationCoverage",
        ],
        description: "Totals for the selected period.",
      },
      engines: {
        type: "array",
        items: {
          type: "object",
          properties: {
            totalChecks: {
              type: "integer",
              description:
                "Answers to tracked prompts in the project's prompt language. Sequence and persona answers are not counted.",
            },
            mentions: { type: "integer", description: "Answers that mentioned the tracked brand." },
            positive: { type: "integer", description: "Mentions classified as positive." },
            neutral: { type: "integer", description: "Mentions classified as neutral." },
            negative: { type: "integer", description: "Mentions classified as negative." },
            lastCheckedAt: {
              type: ["string", "null"],
              description: "Latest answer captured, or `null` when there are none.",
            },
            score: {
              type: ["number", "null"],
              description:
                "Sentiment score from 0 to 100: positive counts 100, neutral 50, negative 0, averaged over classified mentions. `null` without classified mentions.",
            },
            classifiedMentions: {
              type: "integer",
              description: "Mentions with a sentiment: positive + neutral + negative.",
            },
            unknownMentions: { type: "integer", description: "Mentions without a sentiment classification." },
            notMentioned: { type: "integer", description: "Answers that did not mention the brand." },
            positiveShare: {
              type: ["number", "null"],
              description:
                "Share of classified mentions that are positive, from 0 to 1. `null` without classified mentions.",
            },
            neutralShare: {
              type: ["number", "null"],
              description:
                "Share of classified mentions that are neutral, from 0 to 1. `null` without classified mentions.",
            },
            negativeShare: {
              type: ["number", "null"],
              description:
                "Share of classified mentions that are negative, from 0 to 1. `null` without classified mentions.",
            },
            classificationCoverage: {
              type: ["number", "null"],
              description: "Share of mentions that have a sentiment, from 0 to 1. `null` without mentions.",
            },
            engine: { type: "string" },
          },
          required: [
            "totalChecks",
            "mentions",
            "positive",
            "neutral",
            "negative",
            "lastCheckedAt",
            "score",
            "classifiedMentions",
            "unknownMentions",
            "notMentioned",
            "positiveShare",
            "neutralShare",
            "negativeShare",
            "classificationCoverage",
            "engine",
          ],
        },
        description: "Totals per engine that answered in the selected period.",
      },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            totalChecks: {
              type: "integer",
              description:
                "Answers to tracked prompts in the project's prompt language. Sequence and persona answers are not counted.",
            },
            mentions: { type: "integer", description: "Answers that mentioned the tracked brand." },
            positive: { type: "integer", description: "Mentions classified as positive." },
            neutral: { type: "integer", description: "Mentions classified as neutral." },
            negative: { type: "integer", description: "Mentions classified as negative." },
            lastCheckedAt: {
              type: ["string", "null"],
              description: "Latest answer captured, or `null` when there are none.",
            },
            score: {
              type: ["number", "null"],
              description:
                "Sentiment score from 0 to 100: positive counts 100, neutral 50, negative 0, averaged over classified mentions. `null` without classified mentions.",
            },
            classifiedMentions: {
              type: "integer",
              description: "Mentions with a sentiment: positive + neutral + negative.",
            },
            unknownMentions: { type: "integer", description: "Mentions without a sentiment classification." },
            notMentioned: { type: "integer", description: "Answers that did not mention the brand." },
            positiveShare: {
              type: ["number", "null"],
              description:
                "Share of classified mentions that are positive, from 0 to 1. `null` without classified mentions.",
            },
            neutralShare: {
              type: ["number", "null"],
              description:
                "Share of classified mentions that are neutral, from 0 to 1. `null` without classified mentions.",
            },
            negativeShare: {
              type: ["number", "null"],
              description:
                "Share of classified mentions that are negative, from 0 to 1. `null` without classified mentions.",
            },
            classificationCoverage: {
              type: ["number", "null"],
              description: "Share of mentions that have a sentiment, from 0 to 1. `null` without mentions.",
            },
            day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
          },
          required: [
            "totalChecks",
            "mentions",
            "positive",
            "neutral",
            "negative",
            "lastCheckedAt",
            "score",
            "classifiedMentions",
            "unknownMentions",
            "notMentioned",
            "positiveShare",
            "neutralShare",
            "negativeShare",
            "classificationCoverage",
            "day",
          ],
        },
        description: "One point per UTC day of the selected period, including days without answers.",
      },
      comparison: {
        type: "object",
        properties: {
          current: {
            type: "object",
            properties: { from: { type: "string" }, to: { type: "string" } },
            required: ["from", "to"],
            description: "Selected period as inclusive UTC days (YYYY-MM-DD).",
          },
          previous: {
            type: "object",
            properties: { from: { type: "string" }, to: { type: "string" } },
            required: ["from", "to"],
            description: "Period of the same length right before it, as inclusive UTC days (YYYY-MM-DD).",
          },
          summary: {
            type: "object",
            properties: {
              totalChecks: {
                type: "integer",
                description:
                  "Answers to tracked prompts in the project's prompt language. Sequence and persona answers are not counted.",
              },
              mentions: { type: "integer", description: "Answers that mentioned the tracked brand." },
              positive: { type: "integer", description: "Mentions classified as positive." },
              neutral: { type: "integer", description: "Mentions classified as neutral." },
              negative: { type: "integer", description: "Mentions classified as negative." },
              lastCheckedAt: {
                type: ["string", "null"],
                description: "Latest answer captured, or `null` when there are none.",
              },
              score: {
                type: ["number", "null"],
                description:
                  "Sentiment score from 0 to 100: positive counts 100, neutral 50, negative 0, averaged over classified mentions. `null` without classified mentions.",
              },
              classifiedMentions: {
                type: "integer",
                description: "Mentions with a sentiment: positive + neutral + negative.",
              },
              unknownMentions: { type: "integer", description: "Mentions without a sentiment classification." },
              notMentioned: { type: "integer", description: "Answers that did not mention the brand." },
              positiveShare: {
                type: ["number", "null"],
                description:
                  "Share of classified mentions that are positive, from 0 to 1. `null` without classified mentions.",
              },
              neutralShare: {
                type: ["number", "null"],
                description:
                  "Share of classified mentions that are neutral, from 0 to 1. `null` without classified mentions.",
              },
              negativeShare: {
                type: ["number", "null"],
                description:
                  "Share of classified mentions that are negative, from 0 to 1. `null` without classified mentions.",
              },
              classificationCoverage: {
                type: ["number", "null"],
                description: "Share of mentions that have a sentiment, from 0 to 1. `null` without mentions.",
              },
            },
            required: [
              "totalChecks",
              "mentions",
              "positive",
              "neutral",
              "negative",
              "lastCheckedAt",
              "score",
              "classifiedMentions",
              "unknownMentions",
              "notMentioned",
              "positiveShare",
              "neutralShare",
              "negativeShare",
              "classificationCoverage",
            ],
            description: "Totals for the previous period.",
          },
          points: {
            type: "array",
            items: {
              type: "object",
              properties: {
                totalChecks: {
                  type: "integer",
                  description:
                    "Answers to tracked prompts in the project's prompt language. Sequence and persona answers are not counted.",
                },
                mentions: { type: "integer", description: "Answers that mentioned the tracked brand." },
                positive: { type: "integer", description: "Mentions classified as positive." },
                neutral: { type: "integer", description: "Mentions classified as neutral." },
                negative: { type: "integer", description: "Mentions classified as negative." },
                lastCheckedAt: {
                  type: ["string", "null"],
                  description: "Latest answer captured, or `null` when there are none.",
                },
                score: {
                  type: ["number", "null"],
                  description:
                    "Sentiment score from 0 to 100: positive counts 100, neutral 50, negative 0, averaged over classified mentions. `null` without classified mentions.",
                },
                classifiedMentions: {
                  type: "integer",
                  description: "Mentions with a sentiment: positive + neutral + negative.",
                },
                unknownMentions: { type: "integer", description: "Mentions without a sentiment classification." },
                notMentioned: { type: "integer", description: "Answers that did not mention the brand." },
                positiveShare: {
                  type: ["number", "null"],
                  description:
                    "Share of classified mentions that are positive, from 0 to 1. `null` without classified mentions.",
                },
                neutralShare: {
                  type: ["number", "null"],
                  description:
                    "Share of classified mentions that are neutral, from 0 to 1. `null` without classified mentions.",
                },
                negativeShare: {
                  type: ["number", "null"],
                  description:
                    "Share of classified mentions that are negative, from 0 to 1. `null` without classified mentions.",
                },
                classificationCoverage: {
                  type: ["number", "null"],
                  description: "Share of mentions that have a sentiment, from 0 to 1. `null` without mentions.",
                },
                day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
              },
              required: [
                "totalChecks",
                "mentions",
                "positive",
                "neutral",
                "negative",
                "lastCheckedAt",
                "score",
                "classifiedMentions",
                "unknownMentions",
                "notMentioned",
                "positiveShare",
                "neutralShare",
                "negativeShare",
                "classificationCoverage",
                "day",
              ],
            },
            description: "One point per UTC day of the previous period.",
          },
          delta: {
            type: ["number", "null"],
            description:
              "Current `score` minus previous `score`, in points. `null` when either period has no classified mentions.",
          },
        },
        required: ["current", "previous", "summary", "points", "delta"],
        description: "The selected period compared with the one before it. Always returned by this endpoint.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "summary", "engines", "points", "organization"],
  },
  getGeoSentimentAnalysis: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["ready", "pending", "stale", "failed", "unavailable"],
        description:
          "`ready` when the stored analysis matches the current answers, `pending` while an analysis runs, `stale` when it is missing or older than the current answers, `failed` when the last run failed, `unavailable` when the brand name or the cache is not set up. This endpoint only reads stored analyses and never starts one.",
      },
      result: {
        type: ["object", "null"],
        properties: {
          fingerprint: { type: "string", description: "Identifies the set of answers that was analyzed." },
          generatedAt: { type: "string" },
          sampled: { type: "integer", description: "Answers sent to the model, at most 12 positive and 12 negative." },
          eligible: {
            type: "integer",
            description: "Positive or negative brand mentions in the period when the analysis ran.",
          },
          themes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string", description: "The attribute praised or criticized." },
                polarity: { type: "string", enum: ["positive", "negative"] },
                claims: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      statement: {
                        type: "string",
                        description: "What the answers say about the brand, written by the model.",
                      },
                      evidence: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            checkId: { type: "string", description: "Id of the answer the quote comes from." },
                            quote: {
                              type: "string",
                              description:
                                "Quote from that answer. It matches the answer text except for whitespace, quote marks and dash style.",
                            },
                            prompt: { type: "string" },
                            engine: { type: "string" },
                            capturedAt: { type: "string" },
                          },
                          required: ["checkId", "quote", "prompt", "engine", "capturedAt"],
                        },
                        description:
                          "Quotes backing this claim, each checked against its answer text. Claims without a matching quote are dropped.",
                      },
                    },
                    required: ["statement", "evidence"],
                  },
                  description: "Claims under this theme, each with at least one verified quote.",
                },
                evidence: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      checkId: { type: "string", description: "Id of the answer the quote comes from." },
                      quote: {
                        type: "string",
                        description:
                          "Quote from that answer. It matches the answer text except for whitespace, quote marks and dash style.",
                      },
                      prompt: { type: "string" },
                      engine: { type: "string" },
                      capturedAt: { type: "string" },
                    },
                    required: ["checkId", "quote", "prompt", "engine", "capturedAt"],
                  },
                  description:
                    "Every quote from the theme's claims in one list, in claim order, with repeated quotes from the same answer listed once.",
                },
              },
              required: ["title", "polarity", "claims", "evidence"],
            },
          },
        },
        required: ["fingerprint", "generatedAt", "sampled", "eligible", "themes"],
        description:
          "The latest analysis. With `pending`, `stale` or `failed` it can be an earlier analysis of different answers. `null` when none is stored.",
      },
      message: {
        type: ["string", "null"],
        description: "Explanation for `stale`, `failed` or `unavailable`, otherwise `null`.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["status", "result", "message", "organization"],
  },
  getGeoSettings: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description:
          "Whether the analytics store behind AI traffic and web analytics is set up on this Notra deployment. It does not depend on the project or its settings.",
      },
      settings: {
        anyOf: [
          {
            type: "object",
            properties: {
              id: { type: "string" },
              organizationId: { type: "string" },
              projectId: { type: "string" },
              companyName: { type: "string", description: "Brand name that scans look for in AI answers." },
              aliases: {
                type: "array",
                items: { type: "string" },
                description: "Other names that also count as a brand mention.",
              },
              conversionPaths: {
                type: "array",
                items: { type: "string" },
                description: "Paths that count as a conversion when an AI referral reaches them. Prefix match.",
              },
              domains: {
                type: "array",
                items: { type: "string" },
                description:
                  "Additional hostnames that send AI traffic to this project, besides the brand website. Subdomains are included.",
              },
              competitors: {
                type: "array",
                items: { type: "string" },
                description: "Names of the project's competitors, kept in sync with the competitors endpoints.",
              },
              languages: {
                type: "array",
                items: { type: "string" },
                description: "Supported languages scans run in. Unsupported or duplicate stored values are left out.",
              },
              engines: {
                type: "array",
                items: { type: "string" },
                description:
                  "Engine ids scans run on, from GET /v1/projects/{projectId}/geo/engines. Unknown ids are dropped and the default set is used when none remain. With enforceZdr on, engines that can't run under zero data retention are left out.",
              },
              enforceZdr: {
                type: "boolean",
                description: "Only run engines with zero data retention, plus those listed in nonZdrApprovedEngines.",
              },
              nonZdrApprovedEngines: {
                type: "array",
                items: { type: "string" },
                description: "Engines without zero data retention that may still run while enforceZdr is on.",
              },
              trackWithoutSearch: {
                type: "boolean",
                description: "Also scan search-capable models without web search.",
              },
              pausedAutoPromptIds: {
                type: "array",
                items: { type: "string" },
                description: "Ids of auto-generated prompts skipped in scans.",
              },
              removedAutoPromptIds: {
                type: "array",
                items: { type: "string" },
                description: "Ids of auto-generated prompts removed from tracking.",
              },
              enabled: { type: "boolean", description: "Whether recurring scans run." },
              scanIntervalHours: { type: "integer", description: "Hours between automatic scans, in whole days." },
              scanStartedAt: {
                type: ["string", "null"],
                description: "When the scan in progress started. Usually cleared when it finishes.",
              },
              lastScanAt: {
                type: ["string", "null"],
                description:
                  "When the latest scan finished, whether it succeeded or failed. Null before the first scan.",
              },
              isScanning: {
                type: "boolean",
                description: "A scan started after the latest finished one and less than two hours ago.",
              },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
            required: [
              "id",
              "organizationId",
              "projectId",
              "companyName",
              "aliases",
              "conversionPaths",
              "domains",
              "competitors",
              "languages",
              "engines",
              "enforceZdr",
              "nonZdrApprovedEngines",
              "trackWithoutSearch",
              "pausedAutoPromptIds",
              "removedAutoPromptIds",
              "enabled",
              "scanIntervalHours",
              "scanStartedAt",
              "lastScanAt",
              "isScanning",
              "createdAt",
              "updatedAt",
            ],
          },
          { type: "null" },
        ],
        description:
          "Null when the project has no saved GEO settings yet. Save them with PATCH /v1/projects/{projectId}/geo/settings.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "settings", "organization"],
  },
  getGeoTrafficJourney: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description:
          "False when the traffic backend is not configured for this deployment; the payload is then empty rather than an error.",
      },
      events: {
        type: "array",
        items: {
          type: "object",
          properties: {
            capturedAt: {
              type: "string",
              description: "UTC time of the request, formatted `YYYY-MM-DD HH:MM:SS` with no time zone suffix.",
            },
            path: { type: "string" },
            host: { type: "string" },
            method: { type: "string", description: "HTTP method, uppercase." },
            referer: {
              type: "string",
              description: "Referrer origin and path without the query string. Empty when absent.",
            },
            country: { type: "string", description: "Country from the request's geo data. Empty when unknown." },
            agent: { type: "string", description: "Crawler that made the request. Empty for referrals." },
            category: {
              type: "string",
              description:
                "Request purpose, such as training-crawler, search-index or assistant-browse (an assistant reading the page live to answer). assistant-referral for referrals.",
            },
          },
          required: ["capturedAt", "path", "host", "method", "referer", "country", "agent", "category"],
        },
        description: "The journey's requests within the window, oldest first, up to 200.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "events", "organization"],
  },
  getGeoTrafficJourneyStats: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description:
          "False when the analytics backend is not configured for this deployment; the payload is then empty rather than an error.",
      },
      sources: {
        type: "array",
        items: {
          type: "object",
          properties: {
            source: { type: "string" },
            visitorType: { type: "string", enum: ["crawler", "ai_referral", "human", "unknown"] },
            journeys: { type: "integer", description: "Journeys that started in the window." },
            previousJourneys: {
              type: "integer",
              description:
                "Journeys that started in the previous window of the same length, immediately before this one.",
            },
            pages: { type: "integer", description: "Requests across the window's journeys." },
            singleFetch: { type: "integer", description: "Journeys with a single request." },
            deepCrawls: { type: "integer", description: "Journeys with 10 or more requests." },
            lastSeenAt: {
              type: ["string", "null"],
              description:
                "Latest request of a journey that started in the window. Null when none started in the window.",
            },
            daily: {
              type: "array",
              items: {
                type: "object",
                properties: { day: { type: "string" }, journeys: { type: "integer" } },
                required: ["day", "journeys"],
              },
              description:
                "Journeys per UTC day in the window, by the day they started. Days without journeys are omitted.",
            },
          },
          required: [
            "source",
            "visitorType",
            "journeys",
            "previousJourneys",
            "pages",
            "singleFetch",
            "deepCrawls",
            "lastSeenAt",
            "daily",
          ],
        },
        description:
          "AI crawler and AI referral journeys per source, most journeys first. A journey belongs to the window it started in.",
      },
      pages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            path: { type: "string", description: "Path without query string or trailing slash." },
            journeys: { type: "integer", description: "Journeys started in the window that fetched this page." },
            previousJourneys: { type: "integer" },
            entries: { type: "integer", description: "Journeys whose first fetch was this page." },
            lastSeenAt: {
              type: ["string", "null"],
              description:
                "Latest request of a journey that started in the window. Null when none started in the window.",
            },
            daily: {
              type: "array",
              items: {
                type: "object",
                properties: { day: { type: "string" }, journeys: { type: "integer" } },
                required: ["day", "journeys"],
              },
              description:
                "Journeys per UTC day in the window, by the day they started. Days without journeys are omitted.",
            },
          },
          required: ["path", "journeys", "previousJourneys", "entries", "lastSeenAt", "daily"],
        },
        description: "Up to 500 pages fetched in the window's journeys, most journeys first.",
      },
      totalPages: {
        type: "integer",
        description: "Distinct pages fetched by journeys in the window, before the 500-page cap.",
      },
      previousTotalPages: {
        type: "integer",
        description: "Distinct pages fetched by journeys in the previous window.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "sources", "pages", "totalPages", "previousTotalPages", "organization"],
  },
  getGeoTrafficLog: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description:
          "False when the traffic backend is not configured for this deployment; the payload is then empty rather than an error.",
      },
      log: {
        type: "array",
        items: {
          type: "object",
          properties: {
            capturedAt: {
              type: "string",
              description: "UTC time of the request, formatted `YYYY-MM-DD HH:MM:SS` with no time zone suffix.",
            },
            visitorType: {
              type: "string",
              enum: ["crawler", "ai_referral", "human", "unknown"],
              description:
                "crawler: an AI bot fetched the page. ai_referral: a person arrived from an AI assistant's link.",
            },
            source: {
              type: "string",
              description: "Crawler name for crawlers, or the AI assistant a referral came from.",
            },
            agent: { type: "string", description: "Crawler that made the request. Empty for referrals." },
            category: {
              type: "string",
              description:
                "Request purpose, such as training-crawler, search-index or assistant-browse (an assistant reading the page live to answer). assistant-referral for referrals.",
            },
            confidence: {
              type: "string",
              description:
                "How the visitor was identified. verified: a crawler user agent whose operator publishes a way to verify it, such as IP ranges; Notra matches the user agent and does not check the IP. reported: a user agent the operator documents without verification, a known request fingerprint, a fetch of a machine-readable file, or, for AI referrals, the referrer. Sources detected only by heuristics are left out of these endpoints.",
            },
            path: { type: "string" },
            host: { type: "string" },
            country: { type: "string", description: "Country from the request's geo data. Empty when unknown." },
            ua: {
              type: "string",
              description:
                "First 180 characters of the user agent. Empty for AI referrals, whose user agent is not stored.",
            },
            journeyId: {
              type: "string",
              description:
                "Groups requests from one agent session; pass it to getGeoTrafficJourney. Empty when no journey could be derived.",
            },
            wantsMarkdown: {
              type: "boolean",
              description: "Whether the request asked for Markdown or fetched a machine-readable file.",
            },
          },
          required: [
            "capturedAt",
            "visitorType",
            "source",
            "agent",
            "category",
            "confidence",
            "path",
            "host",
            "country",
            "ua",
            "journeyId",
            "wantsMarkdown",
          ],
        },
        description: "Newest requests first, from the last 90 days.",
      },
      total: { type: "integer", description: "Number of entries in log, not the overall request count." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "log", "total", "organization"],
  },
  getGeoTrafficOverview: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description:
          "False when the traffic backend is not configured for this deployment; the payload is then empty rather than an error.",
      },
      totals: {
        type: "object",
        properties: {
          crawler: { type: "integer", description: "Requests from AI crawlers in the window." },
          cited: {
            type: "integer",
            description:
              "Crawler requests with category assistant-browse: assistants reading pages live while answering. Included in crawler.",
          },
          aiReferral: { type: "integer", description: "Visits from people following a link in an AI assistant." },
          conversions: {
            type: ["integer", "null"],
            description:
              "AI referral visits that reached a configured conversion path. Null when no conversion paths are set.",
          },
        },
        required: ["crawler", "cited", "aiReferral", "conversions"],
      },
      previousConversions: {
        type: ["integer", "null"],
        description:
          "Conversions in the previous window of the same length. Null when no conversion paths are set or no comparison data exists.",
      },
      sources: {
        type: "array",
        items: {
          type: "object",
          properties: {
            source: {
              type: "string",
              description: "Crawler name for crawlers, or the AI assistant a referral came from.",
            },
            visitorType: {
              type: "string",
              enum: ["crawler", "ai_referral", "human", "unknown"],
              description:
                "crawler: an AI bot fetched the page. ai_referral: a person arrived from an AI assistant's link.",
            },
            agent: { type: "string", description: "Crawler that made the request. Empty for referrals." },
            category: {
              type: "string",
              description:
                "Request purpose, such as training-crawler, search-index or assistant-browse (an assistant reading the page live to answer). assistant-referral for referrals.",
            },
            confidence: {
              type: "string",
              description:
                "How the visitor was identified. verified: a crawler user agent whose operator publishes a way to verify it, such as IP ranges; Notra matches the user agent and does not check the IP. reported: a user agent the operator documents without verification, a known request fingerprint, a fetch of a machine-readable file, or, for AI referrals, the referrer. Sources detected only by heuristics are left out of these endpoints.",
            },
            visits: { type: "integer", description: "Requests in the window, including imported history." },
            previousVisits: {
              type: "integer",
              description: "Requests in the previous window of the same length, right before this one.",
            },
            markdownVisits: {
              type: "integer",
              description:
                "Requests that asked for Markdown or a machine-readable file. 0 when filtering by host or path, and for imported history.",
            },
            previousMarkdownVisits: {
              type: "integer",
              description: "Markdown requests in the previous window of the same length, right before this one.",
            },
            paths: { type: "integer", description: "Distinct page paths requested in the window." },
            previousPaths: {
              type: "integer",
              description: "Distinct paths in the previous window of the same length, right before this one.",
            },
            lastSeenAt: {
              type: "string",
              description:
                "UTC time of the newest request in the window, formatted `YYYY-MM-DD HH:MM:SS` with no time zone suffix. Midnight of the day for imported history. `1970-01-01 00:00:00` when the source only had requests in the previous window.",
            },
          },
          required: [
            "source",
            "visitorType",
            "agent",
            "category",
            "confidence",
            "visits",
            "markdownVisits",
            "paths",
            "lastSeenAt",
          ],
        },
        description: "One row per source and visitor type, crawlers and AI referrals only, most requests first.",
      },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
            visitorType: {
              type: "string",
              enum: ["crawler", "ai_referral", "human", "unknown"],
              description:
                "crawler: an AI bot fetched the page. ai_referral: a person arrived from an AI assistant's link.",
            },
            source: {
              type: "string",
              description: "Crawler name for crawlers, or the AI assistant a referral came from.",
            },
            visits: { type: "integer", description: "Requests from this source on this day." },
          },
          required: ["day", "visitorType", "source", "visits"],
        },
        description: "Daily requests per source and visitor type.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "totals", "previousConversions", "sources", "points", "organization"],
  },
  getGeoVisibilityCompetitorDetail: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description: "Always true for visibility data, which is read from Notra's own database.",
      },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
            mentions: { type: "integer", description: "Checks that day whose answer named this brand." },
            checks: { type: "integer", description: "All checks run that day, for computing a mention rate." },
          },
          required: ["day", "mentions", "checks"],
        },
        description: "One point per day with checks, oldest first.",
      },
      prompts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            promptId: { type: "string" },
            prompt: { type: "string" },
            engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
            capturedAt: {
              type: "string",
              description: "ISO timestamp of the latest answer for this prompt and engine.",
            },
            mentioned: { type: "boolean", description: "Whether that answer also named your own brand." },
            position: {
              type: ["integer", "null"],
              description: "Your brand's 1-based rank in that answer. Null when not mentioned or not in a list.",
            },
          },
          required: ["promptId", "prompt", "engine", "capturedAt", "mentioned", "position"],
        },
        description:
          "Latest answer per prompt and engine that named this brand, newest first. Persona conversations are left out.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "points", "prompts", "organization"],
  },
  getGeoVisibilityCompetitorShare: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description: "Always true for visibility data, which is read from Notra's own database.",
      },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            brand: {
              type: "string",
              description:
                "Brand name as answers named it; your own brand appears under its company name. Use it as `brand` in getGeoVisibilityCompetitorDetail.",
            },
            mentions: { type: "integer", description: "Checks in the window whose answer named this brand." },
            trend: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
                  value: { type: "number" },
                },
                required: ["day", "value"],
              },
              description:
                "Daily share of this brand among the mentions of the listed brands, as a fraction from 0 to 1.",
            },
          },
          required: ["brand", "mentions"],
        },
        description: "Up to 50 brands, most mentioned first. Includes your own brand when answers mentioned it.",
      },
      timeseries: {
        type: "array",
        items: {
          type: "object",
          properties: {
            brand: {
              type: "string",
              description:
                "Brand name as answers named it; your own brand appears under its company name. Use it as `brand` in getGeoVisibilityCompetitorDetail.",
            },
            day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
            mentions: { type: "integer", description: "Checks that day whose answer named this brand." },
          },
          required: ["brand", "day", "mentions"],
        },
        description: "Daily mentions per brand, oldest first, for every brand named in the window.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "points", "timeseries", "organization"],
  },
  getGeoVisibilityLanguageShare: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description: "Always true for visibility data, which is read from Notra's own database.",
      },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            language: { type: "string", description: "Language name, such as English." },
            checks: {
              type: "integer",
              description:
                "Checks run: one per prompt, engine, language and scan. A multi-turn conversation counts once.",
            },
            mentions: { type: "integer", description: "Checks whose answer named your brand or one of its aliases." },
            mentionRate: {
              type: "number",
              description: "mentions / checks as a fraction from 0 to 1, rounded to 3 decimals.",
            },
            citations: {
              type: "integer",
              description: "Checks whose answer cited a page on your website or tracked domains.",
            },
            visibility: { type: "integer", description: "Checks that mentioned your brand or cited your site." },
            visibilityRate: {
              type: "number",
              description: "visibility / checks as a fraction from 0 to 1, rounded to 3 decimals.",
            },
            avgPosition: {
              type: ["number", "null"],
              description:
                "Average 1-based rank of your brand in answers that listed brands, rounded to 1 decimal. Null when no mentioned answer had a rank.",
            },
            trend: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
                  value: { type: "number" },
                },
                required: ["day", "value"],
              },
              description: "Daily visibility rate for this language, from 0 to 1.",
            },
          },
          required: [
            "language",
            "checks",
            "mentions",
            "mentionRate",
            "citations",
            "visibility",
            "visibilityRate",
            "avgPosition",
          ],
        },
        description: "One row per language, highest visibility rate first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "points", "organization"],
  },
  getGeoVisibilityOverview: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description: "Always true for visibility data, which is read from Notra's own database.",
      },
      engines: {
        type: "array",
        items: {
          type: "object",
          properties: {
            engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
            checks: {
              type: "integer",
              description:
                "Checks run: one per prompt, engine, language and scan. A multi-turn conversation counts once.",
            },
            mentions: { type: "integer", description: "Checks whose answer named your brand or one of its aliases." },
            mentionRate: {
              type: "number",
              description: "mentions / checks as a fraction from 0 to 1, rounded to 3 decimals.",
            },
            citations: {
              type: "integer",
              description: "Checks whose answer cited a page on your website or tracked domains.",
            },
            visibility: { type: "integer", description: "Checks that mentioned your brand or cited your site." },
            visibilityRate: {
              type: "number",
              description: "visibility / checks as a fraction from 0 to 1, rounded to 3 decimals.",
            },
            avgPosition: {
              type: ["number", "null"],
              description:
                "Average 1-based rank of your brand in answers that listed brands, rounded to 1 decimal. Null when no mentioned answer had a rank.",
            },
            lastCheckedAt: {
              type: "string",
              description: "ISO timestamp of the newest check for this engine in the window.",
            },
          },
          required: [
            "engine",
            "checks",
            "mentions",
            "mentionRate",
            "citations",
            "visibility",
            "visibilityRate",
            "avgPosition",
            "lastCheckedAt",
          ],
        },
        description:
          "One row per engine, highest visibility rate first. Counts every answer in the window, including sequences, personas and all tracked languages.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "engines", "organization"],
  },
  getGeoVisibilityPromptResults: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description: "Always true for visibility data, which is read from Notra's own database.",
      },
      results: {
        type: "array",
        items: {
          type: "object",
          properties: {
            promptId: { type: "string", description: "Prompt id; use it with getGeoPromptHistory." },
            engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
            prompt: { type: "string", description: "Prompt text sent to the engine." },
            answer: { type: "string", description: "Full answer text from the engine." },
            mentioned: { type: "boolean", description: "Whether the answer named your brand or one of its aliases." },
            ownedSourceCited: {
              type: "boolean",
              description: "Whether the answer cited a page on your website or tracked domains.",
            },
            position: {
              type: ["integer", "null"],
              description:
                "1-based rank of your brand when the answer lists brands. Null when not mentioned or not in a list.",
            },
            sentiment: {
              type: ["string", "null"],
              description: "Tone toward your brand: positive, neutral or negative. Null when not mentioned.",
            },
            competitors: {
              type: "array",
              items: { type: "string" },
              description: "Alternative brands the answer offered instead of yours, in order of first appearance.",
            },
            excerpt: {
              type: "string",
              description: "Up to 300 characters around the mention, or the start of the answer when not mentioned.",
            },
            searchQueries: {
              type: "array",
              items: { type: "string" },
              description: "Web searches the engine ran while answering, when reported.",
            },
            sources: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Source title, falling back to its domain or URL." },
                  url: { type: "string" },
                  domain: {
                    type: "string",
                    description: "Source domain; empty when it cannot be derived from the URL.",
                  },
                },
                required: ["title", "url", "domain"],
              },
              description: "Grounding sources the answer cited, deduplicated by URL.",
            },
            lastCheckedAt: { type: "string", description: "ISO timestamp when this answer was captured." },
          },
          required: [
            "promptId",
            "engine",
            "prompt",
            "answer",
            "mentioned",
            "ownedSourceCited",
            "position",
            "sentiment",
            "competitors",
            "excerpt",
            "searchQueries",
            "sources",
            "lastCheckedAt",
          ],
        },
        description:
          "Latest answer per tracked prompt and engine, newest first. Only tracked prompts in the project's prompt language; sequences and personas are left out.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "results", "organization"],
  },
  getGeoVisibilityTimeseries: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description: "Always true for visibility data, which is read from Notra's own database.",
      },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
            engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
            checks: {
              type: "integer",
              description:
                "Checks run: one per prompt, engine, language and scan. A multi-turn conversation counts once.",
            },
            mentions: { type: "integer", description: "Checks whose answer named your brand or one of its aliases." },
            citations: {
              type: "integer",
              description: "Checks whose answer cited a page on your website or tracked domains.",
            },
            visibility: { type: "integer", description: "Checks that mentioned your brand or cited your site." },
            avgPosition: {
              type: ["number", "null"],
              description:
                "Average 1-based rank of your brand in answers that listed brands, rounded to 1 decimal. Null when no mentioned answer had a rank.",
            },
          },
          required: ["day", "engine", "checks", "mentions", "citations", "visibility"],
        },
        description: "One point per day and engine that had checks, oldest first. Days without checks are omitted.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "points", "organization"],
  },
  getGeoWebAnalytics: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description:
          "False when the analytics backend is not configured for this deployment; the payload is then empty rather than an error.",
      },
      imported: {
        type: ["object", "null"],
        properties: {
          provider: {
            type: "string",
            enum: [
              "plausible",
              "plausible_csv",
              "vercel",
              "cloudflare",
              "cloudflare_rum",
              "rybbit",
              "databuddy",
              "posthog",
            ],
          },
          until: { type: "string", description: "Last imported day." },
          nativeStart: { type: ["string", "null"], description: "First day Notra tracked natively, when known." },
        },
        required: ["provider", "until", "nativeStart"],
        description:
          "Latest completed history import. Days up to `until` come from it; native tracking starts the day after.",
      },
      hosts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            host: { type: "string" },
            siteId: { type: "string", description: "Notra Sites site id, empty for your own domains." },
            views: {
              type: "integer",
              description: "Human page views in the window; 0 for a Notra Sites site that only has AI traffic.",
            },
          },
          required: ["host", "siteId", "views"],
        },
        description: "Hosts with page views in the window, ignoring the host filter, most viewed first.",
      },
      totals: {
        type: "object",
        properties: {
          views: { type: "integer", description: "Human page views in the window, including imported history." },
          previousViews: {
            type: "integer",
            description: "Page views in the previous window of the same length, immediately before this one.",
          },
          visitors: { type: "integer" },
          previousVisitors: { type: "integer" },
          sessions: { type: "integer", description: "Sessions, counted on each session's first page." },
          previousSessions: { type: "integer" },
          engagedSessions: {
            type: "integer",
            description: "Sessions that viewed at least two pages. For imported history, visits minus bounces.",
          },
          aiVisitors: { type: "integer", description: "Visitors who arrived from an AI assistant." },
          previousAiVisitors: { type: "integer" },
        },
        required: [
          "views",
          "previousViews",
          "visitors",
          "previousVisitors",
          "sessions",
          "previousSessions",
          "engagedSessions",
          "aiVisitors",
          "previousAiVisitors",
        ],
      },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
            views: { type: "integer" },
            visitors: { type: "integer" },
          },
          required: ["day", "views", "visitors"],
        },
        description: "Daily human page views and unique visitors, including imported history.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "hosts", "totals", "points", "organization"],
  },
  getGeoWebAnalyticsBreakdowns: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description:
          "False when the analytics backend is not configured for this deployment; the payload is then empty rather than an error.",
      },
      imported: {
        type: ["object", "null"],
        properties: {
          provider: {
            type: "string",
            enum: [
              "plausible",
              "plausible_csv",
              "vercel",
              "cloudflare",
              "cloudflare_rum",
              "rybbit",
              "databuddy",
              "posthog",
            ],
          },
          until: { type: "string", description: "Last imported day." },
          nativeStart: { type: ["string", "null"], description: "First day Notra tracked natively, when known." },
        },
        required: ["provider", "until", "nativeStart"],
        description:
          "Latest completed history import. Days up to `until` come from it; native tracking starts the day after.",
      },
      pages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            host: { type: "string" },
            path: { type: "string" },
            views: { type: "integer" },
            previousViews: {
              type: "integer",
              description: "Views in the previous window of the same length, immediately before this one.",
            },
            visitors: { type: "integer" },
            landings: { type: "integer", description: "Sessions that started on this page." },
            aiVisitors: {
              type: "integer",
              description: "Visitors referred by an AI assistant. Imported history does not contribute.",
            },
          },
          required: ["host", "path", "views", "previousViews", "visitors", "landings", "aiVisitors"],
        },
        description: "Top 50 pages by human views.",
      },
      sources: {
        type: "array",
        items: {
          type: "object",
          properties: {
            group: {
              type: "string",
              description:
                "Referrer group of the session's first page: ai, direct, search, social or other. Internal referrals are left out.",
            },
            source: { type: "string" },
            aiProduct: {
              type: "string",
              description:
                "Company behind the AI source, such as openai, anthropic, google or microsoft; the source itself when Notra has no mapping. Empty for non-AI groups.",
            },
            sessions: { type: "integer", description: "Sessions whose first page had this referrer." },
            previousSessions: { type: "integer" },
            visitors: { type: "integer" },
          },
          required: ["group", "source", "aiProduct", "sessions", "previousSessions", "visitors"],
        },
        description: "Top 25 referrer sources by sessions. With a path, only sessions that landed on it.",
      },
      countries: {
        type: "array",
        items: {
          type: "object",
          properties: {
            value: { type: "string" },
            visitors: { type: "integer", description: "Visitors in the window." },
            previousVisitors: {
              type: ["integer", "null"],
              description:
                "Visitors in the previous window of the same length, immediately before this one. Returned on every row; 0 when there were none.",
            },
          },
          required: ["value", "visitors"],
        },
        description: "Top 8 ISO 3166-1 alpha-2 country codes by visitors.",
      },
      devices: {
        type: "array",
        items: {
          type: "object",
          properties: {
            value: { type: "string" },
            visitors: { type: "integer", description: "Visitors in the window." },
            previousVisitors: {
              type: ["integer", "null"],
              description:
                "Visitors in the previous window of the same length, immediately before this one. Returned on every row; 0 when there were none.",
            },
          },
          required: ["value", "visitors"],
        },
        description: "Top 8 device classes by visitors.",
      },
      outcomes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            source: {
              type: "string",
              description:
                "AI source the session landed from. The row with an empty source covers all sessions, AI-referred ones included.",
            },
            sessions: { type: "integer" },
            pagesPerSession: { type: "number", description: "Average page views per session." },
            engagedRate: {
              type: "number",
              description: "Share of sessions that viewed two or more pages, from 0 to 1.",
            },
          },
          required: ["source", "sessions", "pagesPerSession", "engagedRate"],
        },
        description:
          "How sessions from each AI source behave compared to all sessions. Native tracking only, without imported history.",
      },
      outboundLinks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            url: { type: "string", description: "Destination host and path, without the query." },
            clicks: { type: "integer" },
            previousClicks: {
              type: "integer",
              description: "Clicks in the previous window of the same length, immediately before this one.",
            },
            visitors: { type: "integer", description: "Unique visitors who clicked." },
          },
          required: ["url", "clicks", "previousClicks", "visitors"],
        },
        description: "Top 25 clicked links to other sites, reported by notra.js.",
      },
      vitals: {
        type: "array",
        items: {
          type: "object",
          properties: {
            metric: { type: "string", enum: ["lcp", "inp", "cls", "fcp", "ttfb"] },
            p75: {
              type: "number",
              description: "75th percentile in milliseconds, or the layout shift score x1000 for cls.",
            },
            samples: { type: "integer", description: "Page views that reported this metric." },
          },
          required: ["metric", "p75", "samples"],
        },
        description:
          "Core Web Vitals from real visits across all devices. Each page view counts once with its largest reported value.",
      },
      errors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            message: { type: "string", description: "Scrubbed before storage: no query strings, emails or long ids." },
            source: { type: "string" },
            events: { type: "integer", description: "Times this error was reported." },
            views: { type: "integer", description: "Distinct page views that reported this error." },
          },
          required: ["message", "source", "events", "views"],
        },
        description: "Top 25 JavaScript errors reported by notra.plus.js, by count.",
      },
      languages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            value: { type: "string" },
            visitors: { type: "integer", description: "Visitors in the window." },
            previousVisitors: {
              type: ["integer", "null"],
              description:
                "Visitors in the previous window of the same length, immediately before this one. Returned on every row; 0 when there were none.",
            },
          },
          required: ["value", "visitors"],
        },
        description: "Top 8 browser languages by visitors, reported by notra.js.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: [
      "configured",
      "pages",
      "sources",
      "countries",
      "devices",
      "outcomes",
      "outboundLinks",
      "vitals",
      "errors",
      "languages",
      "organization",
    ],
  },
  getGeoWebAnalyticsUtm: {
    type: "object",
    properties: {
      dimension: { type: "string", enum: ["source", "medium", "campaign", "term", "content"] },
      rows: {
        type: "array",
        items: {
          type: "object",
          properties: {
            value: {
              type: "string",
              description:
                "Source and medium are lowercased. Campaign, term and content values that look like an email address, a UUID or a token are reported as `:id`.",
            },
            sessions: { type: "integer", description: "Sessions whose first page carried this UTM value." },
            previousSessions: {
              type: "integer",
              description: "Sessions in the previous window of the same length, immediately before this one.",
            },
            visitors: { type: "integer" },
          },
          required: ["value", "sessions", "previousSessions", "visitors"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["dimension", "rows", "organization"],
  },
  getGitHubActivity: {
    type: "object",
    properties: {
      integration: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description:
              "GitHub integration ID. Use it in integrations.github for post generation, as integrationId for post pull requests and as repositoryId for scheduled GitHub publishing.",
          },
          displayName: {
            type: "string",
            description: "Label for the repository, owner/repo when created through the API.",
          },
          owner: {
            type: ["string", "null"],
            description:
              "Repository owner (user or organization). Null only for integrations connected before Notra stored the owner and repository name on the integration; every connection path sets both today.",
          },
          repo: {
            type: ["string", "null"],
            description: "Repository name without the owner. Null under the same condition as owner.",
          },
          defaultBranch: {
            type: ["string", "null"],
            description: "Branch Notra reads activity from. Null means the repository's default branch on GitHub.",
          },
        },
        required: ["id", "displayName", "owner", "repo", "defaultBranch"],
      },
      type: { type: "string", enum: ["pull_requests", "commits", "releases"] },
      since: { type: "string", description: "Start of the window used (ISO 8601), after defaults are applied." },
      until: { type: "string", description: "End of the window used (ISO 8601), after defaults are applied." },
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            ref: {
              type: "string",
              description: "Pull request number as a string, full commit SHA or release tag name, depending on type.",
            },
            title: {
              type: "string",
              description:
                "Pull request title, first line of the commit message, or release name (the tag name when the release has none).",
            },
            body: {
              type: ["string", "null"],
              description:
                "Pull request description, rest of the commit message after the first line, or release notes. Null when empty.",
            },
            author: {
              type: ["string", "null"],
              description:
                "GitHub login of the author. For commits without a linked GitHub account, the Git author name.",
            },
            url: { type: "string", description: "Link to the pull request, commit or release on GitHub." },
            occurredAt: { type: "string", description: "Merge, commit or publish time (ISO 8601)." },
          },
          required: ["ref", "title", "body", "author", "url", "occurredAt"],
        },
      },
      pagination: {
        type: "object",
        properties: {
          page: { type: "integer" },
          nextPage: {
            type: ["integer", "null"],
            description:
              "Next GitHub page to request, or null when there are no more items in the window. A page can hold fewer items than the page size while nextPage is set.",
          },
        },
        required: ["page", "nextPage"],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["integration", "type", "since", "until", "items", "pagination", "organization"],
  },
  getPost: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      post: {
        type: ["object", "null"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: {
            type: ["string", "null"],
            description: "URL slug. Only blog posts and changelogs have one; null when none is set.",
          },
          content: {
            type: "string",
            description:
              "Rendered HTML for text posts. For image posts, this is the public CDN URL of the rendered image.",
          },
          htmlUrl: {
            type: ["string", "null"],
            description: "Public CDN URL of the generated HTML artifact for image posts. Null for non-image posts.",
          },
          markdown: { type: ["string", "null"], description: "Markdown source for text posts. Null for image posts." },
          rawHtml: {
            type: ["string", "null"],
            description:
              "Legacy inline generated HTML for image posts. New generated image HTML is stored as htmlUrl. Null for non-image posts.",
          },
          recommendations: {
            type: ["string", "null"],
            description:
              "Publishing suggestions written by the generator as Markdown, such as when and where to share the post. Null when there are none.",
          },
          contentType: {
            type: "string",
            enum: ["changelog", "linkedin_post", "twitter_post", "blog_post", "investor_update", "image"],
          },
          sourceMetadata: {
            description:
              "Free-form JSON recorded by whatever produced the post, such as a generation run or chat. Null for posts created with POST /v1/posts. Posts from generation runs (POST /v1/posts/generate, schedules, event triggers and GEO content briefs) include brandVoiceId, the brand identity the run wrote in (absent when the workspace had none), which the brandIdentityId filter of GET /v1/posts reads.",
          },
          metadata: {
            type: ["object", "null"],
            properties: {
              coverImage: {
                type: ["object", "null"],
                properties: {
                  url: {
                    type: "string",
                    description:
                      "Absolute https URL, or a path to an image uploaded in Notra (starting with /api/uploads/).",
                  },
                  alt: { type: "string", description: "Alt text. Empty string when none is set." },
                },
                required: ["url", "alt"],
                description: "Cover image shown on post cards and social previews.",
              },
              tags: { type: "array", items: { type: "string" } },
              excerpt: {
                type: ["string", "null"],
                description:
                  "Summary shown on post cards and in meta descriptions. Null means it is derived from the first paragraph.",
              },
              authors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    slug: {
                      type: "string",
                      description: "Stable author handle; hosted sites list the author's posts at /author/{slug}.",
                    },
                    name: { type: "string" },
                    title: { type: ["string", "null"] },
                    avatarUrl: { type: ["string", "null"] },
                    url: { type: ["string", "null"], description: "Author's website." },
                    x: { type: ["string", "null"] },
                    linkedin: { type: ["string", "null"] },
                    github: { type: ["string", "null"] },
                    youtube: { type: ["string", "null"] },
                    bluesky: { type: ["string", "null"] },
                    mastodon: { type: ["string", "null"] },
                    threads: { type: ["string", "null"] },
                    instagram: { type: ["string", "null"] },
                  },
                  required: [
                    "id",
                    "slug",
                    "name",
                    "title",
                    "avatarUrl",
                    "url",
                    "x",
                    "linkedin",
                    "github",
                    "youtube",
                    "bluesky",
                    "mastodon",
                    "threads",
                    "instagram",
                  ],
                },
                description:
                  "Credited authors in display order. Authors deleted since they were assigned are omitted. On blog posts that publish to a Notra Sites site, authors whose id starts with site: come from the site's blog.json, unpublished Design changes included.",
              },
              featured: { type: "boolean", description: "Pinned to the top of the blog index on hosted sites." },
              noindex: {
                type: "boolean",
                description: "Asks search engines not to index the post and leaves it out of the sitemap.",
              },
              hidden: {
                type: "boolean",
                description:
                  "Reachable by direct link, but excluded from hosted site listings, feeds, search engine indexing, sitemaps and generated AI indexes. Not private.",
              },
              displayDate: {
                type: ["string", "null"],
                description: "Date shown on the post as YYYY-MM-DD. Null means the publish date is used.",
              },
            },
            required: ["coverImage", "tags", "excerpt", "authors", "featured", "noindex", "hidden", "displayDate"],
            description:
              "Cover image, tags, excerpt, authors and other site metadata. Set for blog posts and changelogs, null for every other content type.",
          },
          status: { type: "string", enum: ["draft", "published"] },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "title",
          "slug",
          "content",
          "htmlUrl",
          "markdown",
          "rawHtml",
          "recommendations",
          "contentType",
          "metadata",
          "status",
          "createdAt",
          "updatedAt",
        ],
        description: "Null when no post with this ID exists in the organization; the response is still 200.",
      },
    },
    required: ["organization", "post"],
  },
  getPostAgentReach: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      agentReach: {
        type: ["object", "null"],
        properties: {
          postId: { type: "string" },
          siteId: {
            type: "string",
            description: "Notra Site the post is live on. Use it with the /v1/sites endpoints.",
          },
          path: {
            type: "string",
            description:
              "Path the post is served at on its Site. Visits to its Markdown copy (`<path>.md`) and index files are counted too.",
          },
          url: { type: "string", description: "Public URL of the post on the Site's production origin." },
          configured: {
            type: "boolean",
            description:
              "False when the traffic backend is not configured for this deployment; the payload is then empty rather than an error.",
          },
          totals: {
            type: "object",
            properties: {
              crawled: { type: "integer", description: "Training and search-index crawler visits." },
              cited: {
                type: "integer",
                description: "Visits from assistants reading the page while answering someone.",
              },
              referred: { type: "integer", description: "People who clicked through from an AI answer." },
              total: { type: "integer", description: "Sum of crawled, cited and referred." },
            },
            required: ["crawled", "cited", "referred", "total"],
          },
          sources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                source: {
                  type: "string",
                  description: "Crawler name for crawlers, or the AI assistant a referral came from.",
                },
                visitorType: {
                  type: "string",
                  enum: ["crawler", "ai_referral", "human", "unknown"],
                  description:
                    "crawler: an AI bot fetched the page. ai_referral: a person arrived from an AI assistant's link.",
                },
                agent: { type: "string", description: "Crawler that made the request. Empty for referrals." },
                category: {
                  type: "string",
                  description:
                    "Request purpose, such as training-crawler, search-index or assistant-browse (an assistant reading the page live to answer). assistant-referral for referrals.",
                },
                confidence: {
                  type: "string",
                  description:
                    "How the visitor was identified. verified: a crawler user agent whose operator publishes a way to verify it, such as IP ranges; Notra matches the user agent and does not check the IP. reported: a user agent the operator documents without verification, a known request fingerprint, a fetch of a machine-readable file, or, for AI referrals, the referrer. Sources detected only by heuristics are left out of these endpoints.",
                },
                visits: { type: "integer", description: "Requests in the window, including imported history." },
                previousVisits: {
                  type: "integer",
                  description: "Requests in the previous window of the same length, right before this one.",
                },
                markdownVisits: {
                  type: "integer",
                  description:
                    "Requests that asked for Markdown or a machine-readable file. 0 when filtering by host or path, and for imported history.",
                },
                previousMarkdownVisits: {
                  type: "integer",
                  description: "Markdown requests in the previous window of the same length, right before this one.",
                },
                paths: { type: "integer", description: "Distinct page paths requested in the window." },
                previousPaths: {
                  type: "integer",
                  description: "Distinct paths in the previous window of the same length, right before this one.",
                },
                lastSeenAt: {
                  type: "string",
                  description:
                    "UTC time of the newest request in the window, formatted `YYYY-MM-DD HH:MM:SS` with no time zone suffix. Midnight of the day for imported history. `1970-01-01 00:00:00` when the source only had requests in the previous window.",
                },
              },
              required: [
                "source",
                "visitorType",
                "agent",
                "category",
                "confidence",
                "visits",
                "markdownVisits",
                "paths",
                "lastSeenAt",
              ],
            },
            description: "Visits per AI crawler and AI referral source in the window.",
          },
          points: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
                visitorType: {
                  type: "string",
                  enum: ["crawler", "ai_referral", "human", "unknown"],
                  description:
                    "crawler: an AI bot fetched the page. ai_referral: a person arrived from an AI assistant's link.",
                },
                source: {
                  type: "string",
                  description: "Crawler name for crawlers, or the AI assistant a referral came from.",
                },
                visits: { type: "integer", description: "Requests from this source on this day." },
              },
              required: ["day", "visitorType", "source", "visits"],
            },
            description: "Daily visits per source and visitor type.",
          },
        },
        required: ["postId", "siteId", "path", "url", "configured", "totals", "sources", "points"],
        description:
          "Null when the post isn't live on a Notra Site: never published to one, published to another branch, or the Site has no production deployment.",
      },
    },
    required: ["organization", "agentReach"],
  },
  getPostGeneration: {
    type: "object",
    properties: {
      job: {
        type: "object",
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          status: {
            type: "string",
            enum: ["queued", "running", "completed", "failed", "skipped"],
            description: "Job state. Terminal states are completed, failed, and skipped.",
          },
          contentType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
          lookbackWindow: {
            type: "string",
            enum: ["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"],
          },
          repositoryIds: {
            type: "array",
            items: { type: "string" },
            description:
              "Selected GitHub integration IDs. Empty when no GitHub source was selected. Every connected GitHub integration is used only when neither a GitHub nor a Linear source was selected.",
          },
          brandVoiceId: {
            type: ["string", "null"],
            description:
              "Brand identity the post is written in: the requested one, else the default, else the most recently updated. Null when the organization has none.",
          },
          workflowRunId: {
            type: ["string", "null"],
            description: "Internal workflow run ID. Null until the generation workflow has started.",
          },
          postId: {
            type: ["string", "null"],
            description: "ID of the generated post. Set once the job reaches completed.",
          },
          error: {
            type: ["string", "null"],
            description:
              "Failure reason when status is failed, or why generation was skipped (for example no meaningful source activity) when status is skipped.",
          },
          errorCode: {
            type: ["string", "null"],
            description:
              "Stable machine-readable failure code when status is failed, such as NO_ACTIVITY_TYPES_SELECTED or NO_AVAILABLE_SOURCES. Absent or null for other failures and for older jobs.",
          },
          source: { type: "string", enum: ["api", "dashboard"], description: "Where the job was started." },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          completedAt: {
            type: ["string", "null"],
            description: "When the job reached completed, failed or skipped. Null while it is queued or running.",
          },
        },
        required: [
          "id",
          "organizationId",
          "status",
          "contentType",
          "lookbackWindow",
          "repositoryIds",
          "brandVoiceId",
          "workflowRunId",
          "postId",
          "error",
          "source",
          "createdAt",
          "updatedAt",
          "completedAt",
        ],
      },
      events: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            jobId: { type: "string" },
            type: {
              type: "string",
              enum: [
                "queued",
                "workflow_triggered",
                "running",
                "fetching_repositories",
                "generating_content",
                "post_created",
                "completed",
                "failed",
                "skipped",
              ],
            },
            message: { type: "string", description: "Human-readable description of the event." },
            createdAt: { type: "string" },
            metadata: {
              type: ["object", "null"],
              additionalProperties: {},
              description:
                "Event details that vary by type, such as postId on post_created and completed, or errorCode on failed and skipped.",
            },
          },
          required: ["id", "jobId", "type", "message", "createdAt", "metadata"],
        },
        description: "The job's event log, oldest first, up to the 100 most recent events.",
      },
    },
    required: ["job", "events"],
  },
  getPostSchedule: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      schedule: {
        anyOf: [
          {
            type: "object",
            properties: {
              postId: { type: "string" },
              scheduledAt: {
                type: "string",
                format: "date-time",
                description: "When the post publishes (ISO 8601, UTC).",
              },
              timeZone: { type: "string", description: "IANA time zone the schedule was picked in, for display only." },
              publications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    destination: {
                      type: "string",
                      enum: ["notra", "github", "social"],
                      description:
                        "notra marks the post as published in Notra; github opens or merges a pull request; social posts to a connected X or LinkedIn account.",
                    },
                    config: {
                      oneOf: [
                        {
                          type: "object",
                          properties: { destination: { type: "string", enum: ["notra"] } },
                          required: ["destination"],
                        },
                        {
                          type: "object",
                          properties: {
                            destination: { type: "string", enum: ["github"] },
                            repositoryId: { type: "string" },
                            merge: { type: "boolean" },
                          },
                          required: ["destination", "repositoryId", "merge"],
                        },
                        {
                          type: "object",
                          properties: {
                            destination: { type: "string", enum: ["social"] },
                            accountId: { type: "string" },
                          },
                          required: ["destination", "accountId"],
                        },
                      ],
                    },
                    status: {
                      type: "string",
                      enum: ["scheduled", "publishing", "published", "failed", "canceled"],
                      description:
                        "scheduled → publishing → published or failed. Failed destinations are retried automatically for transient errors before they end up failed.",
                    },
                    scheduledAt: { type: "string", format: "date-time" },
                    timeZone: { type: "string" },
                    attempts: {
                      type: "integer",
                      description: "Publishing attempts started for this destination, including automatic retries.",
                    },
                    errorCode: {
                      type: ["string", "null"],
                      description:
                        "Machine-readable code of the last failed attempt, such as github_publish_failed or too_many_attempts. Cleared when the destination publishes.",
                    },
                    lastError: {
                      type: ["string", "null"],
                      description: "Message of the last failed attempt. Cleared when the destination publishes.",
                    },
                    resultUrl: {
                      type: ["string", "null"],
                      description: "Pull request or social post URL once published.",
                    },
                    publishedAt: {
                      type: ["string", "null"],
                      format: "date-time",
                      description: "When this destination published. Null until then.",
                    },
                  },
                  required: [
                    "id",
                    "destination",
                    "config",
                    "status",
                    "scheduledAt",
                    "timeZone",
                    "attempts",
                    "errorCode",
                    "lastError",
                    "resultUrl",
                    "publishedAt",
                  ],
                },
                description: "One entry per destination of the schedule.",
              },
            },
            required: ["postId", "scheduledAt", "timeZone", "publications"],
          },
          { type: "null" },
        ],
        description:
          "The post's latest schedule with destinations that were not canceled, listing only those destinations. It stays after they published or failed, and destinations that already published remain after a cancel. Null when the post was never scheduled or all its destinations were canceled.",
      },
    },
    required: ["organization", "schedule"],
  },
  getProject: {
    type: "object",
    properties: {
      project: {
        type: "object",
        properties: {
          id: { type: "string", description: "Use as projectId in the endpoints under /v1/projects/{projectId}." },
          name: { type: "string" },
          brandSettingsId: {
            type: "string",
            description: "ID of the brand identity linked to the project, as listed by GET /v1/brand-identities.",
          },
          createdAt: { type: "string" },
        },
        required: ["id", "name", "brandSettingsId", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["project", "organization"],
  },
  getPublicApiStatus: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["ok"] },
      service: { type: "string", enum: ["Notra API"] },
      version: { type: "string" },
      public: { type: "boolean", enum: [true] },
      authentication: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["bearer"] },
          resource_metadata: { type: "string", format: "uri" },
          guide: { type: "string", format: "uri" },
        },
        required: ["type", "resource_metadata", "guide"],
      },
    },
    required: ["status", "service", "version", "public", "authentication"],
  },
  getSite: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: {
          id: { type: "string" },
          projectId: {
            type: "string",
            description: "Notra project the Site belongs to. Use it as projectId in /v1/projects/{projectId}.",
          },
          name: { type: "string" },
          slug: { type: "string", description: "Used in the Site's Notra-hosted addresses." },
          status: { type: "string", enum: ["active", "suspended"], description: "suspended while the Site is paused." },
          suspendedReason: {
            type: ["string", "null"],
            description: "Why the Site is suspended. Null while active or when no reason was given.",
          },
          repository: {
            type: ["object", "null"],
            properties: {
              id: { type: ["string", "null"], description: "GitHub's ID for the repository." },
              owner: { type: "string" },
              name: { type: "string" },
            },
            required: ["id", "owner", "name"],
            description: "GitHub repository the Site builds from, or null when none is connected.",
          },
          productionBranch: { type: "string", description: "Branch that production deployments build from." },
          rootDirectory: { type: "string", description: "Directory in the repository that holds blog.json." },
          liveUrl: { type: "string", description: "Public URL of the Site's first section." },
          publicOrigin: {
            type: "string",
            description:
              "Origin the Site is served from: the primary custom domain, or the Notra-hosted address when there is none.",
          },
          aliasOrigin: { type: "string", description: "Notra-hosted address that always serves the Site." },
          mounts: {
            type: "object",
            properties: { blog: { type: "string" }, changelog: { type: "string" } },
            description: "Paths the blog and changelog are served under. A missing key means that section is off.",
          },
          mountsFromConfig: {
            type: "boolean",
            description:
              "True when the live build's blog.json sets the sections, so the dashboard can't change them. Change them with PATCH /v1/sites/{siteId}/sections or in blog.json.",
          },
          previewsEnabled: { type: "boolean", description: "Whether preview deployments are built and served." },
          previewVisibility: {
            type: "string",
            enum: ["public", "protected"],
            description:
              "public previews open for anyone; protected previews need a workspace sign-in or the preview's password.",
          },
          smartDeployments: {
            type: "boolean",
            description:
              "Pushes and pull requests whose site inputs are unchanged from an existing build are not rebuilt; their deployments end as skipped.",
          },
          analyticsEnabled: {
            type: "boolean",
            description:
              "Whether the live production site serves Notra's cookieless notra.js script and counts visitors and AI agent visits into the project's AI traffic and web analytics. On by default; previews are never counted.",
          },
          liveDeploymentId: {
            type: ["string", "null"],
            description: "Production deployment serving visitors now, or null when nothing is live.",
          },
          rollbackActive: {
            type: "boolean",
            description:
              "Production is pinned to an older build; new builds finish but don't go live until someone promotes one in the dashboard.",
          },
          liveSince: { type: ["string", "null"], description: "When the live production deployment started serving." },
          createdAt: { type: "string" },
        },
        required: [
          "id",
          "projectId",
          "name",
          "slug",
          "status",
          "suspendedReason",
          "repository",
          "productionBranch",
          "rootDirectory",
          "liveUrl",
          "publicOrigin",
          "aliasOrigin",
          "mounts",
          "mountsFromConfig",
          "previewsEnabled",
          "previewVisibility",
          "smartDeployments",
          "analyticsEnabled",
          "liveDeploymentId",
          "rollbackActive",
          "liveSince",
          "createdAt",
        ],
      },
      domains: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            hostname: { type: "string" },
            kind: {
              type: "string",
              enum: ["subdomain", "proxy"],
              description:
                "subdomain points the hostname at Notra with DNS records and Notra issues its certificate; proxy keeps your existing website on the hostname, which forwards the Site's paths to Notra with rewrites.",
            },
            status: {
              type: "string",
              enum: ["pending", "verifying", "active", "failed"],
              description:
                "pending until the first check, verifying while checks have not passed yet, active once verified, failed when a domain that was active or failed fails a check. Domains that are not active are rechecked automatically.",
            },
            isPrimary: { type: "boolean", description: "The domain is the Site's publicOrigin." },
            records: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["CNAME", "TXT", "A"] },
                  name: { type: "string" },
                  value: { type: "string" },
                  purpose: {
                    type: "string",
                    enum: ["routing", "ownership", "certificate"],
                    description:
                      "routing points the hostname at Notra, ownership proves control of the domain, and certificate lets the TLS certificate be issued.",
                  },
                },
                required: ["type", "name", "value", "purpose"],
              },
              description: "DNS records to create for the domain.",
            },
            lastError: {
              type: ["string", "null"],
              description:
                "What the latest check found missing, such as a DNS record, the ownership TXT record, the certificate or the proxy rewrites. Null after a passing check.",
            },
            verifiedAt: {
              type: ["string", "null"],
              description: "When the domain first verified. Kept if a later check fails; null until it verifies.",
            },
          },
          required: ["id", "hostname", "kind", "status", "isPrimary", "records", "lastError", "verifiedAt"],
        },
      },
      previews: {
        type: "array",
        items: {
          type: "object",
          properties: {
            previewKey: {
              type: "string",
              description: "Identifies the preview: one per branch, and one per post for post previews.",
            },
            deploymentId: { type: "string", description: "Deployment serving the preview." },
            visibility: { type: "string", enum: ["public", "protected"] },
            url: { type: "string" },
            branch: { type: ["string", "null"] },
            pullRequestNumber: { type: ["integer", "null"] },
            commitSha: { type: ["string", "null"] },
            activatedAt: { type: "string", description: "When the deployment started serving the preview." },
          },
          required: [
            "previewKey",
            "deploymentId",
            "visibility",
            "url",
            "branch",
            "pullRequestNumber",
            "commitSha",
            "activatedAt",
          ],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["site", "domains", "previews", "organization"],
  },
  getSiteDeployment: {
    type: "object",
    properties: {
      deployment: {
        type: "object",
        properties: {
          id: { type: "string" },
          kind: {
            type: "string",
            enum: ["production", "preview"],
            description:
              "production builds the production branch for visitors; preview builds a branch, pull request or post preview.",
          },
          previewKey: {
            type: ["string", "null"],
            description:
              "Preview the deployment builds, matching previewKey in a Site's previews. Null for production.",
          },
          trigger: {
            type: "string",
            enum: ["push", "pull_request", "manual", "redeploy", "config", "toolchain"],
            description:
              "push and pull_request come from GitHub, manual from a deploy request, redeploy from a rebuild, config from a settings change, and toolchain from Notra rebuilding the live commit after a builder update.",
          },
          status: {
            type: "string",
            enum: [
              "queued",
              "building",
              "uploading",
              "ready",
              "superseded",
              "skipped",
              "failed",
              "canceled",
              "expired",
            ],
            description:
              "queued, building and uploading are in progress; ready, superseded, skipped, failed, canceled and expired are final.",
          },
          live: { type: "boolean", description: "The deployment is serving production or a preview now." },
          liveSince: { type: ["string", "null"], description: "When it started serving. Null when not live." },
          branch: { type: "string" },
          commitSha: { type: "string" },
          commitMessage: { type: ["string", "null"] },
          commitAuthor: { type: ["string", "null"] },
          pullRequestNumber: { type: ["integer", "null"] },
          url: { type: "string", description: "Where the deployment serves its first section." },
          fileCount: {
            type: ["integer", "null"],
            description:
              "Files in the built output. Set when the build becomes ready; null for deployments that never finished a build, such as queued, skipped, failed or canceled ones.",
          },
          totalBytes: {
            type: ["integer", "null"],
            description: "Total size of the built output in bytes. Null under the same conditions as fileCount.",
          },
          buildDurationMs: { type: ["integer", "null"], description: "Build time in milliseconds." },
          errorMessage: {
            type: ["string", "null"],
            description: "Why the build failed, or why it was canceled or superseded before building.",
          },
          skipReason: { type: ["string", "null"], description: "Why smart deployments skipped the build." },
          diagnostics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                severity: { type: "string", enum: ["error", "warning"] },
                file: {
                  type: ["string", "null"],
                  description: "File the diagnostic points at, or null when it has none.",
                },
                line: { type: "integer" },
                column: { type: "integer" },
                code: { type: "string" },
                message: { type: "string" },
              },
              required: ["severity", "file", "code", "message"],
            },
            description: "Compiler errors and warnings with file and line.",
          },
          createdAt: { type: "string" },
          startedAt: { type: ["string", "null"] },
          finishedAt: { type: ["string", "null"] },
        },
        required: [
          "id",
          "kind",
          "previewKey",
          "trigger",
          "status",
          "live",
          "liveSince",
          "branch",
          "commitSha",
          "commitMessage",
          "commitAuthor",
          "pullRequestNumber",
          "url",
          "fileCount",
          "totalBytes",
          "buildDurationMs",
          "errorMessage",
          "skipReason",
          "diagnostics",
          "createdAt",
          "startedAt",
          "finishedAt",
        ],
      },
      log: { type: ["string", "null"], description: "Newest build log output, trimmed at the start when long." },
      logTruncated: { type: "boolean", description: "The log was cut to its last 64,000 characters." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["deployment", "log", "logTruncated", "organization"],
  },
  getSitePostPreview: {
    type: "object",
    properties: {
      preview: {
        anyOf: [
          {
            type: "object",
            properties: {
              status: { type: "string", description: "Status of the preview's latest build." },
              live: { type: "boolean", description: "The preview is being served and has not expired." },
              deleting: { type: "boolean", description: "The preview is being removed." },
              errorMessage: { type: ["string", "null"], description: "Why the latest build failed or stopped." },
              expiresAt: { type: "string", description: "When the preview stops being served." },
              hasPassword: {
                type: "boolean",
                description: "People outside the workspace can open it with a password.",
              },
              url: { type: "string", description: "The post's page on the preview." },
            },
            required: ["status", "live", "deleting", "errorMessage", "expiresAt", "hasPassword", "url"],
          },
          { type: "null" },
        ],
        description: "Null when the post has no preview on this Site.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["preview", "organization"],
  },
  getSkill: {
    type: "object",
    properties: {
      skill: {
        allOf: [
          {
            type: "object",
            properties: {
              id: { type: "string" },
              name: {
                type: "string",
                description: "Unique within the organization. Use it as {name} in /v1/skills/{name}.",
              },
              description: { type: "string", description: "Short description of when the skill should be used." },
              isSystem: {
                type: "boolean",
                description:
                  "True for built-in skills provided by Notra. System skills can be edited but not renamed or deleted.",
              },
              updatedAt: { type: "string" },
            },
            required: ["id", "name", "description", "isSystem", "updatedAt"],
          },
          {
            type: "object",
            properties: {
              content: { type: "string", description: "Full skill instructions, typically Markdown." },
              createdAt: { type: "string" },
            },
            required: ["content", "createdAt"],
          },
        ],
      },
    },
    required: ["skill"],
  },
  getWebhookDelivery: {
    type: "object",
    properties: {
      delivery: {
        type: "object",
        properties: {
          id: { type: "string", description: "Sent to the endpoint in the x-notra-delivery-id header." },
          eventId: {
            type: "string",
            description:
              "The event this delivery carries, sent in the x-notra-event-id header. Each subscribed endpoint gets its own delivery of the same event.",
          },
          endpointId: { type: "string" },
          url: { type: "string", description: "URL the delivery is sent to." },
          eventType: {
            type: "string",
            enum: [
              "post.generation.completed",
              "post.generation.failed",
              "post.generation.skipped",
              "brand_identity.generation.completed",
              "brand_identity.generation.failed",
              "post.published",
              "post.created",
              "post.updated",
              "post.deleted",
              "post.unpublished",
              "geo.scan.completed",
              "geo.scan.failed",
              "geo.alert.triggered",
            ],
          },
          status: {
            type: "string",
            enum: ["pending", "sending", "retrying", "succeeded", "failed", "cancelled"],
            description:
              "pending waits for its first attempt, sending is in flight and retrying waits for another attempt. succeeded got a 2xx response; failed ran out of attempts or hit an error that is not retried; cancelled stopped because the endpoint was removed or disabled.",
          },
          attemptCount: {
            type: "number",
            description: "Attempts made so far. Up to 8 attempts are made, and a manual retry allows 8 more.",
          },
          nextAttemptAt: {
            type: "string",
            description: "When the next attempt is due. Only meaningful while pending or retrying.",
          },
          createdAt: { type: "string" },
          statusCode: {
            type: ["number", "null"],
            description:
              "HTTP status of the latest attempt. Null before the first attempt finishes or when no response came back.",
          },
          error: {
            type: ["string", "null"],
            description:
              "Error code of the latest attempt: http_<status> for a non-2xx response, or network, timeout (no response within 10 seconds), unsafe_url, signing_failed or lease_expired_outcome_unknown. Null when it succeeded or has not finished.",
          },
          payload: { type: "string", description: "The JSON request body sent to the endpoint, as a string." },
        },
        required: [
          "id",
          "eventId",
          "endpointId",
          "url",
          "eventType",
          "status",
          "attemptCount",
          "nextAttemptAt",
          "createdAt",
          "statusCode",
          "error",
          "payload",
        ],
      },
      attempts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            deliveryId: { type: "string" },
            attemptNumber: { type: "number", description: "Position of the attempt, starting at 1." },
            startedAt: { type: "string" },
            finishedAt: { type: ["string", "null"], description: "Null while the attempt is in flight." },
            statusCode: {
              type: ["number", "null"],
              description: "HTTP status the endpoint returned, or null without a response.",
            },
            error: {
              type: ["string", "null"],
              description:
                "Error code: http_<status> for a non-2xx response, or network, timeout, unsafe_url, signing_failed or lease_expired_outcome_unknown. Null on success or while in flight.",
            },
            durationMs: { type: ["number", "null"], description: "Request duration in milliseconds." },
          },
          required: [
            "id",
            "deliveryId",
            "attemptNumber",
            "startedAt",
            "finishedAt",
            "statusCode",
            "error",
            "durationMs",
          ],
        },
        description: "Every attempt, oldest first.",
      },
    },
    required: ["delivery", "attempts"],
  },
  getWorkspaces: {
    type: "object",
    properties: {
      currentWorkspace: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      workspaces: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
            },
            slug: { type: "string" },
            name: { type: "string" },
            logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
            role: {
              type: ["string", "null"],
              description:
                "Your role in the workspace, or the invited role for pending invitations. Null for single-organization API keys or when the role is unknown.",
            },
            status: {
              type: "string",
              enum: ["active", "pending"],
              description: "active for accepted memberships, pending for invitations not yet accepted.",
            },
            isCurrent: { type: "boolean", description: "The workspace this request acts on." },
          },
          required: ["id", "slug", "name", "logo", "role", "status", "isCurrent"],
        },
        description:
          "Current workspace first, then active memberships, then pending invitations, each sorted by name. Single-organization API keys only see the current workspace.",
      },
      authentication: {
        oneOf: [
          { type: "object", properties: { type: { type: "string", enum: ["apiKey"] } }, required: ["type"] },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["oauth"] },
              accountId: { type: "string", description: "Notra user ID of the signed-in account." },
              scopes: { type: "array", items: { type: "string" }, description: "OAuth scopes granted to the token." },
            },
            required: ["type", "accountId", "scopes"],
          },
        ],
      },
    },
    required: ["currentWorkspace", "workspaces", "authentication"],
  },
  importGeoCompetitors: {
    type: "object",
    properties: {
      imported: { type: "integer", description: "Rows added as new competitors." },
      updated: {
        type: "integer",
        description:
          "Rows that matched an existing competitor by name and replaced the domain, kind or synonyms they provided.",
      },
      skipped: { type: "integer", description: "Rows repeating a name already seen earlier in the import." },
      issues: {
        type: "array",
        items: {
          type: "object",
          properties: {
            line: { type: "integer", description: "CSV line number of the rejected row." },
            message: { type: "string", description: "Why the row was rejected." },
          },
          required: ["line", "message"],
        },
        description: "Rows rejected while parsing CSV. Always empty for `rows`.",
      },
      competitors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "Competitor id. Competitors carried over from older settings use `legacy:` plus the lowercased name. Endpoints address competitors by `name`, not id.",
            },
            name: { type: "string", description: "Competitor name. Unique per project, compared case-insensitively." },
            domain: {
              type: ["string", "null"],
              description: "Competitor website domain, used to recognize citations of its site. `null` when unknown.",
            },
            synonyms: {
              type: "array",
              items: { type: "string" },
              description: "Alternate names counted as this competitor in answers.",
            },
            kind: {
              type: "string",
              enum: ["direct", "indirect"],
              description:
                "Your own label for the competitor: direct or indirect. Only shown as a label; mentions, share of voice and gaps count both kinds the same way.",
            },
            color: {
              type: ["string", "null"],
              description: "Custom chart color, or `null` to use the default palette.",
            },
          },
          required: ["id", "name", "domain", "synonyms", "kind", "color"],
        },
        description: "All tracked competitors after the import.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["imported", "updated", "skipped", "issues", "competitors", "organization"],
  },
  importGeoPrompts: {
    type: "object",
    properties: {
      imported: { type: "integer", description: "Prompts added as new custom prompts." },
      updated: { type: "integer", description: "Always 0: existing prompts are never changed by an import." },
      skipped: {
        type: "integer",
        description:
          "Rows not added because the prompt was blank or already tracked, or repeated in the import. Compared case-insensitively.",
      },
      issues: {
        type: "array",
        items: {
          type: "object",
          properties: {
            line: { type: "integer", description: "CSV line number of the rejected row." },
            message: { type: "string", description: "Why the row was rejected." },
          },
          required: ["line", "message"],
        },
        description: "Rows rejected while parsing CSV. Always empty for `rows`.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["imported", "updated", "skipped", "issues", "organization"],
  },
  importSiteAuthors: {
    allOf: [
      {
        type: "object",
        properties: {
          site: {
            type: "object",
            properties: { id: { type: "string" }, name: { type: "string" } },
            required: ["id", "name"],
          },
          authors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                ref: {
                  type: "string",
                  description:
                    "Pass this in metadata.authorIds of PATCH /v1/posts/{postId} to credit the author on a blog post that publishes to this site.",
                },
                name: { type: "string" },
                title: { type: ["string", "null"] },
                bio: { type: ["string", "null"] },
                avatar: {
                  type: ["string", "null"],
                  description: "As written in blog.json: a site path such as /images/jane.png or an https URL.",
                },
                avatarUrl: { type: ["string", "null"], description: "The avatar as a full URL on the live site." },
                url: { type: ["string", "null"] },
                x: { type: ["string", "null"] },
                linkedin: { type: ["string", "null"] },
                github: { type: ["string", "null"] },
                youtube: { type: ["string", "null"] },
                bluesky: { type: ["string", "null"] },
                mastodon: { type: ["string", "null"] },
                threads: { type: ["string", "null"] },
                instagram: { type: ["string", "null"] },
                live: {
                  type: "boolean",
                  description:
                    "The author is in the published blog.json. False while it only exists in unpublished changes.",
                },
                posts: { type: "integer", description: "Notra blog posts on this site that credit the author." },
              },
              required: [
                "id",
                "ref",
                "name",
                "title",
                "bio",
                "avatar",
                "avatarUrl",
                "url",
                "x",
                "linkedin",
                "github",
                "youtube",
                "bluesky",
                "mastodon",
                "threads",
                "instagram",
                "live",
                "posts",
              ],
            },
            description: "Authors in blog.json order, including unpublished changes.",
          },
          authorPage: {
            type: "string",
            enum: ["inline", "stacked"],
            description: "Layout of every author page: inline puts the avatar beside the name, stacked puts it above.",
          },
          hasUnpublishedChanges: {
            type: "boolean",
            description:
              "blog.json has staged Design changes that are not live yet. Publish them with POST /v1/sites/{siteId}/publish or from the dashboard.",
          },
        },
        required: ["site", "authors", "authorPage", "hasUnpublishedChanges"],
      },
      {
        type: "object",
        properties: {
          imported: { type: "array", items: { type: "string" }, description: "Ids written to blog.json." },
          avatarsSkipped: {
            type: "array",
            items: { type: "string" },
            description:
              "Ids whose avatar was a dashboard upload, which only the dashboard import can copy into the site. Set their avatar with PUT afterwards.",
          },
        },
        required: ["imported", "avatarsSkipped"],
      },
    ],
  },
  issueGeoIngestToken: {
    type: "object",
    properties: {
      ingestUrl: { type: "string", description: "Endpoint the tracking snippet posts events to." },
      snippet: { type: "string", description: "Install snippet for the default framework (Next.js)." },
      snippets: {
        type: "object",
        properties: {
          next: { type: "string" },
          nuxt: { type: "string" },
          netlify: { type: "string" },
          tanstack: { type: "string" },
          astro: { type: "string" },
          sveltekit: { type: "string" },
          reactRouter: { type: "string" },
        },
        required: ["next", "nuxt", "netlify", "tanstack", "astro", "sveltekit", "reactRouter"],
      },
      drainUrls: {
        type: "object",
        properties: { vercel: { type: "string" }, cloudflare: { type: "string" } },
        required: ["vercel", "cloudflare"],
        description:
          "Endpoints a Vercel log drain or Cloudflare Logpush job posts request logs to, authenticated with the tracking token.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      token: {
        type: "string",
        description: "Tracking token. Shown once per request; rotating invalidates every previously issued token.",
      },
      webKey: {
        type: "string",
        description:
          "Public key for the notra.js browser script, bound to one project. Safe to put in page HTML; it only records human page views on that project's tracked domains and survives token rotation. Only present when web analytics is enabled for the workspace and it has a project.",
      },
      webSnippet: {
        type: "string",
        description:
          'Script tag that installs notra.js with the public key, pinned to the current build with its Subresource Integrity hash and crossorigin="anonymous". Build an auto-updating tag from webScript.url instead if you want new builds without copying the tag again. Only present when web analytics is enabled for the workspace.',
      },
      webScript: {
        type: "object",
        properties: {
          url: { type: "string", description: "Always serves the latest build." },
          pinnedUrl: { type: "string", description: "Serves exactly this build forever; it never updates." },
          integrity: {
            type: "string",
            description: 'Subresource Integrity value for pinnedUrl (sha384). Use it with crossorigin="anonymous".',
          },
          collectUrl: {
            type: "string",
            description:
              "Where page views go when the script loads from Notra's script host; set it as the tag's data-api.",
          },
        },
        required: ["url", "pinnedUrl", "integrity"],
        description:
          "notra.js: the auto-updating URL and the current build pinned with Subresource Integrity. Only present when web analytics is enabled for the workspace.",
      },
      webPlusScript: {
        type: "object",
        properties: {
          url: { type: "string", description: "Always serves the latest build." },
          pinnedUrl: { type: "string", description: "Serves exactly this build forever; it never updates." },
          integrity: {
            type: "string",
            description: 'Subresource Integrity value for pinnedUrl (sha384). Use it with crossorigin="anonymous".',
          },
          collectUrl: {
            type: "string",
            description:
              "Where page views go when the script loads from Notra's script host; set it as the tag's data-api.",
          },
        },
        required: ["url", "pinnedUrl", "integrity"],
        description:
          "notra.plus.js (notra.js with JavaScript error reporting), auto-updating and pinned. Only present when web analytics is enabled for the workspace.",
      },
    },
    required: ["ingestUrl", "snippet", "snippets", "drainUrls", "organization", "token"],
  },
  listAgentChats: {
    type: "object",
    properties: {
      sessions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            sessionId: { type: "string" },
            chatId: { type: ["string", "null"] },
            surface: { type: "string" },
            status: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
          required: ["sessionId", "chatId", "surface", "status", "createdAt", "updatedAt"],
        },
      },
    },
    required: ["sessions"],
  },
  listBrandColors: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      colors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Pass as colorId to update or delete the color." },
            role: {
              type: "string",
              enum: ["primary", "secondary", "accent", "background", "foreground", "neutral", "custom"],
            },
            name: { type: ["string", "null"] },
            lightValue: { type: "string", description: "Hex color for light mode." },
            darkValue: {
              type: ["string", "null"],
              description: "Hex color for dark mode. Null when the color has no dark variant.",
            },
            usage: { type: ["string", "null"], description: "Free-text note on where the color should be used." },
          },
          required: ["id", "role", "name", "lightValue", "darkValue", "usage"],
        },
        description: "Colors of the brand identity in display order.",
      },
    },
    required: ["organization", "colors"],
  },
  listBrandIdentities: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      brandIdentities: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Pass as brandIdentityId to post generation or the brandIdentityId filter of GET /v1/posts.",
            },
            name: { type: "string" },
            isDefault: {
              type: "boolean",
              description:
                "The organization's default brand identity, used when post generation omits brandIdentityId.",
            },
            websiteUrl: { type: "string", description: "Website the identity was analyzed from." },
            companyName: {
              type: ["string", "null"],
              description: "Filled in by the website analysis. Null until the analysis completes or when not set.",
            },
            companyDescription: {
              type: ["string", "null"],
              description: "Filled in by the website analysis. Null until the analysis completes or when not set.",
            },
            toneProfile: {
              type: ["string", "null"],
              description:
                "Preset tone: Conversational, Professional, Casual or Formal. Ignored while customTone is set.",
            },
            customTone: {
              type: ["string", "null"],
              description: "Free-text voice notes. When set, generation follows them instead of toneProfile.",
            },
            customInstructions: {
              type: ["string", "null"],
              description: "Extra writing instructions applied to generated content.",
            },
            audience: {
              type: ["string", "null"],
              description:
                "Target audience. Filled in by the website analysis; null until it completes or when not set.",
            },
            language: {
              type: ["string", "null"],
              description: "Language generated content is written in. Null means no language is enforced.",
            },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
          required: [
            "id",
            "name",
            "isDefault",
            "websiteUrl",
            "companyName",
            "companyDescription",
            "toneProfile",
            "customTone",
            "customInstructions",
            "audience",
            "language",
            "createdAt",
            "updatedAt",
          ],
        },
        description: "Every brand identity in the organization, default first.",
      },
    },
    required: ["organization", "brandIdentities"],
  },
  listChats: {
    type: "object",
    properties: {
      chats: {
        type: "array",
        items: {
          type: "object",
          properties: {
            chatId: { type: "string" },
            title: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            pinnedAt: { type: ["string", "null"] },
            externalChannelId: {
              type: ["object", "null"],
              properties: {
                source: { type: "string", enum: ["discord", "slack", "dashboard", "agent"] },
                id: { type: "string", maxLength: 200 },
              },
              required: ["source"],
            },
          },
          required: ["chatId", "title", "createdAt", "updatedAt", "pinnedAt"],
        },
      },
    },
    required: ["chats"],
  },
  listEventTriggers: {
    type: "object",
    properties: {
      eventTriggers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            organizationId: { type: "string" },
            name: {
              type: "string",
              description:
                'Event triggers cannot be named through the API or the dashboard, so this is the default "Untitled Schedule".',
            },
            sourceType: { type: "string", enum: ["github_webhook"] },
            sourceConfig: {
              type: "object",
              properties: {
                eventTypes: {
                  type: "array",
                  items: { type: "string", enum: ["release", "push"] },
                  minItems: 1,
                  description: "GitHub webhook events that start a run: published releases, pushes, or both.",
                },
                includePreReleases: {
                  type: "boolean",
                  default: true,
                  description: "Whether releases marked as pre-releases on GitHub also start a run.",
                },
                ignoreCommitPatterns: {
                  type: "array",
                  items: { type: "string", minLength: 1, maxLength: 120 },
                  maxItems: 10,
                  default: [],
                  description:
                    "Case-insensitive JavaScript regular expressions tested against each commit message of a push, matching anywhere unless anchored. A push is skipped only when every commit matches at least one pattern. Releases are not filtered.",
                },
              },
              required: ["eventTypes"],
            },
            targets: {
              type: "object",
              properties: {
                repositoryIds: {
                  type: "array",
                  items: { type: "string", minLength: 1 },
                  minItems: 1,
                  description:
                    "GitHub integration IDs whose webhook events start the trigger, as returned in the github array of GET /v1/integrations.",
                },
              },
              required: ["repositoryIds"],
            },
            outputType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
            outputConfig: {
              type: ["object", "null"],
              properties: {
                publishDestination: {
                  type: "string",
                  enum: ["webflow", "framer", "custom"],
                  description:
                    "Deprecated and ignored. Auto-published posts are only marked as published in Notra; publish to GitHub or a Notra site from the post instead.",
                  deprecated: true,
                },
                brandVoiceId: {
                  type: "string",
                  minLength: 1,
                  description:
                    "Brand identity ID to write in. Falls back to the organization's default brand identity when unset or not found.",
                },
                notify: {
                  type: "object",
                  properties: { slack: { type: "boolean" }, email: { type: "boolean" } },
                  required: ["slack", "email"],
                  description:
                    "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
                },
              },
            },
            enabled: {
              type: "boolean",
              description: "Whether matching GitHub events start runs. Disabled triggers are stored but ignored.",
            },
            autoPublish: {
              type: "boolean",
              description:
                "Save generated changelogs and blog posts with status published instead of draft. This only marks them published in Notra; nothing is pushed to GitHub or a Notra site. Other output types always stay drafts.",
            },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
          required: [
            "id",
            "organizationId",
            "name",
            "sourceType",
            "sourceConfig",
            "targets",
            "outputType",
            "enabled",
            "autoPublish",
            "createdAt",
            "updatedAt",
          ],
        },
        description: "Event triggers, newest first.",
      },
      repositoryMap: {
        type: "object",
        additionalProperties: { type: "string" },
        description:
          "Maps each targeted GitHub integration ID to an owner/repo label, followed by the default branch when one is known. Integrations without an owner and repo are left out.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["eventTriggers", "repositoryMap", "organization"],
  },
  listFeedback: {
    type: "object",
    properties: {
      feedback: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            projectId: {
              type: ["string", "null"],
              description: "Project the feedback is filed under, or null for none.",
            },
            source: {
              type: "string",
              enum: ["mcp", "api", "sdk"],
              description: "Channel the feedback arrived through.",
            },
            kind: {
              type: "string",
              enum: ["bug", "feature", "praise", "question", "other"],
              description:
                "What kind of feedback this is, as submitted or classified by Notra. other when classification failed.",
            },
            sentiment: {
              type: ["string", "null"],
              enum: ["negative", "neutral", "positive", null],
              description:
                "Overall sentiment, as submitted or classified by Notra. Null when it could not be classified.",
            },
            status: { type: "string", enum: ["new", "triaged", "resolved", "archived"], description: "Triage status." },
            title: {
              type: ["string", "null"],
              description: "Short summary, as submitted or written by Notra. Null when none could be written.",
            },
            message: { type: "string" },
            agentClient: { type: ["string", "null"] },
            agentModel: { type: ["string", "null"] },
            toolVersion: { type: ["string", "null"] },
            userAgent: { type: ["string", "null"] },
            contextUrl: { type: ["string", "null"] },
            externalId: { type: ["string", "null"] },
            idempotencyKey: { type: ["string", "null"] },
            metadata: {
              type: ["object", "null"],
              additionalProperties: {},
              description: "JSON submitted with the feedback, or null.",
            },
            resolvedAt: {
              type: ["string", "null"],
              description: "When the status was last set to resolved. Cleared when it changes to another status.",
            },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
          required: [
            "id",
            "projectId",
            "source",
            "kind",
            "sentiment",
            "status",
            "title",
            "message",
            "agentClient",
            "agentModel",
            "toolVersion",
            "userAgent",
            "contextUrl",
            "externalId",
            "idempotencyKey",
            "metadata",
            "resolvedAt",
            "createdAt",
            "updatedAt",
          ],
        },
        description: "Feedback on this page, newest first.",
      },
      pagination: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1 },
          currentPage: { type: "integer", minimum: 1 },
          nextPage: { type: ["integer", "null"], minimum: 1 },
          previousPage: { type: ["integer", "null"], minimum: 1 },
          totalPages: { type: "integer", minimum: 1 },
          totalItems: { type: "integer", minimum: 0 },
        },
        required: ["limit", "currentPage", "nextPage", "previousPage", "totalPages", "totalItems"],
      },
    },
    required: ["feedback", "pagination"],
  },
  listGeoAnalyticsImports: {
    type: "object",
    properties: {
      imports: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            projectId: { type: "string" },
            provider: {
              type: "string",
              enum: [
                "plausible",
                "plausible_csv",
                "vercel",
                "cloudflare",
                "cloudflare_rum",
                "rybbit",
                "databuddy",
                "posthog",
              ],
            },
            kind: { type: "string", enum: ["web", "geo"], description: "web: page views; geo: AI crawler requests." },
            sourceLabel: {
              type: "string",
              description: "Name of the site in the source provider, or its reference when it has no name.",
            },
            host: {
              type: "string",
              description:
                "Hostname the import was set up for. Imported rows without a hostname are counted under it; Plausible and Cloudflare imports also write rows for its subdomains.",
            },
            status: {
              type: "string",
              enum: ["pending", "running", "waiting_rate_limit", "completed", "failed", "deleting", "deleted"],
            },
            startDay: { type: ["string", "null"], description: "First day the import covers." },
            endDay: { type: ["string", "null"], description: "Last day the import covers." },
            cutoffDay: {
              type: ["string", "null"],
              description: "First day of native tracking; imports stop before it.",
            },
            chunksTotal: {
              type: "integer",
              description: "Date-range chunks the import is split into. 0 until planned.",
            },
            chunksDone: { type: "integer", description: "Chunks imported so far." },
            pageviewsImported: { type: "integer", description: "Page views imported so far across finished chunks." },
            rowsWritten: { type: "integer", description: "Analytics rows written so far across finished chunks." },
            capabilities: {
              type: "object",
              properties: {
                visitors: { type: "boolean" },
                visits: { type: "boolean" },
                bounces: { type: "boolean" },
                utm: { type: "boolean" },
                entryPages: { type: "boolean" },
                sampled: {
                  type: "boolean",
                  description:
                    "True when the provider reports estimates extrapolated from sampled data rather than exact counts (both Cloudflare providers).",
                },
              },
              required: ["visitors", "visits", "bounces", "utm", "entryPages", "sampled"],
              description: "Metrics the provider can supply; metrics it cannot supply read as 0.",
            },
            lastError: {
              type: ["string", "null"],
              description: "Why the import failed or is waiting. Cleared when a chunk succeeds.",
            },
            retryAt: {
              type: ["string", "null"],
              description:
                "When a waiting import resumes (ISO timestamp). Null unless the status is waiting_rate_limit.",
            },
            createdAt: { type: "string" },
            completedAt: { type: ["string", "null"] },
          },
          required: [
            "id",
            "projectId",
            "provider",
            "kind",
            "sourceLabel",
            "host",
            "status",
            "startDay",
            "endDay",
            "cutoffDay",
            "chunksTotal",
            "chunksDone",
            "pageviewsImported",
            "rowsWritten",
            "capabilities",
            "lastError",
            "retryAt",
            "createdAt",
            "completedAt",
          ],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["imports", "organization"],
  },
  listGeoChanges: {
    type: "object",
    properties: {
      previousScan: {
        type: ["object", "null"],
        properties: { id: { type: "string" }, finishedAt: { type: ["string", "null"] } },
        required: ["id", "finishedAt"],
        description:
          "Second most recently started completed scan, or `null` when the project has fewer than two completed scans. Without it there are no events.",
      },
      currentScan: {
        type: ["object", "null"],
        properties: { id: { type: "string" }, finishedAt: { type: ["string", "null"] } },
        required: ["id", "finishedAt"],
        description: "Most recently started completed scan, or `null` when the project has none.",
      },
      summary: {
        type: "object",
        properties: {
          gained: { type: "integer", description: "Prompt and engine pairs that now mention the brand." },
          lost: {
            type: "integer",
            description: "Pairs that no longer mention the brand, including those where a competitor took its place.",
          },
          positionImproved: { type: "integer" },
          positionDropped: {
            type: "integer",
            description: "Pairs where the brand moved down a list, including when a new competitor moved above it.",
          },
          citationsAdded: { type: "integer", description: "Pairs that now cite the project's own site." },
          citationsRemoved: { type: "integer", description: "Pairs that no longer cite the project's own site." },
        },
        required: ["gained", "lost", "positionImproved", "positionDropped", "citationsAdded", "citationsRemoved"],
        description: "Counts over all events, including those beyond the returned `events`.",
      },
      events: {
        type: "array",
        items: {
          type: "object",
          properties: {
            kind: {
              type: "string",
              enum: [
                "gained_mention",
                "lost_mention",
                "position_improved",
                "position_dropped",
                "competitor_displaced",
                "citation_added",
                "citation_removed",
                "competitor_cited",
                "new_engine",
              ],
            },
            promptId: { type: "string" },
            prompt: { type: "string" },
            engine: { type: "string" },
            previous: {
              type: ["object", "null"],
              properties: {
                mentioned: { type: "boolean" },
                position: {
                  type: ["number", "null"],
                  description:
                    "1-based rank of the brand in a list of recommended brands, or `null` when it is not mentioned or not in a list.",
                },
              },
              required: ["mentioned", "position"],
              description: "State in the previous scan, or `null` for `new_engine`.",
            },
            current: {
              type: "object",
              properties: {
                mentioned: { type: "boolean" },
                position: {
                  type: ["number", "null"],
                  description:
                    "1-based rank of the brand in a list of recommended brands, or `null` when it is not mentioned or not in a list.",
                },
              },
              required: ["mentioned", "position"],
              description: "State in the current scan.",
            },
            competitors: {
              type: "array",
              items: { type: "string" },
              description:
                "For `competitor_displaced`, the competitors that took the brand's place; for `competitor_cited`, competitors whose sites were newly cited. Otherwise empty.",
            },
            domains: {
              type: "array",
              items: { type: "string" },
              description: "For `competitor_cited`, the newly cited competitor domains. Otherwise empty.",
            },
          },
          required: ["kind", "promptId", "prompt", "engine", "previous", "current", "competitors", "domains"],
        },
        description:
          "Changes per prompt and engine between the two scans, at most 40, ordered by kind, then engine, then prompt. Only answers to tracked prompts in the project's prompt language are compared.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["previousScan", "currentScan", "summary", "events", "organization"],
  },
  listGeoCompetitors: {
    type: "object",
    properties: {
      competitors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "Competitor id. Competitors carried over from older settings use `legacy:` plus the lowercased name. Endpoints address competitors by `name`, not id.",
            },
            name: { type: "string", description: "Competitor name. Unique per project, compared case-insensitively." },
            domain: {
              type: ["string", "null"],
              description: "Competitor website domain, used to recognize citations of its site. `null` when unknown.",
            },
            synonyms: {
              type: "array",
              items: { type: "string" },
              description: "Alternate names counted as this competitor in answers.",
            },
            kind: {
              type: "string",
              enum: ["direct", "indirect"],
              description:
                "Your own label for the competitor: direct or indirect. Only shown as a label; mentions, share of voice and gaps count both kinds the same way.",
            },
            color: {
              type: ["string", "null"],
              description: "Custom chart color, or `null` to use the default palette.",
            },
          },
          required: ["id", "name", "domain", "synonyms", "kind", "color"],
        },
        description: "Tracked competitors, oldest first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["competitors", "organization"],
  },
  listGeoContentBriefs: {
    type: "object",
    properties: {
      briefs: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            topic: { type: "string" },
            workingTitle: { type: "string" },
            status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
            postId: {
              type: ["string", "null"],
              description: "Post the brief writes into. Null when no post is linked, for example after it was deleted.",
            },
            createdAt: { type: "string" },
          },
          required: ["id", "topic", "workingTitle", "status", "postId", "createdAt"],
        },
        description: "The project's 20 most recently created briefs, newest first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["briefs", "organization"],
  },
  listGeoContentGaps: {
    type: "object",
    properties: {
      promptGaps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "Tracked prompt id, or the scan prompt id for prompts that are not tracked. Use as promptId with updateGeoContentGap, or as sourceId with sourceKind gap when planning a brief.",
            },
            prompt: { type: "string" },
            title: { type: ["string", "null"] },
            engines: {
              type: "array",
              items: { type: "string" },
              description: "Engines whose latest answer from the last 30 days did not mention the brand.",
            },
            mentionedEngines: {
              type: "array",
              items: { type: "string" },
              description: "Engines whose latest answer from the last 30 days mentioned the brand.",
            },
            competitors: {
              type: "array",
              items: { type: "string" },
              description: "Tracked competitors named in answers that left out the brand.",
            },
            discoveredCompetitors: {
              type: "array",
              items: { type: "string" },
              description: "Other brands named in answers that left out the brand and are not tracked as competitors.",
            },
            searchQueries: {
              type: "array",
              items: { type: "string" },
              description: "Web searches AI engines ran while answering this prompt.",
            },
            ownMentionRate: {
              type: "number",
              description: "Share of checked engines that mentioned the brand, from 0 to 1.",
            },
            engineCoverage: { type: "number", description: "Number of engines with an answer for this prompt." },
            opportunity: {
              type: "number",
              description:
                "Relative priority: grows with missing mentions, engines checked and competitors named. Gaps are sorted by it, highest first; 0 when won.",
            },
            won: {
              type: "boolean",
              description:
                "True when most engines now mention the brand; the gap stays listed because a brief was planned for it.",
            },
            brief: {
              type: ["object", "null"],
              properties: {
                briefId: { type: "string", description: "Use with getGeoContentBrief and approveGeoContentBrief." },
                status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
                postId: {
                  type: ["string", "null"],
                  description: "Draft post created for the brief. Null when none is linked.",
                },
                workingTitle: { type: ["string", "null"] },
                publishedAt: {
                  type: ["string", "null"],
                  description: "ISO timestamp of when the brief's post was published. Null until then.",
                },
                baseline: {
                  type: ["object", "null"],
                  properties: {
                    mentionedEngines: {
                      type: "number",
                      description: "Engines that mentioned the brand when the brief was planned.",
                    },
                    totalEngines: { type: "number", description: "Engines checked when the brief was planned." },
                  },
                  required: ["mentionedEngines", "totalEngines"],
                  description:
                    "Engine coverage captured when the brief was planned, to compare against after publishing. Only set for briefs planned from a prompt gap or prompt with scan results from the last 30 days; null otherwise.",
                },
                rescanned: {
                  type: "boolean",
                  description: "True once a rescan of the source prompt was started after the post was published.",
                },
              },
              required: ["briefId", "status", "postId", "workingTitle", "publishedAt", "baseline", "rescanned"],
              description: "The most recently updated brief planned from this gap. Null when none exists.",
            },
            recommendation: {
              type: "object",
              properties: {
                action: {
                  type: "string",
                  enum: ["create", "update", "merge", "ignore"],
                  description:
                    "What to do with this query cluster: create a new page, update the page Google already ranks or the strongest existing page, merge overlapping pages, or ignore thin demand.",
                },
                reason: { type: "string", description: "Plain-language explanation of the recommended action." },
                targets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      kind: {
                        type: "string",
                        enum: ["page", "post"],
                        description: "page: a page from the brand's sitemap; post: a Notra post.",
                      },
                      id: {
                        type: "string",
                        description:
                          "Sitemap page id or post id. For a Google-ranked page Notra has not crawled, the page URL.",
                      },
                      url: { type: ["string", "null"] },
                      title: { type: "string" },
                      score: {
                        type: "number",
                        description: "How much of the gap's terms this page already covers, from 0 to 1.",
                      },
                      googlePosition: {
                        type: "number",
                        description:
                          "Google position of the gap's queries on this page, when Search Console shows it already ranks there.",
                      },
                    },
                    required: ["kind", "id", "url", "title", "score"],
                  },
                  description:
                    "Existing pages to update or merge, best match first. For create, the closest existing page when there is one; empty for ignore.",
                },
              },
              required: ["action", "reason", "targets"],
              description:
                "Whether to create a page or work on existing ones, from how well the brand's sitemap pages and posts already cover the prompt and its web searches. Never ignore, since prompt gaps carry no Search Console demand. Missing on snapshots built before it was added.",
            },
          },
          required: [
            "id",
            "prompt",
            "title",
            "engines",
            "mentionedEngines",
            "competitors",
            "discoveredCompetitors",
            "searchQueries",
            "ownMentionRate",
            "engineCoverage",
            "opportunity",
            "won",
            "brief",
          ],
        },
        description:
          "Prompts where at least half of the engines answering in the last 30 days left out the brand, plus won gaps that have a brief, highest opportunity first. Ignored gaps are excluded.",
      },
      searchGaps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "Search Console prompt suggestion id. Use as sourceId with sourceKind search_console when planning a brief.",
            },
            prompt: { type: "string", description: "Suggested prompt." },
            title: { type: ["string", "null"] },
            impressions: {
              type: ["number", "null"],
              description: "Google impressions summed across the queries. Null when no query data is stored.",
            },
            clicks: {
              type: ["number", "null"],
              description: "Google clicks summed across the queries. Null when no query data is stored.",
            },
            position: {
              type: ["number", "null"],
              description:
                "Impression-weighted average Google position across the queries, rounded to one decimal. Null when no query data is stored.",
            },
            queries: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  query: { type: "string" },
                  clicks: { type: "number" },
                  impressions: { type: "number" },
                  position: { type: "number" },
                  page: { type: "string", description: "Page Google showed most for this query." },
                  pagePosition: { type: "number", description: "Google position of that page for this query." },
                  pageImpressions: { type: "number", description: "Impressions of that page for this query." },
                },
                required: ["query", "clicks", "impressions", "position"],
              },
            },
            brief: {
              type: ["object", "null"],
              properties: {
                briefId: { type: "string", description: "Use with getGeoContentBrief and approveGeoContentBrief." },
                status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
                postId: {
                  type: ["string", "null"],
                  description: "Draft post created for the brief. Null when none is linked.",
                },
                workingTitle: { type: ["string", "null"] },
                publishedAt: {
                  type: ["string", "null"],
                  description: "ISO timestamp of when the brief's post was published. Null until then.",
                },
                baseline: {
                  type: ["object", "null"],
                  properties: {
                    mentionedEngines: {
                      type: "number",
                      description: "Engines that mentioned the brand when the brief was planned.",
                    },
                    totalEngines: { type: "number", description: "Engines checked when the brief was planned." },
                  },
                  required: ["mentionedEngines", "totalEngines"],
                  description:
                    "Engine coverage captured when the brief was planned, to compare against after publishing. Only set for briefs planned from a prompt gap or prompt with scan results from the last 30 days; null otherwise.",
                },
                rescanned: {
                  type: "boolean",
                  description: "True once a rescan of the source prompt was started after the post was published.",
                },
              },
              required: ["briefId", "status", "postId", "workingTitle", "publishedAt", "baseline", "rescanned"],
              description: "The most recently updated brief planned from this gap. Null when none exists.",
            },
            recommendation: {
              type: "object",
              properties: {
                action: {
                  type: "string",
                  enum: ["create", "update", "merge", "ignore"],
                  description:
                    "What to do with this query cluster: create a new page, update the page Google already ranks or the strongest existing page, merge overlapping pages, or ignore thin demand.",
                },
                reason: { type: "string", description: "Plain-language explanation of the recommended action." },
                targets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      kind: {
                        type: "string",
                        enum: ["page", "post"],
                        description: "page: a page from the brand's sitemap; post: a Notra post.",
                      },
                      id: {
                        type: "string",
                        description:
                          "Sitemap page id or post id. For a Google-ranked page Notra has not crawled, the page URL.",
                      },
                      url: { type: ["string", "null"] },
                      title: { type: "string" },
                      score: {
                        type: "number",
                        description: "How much of the gap's terms this page already covers, from 0 to 1.",
                      },
                      googlePosition: {
                        type: "number",
                        description:
                          "Google position of the gap's queries on this page, when Search Console shows it already ranks there.",
                      },
                    },
                    required: ["kind", "id", "url", "title", "score"],
                  },
                  description:
                    "Existing pages to update or merge, best match first. For create, the closest existing page when there is one; empty for ignore.",
                },
              },
              required: ["action", "reason", "targets"],
            },
          },
          required: [
            "id",
            "prompt",
            "title",
            "impressions",
            "clicks",
            "position",
            "queries",
            "brief",
            "recommendation",
          ],
        },
        description:
          "Pending prompt suggestions from Google Search Console queries. Clicks, impressions and positions are from the Search Console data covering 31 to 3 days before the suggestion was generated, and are not refreshed later.",
      },
      aiSearchGaps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Use as sourceId with sourceKind ai_search when planning a brief." },
            query: { type: "string", description: "Most common wording of the web search." },
            variants: { type: "array", items: { type: "string" }, description: "Other wordings of the same search." },
            prompts: {
              type: "array",
              items: { type: "string" },
              description: "Prompt texts whose answers ran this search.",
            },
            engines: {
              type: "array",
              items: { type: "string" },
              description: "Engines that ran this search without mentioning the brand or citing its site.",
            },
            searches: {
              type: "number",
              description:
                "Scan answers in which an engine ran this web search without mentioning the brand or citing its site.",
            },
            ownMentionRate: {
              type: "number",
              description:
                "Share of answers that ran this search and still mentioned the brand or cited its site, from 0 to 1.",
            },
            competitors: {
              type: "array",
              items: { type: "string" },
              description: "Tracked competitors named in the answers that missed the brand.",
            },
            discoveredCompetitors: {
              type: "array",
              items: { type: "string" },
              description:
                "Other brands named in the answers that missed the brand and are not tracked as competitors.",
            },
            opportunity: {
              type: "number",
              description:
                "Relative priority: grows with missing mentions, searches and competitors named. Sorted highest first.",
            },
            brief: {
              type: ["object", "null"],
              properties: {
                briefId: { type: "string", description: "Use with getGeoContentBrief and approveGeoContentBrief." },
                status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
                postId: {
                  type: ["string", "null"],
                  description: "Draft post created for the brief. Null when none is linked.",
                },
                workingTitle: { type: ["string", "null"] },
                publishedAt: {
                  type: ["string", "null"],
                  description: "ISO timestamp of when the brief's post was published. Null until then.",
                },
                baseline: {
                  type: ["object", "null"],
                  properties: {
                    mentionedEngines: {
                      type: "number",
                      description: "Engines that mentioned the brand when the brief was planned.",
                    },
                    totalEngines: { type: "number", description: "Engines checked when the brief was planned." },
                  },
                  required: ["mentionedEngines", "totalEngines"],
                  description:
                    "Engine coverage captured when the brief was planned, to compare against after publishing. Only set for briefs planned from a prompt gap or prompt with scan results from the last 30 days; null otherwise.",
                },
                rescanned: {
                  type: "boolean",
                  description: "True once a rescan of the source prompt was started after the post was published.",
                },
              },
              required: ["briefId", "status", "postId", "workingTitle", "publishedAt", "baseline", "rescanned"],
              description: "The most recently updated brief planned from this gap. Null when none exists.",
            },
          },
          required: [
            "id",
            "query",
            "variants",
            "prompts",
            "engines",
            "searches",
            "ownMentionRate",
            "competitors",
            "discoveredCompetitors",
            "opportunity",
            "brief",
          ],
        },
        description: "Web searches AI engines ran in scan answers without mentioning the brand or citing its site.",
      },
      hasScanData: { type: "boolean", description: "False until the project has at least one scan result." },
      snapshotReady: {
        type: "boolean",
        description: "False while the project's content gaps snapshot is being prepared.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["promptGaps", "searchGaps", "aiSearchGaps", "hasScanData", "snapshotReady", "organization"],
  },
  listGeoEngines: {
    type: "object",
    properties: {
      engines: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Engine id to pass in the `engines` setting." },
            label: { type: "string", description: "Display name." },
            provider: {
              type: "string",
              description:
                "Vendor the engine is grouped under, such as anthropic, openai, google, perplexity or microsoft. Coding-agent engines use the agent instead, such as cursor, opencode, claude-code or codex.",
            },
            zdr: {
              type: "string",
              enum: ["all", "some", "none"],
              description:
                "Zero data retention coverage. Engines with `none` need `enforceZdr: false` or an entry in `nonZdrApprovedEngines`.",
            },
            default: { type: "boolean", description: "Part of the default engine set for new projects." },
            supportsGroundedChecks: {
              type: "boolean",
              description: "Currently always false for engines listed by the API.",
            },
          },
          required: ["id", "label", "provider", "zdr", "default", "supportsGroundedChecks"],
        },
        description: "Engines this organization can select. Legacy engines a project already tracks are not listed.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["engines", "organization"],
  },
  listGeoPersonas: {
    type: "object",
    properties: {
      configured: { type: "boolean", description: "Always `true` for a project-scoped request." },
      personas: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string", description: "Buyer archetype label, such as Budgeter." },
            role: { type: "string", description: "Short job title, at most two words." },
            company: { type: "string", description: "Kind of company the persona works at, with size and industry." },
            summary: { type: "string", description: "Buying priorities and situation, one point per line." },
            searchStyle: { type: "string", description: "How the persona writes to AI chats, one point per line." },
            profile: {
              type: "object",
              properties: {
                goals: { type: "array", items: { type: "string" } },
                painPoints: { type: "array", items: { type: "string" } },
                currentStack: { type: "array", items: { type: "string" } },
                buyingTriggers: { type: "array", items: { type: "string" } },
                objections: { type: "array", items: { type: "string" } },
              },
              required: ["goals", "painPoints", "currentStack", "buyingTriggers", "objections"],
            },
            conversationPrompts: {
              type: "array",
              items: { type: "string" },
              description:
                "Opening prompts the persona plays against each engine. Cleared when its details change; regenerate them with `promptsOnly` before the next run.",
            },
            enabled: { type: "boolean", description: "Whether scheduled scans play this persona." },
            archivedAt: {
              type: ["string", "null"],
              description: "When the persona was archived, or `null` when active.",
            },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            memories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  kind: {
                    type: "string",
                    enum: ["background", "experience", "preference", "constraint"],
                    description:
                      "`background` for career and company facts, `experience` for past events with tools or vendors, `preference` for how they like to work and buy, `constraint` for budget, compliance or team limits.",
                  },
                  content: { type: "string" },
                },
                required: ["id", "kind", "content"],
              },
              description: "First-person facts included in the persona's context when it is played.",
            },
          },
          required: [
            "id",
            "name",
            "role",
            "company",
            "summary",
            "searchStyle",
            "profile",
            "conversationPrompts",
            "enabled",
            "archivedAt",
            "createdAt",
            "updatedAt",
            "memories",
          ],
        },
        description:
          "Active personas first in creation order, then archived ones. A project keeps at most 5 active personas.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "personas", "organization"],
  },
  listGeoPromptResultSummaries: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description: "Always true for visibility data, which is read from Notra's own database.",
      },
      results: {
        type: "array",
        items: {
          type: "object",
          properties: {
            promptId: { type: "string", description: "Prompt id; use it with getGeoPromptHistory." },
            engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
            prompt: { type: "string", description: "Prompt text sent to the engine." },
            mentioned: { type: "boolean", description: "Whether the answer named your brand or one of its aliases." },
            ownedSourceCited: {
              type: "boolean",
              description: "Whether the answer cited a page on your website or tracked domains.",
            },
            position: {
              type: ["integer", "null"],
              description:
                "1-based rank of your brand when the answer lists brands. Null when not mentioned or not in a list.",
            },
            sentiment: {
              type: ["string", "null"],
              description: "Tone toward your brand: positive, neutral or negative. Null when not mentioned.",
            },
            competitors: {
              type: "array",
              items: { type: "string" },
              description: "Alternative brands the answer offered instead of yours, in order of first appearance.",
            },
            lastCheckedAt: { type: "string", description: "ISO timestamp when this answer was captured." },
            checkId: { type: "string", description: "Id of this answer; pass it to getGeoPromptResultDetail." },
          },
          required: [
            "promptId",
            "engine",
            "prompt",
            "mentioned",
            "ownedSourceCited",
            "position",
            "sentiment",
            "competitors",
            "lastCheckedAt",
            "checkId",
          ],
        },
        description:
          "Latest answer per tracked prompt and engine, newest first. Only tracked prompts in the project's prompt language; sequences and personas are left out.",
      },
      nextCursor: {
        type: ["string", "null"],
        description: "Pass as `cursor` for the next page. Null on the last page.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "results", "nextCursor", "organization"],
  },
  listGeoPrompts: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description: "Whether the analytics backend is configured. It does not affect which prompts are returned.",
      },
      prompts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "Use as `promptId` in the prompt endpoints, including `GET /v1/projects/{projectId}/geo/prompts/{promptId}/history`. A UUID for custom prompts, a fixed slug such as `best-tools` for auto prompts.",
            },
            prompt: { type: "string" },
            enabled: { type: "boolean", description: "Whether project scans ask this prompt." },
            source: {
              type: "string",
              enum: ["custom", "auto"],
              description:
                "`custom` for prompts added by the user, `auto` for prompts Notra generates from the brand settings.",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Labels on custom prompts. Always empty for auto prompts.",
            },
            createdAt: {
              type: ["string", "null"],
              description: "When the custom prompt was added. `null` for auto prompts.",
            },
          },
          required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
        },
        description:
          "Custom prompts, newest first, followed by auto prompts. Auto prompts the user removed are left out.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "prompts", "organization"],
  },
  listGeoPromptSuggestions: {
    type: "object",
    properties: {
      suggestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Suggestion id for the accept and dismiss endpoints." },
            prompt: { type: "string", description: "Prompt that would be tracked when accepted." },
            title: {
              type: ["string", "null"],
              description: "Suggested headline for an article that could win this prompt, or `null`.",
            },
            source: { type: "string", enum: ["search_console"] },
            keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  query: { type: "string" },
                  clicks: {
                    type: "number",
                    description:
                      "Search Console clicks over the 28 days ending 3 days before the suggestion was created (Search Console data lags by about 3 days).",
                  },
                  impressions: {
                    type: "number",
                    description:
                      "Search Console impressions over the 28 days ending 3 days before the suggestion was created (Search Console data lags by about 3 days).",
                  },
                  position: {
                    type: "number",
                    description:
                      "Average Google search position over the 28 days ending 3 days before the suggestion was created (Search Console data lags by about 3 days).",
                  },
                },
                required: ["query", "clicks", "impressions", "position"],
              },
              description: "Search Console queries the suggestion was derived from.",
            },
            createdAt: { type: "string" },
          },
          required: ["id", "prompt", "title", "source", "keywords", "createdAt"],
        },
        description: "Pending suggestions, newest first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["suggestions", "organization"],
  },
  listGeoScans: {
    type: "object",
    properties: {
      scans: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            projectId: { type: "string" },
            status: { type: "string", enum: ["running", "completed", "failed"] },
            startedAt: { type: "string" },
            finishedAt: {
              type: ["string", "null"],
              description: "When the scan completed or failed, or `null` while running.",
            },
            createdAt: { type: "string" },
            summary: {
              type: "object",
              properties: {
                plannedChecks: {
                  type: ["integer", "null"],
                  minimum: 0,
                  description: "Answers the scan planned to collect, or `null` when the scan recorded no plan.",
                },
                completedChecks: { type: "integer", minimum: 0, description: "Answers stored for this scan so far." },
                mentionCount: {
                  type: "integer",
                  minimum: 0,
                  description: "Stored answers that mentioned the tracked brand.",
                },
                failedChecks: {
                  type: "integer",
                  minimum: 0,
                  description: "Planned answers that failed and were not stored.",
                },
                engines: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      engine: { type: "string" },
                      plannedChecks: {
                        type: ["integer", "null"],
                        minimum: 0,
                        description:
                          "Answers planned for this engine, or `null` when the plan has no per-engine breakdown.",
                      },
                      completedChecks: { type: "integer", minimum: 0 },
                      mentionCount: { type: "integer", minimum: 0 },
                      failedChecks: { type: "integer", minimum: 0 },
                    },
                    required: ["engine", "plannedChecks", "completedChecks", "mentionCount", "failedChecks"],
                  },
                  description:
                    "The same counts per engine, sorted by engine id. Covers planned engines and engines with stored answers.",
                },
              },
              required: ["plannedChecks", "completedChecks", "mentionCount", "failedChecks", "engines"],
            },
            errorCode: {
              type: ["string", "null"],
              description:
                "Machine-readable failure code such as `scan_handoff_failed` or `scan_stale`. `null` unless `status` is `failed`.",
            },
            errorMessage: {
              type: ["string", "null"],
              description: "Human-readable failure reason. `null` unless `status` is `failed`.",
            },
            failedStage: {
              type: ["string", "null"],
              enum: ["handoff", "execution", "stale", null],
              description:
                "`handoff` when the scan could not be started, `execution` when it failed while running, `stale` when it stopped reporting progress and was closed. `null` unless `status` is `failed`.",
            },
            retryable: {
              type: ["boolean", "null"],
              description:
                "`true` when the failure was a timeout or a stale run, so starting a new scan is likely to work. `null` when unknown or the scan did not fail.",
            },
          },
          required: [
            "id",
            "projectId",
            "status",
            "startedAt",
            "finishedAt",
            "createdAt",
            "summary",
            "errorCode",
            "errorMessage",
            "failedStage",
            "retryable",
          ],
        },
        description: "Scans for the project, most recently started first.",
      },
      pagination: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1 },
          currentPage: { type: "integer", minimum: 1 },
          nextPage: {
            type: ["integer", "null"],
            minimum: 1,
            description: "Next page number, or `null` on the last page.",
          },
          previousPage: {
            type: ["integer", "null"],
            minimum: 1,
            description: "Previous page number, or `null` on the first page.",
          },
          totalPages: {
            type: "integer",
            minimum: 1,
            description: "Total pages at this `limit`. At least 1, even with no scans.",
          },
          totalItems: { type: "integer", minimum: 0, description: "Total scans recorded for the project." },
        },
        required: ["limit", "currentPage", "nextPage", "previousPage", "totalPages", "totalItems"],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["scans", "pagination", "organization"],
  },
  listGeoSentimentEvidence: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Check id of the answer." },
            scanId: { type: "string" },
            promptId: {
              type: "string",
              description:
                "Prompt the answer belongs to: `custom-` plus the prompt id for custom prompts, the slug for auto prompts.",
            },
            prompt: { type: "string" },
            engine: { type: "string" },
            language: {
              type: "string",
              description: "Language the prompt was asked in, such as `English`. An empty string means English.",
            },
            capturedAt: { type: "string" },
            answer: { type: "string" },
            excerpt: { type: "string", description: "Part of the answer around the brand mention." },
          },
          required: ["id", "scanId", "promptId", "prompt", "engine", "language", "capturedAt", "answer", "excerpt"],
        },
        description: "Answers to tracked prompts that mentioned the brand negatively, newest first, 25 per page.",
      },
      nextCursor: {
        type: ["string", "null"],
        description: "Pass as `cursor` with the same window to fetch the next page, or `null` on the last page.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["items", "nextCursor", "organization"],
  },
  listGeoSequences: {
    type: "object",
    properties: {
      sequences: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            steps: {
              type: "array",
              items: { type: "string" },
              description: "Messages sent in order as one conversation with each engine.",
            },
            enabled: { type: "boolean", description: "Whether project scans play this conversation." },
            createdAt: { type: "string" },
          },
          required: ["id", "name", "steps", "enabled", "createdAt"],
        },
        description: "The project's sequences, oldest first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["sequences", "organization"],
  },
  listGeoShelfSources: {
    type: "object",
    properties: {
      sources: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", minLength: 1 },
            url: { type: "string", maxLength: 2048, format: "uri", description: "Page URL." },
            domain: { type: "string", minLength: 1, description: "Hostname of the page." },
            title: {
              type: ["string", "null"],
              maxLength: 200,
              description: "Page title, from a teammate or from the citations in AI answers. `null` when unknown.",
            },
            kind: {
              type: "string",
              enum: ["listicle", "review_site", "community", "news", "docs", "video", "other"],
              description:
                "Type of page. For pages added by scans it is guessed from the domain, defaulting to other; teammates choose it for pages they add and can change it.",
            },
            ownership: {
              type: "string",
              enum: ["third_party", "own", "competitor"],
              description:
                "own: on your brand's website. competitor: on a tracked competitor's domain. third_party: anywhere else. Set when a scan adds the page; pages teammates add are third_party.",
            },
            origin: {
              type: "string",
              enum: ["scan", "manual"],
              description: "scan: added automatically because AI answers cited it. manual: added by a teammate.",
            },
            fetchStatus: {
              type: "string",
              enum: ["pending", "ok", "blocked", "failed"],
              description:
                "Whether Notra could read the page itself: pending, ok, blocked or failed. New sources start as pending.",
            },
            lastFetchedAt: {
              type: ["string", "null"],
              format: "date-time",
              description: "When Notra last read the page. `null` if it never has.",
            },
            citations: {
              type: "object",
              properties: {
                windowCount: {
                  type: "integer",
                  minimum: 0,
                  description: "AI answers from the 30 days before the last citation sync that cited this page.",
                },
                totalCount: { type: "integer", minimum: 0, description: "AI answers that ever cited this page." },
                promptCount: {
                  type: "integer",
                  minimum: 0,
                  description: "Distinct prompts whose answers cited this page.",
                },
                engines: {
                  type: "array",
                  items: { type: "string", minLength: 1 },
                  description: "Engines that cited this page, sorted alphabetically.",
                },
                firstCitedAt: {
                  type: ["string", "null"],
                  format: "date-time",
                  description: "First answer that cited this page. `null` when no answer has cited it.",
                },
                lastCitedAt: {
                  type: ["string", "null"],
                  format: "date-time",
                  description: "Latest answer that cited this page. `null` when no answer has cited it.",
                },
              },
              required: ["windowCount", "totalCount", "promptCount", "engines", "firstCitedAt", "lastCitedAt"],
              description: "How often AI answers for the project cited this page, as of the last citation sync.",
            },
            placements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  competitorId: {
                    type: ["string", "null"],
                    minLength: 1,
                    description: "Tracked competitor this placement is for, or `null` for your own brand.",
                  },
                  brandName: {
                    type: "string",
                    minLength: 1,
                    description: "Brand name at the time the placement was written.",
                  },
                  brandDomain: {
                    type: ["string", "null"],
                    description: "Brand website domain at the time the placement was written. `null` when unknown.",
                  },
                  status: {
                    type: "string",
                    enum: ["present", "absent", "unknown"],
                    description:
                      "present: the brand is listed on the page. absent: it is not. unknown: nobody has checked yet.",
                  },
                  position: {
                    type: ["integer", "null"],
                    exclusiveMinimum: 0,
                    description:
                      "1-based position of the brand on the page. `null` when unknown, and always `null` unless status is present.",
                  },
                  hasLink: {
                    type: "boolean",
                    description: "Whether the page links to the brand. Always false unless status is present.",
                  },
                  evidence: {
                    type: "string",
                    enum: ["fetch", "manual"],
                    description:
                      "manual: a teammate set the status. fetch: written automatically when a scan added the page.",
                  },
                  excerpt: {
                    type: ["string", "null"],
                    description: "Text from the page around the brand. `null` when none was captured.",
                  },
                  checkedAt: {
                    type: "string",
                    format: "date-time",
                    description: "When this placement's status was last set.",
                  },
                },
                required: [
                  "competitorId",
                  "brandName",
                  "brandDomain",
                  "status",
                  "position",
                  "hasLink",
                  "evidence",
                  "excerpt",
                  "checkedAt",
                ],
              },
              description:
                "Which brands are listed on the page. Your own brand is always included; a competitor appears only once marked present or absent.",
            },
            opportunity: {
              type: ["object", "null"],
              properties: {
                status: {
                  type: "string",
                  enum: ["open", "in_progress", "won", "lost", "dismissed"],
                  description: "open or in_progress while the ticket is worked on. won, lost or dismissed close it.",
                },
                priority: {
                  type: ["string", "null"],
                  enum: ["low", "medium", "high", null],
                  description: "low, medium or high. `null` when no priority is set.",
                },
                assigneeMemberId: {
                  type: ["string", "null"],
                  minLength: 1,
                  description: "Organization member id (not user id) of the assignee. `null` when unassigned.",
                },
                pocMemberId: {
                  type: ["string", "null"],
                  minLength: 1,
                  description:
                    "Organization member id of the point of contact. `null` when the assignee is also the point of contact.",
                },
                notes: { type: ["string", "null"], maxLength: 2000, description: "Free-text notes on the ticket." },
                dueAt: {
                  type: ["string", "null"],
                  format: "date-time",
                  description: "Due date. `null` when none is set.",
                },
                id: { type: "string", minLength: 1 },
                createdByUserId: { type: ["string", "null"], minLength: 1, description: "User who opened the ticket." },
                resolvedAt: {
                  type: ["string", "null"],
                  format: "date-time",
                  description:
                    "When the ticket was closed (won, lost or dismissed). Kept when it moves between closed statuses; `null` while open.",
                },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
              required: [
                "status",
                "priority",
                "assigneeMemberId",
                "pocMemberId",
                "notes",
                "dueAt",
                "id",
                "createdByUserId",
                "resolvedAt",
                "createdAt",
                "updatedAt",
              ],
              description: "Ticket for getting your brand listed on this page. `null` when none was opened.",
            },
            createdByUserId: {
              type: ["string", "null"],
              minLength: 1,
              description: "User who added the page. `null` for pages added by scans.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description:
                "For pages added by scans, when an answer first cited them; otherwise when a teammate added them.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description:
                "Last edit or citation change. Pages added by scans start with the time of their latest citation.",
            },
          },
          required: [
            "id",
            "url",
            "domain",
            "title",
            "kind",
            "ownership",
            "origin",
            "fetchStatus",
            "lastFetchedAt",
            "citations",
            "placements",
            "opportunity",
            "createdByUserId",
            "createdAt",
            "updatedAt",
          ],
        },
        description:
          "The project's shelf sources, most recently updated first. Homepage URLs found by scans are left out.",
      },
      nextOffset: {
        type: ["integer", "null"],
        minimum: 0,
        description: "Pass as `offset` to fetch the next page, or `null` when this is the last page.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["sources", "nextOffset", "organization"],
  },
  listGeoTrafficJourneys: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description:
          "False when the traffic backend is not configured for this deployment; the payload is then empty rather than an error.",
      },
      journeys: {
        type: "array",
        items: {
          type: "object",
          properties: {
            journeyId: { type: "string", description: "Pass it to getGeoTrafficJourney for every request." },
            source: {
              type: "string",
              description: "Crawler name for crawlers, or the AI assistant a referral came from.",
            },
            visitorType: {
              type: "string",
              enum: ["crawler", "ai_referral", "human", "unknown"],
              description:
                "crawler: an AI bot fetched the page. ai_referral: a person arrived from an AI assistant's link.",
            },
            pages: { type: "integer", description: "Requests in this journey within the window." },
            distinctPaths: { type: "integer", description: "Distinct paths requested in this journey." },
            firstSeenAt: {
              type: "string",
              description:
                "UTC time of the journey's first request in the window, formatted `YYYY-MM-DD HH:MM:SS` with no time zone suffix.",
            },
            lastSeenAt: {
              type: "string",
              description:
                "UTC time of the journey's latest request in the window, formatted `YYYY-MM-DD HH:MM:SS` with no time zone suffix.",
            },
            entryPath: { type: "string", description: "Path of the journey's first request." },
            samplePaths: {
              type: "array",
              items: { type: "string" },
              description: "Distinct paths the journey requested, in no particular order.",
            },
          },
          required: [
            "journeyId",
            "source",
            "visitorType",
            "pages",
            "distinctPaths",
            "firstSeenAt",
            "lastSeenAt",
            "entryPath",
            "samplePaths",
          ],
        },
        description: "Crawler and AI referral journeys, most recent activity first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "journeys", "organization"],
  },
  listGeoTrafficPages: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description:
          "False when the traffic backend is not configured for this deployment; the payload is then empty rather than an error.",
      },
      pages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            path: { type: "string" },
            host: { type: "string" },
            source: {
              type: "string",
              description: "Crawler name for crawlers, or the AI assistant a referral came from.",
            },
            visitorType: {
              type: "string",
              enum: ["crawler", "ai_referral", "human", "unknown"],
              description:
                "crawler: an AI bot fetched the page. ai_referral: a person arrived from an AI assistant's link.",
            },
            visits: {
              type: "integer",
              description: "Requests to this page from this source in the window, including imported history.",
            },
            previousVisits: {
              type: "integer",
              description: "Requests in the previous window of the same length, right before this one.",
            },
            lastSeenAt: {
              type: "string",
              description:
                "UTC time of the newest request in the window, formatted `YYYY-MM-DD HH:MM:SS` with no time zone suffix. Midnight of the day for imported history.",
            },
          },
          required: ["path", "host", "source", "visitorType", "visits", "lastSeenAt"],
        },
        description: "One row per host, path, source and visitor type, most requests first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "pages", "organization"],
  },
  listIntegrations: {
    type: "object",
    properties: {
      github: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "GitHub integration ID. Use it in integrations.github for post generation, as integrationId for post pull requests and as repositoryId for scheduled GitHub publishing.",
            },
            displayName: {
              type: "string",
              description: "Label for the repository, owner/repo when created through the API.",
            },
            owner: {
              type: ["string", "null"],
              description:
                "Repository owner (user or organization). Null only for integrations connected before Notra stored the owner and repository name on the integration; every connection path sets both today.",
            },
            repo: {
              type: ["string", "null"],
              description: "Repository name without the owner. Null under the same condition as owner.",
            },
            defaultBranch: {
              type: ["string", "null"],
              description: "Branch Notra reads activity from. Null means the repository's default branch on GitHub.",
            },
          },
          required: ["id", "displayName", "owner", "repo", "defaultBranch"],
        },
        description: "Enabled GitHub integrations. One entry per connected repository.",
      },
      slack: {
        type: "array",
        items: {},
        description: "Always empty. Slack is connected from the dashboard and is not exposed through the API.",
      },
      linear: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            displayName: { type: "string" },
            linearOrganizationId: { type: "string", description: "ID of the connected Linear workspace." },
            linearOrganizationName: { type: ["string", "null"] },
            linearTeamId: {
              type: ["string", "null"],
              description: "Linear team that issues are read from. Null means every team in the Linear workspace.",
            },
            linearTeamName: { type: ["string", "null"] },
          },
          required: [
            "id",
            "displayName",
            "linearOrganizationId",
            "linearOrganizationName",
            "linearTeamId",
            "linearTeamName",
          ],
        },
        description: "Enabled Linear integrations.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["github", "slack", "linear", "organization"],
  },
  listPostAuthors: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      authors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Pass this ID in metadata.authorIds when updating a post." },
            slug: { type: "string" },
            name: { type: "string" },
            title: { type: ["string", "null"] },
            bio: { type: ["string", "null"] },
            avatarUrl: { type: ["string", "null"] },
            url: { type: ["string", "null"], description: "Author's website." },
            x: { type: ["string", "null"] },
            linkedin: { type: ["string", "null"] },
            github: { type: ["string", "null"] },
            youtube: { type: ["string", "null"] },
            bluesky: { type: ["string", "null"] },
            mastodon: { type: ["string", "null"] },
            threads: { type: ["string", "null"] },
            instagram: { type: ["string", "null"] },
          },
          required: [
            "id",
            "slug",
            "name",
            "title",
            "bio",
            "avatarUrl",
            "url",
            "x",
            "linkedin",
            "github",
            "youtube",
            "bluesky",
            "mastodon",
            "threads",
            "instagram",
          ],
        },
      },
    },
    required: ["organization", "authors"],
  },
  listPosts: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      posts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            slug: {
              type: ["string", "null"],
              description: "URL slug. Only blog posts and changelogs have one; null when none is set.",
            },
            content: {
              type: "string",
              description:
                "Rendered HTML for text posts. For image posts, this is the public CDN URL of the rendered image.",
            },
            htmlUrl: {
              type: ["string", "null"],
              description: "Public CDN URL of the generated HTML artifact for image posts. Null for non-image posts.",
            },
            markdown: {
              type: ["string", "null"],
              description: "Markdown source for text posts. Null for image posts.",
            },
            rawHtml: {
              type: ["string", "null"],
              description:
                "Legacy inline generated HTML for image posts. New generated image HTML is stored as htmlUrl. Null for non-image posts.",
            },
            recommendations: {
              type: ["string", "null"],
              description:
                "Publishing suggestions written by the generator as Markdown, such as when and where to share the post. Null when there are none.",
            },
            contentType: {
              type: "string",
              enum: ["changelog", "linkedin_post", "twitter_post", "blog_post", "investor_update", "image"],
            },
            sourceMetadata: {
              description:
                "Free-form JSON recorded by whatever produced the post, such as a generation run or chat. Null for posts created with POST /v1/posts. Posts from generation runs (POST /v1/posts/generate, schedules, event triggers and GEO content briefs) include brandVoiceId, the brand identity the run wrote in (absent when the workspace had none), which the brandIdentityId filter of GET /v1/posts reads.",
            },
            metadata: {
              type: ["object", "null"],
              properties: {
                coverImage: {
                  type: ["object", "null"],
                  properties: {
                    url: {
                      type: "string",
                      description:
                        "Absolute https URL, or a path to an image uploaded in Notra (starting with /api/uploads/).",
                    },
                    alt: { type: "string", description: "Alt text. Empty string when none is set." },
                  },
                  required: ["url", "alt"],
                  description: "Cover image shown on post cards and social previews.",
                },
                tags: { type: "array", items: { type: "string" } },
                excerpt: {
                  type: ["string", "null"],
                  description:
                    "Summary shown on post cards and in meta descriptions. Null means it is derived from the first paragraph.",
                },
                authors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      slug: {
                        type: "string",
                        description: "Stable author handle; hosted sites list the author's posts at /author/{slug}.",
                      },
                      name: { type: "string" },
                      title: { type: ["string", "null"] },
                      avatarUrl: { type: ["string", "null"] },
                      url: { type: ["string", "null"], description: "Author's website." },
                      x: { type: ["string", "null"] },
                      linkedin: { type: ["string", "null"] },
                      github: { type: ["string", "null"] },
                      youtube: { type: ["string", "null"] },
                      bluesky: { type: ["string", "null"] },
                      mastodon: { type: ["string", "null"] },
                      threads: { type: ["string", "null"] },
                      instagram: { type: ["string", "null"] },
                    },
                    required: [
                      "id",
                      "slug",
                      "name",
                      "title",
                      "avatarUrl",
                      "url",
                      "x",
                      "linkedin",
                      "github",
                      "youtube",
                      "bluesky",
                      "mastodon",
                      "threads",
                      "instagram",
                    ],
                  },
                  description:
                    "Credited authors in display order. Authors deleted since they were assigned are omitted. On blog posts that publish to a Notra Sites site, authors whose id starts with site: come from the site's blog.json, unpublished Design changes included.",
                },
                featured: { type: "boolean", description: "Pinned to the top of the blog index on hosted sites." },
                noindex: {
                  type: "boolean",
                  description: "Asks search engines not to index the post and leaves it out of the sitemap.",
                },
                hidden: {
                  type: "boolean",
                  description:
                    "Reachable by direct link, but excluded from hosted site listings, feeds, search engine indexing, sitemaps and generated AI indexes. Not private.",
                },
                displayDate: {
                  type: ["string", "null"],
                  description: "Date shown on the post as YYYY-MM-DD. Null means the publish date is used.",
                },
              },
              required: ["coverImage", "tags", "excerpt", "authors", "featured", "noindex", "hidden", "displayDate"],
              description:
                "Cover image, tags, excerpt, authors and other site metadata. Set for blog posts and changelogs, null for every other content type.",
            },
            status: { type: "string", enum: ["draft", "published"] },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
          required: [
            "id",
            "title",
            "slug",
            "content",
            "htmlUrl",
            "markdown",
            "rawHtml",
            "recommendations",
            "contentType",
            "metadata",
            "status",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      pagination: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1 },
          currentPage: { type: "integer", minimum: 1 },
          nextPage: { type: ["integer", "null"], minimum: 1, description: "Null on the last page." },
          previousPage: { type: ["integer", "null"], minimum: 1, description: "Null on the first page." },
          totalPages: { type: "integer", minimum: 1, description: "At least 1, even when no posts match." },
          totalItems: { type: "integer", minimum: 0, description: "Posts matching the filters across all pages." },
        },
        required: ["limit", "currentPage", "nextPage", "previousPage", "totalPages", "totalItems"],
      },
    },
    required: ["organization", "posts", "pagination"],
  },
  listProjects: {
    type: "object",
    properties: {
      projects: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Use as projectId in the endpoints under /v1/projects/{projectId}." },
            name: { type: "string" },
            brandSettingsId: {
              type: "string",
              description: "ID of the brand identity linked to the project, as listed by GET /v1/brand-identities.",
            },
            createdAt: { type: "string" },
          },
          required: ["id", "name", "brandSettingsId", "createdAt"],
        },
        description: "Projects, oldest first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["projects", "organization"],
  },
  listScheduleRuns: {
    type: "object",
    properties: {
      runs: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            status: {
              type: "string",
              enum: ["running", "success", "failed", "skipped"],
              description:
                "`running` until the run reports back. A run that never reports back is shown as `failed` after six hours.",
            },
            title: {
              type: ["string", "null"],
              description:
                'Title of the post the run created, or a count such as "3 linkedin post drafts" when it created several. Null while running and for runs that created nothing.',
            },
            postId: {
              type: ["string", "null"],
              description:
                "ID of the post the run created, or the first one when it created several. Null when it created none.",
            },
            errorMessage: { type: ["string", "null"], description: "Why a failed or skipped run produced no content." },
            manual: { type: "boolean", description: "Started on demand rather than by the schedule." },
            startedAt: { type: "string" },
            finishedAt: {
              type: ["string", "null"],
              description: "When the run reported its result. Null while running.",
            },
          },
          required: ["id", "status", "title", "postId", "errorMessage", "manual", "startedAt", "finishedAt"],
        },
        description: "Runs, newest first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["runs", "organization"],
  },
  listSchedules: {
    type: "object",
    properties: {
      schedules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            organizationId: { type: "string" },
            name: { type: "string" },
            sourceType: { type: "string", enum: ["cron"] },
            sourceConfig: {
              type: "object",
              properties: {
                cron: {
                  type: "object",
                  properties: {
                    frequency: {
                      type: "string",
                      enum: ["daily", "weekly", "monthly", "custom"],
                      description: "How often the schedule runs.",
                    },
                    hour: {
                      type: "integer",
                      minimum: 0,
                      maximum: 23,
                      description: "Hour of the day to run, in UTC (0-23).",
                    },
                    minute: {
                      type: "integer",
                      minimum: 0,
                      maximum: 59,
                      description: "Minute of the hour to run (0-59).",
                    },
                    dayOfWeek: {
                      type: "integer",
                      minimum: 0,
                      maximum: 6,
                      description:
                        "Day of the week for weekly schedules, 0 (Sunday) to 6 (Saturday). Required when frequency is weekly.",
                    },
                    dayOfMonth: {
                      type: "integer",
                      minimum: 1,
                      maximum: 31,
                      description:
                        "Day of the month for monthly schedules (1-31). Required when frequency is monthly. Months without that day are skipped, so 31 runs only in 31-day months.",
                    },
                    intervalDays: {
                      type: "integer",
                      minimum: 2,
                      maximum: 90,
                      description: "Run every N days (2-90). Required when frequency is custom.",
                    },
                    anchorDate: {
                      type: "string",
                      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
                      description: "UTC calendar date (YYYY-MM-DD) a custom interval counts from. Defaults to today.",
                    },
                  },
                  required: ["frequency", "hour", "minute"],
                },
              },
              required: ["cron"],
            },
            targets: {
              type: "object",
              properties: {
                repositoryIds: {
                  type: "array",
                  items: { type: "string" },
                  description:
                    "GitHub integration IDs to generate from, as returned in the github array of GET /v1/integrations.",
                },
                linearIntegrationIds: {
                  type: "array",
                  items: { type: "string" },
                  description:
                    "Linear integration IDs to generate from, as returned in the linear array of GET /v1/integrations. When omitted, runs read every enabled Linear integration; send [] to read none.",
                },
              },
              required: ["repositoryIds"],
            },
            outputType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
            outputConfig: {
              type: ["object", "null"],
              properties: {
                publishDestination: {
                  type: "string",
                  enum: ["webflow", "framer", "custom"],
                  description:
                    "Deprecated and ignored. Auto-published posts are only marked as published in Notra; publish to GitHub or a Notra site from the post instead.",
                  deprecated: true,
                },
                brandVoiceId: {
                  type: "string",
                  minLength: 1,
                  description: "Brand identity ID to write in. Defaults to the organization's default brand identity.",
                },
                instructions: {
                  type: "string",
                  minLength: 1,
                  maxLength: 2000,
                  description:
                    "Free-text brief for this schedule, passed to the writer on every run on top of the brand's custom instructions. Use it to steer the angle of the content, for example tutorial-style blog posts.",
                },
                notify: {
                  type: "object",
                  properties: { slack: { type: "boolean" }, email: { type: "boolean" } },
                  required: ["slack", "email"],
                  description:
                    "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
                },
              },
            },
            enabled: {
              type: "boolean",
              description: "Whether the schedule runs. Disabled schedules are stored but never fire.",
            },
            autoPublish: {
              type: "boolean",
              description:
                "Save generated changelogs and blog posts with status published instead of draft. This only marks them published in Notra; nothing is pushed to GitHub or a Notra site. Other output types always stay drafts.",
            },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            lookbackWindow: {
              type: "string",
              enum: ["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"],
              description: "How far back each run collects source activity.",
            },
          },
          required: [
            "id",
            "organizationId",
            "name",
            "sourceType",
            "sourceConfig",
            "targets",
            "outputType",
            "enabled",
            "autoPublish",
            "createdAt",
            "updatedAt",
            "lookbackWindow",
          ],
        },
        description: "Schedules, newest first.",
      },
      repositoryMap: {
        type: "object",
        additionalProperties: { type: "string" },
        description:
          "Maps each targeted GitHub integration ID to an owner/repo label, followed by the default branch when one is known. Integrations without an owner and repo are left out.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["schedules", "repositoryMap", "organization"],
  },
  listSiteAuthors: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: { id: { type: "string" }, name: { type: "string" } },
        required: ["id", "name"],
      },
      authors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            ref: {
              type: "string",
              description:
                "Pass this in metadata.authorIds of PATCH /v1/posts/{postId} to credit the author on a blog post that publishes to this site.",
            },
            name: { type: "string" },
            title: { type: ["string", "null"] },
            bio: { type: ["string", "null"] },
            avatar: {
              type: ["string", "null"],
              description: "As written in blog.json: a site path such as /images/jane.png or an https URL.",
            },
            avatarUrl: { type: ["string", "null"], description: "The avatar as a full URL on the live site." },
            url: { type: ["string", "null"] },
            x: { type: ["string", "null"] },
            linkedin: { type: ["string", "null"] },
            github: { type: ["string", "null"] },
            youtube: { type: ["string", "null"] },
            bluesky: { type: ["string", "null"] },
            mastodon: { type: ["string", "null"] },
            threads: { type: ["string", "null"] },
            instagram: { type: ["string", "null"] },
            live: {
              type: "boolean",
              description:
                "The author is in the published blog.json. False while it only exists in unpublished changes.",
            },
            posts: { type: "integer", description: "Notra blog posts on this site that credit the author." },
          },
          required: [
            "id",
            "ref",
            "name",
            "title",
            "bio",
            "avatar",
            "avatarUrl",
            "url",
            "x",
            "linkedin",
            "github",
            "youtube",
            "bluesky",
            "mastodon",
            "threads",
            "instagram",
            "live",
            "posts",
          ],
        },
        description: "Authors in blog.json order, including unpublished changes.",
      },
      authorPage: {
        type: "string",
        enum: ["inline", "stacked"],
        description: "Layout of every author page: inline puts the avatar beside the name, stacked puts it above.",
      },
      hasUnpublishedChanges: {
        type: "boolean",
        description:
          "blog.json has staged Design changes that are not live yet. Publish them with POST /v1/sites/{siteId}/publish or from the dashboard.",
      },
    },
    required: ["site", "authors", "authorPage", "hasUnpublishedChanges"],
  },
  listSiteDeployments: {
    type: "object",
    properties: {
      deployments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            kind: {
              type: "string",
              enum: ["production", "preview"],
              description:
                "production builds the production branch for visitors; preview builds a branch, pull request or post preview.",
            },
            previewKey: {
              type: ["string", "null"],
              description:
                "Preview the deployment builds, matching previewKey in a Site's previews. Null for production.",
            },
            trigger: {
              type: "string",
              enum: ["push", "pull_request", "manual", "redeploy", "config", "toolchain"],
              description:
                "push and pull_request come from GitHub, manual from a deploy request, redeploy from a rebuild, config from a settings change, and toolchain from Notra rebuilding the live commit after a builder update.",
            },
            status: {
              type: "string",
              enum: [
                "queued",
                "building",
                "uploading",
                "ready",
                "superseded",
                "skipped",
                "failed",
                "canceled",
                "expired",
              ],
              description:
                "queued, building and uploading are in progress; ready, superseded, skipped, failed, canceled and expired are final.",
            },
            live: { type: "boolean", description: "The deployment is serving production or a preview now." },
            liveSince: { type: ["string", "null"], description: "When it started serving. Null when not live." },
            branch: { type: "string" },
            commitSha: { type: "string" },
            commitMessage: { type: ["string", "null"] },
            commitAuthor: { type: ["string", "null"] },
            pullRequestNumber: { type: ["integer", "null"] },
            url: { type: "string", description: "Where the deployment serves its first section." },
            fileCount: {
              type: ["integer", "null"],
              description:
                "Files in the built output. Set when the build becomes ready; null for deployments that never finished a build, such as queued, skipped, failed or canceled ones.",
            },
            totalBytes: {
              type: ["integer", "null"],
              description: "Total size of the built output in bytes. Null under the same conditions as fileCount.",
            },
            buildDurationMs: { type: ["integer", "null"], description: "Build time in milliseconds." },
            errorMessage: {
              type: ["string", "null"],
              description: "Why the build failed, or why it was canceled or superseded before building.",
            },
            skipReason: { type: ["string", "null"], description: "Why smart deployments skipped the build." },
            diagnostics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: { type: "string", enum: ["error", "warning"] },
                  file: {
                    type: ["string", "null"],
                    description: "File the diagnostic points at, or null when it has none.",
                  },
                  line: { type: "integer" },
                  column: { type: "integer" },
                  code: { type: "string" },
                  message: { type: "string" },
                },
                required: ["severity", "file", "code", "message"],
              },
              description: "Compiler errors and warnings with file and line.",
            },
            createdAt: { type: "string" },
            startedAt: { type: ["string", "null"] },
            finishedAt: { type: ["string", "null"] },
          },
          required: [
            "id",
            "kind",
            "previewKey",
            "trigger",
            "status",
            "live",
            "liveSince",
            "branch",
            "commitSha",
            "commitMessage",
            "commitAuthor",
            "pullRequestNumber",
            "url",
            "fileCount",
            "totalBytes",
            "buildDurationMs",
            "errorMessage",
            "skipReason",
            "diagnostics",
            "createdAt",
            "startedAt",
            "finishedAt",
          ],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["deployments", "organization"],
  },
  listSites: {
    type: "object",
    properties: {
      sites: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            url: { type: "string", description: "Where the site serves its first area, such as its blog." },
            status: { type: "string", description: "active, or suspended while the site is paused." },
            live: { type: "boolean", description: "The site has a production deployment serving visitors." },
            blogMount: {
              type: ["string", "null"],
              description:
                "Path the blog is served under, or null when the site has no blog. Only sites with a blog have authors.",
            },
          },
          required: ["id", "name", "url", "status", "live", "blogMount"],
        },
        description: "Use a Site's id as siteId in /v1/sites/{siteId}.",
      },
    },
    required: ["sites"],
  },
  listSkills: {
    type: "object",
    properties: {
      skills: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: {
              type: "string",
              description: "Unique within the organization. Use it as {name} in /v1/skills/{name}.",
            },
            description: { type: "string", description: "Short description of when the skill should be used." },
            isSystem: {
              type: "boolean",
              description:
                "True for built-in skills provided by Notra. System skills can be edited but not renamed or deleted.",
            },
            updatedAt: { type: "string" },
          },
          required: ["id", "name", "description", "isSystem", "updatedAt"],
        },
        description: "Skills sorted by name, without their content.",
      },
    },
    required: ["skills"],
  },
  listWebhookDeliveries: {
    type: "object",
    properties: {
      deliveries: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Sent to the endpoint in the x-notra-delivery-id header." },
            eventId: {
              type: "string",
              description:
                "The event this delivery carries, sent in the x-notra-event-id header. Each subscribed endpoint gets its own delivery of the same event.",
            },
            endpointId: { type: "string" },
            url: { type: "string", description: "URL the delivery is sent to." },
            eventType: {
              type: "string",
              enum: [
                "post.generation.completed",
                "post.generation.failed",
                "post.generation.skipped",
                "brand_identity.generation.completed",
                "brand_identity.generation.failed",
                "post.published",
                "post.created",
                "post.updated",
                "post.deleted",
                "post.unpublished",
                "geo.scan.completed",
                "geo.scan.failed",
                "geo.alert.triggered",
              ],
            },
            status: {
              type: "string",
              enum: ["pending", "sending", "retrying", "succeeded", "failed", "cancelled"],
              description:
                "pending waits for its first attempt, sending is in flight and retrying waits for another attempt. succeeded got a 2xx response; failed ran out of attempts or hit an error that is not retried; cancelled stopped because the endpoint was removed or disabled.",
            },
            attemptCount: {
              type: "number",
              description: "Attempts made so far. Up to 8 attempts are made, and a manual retry allows 8 more.",
            },
            nextAttemptAt: {
              type: "string",
              description: "When the next attempt is due. Only meaningful while pending or retrying.",
            },
            createdAt: { type: "string" },
            statusCode: {
              type: ["number", "null"],
              description:
                "HTTP status of the latest attempt. Null before the first attempt finishes or when no response came back.",
            },
            error: {
              type: ["string", "null"],
              description:
                "Error code of the latest attempt: http_<status> for a non-2xx response, or network, timeout (no response within 10 seconds), unsafe_url, signing_failed or lease_expired_outcome_unknown. Null when it succeeded or has not finished.",
            },
          },
          required: [
            "id",
            "eventId",
            "endpointId",
            "url",
            "eventType",
            "status",
            "attemptCount",
            "nextAttemptAt",
            "createdAt",
            "statusCode",
            "error",
          ],
        },
        description: "Up to 25 deliveries, newest first.",
      },
      hasMore: { type: "boolean", description: "More deliveries follow. Request the next page with offset + 25." },
    },
    required: ["deliveries", "hasMore"],
  },
  listWebhookEndpoints: {
    type: "object",
    properties: {
      endpoints: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            organizationId: { type: "string" },
            url: { type: "string", description: "HTTPS URL that receives signed POST requests." },
            events: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "post.generation.completed",
                  "post.generation.failed",
                  "post.generation.skipped",
                  "brand_identity.generation.completed",
                  "brand_identity.generation.failed",
                  "post.published",
                  "post.created",
                  "post.updated",
                  "post.deleted",
                  "post.unpublished",
                  "geo.scan.completed",
                  "geo.scan.failed",
                  "geo.alert.triggered",
                ],
              },
              description: "Event types delivered to this endpoint.",
            },
            enabled: { type: "boolean", description: "Disabled endpoints receive no deliveries." },
            createdAt: { type: "string" },
          },
          required: ["id", "organizationId", "url", "events", "enabled", "createdAt"],
        },
      },
    },
    required: ["endpoints"],
  },
  patchSkill: {
    type: "object",
    properties: {
      skill: {
        allOf: [
          {
            type: "object",
            properties: {
              id: { type: "string" },
              name: {
                type: "string",
                description: "Unique within the organization. Use it as {name} in /v1/skills/{name}.",
              },
              description: { type: "string", description: "Short description of when the skill should be used." },
              isSystem: {
                type: "boolean",
                description:
                  "True for built-in skills provided by Notra. System skills can be edited but not renamed or deleted.",
              },
              updatedAt: { type: "string" },
            },
            required: ["id", "name", "description", "isSystem", "updatedAt"],
          },
          {
            type: "object",
            properties: {
              content: { type: "string", description: "Full skill instructions, typically Markdown." },
              createdAt: { type: "string" },
            },
            required: ["content", "createdAt"],
          },
        ],
      },
    },
    required: ["skill"],
  },
  planGeoContentBrief: {
    type: "object",
    properties: {
      briefId: { type: "string", description: "New brief id, or the id of an open brief reused for the same source." },
      brief: {
        type: "object",
        properties: {
          targetPrompt: { type: "string", description: "The AI assistant prompt the article is written to win." },
          intent: { type: "string", description: "Search intent behind the target prompt." },
          contentSubtype: {
            type: "string",
            enum: ["guide", "comparison", "listicle", "how-to", "faq", "alternatives"],
            description: "Kind of blog post to write.",
          },
          workingTitle: { type: "string", description: "Planned article title, up to 120 characters." },
          audience: { type: "string", description: "Who the article is for." },
          jobToBeDone: { type: "string", description: "What the reader is trying to get done." },
          sections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                heading: { type: "string", description: "H2 heading for the section." },
                goal: { type: "string", description: "One sentence on what the reader should take away." },
                claims: {
                  type: "array",
                  items: { type: "string" },
                  description: "Up to 5 concrete, checkable claims the section must make.",
                },
              },
              required: ["heading", "goal", "claims"],
            },
            description: "The outline, 3 to 8 sections in order.",
          },
          questionsToAnswer: {
            type: "array",
            items: { type: "string" },
            description: "Up to 8 questions the article's FAQ must answer directly.",
          },
          internalLinks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  description:
                    "Brand page to link. The planner is told to copy it from the project's sitemap; Notra does not check it.",
                },
                anchor: { type: "string", description: "Anchor text for the link." },
                why: { type: "string", description: "Why the page belongs in the article." },
              },
              required: ["url", "anchor", "why"],
            },
            description: "Up to 6 links to the brand's own pages, picked from the project's sitemap pages.",
          },
          acceptanceChecklist: {
            type: "array",
            items: { type: "string" },
            description: "Up to 8 checks the finished article must pass, based on Notra's GEO writing rules.",
          },
          recommendedAngle: {
            type: "string",
            description:
              "Why this article should earn the mention, based on current AI answers. Only filled when the brief was planned from scan evidence.",
          },
          competitorsToCounter: {
            type: "array",
            items: { type: "string" },
            description:
              "Brands named in current AI answers and the claims that earned them the mention. Only filled when the brief was planned from scan evidence.",
          },
          sourcesToReference: {
            type: "array",
            items: { type: "string" },
            description:
              "Domains cited in current AI answers. Only filled when the brief was planned from scan evidence.",
          },
          missingCoverage: {
            type: "array",
            items: { type: "string" },
            description:
              "Facts or topics winning AI answers covered that the brand must now cover. Only filled when the brief was planned from scan evidence.",
          },
          baseline: {
            type: ["object", "null"],
            properties: {
              sourcePromptId: { type: "string", description: "Prompt id the brief was planned from." },
              mentionedEngines: { type: "number", description: "Engines whose latest answer mentioned the brand." },
              totalEngines: { type: "number", description: "Engines with an answer in the last 30 days." },
              engines: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    engine: { type: "string" },
                    mentioned: { type: "boolean" },
                    position: {
                      type: ["number", "null"],
                      description: "Position of the brand in the answer. Null when the answer gave it none.",
                    },
                  },
                  required: ["engine", "mentioned", "position"],
                },
                description: "Latest answer per engine.",
              },
              competitorMentions: {
                type: "array",
                items: {
                  type: "object",
                  properties: { name: { type: "string" }, engines: { type: "number" } },
                  required: ["name", "engines"],
                },
                description: "Competitors named in the answers, with the number of engines naming each.",
              },
              citedDomains: {
                type: "array",
                items: {
                  type: "object",
                  properties: { domain: { type: "string" }, engines: { type: "number" } },
                  required: ["domain", "engines"],
                },
                description: "Domains cited in the answers, with the number of engines citing each.",
              },
              capturedAt: { type: ["string", "null"], description: "ISO timestamp of the newest answer used." },
            },
            required: [
              "sourcePromptId",
              "mentionedEngines",
              "totalEngines",
              "engines",
              "competitorMentions",
              "citedDomains",
              "capturedAt",
            ],
            description:
              "How AI engines answered the source prompt when the brief was planned, from answers in the last 30 days. Only set for briefs planned from a prompt gap or prompt; null when there were no recent answers.",
          },
        },
        required: [
          "targetPrompt",
          "intent",
          "contentSubtype",
          "workingTitle",
          "audience",
          "jobToBeDone",
          "sections",
          "questionsToAnswer",
          "internalLinks",
          "acceptanceChecklist",
        ],
        description:
          "The article plan. Notra's AI planner writes the text fields; updateGeoContentBrief can change them.",
      },
      status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
      runId: {
        type: ["string", "null"],
        description: "Writer run id. Null when no writer run has started for the brief.",
      },
      postId: { type: ["string", "null"], description: "Draft post the writer fills in. Null when none is linked." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["briefId", "brief", "status", "runId", "postId", "organization"],
  },
  publishPostToSite: {
    type: "object",
    properties: {
      operation: {
        type: "string",
        enum: ["created", "updated"],
        description:
          "created when a new pull request was opened, updated when the post's open pull request was updated.",
      },
      branchName: { type: "string", description: "Branch the pull request merges from." },
      path: { type: "string", description: "Path of the post's file in the repository." },
      pullRequestNumber: { type: "integer" },
      pullRequestUrl: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["operation", "branchName", "path", "pullRequestNumber", "pullRequestUrl", "organization"],
  },
  publishSite: {
    type: "object",
    properties: {
      published: { type: "boolean", description: "False when there was nothing to publish." },
      commitSha: { type: ["string", "null"], description: "The commit that put the changes live." },
      deploymentQueued: {
        type: "boolean",
        description:
          "A production deployment of the commit was queued. False when it could not be queued yet; the site then deploys on its next push.",
      },
    },
    required: ["published", "commitSha", "deploymentQueued"],
  },
  redeploySiteDeployment: {
    type: "object",
    properties: {
      deployment: {
        type: "object",
        properties: {
          id: { type: "string" },
          kind: {
            type: "string",
            enum: ["production", "preview"],
            description:
              "production builds the production branch for visitors; preview builds a branch, pull request or post preview.",
          },
          previewKey: {
            type: ["string", "null"],
            description:
              "Preview the deployment builds, matching previewKey in a Site's previews. Null for production.",
          },
          trigger: {
            type: "string",
            enum: ["push", "pull_request", "manual", "redeploy", "config", "toolchain"],
            description:
              "push and pull_request come from GitHub, manual from a deploy request, redeploy from a rebuild, config from a settings change, and toolchain from Notra rebuilding the live commit after a builder update.",
          },
          status: {
            type: "string",
            enum: [
              "queued",
              "building",
              "uploading",
              "ready",
              "superseded",
              "skipped",
              "failed",
              "canceled",
              "expired",
            ],
            description:
              "queued, building and uploading are in progress; ready, superseded, skipped, failed, canceled and expired are final.",
          },
          live: { type: "boolean", description: "The deployment is serving production or a preview now." },
          liveSince: { type: ["string", "null"], description: "When it started serving. Null when not live." },
          branch: { type: "string" },
          commitSha: { type: "string" },
          commitMessage: { type: ["string", "null"] },
          commitAuthor: { type: ["string", "null"] },
          pullRequestNumber: { type: ["integer", "null"] },
          url: { type: "string", description: "Where the deployment serves its first section." },
          fileCount: {
            type: ["integer", "null"],
            description:
              "Files in the built output. Set when the build becomes ready; null for deployments that never finished a build, such as queued, skipped, failed or canceled ones.",
          },
          totalBytes: {
            type: ["integer", "null"],
            description: "Total size of the built output in bytes. Null under the same conditions as fileCount.",
          },
          buildDurationMs: { type: ["integer", "null"], description: "Build time in milliseconds." },
          errorMessage: {
            type: ["string", "null"],
            description: "Why the build failed, or why it was canceled or superseded before building.",
          },
          skipReason: { type: ["string", "null"], description: "Why smart deployments skipped the build." },
          diagnostics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                severity: { type: "string", enum: ["error", "warning"] },
                file: {
                  type: ["string", "null"],
                  description: "File the diagnostic points at, or null when it has none.",
                },
                line: { type: "integer" },
                column: { type: "integer" },
                code: { type: "string" },
                message: { type: "string" },
              },
              required: ["severity", "file", "code", "message"],
            },
            description: "Compiler errors and warnings with file and line.",
          },
          createdAt: { type: "string" },
          startedAt: { type: ["string", "null"] },
          finishedAt: { type: ["string", "null"] },
        },
        required: [
          "id",
          "kind",
          "previewKey",
          "trigger",
          "status",
          "live",
          "liveSince",
          "branch",
          "commitSha",
          "commitMessage",
          "commitAuthor",
          "pullRequestNumber",
          "url",
          "fileCount",
          "totalBytes",
          "buildDurationMs",
          "errorMessage",
          "skipReason",
          "diagnostics",
          "createdAt",
          "startedAt",
          "finishedAt",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["deployment", "organization"],
  },
  restoreGeoPersona: {
    type: "object",
    properties: {
      persona: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string", description: "Buyer archetype label, such as Budgeter." },
          role: { type: "string", description: "Short job title, at most two words." },
          company: { type: "string", description: "Kind of company the persona works at, with size and industry." },
          summary: { type: "string", description: "Buying priorities and situation, one point per line." },
          searchStyle: { type: "string", description: "How the persona writes to AI chats, one point per line." },
          profile: {
            type: "object",
            properties: {
              goals: { type: "array", items: { type: "string" } },
              painPoints: { type: "array", items: { type: "string" } },
              currentStack: { type: "array", items: { type: "string" } },
              buyingTriggers: { type: "array", items: { type: "string" } },
              objections: { type: "array", items: { type: "string" } },
            },
            required: ["goals", "painPoints", "currentStack", "buyingTriggers", "objections"],
          },
          conversationPrompts: {
            type: "array",
            items: { type: "string" },
            description:
              "Opening prompts the persona plays against each engine. Cleared when its details change; regenerate them with `promptsOnly` before the next run.",
          },
          enabled: { type: "boolean", description: "Whether scheduled scans play this persona." },
          archivedAt: {
            type: ["string", "null"],
            description: "When the persona was archived, or `null` when active.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          memories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                kind: {
                  type: "string",
                  enum: ["background", "experience", "preference", "constraint"],
                  description:
                    "`background` for career and company facts, `experience` for past events with tools or vendors, `preference` for how they like to work and buy, `constraint` for budget, compliance or team limits.",
                },
                content: { type: "string" },
              },
              required: ["id", "kind", "content"],
            },
            description: "First-person facts included in the persona's context when it is played.",
          },
        },
        required: [
          "id",
          "name",
          "role",
          "company",
          "summary",
          "searchStyle",
          "profile",
          "conversationPrompts",
          "enabled",
          "archivedAt",
          "createdAt",
          "updatedAt",
          "memories",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["persona", "organization"],
  },
  retryWebhookDelivery: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
  rotateGeoIngestToken: {
    type: "object",
    properties: {
      ingestUrl: { type: "string", description: "Endpoint the tracking snippet posts events to." },
      snippet: { type: "string", description: "Install snippet for the default framework (Next.js)." },
      snippets: {
        type: "object",
        properties: {
          next: { type: "string" },
          nuxt: { type: "string" },
          netlify: { type: "string" },
          tanstack: { type: "string" },
          astro: { type: "string" },
          sveltekit: { type: "string" },
          reactRouter: { type: "string" },
        },
        required: ["next", "nuxt", "netlify", "tanstack", "astro", "sveltekit", "reactRouter"],
      },
      drainUrls: {
        type: "object",
        properties: { vercel: { type: "string" }, cloudflare: { type: "string" } },
        required: ["vercel", "cloudflare"],
        description:
          "Endpoints a Vercel log drain or Cloudflare Logpush job posts request logs to, authenticated with the tracking token.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      token: {
        type: "string",
        description: "Tracking token. Shown once per request; rotating invalidates every previously issued token.",
      },
      webKey: {
        type: "string",
        description:
          "Public key for the notra.js browser script, bound to one project. Safe to put in page HTML; it only records human page views on that project's tracked domains and survives token rotation. Only present when web analytics is enabled for the workspace and it has a project.",
      },
      webSnippet: {
        type: "string",
        description:
          'Script tag that installs notra.js with the public key, pinned to the current build with its Subresource Integrity hash and crossorigin="anonymous". Build an auto-updating tag from webScript.url instead if you want new builds without copying the tag again. Only present when web analytics is enabled for the workspace.',
      },
      webScript: {
        type: "object",
        properties: {
          url: { type: "string", description: "Always serves the latest build." },
          pinnedUrl: { type: "string", description: "Serves exactly this build forever; it never updates." },
          integrity: {
            type: "string",
            description: 'Subresource Integrity value for pinnedUrl (sha384). Use it with crossorigin="anonymous".',
          },
          collectUrl: {
            type: "string",
            description:
              "Where page views go when the script loads from Notra's script host; set it as the tag's data-api.",
          },
        },
        required: ["url", "pinnedUrl", "integrity"],
        description:
          "notra.js: the auto-updating URL and the current build pinned with Subresource Integrity. Only present when web analytics is enabled for the workspace.",
      },
      webPlusScript: {
        type: "object",
        properties: {
          url: { type: "string", description: "Always serves the latest build." },
          pinnedUrl: { type: "string", description: "Serves exactly this build forever; it never updates." },
          integrity: {
            type: "string",
            description: 'Subresource Integrity value for pinnedUrl (sha384). Use it with crossorigin="anonymous".',
          },
          collectUrl: {
            type: "string",
            description:
              "Where page views go when the script loads from Notra's script host; set it as the tag's data-api.",
          },
        },
        required: ["url", "pinnedUrl", "integrity"],
        description:
          "notra.plus.js (notra.js with JavaScript error reporting), auto-updating and pinned. Only present when web analytics is enabled for the workspace.",
      },
    },
    required: ["ingestUrl", "snippet", "snippets", "drainUrls", "organization", "token"],
  },
  runGeoPersona: {
    type: "object",
    properties: {
      checks: {
        type: "integer",
        description: "Answers recorded during this request by the API-based engines that responded.",
      },
      mentions: { type: "integer", description: "How many of those answers mentioned the tracked brand." },
      engines: {
        type: "array",
        items: { type: "string" },
        description:
          "API-based engines the persona was played against during this request. Empty when only consumer apps run or none of the API engines answered.",
      },
      queuedScanId: {
        type: ["string", "null"],
        default: null,
        description:
          "Scan that plays the persona in the tracked consumer apps in the background, or `null`. Poll `GET /v1/projects/{projectId}/geo/scans/{scanId}`.",
      },
      queuedEngines: {
        type: "array",
        items: { type: "string" },
        default: [],
        description: "Consumer-app engines covered by `queuedScanId`. Empty when nothing was queued.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["checks", "mentions", "engines", "organization"],
  },
  runGeoSequence: {
    type: "object",
    properties: {
      checks: {
        type: "integer",
        description:
          "Answers recorded during this request by the API-based engines that responded. Consumer-app answers from the queued scan are not counted.",
      },
      mentions: { type: "integer", description: "How many of those answers mentioned the tracked brand." },
      engines: {
        type: "array",
        items: { type: "string" },
        description:
          "Every API-based engine the conversation was played against during this request, once at least one of them answered, including engines that failed. Empty when only consumer apps run or none of the API engines answered.",
      },
      queuedScanId: {
        type: ["string", "null"],
        default: null,
        description:
          "Scan that plays the conversation in the tracked consumer apps (ChatGPT, Perplexity, Gemini, AI Mode, Copilot) in the background, or `null` when none was queued. Poll `GET /v1/projects/{projectId}/geo/scans/{scanId}` until `status` leaves `running`; its answers then land in the project's GEO checks.",
      },
      queuedEngines: {
        type: "array",
        items: { type: "string" },
        default: [],
        description: "Consumer-app engines covered by `queuedScanId`. Empty when nothing was queued.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["checks", "mentions", "engines", "organization"],
  },
  runSchedule: {
    type: "object",
    properties: {
      runId: { type: "string", description: "ID of the run, as listed by `GET /v1/schedules/{scheduleId}/runs`." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["runId", "organization"],
  },
  schedulePost: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      schedule: {
        anyOf: [
          {
            type: "object",
            properties: {
              postId: { type: "string" },
              scheduledAt: {
                type: "string",
                format: "date-time",
                description: "When the post publishes (ISO 8601, UTC).",
              },
              timeZone: { type: "string", description: "IANA time zone the schedule was picked in, for display only." },
              publications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    destination: {
                      type: "string",
                      enum: ["notra", "github", "social"],
                      description:
                        "notra marks the post as published in Notra; github opens or merges a pull request; social posts to a connected X or LinkedIn account.",
                    },
                    config: {
                      oneOf: [
                        {
                          type: "object",
                          properties: { destination: { type: "string", enum: ["notra"] } },
                          required: ["destination"],
                        },
                        {
                          type: "object",
                          properties: {
                            destination: { type: "string", enum: ["github"] },
                            repositoryId: { type: "string" },
                            merge: { type: "boolean" },
                          },
                          required: ["destination", "repositoryId", "merge"],
                        },
                        {
                          type: "object",
                          properties: {
                            destination: { type: "string", enum: ["social"] },
                            accountId: { type: "string" },
                          },
                          required: ["destination", "accountId"],
                        },
                      ],
                    },
                    status: {
                      type: "string",
                      enum: ["scheduled", "publishing", "published", "failed", "canceled"],
                      description:
                        "scheduled → publishing → published or failed. Failed destinations are retried automatically for transient errors before they end up failed.",
                    },
                    scheduledAt: { type: "string", format: "date-time" },
                    timeZone: { type: "string" },
                    attempts: {
                      type: "integer",
                      description: "Publishing attempts started for this destination, including automatic retries.",
                    },
                    errorCode: {
                      type: ["string", "null"],
                      description:
                        "Machine-readable code of the last failed attempt, such as github_publish_failed or too_many_attempts. Cleared when the destination publishes.",
                    },
                    lastError: {
                      type: ["string", "null"],
                      description: "Message of the last failed attempt. Cleared when the destination publishes.",
                    },
                    resultUrl: {
                      type: ["string", "null"],
                      description: "Pull request or social post URL once published.",
                    },
                    publishedAt: {
                      type: ["string", "null"],
                      format: "date-time",
                      description: "When this destination published. Null until then.",
                    },
                  },
                  required: [
                    "id",
                    "destination",
                    "config",
                    "status",
                    "scheduledAt",
                    "timeZone",
                    "attempts",
                    "errorCode",
                    "lastError",
                    "resultUrl",
                    "publishedAt",
                  ],
                },
                description: "One entry per destination of the schedule.",
              },
            },
            required: ["postId", "scheduledAt", "timeZone", "publications"],
          },
          { type: "null" },
        ],
        description:
          "The post's latest schedule with destinations that were not canceled, listing only those destinations. It stays after they published or failed, and destinations that already published remain after a cancel. Null when the post was never scheduled or all its destinations were canceled.",
      },
    },
    required: ["organization", "schedule"],
  },
  sendAgentSessionMessage: { type: "object" },
  startGeoAgentReadinessScan: {
    type: "object",
    properties: {
      reportId: {
        type: "string",
        description: "Id of the running report. Poll getGeoAgentReadiness until it appears as the completed report.",
      },
      alreadyRunning: {
        type: "boolean",
        description: "True when an in-flight scan for the same URL was reused instead of starting a new one.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["reportId", "alreadyRunning", "organization"],
  },
  startSiteDeployment: {
    type: "object",
    properties: {
      deployment: {
        type: "object",
        properties: {
          id: { type: "string" },
          kind: {
            type: "string",
            enum: ["production", "preview"],
            description:
              "production builds the production branch for visitors; preview builds a branch, pull request or post preview.",
          },
          previewKey: {
            type: ["string", "null"],
            description:
              "Preview the deployment builds, matching previewKey in a Site's previews. Null for production.",
          },
          trigger: {
            type: "string",
            enum: ["push", "pull_request", "manual", "redeploy", "config", "toolchain"],
            description:
              "push and pull_request come from GitHub, manual from a deploy request, redeploy from a rebuild, config from a settings change, and toolchain from Notra rebuilding the live commit after a builder update.",
          },
          status: {
            type: "string",
            enum: [
              "queued",
              "building",
              "uploading",
              "ready",
              "superseded",
              "skipped",
              "failed",
              "canceled",
              "expired",
            ],
            description:
              "queued, building and uploading are in progress; ready, superseded, skipped, failed, canceled and expired are final.",
          },
          live: { type: "boolean", description: "The deployment is serving production or a preview now." },
          liveSince: { type: ["string", "null"], description: "When it started serving. Null when not live." },
          branch: { type: "string" },
          commitSha: { type: "string" },
          commitMessage: { type: ["string", "null"] },
          commitAuthor: { type: ["string", "null"] },
          pullRequestNumber: { type: ["integer", "null"] },
          url: { type: "string", description: "Where the deployment serves its first section." },
          fileCount: {
            type: ["integer", "null"],
            description:
              "Files in the built output. Set when the build becomes ready; null for deployments that never finished a build, such as queued, skipped, failed or canceled ones.",
          },
          totalBytes: {
            type: ["integer", "null"],
            description: "Total size of the built output in bytes. Null under the same conditions as fileCount.",
          },
          buildDurationMs: { type: ["integer", "null"], description: "Build time in milliseconds." },
          errorMessage: {
            type: ["string", "null"],
            description: "Why the build failed, or why it was canceled or superseded before building.",
          },
          skipReason: { type: ["string", "null"], description: "Why smart deployments skipped the build." },
          diagnostics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                severity: { type: "string", enum: ["error", "warning"] },
                file: {
                  type: ["string", "null"],
                  description: "File the diagnostic points at, or null when it has none.",
                },
                line: { type: "integer" },
                column: { type: "integer" },
                code: { type: "string" },
                message: { type: "string" },
              },
              required: ["severity", "file", "code", "message"],
            },
            description: "Compiler errors and warnings with file and line.",
          },
          createdAt: { type: "string" },
          startedAt: { type: ["string", "null"] },
          finishedAt: { type: ["string", "null"] },
        },
        required: [
          "id",
          "kind",
          "previewKey",
          "trigger",
          "status",
          "live",
          "liveSince",
          "branch",
          "commitSha",
          "commitMessage",
          "commitAuthor",
          "pullRequestNumber",
          "url",
          "fileCount",
          "totalBytes",
          "buildDurationMs",
          "errorMessage",
          "skipReason",
          "diagnostics",
          "createdAt",
          "startedAt",
          "finishedAt",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["deployment", "organization"],
  },
  submitFeedback: {
    type: "object",
    properties: {
      feedback: {
        type: "object",
        properties: {
          id: { type: "string" },
          projectId: {
            type: ["string", "null"],
            description: "Project the feedback is filed under, or null for none.",
          },
          source: { type: "string", enum: ["mcp", "api", "sdk"], description: "Channel the feedback arrived through." },
          kind: {
            type: "string",
            enum: ["bug", "feature", "praise", "question", "other"],
            description:
              "What kind of feedback this is, as submitted or classified by Notra. other when classification failed.",
          },
          sentiment: {
            type: ["string", "null"],
            enum: ["negative", "neutral", "positive", null],
            description:
              "Overall sentiment, as submitted or classified by Notra. Null when it could not be classified.",
          },
          status: { type: "string", enum: ["new", "triaged", "resolved", "archived"], description: "Triage status." },
          title: {
            type: ["string", "null"],
            description: "Short summary, as submitted or written by Notra. Null when none could be written.",
          },
          message: { type: "string" },
          agentClient: { type: ["string", "null"] },
          agentModel: { type: ["string", "null"] },
          toolVersion: { type: ["string", "null"] },
          userAgent: { type: ["string", "null"] },
          contextUrl: { type: ["string", "null"] },
          externalId: { type: ["string", "null"] },
          idempotencyKey: { type: ["string", "null"] },
          metadata: {
            type: ["object", "null"],
            additionalProperties: {},
            description: "JSON submitted with the feedback, or null.",
          },
          resolvedAt: {
            type: ["string", "null"],
            description: "When the status was last set to resolved. Cleared when it changes to another status.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "projectId",
          "source",
          "kind",
          "sentiment",
          "status",
          "title",
          "message",
          "agentClient",
          "agentModel",
          "toolVersion",
          "userAgent",
          "contextUrl",
          "externalId",
          "idempotencyKey",
          "metadata",
          "resolvedAt",
          "createdAt",
          "updatedAt",
        ],
      },
      deduplicated: {
        type: "boolean",
        description: "True when an existing feedback with the same idempotencyKey was returned.",
      },
    },
    required: ["feedback", "deduplicated"],
  },
  submitOrganizationFeedback: {
    type: "object",
    properties: {
      feedback: {
        type: "object",
        properties: {
          id: { type: "string" },
          projectId: {
            type: ["string", "null"],
            description: "Project the feedback is filed under, or null for none.",
          },
          source: { type: "string", enum: ["mcp", "api", "sdk"], description: "Channel the feedback arrived through." },
          kind: {
            type: "string",
            enum: ["bug", "feature", "praise", "question", "other"],
            description:
              "What kind of feedback this is, as submitted or classified by Notra. other when classification failed.",
          },
          sentiment: {
            type: ["string", "null"],
            enum: ["negative", "neutral", "positive", null],
            description:
              "Overall sentiment, as submitted or classified by Notra. Null when it could not be classified.",
          },
          status: { type: "string", enum: ["new", "triaged", "resolved", "archived"], description: "Triage status." },
          title: {
            type: ["string", "null"],
            description: "Short summary, as submitted or written by Notra. Null when none could be written.",
          },
          message: { type: "string" },
          agentClient: { type: ["string", "null"] },
          agentModel: { type: ["string", "null"] },
          toolVersion: { type: ["string", "null"] },
          userAgent: { type: ["string", "null"] },
          contextUrl: { type: ["string", "null"] },
          externalId: { type: ["string", "null"] },
          idempotencyKey: { type: ["string", "null"] },
          metadata: {
            type: ["object", "null"],
            additionalProperties: {},
            description: "JSON submitted with the feedback, or null.",
          },
          resolvedAt: {
            type: ["string", "null"],
            description: "When the status was last set to resolved. Cleared when it changes to another status.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "projectId",
          "source",
          "kind",
          "sentiment",
          "status",
          "title",
          "message",
          "agentClient",
          "agentModel",
          "toolVersion",
          "userAgent",
          "contextUrl",
          "externalId",
          "idempotencyKey",
          "metadata",
          "resolvedAt",
          "createdAt",
          "updatedAt",
        ],
      },
      deduplicated: {
        type: "boolean",
        description: "True when an existing feedback with the same idempotencyKey was returned.",
      },
    },
    required: ["feedback", "deduplicated"],
  },
  suggestGeoCompetitors: {
    type: "object",
    properties: {
      domain: { type: "string", description: "Website domain the suggestions are for." },
      field: {
        type: ["string", "null"],
        description: "Market or category the lookup placed the website in, or `null` when it reported none.",
      },
      competitors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            domain: { type: ["string", "null"] },
            description: {
              type: ["string", "null"],
              description: "Short description of the suggested competitor, or `null`.",
            },
            confidence: {
              type: ["string", "null"],
              enum: ["high", "medium", null],
              description: "How sure the lookup is that this is a competitor, or `null` when not reported.",
            },
          },
          required: ["name", "domain", "description", "confidence"],
        },
        description:
          "Suggested competitors, deduplicated by domain or name. Nothing is saved; track one with `PUT /v1/projects/{projectId}/geo/competitors`.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["domain", "field", "competitors", "organization"],
  },
  updateBrandColor: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      color: {
        type: "object",
        properties: {
          id: { type: "string", description: "Pass as colorId to update or delete the color." },
          role: {
            type: "string",
            enum: ["primary", "secondary", "accent", "background", "foreground", "neutral", "custom"],
          },
          name: { type: ["string", "null"] },
          lightValue: { type: "string", description: "Hex color for light mode." },
          darkValue: {
            type: ["string", "null"],
            description: "Hex color for dark mode. Null when the color has no dark variant.",
          },
          usage: { type: ["string", "null"], description: "Free-text note on where the color should be used." },
        },
        required: ["id", "role", "name", "lightValue", "darkValue", "usage"],
      },
    },
    required: ["organization", "color"],
  },
  updateBrandIdentity: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      brandIdentity: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Pass as brandIdentityId to post generation or the brandIdentityId filter of GET /v1/posts.",
          },
          name: { type: "string" },
          isDefault: {
            type: "boolean",
            description: "The organization's default brand identity, used when post generation omits brandIdentityId.",
          },
          websiteUrl: { type: "string", description: "Website the identity was analyzed from." },
          companyName: {
            type: ["string", "null"],
            description: "Filled in by the website analysis. Null until the analysis completes or when not set.",
          },
          companyDescription: {
            type: ["string", "null"],
            description: "Filled in by the website analysis. Null until the analysis completes or when not set.",
          },
          toneProfile: {
            type: ["string", "null"],
            description:
              "Preset tone: Conversational, Professional, Casual or Formal. Ignored while customTone is set.",
          },
          customTone: {
            type: ["string", "null"],
            description: "Free-text voice notes. When set, generation follows them instead of toneProfile.",
          },
          customInstructions: {
            type: ["string", "null"],
            description: "Extra writing instructions applied to generated content.",
          },
          audience: {
            type: ["string", "null"],
            description: "Target audience. Filled in by the website analysis; null until it completes or when not set.",
          },
          language: {
            type: ["string", "null"],
            description: "Language generated content is written in. Null means no language is enforced.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "name",
          "isDefault",
          "websiteUrl",
          "companyName",
          "companyDescription",
          "toneProfile",
          "customTone",
          "customInstructions",
          "audience",
          "language",
          "createdAt",
          "updatedAt",
        ],
      },
    },
    required: ["organization", "brandIdentity"],
  },
  updateEventTrigger: {
    type: "object",
    properties: {
      eventTrigger: {
        type: "object",
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          name: {
            type: "string",
            description:
              'Event triggers cannot be named through the API or the dashboard, so this is the default "Untitled Schedule".',
          },
          sourceType: { type: "string", enum: ["github_webhook"] },
          sourceConfig: {
            type: "object",
            properties: {
              eventTypes: {
                type: "array",
                items: { type: "string", enum: ["release", "push"] },
                minItems: 1,
                description: "GitHub webhook events that start a run: published releases, pushes, or both.",
              },
              includePreReleases: {
                type: "boolean",
                default: true,
                description: "Whether releases marked as pre-releases on GitHub also start a run.",
              },
              ignoreCommitPatterns: {
                type: "array",
                items: { type: "string", minLength: 1, maxLength: 120 },
                maxItems: 10,
                default: [],
                description:
                  "Case-insensitive JavaScript regular expressions tested against each commit message of a push, matching anywhere unless anchored. A push is skipped only when every commit matches at least one pattern. Releases are not filtered.",
              },
            },
            required: ["eventTypes"],
          },
          targets: {
            type: "object",
            properties: {
              repositoryIds: {
                type: "array",
                items: { type: "string", minLength: 1 },
                minItems: 1,
                description:
                  "GitHub integration IDs whose webhook events start the trigger, as returned in the github array of GET /v1/integrations.",
              },
            },
            required: ["repositoryIds"],
          },
          outputType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
          outputConfig: {
            type: ["object", "null"],
            properties: {
              publishDestination: {
                type: "string",
                enum: ["webflow", "framer", "custom"],
                description:
                  "Deprecated and ignored. Auto-published posts are only marked as published in Notra; publish to GitHub or a Notra site from the post instead.",
                deprecated: true,
              },
              brandVoiceId: {
                type: "string",
                minLength: 1,
                description:
                  "Brand identity ID to write in. Falls back to the organization's default brand identity when unset or not found.",
              },
              notify: {
                type: "object",
                properties: { slack: { type: "boolean" }, email: { type: "boolean" } },
                required: ["slack", "email"],
                description:
                  "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
              },
            },
          },
          enabled: {
            type: "boolean",
            description: "Whether matching GitHub events start runs. Disabled triggers are stored but ignored.",
          },
          autoPublish: {
            type: "boolean",
            description:
              "Save generated changelogs and blog posts with status published instead of draft. This only marks them published in Notra; nothing is pushed to GitHub or a Notra site. Other output types always stay drafts.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "organizationId",
          "name",
          "sourceType",
          "sourceConfig",
          "targets",
          "outputType",
          "enabled",
          "autoPublish",
          "createdAt",
          "updatedAt",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["eventTrigger", "organization"],
  },
  updateFeedback: {
    type: "object",
    properties: {
      feedback: {
        type: "object",
        properties: {
          id: { type: "string" },
          projectId: {
            type: ["string", "null"],
            description: "Project the feedback is filed under, or null for none.",
          },
          source: { type: "string", enum: ["mcp", "api", "sdk"], description: "Channel the feedback arrived through." },
          kind: {
            type: "string",
            enum: ["bug", "feature", "praise", "question", "other"],
            description:
              "What kind of feedback this is, as submitted or classified by Notra. other when classification failed.",
          },
          sentiment: {
            type: ["string", "null"],
            enum: ["negative", "neutral", "positive", null],
            description:
              "Overall sentiment, as submitted or classified by Notra. Null when it could not be classified.",
          },
          status: { type: "string", enum: ["new", "triaged", "resolved", "archived"], description: "Triage status." },
          title: {
            type: ["string", "null"],
            description: "Short summary, as submitted or written by Notra. Null when none could be written.",
          },
          message: { type: "string" },
          agentClient: { type: ["string", "null"] },
          agentModel: { type: ["string", "null"] },
          toolVersion: { type: ["string", "null"] },
          userAgent: { type: ["string", "null"] },
          contextUrl: { type: ["string", "null"] },
          externalId: { type: ["string", "null"] },
          idempotencyKey: { type: ["string", "null"] },
          metadata: {
            type: ["object", "null"],
            additionalProperties: {},
            description: "JSON submitted with the feedback, or null.",
          },
          resolvedAt: {
            type: ["string", "null"],
            description: "When the status was last set to resolved. Cleared when it changes to another status.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "projectId",
          "source",
          "kind",
          "sentiment",
          "status",
          "title",
          "message",
          "agentClient",
          "agentModel",
          "toolVersion",
          "userAgent",
          "contextUrl",
          "externalId",
          "idempotencyKey",
          "metadata",
          "resolvedAt",
          "createdAt",
          "updatedAt",
        ],
      },
    },
    required: ["feedback"],
  },
  updateGeoContentBrief: {
    type: "object",
    properties: {
      brief: {
        type: "object",
        properties: {
          id: { type: "string" },
          topic: { type: "string" },
          brief: {
            type: "object",
            properties: {
              targetPrompt: { type: "string", description: "The AI assistant prompt the article is written to win." },
              intent: { type: "string", description: "Search intent behind the target prompt." },
              contentSubtype: {
                type: "string",
                enum: ["guide", "comparison", "listicle", "how-to", "faq", "alternatives"],
                description: "Kind of blog post to write.",
              },
              workingTitle: { type: "string", description: "Planned article title, up to 120 characters." },
              audience: { type: "string", description: "Who the article is for." },
              jobToBeDone: { type: "string", description: "What the reader is trying to get done." },
              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    heading: { type: "string", description: "H2 heading for the section." },
                    goal: { type: "string", description: "One sentence on what the reader should take away." },
                    claims: {
                      type: "array",
                      items: { type: "string" },
                      description: "Up to 5 concrete, checkable claims the section must make.",
                    },
                  },
                  required: ["heading", "goal", "claims"],
                },
                description: "The outline, 3 to 8 sections in order.",
              },
              questionsToAnswer: {
                type: "array",
                items: { type: "string" },
                description: "Up to 8 questions the article's FAQ must answer directly.",
              },
              internalLinks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      description:
                        "Brand page to link. The planner is told to copy it from the project's sitemap; Notra does not check it.",
                    },
                    anchor: { type: "string", description: "Anchor text for the link." },
                    why: { type: "string", description: "Why the page belongs in the article." },
                  },
                  required: ["url", "anchor", "why"],
                },
                description: "Up to 6 links to the brand's own pages, picked from the project's sitemap pages.",
              },
              acceptanceChecklist: {
                type: "array",
                items: { type: "string" },
                description: "Up to 8 checks the finished article must pass, based on Notra's GEO writing rules.",
              },
              recommendedAngle: {
                type: "string",
                description:
                  "Why this article should earn the mention, based on current AI answers. Only filled when the brief was planned from scan evidence.",
              },
              competitorsToCounter: {
                type: "array",
                items: { type: "string" },
                description:
                  "Brands named in current AI answers and the claims that earned them the mention. Only filled when the brief was planned from scan evidence.",
              },
              sourcesToReference: {
                type: "array",
                items: { type: "string" },
                description:
                  "Domains cited in current AI answers. Only filled when the brief was planned from scan evidence.",
              },
              missingCoverage: {
                type: "array",
                items: { type: "string" },
                description:
                  "Facts or topics winning AI answers covered that the brand must now cover. Only filled when the brief was planned from scan evidence.",
              },
              baseline: {
                type: ["object", "null"],
                properties: {
                  sourcePromptId: { type: "string", description: "Prompt id the brief was planned from." },
                  mentionedEngines: { type: "number", description: "Engines whose latest answer mentioned the brand." },
                  totalEngines: { type: "number", description: "Engines with an answer in the last 30 days." },
                  engines: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        engine: { type: "string" },
                        mentioned: { type: "boolean" },
                        position: {
                          type: ["number", "null"],
                          description: "Position of the brand in the answer. Null when the answer gave it none.",
                        },
                      },
                      required: ["engine", "mentioned", "position"],
                    },
                    description: "Latest answer per engine.",
                  },
                  competitorMentions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { name: { type: "string" }, engines: { type: "number" } },
                      required: ["name", "engines"],
                    },
                    description: "Competitors named in the answers, with the number of engines naming each.",
                  },
                  citedDomains: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { domain: { type: "string" }, engines: { type: "number" } },
                      required: ["domain", "engines"],
                    },
                    description: "Domains cited in the answers, with the number of engines citing each.",
                  },
                  capturedAt: { type: ["string", "null"], description: "ISO timestamp of the newest answer used." },
                },
                required: [
                  "sourcePromptId",
                  "mentionedEngines",
                  "totalEngines",
                  "engines",
                  "competitorMentions",
                  "citedDomains",
                  "capturedAt",
                ],
                description:
                  "How AI engines answered the source prompt when the brief was planned, from answers in the last 30 days. Only set for briefs planned from a prompt gap or prompt; null when there were no recent answers.",
              },
            },
            required: [
              "targetPrompt",
              "intent",
              "contentSubtype",
              "workingTitle",
              "audience",
              "jobToBeDone",
              "sections",
              "questionsToAnswer",
              "internalLinks",
              "acceptanceChecklist",
            ],
            description:
              "The article plan. Notra's AI planner writes the text fields; updateGeoContentBrief can change them.",
          },
          status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
          autoApproved: {
            type: "boolean",
            description: "True when writing started automatically at planning time instead of through approval.",
          },
          runId: { type: ["string", "null"], description: "Latest writer run id. Null until the brief is approved." },
          postId: {
            type: ["string", "null"],
            description: "Post the brief writes into. Null when no post is linked, for example after it was deleted.",
          },
          humanized: { type: "boolean", description: "True when the writer's humanizing pass rewrote the draft post." },
          error: { type: ["string", "null"], description: "Why the last writer run failed. Null otherwise." },
          createdAt: { type: "string" },
          updatedAt: {
            type: "string",
            description: "Pass as expectedUpdatedAt to updateGeoContentBrief to avoid overwriting newer changes.",
          },
          completedAt: {
            type: ["string", "null"],
            description:
              "ISO timestamp of when the last writer run finished or failed. Null while writing or before approval.",
          },
        },
        required: [
          "id",
          "topic",
          "brief",
          "status",
          "autoApproved",
          "runId",
          "postId",
          "humanized",
          "error",
          "createdAt",
          "updatedAt",
          "completedAt",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["brief", "organization"],
  },
  updateGeoContentGap: {
    type: "object",
    properties: {
      promptId: { type: "string" },
      ignored: { type: "boolean" },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["promptId", "ignored", "organization"],
  },
  updateGeoPersona: {
    type: "object",
    properties: {
      persona: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string", description: "Buyer archetype label, such as Budgeter." },
          role: { type: "string", description: "Short job title, at most two words." },
          company: { type: "string", description: "Kind of company the persona works at, with size and industry." },
          summary: { type: "string", description: "Buying priorities and situation, one point per line." },
          searchStyle: { type: "string", description: "How the persona writes to AI chats, one point per line." },
          profile: {
            type: "object",
            properties: {
              goals: { type: "array", items: { type: "string" } },
              painPoints: { type: "array", items: { type: "string" } },
              currentStack: { type: "array", items: { type: "string" } },
              buyingTriggers: { type: "array", items: { type: "string" } },
              objections: { type: "array", items: { type: "string" } },
            },
            required: ["goals", "painPoints", "currentStack", "buyingTriggers", "objections"],
          },
          conversationPrompts: {
            type: "array",
            items: { type: "string" },
            description:
              "Opening prompts the persona plays against each engine. Cleared when its details change; regenerate them with `promptsOnly` before the next run.",
          },
          enabled: { type: "boolean", description: "Whether scheduled scans play this persona." },
          archivedAt: {
            type: ["string", "null"],
            description: "When the persona was archived, or `null` when active.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          memories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                kind: {
                  type: "string",
                  enum: ["background", "experience", "preference", "constraint"],
                  description:
                    "`background` for career and company facts, `experience` for past events with tools or vendors, `preference` for how they like to work and buy, `constraint` for budget, compliance or team limits.",
                },
                content: { type: "string" },
              },
              required: ["id", "kind", "content"],
            },
            description: "First-person facts included in the persona's context when it is played.",
          },
        },
        required: [
          "id",
          "name",
          "role",
          "company",
          "summary",
          "searchStyle",
          "profile",
          "conversationPrompts",
          "enabled",
          "archivedAt",
          "createdAt",
          "updatedAt",
          "memories",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["persona", "organization"],
  },
  updateGeoPrompt: {
    type: "object",
    properties: {
      prompt: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description:
              "Use as `promptId` in the prompt endpoints, including `GET /v1/projects/{projectId}/geo/prompts/{promptId}/history`. A UUID for custom prompts, a fixed slug such as `best-tools` for auto prompts.",
          },
          prompt: { type: "string" },
          enabled: { type: "boolean", description: "Whether project scans ask this prompt." },
          source: {
            type: "string",
            enum: ["custom", "auto"],
            description:
              "`custom` for prompts added by the user, `auto` for prompts Notra generates from the brand settings.",
          },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Labels on custom prompts. Always empty for auto prompts.",
          },
          createdAt: {
            type: ["string", "null"],
            description: "When the custom prompt was added. `null` for auto prompts.",
          },
        },
        required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["prompt", "organization"],
  },
  updateGeoSequence: {
    type: "object",
    properties: {
      sequence: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          steps: {
            type: "array",
            items: { type: "string" },
            description: "Messages sent in order as one conversation with each engine.",
          },
          enabled: { type: "boolean", description: "Whether project scans play this conversation." },
          createdAt: { type: "string" },
        },
        required: ["id", "name", "steps", "enabled", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["sequence", "organization"],
  },
  updateGeoSettings: {
    type: "object",
    properties: {
      configured: {
        type: "boolean",
        description:
          "Whether the analytics store behind AI traffic and web analytics is set up on this Notra deployment. It does not depend on the project or its settings.",
      },
      settings: {
        anyOf: [
          {
            type: "object",
            properties: {
              id: { type: "string" },
              organizationId: { type: "string" },
              projectId: { type: "string" },
              companyName: { type: "string", description: "Brand name that scans look for in AI answers." },
              aliases: {
                type: "array",
                items: { type: "string" },
                description: "Other names that also count as a brand mention.",
              },
              conversionPaths: {
                type: "array",
                items: { type: "string" },
                description: "Paths that count as a conversion when an AI referral reaches them. Prefix match.",
              },
              domains: {
                type: "array",
                items: { type: "string" },
                description:
                  "Additional hostnames that send AI traffic to this project, besides the brand website. Subdomains are included.",
              },
              competitors: {
                type: "array",
                items: { type: "string" },
                description: "Names of the project's competitors, kept in sync with the competitors endpoints.",
              },
              languages: {
                type: "array",
                items: { type: "string" },
                description: "Supported languages scans run in. Unsupported or duplicate stored values are left out.",
              },
              engines: {
                type: "array",
                items: { type: "string" },
                description:
                  "Engine ids scans run on, from GET /v1/projects/{projectId}/geo/engines. Unknown ids are dropped and the default set is used when none remain. With enforceZdr on, engines that can't run under zero data retention are left out.",
              },
              enforceZdr: {
                type: "boolean",
                description: "Only run engines with zero data retention, plus those listed in nonZdrApprovedEngines.",
              },
              nonZdrApprovedEngines: {
                type: "array",
                items: { type: "string" },
                description: "Engines without zero data retention that may still run while enforceZdr is on.",
              },
              trackWithoutSearch: {
                type: "boolean",
                description: "Also scan search-capable models without web search.",
              },
              pausedAutoPromptIds: {
                type: "array",
                items: { type: "string" },
                description: "Ids of auto-generated prompts skipped in scans.",
              },
              removedAutoPromptIds: {
                type: "array",
                items: { type: "string" },
                description: "Ids of auto-generated prompts removed from tracking.",
              },
              enabled: { type: "boolean", description: "Whether recurring scans run." },
              scanIntervalHours: { type: "integer", description: "Hours between automatic scans, in whole days." },
              scanStartedAt: {
                type: ["string", "null"],
                description: "When the scan in progress started. Usually cleared when it finishes.",
              },
              lastScanAt: {
                type: ["string", "null"],
                description:
                  "When the latest scan finished, whether it succeeded or failed. Null before the first scan.",
              },
              isScanning: {
                type: "boolean",
                description: "A scan started after the latest finished one and less than two hours ago.",
              },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
            required: [
              "id",
              "organizationId",
              "projectId",
              "companyName",
              "aliases",
              "conversionPaths",
              "domains",
              "competitors",
              "languages",
              "engines",
              "enforceZdr",
              "nonZdrApprovedEngines",
              "trackWithoutSearch",
              "pausedAutoPromptIds",
              "removedAutoPromptIds",
              "enabled",
              "scanIntervalHours",
              "scanStartedAt",
              "lastScanAt",
              "isScanning",
              "createdAt",
              "updatedAt",
            ],
          },
          { type: "null" },
        ],
        description:
          "Null when the project has no saved GEO settings yet. Save them with PATCH /v1/projects/{projectId}/geo/settings.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "settings", "organization"],
  },
  updatePost: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
      post: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: {
            type: ["string", "null"],
            description: "URL slug. Only blog posts and changelogs have one; null when none is set.",
          },
          content: {
            type: "string",
            description:
              "Rendered HTML for text posts. For image posts, this is the public CDN URL of the rendered image.",
          },
          htmlUrl: {
            type: ["string", "null"],
            description: "Public CDN URL of the generated HTML artifact for image posts. Null for non-image posts.",
          },
          markdown: { type: ["string", "null"], description: "Markdown source for text posts. Null for image posts." },
          rawHtml: {
            type: ["string", "null"],
            description:
              "Legacy inline generated HTML for image posts. New generated image HTML is stored as htmlUrl. Null for non-image posts.",
          },
          recommendations: {
            type: ["string", "null"],
            description:
              "Publishing suggestions written by the generator as Markdown, such as when and where to share the post. Null when there are none.",
          },
          contentType: {
            type: "string",
            enum: ["changelog", "linkedin_post", "twitter_post", "blog_post", "investor_update", "image"],
          },
          sourceMetadata: {
            description:
              "Free-form JSON recorded by whatever produced the post, such as a generation run or chat. Null for posts created with POST /v1/posts. Posts from generation runs (POST /v1/posts/generate, schedules, event triggers and GEO content briefs) include brandVoiceId, the brand identity the run wrote in (absent when the workspace had none), which the brandIdentityId filter of GET /v1/posts reads.",
          },
          metadata: {
            type: ["object", "null"],
            properties: {
              coverImage: {
                type: ["object", "null"],
                properties: {
                  url: {
                    type: "string",
                    description:
                      "Absolute https URL, or a path to an image uploaded in Notra (starting with /api/uploads/).",
                  },
                  alt: { type: "string", description: "Alt text. Empty string when none is set." },
                },
                required: ["url", "alt"],
                description: "Cover image shown on post cards and social previews.",
              },
              tags: { type: "array", items: { type: "string" } },
              excerpt: {
                type: ["string", "null"],
                description:
                  "Summary shown on post cards and in meta descriptions. Null means it is derived from the first paragraph.",
              },
              authors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    slug: {
                      type: "string",
                      description: "Stable author handle; hosted sites list the author's posts at /author/{slug}.",
                    },
                    name: { type: "string" },
                    title: { type: ["string", "null"] },
                    avatarUrl: { type: ["string", "null"] },
                    url: { type: ["string", "null"], description: "Author's website." },
                    x: { type: ["string", "null"] },
                    linkedin: { type: ["string", "null"] },
                    github: { type: ["string", "null"] },
                    youtube: { type: ["string", "null"] },
                    bluesky: { type: ["string", "null"] },
                    mastodon: { type: ["string", "null"] },
                    threads: { type: ["string", "null"] },
                    instagram: { type: ["string", "null"] },
                  },
                  required: [
                    "id",
                    "slug",
                    "name",
                    "title",
                    "avatarUrl",
                    "url",
                    "x",
                    "linkedin",
                    "github",
                    "youtube",
                    "bluesky",
                    "mastodon",
                    "threads",
                    "instagram",
                  ],
                },
                description:
                  "Credited authors in display order. Authors deleted since they were assigned are omitted. On blog posts that publish to a Notra Sites site, authors whose id starts with site: come from the site's blog.json, unpublished Design changes included.",
              },
              featured: { type: "boolean", description: "Pinned to the top of the blog index on hosted sites." },
              noindex: {
                type: "boolean",
                description: "Asks search engines not to index the post and leaves it out of the sitemap.",
              },
              hidden: {
                type: "boolean",
                description:
                  "Reachable by direct link, but excluded from hosted site listings, feeds, search engine indexing, sitemaps and generated AI indexes. Not private.",
              },
              displayDate: {
                type: ["string", "null"],
                description: "Date shown on the post as YYYY-MM-DD. Null means the publish date is used.",
              },
            },
            required: ["coverImage", "tags", "excerpt", "authors", "featured", "noindex", "hidden", "displayDate"],
            description:
              "Cover image, tags, excerpt, authors and other site metadata. Set for blog posts and changelogs, null for every other content type.",
          },
          status: { type: "string", enum: ["draft", "published"] },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
        required: [
          "id",
          "title",
          "slug",
          "content",
          "htmlUrl",
          "markdown",
          "rawHtml",
          "recommendations",
          "contentType",
          "metadata",
          "status",
          "createdAt",
          "updatedAt",
        ],
      },
    },
    required: ["organization", "post"],
  },
  updateProject: {
    type: "object",
    properties: {
      project: {
        type: "object",
        properties: {
          id: { type: "string", description: "Use as projectId in the endpoints under /v1/projects/{projectId}." },
          name: { type: "string" },
          brandSettingsId: {
            type: "string",
            description: "ID of the brand identity linked to the project, as listed by GET /v1/brand-identities.",
          },
          createdAt: { type: "string" },
        },
        required: ["id", "name", "brandSettingsId", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["project", "organization"],
  },
  updateSchedule: {
    type: "object",
    properties: {
      schedule: {
        type: "object",
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          name: { type: "string" },
          sourceType: { type: "string", enum: ["cron"] },
          sourceConfig: {
            type: "object",
            properties: {
              cron: {
                type: "object",
                properties: {
                  frequency: {
                    type: "string",
                    enum: ["daily", "weekly", "monthly", "custom"],
                    description: "How often the schedule runs.",
                  },
                  hour: {
                    type: "integer",
                    minimum: 0,
                    maximum: 23,
                    description: "Hour of the day to run, in UTC (0-23).",
                  },
                  minute: {
                    type: "integer",
                    minimum: 0,
                    maximum: 59,
                    description: "Minute of the hour to run (0-59).",
                  },
                  dayOfWeek: {
                    type: "integer",
                    minimum: 0,
                    maximum: 6,
                    description:
                      "Day of the week for weekly schedules, 0 (Sunday) to 6 (Saturday). Required when frequency is weekly.",
                  },
                  dayOfMonth: {
                    type: "integer",
                    minimum: 1,
                    maximum: 31,
                    description:
                      "Day of the month for monthly schedules (1-31). Required when frequency is monthly. Months without that day are skipped, so 31 runs only in 31-day months.",
                  },
                  intervalDays: {
                    type: "integer",
                    minimum: 2,
                    maximum: 90,
                    description: "Run every N days (2-90). Required when frequency is custom.",
                  },
                  anchorDate: {
                    type: "string",
                    pattern: "^\\d{4}-\\d{2}-\\d{2}$",
                    description: "UTC calendar date (YYYY-MM-DD) a custom interval counts from. Defaults to today.",
                  },
                },
                required: ["frequency", "hour", "minute"],
              },
            },
            required: ["cron"],
          },
          targets: {
            type: "object",
            properties: {
              repositoryIds: {
                type: "array",
                items: { type: "string" },
                description:
                  "GitHub integration IDs to generate from, as returned in the github array of GET /v1/integrations.",
              },
              linearIntegrationIds: {
                type: "array",
                items: { type: "string" },
                description:
                  "Linear integration IDs to generate from, as returned in the linear array of GET /v1/integrations. When omitted, runs read every enabled Linear integration; send [] to read none.",
              },
            },
            required: ["repositoryIds"],
          },
          outputType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
          outputConfig: {
            type: ["object", "null"],
            properties: {
              publishDestination: {
                type: "string",
                enum: ["webflow", "framer", "custom"],
                description:
                  "Deprecated and ignored. Auto-published posts are only marked as published in Notra; publish to GitHub or a Notra site from the post instead.",
                deprecated: true,
              },
              brandVoiceId: {
                type: "string",
                minLength: 1,
                description: "Brand identity ID to write in. Defaults to the organization's default brand identity.",
              },
              instructions: {
                type: "string",
                minLength: 1,
                maxLength: 2000,
                description:
                  "Free-text brief for this schedule, passed to the writer on every run on top of the brand's custom instructions. Use it to steer the angle of the content, for example tutorial-style blog posts.",
              },
              notify: {
                type: "object",
                properties: { slack: { type: "boolean" }, email: { type: "boolean" } },
                required: ["slack", "email"],
                description:
                  "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
              },
            },
          },
          enabled: {
            type: "boolean",
            description: "Whether the schedule runs. Disabled schedules are stored but never fire.",
          },
          autoPublish: {
            type: "boolean",
            description:
              "Save generated changelogs and blog posts with status published instead of draft. This only marks them published in Notra; nothing is pushed to GitHub or a Notra site. Other output types always stay drafts.",
          },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          lookbackWindow: {
            type: "string",
            enum: ["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"],
            description: "How far back each run collects source activity.",
          },
        },
        required: [
          "id",
          "organizationId",
          "name",
          "sourceType",
          "sourceConfig",
          "targets",
          "outputType",
          "enabled",
          "autoPublish",
          "createdAt",
          "updatedAt",
          "lookbackWindow",
        ],
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["schedule", "organization"],
  },
  updateSiteAuthorPage: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: { id: { type: "string" }, name: { type: "string" } },
        required: ["id", "name"],
      },
      authors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            ref: {
              type: "string",
              description:
                "Pass this in metadata.authorIds of PATCH /v1/posts/{postId} to credit the author on a blog post that publishes to this site.",
            },
            name: { type: "string" },
            title: { type: ["string", "null"] },
            bio: { type: ["string", "null"] },
            avatar: {
              type: ["string", "null"],
              description: "As written in blog.json: a site path such as /images/jane.png or an https URL.",
            },
            avatarUrl: { type: ["string", "null"], description: "The avatar as a full URL on the live site." },
            url: { type: ["string", "null"] },
            x: { type: ["string", "null"] },
            linkedin: { type: ["string", "null"] },
            github: { type: ["string", "null"] },
            youtube: { type: ["string", "null"] },
            bluesky: { type: ["string", "null"] },
            mastodon: { type: ["string", "null"] },
            threads: { type: ["string", "null"] },
            instagram: { type: ["string", "null"] },
            live: {
              type: "boolean",
              description:
                "The author is in the published blog.json. False while it only exists in unpublished changes.",
            },
            posts: { type: "integer", description: "Notra blog posts on this site that credit the author." },
          },
          required: [
            "id",
            "ref",
            "name",
            "title",
            "bio",
            "avatar",
            "avatarUrl",
            "url",
            "x",
            "linkedin",
            "github",
            "youtube",
            "bluesky",
            "mastodon",
            "threads",
            "instagram",
            "live",
            "posts",
          ],
        },
        description: "Authors in blog.json order, including unpublished changes.",
      },
      authorPage: {
        type: "string",
        enum: ["inline", "stacked"],
        description: "Layout of every author page: inline puts the avatar beside the name, stacked puts it above.",
      },
      hasUnpublishedChanges: {
        type: "boolean",
        description:
          "blog.json has staged Design changes that are not live yet. Publish them with POST /v1/sites/{siteId}/publish or from the dashboard.",
      },
    },
    required: ["site", "authors", "authorPage", "hasUnpublishedChanges"],
  },
  updateSiteSections: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: { id: { type: "string" }, name: { type: "string" } },
        required: ["id", "name"],
      },
      sections: {
        type: "object",
        properties: { blog: { type: "string" }, changelog: { type: "string" } },
        description:
          "The sections blog.json sets with unpublished changes applied. They take over from the dashboard setting once a production build of them goes live.",
      },
      liveSections: {
        type: "object",
        properties: { blog: { type: "string" }, changelog: { type: "string" } },
        description: "The paths the live site serves now.",
      },
      hasUnpublishedChanges: { type: "boolean" },
    },
    required: ["site", "sections", "liveSections", "hasUnpublishedChanges"],
  },
  upsertGeoCompetitor: {
    type: "object",
    properties: {
      competitors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "Competitor id. Competitors carried over from older settings use `legacy:` plus the lowercased name. Endpoints address competitors by `name`, not id.",
            },
            name: { type: "string", description: "Competitor name. Unique per project, compared case-insensitively." },
            domain: {
              type: ["string", "null"],
              description: "Competitor website domain, used to recognize citations of its site. `null` when unknown.",
            },
            synonyms: {
              type: "array",
              items: { type: "string" },
              description: "Alternate names counted as this competitor in answers.",
            },
            kind: {
              type: "string",
              enum: ["direct", "indirect"],
              description:
                "Your own label for the competitor: direct or indirect. Only shown as a label; mentions, share of voice and gaps count both kinds the same way.",
            },
            color: {
              type: ["string", "null"],
              description: "Custom chart color, or `null` to use the default palette.",
            },
          },
          required: ["id", "name", "domain", "synonyms", "kind", "color"],
        },
        description: "Tracked competitors, oldest first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["competitors", "organization"],
  },
  upsertSiteAuthor: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: { id: { type: "string" }, name: { type: "string" } },
        required: ["id", "name"],
      },
      authors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            ref: {
              type: "string",
              description:
                "Pass this in metadata.authorIds of PATCH /v1/posts/{postId} to credit the author on a blog post that publishes to this site.",
            },
            name: { type: "string" },
            title: { type: ["string", "null"] },
            bio: { type: ["string", "null"] },
            avatar: {
              type: ["string", "null"],
              description: "As written in blog.json: a site path such as /images/jane.png or an https URL.",
            },
            avatarUrl: { type: ["string", "null"], description: "The avatar as a full URL on the live site." },
            url: { type: ["string", "null"] },
            x: { type: ["string", "null"] },
            linkedin: { type: ["string", "null"] },
            github: { type: ["string", "null"] },
            youtube: { type: ["string", "null"] },
            bluesky: { type: ["string", "null"] },
            mastodon: { type: ["string", "null"] },
            threads: { type: ["string", "null"] },
            instagram: { type: ["string", "null"] },
            live: {
              type: "boolean",
              description:
                "The author is in the published blog.json. False while it only exists in unpublished changes.",
            },
            posts: { type: "integer", description: "Notra blog posts on this site that credit the author." },
          },
          required: [
            "id",
            "ref",
            "name",
            "title",
            "bio",
            "avatar",
            "avatarUrl",
            "url",
            "x",
            "linkedin",
            "github",
            "youtube",
            "bluesky",
            "mastodon",
            "threads",
            "instagram",
            "live",
            "posts",
          ],
        },
        description: "Authors in blog.json order, including unpublished changes.",
      },
      authorPage: {
        type: "string",
        enum: ["inline", "stacked"],
        description: "Layout of every author page: inline puts the avatar beside the name, stacked puts it above.",
      },
      hasUnpublishedChanges: {
        type: "boolean",
        description:
          "blog.json has staged Design changes that are not live yet. Publish them with POST /v1/sites/{siteId}/publish or from the dashboard.",
      },
    },
    required: ["site", "authors", "authorPage", "hasUnpublishedChanges"],
  },
};
