# Notra MCP Server

An MCP (Model Context Protocol) server that provides LLM clients with full access to the [Notra API](https://docs.usenotra.com) for managing posts, brand identities, integrations, and schedules.

## Setup

You can generate an API key from your [Notra workspace dashboard](https://app.usenotra.com) under Developer > API Keys.

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

## Remote OAuth

The hosted streamable HTTP MCP server also accepts dashboard-issued OAuth bearer tokens. MCP clients should discover the protected resource metadata at:

```text
https://mcp.usenotra.com/.well-known/oauth-protected-resource
```

The metadata points clients to the Notra dashboard authorization server at `https://app.usenotra.com/.well-known/oauth-authorization-server`. Static API key bearer authentication remains supported.

For self-hosted HTTP deployments, OAuth validation can be configured with:

```bash
NOTRA_OAUTH_ISSUER=https://app.usenotra.com
NOTRA_OAUTH_JWKS_URL=https://app.usenotra.com/api/auth/jwks
NOTRA_MCP_RESOURCE=https://mcp.usenotra.com
```

When `NODE_ENV=development`, the default issuer is `http://localhost:3000`; production defaults to `https://app.usenotra.com`.

## Tools

### Posts

| Tool | Description |
|------|-------------|
| `list_posts` | List posts with optional filters for sorting, pagination, status, content type, and brand identity |
| `get_post` | Get a single post by ID |
| `update_post` | Update a post's title, markdown, or status |
| `delete_post` | Delete a post |
| `generate_post` | Queue async post generation from GitHub activity |
| `get_post_generation_status` | Check the status of a post generation job |

### Brand Identities

| Tool | Description |
|------|-------------|
| `list_brand_identities` | List all brand identities |
| `get_brand_identity` | Get a single brand identity by ID |
| `update_brand_identity` | Update brand identity settings |
| `delete_brand_identity` | Delete a brand identity |
| `generate_brand_identity` | Queue async brand identity generation from a website URL |
| `get_brand_identity_generation_status` | Check the status of a brand identity generation job |

### Integrations

| Tool | Description |
|------|-------------|
| `list_integrations` | List all connected integrations (GitHub, Slack, Linear) |
| `create_github_integration` | Connect a GitHub repository |
| `delete_integration` | Delete a GitHub or Linear integration |

### Schedules

| Tool | Description |
|------|-------------|
| `list_schedules` | List scheduled content generation jobs |
| `create_schedule` | Create a scheduled content generation job |
| `update_schedule` | Update a scheduled content generation job |
| `delete_schedule` | Delete a scheduled content generation job |

### Chats

| Tool | Description |
|------|-------------|
| `list_chats` | List chat sessions |
| `get_chat` | Get a single chat with messages |
| `get_chat_by_external_channel` | Get a chat by Discord or Slack channel ID |
| `create_chat` | Start a new chat and return the streamed reply |
| `post_chat_message` | Post a message to an existing chat and return the streamed reply |

### Skills

| Tool | Description |
|------|-------------|
| `list_skills` | List reusable writing skills |
| `get_skill` | Get a single skill by name |
| `create_skill` | Create a reusable writing skill |
| `update_skill` | Update a reusable writing skill |
| `delete_skill` | Delete a reusable writing skill |
