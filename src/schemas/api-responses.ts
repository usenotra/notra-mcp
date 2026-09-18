import type { JSONSchema } from "zod/v4/core";

export type ApiOperationId =
  | "approveGeoContentBrief"
  | "createAgentSession"
  | "createBrandIdentity"
  | "createEventTrigger"
  | "createGeoPrompt"
  | "createGeoScan"
  | "createGeoSequence"
  | "createGitHubIntegration"
  | "createPost"
  | "createPostGeneration"
  | "createProject"
  | "createSchedule"
  | "createSkill"
  | "deleteBrandIdentity"
  | "deleteEventTrigger"
  | "deleteGeoCompetitor"
  | "deleteGeoPrompt"
  | "deleteGeoSequence"
  | "deleteIntegration"
  | "deletePost"
  | "deleteProject"
  | "deleteSchedule"
  | "deleteSkill"
  | "getBrandIdentity"
  | "getBrandIdentityGeneration"
  | "getChat"
  | "getChatByExternalChannel"
  | "getEventTrigger"
  | "getFeedback"
  | "getGeoAgentReadiness"
  | "getGeoContentBrief"
  | "getGeoIngestSetup"
  | "getGeoPromptHistory"
  | "getGeoPromptResultDetail"
  | "getGeoScan"
  | "getGeoSentiment"
  | "getGeoSentimentAnalysis"
  | "getGeoSettings"
  | "getGeoTrafficJourney"
  | "getGeoTrafficLog"
  | "getGeoTrafficOverview"
  | "getGeoVisibilityCompetitorDetail"
  | "getGeoVisibilityCompetitorShare"
  | "getGeoVisibilityLanguageShare"
  | "getGeoVisibilityOverview"
  | "getGeoVisibilityPromptResults"
  | "getGeoVisibilityTimeseries"
  | "getPost"
  | "getPostGeneration"
  | "getProject"
  | "getPublicApiStatus"
  | "getSkill"
  | "getWorkspaces"
  | "importGeoCompetitors"
  | "importGeoPrompts"
  | "issueGeoIngestToken"
  | "listAgentChats"
  | "listBrandIdentities"
  | "listChats"
  | "listEventTriggers"
  | "listFeedback"
  | "listGeoChanges"
  | "listGeoCompetitors"
  | "listGeoContentBriefs"
  | "listGeoContentGaps"
  | "listGeoPromptResultSummaries"
  | "listGeoPrompts"
  | "listGeoScans"
  | "listGeoSentimentEvidence"
  | "listGeoSequences"
  | "listGeoShelfSources"
  | "listGeoTrafficJourneys"
  | "listGeoTrafficPages"
  | "listIntegrations"
  | "listPosts"
  | "listProjects"
  | "listSchedules"
  | "listSkills"
  | "patchSkill"
  | "planGeoContentBrief"
  | "rotateGeoIngestToken"
  | "runGeoSequence"
  | "sendAgentSessionMessage"
  | "startGeoAgentReadinessScan"
  | "submitFeedback"
  | "submitOrganizationFeedback"
  | "suggestGeoCompetitors"
  | "updateBrandIdentity"
  | "updateEventTrigger"
  | "updateFeedback"
  | "updateGeoPrompt"
  | "updateGeoSequence"
  | "updateGeoSettings"
  | "updatePost"
  | "updateProject"
  | "updateSchedule"
  | "upsertGeoCompetitor";

export const API_RESPONSE_SCHEMAS: Record<ApiOperationId, JSONSchema.BaseSchema> = {
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
  createAgentSession: {
    type: "object",
    properties: {
      ok: { type: "boolean", enum: [true] },
      sessionId: { type: "string" },
      continuationToken: { type: "string" },
    },
    required: ["ok", "sessionId", "continuationToken"],
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
                items: { type: "string", minLength: 1 },
                minItems: 1,
                description: "GitHub integration IDs to generate from, as returned by GET /v1/integrations.",
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
  deleteSkill: { type: "object", properties: { success: { type: "boolean", enum: [true] } }, required: ["success"] },
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
          reportUrl: { type: ["string", "null"] },
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
          "reportUrl",
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
              reportUrl: { type: ["string", "null"] },
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
              "reportUrl",
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
    required: ["targetUrl", "report", "scan", "history", "organization"],
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
        },
        required: ["next", "nuxt", "netlify", "tanstack"],
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
    required: ["ingestUrl", "snippet", "snippets", "organization"],
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
            paths: { type: "integer" },
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
          "status",
          "createdAt",
          "updatedAt",
        ],
      },
    },
    required: ["organization", "post"],
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
        },
        required: ["next", "nuxt", "netlify", "tanstack"],
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
    },
    required: ["ingestUrl", "snippet", "snippets", "organization", "token"],
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
                    "What to do with this query cluster: create a new page, update the strongest existing page, merge overlapping pages, or ignore thin demand.",
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
      hasScanData: { type: "boolean", description: "False until the project has at least one scan result." },
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
    required: ["promptGaps", "searchGaps", "hasScanData", "organization"],
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
                  items: { type: "string", minLength: 1 },
                  minItems: 1,
                  description: "GitHub integration IDs to generate from, as returned by GET /v1/integrations.",
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
        },
        required: ["next", "nuxt", "netlify", "tanstack"],
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
    },
    required: ["ingestUrl", "snippet", "snippets", "organization", "token"],
  },
  runGeoSequence: {
    type: "object",
    properties: {
      checks: { type: "integer", description: "Recorded answers across every engine that responded." },
      mentions: { type: "integer", description: "How many of those answers mentioned the tracked brand." },
      engines: {
        type: "array",
        items: { type: "string" },
        description: "Engines the conversation was played against.",
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
                items: { type: "string", minLength: 1 },
                minItems: 1,
                description: "GitHub integration IDs to generate from, as returned by GET /v1/integrations.",
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
};
