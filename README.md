# Notra MCP Server

An MCP (Model Context Protocol) server for the [Notra API](https://docs.usenotra.com). It manages posts, brand identities, integrations, schedules, GEO visibility scans, competitors, content briefs, and AI traffic analytics.

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

## Remote MCP (OAuth)

The hosted streamable HTTP server at `https://mcp.usenotra.com/mcp` uses OAuth as the primary authentication method. It supports the current `2026-07-28` MCP protocol as well as legacy 2025 clients. MCP clients should discover protected resource metadata at:

```text
https://mcp.usenotra.com/.well-known/oauth-protected-resource
```

That metadata points to the Notra authorization server (WorkOS AuthKit) at `https://strong-summit-11.authkit.app`, which supports dynamic client registration (RFC 7591). The MCP server also mirrors the authorization server metadata at `https://mcp.usenotra.com/.well-known/oauth-authorization-server`.

### API key alternative

Remote connections also accept a Notra API key as a static `Authorization: Bearer …` header. Generate one from your [Notra workspace dashboard](https://app.usenotra.com) under Developer > API Keys. OAuth-capable clients should prefer the OAuth flow instead of manual key configuration.

For self-hosted HTTP deployments, OAuth validation can be configured with:

```bash
WORKOS_AUTHKIT_DOMAIN=strong-summit-11.authkit.app
WORKOS_CLIENT_ID=client_xxx
NOTRA_MCP_RESOURCE=https://mcp.usenotra.com
```

The issuer is `https://{WORKOS_AUTHKIT_DOMAIN}` and must match the `iss` claim in tokens minted by AuthKit; a mismatch causes every bearer token to be rejected. Token signatures are verified against `https://{WORKOS_AUTHKIT_DOMAIN}/oauth2/jwks`.

When `NODE_ENV=development`, the default AuthKit domain is `essential-berry-67-development-2.authkit.app`; production defaults to `strong-summit-11.authkit.app`. `auth.usenotra.com` is the WorkOS Authentication API domain and serves none of the OAuth endpoints, so it does not work here.

## Tools

### Posts

| Tool                         | Description                                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `list_posts`                 | List posts with optional filters for sorting, pagination, status, content type, and brand identity |
| `get_post`                   | Get a single post by ID                                                                            |
| `update_post`                | Update a post's title, markdown, or status                                                         |
| `delete_post`                | Delete a post                                                                                      |
| `generate_post`              | Queue async post generation from GitHub activity                                                   |
| `get_post_generation_status` | Check the status of a post generation job                                                          |

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
| `create_github_integration` | Connect a GitHub repository                             |
| `delete_integration`        | Delete a GitHub or Linear integration                   |

### Schedules

| Tool              | Description                               |
| ----------------- | ----------------------------------------- |
| `list_schedules`  | List scheduled content generation jobs    |
| `create_schedule` | Create a scheduled content generation job |
| `update_schedule` | Update a scheduled content generation job |
| `delete_schedule` | Delete a scheduled content generation job |

### Chats

| Tool                           | Description                                                      |
| ------------------------------ | ---------------------------------------------------------------- |
| `list_chats`                   | List chat sessions                                               |
| `get_chat`                     | Get a single chat with messages                                  |
| `get_chat_by_external_channel` | Get a chat by Discord or Slack channel ID                        |
| `create_chat`                  | Start a new chat and return the streamed reply                   |
| `post_chat_message`            | Post a message to an existing chat and return the streamed reply |

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

| Tool                            | Description                                                 |
| ------------------------------- | ----------------------------------------------------------- |
| `create_geo_scan`               | Trigger an async visibility scan (uses AI credits)          |
| `list_geo_scans`                | List scans with pagination                                  |
| `get_geo_scan`                  | Get a scan and its status                                   |
| `get_geo_visibility_overview`   | Mention rates per answer engine                             |
| `get_geo_visibility_timeseries` | Daily mention counts per engine                             |
| `get_geo_prompt_results`        | Latest stored answer per prompt and engine, with sources    |
| `get_geo_competitor_share`      | Share of voice across tracked brands                        |
| `get_geo_language_share`        | Mention rates per tracked language                          |
| `get_geo_competitor_detail`     | One competitor's mention history and the prompts driving it |

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
| `issue_geo_ingest_token`    | Issue the tracking token                                     |
| `rotate_geo_ingest_token`   | Rotate the token, invalidating all previously issued tokens  |

### Feedback

| Tool              | Description                                                                         |
| ----------------- | ----------------------------------------------------------------------------------- |
| `submit_feedback` | Send a bug report, feature request, question or praise to the Notra inbox (no auth) |
