import type { JSONSchema } from "zod/v4/core";

export type ApiOperationId =
  | "acceptGeoNameCollision"
  | "acceptGeoPromptSuggestion"
  | "addGeoNameCollision"
  | "approveGeoContentBrief"
  | "archiveGeoPersona"
  | "cancelPostSchedule"
  | "claimGeoContent"
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
  | "dismissGeoNameCollision"
  | "dismissGeoPromptSuggestion"
  | "generateGeoPersonas"
  | "getAutopilotStatus"
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
  | "getPricingQuote"
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
  | "listCommentedPosts"
  | "listEventTriggers"
  | "listFeedback"
  | "listGeoAnalyticsImports"
  | "listGeoChanges"
  | "listGeoCompetitors"
  | "listGeoContentBriefs"
  | "listGeoContentGaps"
  | "listGeoEngines"
  | "listGeoNameCollisions"
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
  | "listPostComments"
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
  | "releaseGeoContentClaim"
  | "replyToPostComment"
  | "reportGeoContentAgentFailure"
  | "resolvePostComments"
  | "restoreGeoPersona"
  | "retryWebhookDelivery"
  | "rotateGeoIngestToken"
  | "runGeoPersona"
  | "runGeoSequence"
  | "runSchedule"
  | "schedulePost"
  | "sendAgentSessionMessage"
  | "startAutopilotRun"
  | "startAutopilotWorkflowRun"
  | "startGeoAgentReadinessScan"
  | "startSiteDeployment"
  | "stopAutopilotRun"
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
  acceptGeoNameCollision: {
    type: "object",
    properties: {
      notConfusedWith: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Entry id." },
            name: { type: "string", description: "Name of the other product, usually the same as yours." },
            domain: { type: "string", description: "Domain of the other product, such as `acme.io`." },
            status: {
              type: "string",
              enum: ["pending", "accepted", "dismissed"],
              description:
                "`accepted` entries are applied to mention detection; `pending` ones are suggestions waiting for review.",
            },
            source: {
              type: "string",
              enum: ["manual", "scan"],
              description: "`manual` when added by hand, `scan` when a scan suggested it from cited sources.",
            },
            evidenceUrl: {
              type: ["string", "null"],
              description: "Cited page that made a scan suggest the entry, or `null` for manual entries.",
            },
            createdAt: { type: "string", description: "When the entry was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "name", "domain", "status", "source", "evidenceUrl", "createdAt"],
          description:
            "A different product that shares your brand's name. Answers about it don't count as mentions of you.",
        },
        description:
          "Accepted entries. Answers that name your brand but are about one of these products are not counted as mentions.",
      },
      suggestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Entry id." },
            name: { type: "string", description: "Name of the other product, usually the same as yours." },
            domain: { type: "string", description: "Domain of the other product, such as `acme.io`." },
            status: {
              type: "string",
              enum: ["pending", "accepted", "dismissed"],
              description:
                "`accepted` entries are applied to mention detection; `pending` ones are suggestions waiting for review.",
            },
            source: {
              type: "string",
              enum: ["manual", "scan"],
              description: "`manual` when added by hand, `scan` when a scan suggested it from cited sources.",
            },
            evidenceUrl: {
              type: ["string", "null"],
              description: "Cited page that made a scan suggest the entry, or `null` for manual entries.",
            },
            createdAt: { type: "string", description: "When the entry was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "name", "domain", "status", "source", "evidenceUrl", "createdAt"],
          description:
            "A different product that shares your brand's name. Answers about it don't count as mentions of you.",
        },
        description:
          "Same-named products that scan answers cited on other domains, waiting to be accepted or dismissed.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["notConfusedWith", "suggestions", "organization"],
    description: "The project's not-confused-with list and its suggestions.",
  },
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
          prompt: { type: "string", description: "Question asked to AI engines during scans." },
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
            deprecated: true,
            description: "Deprecated: prompt tags were removed. Always empty; a future API version drops the field.",
          },
          createdAt: {
            type: ["string", "null"],
            description: "When the custom prompt was added. `null` for auto prompts.",
          },
        },
        required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
        description: "A prompt tracked in the project's scans.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["prompt", "organization"],
    description: "The created, updated or accepted prompt and the workspace it belongs to.",
  },
  addGeoNameCollision: {
    type: "object",
    properties: {
      notConfusedWith: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Entry id." },
            name: { type: "string", description: "Name of the other product, usually the same as yours." },
            domain: { type: "string", description: "Domain of the other product, such as `acme.io`." },
            status: {
              type: "string",
              enum: ["pending", "accepted", "dismissed"],
              description:
                "`accepted` entries are applied to mention detection; `pending` ones are suggestions waiting for review.",
            },
            source: {
              type: "string",
              enum: ["manual", "scan"],
              description: "`manual` when added by hand, `scan` when a scan suggested it from cited sources.",
            },
            evidenceUrl: {
              type: ["string", "null"],
              description: "Cited page that made a scan suggest the entry, or `null` for manual entries.",
            },
            createdAt: { type: "string", description: "When the entry was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "name", "domain", "status", "source", "evidenceUrl", "createdAt"],
          description:
            "A different product that shares your brand's name. Answers about it don't count as mentions of you.",
        },
        description:
          "Accepted entries. Answers that name your brand but are about one of these products are not counted as mentions.",
      },
      suggestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Entry id." },
            name: { type: "string", description: "Name of the other product, usually the same as yours." },
            domain: { type: "string", description: "Domain of the other product, such as `acme.io`." },
            status: {
              type: "string",
              enum: ["pending", "accepted", "dismissed"],
              description:
                "`accepted` entries are applied to mention detection; `pending` ones are suggestions waiting for review.",
            },
            source: {
              type: "string",
              enum: ["manual", "scan"],
              description: "`manual` when added by hand, `scan` when a scan suggested it from cited sources.",
            },
            evidenceUrl: {
              type: ["string", "null"],
              description: "Cited page that made a scan suggest the entry, or `null` for manual entries.",
            },
            createdAt: { type: "string", description: "When the entry was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "name", "domain", "status", "source", "evidenceUrl", "createdAt"],
          description:
            "A different product that shares your brand's name. Answers about it don't count as mentions of you.",
        },
        description:
          "Same-named products that scan answers cited on other domains, waiting to be accepted or dismissed.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["notConfusedWith", "suggestions", "organization"],
    description: "The project's not-confused-with list and its suggestions.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["runId", "organization"],
    description: "The writer run started for the approved brief.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["id", "organization"],
    description: "Confirmation of the archived persona and the workspace it belongs to.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      withdrawn: {
        type: ["object", "null"],
        properties: {
          pullRequestNumber: { type: "integer", description: "Number of the pull request that was closed." },
          pullRequestUrl: { type: "string", description: "URL of the pull request that was closed." },
          merged: {
            type: "boolean",
            description:
              "True when the pull request had already been merged, so it stayed merged and could not be withdrawn.",
          },
        },
        required: ["pullRequestNumber", "pullRequestUrl", "merged"],
        description: "The pull request closed because withdraw was true. Null when the post had no open pull request.",
      },
      canceled: { type: "integer", description: "Destinations that were canceled or cleared." },
      inProgress: {
        type: "boolean",
        description: "True when a destination was already publishing; it cannot be stopped and finishes on its own.",
      },
    },
    required: ["organization", "withdrawn", "canceled", "inProgress"],
    description: "Result of canceling the post's schedule.",
  },
  claimGeoContent: {
    type: "object",
    properties: {
      sourceKind: {
        type: "string",
        enum: ["manual", "gap", "prompt", "search_console", "ai_search"],
        description: "Kind of the claimed item. manual means a brief that was not planned from a gap.",
      },
      sourceId: { type: "string", description: "Gap id, or the brief id when sourceKind is manual." },
      agent: { type: "string", description: "Agent holding the claim." },
      expiresAt: { type: "string", description: "ISO timestamp when the claim lapses unless renewed." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["sourceKind", "sourceId", "agent", "expiresAt", "organization"],
  },
  createAgentSession: {
    type: "object",
    properties: {
      ok: { type: "boolean", enum: [true], description: "Always true when the session was created." },
      sessionId: {
        type: "string",
        description: "ID of the agent session, used to send follow-up messages and stream events.",
      },
    },
    required: ["ok", "sessionId"],
    description: "The newly started agent session.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      color: {
        type: "object",
        properties: {
          id: { type: "string", description: "Pass as colorId to update or delete the color." },
          role: {
            type: "string",
            enum: ["primary", "secondary", "accent", "background", "foreground", "neutral", "custom"],
            description: "Role of the color in the palette. custom is for colors outside the standard roles.",
          },
          name: { type: ["string", "null"], description: "Display name of the color, or null when not set." },
          lightValue: { type: "string", description: "Hex color for light mode." },
          darkValue: {
            type: ["string", "null"],
            description: "Hex color for dark mode. Null when the color has no dark variant.",
          },
          usage: { type: ["string", "null"], description: "Free-text note on where the color should be used." },
        },
        required: ["id", "role", "name", "lightValue", "darkValue", "usage"],
        description: "A color in a brand identity's palette.",
      },
    },
    required: ["organization", "color"],
    description: "The created or updated brand color.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      job: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "ID of the job, which you poll with GET /v1/brand-identities/generate/{jobId}.",
          },
          organizationId: { type: "string", description: "Workspace the job runs in." },
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
          totalSteps: { type: "integer", minimum: 1, description: "Number of steps the analysis takes." },
          workflowRunId: {
            type: ["string", "null"],
            description: "Internal workflow run ID. Null until the analysis workflow has started.",
          },
          error: { type: ["string", "null"], description: "Failure reason when status is failed." },
          createdAt: { type: "string", description: "When the job was queued, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the job last changed, as an ISO 8601 timestamp." },
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
        description: "Website analysis job that fills in a brand identity's details.",
      },
    },
    required: ["organization", "job"],
    description:
      "The queued analysis job for the new brand identity, which you poll until its status is completed or failed.",
  },
  createEventTrigger: {
    type: "object",
    properties: {
      eventTrigger: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The event trigger's ID, used as triggerId in /v1/event-triggers/{triggerId}.",
          },
          organizationId: { type: "string", description: "ID of the organization that owns the trigger." },
          name: {
            type: "string",
            description:
              'Event triggers cannot be named through the API or the dashboard, so this is the default "Untitled Schedule".',
          },
          sourceType: {
            type: "string",
            enum: ["github_webhook"],
            description: "Always github_webhook for event triggers.",
          },
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
            description: "Which GitHub events start a run.",
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
            description: "Repositories the trigger listens to.",
          },
          outputType: {
            type: "string",
            enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"],
            description: "Type of content each run generates.",
          },
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
                properties: {
                  slack: {
                    type: "boolean",
                    description: "Post to the organization's Slack notification channel after a successful run.",
                  },
                  email: { type: "boolean", description: "Email the workspace owners after a successful run." },
                },
                required: ["slack", "email"],
                description:
                  "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
              },
            },
            description:
              "Writing and notification settings for generated content, or null or absent when none are set.",
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
          createdAt: { type: "string", description: "When the trigger was created, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the trigger was last changed, as an ISO 8601 timestamp." },
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
        description: "An automation that generates content when GitHub events arrive.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["eventTrigger", "organization"],
    description: "The event trigger.",
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
          prompt: { type: "string", description: "Question asked to AI engines during scans." },
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
            deprecated: true,
            description: "Deprecated: prompt tags were removed. Always empty; a future API version drops the field.",
          },
          createdAt: {
            type: ["string", "null"],
            description: "When the custom prompt was added. `null` for auto prompts.",
          },
        },
        required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
        description: "A prompt tracked in the project's scans.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["prompt", "organization"],
    description: "The created, updated or accepted prompt and the workspace it belongs to.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["scanId", "statusUrl", "organization"],
    description: "The queued scan and where to poll its progress.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["scanId", "statusUrl", "organization"],
    description: "The queued scan and where to poll its progress.",
  },
  createGeoSequence: {
    type: "object",
    properties: {
      sequence: {
        type: "object",
        properties: {
          id: { type: "string", description: "Sequence id for the update, delete and run endpoints." },
          name: { type: "string", description: "Display name of the sequence." },
          steps: {
            type: "array",
            items: { type: "string" },
            description: "Messages sent in order as one conversation with each engine.",
          },
          enabled: { type: "boolean", description: "Whether project scans play this conversation." },
          createdAt: { type: "string", description: "When the sequence was created, as an ISO 8601 timestamp." },
        },
        required: ["id", "name", "steps", "enabled", "createdAt"],
        description: "A multi-turn conversation played against each engine in project scans.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["sequence", "organization"],
    description: "The created or updated sequence and the workspace it belongs to.",
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
        description: "A GitHub repository connected to Notra.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["github", "organization"],
    description: "The newly connected GitHub repository.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      post: {
        type: "object",
        properties: {
          id: { type: "string", description: "ID of the post, used as postId in the /v1/posts endpoints." },
          title: { type: "string", description: "Post title." },
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
            description:
              "Kind of content. image posts hold a rendered image instead of text; only blog_post and changelog have a slug and metadata.",
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
              tags: {
                type: "array",
                items: { type: "string" },
                description: "Post tags in display order, or empty when none are set.",
              },
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
                    id: {
                      type: "string",
                      description:
                        "Author ID from GET /v1/posts/authors, or a site:<id> ref for an author from the post's Notra Sites site.",
                    },
                    slug: {
                      type: "string",
                      description: "Stable author handle; hosted sites list the author's posts at /author/{slug}.",
                    },
                    name: { type: "string", description: "Author's display name." },
                    title: {
                      type: ["string", "null"],
                      description: "Job title shown next to the name, or null when not set.",
                    },
                    avatarUrl: { type: ["string", "null"], description: "Avatar image URL, or null when not set." },
                    url: { type: ["string", "null"], description: "Author's website." },
                    x: { type: ["string", "null"], description: "X profile URL, or null when not set." },
                    linkedin: { type: ["string", "null"], description: "LinkedIn profile URL, or null when not set." },
                    github: { type: ["string", "null"], description: "GitHub profile URL, or null when not set." },
                    youtube: { type: ["string", "null"], description: "YouTube channel URL, or null when not set." },
                    bluesky: { type: ["string", "null"], description: "Bluesky profile URL, or null when not set." },
                    mastodon: { type: ["string", "null"], description: "Mastodon profile URL, or null when not set." },
                    threads: { type: ["string", "null"], description: "Threads profile URL, or null when not set." },
                    instagram: {
                      type: ["string", "null"],
                      description: "Instagram profile URL, or null when not set.",
                    },
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
          status: {
            type: "string",
            enum: ["draft", "published"],
            description:
              "Publishing state of the post in Notra, where GET /v1/posts only returns published posts unless its status filter includes draft.",
          },
          createdAt: { type: "string", description: "When the post was created, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the post was last changed, as an ISO 8601 timestamp." },
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
        description: "The created post.",
      },
    },
    required: ["organization", "post"],
    description: "The newly created post.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      job: {
        type: "object",
        properties: {
          id: { type: "string", description: "ID of the job, which you poll with GET /v1/posts/generate/{jobId}." },
          organizationId: { type: "string", description: "Workspace the job runs in." },
          status: {
            type: "string",
            enum: ["queued", "running", "completed", "failed", "skipped"],
            description: "Job state. Terminal states are completed, failed, and skipped.",
          },
          contentType: {
            type: "string",
            enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"],
            description: "Type of content being generated.",
          },
          lookbackWindow: {
            type: "string",
            enum: ["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"],
            description: "How far back source activity is collected.",
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
          createdAt: { type: "string", description: "When the job was queued, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the job last changed, as an ISO 8601 timestamp." },
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
        description: "Asynchronous post generation job.",
      },
    },
    required: ["organization", "job"],
    description: "The queued generation job, which you poll until its status is completed, failed or skipped.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      pullRequest: {
        type: "object",
        properties: {
          number: { type: "integer", exclusiveMinimum: 0, description: "Pull request number on GitHub." },
          url: { type: "string", format: "uri", description: "Pull request URL on GitHub." },
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
        description: "The draft pull request holding the post.",
      },
    },
    required: ["organization", "pullRequest"],
    description: "The pull request that adds the post to the repository.",
  },
  createProject: {
    type: "object",
    properties: {
      project: {
        type: "object",
        properties: {
          id: { type: "string", description: "Use as projectId in the endpoints under /v1/projects/{projectId}." },
          name: { type: "string", description: "Project display name." },
          brandSettingsId: {
            type: "string",
            description: "ID of the brand identity linked to the project, as listed by GET /v1/brand-identities.",
          },
          createdAt: { type: "string", description: "When the project was created, as an ISO 8601 timestamp." },
        },
        required: ["id", "name", "brandSettingsId", "createdAt"],
        description: "A GEO project tracking one brand identity.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["project", "organization"],
    description: "The GEO project and the workspace it belongs to.",
  },
  createSchedule: {
    type: "object",
    properties: {
      schedule: {
        type: "object",
        properties: {
          id: { type: "string", description: "The schedule's ID, used as scheduleId in /v1/schedules/{scheduleId}." },
          organizationId: { type: "string", description: "ID of the organization that owns the schedule." },
          name: { type: "string", description: "Display name shown in the dashboard." },
          sourceType: { type: "string", enum: ["cron"], description: "Always cron for schedules." },
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
                description: "When the schedule runs, in UTC.",
              },
            },
            required: ["cron"],
            description: "Timing settings for the schedule.",
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
            description: "Data sources each run reads from.",
          },
          outputType: {
            type: "string",
            enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"],
            description: "Type of content each run generates.",
          },
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
                properties: {
                  slack: {
                    type: "boolean",
                    description: "Post to the organization's Slack notification channel after a successful run.",
                  },
                  email: { type: "boolean", description: "Email the workspace owners after a successful run." },
                },
                required: ["slack", "email"],
                description:
                  "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
              },
            },
            description:
              "Writing and notification settings for generated content, or null or absent when none are set.",
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
          createdAt: { type: "string", description: "When the schedule was created, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the schedule was last changed, as an ISO 8601 timestamp." },
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
        description: "A recurring automation that generates content on a cron schedule.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["schedule", "organization"],
    description: "The schedule as saved.",
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
              live: {
                type: "boolean",
                description:
                  "The preview is being served and has not expired. During a rebuild this is the previous build.",
              },
              latestLive: {
                type: "boolean",
                description:
                  "The latest build is the one being served: the url shows the saved post. Share the link once this is true.",
              },
              deleting: { type: "boolean", description: "The preview is being removed." },
              errorMessage: { type: ["string", "null"], description: "Why the latest build failed or stopped." },
              expiresAt: { type: "string", description: "When the preview stops being served." },
              lifetime: {
                type: "string",
                enum: ["1h", "1d", "3d", "7d"],
                description:
                  "How long the preview stays open after each build; rebuilds keep it unless a new one is passed.",
              },
              hasPassword: {
                type: "boolean",
                description: "People outside the workspace can open it with a password.",
              },
              url: { type: "string", description: "The post's page on the preview." },
            },
            required: [
              "status",
              "live",
              "latestLive",
              "deleting",
              "errorMessage",
              "expiresAt",
              "lifetime",
              "hasPassword",
              "url",
            ],
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["preview", "organization"],
    description: "The post's private preview on the Site.",
  },
  createSkill: {
    type: "object",
    properties: {
      skill: {
        allOf: [
          {
            type: "object",
            properties: {
              id: { type: "string", description: "The skill's ID." },
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
              updatedAt: { type: "string", description: "When the skill was last changed, as an ISO 8601 timestamp." },
            },
            required: ["id", "name", "description", "isSystem", "updatedAt"],
            description: "A skill without its instructions.",
          },
          {
            type: "object",
            properties: {
              content: { type: "string", description: "Full skill instructions, typically Markdown." },
              createdAt: { type: "string", description: "When the skill was created, as an ISO 8601 timestamp." },
            },
            required: ["content", "createdAt"],
          },
        ],
        description: "A reusable set of instructions for Notra's AI agents.",
      },
    },
    required: ["skill"],
    description: "The skill that was created.",
  },
  createWebhookEndpoint: {
    type: "object",
    properties: {
      endpoint: {
        type: "object",
        properties: {
          id: { type: "string", description: "The endpoint's ID, used as endpointId in endpoint routes." },
          organizationId: { type: "string", description: "ID of the organization that owns the endpoint." },
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
          createdAt: { type: "string", description: "When the endpoint was created, as an ISO 8601 timestamp." },
        },
        required: ["id", "organizationId", "url", "events", "enabled", "createdAt"],
        description: "The endpoint that was created.",
      },
      secret: {
        type: "string",
        description:
          "Signing secret, starting with whsec_. Returned only here; use it to verify the x-notra-signature header on each request.",
      },
    },
    required: ["endpoint", "secret"],
    description: "The new webhook endpoint and its signing secret.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      id: { type: "string", description: "ID of the deleted color." },
    },
    required: ["organization", "id"],
    description: "Confirmation that the brand color was deleted.",
  },
  deleteBrandIdentity: {
    type: "object",
    properties: {
      id: { type: "string", description: "ID of the deleted brand identity." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
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
    description: "The deleted brand identity and the automations that were disabled because they used it.",
  },
  deleteEventTrigger: {
    type: "object",
    properties: {
      id: { type: "string", description: "ID of the deleted event trigger." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["id", "organization"],
    description: "Confirms which event trigger was deleted.",
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
          description: "A competitor tracked in AI answers.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["competitors", "organization"],
    description: "The project's tracked competitors and the workspace they belong to.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["id", "organization"],
    description: "Confirmation of the deleted prompt and the workspace it belonged to.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["id", "organization"],
    description: "Confirmation of the deleted sequence and the workspace it belonged to.",
  },
  deleteIntegration: {
    type: "object",
    properties: {
      id: { type: "string", description: "ID of the deleted integration." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
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
    description: "The deleted integration and the automations that were disabled because they used it.",
  },
  deletePost: {
    type: "object",
    properties: {
      id: { type: "string", description: "ID of the deleted post." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["id", "organization"],
    description: "Confirmation that the post was deleted.",
  },
  deleteProject: {
    type: "object",
    properties: {
      id: { type: "string", description: "Id of the deleted project." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["id", "organization"],
    description: "Confirmation of the deleted GEO project and the workspace it belonged to.",
  },
  deleteSchedule: {
    type: "object",
    properties: {
      id: { type: "string", description: "ID of the deleted schedule." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["id", "organization"],
    description: "Confirms which schedule was deleted.",
  },
  deleteSiteAuthor: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: {
          id: { type: "string", description: "The Site's ID." },
          name: { type: "string", description: "Display name of the Site." },
        },
        required: ["id", "name"],
        description: "The Site the request applied to.",
      },
      authors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "The author's id in blog.json. Posts name the author with it and its author page lives at {blogMount}/author/{id}.",
            },
            ref: {
              type: "string",
              description:
                "Pass this in metadata.authorIds of PATCH /v1/posts/{postId} to credit the author on a blog post that publishes to this site.",
            },
            name: { type: "string", description: "The author's display name." },
            title: { type: ["string", "null"], description: "The author's role or job title, or null when not set." },
            bio: {
              type: ["string", "null"],
              description: "Short biography shown on the author page, or null when not set.",
            },
            avatar: {
              type: ["string", "null"],
              description: "As written in blog.json: a site path such as /images/jane.png or an https URL.",
            },
            avatarUrl: { type: ["string", "null"], description: "The avatar as a full URL on the live site." },
            url: {
              type: ["string", "null"],
              description: "The author's personal website as an https URL, or null when not set.",
            },
            x: { type: ["string", "null"], description: "The author's X profile URL, or null when not set." },
            linkedin: {
              type: ["string", "null"],
              description: "The author's LinkedIn profile URL, or null when not set.",
            },
            github: { type: ["string", "null"], description: "The author's GitHub profile URL, or null when not set." },
            youtube: {
              type: ["string", "null"],
              description: "The author's YouTube channel URL, or null when not set.",
            },
            bluesky: {
              type: ["string", "null"],
              description: "The author's Bluesky profile URL, or null when not set.",
            },
            mastodon: {
              type: ["string", "null"],
              description: "The author's Mastodon profile URL, or null when not set.",
            },
            threads: {
              type: ["string", "null"],
              description: "The author's Threads profile URL, or null when not set.",
            },
            instagram: {
              type: ["string", "null"],
              description: "The author's Instagram profile URL, or null when not set.",
            },
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
    description:
      "The Site's authors and author page layout in blog.json after the request, including unpublished changes.",
  },
  deleteSkill: {
    type: "object",
    properties: { success: { type: "boolean", enum: [true], description: "Always true when the skill was deleted." } },
    required: ["success"],
    description: "Confirms the skill was deleted.",
  },
  deleteWebhookEndpoint: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "ID of the endpoint that was deleted or the delivery that was queued for retry.",
      },
    },
    required: ["id"],
    description: "Confirms which resource the request acted on.",
  },
  dismissGeoNameCollision: {
    type: "object",
    properties: {
      notConfusedWith: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Entry id." },
            name: { type: "string", description: "Name of the other product, usually the same as yours." },
            domain: { type: "string", description: "Domain of the other product, such as `acme.io`." },
            status: {
              type: "string",
              enum: ["pending", "accepted", "dismissed"],
              description:
                "`accepted` entries are applied to mention detection; `pending` ones are suggestions waiting for review.",
            },
            source: {
              type: "string",
              enum: ["manual", "scan"],
              description: "`manual` when added by hand, `scan` when a scan suggested it from cited sources.",
            },
            evidenceUrl: {
              type: ["string", "null"],
              description: "Cited page that made a scan suggest the entry, or `null` for manual entries.",
            },
            createdAt: { type: "string", description: "When the entry was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "name", "domain", "status", "source", "evidenceUrl", "createdAt"],
          description:
            "A different product that shares your brand's name. Answers about it don't count as mentions of you.",
        },
        description:
          "Accepted entries. Answers that name your brand but are about one of these products are not counted as mentions.",
      },
      suggestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Entry id." },
            name: { type: "string", description: "Name of the other product, usually the same as yours." },
            domain: { type: "string", description: "Domain of the other product, such as `acme.io`." },
            status: {
              type: "string",
              enum: ["pending", "accepted", "dismissed"],
              description:
                "`accepted` entries are applied to mention detection; `pending` ones are suggestions waiting for review.",
            },
            source: {
              type: "string",
              enum: ["manual", "scan"],
              description: "`manual` when added by hand, `scan` when a scan suggested it from cited sources.",
            },
            evidenceUrl: {
              type: ["string", "null"],
              description: "Cited page that made a scan suggest the entry, or `null` for manual entries.",
            },
            createdAt: { type: "string", description: "When the entry was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "name", "domain", "status", "source", "evidenceUrl", "createdAt"],
          description:
            "A different product that shares your brand's name. Answers about it don't count as mentions of you.",
        },
        description:
          "Same-named products that scan answers cited on other domains, waiting to be accepted or dismissed.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["notConfusedWith", "suggestions", "organization"],
    description: "The project's not-confused-with list and its suggestions.",
  },
  dismissGeoPromptSuggestion: {
    type: "object",
    properties: {
      id: { type: "string", description: "Id of the dismissed suggestion." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["id", "dismissed", "organization"],
    description: "Confirmation of the dismissed suggestion and the workspace it belongs to.",
  },
  generateGeoPersonas: {
    type: "object",
    properties: {
      job: {
        type: ["object", "null"],
        properties: {
          id: { type: "string", description: "Generation job id." },
          status: {
            type: "string",
            enum: ["queued", "running", "completed", "failed"],
            description: "State of the job, which you poll until it is `completed` or `failed`.",
          },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["job", "organization"],
    description: "The project's persona generation job and the workspace it belongs to.",
  },
  getAutopilotStatus: {
    type: "object",
    properties: {
      canManage: { type: "boolean" },
      settings: {
        type: ["object", "null"],
        properties: {
          enabled: { type: "boolean" },
          dailyBrief: { type: "boolean" },
          briefHour: { type: "integer" },
          timezone: { type: "string" },
          jobs: { type: "object", additionalProperties: { type: "boolean" } },
          repository: { type: ["string", "null"] },
          slackChannelName: { type: ["string", "null"] },
          reviewers: { type: "array", items: { type: "string" } },
          lastRunAt: { type: ["string", "null"], format: "date-time" },
        },
        required: [
          "enabled",
          "dailyBrief",
          "briefHour",
          "timezone",
          "jobs",
          "repository",
          "slackChannelName",
          "reviewers",
          "lastRunAt",
        ],
      },
      activeRuns: {
        type: "array",
        items: {
          oneOf: [
            {
              type: "object",
              properties: {
                runId: { type: "string" },
                type: { type: "string", enum: ["autopilot"] },
                trigger: { type: "string", enum: ["manual", "cron", "onboarding", "github", "suggestion"] },
                workflowKey: { type: ["string", "null"] },
                startedAt: { type: "string", format: "date-time" },
              },
              required: ["runId", "type", "trigger", "workflowKey", "startedAt"],
            },
            {
              type: "object",
              properties: {
                runId: { type: "string" },
                type: { type: "string", enum: ["custom_workflow"] },
                workflowId: { type: ["string", "null"] },
                status: { type: "string", enum: ["queued", "running"] },
              },
              required: ["runId", "type", "workflowId", "status"],
            },
          ],
        },
      },
      workflows: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            enabled: { type: "boolean" },
            schedule: {
              type: ["object", "null"],
              properties: {
                frequency: { type: "string", enum: ["daily", "weekly", "monthly"] },
                hour: { type: "integer" },
                minute: { type: "integer" },
                dayOfWeek: { type: "integer" },
                dayOfMonth: { type: "integer" },
              },
              required: ["frequency", "hour", "minute"],
            },
            lastRunAt: { type: ["string", "null"], format: "date-time" },
          },
          required: ["id", "name", "enabled", "schedule", "lastRunAt"],
        },
      },
      openFindings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            kind: { type: "string" },
            title: { type: "string" },
            status: { type: "string", enum: ["suggested", "open", "proposed"] },
            pullRequestUrl: { type: ["string", "null"] },
          },
          required: ["id", "kind", "title", "status", "pullRequestUrl"],
        },
      },
      rules: {
        type: "array",
        items: {
          type: "object",
          properties: { id: { type: "string" }, text: { type: "string" } },
          required: ["id", "text"],
        },
      },
    },
    required: ["canManage", "settings", "activeRuns", "workflows", "openFindings", "rules"],
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
          name: { type: "string", description: "Display name, unique within the organization." },
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
          createdAt: { type: "string", description: "When the brand identity was created, as an ISO 8601 timestamp." },
          updatedAt: {
            type: "string",
            description: "When the brand identity was last changed, as an ISO 8601 timestamp.",
          },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["brandIdentity", "organization"],
    description: "The requested brand identity, or null when it does not exist.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      job: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "ID of the job, which you poll with GET /v1/brand-identities/generate/{jobId}.",
          },
          organizationId: { type: "string", description: "Workspace the job runs in." },
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
          totalSteps: { type: "integer", minimum: 1, description: "Number of steps the analysis takes." },
          workflowRunId: {
            type: ["string", "null"],
            description: "Internal workflow run ID. Null until the analysis workflow has started.",
          },
          error: { type: ["string", "null"], description: "Failure reason when status is failed." },
          createdAt: { type: "string", description: "When the job was queued, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the job last changed, as an ISO 8601 timestamp." },
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
        description: "Website analysis job that fills in a brand identity's details.",
      },
    },
    required: ["organization", "job"],
    description: "Current state of the brand analysis job.",
  },
  getChat: {
    type: "object",
    properties: {
      chat: {
        type: "object",
        properties: {
          chatId: { type: "string", description: "The chat's ID, used as chatId in /v1/chats/{chatId}." },
          title: {
            type: "string",
            description: 'Title of the chat, written from its first user message, or "New chat" before there is one.',
          },
          createdAt: { type: "string", description: "When the chat was created, as an ISO 8601 timestamp." },
          updatedAt: {
            type: "string",
            description: "When the chat last changed, such as a new message, as an ISO 8601 timestamp.",
          },
          pinnedAt: {
            type: ["string", "null"],
            description: "When the chat was pinned, as an ISO 8601 timestamp, or null when it isn't pinned.",
          },
          externalChannelId: {
            type: ["object", "null"],
            properties: {
              source: {
                type: "string",
                enum: ["discord", "slack", "dashboard", "agent"],
                description:
                  "Where the chat is linked, which is a Discord or Slack channel, a dashboard id or an agent.",
              },
              id: {
                type: "string",
                maxLength: 200,
                description:
                  "Channel ID on that platform or the id the chat was tagged with, which is always set for discord and slack and optional for other sources.",
              },
            },
            required: ["source"],
            description: "The external channel the chat is linked to, or null or absent when it isn't linked.",
          },
        },
        required: ["chatId", "title", "createdAt", "updatedAt", "pinnedAt"],
        description: "A chat session without its messages.",
      },
      messages: {
        type: "array",
        items: {},
        description: "The full conversation in AI SDK UI message format, oldest first.",
      },
    },
    required: ["chat", "messages"],
    description: "A chat session with its full message history.",
  },
  getChatByExternalChannel: {
    type: "object",
    properties: {
      chatId: { type: "string", description: "The chat's ID, used as chatId in /v1/chats/{chatId}." },
      title: {
        type: "string",
        description: 'Title of the chat, written from its first user message, or "New chat" before there is one.',
      },
      createdAt: { type: "string", description: "When the chat was created, as an ISO 8601 timestamp." },
      updatedAt: {
        type: "string",
        description: "When the chat last changed, such as a new message, as an ISO 8601 timestamp.",
      },
      pinnedAt: {
        type: ["string", "null"],
        description: "When the chat was pinned, as an ISO 8601 timestamp, or null when it isn't pinned.",
      },
      externalChannelId: {
        type: ["object", "null"],
        properties: {
          source: {
            type: "string",
            enum: ["discord", "slack", "dashboard", "agent"],
            description: "Where the chat is linked, which is a Discord or Slack channel, a dashboard id or an agent.",
          },
          id: {
            type: "string",
            maxLength: 200,
            description:
              "Channel ID on that platform or the id the chat was tagged with, which is always set for discord and slack and optional for other sources.",
          },
        },
        required: ["source"],
        description: "The external channel the chat is linked to, or null or absent when it isn't linked.",
      },
    },
    required: ["chatId", "title", "createdAt", "updatedAt", "pinnedAt"],
    description: "A chat session without its messages.",
  },
  getEventTrigger: {
    type: "object",
    properties: {
      eventTrigger: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The event trigger's ID, used as triggerId in /v1/event-triggers/{triggerId}.",
          },
          organizationId: { type: "string", description: "ID of the organization that owns the trigger." },
          name: {
            type: "string",
            description:
              'Event triggers cannot be named through the API or the dashboard, so this is the default "Untitled Schedule".',
          },
          sourceType: {
            type: "string",
            enum: ["github_webhook"],
            description: "Always github_webhook for event triggers.",
          },
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
            description: "Which GitHub events start a run.",
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
            description: "Repositories the trigger listens to.",
          },
          outputType: {
            type: "string",
            enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"],
            description: "Type of content each run generates.",
          },
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
                properties: {
                  slack: {
                    type: "boolean",
                    description: "Post to the organization's Slack notification channel after a successful run.",
                  },
                  email: { type: "boolean", description: "Email the workspace owners after a successful run." },
                },
                required: ["slack", "email"],
                description:
                  "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
              },
            },
            description:
              "Writing and notification settings for generated content, or null or absent when none are set.",
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
          createdAt: { type: "string", description: "When the trigger was created, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the trigger was last changed, as an ISO 8601 timestamp." },
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
        description: "An automation that generates content when GitHub events arrive.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["eventTrigger", "organization"],
    description: "The event trigger.",
  },
  getFeedback: {
    type: "object",
    properties: {
      feedback: {
        type: "object",
        properties: {
          id: { type: "string", description: "The feedback's ID, used as feedbackId in /v1/feedback/{feedbackId}." },
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
          message: { type: "string", description: "The feedback itself." },
          agentClient: {
            type: ["string", "null"],
            description: "The agent or client that submitted the feedback, or null when not given.",
          },
          agentModel: { type: ["string", "null"], description: "Model the agent ran on, or null when not given." },
          toolVersion: {
            type: ["string", "null"],
            description: "Version of the tool or client that submitted it, or null when not given.",
          },
          userAgent: {
            type: ["string", "null"],
            description:
              "User agent as submitted, falling back to the request's User-Agent header, or null when neither was present.",
          },
          contextUrl: {
            type: ["string", "null"],
            description: "Page or resource the feedback is about, or null when not given.",
          },
          externalId: {
            type: ["string", "null"],
            description: "The submitter's own identifier for the user or session, or null when not given.",
          },
          idempotencyKey: {
            type: ["string", "null"],
            description: "Idempotency key sent with the submission, or null when none was sent.",
          },
          metadata: {
            type: ["object", "null"],
            additionalProperties: {},
            description: "JSON submitted with the feedback, or null.",
          },
          resolvedAt: {
            type: ["string", "null"],
            description: "When the status was last set to resolved. Cleared when it changes to another status.",
          },
          createdAt: { type: "string", description: "When the feedback was submitted, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the feedback last changed, as an ISO 8601 timestamp." },
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
        description: "A piece of feedback submitted by an agent, app or person.",
      },
    },
    required: ["feedback"],
    description: "The feedback item.",
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
          id: { type: "string", description: "Report id." },
          status: {
            type: "string",
            enum: ["running", "completed", "failed"],
            description: "Scan state of this report.",
          },
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
                description: "Points and checks in the essential tier.",
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
                description: "Points and checks in the recommended tier.",
              },
              bonus: {
                type: "object",
                properties: {
                  points: { type: "number", description: "Extra score points earned from bonus signals." },
                  positiveSignals: { type: "number", description: "Number of bonus signals detected." },
                },
                required: ["points", "positiveSignals"],
                description: "Bonus signals that add points on top of the tiers.",
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
                name: { type: "string", description: "Human-readable check name." },
                tier: {
                  type: "string",
                  enum: ["essential", "recommended", "bonus"],
                  description: "Score tier the scanner assigns the check to.",
                },
                result: {
                  type: "string",
                  enum: ["failed", "partial"],
                  description: "A failed check did not pass, and a partial check only partly passed.",
                },
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
          createdAt: { type: "string", description: "ISO timestamp when the scan was requested." },
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
        description:
          "One agent readiness scan of the project's website. As `report` it is the latest completed scan; as `scan` it is a newer run that is still running or failed. Either is null when there is none.",
      },
      scan: {
        type: ["object", "null"],
        properties: {
          id: { type: "string", description: "Report id." },
          status: {
            type: "string",
            enum: ["running", "completed", "failed"],
            description: "Scan state of this report.",
          },
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
                description: "Points and checks in the essential tier.",
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
                description: "Points and checks in the recommended tier.",
              },
              bonus: {
                type: "object",
                properties: {
                  points: { type: "number", description: "Extra score points earned from bonus signals." },
                  positiveSignals: { type: "number", description: "Number of bonus signals detected." },
                },
                required: ["points", "positiveSignals"],
                description: "Bonus signals that add points on top of the tiers.",
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
                name: { type: "string", description: "Human-readable check name." },
                tier: {
                  type: "string",
                  enum: ["essential", "recommended", "bonus"],
                  description: "Score tier the scanner assigns the check to.",
                },
                result: {
                  type: "string",
                  enum: ["failed", "partial"],
                  description: "A failed check did not pass, and a partial check only partly passed.",
                },
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
          createdAt: { type: "string", description: "ISO timestamp when the scan was requested." },
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
        description:
          "One agent readiness scan of the project's website. As `report` it is the latest completed scan; as `scan` it is a newer run that is still running or failed. Either is null when there is none.",
      },
      history: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Report id." },
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
                id: {
                  type: "string",
                  description: "Stable check identifier, used to match the same check across scans.",
                },
                name: { type: "string", description: "Human-readable check name." },
                tier: {
                  type: "string",
                  enum: ["essential", "recommended", "bonus"],
                  description: "Score tier the scanner assigns the check to.",
                },
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
                id: {
                  type: "string",
                  description: "Stable check identifier, used to match the same check across scans.",
                },
                name: { type: "string", description: "Human-readable check name." },
                tier: {
                  type: "string",
                  enum: ["essential", "recommended", "bonus"],
                  description: "Score tier the scanner assigns the check to.",
                },
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
                id: {
                  type: "string",
                  description: "Stable check identifier, used to match the same check across scans.",
                },
                name: { type: "string", description: "Human-readable check name." },
                tier: {
                  type: "string",
                  enum: ["essential", "recommended", "bonus"],
                  description: "Score tier the scanner assigns the check to.",
                },
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
                id: {
                  type: "string",
                  description: "Stable check identifier, used to match the same check across scans.",
                },
                name: { type: "string", description: "Human-readable check name." },
                tier: {
                  type: "string",
                  enum: ["essential", "recommended", "bonus"],
                  description: "Score tier the scanner assigns the check to.",
                },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["targetUrl", "report", "scan", "history", "comparison", "organization"],
    description:
      "The project's agent readiness reports, with the latest result, any running scan, the score history and the checks that changed.",
  },
  getGeoContentBrief: {
    type: "object",
    properties: {
      brief: {
        type: "object",
        properties: {
          id: { type: "string", description: "Brief id for the brief endpoints." },
          topic: {
            type: "string",
            description:
              "What the article targets, which is the source prompt when the brief was planned from a gap, prompt or Search Console suggestion.",
          },
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
                        engine: { type: "string", description: "Engine id." },
                        mentioned: { type: "boolean", description: "Whether the answer mentioned the brand." },
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
                      properties: {
                        name: { type: "string", description: "Competitor name." },
                        engines: { type: "number", description: "Engines whose answer named this competitor." },
                      },
                      required: ["name", "engines"],
                    },
                    description: "Competitors named in the answers, with the number of engines naming each.",
                  },
                  citedDomains: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        domain: { type: "string", description: "Cited domain." },
                        engines: { type: "number", description: "Engines whose answer cited this domain." },
                      },
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
          status: {
            type: "string",
            enum: ["draft", "approved", "writing", "completed", "failed"],
            description:
              "`draft` until approved, `approved` or `writing` while the writer drafts the post, `completed` once the draft post is written, `failed` when the last writer run failed.",
          },
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
          createdAt: { type: "string", description: "When the brief was planned, as an ISO 8601 timestamp." },
          updatedAt: {
            type: "string",
            description: "Pass as expectedUpdatedAt to updateGeoContentBrief to avoid overwriting newer changes.",
          },
          completedAt: {
            type: ["string", "null"],
            description:
              "ISO timestamp of when the last writer run finished or failed. Null while writing or before approval.",
          },
          claim: {
            type: ["object", "null"],
            properties: {
              agent: { type: "string", description: "Name of the agent writing the article." },
              expiresAt: { type: "string", description: "ISO timestamp when the claim lapses unless renewed." },
            },
            required: ["agent", "expiresAt"],
            description:
              "Set while an agent holds a claim on it with claimGeoContent. Notra's writer and Autopilot leave it alone until the claim is released or expires. Null when unclaimed.",
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
        description: "A content brief with its article plan and writer state.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["brief", "organization"],
    description: "The content brief and the workspace it belongs to.",
  },
  getGeoIngestSetup: {
    type: "object",
    properties: {
      ingestUrl: { type: "string", description: "Endpoint the tracking snippet posts events to." },
      snippet: { type: "string", description: "Install snippet for the default framework (Next.js)." },
      snippets: {
        type: "object",
        properties: {
          next: { type: "string", description: "Next.js proxy snippet." },
          nuxt: { type: "string", description: "Nuxt server middleware snippet." },
          netlify: { type: "string", description: "Netlify Edge Function snippet." },
          tanstack: { type: "string", description: "TanStack Start middleware snippet." },
          astro: { type: "string", description: "Astro middleware snippet." },
          sveltekit: { type: "string", description: "SvelteKit hooks snippet." },
          reactRouter: { type: "string", description: "React Router middleware snippet." },
        },
        required: ["next", "nuxt", "netlify", "tanstack", "astro", "sveltekit", "reactRouter"],
        description:
          "Install snippets per framework, each of which reads the token from an environment variable instead of embedding it.",
      },
      drainUrls: {
        type: "object",
        properties: {
          vercel: { type: "string", description: "Vercel log drain endpoint." },
          cloudflare: { type: "string", description: "Cloudflare Logpush endpoint." },
        },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
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
    description: "Tracking install instructions without the secret token.",
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
        properties: {
          name: { type: "string", description: "Server name, or empty when not reported." },
          version: { type: "string", description: "Server version, or empty when not reported." },
          protocolVersion: { type: "string", description: "MCP protocol version, or empty when not reported." },
        },
        required: ["name", "version", "protocolVersion"],
        description: "Server info from the newest event. Null before any.",
      },
      totals: {
        type: "object",
        properties: {
          requests: { type: "integer", description: "All MCP requests in the window, of every method." },
          previousRequests: { type: "integer", description: "All requests in the previous window." },
          toolCalls: { type: "integer", description: "tools/call requests." },
          previousToolCalls: { type: "integer", description: "tools/call requests in the previous window." },
          errors: { type: "integer", description: "Requests whose status was tool_error or rpc_error." },
          previousErrors: { type: "integer", description: "Failed requests in the previous window." },
          sessions: { type: "integer", description: "Distinct MCP sessions." },
          previousSessions: { type: "integer", description: "Distinct sessions in the previous window." },
          users: { type: "integer", description: "Distinct end-user IDs your server reported." },
          previousUsers: { type: "integer", description: "Distinct end-user IDs in the previous window." },
          p95Ms: { type: "integer", description: "95th percentile request duration in milliseconds." },
          previousP95Ms: {
            type: "integer",
            description: "95th percentile request duration in milliseconds in the previous window.",
          },
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
            toolsCall: { type: "integer", description: "tools/call requests that day." },
            resourcesRead: { type: "integer", description: "resources/read requests that day." },
            promptsGet: { type: "integer", description: "prompts/get requests that day." },
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
            name: { type: "string", description: "Tool name." },
            description: {
              type: "string",
              description: "Description from the latest tools/list. Empty when not listed.",
            },
            calls: { type: "integer", description: "tools/call requests for this tool." },
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
            name: { type: "string", description: "Name of the client, or empty when the client did not report one." },
            sessions: { type: "integer", description: "Distinct sessions from this client." },
            requests: { type: "integer", description: "Requests from this client." },
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
            clientName: { type: "string", description: "Client name, or empty when not reported." },
            clientVersion: { type: "string", description: "Client version, or empty when not reported." },
            method: { type: "string", description: "JSON-RPC method, such as tools/call." },
            target: { type: "string", description: "Tool name, resource URI or prompt name the request targeted." },
            status: {
              type: "string",
              enum: ["ok", "tool_error", "rpc_error"],
              description:
                "Kind of failure, where tool_error means the tool returned an error result and rpc_error means the JSON-RPC request failed.",
            },
            errorCode: { type: "integer", description: "Error code your server reported; 0 when none." },
            errorMessage: { type: "string", description: "Error message, or empty when not reported." },
            durationMs: { type: "integer", description: "Request duration in milliseconds." },
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
            name: { type: "string", description: "Model name." },
            sessions: { type: "integer", description: "Distinct sessions that reported this model." },
            calls: { type: "integer", description: "Requests that reported this model." },
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
            calls: { type: "integer", description: "Requests that stated this intent." },
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
            requests: { type: "integer", description: "Requests sent to clients." },
            accepted: { type: "integer", description: "Requests the user accepted." },
            declined: { type: "integer", description: "Requests the user declined." },
            cancelled: { type: "integer", description: "Requests the user dismissed without answering." },
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
              properties: {
                name: { type: "string", description: "Tool name." },
                description: {
                  type: "string",
                  description: "Description from the latest tools/list response, or empty when there is none.",
                },
              },
              required: ["name", "description"],
            },
            description: "Listed tools with no calls in the window.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
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
    description: "Usage, errors, clients and tools of your MCP server for the window.",
  },
  getGeoMcpToolDetail: {
    type: "object",
    properties: {
      before: {
        type: "array",
        items: {
          type: "object",
          properties: {
            tool: { type: "string", description: "Neighboring tool name." },
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
            tool: { type: "string", description: "Neighboring tool name." },
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
            clientName: { type: "string", description: "Client name, or empty when not reported." },
            status: {
              type: "string",
              enum: ["ok", "tool_error", "rpc_error"],
              description:
                "Kind of failure, where tool_error means the tool returned an error result and rpc_error means the JSON-RPC request failed.",
            },
            errorCode: { type: "integer", description: "Error code your server reported; 0 when none." },
            calls: { type: "integer", description: "Failed calls with this message." },
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
            calls: { type: "integer", description: "Requests that stated this intent." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["before", "after", "failures", "intents", "organization"],
    description: "Call sequences, failures and intents for one MCP server tool.",
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
            personaId: { type: "string", description: "Persona the answers belong to." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["from", "to", "points", "organization"],
    description: "Daily persona answer and mention counts over the requested window.",
  },
  getGeoPersonaGeneration: {
    type: "object",
    properties: {
      job: {
        type: ["object", "null"],
        properties: {
          id: { type: "string", description: "Generation job id." },
          status: {
            type: "string",
            enum: ["queued", "running", "completed", "failed"],
            description: "State of the job, which you poll until it is `completed` or `failed`.",
          },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["job", "organization"],
    description: "The project's persona generation job and the workspace it belongs to.",
  },
  getGeoPersonaResults: {
    type: "object",
    properties: {
      results: {
        type: "array",
        items: {
          type: "object",
          properties: {
            scanId: { type: "string", description: "Scan that captured this answer." },
            turn: { type: "integer", description: "Conversation turn, starting at 1." },
            engine: { type: "string", description: "Engine id that answered, such as `openai/chatgpt`." },
            prompt: { type: "string", description: "Message the persona sent on this turn." },
            answer: { type: "string", description: "Full answer text the engine returned." },
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
                properties: {
                  title: {
                    type: "string",
                    description: "Title of the cited page, or its URL when no title was recorded.",
                  },
                  url: { type: "string", description: "URL of the cited page." },
                  domain: { type: "string", description: "Domain of the cited page, or empty for older answers." },
                },
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
            id: { type: "string", description: "Scan id." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["results", "scans", "selectedScanId", "organization"],
    description: "A persona's conversation answers from one scan, the scans available to pick from and the workspace.",
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
            scanId: { type: "string", description: "Scan that captured the answer." },
            engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
            mentioned: { type: "boolean", description: "Whether the answer mentioned the brand." },
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
            capturedAt: { type: "string", description: "ISO timestamp when the answer was captured." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "promptId", "checks", "organization"],
    description: "Past answers to one tracked prompt across engines and scans.",
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
                url: { type: "string", description: "Source page URL." },
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
        description: "The stored answer with its sources and the engine's generation metadata.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["result", "organization"],
    description: "One stored answer engine result with its full answer text and sources.",
  },
  getGeoScan: {
    type: "object",
    properties: {
      scan: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Scan id, usable with `GET /v1/projects/{projectId}/geo/scans/{scanId}`.",
          },
          projectId: { type: "string", description: "Project the scan belongs to." },
          status: {
            type: "string",
            enum: ["running", "completed", "failed"],
            description: "`running` while answers are being collected, then `completed` or `failed`.",
          },
          startedAt: { type: "string", description: "When the scan started, as an ISO 8601 timestamp." },
          finishedAt: {
            type: ["string", "null"],
            description: "When the scan completed or failed, or `null` while running.",
          },
          createdAt: { type: "string", description: "When the scan record was created, as an ISO 8601 timestamp." },
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
                    engine: { type: "string", description: "Engine id, such as `openai/chatgpt`." },
                    plannedChecks: {
                      type: ["integer", "null"],
                      minimum: 0,
                      description:
                        "Answers planned for this engine, or `null` when the plan has no per-engine breakdown.",
                    },
                    completedChecks: {
                      type: "integer",
                      minimum: 0,
                      description: "Answers stored for this engine so far.",
                    },
                    mentionCount: {
                      type: "integer",
                      minimum: 0,
                      description: "Stored answers from this engine that mentioned the tracked brand.",
                    },
                    failedChecks: {
                      type: "integer",
                      minimum: 0,
                      description: "Planned answers for this engine that failed and were not stored.",
                    },
                  },
                  required: ["engine", "plannedChecks", "completedChecks", "mentionCount", "failedChecks"],
                },
                description:
                  "The same counts per engine, sorted by engine id. Covers planned engines and engines with stored answers.",
              },
            },
            required: ["plannedChecks", "completedChecks", "mentionCount", "failedChecks", "engines"],
            description: "Answer counts for the scan, overall and per engine.",
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
        description: "A GEO scan run and its progress.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["scan", "organization"],
    description: "The requested scan and the workspace it belongs to.",
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
              "Answers in the window across every tracked language, including sequences and personas. A multi-turn conversation counts once, with the sentiment of its first turn that mentions the brand.",
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
                "Answers in the window across every tracked language, including sequences and personas. A multi-turn conversation counts once, with the sentiment of its first turn that mentions the brand.",
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
            engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
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
                "Answers in the window across every tracked language, including sequences and personas. A multi-turn conversation counts once, with the sentiment of its first turn that mentions the brand.",
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
            properties: {
              from: { type: "string", description: "First day of the range in UTC, formatted as YYYY-MM-DD." },
              to: { type: "string", description: "Last day of the range in UTC, formatted as YYYY-MM-DD." },
            },
            required: ["from", "to"],
            description: "Selected period as inclusive UTC days (YYYY-MM-DD).",
          },
          previous: {
            type: "object",
            properties: {
              from: { type: "string", description: "First day of the range in UTC, formatted as YYYY-MM-DD." },
              to: { type: "string", description: "Last day of the range in UTC, formatted as YYYY-MM-DD." },
            },
            required: ["from", "to"],
            description: "Period of the same length right before it, as inclusive UTC days (YYYY-MM-DD).",
          },
          summary: {
            type: "object",
            properties: {
              totalChecks: {
                type: "integer",
                description:
                  "Answers in the window across every tracked language, including sequences and personas. A multi-turn conversation counts once, with the sentiment of its first turn that mentions the brand.",
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
                    "Answers in the window across every tracked language, including sequences and personas. A multi-turn conversation counts once, with the sentiment of its first turn that mentions the brand.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "summary", "engines", "points", "organization"],
    description: "How positively answers mention the brand, per engine and day, compared with the previous period.",
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
          generatedAt: { type: "string", description: "ISO timestamp when the analysis was generated." },
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
                polarity: {
                  type: "string",
                  enum: ["positive", "negative"],
                  description: "Whether answers praise or criticize this attribute.",
                },
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
                            prompt: { type: "string", description: "Prompt the answer responded to." },
                            engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
                            capturedAt: { type: "string", description: "ISO timestamp when the answer was captured." },
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
                      prompt: { type: "string", description: "Prompt the answer responded to." },
                      engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
                      capturedAt: { type: "string", description: "ISO timestamp when the answer was captured." },
                    },
                    required: ["checkId", "quote", "prompt", "engine", "capturedAt"],
                  },
                  description:
                    "Every quote from the theme's claims in one list, in claim order, with repeated quotes from the same answer listed once.",
                },
              },
              required: ["title", "polarity", "claims", "evidence"],
            },
            description: "Attributes the answers praise or criticize, each with supporting claims.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["status", "result", "message", "organization"],
    description: "The stored AI analysis of what answers praise and criticize about the brand.",
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
              id: { type: "string", description: "Settings record id." },
              organizationId: { type: "string", description: "Organization that owns the project." },
              projectId: { type: "string", description: "Project these settings apply to." },
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
              scanIntervalHours: {
                type: "integer",
                description:
                  "Hours between automatic scans, in whole days. Scheduled scans repeat on a fixed cadence from the first one, so a daily scan keeps the same time of day. Manual scans do not move the schedule.",
              },
              nextScanAt: {
                type: ["string", "null"],
                description:
                  "When the next automatic scan is due, as an ISO 8601 timestamp in UTC. The scheduler checks every 10 minutes, so the scan starts within 10 minutes after this time. A time in the past means the scan is due and starts on the next check. Saving settings with a new interval, or turning automatic scans back on, recalculates it from the last finished scan. Null while automatic scans are off.",
              },
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
              createdAt: {
                type: "string",
                description: "When the settings were first saved, as an ISO 8601 timestamp.",
              },
              updatedAt: { type: "string", description: "When the settings last changed, as an ISO 8601 timestamp." },
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
              "nextScanAt",
              "scanStartedAt",
              "lastScanAt",
              "isScanning",
              "createdAt",
              "updatedAt",
            ],
            description: "The project's GEO tracking settings.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "settings", "organization"],
    description: "The project's GEO settings and the workspace they belong to.",
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
            path: { type: "string", description: "Requested URL path." },
            host: { type: "string", description: "Hostname the request was sent to." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "events", "organization"],
    description: "The individual requests that make up one traffic journey.",
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
            source: {
              type: "string",
              description: "Crawler name for crawlers, or the AI assistant a referral came from.",
            },
            visitorType: {
              type: "string",
              enum: ["crawler", "ai_referral", "human", "unknown"],
              description:
                "Kind of AI traffic, where crawler means an AI bot fetched pages and ai_referral means a person arrived from an AI assistant's link.",
            },
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
                properties: {
                  day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
                  journeys: { type: "integer", description: "Journeys that started that day." },
                },
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
            previousJourneys: {
              type: "integer",
              description: "Journeys started in the previous window of the same length that fetched this page.",
            },
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
                properties: {
                  day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
                  journeys: { type: "integer", description: "Journeys that started that day." },
                },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "sources", "pages", "totalPages", "previousTotalPages", "organization"],
    description: "AI crawler and AI referral journey counts per source and per page.",
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
            path: { type: "string", description: "Requested URL path." },
            host: { type: "string", description: "Hostname the request was sent to." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "log", "total", "organization"],
    description: "Recent individual AI crawler and AI referral requests.",
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
        description: "Totals for the whole window.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "totals", "previousConversions", "sources", "points", "organization"],
    description: "AI crawler and AI referral traffic totals, sources and daily counts for the window.",
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
            promptId: { type: "string", description: "Prompt id; use it with getGeoPromptHistory." },
            prompt: { type: "string", description: "Prompt text sent to the engine." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "points", "prompts", "organization"],
    description: "Daily mentions of one competitor brand and the prompts whose answers named it.",
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
                  value: {
                    type: "number",
                    description: "Value for that day; the parent `trend` field says what it measures.",
                  },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "points", "timeseries", "organization"],
    description: "How often answers named each brand, including yours, in the selected window.",
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
                  value: {
                    type: "number",
                    description: "Value for that day; the parent `trend` field says what it measures.",
                  },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "points", "organization"],
    description: "Brand visibility per tracked language for the selected window.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "engines", "organization"],
    description: "Brand visibility per answer engine for the selected window or scan.",
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
                  url: { type: "string", description: "Source page URL." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "results", "organization"],
    description: "Latest full answers per tracked prompt and engine for the selected window.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "points", "organization"],
    description: "Daily brand visibility per answer engine for the selected window.",
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
            description: "Analytics provider the history was imported from.",
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
            host: { type: "string", description: "Hostname." },
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
          visitors: { type: "integer", description: "Unique human visitors in the window." },
          previousVisitors: {
            type: "integer",
            description: "Unique visitors in the previous window of the same length.",
          },
          sessions: { type: "integer", description: "Sessions, counted on each session's first page." },
          previousSessions: { type: "integer", description: "Sessions in the previous window of the same length." },
          engagedSessions: {
            type: "integer",
            description: "Sessions that viewed at least two pages. For imported history, visits minus bounces.",
          },
          aiVisitors: { type: "integer", description: "Visitors who arrived from an AI assistant." },
          previousAiVisitors: {
            type: "integer",
            description: "AI-referred visitors in the previous window of the same length.",
          },
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
        description: "Totals for the whole window.",
      },
      points: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "string", description: "UTC day (YYYY-MM-DD)." },
            views: { type: "integer", description: "Human page views that day." },
            visitors: { type: "integer", description: "Unique visitors that day." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "hosts", "totals", "points", "organization"],
    description: "Human web analytics totals, daily views and hosts for the window.",
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
            description: "Analytics provider the history was imported from.",
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
            host: { type: "string", description: "Hostname of the page." },
            path: { type: "string", description: "Page path." },
            views: { type: "integer", description: "Human page views in the window." },
            previousViews: {
              type: "integer",
              description: "Views in the previous window of the same length, immediately before this one.",
            },
            visitors: { type: "integer", description: "Unique visitors to this page." },
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
            source: {
              type: "string",
              description:
                "Referrer name, such as a search engine, social network, AI assistant or referring host, or empty for direct traffic.",
            },
            aiProduct: {
              type: "string",
              description:
                "Company behind the AI source, such as openai, anthropic, google or microsoft; the source itself when Notra has no mapping. Empty for non-AI groups.",
            },
            sessions: { type: "integer", description: "Sessions whose first page had this referrer." },
            previousSessions: {
              type: ["integer", "null"],
              description:
                "Sessions in the previous window of the same length. Null when filtered to a path and the previous window starts before the 90 days of visits Notra keeps.",
            },
            visitors: { type: "integer", description: "Unique visitors from this source." },
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
            value: {
              type: "string",
              description:
                "Breakdown value, which is a country code, device class or browser language depending on the list.",
            },
            visitors: { type: "integer", description: "Visitors in the window." },
            previousVisitors: {
              type: ["integer", "null"],
              description:
                "Visitors in the previous window of the same length, immediately before this one. Returned on every row; 0 when there were none. Null when the row is read from visits Notra keeps for 90 days (languages, or any breakdown filtered to a path) and the previous window starts before them.",
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
            value: {
              type: "string",
              description:
                "Breakdown value, which is a country code, device class or browser language depending on the list.",
            },
            visitors: { type: "integer", description: "Visitors in the window." },
            previousVisitors: {
              type: ["integer", "null"],
              description:
                "Visitors in the previous window of the same length, immediately before this one. Returned on every row; 0 when there were none. Null when the row is read from visits Notra keeps for 90 days (languages, or any breakdown filtered to a path) and the previous window starts before them.",
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
            sessions: { type: "integer", description: "Sessions in the window." },
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
            clicks: { type: "integer", description: "Clicks in the window." },
            previousClicks: {
              type: ["integer", "null"],
              description:
                "Clicks in the previous window of the same length, immediately before this one. Null when that window starts before the 90 days of clicks Notra keeps.",
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
            metric: {
              type: "string",
              enum: ["lcp", "inp", "cls", "fcp", "ttfb"],
              description:
                "Web Vital the row measures, which is largest contentful paint, interaction to next paint, cumulative layout shift, first contentful paint or time to first byte.",
            },
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
            source: {
              type: "string",
              description: "URL of the script that threw, without query or fragment, or empty when unknown.",
            },
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
            value: {
              type: "string",
              description:
                "Breakdown value, which is a country code, device class or browser language depending on the list.",
            },
            visitors: { type: "integer", description: "Visitors in the window." },
            previousVisitors: {
              type: ["integer", "null"],
              description:
                "Visitors in the previous window of the same length, immediately before this one. Returned on every row; 0 when there were none. Null when the row is read from visits Notra keeps for 90 days (languages, or any breakdown filtered to a path) and the previous window starts before them.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
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
    description: "Human web analytics broken down by page, referrer, country, device and more.",
  },
  getGeoWebAnalyticsUtm: {
    type: "object",
    properties: {
      dimension: {
        type: "string",
        enum: ["source", "medium", "campaign", "term", "content"],
        description: "UTM parameter the rows break down.",
      },
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
              type: ["integer", "null"],
              description:
                "Sessions in the previous window of the same length, immediately before this one. Null when read from visits Notra keeps for 90 days (term, content, or any parameter filtered to a path) and the previous window starts before them.",
            },
            visitors: { type: "integer", description: "Unique visitors with this UTM value." },
          },
          required: ["value", "sessions", "previousSessions", "visitors"],
        },
        description: "One row per UTM value, most sessions first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["dimension", "rows", "organization"],
    description: "Sessions and visitors per value of one UTM parameter.",
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
        description: "The repository the activity was read from.",
      },
      type: {
        type: "string",
        enum: ["pull_requests", "commits", "releases"],
        description: "Kind of activity listed in items.",
      },
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
        description: "Pull requests, commits or releases in the window on this page.",
      },
      pagination: {
        type: "object",
        properties: {
          page: { type: "integer", description: "Page returned, starting at 1." },
          nextPage: {
            type: ["integer", "null"],
            description:
              "Next GitHub page to request, or null when there are no more items in the window. A page can hold fewer items than the page size while nextPage is set.",
          },
        },
        required: ["page", "nextPage"],
        description: "Page position in the activity list.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["integration", "type", "since", "until", "items", "pagination", "organization"],
    description: "One page of GitHub activity for a connected repository.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      post: {
        type: ["object", "null"],
        properties: {
          id: { type: "string", description: "ID of the post, used as postId in the /v1/posts endpoints." },
          title: { type: "string", description: "Post title." },
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
            description:
              "Kind of content. image posts hold a rendered image instead of text; only blog_post and changelog have a slug and metadata.",
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
              tags: {
                type: "array",
                items: { type: "string" },
                description: "Post tags in display order, or empty when none are set.",
              },
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
                    id: {
                      type: "string",
                      description:
                        "Author ID from GET /v1/posts/authors, or a site:<id> ref for an author from the post's Notra Sites site.",
                    },
                    slug: {
                      type: "string",
                      description: "Stable author handle; hosted sites list the author's posts at /author/{slug}.",
                    },
                    name: { type: "string", description: "Author's display name." },
                    title: {
                      type: ["string", "null"],
                      description: "Job title shown next to the name, or null when not set.",
                    },
                    avatarUrl: { type: ["string", "null"], description: "Avatar image URL, or null when not set." },
                    url: { type: ["string", "null"], description: "Author's website." },
                    x: { type: ["string", "null"], description: "X profile URL, or null when not set." },
                    linkedin: { type: ["string", "null"], description: "LinkedIn profile URL, or null when not set." },
                    github: { type: ["string", "null"], description: "GitHub profile URL, or null when not set." },
                    youtube: { type: ["string", "null"], description: "YouTube channel URL, or null when not set." },
                    bluesky: { type: ["string", "null"], description: "Bluesky profile URL, or null when not set." },
                    mastodon: { type: ["string", "null"], description: "Mastodon profile URL, or null when not set." },
                    threads: { type: ["string", "null"], description: "Threads profile URL, or null when not set." },
                    instagram: {
                      type: ["string", "null"],
                      description: "Instagram profile URL, or null when not set.",
                    },
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
          status: {
            type: "string",
            enum: ["draft", "published"],
            description:
              "Publishing state of the post in Notra, where GET /v1/posts only returns published posts unless its status filter includes draft.",
          },
          createdAt: { type: "string", description: "When the post was created, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the post was last changed, as an ISO 8601 timestamp." },
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
    description: "The requested post, or null when it does not exist.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      agentReach: {
        type: ["object", "null"],
        properties: {
          postId: { type: "string", description: "ID of the post." },
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
            description: "AI visits to the post in the window, by visitor type.",
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
    description: "AI traffic to a post published on a Notra Site.",
  },
  getPostGeneration: {
    type: "object",
    properties: {
      job: {
        type: "object",
        properties: {
          id: { type: "string", description: "ID of the job, which you poll with GET /v1/posts/generate/{jobId}." },
          organizationId: { type: "string", description: "Workspace the job runs in." },
          status: {
            type: "string",
            enum: ["queued", "running", "completed", "failed", "skipped"],
            description: "Job state. Terminal states are completed, failed, and skipped.",
          },
          contentType: {
            type: "string",
            enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"],
            description: "Type of content being generated.",
          },
          lookbackWindow: {
            type: "string",
            enum: ["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"],
            description: "How far back source activity is collected.",
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
          createdAt: { type: "string", description: "When the job was queued, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the job last changed, as an ISO 8601 timestamp." },
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
        description: "Asynchronous post generation job.",
      },
      events: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Event ID." },
            jobId: { type: "string", description: "Job the event belongs to." },
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
              description: "Step of the job the event records.",
            },
            message: { type: "string", description: "Human-readable description of the event." },
            createdAt: { type: "string", description: "When the event was recorded, as an ISO 8601 timestamp." },
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
    description: "Current state of the post generation job and its event log.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      schedule: {
        anyOf: [
          {
            type: "object",
            properties: {
              postId: { type: "string", description: "ID of the scheduled post." },
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
                    id: { type: "string", description: "ID of this destination's publication." },
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
                          properties: {
                            destination: {
                              type: "string",
                              enum: ["notra"],
                              description: "Marks the post as published in Notra.",
                            },
                          },
                          required: ["destination"],
                        },
                        {
                          type: "object",
                          properties: {
                            destination: {
                              type: "string",
                              enum: ["github"],
                              description: "Opens, and optionally merges, a pull request.",
                            },
                            repositoryId: {
                              type: "string",
                              description: "GitHub integration ID the pull request goes to.",
                            },
                            merge: {
                              type: "boolean",
                              description:
                                "Whether the pull request is merged at the scheduled time. When false, it is only opened or updated.",
                            },
                          },
                          required: ["destination", "repositoryId", "merge"],
                        },
                        {
                          type: "object",
                          properties: {
                            destination: {
                              type: "string",
                              enum: ["social"],
                              description: "Posts to a connected X or LinkedIn account.",
                            },
                            accountId: { type: "string", description: "Connected social account ID." },
                          },
                          required: ["destination", "accountId"],
                        },
                      ],
                      description:
                        "Settings for the destination, which are the GitHub integration and merge choice or the social account, and none for notra.",
                    },
                    status: {
                      type: "string",
                      enum: ["scheduled", "publishing", "published", "failed", "canceled"],
                      description:
                        "scheduled → publishing → published or failed. Failed destinations are retried automatically for transient errors before they end up failed.",
                    },
                    scheduledAt: {
                      type: "string",
                      format: "date-time",
                      description:
                        "When this destination publishes as an ISO 8601 UTC timestamp, which matches the schedule's scheduledAt.",
                    },
                    timeZone: {
                      type: "string",
                      description: "IANA time zone the schedule was picked in, for display only.",
                    },
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
            description: "When a post publishes and where it goes out.",
          },
          { type: "null" },
        ],
        description:
          "The post's latest schedule with destinations that were not canceled, listing only those destinations. It stays after they published or failed, and destinations that already published remain after a cancel. Null when the post was never scheduled or all its destinations were canceled.",
      },
    },
    required: ["organization", "schedule"],
    description: "The post's current schedule, if any.",
  },
  getPricingQuote: {
    type: "object",
    properties: {
      scansPerMonth: { type: "number", description: "Scans per month, 30 divided by the scan interval." },
      promptAnswersPerScan: { type: "integer", description: "AI answers used by prompts in one scan." },
      personaAnswersPerScan: {
        type: "integer",
        description: "Upper bound of AI answers used by persona conversations in one scan. Persona turns count double.",
      },
      answersPerScan: { type: "integer", description: "Total AI answers in one scan." },
      answersPerMonth: { type: "integer", description: "Total AI answers per month, rounded up." },
      plan: {
        type: ["object", "null"],
        properties: {
          id: {
            type: "string",
            enum: ["starter", "growth", "scale", "agency_starter", "agency_growth", "agency_scale"],
            description: "Plan id, matching the plan ids used at checkout.",
          },
          aiAnswersPerMonth: { type: "integer", description: "AI answers included per month." },
        },
        required: ["id", "aiAnswersPerMonth"],
        description:
          "Smallest plan whose monthly AI answers cover the estimate. `null` when it needs Enterprise or Partner.",
      },
      plans: {
        type: "array",
        items: {
          type: ["object", "null"],
          properties: {
            id: {
              type: "string",
              enum: ["starter", "growth", "scale", "agency_starter", "agency_growth", "agency_scale"],
              description: "Plan id, matching the plan ids used at checkout.",
            },
            aiAnswersPerMonth: { type: "integer", description: "AI answers included per month." },
          },
          required: ["id", "aiAnswersPerMonth"],
          description:
            "Smallest plan whose monthly AI answers cover the estimate. `null` when it needs Enterprise or Partner.",
        },
        description: "Every plan in the chosen family, smallest first.",
      },
    },
    required: [
      "scansPerMonth",
      "promptAnswersPerScan",
      "personaAnswersPerScan",
      "answersPerScan",
      "answersPerMonth",
      "plan",
      "plans",
    ],
    description: "Monthly AI answer estimate and the plan that fits, from Notra's plan limits.",
  },
  getProject: {
    type: "object",
    properties: {
      project: {
        type: "object",
        properties: {
          id: { type: "string", description: "Use as projectId in the endpoints under /v1/projects/{projectId}." },
          name: { type: "string", description: "Project display name." },
          brandSettingsId: {
            type: "string",
            description: "ID of the brand identity linked to the project, as listed by GET /v1/brand-identities.",
          },
          createdAt: { type: "string", description: "When the project was created, as an ISO 8601 timestamp." },
        },
        required: ["id", "name", "brandSettingsId", "createdAt"],
        description: "A GEO project tracking one brand identity.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["project", "organization"],
    description: "The GEO project and the workspace it belongs to.",
  },
  getPublicApiStatus: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["ok"], description: "Always ok when the API is reachable." },
      service: { type: "string", enum: ["Notra API"], description: "Service name." },
      version: { type: "string", description: "API version." },
      public: { type: "boolean", enum: [true], description: "This endpoint needs no authentication." },
      authentication: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["bearer"],
            description: "Send an API key or OAuth access token as a bearer token in the Authorization header.",
          },
          resource_metadata: {
            type: "string",
            format: "uri",
            description: "OAuth protected resource metadata URL, for discovering the authorization server.",
          },
          guide: { type: "string", format: "uri", description: "URL of the authentication guide for agents." },
        },
        required: ["type", "resource_metadata", "guide"],
        description: "How to authenticate against the API.",
      },
    },
    required: ["status", "service", "version", "public", "authentication"],
    description: "Reachability check and authentication discovery metadata.",
  },
  getSite: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: {
          id: { type: "string", description: "The Site's ID." },
          projectId: {
            type: "string",
            description: "Notra project the Site belongs to. Use it as projectId in /v1/projects/{projectId}.",
          },
          name: { type: "string", description: "Display name of the Site." },
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
              owner: { type: "string", description: "GitHub user or organization that owns the repository." },
              name: { type: "string", description: "Repository name." },
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
            properties: {
              blog: { type: "string", description: "Path the blog is served under, or absent when the blog is off." },
              changelog: {
                type: "string",
                description: "Path the changelog is served under, or absent when the changelog is off.",
              },
            },
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
          createdAt: { type: "string", description: "When the Site was created, as an ISO 8601 timestamp." },
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
        description: "The Site and its settings.",
      },
      domains: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "The domain's ID." },
            hostname: { type: "string", description: "The custom hostname, without scheme or path." },
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
                  type: { type: "string", enum: ["CNAME", "TXT", "A"], description: "DNS record type." },
                  name: { type: "string", description: "Host name of the record." },
                  value: { type: "string", description: "Value the record must hold." },
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
          description: "A custom domain attached to the Site.",
        },
        description: "Custom domains attached to the Site, or empty when it has none.",
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
            visibility: {
              type: "string",
              enum: ["public", "protected"],
              description:
                "public previews open for anyone; protected previews need a workspace sign-in or the preview's password.",
            },
            url: { type: "string", description: "Where the preview serves its first section." },
            branch: {
              type: ["string", "null"],
              description: "Branch the preview was built from, or null when unknown.",
            },
            pullRequestNumber: {
              type: ["integer", "null"],
              description: "GitHub pull request the preview builds, or null when it isn't from a pull request.",
            },
            commitSha: {
              type: ["string", "null"],
              description: "Commit the preview was built from, or null when unknown.",
            },
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
          description: "A preview deployment the Site is serving now.",
        },
        description: "Previews that are being served now, or an empty list when there are none.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["site", "domains", "previews", "organization"],
    description: "The Site with its settings, custom domains and live previews.",
  },
  getSiteDeployment: {
    type: "object",
    properties: {
      deployment: {
        type: "object",
        properties: {
          id: { type: "string", description: "The deployment's ID, used as deploymentId in deployment routes." },
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
          branch: { type: "string", description: "Git branch that was built." },
          commitSha: { type: "string", description: "Git commit SHA that was built." },
          commitMessage: {
            type: ["string", "null"],
            description: "Message of the built commit, or null when unknown.",
          },
          commitAuthor: {
            type: ["string", "null"],
            description:
              "Name of the commit's author, or the GitHub login of the pull request author for pull request builds, or null when unknown.",
          },
          pullRequestNumber: {
            type: ["integer", "null"],
            description: "GitHub pull request the deployment builds, or null when it isn't built from a pull request.",
          },
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
                severity: {
                  type: "string",
                  enum: ["error", "warning"],
                  description: "error fails the build; warning is reported but the build continues.",
                },
                file: {
                  type: ["string", "null"],
                  description: "File the diagnostic points at, or null when it has none.",
                },
                line: {
                  type: "integer",
                  description: "Line in the file, counted from 1, or absent when the diagnostic has no position.",
                },
                column: {
                  type: "integer",
                  description: "Column in the line, counted from 1, or absent when the diagnostic has no position.",
                },
                code: { type: "string", description: "Machine-readable diagnostic kind." },
                message: { type: "string", description: "Human-readable explanation." },
              },
              required: ["severity", "file", "code", "message"],
            },
            description: "Compiler errors and warnings with file and line.",
          },
          createdAt: { type: "string", description: "When the deployment was queued, as an ISO 8601 timestamp." },
          startedAt: {
            type: ["string", "null"],
            description: "When the build started, as an ISO 8601 timestamp, or null while queued or when it never ran.",
          },
          finishedAt: {
            type: ["string", "null"],
            description:
              "When the deployment reached a final status, as an ISO 8601 timestamp, or null while in progress.",
          },
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
        description: "A production or preview build of the Site.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["deployment", "log", "logTruncated", "organization"],
    description: "The deployment with its build log.",
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
              live: {
                type: "boolean",
                description:
                  "The preview is being served and has not expired. During a rebuild this is the previous build.",
              },
              latestLive: {
                type: "boolean",
                description:
                  "The latest build is the one being served: the url shows the saved post. Share the link once this is true.",
              },
              deleting: { type: "boolean", description: "The preview is being removed." },
              errorMessage: { type: ["string", "null"], description: "Why the latest build failed or stopped." },
              expiresAt: { type: "string", description: "When the preview stops being served." },
              lifetime: {
                type: "string",
                enum: ["1h", "1d", "3d", "7d"],
                description:
                  "How long the preview stays open after each build; rebuilds keep it unless a new one is passed.",
              },
              hasPassword: {
                type: "boolean",
                description: "People outside the workspace can open it with a password.",
              },
              url: { type: "string", description: "The post's page on the preview." },
            },
            required: [
              "status",
              "live",
              "latestLive",
              "deleting",
              "errorMessage",
              "expiresAt",
              "lifetime",
              "hasPassword",
              "url",
            ],
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["preview", "organization"],
    description: "The post's private preview on the Site.",
  },
  getSkill: {
    type: "object",
    properties: {
      skill: {
        allOf: [
          {
            type: "object",
            properties: {
              id: { type: "string", description: "The skill's ID." },
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
              updatedAt: { type: "string", description: "When the skill was last changed, as an ISO 8601 timestamp." },
            },
            required: ["id", "name", "description", "isSystem", "updatedAt"],
            description: "A skill without its instructions.",
          },
          {
            type: "object",
            properties: {
              content: { type: "string", description: "Full skill instructions, typically Markdown." },
              createdAt: { type: "string", description: "When the skill was created, as an ISO 8601 timestamp." },
            },
            required: ["content", "createdAt"],
          },
        ],
        description: "A reusable set of instructions for Notra's AI agents.",
      },
    },
    required: ["skill"],
    description: "The skill with its instructions.",
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
          endpointId: { type: "string", description: "ID of the endpoint the delivery is sent to." },
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
            description: "Type of event the delivery carries.",
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
          createdAt: { type: "string", description: "When the delivery was created, as an ISO 8601 timestamp." },
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
        description: "The delivery with its request body.",
      },
      attempts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "The attempt's ID." },
            deliveryId: { type: "string", description: "ID of the delivery the attempt belongs to." },
            attemptNumber: { type: "number", description: "Position of the attempt, starting at 1." },
            startedAt: { type: "string", description: "When the attempt started, as an ISO 8601 timestamp." },
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
    description: "A webhook delivery and its attempts.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
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
            slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
            name: { type: "string", description: "Workspace display name." },
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
          description: "Workspace the request ran in.",
        },
        description:
          "Current workspace first, then active memberships, then pending invitations, each sorted by name. Single-organization API keys only see the current workspace.",
      },
      authentication: {
        oneOf: [
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["apiKey"], description: "The request was authenticated with an API key." },
            },
            required: ["type"],
          },
          {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["oauth"],
                description: "The request was authenticated with an OAuth access token.",
              },
              accountId: { type: "string", description: "Notra user ID of the signed-in account." },
              scopes: { type: "array", items: { type: "string" }, description: "OAuth scopes granted to the token." },
            },
            required: ["type", "accountId", "scopes"],
          },
        ],
        description: "How the request was authenticated.",
      },
    },
    required: ["currentWorkspace", "workspaces", "authentication"],
    description: "The workspaces the caller can act on and how the request was authenticated.",
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
          description: "A competitor tracked in AI answers.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["imported", "updated", "skipped", "issues", "competitors", "organization"],
    description:
      "Counts of imported, updated, skipped and rejected competitor rows, plus the resulting competitor list.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["imported", "updated", "skipped", "issues", "organization"],
    description: "Counts of imported, skipped and rejected prompt rows.",
  },
  importSiteAuthors: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: {
          id: { type: "string", description: "The Site's ID." },
          name: { type: "string", description: "Display name of the Site." },
        },
        required: ["id", "name"],
        description: "The Site the request applied to.",
      },
      authors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "The author's id in blog.json. Posts name the author with it and its author page lives at {blogMount}/author/{id}.",
            },
            ref: {
              type: "string",
              description:
                "Pass this in metadata.authorIds of PATCH /v1/posts/{postId} to credit the author on a blog post that publishes to this site.",
            },
            name: { type: "string", description: "The author's display name." },
            title: { type: ["string", "null"], description: "The author's role or job title, or null when not set." },
            bio: {
              type: ["string", "null"],
              description: "Short biography shown on the author page, or null when not set.",
            },
            avatar: {
              type: ["string", "null"],
              description: "As written in blog.json: a site path such as /images/jane.png or an https URL.",
            },
            avatarUrl: { type: ["string", "null"], description: "The avatar as a full URL on the live site." },
            url: {
              type: ["string", "null"],
              description: "The author's personal website as an https URL, or null when not set.",
            },
            x: { type: ["string", "null"], description: "The author's X profile URL, or null when not set." },
            linkedin: {
              type: ["string", "null"],
              description: "The author's LinkedIn profile URL, or null when not set.",
            },
            github: { type: ["string", "null"], description: "The author's GitHub profile URL, or null when not set." },
            youtube: {
              type: ["string", "null"],
              description: "The author's YouTube channel URL, or null when not set.",
            },
            bluesky: {
              type: ["string", "null"],
              description: "The author's Bluesky profile URL, or null when not set.",
            },
            mastodon: {
              type: ["string", "null"],
              description: "The author's Mastodon profile URL, or null when not set.",
            },
            threads: {
              type: ["string", "null"],
              description: "The author's Threads profile URL, or null when not set.",
            },
            instagram: {
              type: ["string", "null"],
              description: "The author's Instagram profile URL, or null when not set.",
            },
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
      imported: { type: "array", items: { type: "string" }, description: "Ids written to blog.json." },
      avatarsSkipped: {
        type: "array",
        items: { type: "string" },
        description:
          "Ids whose avatar was a dashboard upload, which only the dashboard import can copy into the site. Set their avatar with PUT afterwards.",
      },
    },
    required: ["site", "authors", "authorPage", "hasUnpublishedChanges", "imported", "avatarsSkipped"],
    description:
      "The Site's authors after the import, with the ids that were written and those whose avatar was skipped.",
  },
  issueGeoIngestToken: {
    type: "object",
    properties: {
      ingestUrl: { type: "string", description: "Endpoint the tracking snippet posts events to." },
      snippet: { type: "string", description: "Install snippet for the default framework (Next.js)." },
      snippets: {
        type: "object",
        properties: {
          next: { type: "string", description: "Next.js proxy snippet." },
          nuxt: { type: "string", description: "Nuxt server middleware snippet." },
          netlify: { type: "string", description: "Netlify Edge Function snippet." },
          tanstack: { type: "string", description: "TanStack Start middleware snippet." },
          astro: { type: "string", description: "Astro middleware snippet." },
          sveltekit: { type: "string", description: "SvelteKit hooks snippet." },
          reactRouter: { type: "string", description: "React Router middleware snippet." },
        },
        required: ["next", "nuxt", "netlify", "tanstack", "astro", "sveltekit", "reactRouter"],
        description:
          "Install snippets per framework, each of which reads the token from an environment variable instead of embedding it.",
      },
      drainUrls: {
        type: "object",
        properties: {
          vercel: { type: "string", description: "Vercel log drain endpoint." },
          cloudflare: { type: "string", description: "Cloudflare Logpush endpoint." },
        },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
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
    description: "A newly issued tracking token with its install instructions.",
  },
  listAgentChats: {
    type: "object",
    properties: {
      sessions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            sessionId: {
              type: "string",
              description: "ID of the agent session, used with the /v2/eve/v1/session endpoints.",
            },
            chatId: {
              type: ["string", "null"],
              description:
                "Dashboard chat the session belongs to, or null for sessions not tied to a chat, such as those started through the API.",
            },
            surface: {
              type: "string",
              description:
                "Where the session was started, such as standalone-chat for sessions started through the API or task for background content tasks.",
            },
            status: {
              type: "string",
              description:
                "Session state. active for open sessions; background task sessions end as completed, failed or timed_out.",
            },
            createdAt: { type: "string", description: "When the session was started, as an ISO 8601 timestamp." },
            updatedAt: { type: "string", description: "When the session was last updated, as an ISO 8601 timestamp." },
          },
          required: ["sessionId", "chatId", "surface", "status", "createdAt", "updatedAt"],
          description: "Summary of an agent session.",
        },
        description:
          "Agent sessions visible to the caller, newest first. Organization API keys only see sessions not owned by a user.",
      },
    },
    required: ["sessions"],
    description: "Recent agent sessions in the workspace.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
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
              description: "Role of the color in the palette. custom is for colors outside the standard roles.",
            },
            name: { type: ["string", "null"], description: "Display name of the color, or null when not set." },
            lightValue: { type: "string", description: "Hex color for light mode." },
            darkValue: {
              type: ["string", "null"],
              description: "Hex color for dark mode. Null when the color has no dark variant.",
            },
            usage: { type: ["string", "null"], description: "Free-text note on where the color should be used." },
          },
          required: ["id", "role", "name", "lightValue", "darkValue", "usage"],
          description: "A color in a brand identity's palette.",
        },
        description: "Colors of the brand identity in display order.",
      },
    },
    required: ["organization", "colors"],
    description: "The brand identity's color palette.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
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
            name: { type: "string", description: "Display name, unique within the organization." },
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
            createdAt: {
              type: "string",
              description: "When the brand identity was created, as an ISO 8601 timestamp.",
            },
            updatedAt: {
              type: "string",
              description: "When the brand identity was last changed, as an ISO 8601 timestamp.",
            },
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
          description: "A brand identity with the company details, tone and audience that Notra writes content for.",
        },
        description: "Every brand identity in the organization, default first.",
      },
    },
    required: ["organization", "brandIdentities"],
    description: "The organization's brand identities.",
  },
  listChats: {
    type: "object",
    properties: {
      chats: {
        type: "array",
        items: {
          type: "object",
          properties: {
            chatId: { type: "string", description: "The chat's ID, used as chatId in /v1/chats/{chatId}." },
            title: {
              type: "string",
              description: 'Title of the chat, written from its first user message, or "New chat" before there is one.',
            },
            createdAt: { type: "string", description: "When the chat was created, as an ISO 8601 timestamp." },
            updatedAt: {
              type: "string",
              description: "When the chat last changed, such as a new message, as an ISO 8601 timestamp.",
            },
            pinnedAt: {
              type: ["string", "null"],
              description: "When the chat was pinned, as an ISO 8601 timestamp, or null when it isn't pinned.",
            },
            externalChannelId: {
              type: ["object", "null"],
              properties: {
                source: {
                  type: "string",
                  enum: ["discord", "slack", "dashboard", "agent"],
                  description:
                    "Where the chat is linked, which is a Discord or Slack channel, a dashboard id or an agent.",
                },
                id: {
                  type: "string",
                  maxLength: 200,
                  description:
                    "Channel ID on that platform or the id the chat was tagged with, which is always set for discord and slack and optional for other sources.",
                },
              },
              required: ["source"],
              description: "The external channel the chat is linked to, or null or absent when it isn't linked.",
            },
          },
          required: ["chatId", "title", "createdAt", "updatedAt", "pinnedAt"],
          description: "A chat session without its messages.",
        },
        description: "Chats with pinned ones first, most recently pinned first, then the rest by most recent activity.",
      },
    },
    required: ["chats"],
    description: "The organization's chat sessions, without their messages.",
  },
  listCommentedPosts: {
    type: "object",
    properties: {
      posts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            postId: { type: "string" },
            title: { type: "string" },
            openThreads: { type: "integer", description: "Unresolved threads on the post" },
            lastCommentAt: { type: ["string", "null"], description: "When the newest open thread was started" },
            siteId: {
              type: "string",
              description:
                "The Site a preview link belongs to, to rebuild that preview after revising the post. Only set when looking up a preview link.",
            },
          },
          required: ["postId", "title", "openThreads", "lastCommentAt"],
        },
      },
      hasMore: { type: "boolean", description: "More posts with open comments are on the next page." },
      total: { type: "integer", description: "Posts with open comments across all pages; 1 when looking up a link." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["posts", "hasMore", "total", "organization"],
  },
  listEventTriggers: {
    type: "object",
    properties: {
      eventTriggers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The event trigger's ID, used as triggerId in /v1/event-triggers/{triggerId}.",
            },
            organizationId: { type: "string", description: "ID of the organization that owns the trigger." },
            name: {
              type: "string",
              description:
                'Event triggers cannot be named through the API or the dashboard, so this is the default "Untitled Schedule".',
            },
            sourceType: {
              type: "string",
              enum: ["github_webhook"],
              description: "Always github_webhook for event triggers.",
            },
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
              description: "Which GitHub events start a run.",
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
              description: "Repositories the trigger listens to.",
            },
            outputType: {
              type: "string",
              enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"],
              description: "Type of content each run generates.",
            },
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
                  properties: {
                    slack: {
                      type: "boolean",
                      description: "Post to the organization's Slack notification channel after a successful run.",
                    },
                    email: { type: "boolean", description: "Email the workspace owners after a successful run." },
                  },
                  required: ["slack", "email"],
                  description:
                    "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
                },
              },
              description:
                "Writing and notification settings for generated content, or null or absent when none are set.",
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
            createdAt: { type: "string", description: "When the trigger was created, as an ISO 8601 timestamp." },
            updatedAt: { type: "string", description: "When the trigger was last changed, as an ISO 8601 timestamp." },
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
          description: "An automation that generates content when GitHub events arrive.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["eventTriggers", "repositoryMap", "organization"],
    description: "The workspace's event triggers with labels for the repositories they target.",
  },
  listFeedback: {
    type: "object",
    properties: {
      feedback: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "The feedback's ID, used as feedbackId in /v1/feedback/{feedbackId}." },
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
            message: { type: "string", description: "The feedback itself." },
            agentClient: {
              type: ["string", "null"],
              description: "The agent or client that submitted the feedback, or null when not given.",
            },
            agentModel: { type: ["string", "null"], description: "Model the agent ran on, or null when not given." },
            toolVersion: {
              type: ["string", "null"],
              description: "Version of the tool or client that submitted it, or null when not given.",
            },
            userAgent: {
              type: ["string", "null"],
              description:
                "User agent as submitted, falling back to the request's User-Agent header, or null when neither was present.",
            },
            contextUrl: {
              type: ["string", "null"],
              description: "Page or resource the feedback is about, or null when not given.",
            },
            externalId: {
              type: ["string", "null"],
              description: "The submitter's own identifier for the user or session, or null when not given.",
            },
            idempotencyKey: {
              type: ["string", "null"],
              description: "Idempotency key sent with the submission, or null when none was sent.",
            },
            metadata: {
              type: ["object", "null"],
              additionalProperties: {},
              description: "JSON submitted with the feedback, or null.",
            },
            resolvedAt: {
              type: ["string", "null"],
              description: "When the status was last set to resolved. Cleared when it changes to another status.",
            },
            createdAt: { type: "string", description: "When the feedback was submitted, as an ISO 8601 timestamp." },
            updatedAt: { type: "string", description: "When the feedback last changed, as an ISO 8601 timestamp." },
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
          description: "A piece of feedback submitted by an agent, app or person.",
        },
        description: "Feedback on this page, newest first.",
      },
      pagination: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, description: "Items per page." },
          currentPage: { type: "integer", minimum: 1, description: "The page returned, starting at 1." },
          nextPage: {
            type: ["integer", "null"],
            minimum: 1,
            description: "Next page number, or null on the last page.",
          },
          previousPage: {
            type: ["integer", "null"],
            minimum: 1,
            description: "Previous page number, or null on the first page.",
          },
          totalPages: {
            type: "integer",
            minimum: 1,
            description: "Total pages for the filters, at least 1 even with no results.",
          },
          totalItems: { type: "integer", minimum: 0, description: "Total feedback items matching the filters." },
        },
        required: ["limit", "currentPage", "nextPage", "previousPage", "totalPages", "totalItems"],
        description: "Page position and totals for the list.",
      },
    },
    required: ["feedback", "pagination"],
    description: "A page of the workspace's feedback.",
  },
  listGeoAnalyticsImports: {
    type: "object",
    properties: {
      imports: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Import id." },
            projectId: { type: "string", description: "Project the history is imported into." },
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
              description: "Analytics provider the history comes from.",
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
              description:
                "Progress of the import, where waiting_rate_limit means the provider's rate limit paused it until retryAt and deleting means Notra is removing the imported rows.",
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
                visitors: { type: "boolean", description: "Whether it supplies unique visitors." },
                visits: {
                  type: "boolean",
                  description: "Whether the provider supplies visits, which it calls sessions.",
                },
                bounces: { type: "boolean", description: "Whether it supplies bounces." },
                utm: { type: "boolean", description: "Whether it supplies UTM breakdowns." },
                entryPages: { type: "boolean", description: "Whether it supplies entry pages." },
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
            createdAt: { type: "string", description: "ISO timestamp when the import was created." },
            completedAt: {
              type: ["string", "null"],
              description: "ISO timestamp when the import finished, or null until completed.",
            },
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
        description: "History imports that are not deleted, newest first.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["imports", "organization"],
    description: "Analytics history imports for the project and their progress.",
  },
  listGeoChanges: {
    type: "object",
    properties: {
      previousScan: {
        type: ["object", "null"],
        properties: {
          id: { type: "string", description: "Scan id." },
          finishedAt: {
            type: ["string", "null"],
            description: "ISO timestamp when the scan finished, or null when not recorded.",
          },
        },
        required: ["id", "finishedAt"],
        description:
          "Second most recently started completed scan, or `null` when the project has fewer than two completed scans. Without it there are no events.",
      },
      currentScan: {
        type: ["object", "null"],
        properties: {
          id: { type: "string", description: "Scan id." },
          finishedAt: {
            type: ["string", "null"],
            description: "ISO timestamp when the scan finished, or null when not recorded.",
          },
        },
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
          positionImproved: { type: "integer", description: "Pairs where the brand moved up a list." },
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
              description:
                "Type of change, where competitor_displaced means competitors took the brand's place or moved above it, competitor_cited means competitor sites were newly cited and new_engine means the engine had no answer in the previous scan.",
            },
            promptId: {
              type: "string",
              description: "ID of the tracked prompt, which is a custom prompt UUID or an auto prompt slug.",
            },
            prompt: { type: "string", description: "Prompt text." },
            engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
            previous: {
              type: ["object", "null"],
              properties: {
                mentioned: { type: "boolean", description: "Whether the answer mentioned the brand." },
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
                mentioned: { type: "boolean", description: "Whether the answer mentioned the brand." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["previousScan", "currentScan", "summary", "events", "organization"],
    description: "What changed in brand mentions, positions and citations between the two latest completed scans.",
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
          description: "A competitor tracked in AI answers.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["competitors", "organization"],
    description: "The project's tracked competitors and the workspace they belong to.",
  },
  listGeoContentBriefs: {
    type: "object",
    properties: {
      briefs: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Brief id for the brief endpoints." },
            topic: {
              type: "string",
              description:
                "What the article targets, which is the source prompt when the brief was planned from a gap, prompt or Search Console suggestion.",
            },
            workingTitle: { type: "string", description: "Planned article title." },
            status: {
              type: "string",
              enum: ["draft", "approved", "writing", "completed", "failed"],
              description:
                "`draft` until approved, `approved` or `writing` while the writer drafts the post, `completed` once the draft post is written, `failed` when the last writer run failed.",
            },
            postId: {
              type: ["string", "null"],
              description: "Post the brief writes into. Null when no post is linked, for example after it was deleted.",
            },
            createdAt: { type: "string", description: "When the brief was planned, as an ISO 8601 timestamp." },
          },
          required: ["id", "topic", "workingTitle", "status", "postId", "createdAt"],
          description: "Overview of a content brief.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["briefs", "organization"],
    description: "The project's recent content briefs and the workspace they belong to.",
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
            prompt: { type: "string", description: "Prompt text the engines answered." },
            title: {
              type: ["string", "null"],
              description: "Suggested headline for an article that could win this prompt, or `null`.",
            },
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
                status: {
                  type: "string",
                  enum: ["draft", "approved", "writing", "completed", "failed"],
                  description:
                    "`draft` until approved, `approved` or `writing` while the writer drafts the post, `completed` once the draft post is written, `failed` when the last writer run failed.",
                },
                postId: {
                  type: ["string", "null"],
                  description: "Draft post created for the brief. Null when none is linked.",
                },
                workingTitle: {
                  type: ["string", "null"],
                  description: "Planned article title, or `null` when the brief has none.",
                },
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
            claim: {
              type: ["object", "null"],
              properties: {
                agent: { type: "string", description: "Name of the agent writing the article." },
                expiresAt: { type: "string", description: "ISO timestamp when the claim lapses unless renewed." },
              },
              required: ["agent", "expiresAt"],
              description:
                "Set while an agent holds a claim on it with claimGeoContent. Notra's writer and Autopilot leave it alone until the claim is released or expires. Null when unclaimed.",
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
                      url: {
                        type: ["string", "null"],
                        description: "URL of the page or post, or `null` when the post has no public URL.",
                      },
                      title: { type: "string", description: "Title of the page or post." },
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
            title: {
              type: ["string", "null"],
              description: "Suggested headline for an article that could win this prompt, or `null`.",
            },
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
                  query: { type: "string", description: "Google search query from Search Console." },
                  clicks: { type: "number", description: "Google clicks for this query." },
                  impressions: { type: "number", description: "Google impressions for this query." },
                  position: { type: "number", description: "Average Google position for this query." },
                  page: { type: "string", description: "Page Google showed most for this query." },
                  pagePosition: { type: "number", description: "Google position of that page for this query." },
                  pageImpressions: { type: "number", description: "Impressions of that page for this query." },
                },
                required: ["query", "clicks", "impressions", "position"],
              },
              description: "Search Console queries the suggestion was derived from.",
            },
            brief: {
              type: ["object", "null"],
              properties: {
                briefId: { type: "string", description: "Use with getGeoContentBrief and approveGeoContentBrief." },
                status: {
                  type: "string",
                  enum: ["draft", "approved", "writing", "completed", "failed"],
                  description:
                    "`draft` until approved, `approved` or `writing` while the writer drafts the post, `completed` once the draft post is written, `failed` when the last writer run failed.",
                },
                postId: {
                  type: ["string", "null"],
                  description: "Draft post created for the brief. Null when none is linked.",
                },
                workingTitle: {
                  type: ["string", "null"],
                  description: "Planned article title, or `null` when the brief has none.",
                },
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
            claim: {
              type: ["object", "null"],
              properties: {
                agent: { type: "string", description: "Name of the agent writing the article." },
                expiresAt: { type: "string", description: "ISO timestamp when the claim lapses unless renewed." },
              },
              required: ["agent", "expiresAt"],
              description:
                "Set while an agent holds a claim on it with claimGeoContent. Notra's writer and Autopilot leave it alone until the claim is released or expires. Null when unclaimed.",
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
                      url: {
                        type: ["string", "null"],
                        description: "URL of the page or post, or `null` when the post has no public URL.",
                      },
                      title: { type: "string", description: "Title of the page or post." },
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
                "Whether to create a page or work on existing ones, from how well the brand's sitemap pages and posts already cover the gap.",
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
                status: {
                  type: "string",
                  enum: ["draft", "approved", "writing", "completed", "failed"],
                  description:
                    "`draft` until approved, `approved` or `writing` while the writer drafts the post, `completed` once the draft post is written, `failed` when the last writer run failed.",
                },
                postId: {
                  type: ["string", "null"],
                  description: "Draft post created for the brief. Null when none is linked.",
                },
                workingTitle: {
                  type: ["string", "null"],
                  description: "Planned article title, or `null` when the brief has none.",
                },
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
            claim: {
              type: ["object", "null"],
              properties: {
                agent: { type: "string", description: "Name of the agent writing the article." },
                expiresAt: { type: "string", description: "ISO timestamp when the claim lapses unless renewed." },
              },
              required: ["agent", "expiresAt"],
              description:
                "Set while an agent holds a claim on it with claimGeoContent. Notra's writer and Autopilot leave it alone until the claim is released or expires. Null when unclaimed.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["promptGaps", "searchGaps", "aiSearchGaps", "hasScanData", "snapshotReady", "organization"],
    description:
      "The project's content gaps from scan answers, Search Console and AI web searches, and the workspace they belong to.",
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
          description: "An AI engine that scans can run on.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["engines", "organization"],
    description: "AI engines the organization can track and the workspace they belong to.",
  },
  listGeoNameCollisions: {
    type: "object",
    properties: {
      notConfusedWith: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Entry id." },
            name: { type: "string", description: "Name of the other product, usually the same as yours." },
            domain: { type: "string", description: "Domain of the other product, such as `acme.io`." },
            status: {
              type: "string",
              enum: ["pending", "accepted", "dismissed"],
              description:
                "`accepted` entries are applied to mention detection; `pending` ones are suggestions waiting for review.",
            },
            source: {
              type: "string",
              enum: ["manual", "scan"],
              description: "`manual` when added by hand, `scan` when a scan suggested it from cited sources.",
            },
            evidenceUrl: {
              type: ["string", "null"],
              description: "Cited page that made a scan suggest the entry, or `null` for manual entries.",
            },
            createdAt: { type: "string", description: "When the entry was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "name", "domain", "status", "source", "evidenceUrl", "createdAt"],
          description:
            "A different product that shares your brand's name. Answers about it don't count as mentions of you.",
        },
        description:
          "Accepted entries. Answers that name your brand but are about one of these products are not counted as mentions.",
      },
      suggestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Entry id." },
            name: { type: "string", description: "Name of the other product, usually the same as yours." },
            domain: { type: "string", description: "Domain of the other product, such as `acme.io`." },
            status: {
              type: "string",
              enum: ["pending", "accepted", "dismissed"],
              description:
                "`accepted` entries are applied to mention detection; `pending` ones are suggestions waiting for review.",
            },
            source: {
              type: "string",
              enum: ["manual", "scan"],
              description: "`manual` when added by hand, `scan` when a scan suggested it from cited sources.",
            },
            evidenceUrl: {
              type: ["string", "null"],
              description: "Cited page that made a scan suggest the entry, or `null` for manual entries.",
            },
            createdAt: { type: "string", description: "When the entry was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "name", "domain", "status", "source", "evidenceUrl", "createdAt"],
          description:
            "A different product that shares your brand's name. Answers about it don't count as mentions of you.",
        },
        description:
          "Same-named products that scan answers cited on other domains, waiting to be accepted or dismissed.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["notConfusedWith", "suggestions", "organization"],
    description: "The project's not-confused-with list and its suggestions.",
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
            id: { type: "string", description: "Persona id for the persona endpoints." },
            name: { type: "string", description: "Buyer archetype label, such as Budgeter." },
            role: { type: "string", description: "Short job title, at most two words." },
            company: { type: "string", description: "Kind of company the persona works at, with size and industry." },
            summary: { type: "string", description: "Buying priorities and situation, one point per line." },
            searchStyle: { type: "string", description: "How the persona writes to AI chats, one point per line." },
            profile: {
              type: "object",
              properties: {
                goals: { type: "array", items: { type: "string" }, description: "What the persona wants to achieve." },
                painPoints: {
                  type: "array",
                  items: { type: "string" },
                  description: "Problems the persona is trying to solve.",
                },
                currentStack: {
                  type: "array",
                  items: { type: "string" },
                  description: "Tools and vendors the persona uses today.",
                },
                buyingTriggers: {
                  type: "array",
                  items: { type: "string" },
                  description: "Events that push the persona to look for a new solution.",
                },
                objections: {
                  type: "array",
                  items: { type: "string" },
                  description: "Concerns that make the persona hesitate to buy.",
                },
              },
              required: ["goals", "painPoints", "currentStack", "buyingTriggers", "objections"],
              description: "Structured buyer profile of the persona.",
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
            createdAt: { type: "string", description: "When the persona was created, as an ISO 8601 timestamp." },
            updatedAt: { type: "string", description: "When the persona last changed, as an ISO 8601 timestamp." },
            memories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", description: "Memory id." },
                  kind: {
                    type: "string",
                    enum: ["background", "experience", "preference", "constraint"],
                    description:
                      "`background` for career and company facts, `experience` for past events with tools or vendors, `preference` for how they like to work and buy, `constraint` for budget, compliance or team limits.",
                  },
                  content: { type: "string", description: "The fact, written in the first person." },
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
          description: "A simulated buyer persona that plays conversations against AI engines.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "personas", "organization"],
    description: "The project's personas and the workspace they belong to.",
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
            scanId: { type: "string", description: "Id of the scan that captured this answer." },
            answerExcerpt: { type: "string", description: "Up to 300 characters of the stored answer excerpt." },
            sourceDomains: {
              type: "array",
              items: { type: "string" },
              maxItems: 10,
              description: "Up to 10 distinct citation domains. Use the detail endpoint for full sources.",
            },
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
            "scanId",
            "answerExcerpt",
            "sourceDomains",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "results", "nextCursor", "organization"],
    description: "A page of compact latest answers per tracked prompt and engine.",
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
            prompt: { type: "string", description: "Question asked to AI engines during scans." },
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
              deprecated: true,
              description: "Deprecated: prompt tags were removed. Always empty; a future API version drops the field.",
            },
            createdAt: {
              type: ["string", "null"],
              description: "When the custom prompt was added. `null` for auto prompts.",
            },
          },
          required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
          description: "A prompt tracked in the project's scans.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "prompts", "organization"],
    description: "The project's tracked prompts and the workspace they belong to.",
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
            source: {
              type: "string",
              enum: ["search_console"],
              description: "Where the suggestion came from, which is always Google Search Console.",
            },
            keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  query: { type: "string", description: "Google search query from Search Console." },
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
            createdAt: { type: "string", description: "When the suggestion was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "prompt", "title", "source", "keywords", "createdAt"],
          description: "A prompt suggested from Search Console queries, pending review.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["suggestions", "organization"],
    description: "Pending prompt suggestions and the workspace they belong to.",
  },
  listGeoScans: {
    type: "object",
    properties: {
      scans: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Scan id, usable with `GET /v1/projects/{projectId}/geo/scans/{scanId}`.",
            },
            projectId: { type: "string", description: "Project the scan belongs to." },
            status: {
              type: "string",
              enum: ["running", "completed", "failed"],
              description: "`running` while answers are being collected, then `completed` or `failed`.",
            },
            startedAt: { type: "string", description: "When the scan started, as an ISO 8601 timestamp." },
            finishedAt: {
              type: ["string", "null"],
              description: "When the scan completed or failed, or `null` while running.",
            },
            createdAt: { type: "string", description: "When the scan record was created, as an ISO 8601 timestamp." },
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
                      engine: { type: "string", description: "Engine id, such as `openai/chatgpt`." },
                      plannedChecks: {
                        type: ["integer", "null"],
                        minimum: 0,
                        description:
                          "Answers planned for this engine, or `null` when the plan has no per-engine breakdown.",
                      },
                      completedChecks: {
                        type: "integer",
                        minimum: 0,
                        description: "Answers stored for this engine so far.",
                      },
                      mentionCount: {
                        type: "integer",
                        minimum: 0,
                        description: "Stored answers from this engine that mentioned the tracked brand.",
                      },
                      failedChecks: {
                        type: "integer",
                        minimum: 0,
                        description: "Planned answers for this engine that failed and were not stored.",
                      },
                    },
                    required: ["engine", "plannedChecks", "completedChecks", "mentionCount", "failedChecks"],
                  },
                  description:
                    "The same counts per engine, sorted by engine id. Covers planned engines and engines with stored answers.",
                },
              },
              required: ["plannedChecks", "completedChecks", "mentionCount", "failedChecks", "engines"],
              description: "Answer counts for the scan, overall and per engine.",
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
          description: "A GEO scan run and its progress.",
        },
        description: "Scans for the project, most recently started first.",
      },
      pagination: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, description: "Scans per page, as requested." },
          currentPage: { type: "integer", minimum: 1, description: "Page number returned, starting at 1." },
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
        description: "Page position and totals for the scan list.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["scans", "pagination", "organization"],
    description: "One page of the project's scans and the workspace they belong to.",
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
            scanId: { type: "string", description: "Scan that captured the answer." },
            promptId: {
              type: "string",
              description:
                "Prompt the answer belongs to: `custom-` plus the prompt id for custom prompts, the slug for auto prompts, `sequence-` plus the sequence id for sequences and `persona-` plus the persona id for personas.",
            },
            prompt: { type: "string", description: "Prompt text." },
            engine: { type: "string", description: "Answer engine id, as listed by listGeoEngines." },
            language: {
              type: "string",
              description: "Language the prompt was asked in, such as `English`. An empty string means English.",
            },
            capturedAt: { type: "string", description: "ISO timestamp when the answer was captured." },
            answer: { type: "string", description: "Full answer text." },
            excerpt: { type: "string", description: "Part of the answer around the brand mention." },
          },
          required: ["id", "scanId", "promptId", "prompt", "engine", "language", "capturedAt", "answer", "excerpt"],
        },
        description:
          "Answers that mentioned the brand negatively, newest first, 25 per page. Covers every tracked language, sequences and personas, with one answer per conversation: its first turn that mentions the brand.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["items", "nextCursor", "organization"],
    description: "A page of answers that mentioned the brand negatively.",
  },
  listGeoSequences: {
    type: "object",
    properties: {
      sequences: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Sequence id for the update, delete and run endpoints." },
            name: { type: "string", description: "Display name of the sequence." },
            steps: {
              type: "array",
              items: { type: "string" },
              description: "Messages sent in order as one conversation with each engine.",
            },
            enabled: { type: "boolean", description: "Whether project scans play this conversation." },
            createdAt: { type: "string", description: "When the sequence was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "name", "steps", "enabled", "createdAt"],
          description: "A multi-turn conversation played against each engine in project scans.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["sequences", "organization"],
    description: "The project's multi-turn sequences and the workspace they belong to.",
  },
  listGeoShelfSources: {
    type: "object",
    properties: {
      sources: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", minLength: 1, description: "Shelf source id." },
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
                      "manual: a teammate set the status. fetch: Notra read the page after a scan and found the brand there or not.",
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
                id: { type: "string", minLength: 1, description: "Ticket id." },
                createdByUserId: { type: ["string", "null"], minLength: 1, description: "User who opened the ticket." },
                resolvedAt: {
                  type: ["string", "null"],
                  format: "date-time",
                  description:
                    "When the ticket was closed (won, lost or dismissed). Kept when it moves between closed statuses; `null` while open.",
                },
                createdAt: { type: "string", format: "date-time", description: "When the ticket was opened." },
                updatedAt: { type: "string", format: "date-time", description: "When the ticket last changed." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["sources", "nextOffset", "organization"],
    description:
      "A page of the project's shelf sources, which are the pages AI answers cite, with their brand placements and listing tickets.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "journeys", "organization"],
    description: "AI crawler and AI referral journeys, each a group of requests from one agent session.",
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
            path: { type: "string", description: "Requested URL path." },
            host: { type: "string", description: "Hostname the request was sent to." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "pages", "organization"],
    description: "AI crawler and AI referral requests per page, source and visitor type.",
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
          description: "A GitHub repository connected to Notra.",
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
            id: {
              type: "string",
              description: "ID of the Linear integration, used in integrations.linear when generating posts.",
            },
            displayName: { type: "string", description: "Label for the integration shown in Notra." },
            linearOrganizationId: { type: "string", description: "ID of the connected Linear workspace." },
            linearOrganizationName: {
              type: ["string", "null"],
              description: "Name of the connected Linear workspace, or null when unknown.",
            },
            linearTeamId: {
              type: ["string", "null"],
              description: "Linear team that issues are read from. Null means every team in the Linear workspace.",
            },
            linearTeamName: {
              type: ["string", "null"],
              description: "Name of the Linear team issues are read from, or null when linearTeamId is null.",
            },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["github", "slack", "linear", "organization"],
    description: "The organization's connected integrations.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      authors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Pass this ID in metadata.authorIds when updating a post." },
            slug: {
              type: "string",
              description: "Stable author handle; hosted sites list the author's posts at /author/{slug}.",
            },
            name: { type: "string", description: "Author's display name." },
            title: { type: ["string", "null"], description: "Job title shown next to the name, or null when not set." },
            bio: { type: ["string", "null"], description: "Short author bio, or null when not set." },
            avatarUrl: { type: ["string", "null"], description: "Avatar image URL, or null when not set." },
            url: { type: ["string", "null"], description: "Author's website." },
            x: { type: ["string", "null"], description: "X profile URL, or null when not set." },
            linkedin: { type: ["string", "null"], description: "LinkedIn profile URL, or null when not set." },
            github: { type: ["string", "null"], description: "GitHub profile URL, or null when not set." },
            youtube: { type: ["string", "null"], description: "YouTube channel URL, or null when not set." },
            bluesky: { type: ["string", "null"], description: "Bluesky profile URL, or null when not set." },
            mastodon: { type: ["string", "null"], description: "Mastodon profile URL, or null when not set." },
            threads: { type: ["string", "null"], description: "Threads profile URL, or null when not set." },
            instagram: { type: ["string", "null"], description: "Instagram profile URL, or null when not set." },
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
        description: "Every author in the organization, sorted by name.",
      },
    },
    required: ["organization", "authors"],
    description: "Authors that can be credited on posts.",
  },
  listPostComments: {
    type: "object",
    properties: {
      threads: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Thread ID, used to reply and resolve" },
            quote: { type: ["string", "null"], description: "The passage of the post the thread is about" },
            author: { type: "string" },
            body: { type: "string" },
            leftOn: {
              type: "string",
              enum: ["preview", "editor"],
              description: "Whether it was left on the post's Notra Sites preview or in the editor",
            },
            resolved: { type: "boolean" },
            deleted: {
              type: "boolean",
              description: "The thread's first comment was deleted; only its replies remain",
            },
            createdAt: { type: "string" },
            replies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  author: { type: "string" },
                  body: { type: "string" },
                  createdAt: { type: "string" },
                },
                required: ["id", "author", "body", "createdAt"],
              },
            },
          },
          required: ["id", "quote", "author", "body", "leftOn", "resolved", "deleted", "createdAt", "replies"],
        },
      },
      openThreads: { type: "integer" },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["threads", "openThreads", "organization"],
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      posts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID of the post, used as postId in the /v1/posts endpoints." },
            title: { type: "string", description: "Post title." },
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
              description:
                "Kind of content. image posts hold a rendered image instead of text; only blog_post and changelog have a slug and metadata.",
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
                tags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Post tags in display order, or empty when none are set.",
                },
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
                      id: {
                        type: "string",
                        description:
                          "Author ID from GET /v1/posts/authors, or a site:<id> ref for an author from the post's Notra Sites site.",
                      },
                      slug: {
                        type: "string",
                        description: "Stable author handle; hosted sites list the author's posts at /author/{slug}.",
                      },
                      name: { type: "string", description: "Author's display name." },
                      title: {
                        type: ["string", "null"],
                        description: "Job title shown next to the name, or null when not set.",
                      },
                      avatarUrl: { type: ["string", "null"], description: "Avatar image URL, or null when not set." },
                      url: { type: ["string", "null"], description: "Author's website." },
                      x: { type: ["string", "null"], description: "X profile URL, or null when not set." },
                      linkedin: {
                        type: ["string", "null"],
                        description: "LinkedIn profile URL, or null when not set.",
                      },
                      github: { type: ["string", "null"], description: "GitHub profile URL, or null when not set." },
                      youtube: { type: ["string", "null"], description: "YouTube channel URL, or null when not set." },
                      bluesky: { type: ["string", "null"], description: "Bluesky profile URL, or null when not set." },
                      mastodon: {
                        type: ["string", "null"],
                        description: "Mastodon profile URL, or null when not set.",
                      },
                      threads: { type: ["string", "null"], description: "Threads profile URL, or null when not set." },
                      instagram: {
                        type: ["string", "null"],
                        description: "Instagram profile URL, or null when not set.",
                      },
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
            status: {
              type: "string",
              enum: ["draft", "published"],
              description:
                "Publishing state of the post in Notra, where GET /v1/posts only returns published posts unless its status filter includes draft.",
            },
            createdAt: { type: "string", description: "When the post was created, as an ISO 8601 timestamp." },
            updatedAt: { type: "string", description: "When the post was last changed, as an ISO 8601 timestamp." },
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
          description: "A post with its content and site metadata.",
        },
        description: "Posts on this page matching the filters, in the requested sort order.",
      },
      pagination: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, description: "Maximum number of posts per page." },
          currentPage: { type: "integer", minimum: 1, description: "Page returned, starting at 1." },
          nextPage: { type: ["integer", "null"], minimum: 1, description: "Null on the last page." },
          previousPage: { type: ["integer", "null"], minimum: 1, description: "Null on the first page." },
          totalPages: { type: "integer", minimum: 1, description: "At least 1, even when no posts match." },
          totalItems: { type: "integer", minimum: 0, description: "Posts matching the filters across all pages." },
        },
        required: ["limit", "currentPage", "nextPage", "previousPage", "totalPages", "totalItems"],
        description: "Page position and totals for the post list.",
      },
    },
    required: ["organization", "posts", "pagination"],
    description: "One page of posts and the pagination state.",
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
            name: { type: "string", description: "Project display name." },
            brandSettingsId: {
              type: "string",
              description: "ID of the brand identity linked to the project, as listed by GET /v1/brand-identities.",
            },
            createdAt: { type: "string", description: "When the project was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "name", "brandSettingsId", "createdAt"],
          description: "A GEO project tracking one brand identity.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["projects", "organization"],
    description: "The organization's GEO projects and the workspace they belong to.",
  },
  listScheduleRuns: {
    type: "object",
    properties: {
      runs: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "The run's ID." },
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
            startedAt: { type: "string", description: "When the run started, as an ISO 8601 timestamp." },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["runs", "organization"],
    description: "The schedule's most recent runs.",
  },
  listSchedules: {
    type: "object",
    properties: {
      schedules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "The schedule's ID, used as scheduleId in /v1/schedules/{scheduleId}." },
            organizationId: { type: "string", description: "ID of the organization that owns the schedule." },
            name: { type: "string", description: "Display name shown in the dashboard." },
            sourceType: { type: "string", enum: ["cron"], description: "Always cron for schedules." },
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
                  description: "When the schedule runs, in UTC.",
                },
              },
              required: ["cron"],
              description: "Timing settings for the schedule.",
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
              description: "Data sources each run reads from.",
            },
            outputType: {
              type: "string",
              enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"],
              description: "Type of content each run generates.",
            },
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
                  properties: {
                    slack: {
                      type: "boolean",
                      description: "Post to the organization's Slack notification channel after a successful run.",
                    },
                    email: { type: "boolean", description: "Email the workspace owners after a successful run." },
                  },
                  required: ["slack", "email"],
                  description:
                    "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
                },
              },
              description:
                "Writing and notification settings for generated content, or null or absent when none are set.",
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
            createdAt: { type: "string", description: "When the schedule was created, as an ISO 8601 timestamp." },
            updatedAt: { type: "string", description: "When the schedule was last changed, as an ISO 8601 timestamp." },
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
          description: "A recurring automation that generates content on a cron schedule.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["schedules", "repositoryMap", "organization"],
    description: "The workspace's schedules with labels for the repositories they target.",
  },
  listSiteAuthors: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: {
          id: { type: "string", description: "The Site's ID." },
          name: { type: "string", description: "Display name of the Site." },
        },
        required: ["id", "name"],
        description: "The Site the request applied to.",
      },
      authors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "The author's id in blog.json. Posts name the author with it and its author page lives at {blogMount}/author/{id}.",
            },
            ref: {
              type: "string",
              description:
                "Pass this in metadata.authorIds of PATCH /v1/posts/{postId} to credit the author on a blog post that publishes to this site.",
            },
            name: { type: "string", description: "The author's display name." },
            title: { type: ["string", "null"], description: "The author's role or job title, or null when not set." },
            bio: {
              type: ["string", "null"],
              description: "Short biography shown on the author page, or null when not set.",
            },
            avatar: {
              type: ["string", "null"],
              description: "As written in blog.json: a site path such as /images/jane.png or an https URL.",
            },
            avatarUrl: { type: ["string", "null"], description: "The avatar as a full URL on the live site." },
            url: {
              type: ["string", "null"],
              description: "The author's personal website as an https URL, or null when not set.",
            },
            x: { type: ["string", "null"], description: "The author's X profile URL, or null when not set." },
            linkedin: {
              type: ["string", "null"],
              description: "The author's LinkedIn profile URL, or null when not set.",
            },
            github: { type: ["string", "null"], description: "The author's GitHub profile URL, or null when not set." },
            youtube: {
              type: ["string", "null"],
              description: "The author's YouTube channel URL, or null when not set.",
            },
            bluesky: {
              type: ["string", "null"],
              description: "The author's Bluesky profile URL, or null when not set.",
            },
            mastodon: {
              type: ["string", "null"],
              description: "The author's Mastodon profile URL, or null when not set.",
            },
            threads: {
              type: ["string", "null"],
              description: "The author's Threads profile URL, or null when not set.",
            },
            instagram: {
              type: ["string", "null"],
              description: "The author's Instagram profile URL, or null when not set.",
            },
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
    description:
      "The Site's authors and author page layout in blog.json after the request, including unpublished changes.",
  },
  listSiteDeployments: {
    type: "object",
    properties: {
      deployments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "The deployment's ID, used as deploymentId in deployment routes." },
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
            branch: { type: "string", description: "Git branch that was built." },
            commitSha: { type: "string", description: "Git commit SHA that was built." },
            commitMessage: {
              type: ["string", "null"],
              description: "Message of the built commit, or null when unknown.",
            },
            commitAuthor: {
              type: ["string", "null"],
              description:
                "Name of the commit's author, or the GitHub login of the pull request author for pull request builds, or null when unknown.",
            },
            pullRequestNumber: {
              type: ["integer", "null"],
              description:
                "GitHub pull request the deployment builds, or null when it isn't built from a pull request.",
            },
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
                  severity: {
                    type: "string",
                    enum: ["error", "warning"],
                    description: "error fails the build; warning is reported but the build continues.",
                  },
                  file: {
                    type: ["string", "null"],
                    description: "File the diagnostic points at, or null when it has none.",
                  },
                  line: {
                    type: "integer",
                    description: "Line in the file, counted from 1, or absent when the diagnostic has no position.",
                  },
                  column: {
                    type: "integer",
                    description: "Column in the line, counted from 1, or absent when the diagnostic has no position.",
                  },
                  code: { type: "string", description: "Machine-readable diagnostic kind." },
                  message: { type: "string", description: "Human-readable explanation." },
                },
                required: ["severity", "file", "code", "message"],
              },
              description: "Compiler errors and warnings with file and line.",
            },
            createdAt: { type: "string", description: "When the deployment was queued, as an ISO 8601 timestamp." },
            startedAt: {
              type: ["string", "null"],
              description:
                "When the build started, as an ISO 8601 timestamp, or null while queued or when it never ran.",
            },
            finishedAt: {
              type: ["string", "null"],
              description:
                "When the deployment reached a final status, as an ISO 8601 timestamp, or null while in progress.",
            },
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
          description: "A production or preview build of the Site.",
        },
        description: "The newest deployments, plus any that are live.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["deployments", "organization"],
    description: "The Site's recent deployments.",
  },
  listSites: {
    type: "object",
    properties: {
      sites: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "The Site's ID, used as siteId in /v1/sites/{siteId}." },
            name: { type: "string", description: "Display name of the Site." },
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
    description: "Every Notra Site in the workspace.",
  },
  listSkills: {
    type: "object",
    properties: {
      skills: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "The skill's ID." },
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
            updatedAt: { type: "string", description: "When the skill was last changed, as an ISO 8601 timestamp." },
          },
          required: ["id", "name", "description", "isSystem", "updatedAt"],
          description: "A skill without its instructions.",
        },
        description: "Skills sorted by name, without their content.",
      },
    },
    required: ["skills"],
    description: "The organization's skills, including built-in ones.",
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
            endpointId: { type: "string", description: "ID of the endpoint the delivery is sent to." },
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
              description: "Type of event the delivery carries.",
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
            createdAt: { type: "string", description: "When the delivery was created, as an ISO 8601 timestamp." },
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
    description: "A page of webhook deliveries.",
  },
  listWebhookEndpoints: {
    type: "object",
    properties: {
      endpoints: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "The endpoint's ID, used as endpointId in endpoint routes." },
            organizationId: { type: "string", description: "ID of the organization that owns the endpoint." },
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
            createdAt: { type: "string", description: "When the endpoint was created, as an ISO 8601 timestamp." },
          },
          required: ["id", "organizationId", "url", "events", "enabled", "createdAt"],
        },
        description: "Every webhook endpoint in the workspace.",
      },
    },
    required: ["endpoints"],
    description: "The workspace's webhook endpoints.",
  },
  patchSkill: {
    type: "object",
    properties: {
      skill: {
        allOf: [
          {
            type: "object",
            properties: {
              id: { type: "string", description: "The skill's ID." },
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
              updatedAt: { type: "string", description: "When the skill was last changed, as an ISO 8601 timestamp." },
            },
            required: ["id", "name", "description", "isSystem", "updatedAt"],
            description: "A skill without its instructions.",
          },
          {
            type: "object",
            properties: {
              content: { type: "string", description: "Full skill instructions, typically Markdown." },
              createdAt: { type: "string", description: "When the skill was created, as an ISO 8601 timestamp." },
            },
            required: ["content", "createdAt"],
          },
        ],
        description: "A reusable set of instructions for Notra's AI agents.",
      },
    },
    required: ["skill"],
    description: "The skill after the update.",
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
                    engine: { type: "string", description: "Engine id." },
                    mentioned: { type: "boolean", description: "Whether the answer mentioned the brand." },
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
                  properties: {
                    name: { type: "string", description: "Competitor name." },
                    engines: { type: "number", description: "Engines whose answer named this competitor." },
                  },
                  required: ["name", "engines"],
                },
                description: "Competitors named in the answers, with the number of engines naming each.",
              },
              citedDomains: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    domain: { type: "string", description: "Cited domain." },
                    engines: { type: "number", description: "Engines whose answer cited this domain." },
                  },
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
      status: {
        type: "string",
        enum: ["draft", "approved", "writing", "completed", "failed"],
        description:
          "`draft` until approved, `approved` or `writing` while the writer drafts the post, `completed` once the draft post is written, `failed` when the last writer run failed.",
      },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["briefId", "brief", "status", "runId", "postId", "organization"],
    description: "The planned or reused brief, its writer state and the workspace it belongs to.",
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
      pullRequestNumber: { type: "integer", description: "Number of the publishing pull request on GitHub." },
      pullRequestUrl: { type: "string", description: "URL of the publishing pull request on GitHub." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["operation", "branchName", "path", "pullRequestNumber", "pullRequestUrl", "organization"],
    description: "The pull request that publishes the post to the Site's repository.",
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
    description: "Whether the Site's unpublished blog.json changes were committed and a production deployment queued.",
  },
  redeploySiteDeployment: {
    type: "object",
    properties: {
      deployment: {
        type: "object",
        properties: {
          id: { type: "string", description: "The deployment's ID, used as deploymentId in deployment routes." },
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
          branch: { type: "string", description: "Git branch that was built." },
          commitSha: { type: "string", description: "Git commit SHA that was built." },
          commitMessage: {
            type: ["string", "null"],
            description: "Message of the built commit, or null when unknown.",
          },
          commitAuthor: {
            type: ["string", "null"],
            description:
              "Name of the commit's author, or the GitHub login of the pull request author for pull request builds, or null when unknown.",
          },
          pullRequestNumber: {
            type: ["integer", "null"],
            description: "GitHub pull request the deployment builds, or null when it isn't built from a pull request.",
          },
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
                severity: {
                  type: "string",
                  enum: ["error", "warning"],
                  description: "error fails the build; warning is reported but the build continues.",
                },
                file: {
                  type: ["string", "null"],
                  description: "File the diagnostic points at, or null when it has none.",
                },
                line: {
                  type: "integer",
                  description: "Line in the file, counted from 1, or absent when the diagnostic has no position.",
                },
                column: {
                  type: "integer",
                  description: "Column in the line, counted from 1, or absent when the diagnostic has no position.",
                },
                code: { type: "string", description: "Machine-readable diagnostic kind." },
                message: { type: "string", description: "Human-readable explanation." },
              },
              required: ["severity", "file", "code", "message"],
            },
            description: "Compiler errors and warnings with file and line.",
          },
          createdAt: { type: "string", description: "When the deployment was queued, as an ISO 8601 timestamp." },
          startedAt: {
            type: ["string", "null"],
            description: "When the build started, as an ISO 8601 timestamp, or null while queued or when it never ran.",
          },
          finishedAt: {
            type: ["string", "null"],
            description:
              "When the deployment reached a final status, as an ISO 8601 timestamp, or null while in progress.",
          },
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
        description: "A production or preview build of the Site.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["deployment", "organization"],
    description: "The deployment that was queued.",
  },
  releaseGeoContentClaim: {
    type: "object",
    properties: {
      sourceKind: {
        type: "string",
        enum: ["manual", "gap", "prompt", "search_console", "ai_search"],
        description: "Kind of the claimed item. manual means a brief that was not planned from a gap.",
      },
      sourceId: { type: "string", description: "Gap id, or the brief id when sourceKind is manual." },
      released: {
        type: "boolean",
        description: "True when your claim was removed; false when there was none to release.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["sourceKind", "sourceId", "released", "organization"],
  },
  replyToPostComment: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
  reportGeoContentAgentFailure: {
    type: "object",
    properties: {
      sourceKind: {
        type: "string",
        enum: ["manual", "gap", "prompt", "search_console", "ai_search"],
        description: "Kind of the claimed item. manual means a brief that was not planned from a gap.",
      },
      sourceId: { type: "string", description: "Gap id, or the brief id when sourceKind is manual." },
      released: {
        type: "boolean",
        description: "True when your claim was removed; false when there was none to release.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["sourceKind", "sourceId", "released", "organization"],
  },
  resolvePostComments: {
    type: "object",
    properties: {
      resolved: { type: "array", items: { type: "string" } },
      skipped: {
        type: "array",
        items: { type: "string" },
        description: "Threads that were already resolved, replies or not on this post",
      },
    },
    required: ["resolved", "skipped"],
  },
  restoreGeoPersona: {
    type: "object",
    properties: {
      persona: {
        type: "object",
        properties: {
          id: { type: "string", description: "Persona id for the persona endpoints." },
          name: { type: "string", description: "Buyer archetype label, such as Budgeter." },
          role: { type: "string", description: "Short job title, at most two words." },
          company: { type: "string", description: "Kind of company the persona works at, with size and industry." },
          summary: { type: "string", description: "Buying priorities and situation, one point per line." },
          searchStyle: { type: "string", description: "How the persona writes to AI chats, one point per line." },
          profile: {
            type: "object",
            properties: {
              goals: { type: "array", items: { type: "string" }, description: "What the persona wants to achieve." },
              painPoints: {
                type: "array",
                items: { type: "string" },
                description: "Problems the persona is trying to solve.",
              },
              currentStack: {
                type: "array",
                items: { type: "string" },
                description: "Tools and vendors the persona uses today.",
              },
              buyingTriggers: {
                type: "array",
                items: { type: "string" },
                description: "Events that push the persona to look for a new solution.",
              },
              objections: {
                type: "array",
                items: { type: "string" },
                description: "Concerns that make the persona hesitate to buy.",
              },
            },
            required: ["goals", "painPoints", "currentStack", "buyingTriggers", "objections"],
            description: "Structured buyer profile of the persona.",
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
          createdAt: { type: "string", description: "When the persona was created, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the persona last changed, as an ISO 8601 timestamp." },
          memories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", description: "Memory id." },
                kind: {
                  type: "string",
                  enum: ["background", "experience", "preference", "constraint"],
                  description:
                    "`background` for career and company facts, `experience` for past events with tools or vendors, `preference` for how they like to work and buy, `constraint` for budget, compliance or team limits.",
                },
                content: { type: "string", description: "The fact, written in the first person." },
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
        description: "A simulated buyer persona that plays conversations against AI engines.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["persona", "organization"],
    description: "The updated or restored persona and the workspace it belongs to.",
  },
  retryWebhookDelivery: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "ID of the endpoint that was deleted or the delivery that was queued for retry.",
      },
    },
    required: ["id"],
    description: "Confirms which resource the request acted on.",
  },
  rotateGeoIngestToken: {
    type: "object",
    properties: {
      ingestUrl: { type: "string", description: "Endpoint the tracking snippet posts events to." },
      snippet: { type: "string", description: "Install snippet for the default framework (Next.js)." },
      snippets: {
        type: "object",
        properties: {
          next: { type: "string", description: "Next.js proxy snippet." },
          nuxt: { type: "string", description: "Nuxt server middleware snippet." },
          netlify: { type: "string", description: "Netlify Edge Function snippet." },
          tanstack: { type: "string", description: "TanStack Start middleware snippet." },
          astro: { type: "string", description: "Astro middleware snippet." },
          sveltekit: { type: "string", description: "SvelteKit hooks snippet." },
          reactRouter: { type: "string", description: "React Router middleware snippet." },
        },
        required: ["next", "nuxt", "netlify", "tanstack", "astro", "sveltekit", "reactRouter"],
        description:
          "Install snippets per framework, each of which reads the token from an environment variable instead of embedding it.",
      },
      drainUrls: {
        type: "object",
        properties: {
          vercel: { type: "string", description: "Vercel log drain endpoint." },
          cloudflare: { type: "string", description: "Cloudflare Logpush endpoint." },
        },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
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
    description: "A newly issued tracking token with its install instructions.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["checks", "mentions", "engines", "organization"],
    description:
      "Outcome of playing the persona once against the project's engines, plus any scan queued for consumer apps.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["checks", "mentions", "engines", "organization"],
    description:
      "Outcome of playing the sequence once against the project's engines, plus any scan queued for consumer apps.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["runId", "organization"],
    description: "The run that was started for the schedule.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      schedule: {
        anyOf: [
          {
            type: "object",
            properties: {
              postId: { type: "string", description: "ID of the scheduled post." },
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
                    id: { type: "string", description: "ID of this destination's publication." },
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
                          properties: {
                            destination: {
                              type: "string",
                              enum: ["notra"],
                              description: "Marks the post as published in Notra.",
                            },
                          },
                          required: ["destination"],
                        },
                        {
                          type: "object",
                          properties: {
                            destination: {
                              type: "string",
                              enum: ["github"],
                              description: "Opens, and optionally merges, a pull request.",
                            },
                            repositoryId: {
                              type: "string",
                              description: "GitHub integration ID the pull request goes to.",
                            },
                            merge: {
                              type: "boolean",
                              description:
                                "Whether the pull request is merged at the scheduled time. When false, it is only opened or updated.",
                            },
                          },
                          required: ["destination", "repositoryId", "merge"],
                        },
                        {
                          type: "object",
                          properties: {
                            destination: {
                              type: "string",
                              enum: ["social"],
                              description: "Posts to a connected X or LinkedIn account.",
                            },
                            accountId: { type: "string", description: "Connected social account ID." },
                          },
                          required: ["destination", "accountId"],
                        },
                      ],
                      description:
                        "Settings for the destination, which are the GitHub integration and merge choice or the social account, and none for notra.",
                    },
                    status: {
                      type: "string",
                      enum: ["scheduled", "publishing", "published", "failed", "canceled"],
                      description:
                        "scheduled → publishing → published or failed. Failed destinations are retried automatically for transient errors before they end up failed.",
                    },
                    scheduledAt: {
                      type: "string",
                      format: "date-time",
                      description:
                        "When this destination publishes as an ISO 8601 UTC timestamp, which matches the schedule's scheduledAt.",
                    },
                    timeZone: {
                      type: "string",
                      description: "IANA time zone the schedule was picked in, for display only.",
                    },
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
            description: "When a post publishes and where it goes out.",
          },
          { type: "null" },
        ],
        description:
          "The post's latest schedule with destinations that were not canceled, listing only those destinations. It stays after they published or failed, and destinations that already published remain after a cancel. Null when the post was never scheduled or all its destinations were canceled.",
      },
    },
    required: ["organization", "schedule"],
    description: "The post's current schedule, if any.",
  },
  sendAgentSessionMessage: {
    type: "object",
    description: "The agent service's response to the message, passed through unchanged.",
  },
  startAutopilotRun: {
    type: "object",
    properties: { runId: { type: "string" }, alreadyRunning: { type: "boolean" } },
    required: ["runId", "alreadyRunning"],
  },
  startAutopilotWorkflowRun: { type: "object", properties: { runId: { type: "string" } }, required: ["runId"] },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["reportId", "alreadyRunning", "organization"],
    description: "The agent readiness scan that was started or reused.",
  },
  startSiteDeployment: {
    type: "object",
    properties: {
      deployment: {
        type: "object",
        properties: {
          id: { type: "string", description: "The deployment's ID, used as deploymentId in deployment routes." },
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
          branch: { type: "string", description: "Git branch that was built." },
          commitSha: { type: "string", description: "Git commit SHA that was built." },
          commitMessage: {
            type: ["string", "null"],
            description: "Message of the built commit, or null when unknown.",
          },
          commitAuthor: {
            type: ["string", "null"],
            description:
              "Name of the commit's author, or the GitHub login of the pull request author for pull request builds, or null when unknown.",
          },
          pullRequestNumber: {
            type: ["integer", "null"],
            description: "GitHub pull request the deployment builds, or null when it isn't built from a pull request.",
          },
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
                severity: {
                  type: "string",
                  enum: ["error", "warning"],
                  description: "error fails the build; warning is reported but the build continues.",
                },
                file: {
                  type: ["string", "null"],
                  description: "File the diagnostic points at, or null when it has none.",
                },
                line: {
                  type: "integer",
                  description: "Line in the file, counted from 1, or absent when the diagnostic has no position.",
                },
                column: {
                  type: "integer",
                  description: "Column in the line, counted from 1, or absent when the diagnostic has no position.",
                },
                code: { type: "string", description: "Machine-readable diagnostic kind." },
                message: { type: "string", description: "Human-readable explanation." },
              },
              required: ["severity", "file", "code", "message"],
            },
            description: "Compiler errors and warnings with file and line.",
          },
          createdAt: { type: "string", description: "When the deployment was queued, as an ISO 8601 timestamp." },
          startedAt: {
            type: ["string", "null"],
            description: "When the build started, as an ISO 8601 timestamp, or null while queued or when it never ran.",
          },
          finishedAt: {
            type: ["string", "null"],
            description:
              "When the deployment reached a final status, as an ISO 8601 timestamp, or null while in progress.",
          },
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
        description: "A production or preview build of the Site.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["deployment", "organization"],
    description: "The deployment that was queued.",
  },
  stopAutopilotRun: {
    type: "object",
    properties: { stopped: { type: "string", enum: ["autopilot", "custom_workflow"] } },
    required: ["stopped"],
  },
  submitFeedback: {
    type: "object",
    properties: {
      feedback: {
        type: "object",
        properties: {
          id: { type: "string", description: "The feedback's ID, used as feedbackId in /v1/feedback/{feedbackId}." },
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
          message: { type: "string", description: "The feedback itself." },
          agentClient: {
            type: ["string", "null"],
            description: "The agent or client that submitted the feedback, or null when not given.",
          },
          agentModel: { type: ["string", "null"], description: "Model the agent ran on, or null when not given." },
          toolVersion: {
            type: ["string", "null"],
            description: "Version of the tool or client that submitted it, or null when not given.",
          },
          userAgent: {
            type: ["string", "null"],
            description:
              "User agent as submitted, falling back to the request's User-Agent header, or null when neither was present.",
          },
          contextUrl: {
            type: ["string", "null"],
            description: "Page or resource the feedback is about, or null when not given.",
          },
          externalId: {
            type: ["string", "null"],
            description: "The submitter's own identifier for the user or session, or null when not given.",
          },
          idempotencyKey: {
            type: ["string", "null"],
            description: "Idempotency key sent with the submission, or null when none was sent.",
          },
          metadata: {
            type: ["object", "null"],
            additionalProperties: {},
            description: "JSON submitted with the feedback, or null.",
          },
          resolvedAt: {
            type: ["string", "null"],
            description: "When the status was last set to resolved. Cleared when it changes to another status.",
          },
          createdAt: { type: "string", description: "When the feedback was submitted, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the feedback last changed, as an ISO 8601 timestamp." },
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
        description: "A piece of feedback submitted by an agent, app or person.",
      },
      deduplicated: {
        type: "boolean",
        description:
          "True when an existing feedback was returned instead of a new one: same idempotencyKey, or without one, an identical submission within 10 minutes.",
      },
    },
    required: ["feedback", "deduplicated"],
    description: "The stored feedback and whether it matched an earlier submission.",
  },
  submitOrganizationFeedback: {
    type: "object",
    properties: {
      feedback: {
        type: "object",
        properties: {
          id: { type: "string", description: "The feedback's ID, used as feedbackId in /v1/feedback/{feedbackId}." },
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
          message: { type: "string", description: "The feedback itself." },
          agentClient: {
            type: ["string", "null"],
            description: "The agent or client that submitted the feedback, or null when not given.",
          },
          agentModel: { type: ["string", "null"], description: "Model the agent ran on, or null when not given." },
          toolVersion: {
            type: ["string", "null"],
            description: "Version of the tool or client that submitted it, or null when not given.",
          },
          userAgent: {
            type: ["string", "null"],
            description:
              "User agent as submitted, falling back to the request's User-Agent header, or null when neither was present.",
          },
          contextUrl: {
            type: ["string", "null"],
            description: "Page or resource the feedback is about, or null when not given.",
          },
          externalId: {
            type: ["string", "null"],
            description: "The submitter's own identifier for the user or session, or null when not given.",
          },
          idempotencyKey: {
            type: ["string", "null"],
            description: "Idempotency key sent with the submission, or null when none was sent.",
          },
          metadata: {
            type: ["object", "null"],
            additionalProperties: {},
            description: "JSON submitted with the feedback, or null.",
          },
          resolvedAt: {
            type: ["string", "null"],
            description: "When the status was last set to resolved. Cleared when it changes to another status.",
          },
          createdAt: { type: "string", description: "When the feedback was submitted, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the feedback last changed, as an ISO 8601 timestamp." },
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
        description: "A piece of feedback submitted by an agent, app or person.",
      },
      deduplicated: {
        type: "boolean",
        description:
          "True when an existing feedback was returned instead of a new one: same idempotencyKey, or without one, an identical submission within 10 minutes.",
      },
    },
    required: ["feedback", "deduplicated"],
    description: "The stored feedback and whether it matched an earlier submission.",
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
            name: { type: "string", description: "Name of the suggested competitor." },
            domain: {
              type: ["string", "null"],
              description: "Website domain of the suggested competitor, or `null` when the lookup found none.",
            },
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["domain", "field", "competitors", "organization"],
    description: "Competitors suggested for a website domain, which Notra does not save.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      color: {
        type: "object",
        properties: {
          id: { type: "string", description: "Pass as colorId to update or delete the color." },
          role: {
            type: "string",
            enum: ["primary", "secondary", "accent", "background", "foreground", "neutral", "custom"],
            description: "Role of the color in the palette. custom is for colors outside the standard roles.",
          },
          name: { type: ["string", "null"], description: "Display name of the color, or null when not set." },
          lightValue: { type: "string", description: "Hex color for light mode." },
          darkValue: {
            type: ["string", "null"],
            description: "Hex color for dark mode. Null when the color has no dark variant.",
          },
          usage: { type: ["string", "null"], description: "Free-text note on where the color should be used." },
        },
        required: ["id", "role", "name", "lightValue", "darkValue", "usage"],
        description: "A color in a brand identity's palette.",
      },
    },
    required: ["organization", "color"],
    description: "The created or updated brand color.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      brandIdentity: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Pass as brandIdentityId to post generation or the brandIdentityId filter of GET /v1/posts.",
          },
          name: { type: "string", description: "Display name, unique within the organization." },
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
          createdAt: { type: "string", description: "When the brand identity was created, as an ISO 8601 timestamp." },
          updatedAt: {
            type: "string",
            description: "When the brand identity was last changed, as an ISO 8601 timestamp.",
          },
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
        description: "The brand identity after the update was saved.",
      },
    },
    required: ["organization", "brandIdentity"],
    description: "The updated brand identity.",
  },
  updateEventTrigger: {
    type: "object",
    properties: {
      eventTrigger: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The event trigger's ID, used as triggerId in /v1/event-triggers/{triggerId}.",
          },
          organizationId: { type: "string", description: "ID of the organization that owns the trigger." },
          name: {
            type: "string",
            description:
              'Event triggers cannot be named through the API or the dashboard, so this is the default "Untitled Schedule".',
          },
          sourceType: {
            type: "string",
            enum: ["github_webhook"],
            description: "Always github_webhook for event triggers.",
          },
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
            description: "Which GitHub events start a run.",
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
            description: "Repositories the trigger listens to.",
          },
          outputType: {
            type: "string",
            enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"],
            description: "Type of content each run generates.",
          },
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
                properties: {
                  slack: {
                    type: "boolean",
                    description: "Post to the organization's Slack notification channel after a successful run.",
                  },
                  email: { type: "boolean", description: "Email the workspace owners after a successful run." },
                },
                required: ["slack", "email"],
                description:
                  "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
              },
            },
            description:
              "Writing and notification settings for generated content, or null or absent when none are set.",
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
          createdAt: { type: "string", description: "When the trigger was created, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the trigger was last changed, as an ISO 8601 timestamp." },
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
        description: "An automation that generates content when GitHub events arrive.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["eventTrigger", "organization"],
    description: "The event trigger.",
  },
  updateFeedback: {
    type: "object",
    properties: {
      feedback: {
        type: "object",
        properties: {
          id: { type: "string", description: "The feedback's ID, used as feedbackId in /v1/feedback/{feedbackId}." },
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
          message: { type: "string", description: "The feedback itself." },
          agentClient: {
            type: ["string", "null"],
            description: "The agent or client that submitted the feedback, or null when not given.",
          },
          agentModel: { type: ["string", "null"], description: "Model the agent ran on, or null when not given." },
          toolVersion: {
            type: ["string", "null"],
            description: "Version of the tool or client that submitted it, or null when not given.",
          },
          userAgent: {
            type: ["string", "null"],
            description:
              "User agent as submitted, falling back to the request's User-Agent header, or null when neither was present.",
          },
          contextUrl: {
            type: ["string", "null"],
            description: "Page or resource the feedback is about, or null when not given.",
          },
          externalId: {
            type: ["string", "null"],
            description: "The submitter's own identifier for the user or session, or null when not given.",
          },
          idempotencyKey: {
            type: ["string", "null"],
            description: "Idempotency key sent with the submission, or null when none was sent.",
          },
          metadata: {
            type: ["object", "null"],
            additionalProperties: {},
            description: "JSON submitted with the feedback, or null.",
          },
          resolvedAt: {
            type: ["string", "null"],
            description: "When the status was last set to resolved. Cleared when it changes to another status.",
          },
          createdAt: { type: "string", description: "When the feedback was submitted, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the feedback last changed, as an ISO 8601 timestamp." },
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
        description: "A piece of feedback submitted by an agent, app or person.",
      },
    },
    required: ["feedback"],
    description: "The feedback item.",
  },
  updateGeoContentBrief: {
    type: "object",
    properties: {
      brief: {
        type: "object",
        properties: {
          id: { type: "string", description: "Brief id for the brief endpoints." },
          topic: {
            type: "string",
            description:
              "What the article targets, which is the source prompt when the brief was planned from a gap, prompt or Search Console suggestion.",
          },
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
                        engine: { type: "string", description: "Engine id." },
                        mentioned: { type: "boolean", description: "Whether the answer mentioned the brand." },
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
                      properties: {
                        name: { type: "string", description: "Competitor name." },
                        engines: { type: "number", description: "Engines whose answer named this competitor." },
                      },
                      required: ["name", "engines"],
                    },
                    description: "Competitors named in the answers, with the number of engines naming each.",
                  },
                  citedDomains: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        domain: { type: "string", description: "Cited domain." },
                        engines: { type: "number", description: "Engines whose answer cited this domain." },
                      },
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
          status: {
            type: "string",
            enum: ["draft", "approved", "writing", "completed", "failed"],
            description:
              "`draft` until approved, `approved` or `writing` while the writer drafts the post, `completed` once the draft post is written, `failed` when the last writer run failed.",
          },
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
          createdAt: { type: "string", description: "When the brief was planned, as an ISO 8601 timestamp." },
          updatedAt: {
            type: "string",
            description: "Pass as expectedUpdatedAt to updateGeoContentBrief to avoid overwriting newer changes.",
          },
          completedAt: {
            type: ["string", "null"],
            description:
              "ISO timestamp of when the last writer run finished or failed. Null while writing or before approval.",
          },
          claim: {
            type: ["object", "null"],
            properties: {
              agent: { type: "string", description: "Name of the agent writing the article." },
              expiresAt: { type: "string", description: "ISO timestamp when the claim lapses unless renewed." },
            },
            required: ["agent", "expiresAt"],
            description:
              "Set while an agent holds a claim on it with claimGeoContent. Notra's writer and Autopilot leave it alone until the claim is released or expires. Null when unclaimed.",
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
        description: "A content brief with its article plan and writer state.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["brief", "organization"],
    description: "The content brief and the workspace it belongs to.",
  },
  updateGeoContentGap: {
    type: "object",
    properties: {
      promptId: { type: "string", description: "Id of the prompt gap that was updated." },
      ignored: { type: "boolean", description: "Whether the gap is now hidden from content gaps and brief planning." },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["promptId", "ignored", "organization"],
    description: "The prompt gap's new ignored state and the workspace it belongs to.",
  },
  updateGeoPersona: {
    type: "object",
    properties: {
      persona: {
        type: "object",
        properties: {
          id: { type: "string", description: "Persona id for the persona endpoints." },
          name: { type: "string", description: "Buyer archetype label, such as Budgeter." },
          role: { type: "string", description: "Short job title, at most two words." },
          company: { type: "string", description: "Kind of company the persona works at, with size and industry." },
          summary: { type: "string", description: "Buying priorities and situation, one point per line." },
          searchStyle: { type: "string", description: "How the persona writes to AI chats, one point per line." },
          profile: {
            type: "object",
            properties: {
              goals: { type: "array", items: { type: "string" }, description: "What the persona wants to achieve." },
              painPoints: {
                type: "array",
                items: { type: "string" },
                description: "Problems the persona is trying to solve.",
              },
              currentStack: {
                type: "array",
                items: { type: "string" },
                description: "Tools and vendors the persona uses today.",
              },
              buyingTriggers: {
                type: "array",
                items: { type: "string" },
                description: "Events that push the persona to look for a new solution.",
              },
              objections: {
                type: "array",
                items: { type: "string" },
                description: "Concerns that make the persona hesitate to buy.",
              },
            },
            required: ["goals", "painPoints", "currentStack", "buyingTriggers", "objections"],
            description: "Structured buyer profile of the persona.",
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
          createdAt: { type: "string", description: "When the persona was created, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the persona last changed, as an ISO 8601 timestamp." },
          memories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", description: "Memory id." },
                kind: {
                  type: "string",
                  enum: ["background", "experience", "preference", "constraint"],
                  description:
                    "`background` for career and company facts, `experience` for past events with tools or vendors, `preference` for how they like to work and buy, `constraint` for budget, compliance or team limits.",
                },
                content: { type: "string", description: "The fact, written in the first person." },
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
        description: "A simulated buyer persona that plays conversations against AI engines.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["persona", "organization"],
    description: "The updated or restored persona and the workspace it belongs to.",
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
          prompt: { type: "string", description: "Question asked to AI engines during scans." },
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
            deprecated: true,
            description: "Deprecated: prompt tags were removed. Always empty; a future API version drops the field.",
          },
          createdAt: {
            type: ["string", "null"],
            description: "When the custom prompt was added. `null` for auto prompts.",
          },
        },
        required: ["id", "prompt", "enabled", "source", "tags", "createdAt"],
        description: "A prompt tracked in the project's scans.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["prompt", "organization"],
    description: "The created, updated or accepted prompt and the workspace it belongs to.",
  },
  updateGeoSequence: {
    type: "object",
    properties: {
      sequence: {
        type: "object",
        properties: {
          id: { type: "string", description: "Sequence id for the update, delete and run endpoints." },
          name: { type: "string", description: "Display name of the sequence." },
          steps: {
            type: "array",
            items: { type: "string" },
            description: "Messages sent in order as one conversation with each engine.",
          },
          enabled: { type: "boolean", description: "Whether project scans play this conversation." },
          createdAt: { type: "string", description: "When the sequence was created, as an ISO 8601 timestamp." },
        },
        required: ["id", "name", "steps", "enabled", "createdAt"],
        description: "A multi-turn conversation played against each engine in project scans.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["sequence", "organization"],
    description: "The created or updated sequence and the workspace it belongs to.",
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
              id: { type: "string", description: "Settings record id." },
              organizationId: { type: "string", description: "Organization that owns the project." },
              projectId: { type: "string", description: "Project these settings apply to." },
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
              scanIntervalHours: {
                type: "integer",
                description:
                  "Hours between automatic scans, in whole days. Scheduled scans repeat on a fixed cadence from the first one, so a daily scan keeps the same time of day. Manual scans do not move the schedule.",
              },
              nextScanAt: {
                type: ["string", "null"],
                description:
                  "When the next automatic scan is due, as an ISO 8601 timestamp in UTC. The scheduler checks every 10 minutes, so the scan starts within 10 minutes after this time. A time in the past means the scan is due and starts on the next check. Saving settings with a new interval, or turning automatic scans back on, recalculates it from the last finished scan. Null while automatic scans are off.",
              },
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
              createdAt: {
                type: "string",
                description: "When the settings were first saved, as an ISO 8601 timestamp.",
              },
              updatedAt: { type: "string", description: "When the settings last changed, as an ISO 8601 timestamp." },
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
              "nextScanAt",
              "scanStartedAt",
              "lastScanAt",
              "isScanning",
              "createdAt",
              "updatedAt",
            ],
            description: "The project's GEO tracking settings.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["configured", "settings", "organization"],
    description: "The project's GEO settings and the workspace they belong to.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
      post: {
        type: "object",
        properties: {
          id: { type: "string", description: "ID of the post, used as postId in the /v1/posts endpoints." },
          title: { type: "string", description: "Post title." },
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
            description:
              "Kind of content. image posts hold a rendered image instead of text; only blog_post and changelog have a slug and metadata.",
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
              tags: {
                type: "array",
                items: { type: "string" },
                description: "Post tags in display order, or empty when none are set.",
              },
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
                    id: {
                      type: "string",
                      description:
                        "Author ID from GET /v1/posts/authors, or a site:<id> ref for an author from the post's Notra Sites site.",
                    },
                    slug: {
                      type: "string",
                      description: "Stable author handle; hosted sites list the author's posts at /author/{slug}.",
                    },
                    name: { type: "string", description: "Author's display name." },
                    title: {
                      type: ["string", "null"],
                      description: "Job title shown next to the name, or null when not set.",
                    },
                    avatarUrl: { type: ["string", "null"], description: "Avatar image URL, or null when not set." },
                    url: { type: ["string", "null"], description: "Author's website." },
                    x: { type: ["string", "null"], description: "X profile URL, or null when not set." },
                    linkedin: { type: ["string", "null"], description: "LinkedIn profile URL, or null when not set." },
                    github: { type: ["string", "null"], description: "GitHub profile URL, or null when not set." },
                    youtube: { type: ["string", "null"], description: "YouTube channel URL, or null when not set." },
                    bluesky: { type: ["string", "null"], description: "Bluesky profile URL, or null when not set." },
                    mastodon: { type: ["string", "null"], description: "Mastodon profile URL, or null when not set." },
                    threads: { type: ["string", "null"], description: "Threads profile URL, or null when not set." },
                    instagram: {
                      type: ["string", "null"],
                      description: "Instagram profile URL, or null when not set.",
                    },
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
          status: {
            type: "string",
            enum: ["draft", "published"],
            description:
              "Publishing state of the post in Notra, where GET /v1/posts only returns published posts unless its status filter includes draft.",
          },
          createdAt: { type: "string", description: "When the post was created, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the post was last changed, as an ISO 8601 timestamp." },
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
        description: "The post after the update was saved.",
      },
    },
    required: ["organization", "post"],
    description: "The updated post.",
  },
  updateProject: {
    type: "object",
    properties: {
      project: {
        type: "object",
        properties: {
          id: { type: "string", description: "Use as projectId in the endpoints under /v1/projects/{projectId}." },
          name: { type: "string", description: "Project display name." },
          brandSettingsId: {
            type: "string",
            description: "ID of the brand identity linked to the project, as listed by GET /v1/brand-identities.",
          },
          createdAt: { type: "string", description: "When the project was created, as an ISO 8601 timestamp." },
        },
        required: ["id", "name", "brandSettingsId", "createdAt"],
        description: "A GEO project tracking one brand identity.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["project", "organization"],
    description: "The GEO project and the workspace it belongs to.",
  },
  updateSchedule: {
    type: "object",
    properties: {
      schedule: {
        type: "object",
        properties: {
          id: { type: "string", description: "The schedule's ID, used as scheduleId in /v1/schedules/{scheduleId}." },
          organizationId: { type: "string", description: "ID of the organization that owns the schedule." },
          name: { type: "string", description: "Display name shown in the dashboard." },
          sourceType: { type: "string", enum: ["cron"], description: "Always cron for schedules." },
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
                description: "When the schedule runs, in UTC.",
              },
            },
            required: ["cron"],
            description: "Timing settings for the schedule.",
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
            description: "Data sources each run reads from.",
          },
          outputType: {
            type: "string",
            enum: ["changelog", "blog_post", "linkedin_post", "twitter_post", "image"],
            description: "Type of content each run generates.",
          },
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
                properties: {
                  slack: {
                    type: "boolean",
                    description: "Post to the organization's Slack notification channel after a successful run.",
                  },
                  email: { type: "boolean", description: "Email the workspace owners after a successful run." },
                },
                required: ["slack", "email"],
                description:
                  "Where to announce new content after a successful run: Slack posts to the organization's notification channel, email goes to the workspace owners.",
              },
            },
            description:
              "Writing and notification settings for generated content, or null or absent when none are set.",
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
          createdAt: { type: "string", description: "When the schedule was created, as an ISO 8601 timestamp." },
          updatedAt: { type: "string", description: "When the schedule was last changed, as an ISO 8601 timestamp." },
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
        description: "A recurring automation that generates content on a cron schedule.",
      },
      organization: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Workspace ID. Account API keys can send it, or the slug, as X-Notra-Organization-Id.",
          },
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["schedule", "organization"],
    description: "The schedule as saved.",
  },
  updateSiteAuthorPage: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: {
          id: { type: "string", description: "The Site's ID." },
          name: { type: "string", description: "Display name of the Site." },
        },
        required: ["id", "name"],
        description: "The Site the request applied to.",
      },
      authors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "The author's id in blog.json. Posts name the author with it and its author page lives at {blogMount}/author/{id}.",
            },
            ref: {
              type: "string",
              description:
                "Pass this in metadata.authorIds of PATCH /v1/posts/{postId} to credit the author on a blog post that publishes to this site.",
            },
            name: { type: "string", description: "The author's display name." },
            title: { type: ["string", "null"], description: "The author's role or job title, or null when not set." },
            bio: {
              type: ["string", "null"],
              description: "Short biography shown on the author page, or null when not set.",
            },
            avatar: {
              type: ["string", "null"],
              description: "As written in blog.json: a site path such as /images/jane.png or an https URL.",
            },
            avatarUrl: { type: ["string", "null"], description: "The avatar as a full URL on the live site." },
            url: {
              type: ["string", "null"],
              description: "The author's personal website as an https URL, or null when not set.",
            },
            x: { type: ["string", "null"], description: "The author's X profile URL, or null when not set." },
            linkedin: {
              type: ["string", "null"],
              description: "The author's LinkedIn profile URL, or null when not set.",
            },
            github: { type: ["string", "null"], description: "The author's GitHub profile URL, or null when not set." },
            youtube: {
              type: ["string", "null"],
              description: "The author's YouTube channel URL, or null when not set.",
            },
            bluesky: {
              type: ["string", "null"],
              description: "The author's Bluesky profile URL, or null when not set.",
            },
            mastodon: {
              type: ["string", "null"],
              description: "The author's Mastodon profile URL, or null when not set.",
            },
            threads: {
              type: ["string", "null"],
              description: "The author's Threads profile URL, or null when not set.",
            },
            instagram: {
              type: ["string", "null"],
              description: "The author's Instagram profile URL, or null when not set.",
            },
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
    description:
      "The Site's authors and author page layout in blog.json after the request, including unpublished changes.",
  },
  updateSiteSections: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: {
          id: { type: "string", description: "The Site's ID." },
          name: { type: "string", description: "Display name of the Site." },
        },
        required: ["id", "name"],
        description: "The Site the request applied to.",
      },
      sections: {
        type: "object",
        properties: {
          blog: { type: "string", description: "Path the blog is served under, or absent when the blog is off." },
          changelog: {
            type: "string",
            description: "Path the changelog is served under, or absent when the changelog is off.",
          },
        },
        description:
          "The sections blog.json sets with unpublished changes applied. They take over from the dashboard setting once a production build of them goes live.",
      },
      liveSections: {
        type: "object",
        properties: {
          blog: { type: "string", description: "Path the blog is served under, or absent when the blog is off." },
          changelog: {
            type: "string",
            description: "Path the changelog is served under, or absent when the changelog is off.",
          },
        },
        description: "The paths the live site serves now.",
      },
      hasUnpublishedChanges: {
        type: "boolean",
        description:
          "blog.json has staged Design changes that are not live yet. Publish them with POST /v1/sites/{siteId}/publish or from the dashboard.",
      },
    },
    required: ["site", "sections", "liveSections", "hasUnpublishedChanges"],
    description: "The Site's blog and changelog paths after the update, next to the paths live now.",
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
          description: "A competitor tracked in AI answers.",
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
          slug: { type: "string", description: "URL-safe workspace handle, unique across Notra." },
          name: { type: "string", description: "Workspace display name." },
          logo: { type: ["string", "null"], description: "Workspace logo image URL. Null when none is set." },
        },
        required: ["id", "slug", "name", "logo"],
        description: "Workspace the request ran in.",
      },
    },
    required: ["competitors", "organization"],
    description: "The project's tracked competitors and the workspace they belong to.",
  },
  upsertSiteAuthor: {
    type: "object",
    properties: {
      site: {
        type: "object",
        properties: {
          id: { type: "string", description: "The Site's ID." },
          name: { type: "string", description: "Display name of the Site." },
        },
        required: ["id", "name"],
        description: "The Site the request applied to.",
      },
      authors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "The author's id in blog.json. Posts name the author with it and its author page lives at {blogMount}/author/{id}.",
            },
            ref: {
              type: "string",
              description:
                "Pass this in metadata.authorIds of PATCH /v1/posts/{postId} to credit the author on a blog post that publishes to this site.",
            },
            name: { type: "string", description: "The author's display name." },
            title: { type: ["string", "null"], description: "The author's role or job title, or null when not set." },
            bio: {
              type: ["string", "null"],
              description: "Short biography shown on the author page, or null when not set.",
            },
            avatar: {
              type: ["string", "null"],
              description: "As written in blog.json: a site path such as /images/jane.png or an https URL.",
            },
            avatarUrl: { type: ["string", "null"], description: "The avatar as a full URL on the live site." },
            url: {
              type: ["string", "null"],
              description: "The author's personal website as an https URL, or null when not set.",
            },
            x: { type: ["string", "null"], description: "The author's X profile URL, or null when not set." },
            linkedin: {
              type: ["string", "null"],
              description: "The author's LinkedIn profile URL, or null when not set.",
            },
            github: { type: ["string", "null"], description: "The author's GitHub profile URL, or null when not set." },
            youtube: {
              type: ["string", "null"],
              description: "The author's YouTube channel URL, or null when not set.",
            },
            bluesky: {
              type: ["string", "null"],
              description: "The author's Bluesky profile URL, or null when not set.",
            },
            mastodon: {
              type: ["string", "null"],
              description: "The author's Mastodon profile URL, or null when not set.",
            },
            threads: {
              type: ["string", "null"],
              description: "The author's Threads profile URL, or null when not set.",
            },
            instagram: {
              type: ["string", "null"],
              description: "The author's Instagram profile URL, or null when not set.",
            },
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
    description:
      "The Site's authors and author page layout in blog.json after the request, including unpublished changes.",
  },
};
