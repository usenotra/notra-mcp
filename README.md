# Notra MCP Server

An MCP (Model Context Protocol) server that provides LLM clients with full access to the [Notra API](https://docs.usenotra.com) for managing posts, brand identities, integrations, and schedules.

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

That metadata points to the Notra authorization server (WorkOS AuthKit) at `https://auth.usenotra.com`, which supports dynamic client registration (RFC 7591). The MCP server also mirrors the authorization server metadata at `https://mcp.usenotra.com/.well-known/oauth-authorization-server`.

### API key alternative

Remote connections also accept a Notra API key as a static `Authorization: Bearer …` header. Generate one from your [Notra workspace dashboard](https://app.usenotra.com) under Developer > API Keys. OAuth-capable clients should prefer the OAuth flow instead of manual key configuration.

For self-hosted HTTP deployments, OAuth validation can be configured with:

```bash
WORKOS_AUTHKIT_DOMAIN=auth.usenotra.com
WORKOS_CLIENT_ID=client_xxx
NOTRA_MCP_RESOURCE=https://mcp.usenotra.com
```

The issuer is `https://{WORKOS_AUTHKIT_DOMAIN}` and must match the `iss` claim in tokens minted by AuthKit; a mismatch causes every bearer token to be rejected. Token signatures are verified against `https://{WORKOS_AUTHKIT_DOMAIN}/oauth2/jwks`.

When `NODE_ENV=development`, the default AuthKit domain is `divine-dress-62-development.authkit.app`; production defaults to `auth.usenotra.com`.

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

### Feedback

| Tool              | Description                                                                         |
| ----------------- | ----------------------------------------------------------------------------------- |
| `submit_feedback` | Send a bug report, feature request, question or praise to the Notra inbox (no auth) |
