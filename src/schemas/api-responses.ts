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
          id: { type: "string" },
          prompt: { type: "string" },
          enabled: { type: "boolean" },
          source: { type: "string", enum: ["custom", "auto"] },
          tags: { type: "array", items: { type: "string" } },
          createdAt: { type: ["string", "null"] },
        },
        required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["prompt", "organization"],
  },
  approveGeoContentBrief: {
    type: "object",
    properties: {
      runId: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["runId", "organization"],
  },
  archiveGeoPersona: {
    type: "object",
    properties: {
      id: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      color: {
        type: "object",
        properties: {
          id: { type: "string" },
          role: {
            type: "string",
            enum: ["primary", "secondary", "accent", "background", "foreground", "neutral", "custom"],
          },
          name: { type: ["string", "null"] },
          lightValue: { type: "string" },
          darkValue: { type: ["string", "null"] },
          usage: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          currentStep: { type: "integer", minimum: 0 },
          totalSteps: { type: "integer", minimum: 1 },
          workflowRunId: { type: ["string", "null"] },
          error: { type: ["string", "null"] },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          completedAt: { type: ["string", "null"] },
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
          name: { type: "string" },
          sourceType: { type: "string", enum: ["github_webhook"] },
          sourceConfig: {
            type: "object",
            properties: {
              eventTypes: { type: "array", items: { type: "string", enum: ["release", "push"] }, minItems: 1 },
              includePreReleases: { type: "boolean", default: true },
              ignoreCommitPatterns: {
                type: "array",
                items: { type: "string", minLength: 1, maxLength: 120 },
                maxItems: 10,
                default: [],
              },
            },
            required: ["eventTypes"],
          },
          targets: {
            type: "object",
            properties: { repositoryIds: { type: "array", items: { type: "string", minLength: 1 }, minItems: 1 } },
            required: ["repositoryIds"],
          },
          outputType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
          outputConfig: {
            type: ["object", "null"],
            properties: {
              publishDestination: { type: "string", enum: ["webflow", "framer", "custom"] },
              brandVoiceId: { type: "string", minLength: 1 },
              notify: {
                type: "object",
                properties: { slack: { type: "boolean" }, email: { type: "boolean" } },
                required: ["slack", "email"],
              },
            },
          },
          enabled: { type: "boolean" },
          autoPublish: { type: "boolean" },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          prompt: { type: "string" },
          enabled: { type: "boolean" },
          source: { type: "string", enum: ["custom", "auto"] },
          tags: { type: "array", items: { type: "string" } },
          createdAt: { type: ["string", "null"] },
        },
        required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["prompt", "organization"],
  },
  createGeoPromptScan: {
    type: "object",
    properties: {
      scanId: { type: "string" },
      statusUrl: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["scanId", "statusUrl", "organization"],
  },
  createGeoScan: {
    type: "object",
    properties: {
      scanId: { type: "string" },
      statusUrl: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          steps: { type: "array", items: { type: "string" } },
          enabled: { type: "boolean" },
          createdAt: { type: "string" },
        },
        required: ["id", "name", "steps", "enabled", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          displayName: { type: "string" },
          owner: { type: ["string", "null"] },
          repo: { type: ["string", "null"] },
          defaultBranch: { type: ["string", "null"] },
        },
        required: ["id", "displayName", "owner", "repo", "defaultBranch"],
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      post: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: ["string", "null"] },
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
          recommendations: { type: ["string", "null"] },
          contentType: {
            type: "string",
            enum: ["changelog", "linkedin_post", "twitter_post", "blog_post", "investor_update", "image"],
          },
          sourceMetadata: {},
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          repositoryIds: { type: "array", items: { type: "string" } },
          brandVoiceId: { type: ["string", "null"] },
          workflowRunId: { type: ["string", "null"] },
          postId: {
            type: ["string", "null"],
            description: "ID of the generated post. Set once the job reaches completed.",
          },
          error: { type: ["string", "null"], description: "Failure reason when status is failed." },
          errorCode: {
            type: ["string", "null"],
            description:
              "Stable machine-readable failure code when status is failed, such as NO_ACTIVITY_TYPES_SELECTED or NO_AVAILABLE_SOURCES. Absent or null for other failures and for older jobs.",
          },
          source: { type: "string", enum: ["api", "dashboard"] },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          completedAt: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      pullRequest: {
        type: "object",
        properties: {
          number: { type: "integer", exclusiveMinimum: 0 },
          url: { type: "string", format: "uri" },
          branchName: { type: "string" },
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
          id: { type: "string" },
          name: { type: "string" },
          brandSettingsId: { type: "string" },
          createdAt: { type: "string" },
        },
        required: ["id", "name", "brandSettingsId", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
                    description: "Day of the month for monthly schedules (1-31). Required when frequency is monthly.",
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
                description: "Where auto-published posts are sent.",
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
          enabled: { type: "boolean" },
          autoPublish: { type: "boolean" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          lookbackWindow: {
            type: "string",
            enum: ["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"],
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
              live: { type: "boolean" },
              deleting: { type: "boolean" },
              errorMessage: { type: ["string", "null"] },
              expiresAt: { type: "string" },
              hasPassword: { type: "boolean" },
              url: { type: "string" },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
              name: { type: "string" },
              description: { type: "string" },
              isSystem: {
                type: "boolean",
                description: "True for built-in skills provided by Notra. System skills cannot be renamed or deleted.",
              },
              updatedAt: { type: "string" },
            },
            required: ["id", "name", "description", "isSystem", "updatedAt"],
          },
          {
            type: "object",
            properties: { content: { type: "string" }, createdAt: { type: "string" } },
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
          url: { type: "string" },
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
          },
          enabled: { type: "boolean" },
          createdAt: { type: "string" },
        },
        required: ["id", "organizationId", "url", "events", "enabled", "createdAt"],
      },
      secret: { type: "string" },
    },
    required: ["endpoint", "secret"],
  },
  deleteBrandColor: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      disabledSchedules: {
        type: "array",
        items: {
          type: "object",
          properties: { id: { type: "string" }, name: { type: "string" } },
          required: ["id", "name"],
        },
      },
      disabledEvents: {
        type: "array",
        items: {
          type: "object",
          properties: { id: { type: "string" }, name: { type: "string" } },
          required: ["id", "name"],
        },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            id: { type: "string" },
            name: { type: "string" },
            domain: { type: ["string", "null"] },
            synonyms: { type: "array", items: { type: "string" } },
            kind: { type: "string", enum: ["direct", "indirect"] },
            color: { type: ["string", "null"] },
          },
          required: ["id", "name", "domain", "synonyms", "kind", "color"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["competitors", "organization"],
  },
  deleteGeoPrompt: {
    type: "object",
    properties: {
      id: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["id", "organization"],
  },
  deleteGeoSequence: {
    type: "object",
    properties: {
      id: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      disabledSchedules: {
        type: "array",
        items: {
          type: "object",
          properties: { id: { type: "string" }, name: { type: "string" } },
          required: ["id", "name"],
        },
      },
      disabledEvents: {
        type: "array",
        items: {
          type: "object",
          properties: { id: { type: "string" }, name: { type: "string" } },
          required: ["id", "name"],
        },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
      dismissed: { type: "boolean" },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          personaId: { type: ["string", "null"] },
          startedAt: { type: "string" },
          error: { type: ["string", "null"] },
        },
        required: ["id", "status", "personaId", "startedAt", "error"],
        description: "The project's latest generation job, or `null` when none ran recently.",
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          name: { type: "string" },
          isDefault: { type: "boolean" },
          websiteUrl: { type: "string" },
          companyName: { type: ["string", "null"] },
          companyDescription: { type: ["string", "null"] },
          toneProfile: { type: ["string", "null"] },
          customTone: { type: ["string", "null"] },
          customInstructions: { type: ["string", "null"] },
          audience: { type: ["string", "null"] },
          language: { type: ["string", "null"] },
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
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          currentStep: { type: "integer", minimum: 0 },
          totalSteps: { type: "integer", minimum: 1 },
          workflowRunId: { type: ["string", "null"] },
          error: { type: ["string", "null"] },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          completedAt: { type: ["string", "null"] },
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
          name: { type: "string" },
          sourceType: { type: "string", enum: ["github_webhook"] },
          sourceConfig: {
            type: "object",
            properties: {
              eventTypes: { type: "array", items: { type: "string", enum: ["release", "push"] }, minItems: 1 },
              includePreReleases: { type: "boolean", default: true },
              ignoreCommitPatterns: {
                type: "array",
                items: { type: "string", minLength: 1, maxLength: 120 },
                maxItems: 10,
                default: [],
              },
            },
            required: ["eventTypes"],
          },
          targets: {
            type: "object",
            properties: { repositoryIds: { type: "array", items: { type: "string", minLength: 1 }, minItems: 1 } },
            required: ["repositoryIds"],
          },
          outputType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
          outputConfig: {
            type: ["object", "null"],
            properties: {
              publishDestination: { type: "string", enum: ["webflow", "framer", "custom"] },
              brandVoiceId: { type: "string", minLength: 1 },
              notify: {
                type: "object",
                properties: { slack: { type: "boolean" }, email: { type: "boolean" } },
                required: ["slack", "email"],
              },
            },
          },
          enabled: { type: "boolean" },
          autoPublish: { type: "boolean" },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          projectId: { type: ["string", "null"] },
          source: { type: "string", enum: ["mcp", "api", "sdk"], description: "Channel the feedback arrived through." },
          kind: {
            type: "string",
            enum: ["bug", "feature", "praise", "question", "other"],
            description: "What kind of feedback this is.",
          },
          sentiment: {
            type: ["string", "null"],
            enum: ["negative", "neutral", "positive", null],
            description: "Overall sentiment of the feedback.",
          },
          status: { type: "string", enum: ["new", "triaged", "resolved", "archived"], description: "Triage status." },
          title: { type: ["string", "null"] },
          message: { type: "string" },
          agentClient: { type: ["string", "null"] },
          agentModel: { type: ["string", "null"] },
          toolVersion: { type: ["string", "null"] },
          userAgent: { type: ["string", "null"] },
          contextUrl: { type: ["string", "null"] },
          externalId: { type: ["string", "null"] },
          idempotencyKey: { type: ["string", "null"] },
          metadata: { type: ["object", "null"], additionalProperties: {} },
          resolvedAt: { type: ["string", "null"] },
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
      targetUrl: { type: "string" },
      report: {
        type: ["object", "null"],
        properties: {
          id: { type: "string" },
          status: { type: "string", enum: ["running", "completed", "failed"] },
          targetUrl: { type: "string" },
          score: { type: ["number", "null"] },
          scoreLabel: { type: ["string", "null"] },
          scoreBreakdown: {
            type: ["object", "null"],
            properties: {
              essential: {
                type: "object",
                properties: {
                  earned: { type: "number" },
                  available: { type: "number" },
                  passing: { type: "number" },
                  total: { type: "number" },
                },
                required: ["earned", "available", "passing", "total"],
              },
              recommended: {
                type: "object",
                properties: {
                  earned: { type: "number" },
                  available: { type: "number" },
                  passing: { type: "number" },
                  total: { type: "number" },
                },
                required: ["earned", "available", "passing", "total"],
              },
              bonus: {
                type: "object",
                properties: { points: { type: "number" }, positiveSignals: { type: "number" } },
                required: ["points", "positiveSignals"],
              },
            },
            required: ["essential", "recommended", "bonus"],
          },
          issues: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                tier: { type: "string", enum: ["essential", "recommended", "bonus"] },
                result: { type: "string", enum: ["failed", "partial"] },
                details: { type: ["string", "null"] },
                recommendation: { type: ["string", "null"] },
              },
              required: ["id", "name", "tier", "result", "details", "recommendation"],
            },
          },
          eligibleChecks: { type: ["integer", "null"] },
          errorMessage: { type: ["string", "null"] },
          scannedAt: { type: ["string", "null"] },
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
              targetUrl: { type: "string" },
              score: { type: ["number", "null"] },
              scoreLabel: { type: ["string", "null"] },
              scoreBreakdown: {
                type: ["object", "null"],
                properties: {
                  essential: {
                    type: "object",
                    properties: {
                      earned: { type: "number" },
                      available: { type: "number" },
                      passing: { type: "number" },
                      total: { type: "number" },
                    },
                    required: ["earned", "available", "passing", "total"],
                  },
                  recommended: {
                    type: "object",
                    properties: {
                      earned: { type: "number" },
                      available: { type: "number" },
                      passing: { type: "number" },
                      total: { type: "number" },
                    },
                    required: ["earned", "available", "passing", "total"],
                  },
                  bonus: {
                    type: "object",
                    properties: { points: { type: "number" }, positiveSignals: { type: "number" } },
                    required: ["points", "positiveSignals"],
                  },
                },
                required: ["essential", "recommended", "bonus"],
              },
              issues: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    tier: { type: "string", enum: ["essential", "recommended", "bonus"] },
                    result: { type: "string", enum: ["failed", "partial"] },
                    details: { type: ["string", "null"] },
                    recommendation: { type: ["string", "null"] },
                  },
                  required: ["id", "name", "tier", "result", "details", "recommendation"],
                },
              },
              eligibleChecks: { type: ["integer", "null"] },
              errorMessage: { type: ["string", "null"] },
              scannedAt: { type: ["string", "null"] },
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
            score: { type: ["number", "null"] },
            failedCount: { type: "integer" },
            partialCount: { type: "integer" },
            scannedAt: { type: "string" },
          },
          required: ["id", "score", "failedCount", "partialCount", "scannedAt"],
        },
        description: "Completed scans, oldest first.",
      },
      comparison: {
        type: ["object", "null"],
        properties: {
          previousScore: { type: ["number", "null"] },
          previousScannedAt: { type: "string" },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
              targetPrompt: { type: "string" },
              intent: { type: "string" },
              contentSubtype: {
                type: "string",
                enum: ["guide", "comparison", "listicle", "how-to", "faq", "alternatives"],
              },
              workingTitle: { type: "string" },
              audience: { type: "string" },
              jobToBeDone: { type: "string" },
              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    heading: { type: "string" },
                    goal: { type: "string" },
                    claims: { type: "array", items: { type: "string" } },
                  },
                  required: ["heading", "goal", "claims"],
                },
              },
              questionsToAnswer: { type: "array", items: { type: "string" } },
              internalLinks: {
                type: "array",
                items: {
                  type: "object",
                  properties: { url: { type: "string" }, anchor: { type: "string" }, why: { type: "string" } },
                  required: ["url", "anchor", "why"],
                },
              },
              acceptanceChecklist: { type: "array", items: { type: "string" } },
              recommendedAngle: { type: "string" },
              competitorsToCounter: { type: "array", items: { type: "string" } },
              sourcesToReference: { type: "array", items: { type: "string" } },
              missingCoverage: { type: "array", items: { type: "string" } },
              baseline: {
                type: ["object", "null"],
                properties: {
                  sourcePromptId: { type: "string" },
                  mentionedEngines: { type: "number" },
                  totalEngines: { type: "number" },
                  engines: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        engine: { type: "string" },
                        mentioned: { type: "boolean" },
                        position: { type: ["number", "null"] },
                      },
                      required: ["engine", "mentioned", "position"],
                    },
                  },
                  competitorMentions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { name: { type: "string" }, engines: { type: "number" } },
                      required: ["name", "engines"],
                    },
                  },
                  citedDomains: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { domain: { type: "string" }, engines: { type: "number" } },
                      required: ["domain", "engines"],
                    },
                  },
                  capturedAt: { type: ["string", "null"] },
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
          },
          status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
          autoApproved: { type: "boolean" },
          runId: { type: ["string", "null"] },
          postId: { type: ["string", "null"] },
          humanized: { type: "boolean" },
          error: { type: ["string", "null"] },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          completedAt: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          "Script tag that installs notra.js with the public key. Only present when web analytics is enabled for the workspace.",
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
          requests: { type: "integer" },
          previousRequests: { type: "integer" },
          toolCalls: { type: "integer" },
          previousToolCalls: { type: "integer" },
          errors: { type: "integer" },
          previousErrors: { type: "integer" },
          sessions: { type: "integer" },
          previousSessions: { type: "integer" },
          users: { type: "integer" },
          previousUsers: { type: "integer" },
          p95Ms: { type: "integer" },
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
      },
      daily: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "string" },
            toolsCall: { type: "integer" },
            resourcesRead: { type: "integer" },
            promptsGet: { type: "integer" },
            other: { type: "integer" },
            errors: { type: "integer" },
          },
          required: ["day", "toolsCall", "resourcesRead", "promptsGet", "other", "errors"],
        },
      },
      tools: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            calls: { type: "integer" },
            errors: { type: "integer" },
            users: { type: "integer" },
            avgResponseBytes: { type: "integer" },
            p50Ms: { type: "integer" },
            p95Ms: { type: "integer" },
            uiResource: { type: "string" },
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
      },
      clients: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            sessions: { type: "integer" },
            requests: { type: "integer" },
            errors: { type: "integer" },
            lastSeenAt: { type: "string" },
          },
          required: ["name", "sessions", "requests", "errors", "lastSeenAt"],
        },
      },
      errorRequests: {
        type: "array",
        items: {
          type: "object",
          properties: {
            capturedAt: { type: "string" },
            clientName: { type: "string" },
            clientVersion: { type: "string" },
            method: { type: "string" },
            target: { type: "string" },
            status: { type: "string", enum: ["ok", "tool_error", "rpc_error"] },
            errorCode: { type: "integer" },
            errorMessage: { type: "string" },
            durationMs: { type: "integer" },
            model: { type: "string" },
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
        description: "Most recent failed requests, newest first.",
      },
      models: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            sessions: { type: "integer" },
            calls: { type: "integer" },
            errors: { type: "integer" },
          },
          required: ["name", "sessions", "calls", "errors"],
        },
      },
      intents: {
        type: "array",
        items: {
          type: "object",
          properties: {
            intent: { type: "string" },
            tool: { type: "string" },
            calls: { type: "integer" },
            errors: { type: "integer" },
          },
          required: ["intent", "tool", "calls", "errors"],
        },
      },
      elicitations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            method: { type: "string" },
            tool: { type: "string" },
            requests: { type: "integer" },
            accepted: { type: "integer" },
            declined: { type: "integer" },
            cancelled: { type: "integer" },
            errors: { type: "integer" },
          },
          required: ["method", "tool", "requests", "accepted", "declined", "cancelled", "errors"],
        },
      },
      uiRenders: {
        type: "array",
        items: {
          type: "object",
          properties: {
            resource: { type: "string" },
            tools: { type: "array", items: { type: "string" } },
            renders: { type: "integer" },
            sessions: { type: "integer" },
            errors: { type: "integer" },
          },
          required: ["resource", "tools", "renders", "sessions", "errors"],
        },
      },
      catalog: {
        type: ["object", "null"],
        properties: {
          listedAt: { type: "string" },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          properties: { tool: { type: "string" }, calls: { type: "integer" }, afterFailure: { type: "integer" } },
          required: ["tool", "calls", "afterFailure"],
        },
        description: "Tools called right before this one in the same session.",
      },
      after: {
        type: "array",
        items: {
          type: "object",
          properties: { tool: { type: "string" }, calls: { type: "integer" }, afterFailure: { type: "integer" } },
          required: ["tool", "calls", "afterFailure"],
        },
        description: "Tools called right after this one in the same session.",
      },
      failures: {
        type: "array",
        items: {
          type: "object",
          properties: {
            message: { type: "string" },
            clientName: { type: "string" },
            status: { type: "string", enum: ["ok", "tool_error", "rpc_error"] },
            errorCode: { type: "integer" },
            calls: { type: "integer" },
            lastSeenAt: { type: "string" },
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
            intent: { type: "string" },
            tool: { type: "string" },
            calls: { type: "integer" },
            errors: { type: "integer" },
          },
          required: ["intent", "tool", "calls", "errors"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["before", "after", "failures", "intents", "organization"],
  },
  getGeoPersonaActivity: {
    type: "object",
    properties: {
      from: { type: "string" },
      to: { type: "string" },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            personaId: { type: "string" },
            snapshotVersion: { type: "string" },
            day: { type: "string" },
            lastCheckedAt: { type: "string" },
            checks: { type: "integer" },
            mentions: { type: "integer" },
          },
          required: ["personaId", "snapshotVersion", "day", "lastCheckedAt", "checks", "mentions"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          personaId: { type: ["string", "null"] },
          startedAt: { type: "string" },
          error: { type: ["string", "null"] },
        },
        required: ["id", "status", "personaId", "startedAt", "error"],
        description: "The project's latest generation job, or `null` when none ran recently.",
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            prompt: { type: "string" },
            answer: { type: "string" },
            mentioned: { type: "boolean" },
            position: { type: ["number", "null"] },
            sentiment: { type: ["string", "null"] },
            excerpt: { type: "string" },
            searchQueries: { type: "array", items: { type: "string" } },
            sources: {
              type: "array",
              items: {
                type: "object",
                properties: { title: { type: "string" }, url: { type: "string" }, domain: { type: "string" } },
                required: ["title", "url", "domain"],
              },
            },
            snapshotVersion: {
              type: ["string", "null"],
              description:
                "Hash of the persona context this answer was played with. Changes when the persona is edited.",
            },
            lastCheckedAt: { type: "string" },
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
      },
      scans: {
        type: "array",
        items: {
          type: "object",
          properties: { id: { type: "string" }, capturedAt: { type: "string" } },
          required: ["id", "capturedAt"],
        },
      },
      selectedScanId: { type: ["string", "null"] },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["results", "scans", "selectedScanId", "organization"],
  },
  getGeoPromptHistory: {
    type: "object",
    properties: {
      configured: { type: "boolean" },
      promptId: { type: "string" },
      checks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            scanId: { type: "string" },
            engine: { type: "string" },
            mentioned: { type: "boolean" },
            ownedSourceCited: { type: "boolean" },
            position: { type: ["number", "null"] },
            sentiment: { type: ["string", "null"] },
            competitors: { type: "array", items: { type: "string" } },
            language: { type: "string" },
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
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          promptId: { type: "string" },
          engine: { type: "string" },
          prompt: { type: "string" },
          answer: { type: "string" },
          mentioned: { type: "boolean" },
          ownedSourceCited: { type: "boolean" },
          position: { type: ["integer", "null"] },
          sentiment: { type: ["string", "null"] },
          competitors: { type: "array", items: { type: "string" } },
          excerpt: { type: "string" },
          searchQueries: { type: "array", items: { type: "string" } },
          sources: {
            type: "array",
            items: {
              type: "object",
              properties: { title: { type: "string" }, url: { type: "string" }, domain: { type: "string" } },
              required: ["title", "url", "domain"],
            },
          },
          lastCheckedAt: { type: "string" },
          finishReason: { type: ["string", "null"] },
          promptTokens: { type: ["integer", "null"] },
          outputTokens: { type: ["integer", "null"] },
          reasoningTokens: { type: ["integer", "null"] },
          truncated: { type: ["boolean", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          finishedAt: { type: ["string", "null"] },
          createdAt: { type: "string" },
          summary: {
            type: "object",
            properties: {
              plannedChecks: { type: ["integer", "null"], minimum: 0 },
              completedChecks: { type: "integer", minimum: 0 },
              mentionCount: { type: "integer", minimum: 0 },
              failedChecks: { type: "integer", minimum: 0 },
              engines: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    engine: { type: "string" },
                    plannedChecks: { type: ["integer", "null"], minimum: 0 },
                    completedChecks: { type: "integer", minimum: 0 },
                    mentionCount: { type: "integer", minimum: 0 },
                    failedChecks: { type: "integer", minimum: 0 },
                  },
                  required: ["engine", "plannedChecks", "completedChecks", "mentionCount", "failedChecks"],
                },
              },
            },
            required: ["plannedChecks", "completedChecks", "mentionCount", "failedChecks", "engines"],
          },
          errorCode: { type: ["string", "null"] },
          errorMessage: { type: ["string", "null"] },
          failedStage: { type: ["string", "null"], enum: ["handoff", "execution", "stale", null] },
          retryable: { type: ["boolean", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["scan", "organization"],
  },
  getGeoSentiment: {
    type: "object",
    properties: {
      configured: { type: "boolean", enum: [true] },
      summary: {
        type: "object",
        properties: {
          totalChecks: { type: "integer" },
          mentions: { type: "integer" },
          positive: { type: "integer" },
          neutral: { type: "integer" },
          negative: { type: "integer" },
          lastCheckedAt: { type: ["string", "null"] },
          score: { type: ["number", "null"] },
          classifiedMentions: { type: "integer" },
          unknownMentions: { type: "integer" },
          notMentioned: { type: "integer" },
          positiveShare: { type: ["number", "null"] },
          neutralShare: { type: ["number", "null"] },
          negativeShare: { type: ["number", "null"] },
          classificationCoverage: { type: ["number", "null"] },
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
      },
      engines: {
        type: "array",
        items: {
          type: "object",
          properties: {
            totalChecks: { type: "integer" },
            mentions: { type: "integer" },
            positive: { type: "integer" },
            neutral: { type: "integer" },
            negative: { type: "integer" },
            lastCheckedAt: { type: ["string", "null"] },
            score: { type: ["number", "null"] },
            classifiedMentions: { type: "integer" },
            unknownMentions: { type: "integer" },
            notMentioned: { type: "integer" },
            positiveShare: { type: ["number", "null"] },
            neutralShare: { type: ["number", "null"] },
            negativeShare: { type: ["number", "null"] },
            classificationCoverage: { type: ["number", "null"] },
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
      },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            totalChecks: { type: "integer" },
            mentions: { type: "integer" },
            positive: { type: "integer" },
            neutral: { type: "integer" },
            negative: { type: "integer" },
            lastCheckedAt: { type: ["string", "null"] },
            score: { type: ["number", "null"] },
            classifiedMentions: { type: "integer" },
            unknownMentions: { type: "integer" },
            notMentioned: { type: "integer" },
            positiveShare: { type: ["number", "null"] },
            neutralShare: { type: ["number", "null"] },
            negativeShare: { type: ["number", "null"] },
            classificationCoverage: { type: ["number", "null"] },
            day: { type: "string" },
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
      },
      comparison: {
        type: "object",
        properties: {
          current: {
            type: "object",
            properties: { from: { type: "string" }, to: { type: "string" } },
            required: ["from", "to"],
          },
          previous: {
            type: "object",
            properties: { from: { type: "string" }, to: { type: "string" } },
            required: ["from", "to"],
          },
          summary: {
            type: "object",
            properties: {
              totalChecks: { type: "integer" },
              mentions: { type: "integer" },
              positive: { type: "integer" },
              neutral: { type: "integer" },
              negative: { type: "integer" },
              lastCheckedAt: { type: ["string", "null"] },
              score: { type: ["number", "null"] },
              classifiedMentions: { type: "integer" },
              unknownMentions: { type: "integer" },
              notMentioned: { type: "integer" },
              positiveShare: { type: ["number", "null"] },
              neutralShare: { type: ["number", "null"] },
              negativeShare: { type: ["number", "null"] },
              classificationCoverage: { type: ["number", "null"] },
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
          },
          points: {
            type: "array",
            items: {
              type: "object",
              properties: {
                totalChecks: { type: "integer" },
                mentions: { type: "integer" },
                positive: { type: "integer" },
                neutral: { type: "integer" },
                negative: { type: "integer" },
                lastCheckedAt: { type: ["string", "null"] },
                score: { type: ["number", "null"] },
                classifiedMentions: { type: "integer" },
                unknownMentions: { type: "integer" },
                notMentioned: { type: "integer" },
                positiveShare: { type: ["number", "null"] },
                neutralShare: { type: ["number", "null"] },
                negativeShare: { type: ["number", "null"] },
                classificationCoverage: { type: ["number", "null"] },
                day: { type: "string" },
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
          },
          delta: { type: ["number", "null"] },
        },
        required: ["current", "previous", "summary", "points", "delta"],
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "summary", "engines", "points", "organization"],
  },
  getGeoSentimentAnalysis: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["ready", "pending", "stale", "failed", "unavailable"] },
      result: {
        type: ["object", "null"],
        properties: {
          fingerprint: { type: "string" },
          generatedAt: { type: "string" },
          sampled: { type: "integer" },
          eligible: { type: "integer" },
          themes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                polarity: { type: "string", enum: ["positive", "negative"] },
                claims: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      statement: { type: "string" },
                      evidence: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            checkId: { type: "string" },
                            quote: { type: "string" },
                            prompt: { type: "string" },
                            engine: { type: "string" },
                            capturedAt: { type: "string" },
                          },
                          required: ["checkId", "quote", "prompt", "engine", "capturedAt"],
                        },
                      },
                    },
                    required: ["statement", "evidence"],
                  },
                },
                evidence: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      checkId: { type: "string" },
                      quote: { type: "string" },
                      prompt: { type: "string" },
                      engine: { type: "string" },
                      capturedAt: { type: "string" },
                    },
                    required: ["checkId", "quote", "prompt", "engine", "capturedAt"],
                  },
                },
              },
              required: ["title", "polarity", "claims", "evidence"],
            },
          },
        },
        required: ["fingerprint", "generatedAt", "sampled", "eligible", "themes"],
      },
      message: { type: ["string", "null"] },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["status", "result", "message", "organization"],
  },
  getGeoSettings: {
    type: "object",
    properties: {
      configured: { type: "boolean", description: "Whether the analytics backend is configured." },
      settings: {
        type: ["object", "null"],
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          projectId: { type: "string" },
          companyName: { type: "string" },
          aliases: { type: "array", items: { type: "string" } },
          conversionPaths: { type: "array", items: { type: "string" } },
          domains: { type: "array", items: { type: "string" } },
          competitors: { type: "array", items: { type: "string" } },
          languages: { type: "array", items: { type: "string" } },
          engines: { type: "array", items: { type: "string" } },
          enforceZdr: { type: "boolean" },
          nonZdrApprovedEngines: { type: "array", items: { type: "string" } },
          trackWithoutSearch: { type: "boolean" },
          pausedAutoPromptIds: { type: "array", items: { type: "string" } },
          removedAutoPromptIds: { type: "array", items: { type: "string" } },
          enabled: { type: "boolean" },
          scanIntervalHours: { type: "integer" },
          scanStartedAt: { type: ["string", "null"] },
          lastScanAt: { type: ["string", "null"] },
          isScanning: { type: "boolean" },
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
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            capturedAt: { type: "string" },
            path: { type: "string" },
            host: { type: "string" },
            method: { type: "string" },
            referer: { type: "string" },
            country: { type: "string" },
            agent: { type: "string" },
            category: { type: "string" },
          },
          required: ["capturedAt", "path", "host", "method", "referer", "country", "agent", "category"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            journeys: { type: "integer" },
            previousJourneys: { type: "integer" },
            pages: { type: "integer" },
            singleFetch: { type: "integer" },
            deepCrawls: { type: "integer" },
            lastSeenAt: { type: ["string", "null"] },
            daily: {
              type: "array",
              items: {
                type: "object",
                properties: { day: { type: "string" }, journeys: { type: "integer" } },
                required: ["day", "journeys"],
              },
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
      },
      pages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            path: { type: "string" },
            journeys: { type: "integer" },
            previousJourneys: { type: "integer" },
            entries: { type: "integer", description: "Journeys whose first fetch was this page." },
            lastSeenAt: { type: ["string", "null"] },
            daily: {
              type: "array",
              items: {
                type: "object",
                properties: { day: { type: "string" }, journeys: { type: "integer" } },
                required: ["day", "journeys"],
              },
            },
          },
          required: ["path", "journeys", "previousJourneys", "entries", "lastSeenAt", "daily"],
        },
      },
      totalPages: { type: "integer" },
      previousTotalPages: { type: "integer" },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            capturedAt: { type: "string" },
            visitorType: { type: "string", enum: ["crawler", "ai_referral", "human", "unknown"] },
            source: { type: "string" },
            agent: { type: "string" },
            category: { type: "string" },
            confidence: { type: "string" },
            path: { type: "string" },
            host: { type: "string" },
            country: { type: "string" },
            ua: { type: "string" },
            journeyId: { type: "string" },
            wantsMarkdown: { type: "boolean" },
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
      },
      total: { type: "integer" },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          crawler: { type: "integer" },
          cited: { type: "integer" },
          aiReferral: { type: "integer" },
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
            source: { type: "string" },
            visitorType: { type: "string", enum: ["crawler", "ai_referral", "human", "unknown"] },
            agent: { type: "string" },
            category: { type: "string" },
            confidence: { type: "string" },
            visits: { type: "integer" },
            previousVisits: { type: "integer" },
            markdownVisits: { type: "integer" },
            previousMarkdownVisits: { type: "integer" },
            paths: { type: "integer" },
            previousPaths: { type: "integer" },
            lastSeenAt: { type: "string" },
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
      },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "string" },
            visitorType: { type: "string", enum: ["crawler", "ai_referral", "human", "unknown"] },
            source: { type: "string" },
            visits: { type: "integer" },
          },
          required: ["day", "visitorType", "source", "visits"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "totals", "previousConversions", "sources", "points", "organization"],
  },
  getGeoVisibilityCompetitorDetail: {
    type: "object",
    properties: {
      configured: { type: "boolean" },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: { day: { type: "string" }, mentions: { type: "integer" }, checks: { type: "integer" } },
          required: ["day", "mentions", "checks"],
        },
      },
      prompts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            promptId: { type: "string" },
            prompt: { type: "string" },
            engine: { type: "string" },
            capturedAt: { type: "string" },
            mentioned: { type: "boolean" },
            position: { type: ["integer", "null"] },
          },
          required: ["promptId", "prompt", "engine", "capturedAt", "mentioned", "position"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "points", "prompts", "organization"],
  },
  getGeoVisibilityCompetitorShare: {
    type: "object",
    properties: {
      configured: { type: "boolean" },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            brand: { type: "string" },
            mentions: { type: "integer" },
            trend: {
              type: "array",
              items: {
                type: "object",
                properties: { day: { type: "string" }, value: { type: "number" } },
                required: ["day", "value"],
              },
            },
          },
          required: ["brand", "mentions"],
        },
      },
      timeseries: {
        type: "array",
        items: {
          type: "object",
          properties: { brand: { type: "string" }, day: { type: "string" }, mentions: { type: "integer" } },
          required: ["brand", "day", "mentions"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "points", "timeseries", "organization"],
  },
  getGeoVisibilityLanguageShare: {
    type: "object",
    properties: {
      configured: { type: "boolean" },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            language: { type: "string" },
            checks: { type: "integer" },
            mentions: { type: "integer" },
            mentionRate: { type: "number" },
            citations: { type: "integer" },
            visibility: { type: "integer" },
            visibilityRate: { type: "number" },
            avgPosition: { type: ["number", "null"] },
            trend: {
              type: "array",
              items: {
                type: "object",
                properties: { day: { type: "string" }, value: { type: "number" } },
                required: ["day", "value"],
              },
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
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "points", "organization"],
  },
  getGeoVisibilityOverview: {
    type: "object",
    properties: {
      configured: { type: "boolean", description: "Whether the analytics backend is configured." },
      engines: {
        type: "array",
        items: {
          type: "object",
          properties: {
            engine: { type: "string" },
            checks: { type: "integer" },
            mentions: { type: "integer" },
            mentionRate: { type: "number" },
            citations: { type: "integer" },
            visibility: { type: "integer" },
            visibilityRate: { type: "number" },
            avgPosition: { type: ["number", "null"] },
            lastCheckedAt: { type: "string" },
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
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "engines", "organization"],
  },
  getGeoVisibilityPromptResults: {
    type: "object",
    properties: {
      configured: { type: "boolean" },
      results: {
        type: "array",
        items: {
          type: "object",
          properties: {
            promptId: { type: "string" },
            engine: { type: "string" },
            prompt: { type: "string" },
            answer: { type: "string" },
            mentioned: { type: "boolean" },
            ownedSourceCited: { type: "boolean" },
            position: { type: ["integer", "null"] },
            sentiment: { type: ["string", "null"] },
            competitors: { type: "array", items: { type: "string" } },
            excerpt: { type: "string" },
            searchQueries: { type: "array", items: { type: "string" } },
            sources: {
              type: "array",
              items: {
                type: "object",
                properties: { title: { type: "string" }, url: { type: "string" }, domain: { type: "string" } },
                required: ["title", "url", "domain"],
              },
            },
            lastCheckedAt: { type: "string" },
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
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "results", "organization"],
  },
  getGeoVisibilityTimeseries: {
    type: "object",
    properties: {
      configured: { type: "boolean" },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "string" },
            engine: { type: "string" },
            checks: { type: "integer" },
            mentions: { type: "integer" },
            citations: { type: "integer" },
            visibility: { type: "integer" },
            avgPosition: { type: ["number", "null"] },
          },
          required: ["day", "engine", "checks", "mentions", "citations", "visibility"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          provider: { type: "string", enum: ["plausible", "plausible_csv", "vercel", "cloudflare", "cloudflare_rum"] },
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
            views: { type: "integer" },
          },
          required: ["host", "siteId", "views"],
        },
      },
      totals: {
        type: "object",
        properties: {
          views: { type: "integer" },
          previousViews: { type: "integer" },
          visitors: { type: "integer" },
          previousVisitors: { type: "integer" },
          sessions: { type: "integer" },
          previousSessions: { type: "integer" },
          engagedSessions: { type: "integer" },
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
          properties: { day: { type: "string" }, views: { type: "integer" }, visitors: { type: "integer" } },
          required: ["day", "views", "visitors"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          provider: { type: "string", enum: ["plausible", "plausible_csv", "vercel", "cloudflare", "cloudflare_rum"] },
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
            previousViews: { type: "integer" },
            visitors: { type: "integer" },
            landings: { type: "integer" },
            aiVisitors: { type: "integer" },
          },
          required: ["host", "path", "views", "previousViews", "visitors", "landings", "aiVisitors"],
        },
      },
      sources: {
        type: "array",
        items: {
          type: "object",
          properties: {
            group: { type: "string", description: "Referrer group: ai, direct, internal, search, social or other." },
            source: { type: "string" },
            aiProduct: { type: "string" },
            sessions: { type: "integer" },
            previousSessions: { type: "integer" },
            visitors: { type: "integer" },
          },
          required: ["group", "source", "aiProduct", "sessions", "previousSessions", "visitors"],
        },
      },
      countries: {
        type: "array",
        items: {
          type: "object",
          properties: {
            value: { type: "string" },
            visitors: { type: "integer" },
            previousVisitors: { type: ["integer", "null"] },
          },
          required: ["value", "visitors"],
        },
        description: "ISO 3166-1 alpha-2 country codes.",
      },
      devices: {
        type: "array",
        items: {
          type: "object",
          properties: {
            value: { type: "string" },
            visitors: { type: "integer" },
            previousVisitors: { type: ["integer", "null"] },
          },
          required: ["value", "visitors"],
        },
      },
      outcomes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            source: {
              type: "string",
              description: "AI assistant the session came from; empty for every other session.",
            },
            sessions: { type: "integer" },
            pagesPerSession: { type: "number" },
            engagedRate: { type: "number" },
          },
          required: ["source", "sessions", "pagesPerSession", "engagedRate"],
        },
        description: "How sessions from AI assistants behave compared to others.",
      },
      outboundLinks: {
        type: "array",
        items: {
          type: "object",
          properties: {
            url: { type: "string", description: "Destination host and path, without the query." },
            clicks: { type: "integer" },
            previousClicks: { type: "integer" },
            visitors: { type: "integer" },
          },
          required: ["url", "clicks", "previousClicks", "visitors"],
        },
        description: "Clicks on links to other sites.",
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
            samples: { type: "integer" },
          },
          required: ["metric", "p75", "samples"],
        },
        description: "Core Web Vitals from real visits.",
      },
      errors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            message: { type: "string", description: "Scrubbed before storage: no query strings, emails or long ids." },
            source: { type: "string" },
            events: { type: "integer" },
            views: { type: "integer" },
          },
          required: ["message", "source", "events", "views"],
        },
        description: "JavaScript errors reported by notra.plus.js.",
      },
      languages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            value: { type: "string" },
            visitors: { type: "integer" },
            previousVisitors: { type: ["integer", "null"] },
          },
          required: ["value", "visitors"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            sessions: { type: "integer" },
            previousSessions: { type: "integer" },
            visitors: { type: "integer" },
          },
          required: ["value", "sessions", "previousSessions", "visitors"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          displayName: { type: "string" },
          owner: { type: ["string", "null"] },
          repo: { type: ["string", "null"] },
          defaultBranch: { type: ["string", "null"] },
        },
        required: ["id", "displayName", "owner", "repo", "defaultBranch"],
      },
      type: { type: "string", enum: ["pull_requests", "commits", "releases"] },
      since: { type: "string" },
      until: { type: "string" },
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            ref: { type: "string", description: "Pull request number, commit SHA or release tag, depending on type." },
            title: { type: "string" },
            body: { type: ["string", "null"] },
            author: { type: ["string", "null"] },
            url: { type: "string" },
            occurredAt: { type: "string", description: "Merge, commit or publish time (ISO 8601)." },
          },
          required: ["ref", "title", "body", "author", "url", "occurredAt"],
        },
      },
      pagination: {
        type: "object",
        properties: { page: { type: "integer" }, nextPage: { type: ["integer", "null"] } },
        required: ["page", "nextPage"],
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      post: {
        type: ["object", "null"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: ["string", "null"] },
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
          recommendations: { type: ["string", "null"] },
          contentType: {
            type: "string",
            enum: ["changelog", "linkedin_post", "twitter_post", "blog_post", "investor_update", "image"],
          },
          sourceMetadata: {},
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
  getPostAgentReach: {
    type: "object",
    properties: {
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      agentReach: {
        type: ["object", "null"],
        properties: {
          postId: { type: "string" },
          siteId: { type: "string" },
          path: {
            type: "string",
            description:
              "Path the post is served at on its Site. Visits to its Markdown copy (`<path>.md`) and index files are counted too.",
          },
          url: { type: "string" },
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
              total: { type: "integer" },
            },
            required: ["crawled", "cited", "referred", "total"],
          },
          sources: {
            type: "array",
            items: {
              type: "object",
              properties: {
                source: { type: "string" },
                visitorType: { type: "string", enum: ["crawler", "ai_referral", "human", "unknown"] },
                agent: { type: "string" },
                category: { type: "string" },
                confidence: { type: "string" },
                visits: { type: "integer" },
                previousVisits: { type: "integer" },
                markdownVisits: { type: "integer" },
                previousMarkdownVisits: { type: "integer" },
                paths: { type: "integer" },
                previousPaths: { type: "integer" },
                lastSeenAt: { type: "string" },
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
          },
          points: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "string" },
                visitorType: { type: "string", enum: ["crawler", "ai_referral", "human", "unknown"] },
                source: { type: "string" },
                visits: { type: "integer" },
              },
              required: ["day", "visitorType", "source", "visits"],
            },
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
          repositoryIds: { type: "array", items: { type: "string" } },
          brandVoiceId: { type: ["string", "null"] },
          workflowRunId: { type: ["string", "null"] },
          postId: {
            type: ["string", "null"],
            description: "ID of the generated post. Set once the job reaches completed.",
          },
          error: { type: ["string", "null"], description: "Failure reason when status is failed." },
          errorCode: {
            type: ["string", "null"],
            description:
              "Stable machine-readable failure code when status is failed, such as NO_ACTIVITY_TYPES_SELECTED or NO_AVAILABLE_SOURCES. Absent or null for other failures and for older jobs.",
          },
          source: { type: "string", enum: ["api", "dashboard"] },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          completedAt: { type: ["string", "null"] },
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
            message: { type: "string" },
            createdAt: { type: "string" },
            metadata: { type: ["object", "null"], additionalProperties: {} },
          },
          required: ["id", "jobId", "type", "message", "createdAt", "metadata"],
        },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      schedule: {
        type: ["object", "null"],
        properties: {
          postId: { type: "string" },
          scheduledAt: { type: "string", format: "date-time" },
          timeZone: { type: "string" },
          publications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                destination: { type: "string", enum: ["notra", "github", "social"] },
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
                      properties: { destination: { type: "string", enum: ["social"] }, accountId: { type: "string" } },
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
                attempts: { type: "integer" },
                errorCode: { type: ["string", "null"] },
                lastError: { type: ["string", "null"] },
                resultUrl: { type: ["string", "null"], description: "Pull request or social post URL once published." },
                publishedAt: { type: ["string", "null"], format: "date-time" },
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
          },
        },
        required: ["postId", "scheduledAt", "timeZone", "publications"],
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
          id: { type: "string" },
          name: { type: "string" },
          brandSettingsId: { type: "string" },
          createdAt: { type: "string" },
        },
        required: ["id", "name", "brandSettingsId", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          projectId: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          status: { type: "string", enum: ["active", "suspended"] },
          suspendedReason: { type: ["string", "null"] },
          repository: {
            type: ["object", "null"],
            properties: { id: { type: ["string", "null"] }, owner: { type: "string" }, name: { type: "string" } },
            required: ["id", "owner", "name"],
          },
          productionBranch: { type: "string" },
          rootDirectory: { type: "string", description: "Directory in the repository that holds blog.json." },
          liveUrl: { type: "string", description: "Public URL of the Site's first section." },
          publicOrigin: { type: "string" },
          aliasOrigin: { type: "string", description: "Notra-hosted address that always serves the Site." },
          mounts: { type: "object", properties: { blog: { type: "string" }, changelog: { type: "string" } } },
          mountsFromConfig: {
            type: "boolean",
            description:
              "True when the live build's blog.json sets the sections, so the dashboard can't change them. Change them with PATCH /v1/sites/{siteId}/sections or in blog.json.",
          },
          previewsEnabled: { type: "boolean" },
          previewVisibility: { type: "string", enum: ["public", "protected"] },
          smartDeployments: { type: "boolean" },
          analyticsEnabled: { type: "boolean" },
          liveDeploymentId: { type: ["string", "null"] },
          rollbackActive: {
            type: "boolean",
            description:
              "Production is pinned to an older build; new builds finish but don't go live until someone promotes one in the dashboard.",
          },
          liveSince: { type: ["string", "null"] },
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
            kind: { type: "string", enum: ["subdomain", "proxy"] },
            status: { type: "string", enum: ["pending", "verifying", "active", "failed"] },
            isPrimary: { type: "boolean" },
            records: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["CNAME", "TXT", "A"] },
                  name: { type: "string" },
                  value: { type: "string" },
                  purpose: { type: "string", enum: ["routing", "ownership", "certificate"] },
                },
                required: ["type", "name", "value", "purpose"],
              },
            },
            lastError: { type: ["string", "null"] },
            verifiedAt: { type: ["string", "null"] },
          },
          required: ["id", "hostname", "kind", "status", "isPrimary", "records", "lastError", "verifiedAt"],
        },
      },
      previews: {
        type: "array",
        items: {
          type: "object",
          properties: {
            previewKey: { type: "string" },
            deploymentId: { type: "string" },
            visibility: { type: "string", enum: ["public", "protected"] },
            url: { type: "string" },
            branch: { type: ["string", "null"] },
            pullRequestNumber: { type: ["integer", "null"] },
            commitSha: { type: ["string", "null"] },
            activatedAt: { type: "string" },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          kind: { type: "string", enum: ["production", "preview"] },
          previewKey: { type: ["string", "null"] },
          trigger: { type: "string", enum: ["push", "pull_request", "manual", "redeploy", "config", "toolchain"] },
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
          live: { type: "boolean" },
          liveSince: { type: ["string", "null"] },
          branch: { type: "string" },
          commitSha: { type: "string" },
          commitMessage: { type: ["string", "null"] },
          commitAuthor: { type: ["string", "null"] },
          pullRequestNumber: { type: ["integer", "null"] },
          url: { type: "string" },
          fileCount: { type: ["integer", "null"] },
          totalBytes: { type: ["integer", "null"] },
          buildDurationMs: { type: ["integer", "null"] },
          errorMessage: { type: ["string", "null"] },
          skipReason: { type: ["string", "null"] },
          diagnostics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                severity: { type: "string", enum: ["error", "warning"] },
                file: { type: ["string", "null"] },
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
      logTruncated: { type: "boolean" },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
              live: { type: "boolean" },
              deleting: { type: "boolean" },
              errorMessage: { type: ["string", "null"] },
              expiresAt: { type: "string" },
              hasPassword: { type: "boolean" },
              url: { type: "string" },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
              name: { type: "string" },
              description: { type: "string" },
              isSystem: {
                type: "boolean",
                description: "True for built-in skills provided by Notra. System skills cannot be renamed or deleted.",
              },
              updatedAt: { type: "string" },
            },
            required: ["id", "name", "description", "isSystem", "updatedAt"],
          },
          {
            type: "object",
            properties: { content: { type: "string" }, createdAt: { type: "string" } },
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
          id: { type: "string" },
          eventId: { type: "string" },
          endpointId: { type: "string" },
          url: { type: "string" },
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
          status: { type: "string", enum: ["pending", "sending", "retrying", "succeeded", "failed", "cancelled"] },
          attemptCount: { type: "number" },
          nextAttemptAt: { type: "string" },
          createdAt: { type: "string" },
          statusCode: { type: ["number", "null"] },
          error: { type: ["string", "null"] },
          payload: { type: "string" },
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
            attemptNumber: { type: "number" },
            startedAt: { type: "string" },
            finishedAt: { type: ["string", "null"] },
            statusCode: { type: ["number", "null"] },
            error: { type: ["string", "null"] },
            durationMs: { type: ["number", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      workspaces: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            slug: { type: "string" },
            name: { type: "string" },
            logo: { type: ["string", "null"] },
            role: { type: ["string", "null"] },
            status: { type: "string", enum: ["active", "pending"] },
            isCurrent: { type: "boolean" },
          },
          required: ["id", "slug", "name", "logo", "role", "status", "isCurrent"],
        },
      },
      authentication: {
        oneOf: [
          { type: "object", properties: { type: { type: "string", enum: ["apiKey"] } }, required: ["type"] },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["oauth"] },
              accountId: { type: "string" },
              scopes: { type: "array", items: { type: "string" } },
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
      imported: { type: "integer" },
      updated: { type: "integer" },
      skipped: { type: "integer" },
      issues: {
        type: "array",
        items: {
          type: "object",
          properties: { line: { type: "integer" }, message: { type: "string" } },
          required: ["line", "message"],
        },
      },
      competitors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            domain: { type: ["string", "null"] },
            synonyms: { type: "array", items: { type: "string" } },
            kind: { type: "string", enum: ["direct", "indirect"] },
            color: { type: ["string", "null"] },
          },
          required: ["id", "name", "domain", "synonyms", "kind", "color"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["imported", "updated", "skipped", "issues", "competitors", "organization"],
  },
  importGeoPrompts: {
    type: "object",
    properties: {
      imported: { type: "integer" },
      updated: { type: "integer" },
      skipped: { type: "integer" },
      issues: {
        type: "array",
        items: {
          type: "object",
          properties: { line: { type: "integer" }, message: { type: "string" } },
          required: ["line", "message"],
        },
        description: "Rows rejected while parsing CSV. Always empty for `rows`.",
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          "Script tag that installs notra.js with the public key. Only present when web analytics is enabled for the workspace.",
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      colors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            role: {
              type: "string",
              enum: ["primary", "secondary", "accent", "background", "foreground", "neutral", "custom"],
            },
            name: { type: ["string", "null"] },
            lightValue: { type: "string" },
            darkValue: { type: ["string", "null"] },
            usage: { type: ["string", "null"] },
          },
          required: ["id", "role", "name", "lightValue", "darkValue", "usage"],
        },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      brandIdentities: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            isDefault: { type: "boolean" },
            websiteUrl: { type: "string" },
            companyName: { type: ["string", "null"] },
            companyDescription: { type: ["string", "null"] },
            toneProfile: { type: ["string", "null"] },
            customTone: { type: ["string", "null"] },
            customInstructions: { type: ["string", "null"] },
            audience: { type: ["string", "null"] },
            language: { type: ["string", "null"] },
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
            name: { type: "string" },
            sourceType: { type: "string", enum: ["github_webhook"] },
            sourceConfig: {
              type: "object",
              properties: {
                eventTypes: { type: "array", items: { type: "string", enum: ["release", "push"] }, minItems: 1 },
                includePreReleases: { type: "boolean", default: true },
                ignoreCommitPatterns: {
                  type: "array",
                  items: { type: "string", minLength: 1, maxLength: 120 },
                  maxItems: 10,
                  default: [],
                },
              },
              required: ["eventTypes"],
            },
            targets: {
              type: "object",
              properties: { repositoryIds: { type: "array", items: { type: "string", minLength: 1 }, minItems: 1 } },
              required: ["repositoryIds"],
            },
            outputType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
            outputConfig: {
              type: ["object", "null"],
              properties: {
                publishDestination: { type: "string", enum: ["webflow", "framer", "custom"] },
                brandVoiceId: { type: "string", minLength: 1 },
                notify: {
                  type: "object",
                  properties: { slack: { type: "boolean" }, email: { type: "boolean" } },
                  required: ["slack", "email"],
                },
              },
            },
            enabled: { type: "boolean" },
            autoPublish: { type: "boolean" },
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
      },
      repositoryMap: { type: "object", additionalProperties: { type: "string" } },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            projectId: { type: ["string", "null"] },
            source: {
              type: "string",
              enum: ["mcp", "api", "sdk"],
              description: "Channel the feedback arrived through.",
            },
            kind: {
              type: "string",
              enum: ["bug", "feature", "praise", "question", "other"],
              description: "What kind of feedback this is.",
            },
            sentiment: {
              type: ["string", "null"],
              enum: ["negative", "neutral", "positive", null],
              description: "Overall sentiment of the feedback.",
            },
            status: { type: "string", enum: ["new", "triaged", "resolved", "archived"], description: "Triage status." },
            title: { type: ["string", "null"] },
            message: { type: "string" },
            agentClient: { type: ["string", "null"] },
            agentModel: { type: ["string", "null"] },
            toolVersion: { type: ["string", "null"] },
            userAgent: { type: ["string", "null"] },
            contextUrl: { type: ["string", "null"] },
            externalId: { type: ["string", "null"] },
            idempotencyKey: { type: ["string", "null"] },
            metadata: { type: ["object", "null"], additionalProperties: {} },
            resolvedAt: { type: ["string", "null"] },
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
              enum: ["plausible", "plausible_csv", "vercel", "cloudflare", "cloudflare_rum"],
            },
            kind: { type: "string", enum: ["web", "geo"], description: "web: page views; geo: AI crawler requests." },
            sourceLabel: { type: "string" },
            host: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "running", "waiting_rate_limit", "completed", "failed", "deleting", "deleted"],
            },
            startDay: { type: ["string", "null"] },
            endDay: { type: ["string", "null"] },
            cutoffDay: {
              type: ["string", "null"],
              description: "First day of native tracking; imports stop before it.",
            },
            chunksTotal: { type: "integer" },
            chunksDone: { type: "integer" },
            pageviewsImported: { type: "integer" },
            rowsWritten: { type: "integer" },
            capabilities: {
              type: "object",
              properties: {
                visitors: { type: "boolean" },
                visits: { type: "boolean" },
                bounces: { type: "boolean" },
                utm: { type: "boolean" },
                entryPages: { type: "boolean" },
                sampled: { type: "boolean" },
              },
              required: ["visitors", "visits", "bounces", "utm", "entryPages", "sampled"],
            },
            lastError: { type: ["string", "null"] },
            retryAt: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
      },
      currentScan: {
        type: ["object", "null"],
        properties: { id: { type: "string" }, finishedAt: { type: ["string", "null"] } },
        required: ["id", "finishedAt"],
      },
      summary: {
        type: "object",
        properties: {
          gained: { type: "integer" },
          lost: { type: "integer" },
          positionImproved: { type: "integer" },
          positionDropped: { type: "integer" },
          citationsAdded: { type: "integer" },
          citationsRemoved: { type: "integer" },
        },
        required: ["gained", "lost", "positionImproved", "positionDropped", "citationsAdded", "citationsRemoved"],
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
              properties: { mentioned: { type: "boolean" }, position: { type: ["number", "null"] } },
              required: ["mentioned", "position"],
            },
            current: {
              type: "object",
              properties: { mentioned: { type: "boolean" }, position: { type: ["number", "null"] } },
              required: ["mentioned", "position"],
            },
            competitors: { type: "array", items: { type: "string" } },
            domains: { type: "array", items: { type: "string" } },
          },
          required: ["kind", "promptId", "prompt", "engine", "previous", "current", "competitors", "domains"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            id: { type: "string" },
            name: { type: "string" },
            domain: { type: ["string", "null"] },
            synonyms: { type: "array", items: { type: "string" } },
            kind: { type: "string", enum: ["direct", "indirect"] },
            color: { type: ["string", "null"] },
          },
          required: ["id", "name", "domain", "synonyms", "kind", "color"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            postId: { type: ["string", "null"] },
            createdAt: { type: "string" },
          },
          required: ["id", "topic", "workingTitle", "status", "postId", "createdAt"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            id: { type: "string" },
            prompt: { type: "string" },
            title: { type: ["string", "null"] },
            engines: { type: "array", items: { type: "string" } },
            mentionedEngines: { type: "array", items: { type: "string" } },
            competitors: { type: "array", items: { type: "string" } },
            discoveredCompetitors: { type: "array", items: { type: "string" } },
            searchQueries: {
              type: "array",
              items: { type: "string" },
              description: "Web searches AI engines ran while answering this prompt.",
            },
            ownMentionRate: { type: "number" },
            engineCoverage: { type: "number" },
            opportunity: { type: "number" },
            won: { type: "boolean" },
            brief: {
              type: ["object", "null"],
              properties: {
                briefId: { type: "string" },
                status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
                postId: { type: ["string", "null"] },
                workingTitle: { type: ["string", "null"] },
                publishedAt: { type: ["string", "null"] },
                baseline: {
                  type: ["object", "null"],
                  properties: { mentionedEngines: { type: "number" }, totalEngines: { type: "number" } },
                  required: ["mentionedEngines", "totalEngines"],
                },
                rescanned: { type: "boolean" },
              },
              required: ["briefId", "status", "postId", "workingTitle", "publishedAt", "baseline", "rescanned"],
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
      },
      searchGaps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            prompt: { type: "string" },
            title: { type: ["string", "null"] },
            impressions: { type: ["number", "null"] },
            clicks: { type: ["number", "null"] },
            position: { type: ["number", "null"] },
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
                briefId: { type: "string" },
                status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
                postId: { type: ["string", "null"] },
                workingTitle: { type: ["string", "null"] },
                publishedAt: { type: ["string", "null"] },
                baseline: {
                  type: ["object", "null"],
                  properties: { mentionedEngines: { type: "number" }, totalEngines: { type: "number" } },
                  required: ["mentionedEngines", "totalEngines"],
                },
                rescanned: { type: "boolean" },
              },
              required: ["briefId", "status", "postId", "workingTitle", "publishedAt", "baseline", "rescanned"],
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
                reason: { type: "string" },
                targets: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      kind: { type: "string", enum: ["page", "post"] },
                      id: { type: "string" },
                      url: { type: ["string", "null"] },
                      title: { type: "string" },
                      score: { type: "number" },
                      googlePosition: {
                        type: "number",
                        description:
                          "Google position of the gap's queries on this page, when Search Console shows it already ranks there.",
                      },
                    },
                    required: ["kind", "id", "url", "title", "score"],
                  },
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
      },
      aiSearchGaps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            query: { type: "string" },
            variants: { type: "array", items: { type: "string" } },
            prompts: { type: "array", items: { type: "string" } },
            engines: { type: "array", items: { type: "string" } },
            searches: {
              type: "number",
              description:
                "Scan answers in which an engine ran this web search without mentioning the brand or citing its site.",
            },
            ownMentionRate: { type: "number" },
            competitors: { type: "array", items: { type: "string" } },
            discoveredCompetitors: { type: "array", items: { type: "string" } },
            opportunity: { type: "number" },
            brief: {
              type: ["object", "null"],
              properties: {
                briefId: { type: "string" },
                status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
                postId: { type: ["string", "null"] },
                workingTitle: { type: ["string", "null"] },
                publishedAt: { type: ["string", "null"] },
                baseline: {
                  type: ["object", "null"],
                  properties: { mentionedEngines: { type: "number" }, totalEngines: { type: "number" } },
                  required: ["mentionedEngines", "totalEngines"],
                },
                rescanned: { type: "boolean" },
              },
              required: ["briefId", "status", "postId", "workingTitle", "publishedAt", "baseline", "rescanned"],
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            label: { type: "string" },
            provider: { type: "string" },
            zdr: {
              type: "string",
              enum: ["all", "some", "none"],
              description:
                "Zero data retention coverage. Engines with `none` need `enforceZdr: false` or an entry in `nonZdrApprovedEngines`.",
            },
            default: { type: "boolean", description: "Part of the default engine set for new projects." },
            supportsGroundedChecks: { type: "boolean" },
          },
          required: ["id", "label", "provider", "zdr", "default", "supportsGroundedChecks"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["engines", "organization"],
  },
  listGeoPersonas: {
    type: "object",
    properties: {
      configured: { type: "boolean" },
      personas: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string", description: "Buyer archetype label, such as Budgeter." },
            role: { type: "string" },
            company: { type: "string" },
            summary: { type: "string" },
            searchStyle: { type: "string" },
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
            archivedAt: { type: ["string", "null"] },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            memories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  kind: { type: "string", enum: ["background", "experience", "preference", "constraint"] },
                  content: { type: "string" },
                },
                required: ["id", "kind", "content"],
              },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "personas", "organization"],
  },
  listGeoPromptResultSummaries: {
    type: "object",
    properties: {
      configured: { type: "boolean" },
      results: {
        type: "array",
        items: {
          type: "object",
          properties: {
            promptId: { type: "string" },
            engine: { type: "string" },
            prompt: { type: "string" },
            mentioned: { type: "boolean" },
            ownedSourceCited: { type: "boolean" },
            position: { type: ["integer", "null"] },
            sentiment: { type: ["string", "null"] },
            competitors: { type: "array", items: { type: "string" } },
            lastCheckedAt: { type: "string" },
            checkId: { type: "string" },
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
      },
      nextCursor: { type: ["string", "null"] },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["configured", "results", "nextCursor", "organization"],
  },
  listGeoPrompts: {
    type: "object",
    properties: {
      configured: { type: "boolean" },
      prompts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            prompt: { type: "string" },
            enabled: { type: "boolean" },
            source: { type: "string", enum: ["custom", "auto"] },
            tags: { type: "array", items: { type: "string" } },
            createdAt: { type: ["string", "null"] },
          },
          required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            id: { type: "string" },
            prompt: { type: "string" },
            title: { type: ["string", "null"] },
            source: { type: "string", enum: ["search_console"] },
            keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  query: { type: "string" },
                  clicks: { type: "number" },
                  impressions: { type: "number" },
                  position: { type: "number" },
                },
                required: ["query", "clicks", "impressions", "position"],
              },
              description: "Search Console queries the suggestion was derived from.",
            },
            createdAt: { type: "string" },
          },
          required: ["id", "prompt", "title", "source", "keywords", "createdAt"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            finishedAt: { type: ["string", "null"] },
            createdAt: { type: "string" },
            summary: {
              type: "object",
              properties: {
                plannedChecks: { type: ["integer", "null"], minimum: 0 },
                completedChecks: { type: "integer", minimum: 0 },
                mentionCount: { type: "integer", minimum: 0 },
                failedChecks: { type: "integer", minimum: 0 },
                engines: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      engine: { type: "string" },
                      plannedChecks: { type: ["integer", "null"], minimum: 0 },
                      completedChecks: { type: "integer", minimum: 0 },
                      mentionCount: { type: "integer", minimum: 0 },
                      failedChecks: { type: "integer", minimum: 0 },
                    },
                    required: ["engine", "plannedChecks", "completedChecks", "mentionCount", "failedChecks"],
                  },
                },
              },
              required: ["plannedChecks", "completedChecks", "mentionCount", "failedChecks", "engines"],
            },
            errorCode: { type: ["string", "null"] },
            errorMessage: { type: ["string", "null"] },
            failedStage: { type: ["string", "null"], enum: ["handoff", "execution", "stale", null] },
            retryable: { type: ["boolean", "null"] },
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
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            id: { type: "string" },
            scanId: { type: "string" },
            promptId: { type: "string" },
            prompt: { type: "string" },
            engine: { type: "string" },
            language: { type: "string" },
            capturedAt: { type: "string" },
            answer: { type: "string" },
            excerpt: { type: "string" },
          },
          required: ["id", "scanId", "promptId", "prompt", "engine", "language", "capturedAt", "answer", "excerpt"],
        },
      },
      nextCursor: { type: ["string", "null"] },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            steps: { type: "array", items: { type: "string" } },
            enabled: { type: "boolean" },
            createdAt: { type: "string" },
          },
          required: ["id", "name", "steps", "enabled", "createdAt"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            url: { type: "string", maxLength: 2048, format: "uri" },
            domain: { type: "string", minLength: 1 },
            title: { type: ["string", "null"], maxLength: 200 },
            kind: { type: "string", enum: ["listicle", "review_site", "community", "news", "docs", "video", "other"] },
            ownership: { type: "string", enum: ["third_party", "own", "competitor"] },
            origin: { type: "string", enum: ["scan", "manual"] },
            fetchStatus: { type: "string", enum: ["pending", "ok", "blocked", "failed"] },
            lastFetchedAt: { type: ["string", "null"], format: "date-time" },
            citations: {
              type: "object",
              properties: {
                windowCount: { type: "integer", minimum: 0 },
                totalCount: { type: "integer", minimum: 0 },
                promptCount: { type: "integer", minimum: 0 },
                engines: { type: "array", items: { type: "string", minLength: 1 } },
                firstCitedAt: { type: ["string", "null"], format: "date-time" },
                lastCitedAt: { type: ["string", "null"], format: "date-time" },
              },
              required: ["windowCount", "totalCount", "promptCount", "engines", "firstCitedAt", "lastCitedAt"],
            },
            placements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  competitorId: { type: ["string", "null"], minLength: 1 },
                  brandName: { type: "string", minLength: 1 },
                  brandDomain: { type: ["string", "null"] },
                  status: { type: "string", enum: ["present", "absent", "unknown"] },
                  position: { type: ["integer", "null"], exclusiveMinimum: 0 },
                  hasLink: { type: "boolean" },
                  evidence: { type: "string", enum: ["fetch", "manual"] },
                  excerpt: { type: ["string", "null"] },
                  checkedAt: { type: "string", format: "date-time" },
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
            },
            opportunity: {
              type: ["object", "null"],
              properties: {
                status: { type: "string", enum: ["open", "in_progress", "won", "lost", "dismissed"] },
                priority: { type: ["string", "null"], enum: ["low", "medium", "high", null] },
                assigneeMemberId: { type: ["string", "null"], minLength: 1 },
                pocMemberId: { type: ["string", "null"], minLength: 1 },
                notes: { type: ["string", "null"], maxLength: 2000 },
                dueAt: { type: ["string", "null"], format: "date-time" },
                id: { type: "string", minLength: 1 },
                createdByUserId: { type: ["string", "null"], minLength: 1 },
                resolvedAt: { type: ["string", "null"], format: "date-time" },
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
            },
            createdByUserId: { type: ["string", "null"], minLength: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
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
      },
      nextOffset: { type: ["integer", "null"], minimum: 0 },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            journeyId: { type: "string" },
            source: { type: "string" },
            visitorType: { type: "string", enum: ["crawler", "ai_referral", "human", "unknown"] },
            pages: { type: "integer" },
            distinctPaths: { type: "integer" },
            firstSeenAt: { type: "string" },
            lastSeenAt: { type: "string" },
            entryPath: { type: "string" },
            samplePaths: { type: "array", items: { type: "string" } },
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
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            source: { type: "string" },
            visitorType: { type: "string", enum: ["crawler", "ai_referral", "human", "unknown"] },
            visits: { type: "integer" },
            previousVisits: { type: "integer" },
            lastSeenAt: { type: "string" },
          },
          required: ["path", "host", "source", "visitorType", "visits", "lastSeenAt"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            id: { type: "string" },
            displayName: { type: "string" },
            owner: { type: ["string", "null"] },
            repo: { type: ["string", "null"] },
            defaultBranch: { type: ["string", "null"] },
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
            linearOrganizationId: { type: "string" },
            linearOrganizationName: { type: ["string", "null"] },
            linearTeamId: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            slug: { type: ["string", "null"] },
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
            recommendations: { type: ["string", "null"] },
            contentType: {
              type: "string",
              enum: ["changelog", "linkedin_post", "twitter_post", "blog_post", "investor_update", "image"],
            },
            sourceMetadata: {},
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
          nextPage: { type: ["integer", "null"], minimum: 1 },
          previousPage: { type: ["integer", "null"], minimum: 1 },
          totalPages: { type: "integer", minimum: 1 },
          totalItems: { type: "integer", minimum: 0 },
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
            id: { type: "string" },
            name: { type: "string" },
            brandSettingsId: { type: "string" },
            createdAt: { type: "string" },
          },
          required: ["id", "name", "brandSettingsId", "createdAt"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            title: { type: ["string", "null"], description: "Title of what the run produced, null while running." },
            postId: { type: ["string", "null"], description: "The draft post the run created, if any." },
            errorMessage: { type: ["string", "null"] },
            manual: { type: "boolean", description: "Started on demand rather than by the schedule." },
            startedAt: { type: "string" },
            finishedAt: { type: ["string", "null"] },
          },
          required: ["id", "status", "title", "postId", "errorMessage", "manual", "startedAt", "finishedAt"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
                      description: "Day of the month for monthly schedules (1-31). Required when frequency is monthly.",
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
                  description: "Where auto-published posts are sent.",
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
            enabled: { type: "boolean" },
            autoPublish: { type: "boolean" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
            lookbackWindow: {
              type: "string",
              enum: ["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"],
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
      },
      repositoryMap: { type: "object", additionalProperties: { type: "string" } },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            kind: { type: "string", enum: ["production", "preview"] },
            previewKey: { type: ["string", "null"] },
            trigger: { type: "string", enum: ["push", "pull_request", "manual", "redeploy", "config", "toolchain"] },
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
            live: { type: "boolean" },
            liveSince: { type: ["string", "null"] },
            branch: { type: "string" },
            commitSha: { type: "string" },
            commitMessage: { type: ["string", "null"] },
            commitAuthor: { type: ["string", "null"] },
            pullRequestNumber: { type: ["integer", "null"] },
            url: { type: "string" },
            fileCount: { type: ["integer", "null"] },
            totalBytes: { type: ["integer", "null"] },
            buildDurationMs: { type: ["integer", "null"] },
            errorMessage: { type: ["string", "null"] },
            skipReason: { type: ["string", "null"] },
            diagnostics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: { type: "string", enum: ["error", "warning"] },
                  file: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            name: { type: "string" },
            description: { type: "string" },
            isSystem: {
              type: "boolean",
              description: "True for built-in skills provided by Notra. System skills cannot be renamed or deleted.",
            },
            updatedAt: { type: "string" },
          },
          required: ["id", "name", "description", "isSystem", "updatedAt"],
        },
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
            id: { type: "string" },
            eventId: { type: "string" },
            endpointId: { type: "string" },
            url: { type: "string" },
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
            status: { type: "string", enum: ["pending", "sending", "retrying", "succeeded", "failed", "cancelled"] },
            attemptCount: { type: "number" },
            nextAttemptAt: { type: "string" },
            createdAt: { type: "string" },
            statusCode: { type: ["number", "null"] },
            error: { type: ["string", "null"] },
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
      },
      hasMore: { type: "boolean" },
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
            url: { type: "string" },
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
            },
            enabled: { type: "boolean" },
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
              name: { type: "string" },
              description: { type: "string" },
              isSystem: {
                type: "boolean",
                description: "True for built-in skills provided by Notra. System skills cannot be renamed or deleted.",
              },
              updatedAt: { type: "string" },
            },
            required: ["id", "name", "description", "isSystem", "updatedAt"],
          },
          {
            type: "object",
            properties: { content: { type: "string" }, createdAt: { type: "string" } },
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
      briefId: { type: "string" },
      brief: {
        type: "object",
        properties: {
          targetPrompt: { type: "string" },
          intent: { type: "string" },
          contentSubtype: {
            type: "string",
            enum: ["guide", "comparison", "listicle", "how-to", "faq", "alternatives"],
          },
          workingTitle: { type: "string" },
          audience: { type: "string" },
          jobToBeDone: { type: "string" },
          sections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                heading: { type: "string" },
                goal: { type: "string" },
                claims: { type: "array", items: { type: "string" } },
              },
              required: ["heading", "goal", "claims"],
            },
          },
          questionsToAnswer: { type: "array", items: { type: "string" } },
          internalLinks: {
            type: "array",
            items: {
              type: "object",
              properties: { url: { type: "string" }, anchor: { type: "string" }, why: { type: "string" } },
              required: ["url", "anchor", "why"],
            },
          },
          acceptanceChecklist: { type: "array", items: { type: "string" } },
          recommendedAngle: { type: "string" },
          competitorsToCounter: { type: "array", items: { type: "string" } },
          sourcesToReference: { type: "array", items: { type: "string" } },
          missingCoverage: { type: "array", items: { type: "string" } },
          baseline: {
            type: ["object", "null"],
            properties: {
              sourcePromptId: { type: "string" },
              mentionedEngines: { type: "number" },
              totalEngines: { type: "number" },
              engines: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    engine: { type: "string" },
                    mentioned: { type: "boolean" },
                    position: { type: ["number", "null"] },
                  },
                  required: ["engine", "mentioned", "position"],
                },
              },
              competitorMentions: {
                type: "array",
                items: {
                  type: "object",
                  properties: { name: { type: "string" }, engines: { type: "number" } },
                  required: ["name", "engines"],
                },
              },
              citedDomains: {
                type: "array",
                items: {
                  type: "object",
                  properties: { domain: { type: "string" }, engines: { type: "number" } },
                  required: ["domain", "engines"],
                },
              },
              capturedAt: { type: ["string", "null"] },
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
      },
      status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
      runId: { type: ["string", "null"] },
      postId: { type: ["string", "null"] },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["briefId", "brief", "status", "runId", "postId", "organization"],
  },
  publishPostToSite: {
    type: "object",
    properties: {
      operation: { type: "string", enum: ["created", "updated"] },
      branchName: { type: "string" },
      path: { type: "string" },
      pullRequestNumber: { type: "integer" },
      pullRequestUrl: { type: "string" },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          kind: { type: "string", enum: ["production", "preview"] },
          previewKey: { type: ["string", "null"] },
          trigger: { type: "string", enum: ["push", "pull_request", "manual", "redeploy", "config", "toolchain"] },
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
          live: { type: "boolean" },
          liveSince: { type: ["string", "null"] },
          branch: { type: "string" },
          commitSha: { type: "string" },
          commitMessage: { type: ["string", "null"] },
          commitAuthor: { type: ["string", "null"] },
          pullRequestNumber: { type: ["integer", "null"] },
          url: { type: "string" },
          fileCount: { type: ["integer", "null"] },
          totalBytes: { type: ["integer", "null"] },
          buildDurationMs: { type: ["integer", "null"] },
          errorMessage: { type: ["string", "null"] },
          skipReason: { type: ["string", "null"] },
          diagnostics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                severity: { type: "string", enum: ["error", "warning"] },
                file: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          role: { type: "string" },
          company: { type: "string" },
          summary: { type: "string" },
          searchStyle: { type: "string" },
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
          archivedAt: { type: ["string", "null"] },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          memories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                kind: { type: "string", enum: ["background", "experience", "preference", "constraint"] },
                content: { type: "string" },
              },
              required: ["id", "kind", "content"],
            },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          "Script tag that installs notra.js with the public key. Only present when web analytics is enabled for the workspace.",
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
      mentions: { type: "integer" },
      engines: { type: "array", items: { type: "string" } },
      queuedScanId: {
        type: ["string", "null"],
        default: null,
        description:
          "Scan that plays the persona in the tracked consumer apps in the background, or `null`. Poll `GET /v1/projects/{projectId}/geo/scans/{scanId}`.",
      },
      queuedEngines: { type: "array", items: { type: "string" }, default: [] },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          "API-based engines that answered the conversation during this request. Empty when only consumer apps run or none of the API engines answered.",
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      schedule: {
        type: ["object", "null"],
        properties: {
          postId: { type: "string" },
          scheduledAt: { type: "string", format: "date-time" },
          timeZone: { type: "string" },
          publications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                destination: { type: "string", enum: ["notra", "github", "social"] },
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
                      properties: { destination: { type: "string", enum: ["social"] }, accountId: { type: "string" } },
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
                attempts: { type: "integer" },
                errorCode: { type: ["string", "null"] },
                lastError: { type: ["string", "null"] },
                resultUrl: { type: ["string", "null"], description: "Pull request or social post URL once published." },
                publishedAt: { type: ["string", "null"], format: "date-time" },
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
          },
        },
        required: ["postId", "scheduledAt", "timeZone", "publications"],
      },
    },
    required: ["organization", "schedule"],
  },
  sendAgentSessionMessage: { type: "object" },
  startGeoAgentReadinessScan: {
    type: "object",
    properties: {
      reportId: { type: "string" },
      alreadyRunning: {
        type: "boolean",
        description: "True when an in-flight scan for the same URL was reused instead of starting a new one.",
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          kind: { type: "string", enum: ["production", "preview"] },
          previewKey: { type: ["string", "null"] },
          trigger: { type: "string", enum: ["push", "pull_request", "manual", "redeploy", "config", "toolchain"] },
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
          live: { type: "boolean" },
          liveSince: { type: ["string", "null"] },
          branch: { type: "string" },
          commitSha: { type: "string" },
          commitMessage: { type: ["string", "null"] },
          commitAuthor: { type: ["string", "null"] },
          pullRequestNumber: { type: ["integer", "null"] },
          url: { type: "string" },
          fileCount: { type: ["integer", "null"] },
          totalBytes: { type: ["integer", "null"] },
          buildDurationMs: { type: ["integer", "null"] },
          errorMessage: { type: ["string", "null"] },
          skipReason: { type: ["string", "null"] },
          diagnostics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                severity: { type: "string", enum: ["error", "warning"] },
                file: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          projectId: { type: ["string", "null"] },
          source: { type: "string", enum: ["mcp", "api", "sdk"], description: "Channel the feedback arrived through." },
          kind: {
            type: "string",
            enum: ["bug", "feature", "praise", "question", "other"],
            description: "What kind of feedback this is.",
          },
          sentiment: {
            type: ["string", "null"],
            enum: ["negative", "neutral", "positive", null],
            description: "Overall sentiment of the feedback.",
          },
          status: { type: "string", enum: ["new", "triaged", "resolved", "archived"], description: "Triage status." },
          title: { type: ["string", "null"] },
          message: { type: "string" },
          agentClient: { type: ["string", "null"] },
          agentModel: { type: ["string", "null"] },
          toolVersion: { type: ["string", "null"] },
          userAgent: { type: ["string", "null"] },
          contextUrl: { type: ["string", "null"] },
          externalId: { type: ["string", "null"] },
          idempotencyKey: { type: ["string", "null"] },
          metadata: { type: ["object", "null"], additionalProperties: {} },
          resolvedAt: { type: ["string", "null"] },
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
          projectId: { type: ["string", "null"] },
          source: { type: "string", enum: ["mcp", "api", "sdk"], description: "Channel the feedback arrived through." },
          kind: {
            type: "string",
            enum: ["bug", "feature", "praise", "question", "other"],
            description: "What kind of feedback this is.",
          },
          sentiment: {
            type: ["string", "null"],
            enum: ["negative", "neutral", "positive", null],
            description: "Overall sentiment of the feedback.",
          },
          status: { type: "string", enum: ["new", "triaged", "resolved", "archived"], description: "Triage status." },
          title: { type: ["string", "null"] },
          message: { type: "string" },
          agentClient: { type: ["string", "null"] },
          agentModel: { type: ["string", "null"] },
          toolVersion: { type: ["string", "null"] },
          userAgent: { type: ["string", "null"] },
          contextUrl: { type: ["string", "null"] },
          externalId: { type: ["string", "null"] },
          idempotencyKey: { type: ["string", "null"] },
          metadata: { type: ["object", "null"], additionalProperties: {} },
          resolvedAt: { type: ["string", "null"] },
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
      domain: { type: "string" },
      field: { type: ["string", "null"] },
      competitors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            domain: { type: ["string", "null"] },
            description: { type: ["string", "null"] },
            confidence: { type: ["string", "null"], enum: ["high", "medium", null] },
          },
          required: ["name", "domain", "description", "confidence"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      color: {
        type: "object",
        properties: {
          id: { type: "string" },
          role: {
            type: "string",
            enum: ["primary", "secondary", "accent", "background", "foreground", "neutral", "custom"],
          },
          name: { type: ["string", "null"] },
          lightValue: { type: "string" },
          darkValue: { type: ["string", "null"] },
          usage: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      brandIdentity: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          isDefault: { type: "boolean" },
          websiteUrl: { type: "string" },
          companyName: { type: ["string", "null"] },
          companyDescription: { type: ["string", "null"] },
          toneProfile: { type: ["string", "null"] },
          customTone: { type: ["string", "null"] },
          customInstructions: { type: ["string", "null"] },
          audience: { type: ["string", "null"] },
          language: { type: ["string", "null"] },
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
          name: { type: "string" },
          sourceType: { type: "string", enum: ["github_webhook"] },
          sourceConfig: {
            type: "object",
            properties: {
              eventTypes: { type: "array", items: { type: "string", enum: ["release", "push"] }, minItems: 1 },
              includePreReleases: { type: "boolean", default: true },
              ignoreCommitPatterns: {
                type: "array",
                items: { type: "string", minLength: 1, maxLength: 120 },
                maxItems: 10,
                default: [],
              },
            },
            required: ["eventTypes"],
          },
          targets: {
            type: "object",
            properties: { repositoryIds: { type: "array", items: { type: "string", minLength: 1 }, minItems: 1 } },
            required: ["repositoryIds"],
          },
          outputType: { type: "string", enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"] },
          outputConfig: {
            type: ["object", "null"],
            properties: {
              publishDestination: { type: "string", enum: ["webflow", "framer", "custom"] },
              brandVoiceId: { type: "string", minLength: 1 },
              notify: {
                type: "object",
                properties: { slack: { type: "boolean" }, email: { type: "boolean" } },
                required: ["slack", "email"],
              },
            },
          },
          enabled: { type: "boolean" },
          autoPublish: { type: "boolean" },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          projectId: { type: ["string", "null"] },
          source: { type: "string", enum: ["mcp", "api", "sdk"], description: "Channel the feedback arrived through." },
          kind: {
            type: "string",
            enum: ["bug", "feature", "praise", "question", "other"],
            description: "What kind of feedback this is.",
          },
          sentiment: {
            type: ["string", "null"],
            enum: ["negative", "neutral", "positive", null],
            description: "Overall sentiment of the feedback.",
          },
          status: { type: "string", enum: ["new", "triaged", "resolved", "archived"], description: "Triage status." },
          title: { type: ["string", "null"] },
          message: { type: "string" },
          agentClient: { type: ["string", "null"] },
          agentModel: { type: ["string", "null"] },
          toolVersion: { type: ["string", "null"] },
          userAgent: { type: ["string", "null"] },
          contextUrl: { type: ["string", "null"] },
          externalId: { type: ["string", "null"] },
          idempotencyKey: { type: ["string", "null"] },
          metadata: { type: ["object", "null"], additionalProperties: {} },
          resolvedAt: { type: ["string", "null"] },
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
              targetPrompt: { type: "string" },
              intent: { type: "string" },
              contentSubtype: {
                type: "string",
                enum: ["guide", "comparison", "listicle", "how-to", "faq", "alternatives"],
              },
              workingTitle: { type: "string" },
              audience: { type: "string" },
              jobToBeDone: { type: "string" },
              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    heading: { type: "string" },
                    goal: { type: "string" },
                    claims: { type: "array", items: { type: "string" } },
                  },
                  required: ["heading", "goal", "claims"],
                },
              },
              questionsToAnswer: { type: "array", items: { type: "string" } },
              internalLinks: {
                type: "array",
                items: {
                  type: "object",
                  properties: { url: { type: "string" }, anchor: { type: "string" }, why: { type: "string" } },
                  required: ["url", "anchor", "why"],
                },
              },
              acceptanceChecklist: { type: "array", items: { type: "string" } },
              recommendedAngle: { type: "string" },
              competitorsToCounter: { type: "array", items: { type: "string" } },
              sourcesToReference: { type: "array", items: { type: "string" } },
              missingCoverage: { type: "array", items: { type: "string" } },
              baseline: {
                type: ["object", "null"],
                properties: {
                  sourcePromptId: { type: "string" },
                  mentionedEngines: { type: "number" },
                  totalEngines: { type: "number" },
                  engines: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        engine: { type: "string" },
                        mentioned: { type: "boolean" },
                        position: { type: ["number", "null"] },
                      },
                      required: ["engine", "mentioned", "position"],
                    },
                  },
                  competitorMentions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { name: { type: "string" }, engines: { type: "number" } },
                      required: ["name", "engines"],
                    },
                  },
                  citedDomains: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { domain: { type: "string" }, engines: { type: "number" } },
                      required: ["domain", "engines"],
                    },
                  },
                  capturedAt: { type: ["string", "null"] },
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
          },
          status: { type: "string", enum: ["draft", "approved", "writing", "completed", "failed"] },
          autoApproved: { type: "boolean" },
          runId: { type: ["string", "null"] },
          postId: { type: ["string", "null"] },
          humanized: { type: "boolean" },
          error: { type: ["string", "null"] },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          completedAt: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          role: { type: "string" },
          company: { type: "string" },
          summary: { type: "string" },
          searchStyle: { type: "string" },
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
          archivedAt: { type: ["string", "null"] },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          memories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                kind: { type: "string", enum: ["background", "experience", "preference", "constraint"] },
                content: { type: "string" },
              },
              required: ["id", "kind", "content"],
            },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          prompt: { type: "string" },
          enabled: { type: "boolean" },
          source: { type: "string", enum: ["custom", "auto"] },
          tags: { type: "array", items: { type: "string" } },
          createdAt: { type: ["string", "null"] },
        },
        required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          steps: { type: "array", items: { type: "string" } },
          enabled: { type: "boolean" },
          createdAt: { type: "string" },
        },
        required: ["id", "name", "steps", "enabled", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
    },
    required: ["sequence", "organization"],
  },
  updateGeoSettings: {
    type: "object",
    properties: {
      configured: { type: "boolean", description: "Whether the analytics backend is configured." },
      settings: {
        type: ["object", "null"],
        properties: {
          id: { type: "string" },
          organizationId: { type: "string" },
          projectId: { type: "string" },
          companyName: { type: "string" },
          aliases: { type: "array", items: { type: "string" } },
          conversionPaths: { type: "array", items: { type: "string" } },
          domains: { type: "array", items: { type: "string" } },
          competitors: { type: "array", items: { type: "string" } },
          languages: { type: "array", items: { type: "string" } },
          engines: { type: "array", items: { type: "string" } },
          enforceZdr: { type: "boolean" },
          nonZdrApprovedEngines: { type: "array", items: { type: "string" } },
          trackWithoutSearch: { type: "boolean" },
          pausedAutoPromptIds: { type: "array", items: { type: "string" } },
          removedAutoPromptIds: { type: "array", items: { type: "string" } },
          enabled: { type: "boolean" },
          scanIntervalHours: { type: "integer" },
          scanStartedAt: { type: ["string", "null"] },
          lastScanAt: { type: ["string", "null"] },
          isScanning: { type: "boolean" },
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
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
        },
        required: ["id", "slug", "name", "logo"],
      },
      post: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: ["string", "null"] },
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
          recommendations: { type: ["string", "null"] },
          contentType: {
            type: "string",
            enum: ["changelog", "linkedin_post", "twitter_post", "blog_post", "investor_update", "image"],
          },
          sourceMetadata: {},
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
          id: { type: "string" },
          name: { type: "string" },
          brandSettingsId: { type: "string" },
          createdAt: { type: "string" },
        },
        required: ["id", "name", "brandSettingsId", "createdAt"],
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
                    description: "Day of the month for monthly schedules (1-31). Required when frequency is monthly.",
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
                description: "Where auto-published posts are sent.",
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
          enabled: { type: "boolean" },
          autoPublish: { type: "boolean" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          lookbackWindow: {
            type: "string",
            enum: ["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"],
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
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
            id: { type: "string" },
            name: { type: "string" },
            domain: { type: ["string", "null"] },
            synonyms: { type: "array", items: { type: "string" } },
            kind: { type: "string", enum: ["direct", "indirect"] },
            color: { type: ["string", "null"] },
          },
          required: ["id", "name", "domain", "synonyms", "kind", "color"],
        },
      },
      organization: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          name: { type: "string" },
          logo: { type: ["string", "null"] },
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
