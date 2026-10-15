# Notra MCP Server

An MCP (Model Context Protocol) server for the [Notra API](https://www.usenotra.com/docs). It manages posts, brand identities, integrations, schedules, GEO visibility scans, competitors, content briefs, and AI traffic analytics.

## Setup

You can generate an API key from your [Notra workspace dashboard](https://app.usenotra.com) under Developer > API Keys.

Node.js 20 or newer is required.

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "notra": {
      "command": "npx",
      "args": ["-y", "@usenotra/mcp"],
      "env": {
        "NOTRA_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add notra -- npx -y @usenotra/mcp
```

Then set the `NOTRA_API_KEY` environment variable in your shell before launching Claude Code.

### Codex

```bash
export NOTRA_API_KEY=your-api-key
codex mcp add notra --env NOTRA_API_KEY="$NOTRA_API_KEY" -- npx -y @usenotra/mcp
```

Run `codex mcp list` to verify the connection. The Codex CLI, desktop app, and IDE extension share this MCP configuration.

### OpenCode

Set `NOTRA_API_KEY` in your shell, then add the server to your project-level `opencode.json` or the global `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "notra": {
      "type": "local",
      "command": ["npx", "-y", "@usenotra/mcp"],
      "enabled": true,
      "environment": {
        "NOTRA_API_KEY": "{env:NOTRA_API_KEY}"
      }
    }
  }
}
```

### Amp

Run `amp config edit` and add the following to your settings, or place it in `.amp/settings.json` for a workspace-specific configuration:

```json
{
  "amp.mcpServers": {
    "notra": {
      "command": "npx",
      "args": ["-y", "@usenotra/mcp"],
      "env": {
        "NOTRA_API_KEY": "${NOTRA_API_KEY}"
      }
    }
  }
}
```

Set `NOTRA_API_KEY` in the environment before launching Amp. Workspace MCP servers may require approval with `amp mcp approve notra`.

### Account API keys

An account API key belongs to you rather than one workspace, so it works in every workspace you're a member of. If you belong to more than one, choose the workspace this server acts on with `NOTRA_ORGANIZATION_ID`:

```json
{
  "env": {
    "NOTRA_API_KEY": "your-account-api-key",
    "NOTRA_ORGANIZATION_ID": "your-workspace-id"
  }
}
```

Without it, tools fail with a message asking you to pick a workspace. `list_workspaces` works without a selection and shows the ids. Organization API keys ignore `NOTRA_ORGANIZATION_ID`.

## Remote MCP (OAuth)

The hosted streamable HTTP server at `https://mcp.usenotra.com/mcp` uses OAuth as the primary authentication method. It supports the current `2026-07-28` MCP protocol as well as legacy 2025 clients. MCP clients should discover protected resource metadata at:

```text
https://mcp.usenotra.com/.well-known/oauth-protected-resource
```

That metadata points to the Notra authorization server (WorkOS AuthKit) at `https://oauth.usenotra.com`, which supports dynamic client registration (RFC 7591). The MCP server also mirrors the authorization server metadata at `https://mcp.usenotra.com/.well-known/oauth-authorization-server`.

### Workspace-scoped URL

Add a workspace id or slug to the URL to pin a connection to one workspace: `https://mcp.usenotra.com/mcp/<workspace>`. This is the way to pick a workspace in clients that only accept a URL and can't send custom headers.

- Claude: Settings > Connectors > Add custom connector, URL `https://mcp.usenotra.com/mcp/acme`
- Claude Code: `claude mcp add --transport http notra https://mcp.usenotra.com/mcp/acme`
- Cursor (`~/.cursor/mcp.json`):

  ```json
  {
    "mcpServers": {
      "notra": { "url": "https://mcp.usenotra.com/mcp/acme" }
    }
  }
  ```

On a scoped URL:

- API keys act in that workspace. The URL wins over an `X-Notra-Organization-Id` header. An organization key only works on its own workspace's URL; any other workspace is rejected with HTTP 403 by the Notra API.
- OAuth works the same as on `/mcp`, but the workspace you authorize must be the one in the URL. Otherwise requests are rejected with HTTP 403 instead of silently acting on another workspace. The OAuth challenge announces the same resource as `/mcp`, so clients get a normal Notra token; the workspace in the URL is enforced through the workspace you authorize.
- `list_workspaces` is hidden, since the connection can't switch workspaces. `whoami` still shows the current one.
- Legacy 2025 sessions belong to the URL they were opened on; using the session id on another URL returns HTTP 401.

### API key alternative

Remote connections also accept a Notra API key as a static `Authorization: Bearer …` header. Generate one from your [Notra workspace dashboard](https://app.usenotra.com) under Developer > API Keys. OAuth-capable clients should prefer the OAuth flow instead of manual key configuration.

With an [account API key](#account-api-keys) that can reach several workspaces, use a [workspace-scoped URL](#workspace-scoped-url) or add an `X-Notra-Organization-Id: <workspace-id-or-slug>` header (`X-Organization-Id` also works). The server forwards it to the Notra API on every call. A legacy 2025 session stays bound to the workspace it was initialized with; a request on that session that names a different workspace is rejected with HTTP 401, so open a new session to switch. OAuth connections ignore the header because each token is bound to the workspace chosen at consent.

For self-hosted HTTP deployments, OAuth validation can be configured with:

```bash
WORKOS_AUTHKIT_DOMAIN=oauth.usenotra.com
WORKOS_CLIENT_ID=client_xxx
NOTRA_MCP_RESOURCE=https://mcp.usenotra.com
```

The issuer is `https://{WORKOS_AUTHKIT_DOMAIN}` and must match the `iss` claim in tokens minted by AuthKit; a mismatch causes every bearer token to be rejected. Token signatures are verified against `https://{WORKOS_AUTHKIT_DOMAIN}/oauth2/jwks`.

When `NODE_ENV=development`, the default AuthKit domain is `essential-berry-67-development-2.authkit.app`; production defaults to `oauth.usenotra.com`. `auth.usenotra.com` is the WorkOS Authentication API domain and serves none of the OAuth endpoints, so it does not work here.

Legacy 2025 sessions expire after 30 minutes of inactivity. Each OAuth user or API key can hold `NOTRA_MCP_MAX_SESSIONS_PER_PRINCIPAL` sessions (default `50`); beyond that, its own least recently used session closes. When the server holds `NOTRA_MCP_MAX_SESSIONS` sessions (default `1000`), new sessions are rejected with HTTP 503 and `Retry-After` instead of closing other users' sessions.

## Hosted usage statistics

The HTTP server tracks usage exclusively in PostHog, sending one `mcp_tool_called` event per dispatched tool call, including calls that fail tool input/output validation or return `isError: true` with HTTP 200. Initialization, discovery, health checks, and requests rejected before tool dispatch are not counted. Local stdio servers do not emit usage events or contact PostHog.

Set the PostHog project token on the hosted deployment to enable tracking:

```env
POSTHOG_PROJECT_TOKEN=your-project-token
```

`POSTHOG_HOST` defaults to `https://us.i.posthog.com`; set it to `https://eu.i.posthog.com` for an EU project. Without a project token, tracking is disabled. There is no alternative collector or JSON usage-log fallback.

Events include `tool_name`, `outcome` (`success`, `error`, or `cancelled`), `duration_ms`, `server_version`, `protocol_version`, `client_name`, `client_version`, and `auth_kind`. OAuth events also include the verified WorkOS `organization_id` and `user_id`; API-key calls have no user/workspace attribution and share the PostHog distinct ID `mcp:api-key`, which must not be counted as a unique user. Client identity is self-reported, bucketed into known client names, and unknown names are recorded as `other`; versions are only retained in numeric `major.minor.patch` form. Unknown tool names are recorded as `unknown`.

Arguments, results, prompts, error messages, headers, IP addresses, tokens, API keys, and token hashes are never included in usage events. Delivery is asynchronous and best-effort, with a five-second timeout and at most 64 pending PostHog requests per process. Failed or dropped deliveries produce a credential-free warning without failing tool calls. Events are not sampled, but PostHog delivery is not an audit or billing ledger.

In PostHog, filter on `mcp_tool_called` and break down by `tool_name`, `client_name`, or `outcome`. Count distinct `organization_id`/`user_id` only for OAuth calls, and use `duration_ms` for latency percentiles.

## Toolsets

All 106 tools are exposed by default, which costs roughly 20k tokens of agent context. To load only what you need, pick toolsets with `NOTRA_MCP_TOOLSETS` (stdio and HTTP) or the `toolsets` query parameter on the remote endpoint:

| Toolset   | Tools                                                                                    |
| --------- | ---------------------------------------------------------------------------------------- |
| `content` | Posts, brand identities, integrations, schedules, event triggers, skills, feedback inbox |
| `geo`     | Projects and every GEO tool                                                              |

Workspace tools and `submit_feedback` are always available.

```bash
NOTRA_MCP_TOOLSETS=content npx -y @usenotra/mcp
```

```text
https://mcp.usenotra.com/mcp?toolsets=geo
```

## Tools

### Workspace

| Tool              | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `whoami`          | Show the current workspace and authenticated account information            |
| `list_workspaces` | List accepted and pending workspaces available to the authenticated account |

Each MCP connection operates in the workspace bound to its bearer token, or for account API keys the workspace selected with `NOTRA_ORGANIZATION_ID` or the `X-Notra-Organization-Id` header. To act in another workspace, authorize or configure a separate connection for that workspace; `list_workspaces` discovers access but does not switch workspaces.

### Posts

| Tool                         | Description                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `list_posts`                 | List post summaries with optional filters for sorting, pagination, status, content type, and brand identity |
| `get_post`                   | Get a single post by ID                                                                                     |
| `create_post`                | Create a post from your own title and markdown                                                              |
| `update_post`                | Update a post's title, markdown, or status                                                                  |
| `delete_post`                | Delete a post                                                                                               |
| `generate_post`              | Queue async post generation from GitHub activity                                                            |
| `get_post_generation_status` | Check the status of a post generation job                                                                   |
| `get_post_schedule`          | Get a post's publishing schedule and per-destination status                                                 |
| `schedule_post`              | Schedule an existing post for publishing in Notra and optionally GitHub, X, or LinkedIn                     |
| `cancel_post_schedule`       | Cancel pending publishing destinations; already-publishing destinations finish on their own                 |

Post publishing schedules are separate from the content-generation schedules below. `schedule_post` requires an ISO 8601 `scheduledAt` timestamp, accepts an optional IANA `timeZone` (default `UTC`), and supports at most two external destinations. GitHub destinations use `repositoryId` from `list_integrations` and an optional `merge` flag (default `true`); social destinations use a connected X or LinkedIn `accountId`. Omitting destinations schedules publishing in Notra only.

### Brand Identities

| Tool                                   | Description                                              |
| -------------------------------------- | -------------------------------------------------------- |
| `list_brand_identities`                | List all brand identities                                |
| `get_brand_identity`                   | Get a single brand identity by ID                        |
| `update_brand_identity`                | Update brand identity settings                           |
| `delete_brand_identity`                | Delete a brand identity                                  |
| `generate_brand_identity`              | Queue async brand identity generation from a website URL |
| `get_brand_identity_generation_status` | Check the status of a brand identity generation job      |

### Integrations

| Tool                        | Description                                             |
| --------------------------- | ------------------------------------------------------- |
| `list_integrations`         | List all connected integrations (GitHub, Slack, Linear) |
| `create_github_integration` | Connect a public GitHub repository                      |
| `delete_integration`        | Delete a GitHub or Linear integration                   |

### Schedules

| Tool              | Description                               |
| ----------------- | ----------------------------------------- |
| `list_schedules`  | List scheduled content generation jobs    |
| `create_schedule` | Create a scheduled content generation job |
| `update_schedule` | Update a scheduled content generation job |
| `delete_schedule` | Delete a scheduled content generation job |

### Event Triggers

| Tool                   | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `list_event_triggers`  | List triggers that generate content from GitHub releases or pushes |
| `get_event_trigger`    | Get a single event trigger by ID                                   |
| `create_event_trigger` | Create an event trigger                                            |
| `update_event_trigger` | Replace an event trigger's configuration                           |
| `delete_event_trigger` | Delete an event trigger                                            |

### Webhooks

| Tool                      | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `list_webhook_endpoints`  | List HTTPS endpoints subscribed to Notra events            |
| `delete_webhook_endpoint` | Remove a webhook subscription and cancel unsent deliveries |
| `list_webhook_deliveries` | List webhook deliveries, optionally filtered by status     |
| `get_webhook_delivery`    | Get a delivery's payload and attempt history               |
| `retry_webhook_delivery`  | Retry a failed webhook delivery                            |

### Skills

| Tool           | Description                     |
| -------------- | ------------------------------- |
| `list_skills`  | List reusable writing skills    |
| `get_skill`    | Get a single skill by name      |
| `create_skill` | Create a reusable writing skill |
| `update_skill` | Update a reusable writing skill |
| `delete_skill` | Delete a reusable writing skill |

### Projects

GEO features are scoped to a project. Most GEO tools take a `projectId`; call `list_projects` first to find it. GEO tools require an organization-scoped API key and the GEO plan.

| Tool             | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `list_projects`  | List the organization's GEO projects                 |
| `get_project`    | Get a single project by ID                           |
| `create_project` | Create a project, optionally linked to a brand       |
| `update_project` | Rename a project or relink its brand identity        |
| `delete_project` | Delete a project and all of its GEO data (cascading) |

### GEO settings

| Tool                  | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `get_geo_settings`    | Get tracked company, aliases, languages, engines and scan config |
| `update_geo_settings` | Replace the settings document and restart the scan cycle         |

### GEO prompts and sequences

| Tool                  | Description                                                           |
| --------------------- | --------------------------------------------------------------------- |
| `list_geo_prompts`    | List tracked prompts (custom and auto-derived)                        |
| `create_geo_prompt`   | Track a new prompt                                                    |
| `update_geo_prompt`   | Enable or disable a tracked prompt                                    |
| `delete_geo_prompt`   | Stop tracking a prompt                                                |
| `import_geo_prompts`  | Bulk import prompts from rows or CSV                                  |
| `list_geo_sequences`  | List multi-turn prompt sequences                                      |
| `create_geo_sequence` | Create a prompt sequence                                              |
| `update_geo_sequence` | Update a sequence's name, steps or enabled state                      |
| `delete_geo_sequence` | Delete a sequence                                                     |
| `run_geo_sequence`    | Run a sequence now, synchronously (uses AI credits, can take minutes) |

### GEO competitors

| Tool                      | Description                                 |
| ------------------------- | ------------------------------------------- |
| `list_geo_competitors`    | List tracked competitors                    |
| `upsert_geo_competitor`   | Create, update or rename a competitor       |
| `suggest_geo_competitors` | AI-discover likely competitors for a domain |
| `delete_geo_competitor`   | Stop tracking a competitor                  |
| `import_geo_competitors`  | Bulk import competitors from rows or CSV    |

### GEO scans and visibility

| Tool                               | Description                                                 |
| ---------------------------------- | ----------------------------------------------------------- |
| `create_geo_scan`                  | Trigger an async visibility scan (uses AI credits)          |
| `list_geo_scans`                   | List scans with pagination                                  |
| `get_geo_scan`                     | Get a scan and its status                                   |
| `get_geo_snapshot`                 | Compact cross-signal diagnosis and recommended next actions |
| `get_geo_changes`                  | Changes between the two latest scans                        |
| `get_geo_visibility_overview`      | Mention rates per answer engine                             |
| `get_geo_visibility_timeseries`    | Daily mention counts per engine                             |
| `list_geo_prompt_result_summaries` | Filtered, paginated results without full answers or URLs    |
| `get_geo_prompt_result_detail`     | Full answer and sources for one check                       |
| `get_geo_prompt_history`           | Compact historical checks for one prompt                    |
| `get_geo_sentiment`                | Sentiment metrics and previous-period comparison            |
| `get_geo_sentiment_analysis`       | Stored thematic sentiment analysis                          |
| `list_geo_sentiment_evidence`      | Paginated answers behind sentiment metrics                  |
| `list_geo_shelf_sources`           | Paginated citation shelf and opportunity state              |
| `get_geo_competitor_share`         | Top brands by share of voice, with brand filter and limit   |
| `get_geo_language_share`           | Mention rates per tracked language                          |
| `get_geo_competitor_detail`        | One competitor's mention history and the prompts driving it |

### GEO content briefs

| Tool                        | Description                                                   |
| --------------------------- | ------------------------------------------------------------- |
| `list_geo_content_gaps`     | Prompts where competitors are mentioned and this brand is not |
| `list_geo_content_briefs`   | List content briefs and their statuses                        |
| `plan_geo_content_brief`    | Research a topic and plan a brief (billed, can take minutes)  |
| `get_geo_content_brief`     | Get a brief with the full document and writer status          |
| `approve_geo_content_brief` | Approve a brief and start the article writer                  |

### Agent readiness

| Tool                             | Description                                                   |
| -------------------------------- | ------------------------------------------------------------- |
| `get_geo_agent_readiness`        | Latest readiness report, score history and any scan in flight |
| `start_geo_agent_readiness_scan` | Queue a readiness scan of the project's website               |

### AI traffic

| Tool                        | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `get_geo_traffic_overview`  | Crawler and AI-referral totals, sources and daily timeseries |
| `get_geo_traffic_log`       | Most recent individual AI crawler/referral requests          |
| `list_geo_traffic_journeys` | Sessions grouped by journey                                  |
| `get_geo_traffic_journey`   | Every event in one journey                                   |
| `list_geo_traffic_pages`    | Most visited pages by AI traffic                             |
| `get_geo_ingest_setup`      | Tracking install snippets and ingest endpoint                |

### Feedback

| Tool              | Description                                                                         |
| ----------------- | ----------------------------------------------------------------------------------- |
| `submit_feedback` | Send a bug report, feature request, question or praise to the Notra inbox (no auth) |
| `list_feedback`   | List feedback the organization received, by status, kind or project                 |
| `get_feedback`    | Get one feedback entry with agent metadata                                          |
| `update_feedback` | Set a feedback entry's triage status                                                |

## Review and data boundaries

All supported operations are listed upfront by `tools/list`. General-purpose agent execution and approval tools are not exposed because they can run dynamically discovered third-party operations. Chat history and agent sessions are available through the dashboard and API. Use the Notra dashboard for agent conversations, private-repository authentication, webhook signing secrets, and traffic tracking credentials.

Tool inputs are for task-specific business content. Do not send health records, biometric data, government identifiers, payment card information, credentials, or unrelated conversation history. Authenticate through OAuth or local configuration, never through tool arguments. Feedback accepts only the user-approved message, optional title, and feedback kind.

See `docs/openai-resubmission.md` for the listing copy, review evidence, and release checks.

## Development

Use Node 22.12+ (Node 22) or Node 24 and the pnpm version pinned in `package.json`:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm test
pnpm run test:coverage
pnpm run typecheck
pnpm run format:check
```

Tool output schemas in `src/schemas/api-responses.ts` are generated from the Notra OpenAPI spec. Run `pnpm run generate:output-schemas` after the API changes; CI fails when the file is stale.

Vitest runs directly against the source with Zod compilation enabled. CI runs tests, typechecking, formatting checks, and the build on pull requests and pushes to `main`.
