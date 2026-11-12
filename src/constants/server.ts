export const SERVER_INSTRUCTIONS = [
  "Notra: write, schedule and publish content, and track how AI assistants mention a brand (GEO).",
  "Confirm with the user before scans, sequence or persona runs, persona generation and content briefs (they use billed AI credits), and before `publish_site_design` or `force`. Only call `submit_feedback` when the user explicitly asks, with content they approved. Never send secrets, credentials, payment or health data, or unrelated personal information through tool inputs.",
  "Content: `list_integrations`, then `list_github_activity` shows what shipped. Draft with `create_post` or let Notra draft with `generate_post`, then publish with `update_post` or `schedule_post`.",
  "Sites (hosted blogs and changelogs): start with `list_sites`. `preview_post_on_site` builds a private preview, `publish_post_to_site` opens a publishing pull request, `get_site_deployment` explains failed builds. Author edits stay unpublished until `publish_site_design`; credit an author with its `site:<id>` ref in `update_post`'s `authorIds`.",
  "GEO: start with `list_projects`, then `get_geo_snapshot` for a diagnosis and next actions. `create_geo_scan` starts a scan; visibility tools return results. Prefer prompt-result summaries plus targeted detail. GEO needs an organization-scoped key and the GEO plan.",
  "If a tool says a workspace must be selected, call `list_workspaces`, ask which one to use, and have the user set NOTRA_ORGANIZATION_ID (stdio), connect to /mcp/<workspace>, or send X-Notra-Organization-Id (HTTP).",
].join("\n\n");

export const SERVER_TITLE = "Notra";
export const SERVER_DESCRIPTION =
  "Turn shipped work into blog posts, changelogs and social posts, publish them to hosted Notra Sites, and track how ChatGPT, Claude, Perplexity and Gemini mention your brand, competitors and content gaps.";
export const SERVER_WEBSITE_URL = "https://www.usenotra.com";
export const SERVER_DOCUMENTATION_URL = "https://www.usenotra.com/docs";
export const SERVER_ICON_SVG_URL = "https://www.usenotra.com/favicon.svg";
export const SERVER_ICON_PNG_URL = "https://www.usenotra.com/apple-icon.png";
export const SERVER_FAVICON_URL = "https://www.usenotra.com/favicon.ico";
export const SERVER_ICONS = [
  { src: SERVER_ICON_SVG_URL, mimeType: "image/svg+xml", sizes: ["any"] },
  { src: SERVER_ICON_PNG_URL, mimeType: "image/png", sizes: ["180x180"] },
];

export const SERVER_REGISTRY_NAME = "io.github.usenotra/notra";
export const SERVER_CARD_DESCRIPTION =
  "Write and publish content from shipped work, and track your brand's AI search visibility.";
export const SERVER_REPOSITORY_URL = "https://github.com/usenotra/notra-mcp";
export const SERVER_CARD_SCHEMA_URL = "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json";
export const SERVER_CARD_CONTENT_TYPE = "application/mcp-server-card+json";
export const AI_CATALOG_CONTENT_TYPE = "application/ai-catalog+json";
export const SERVER_DIRECTORY_LISTINGS = {
  chatgpt: "https://chatgpt.com/plugins/plugin_asdk_app_6ad054bf08248191a320ed1334e3ffde",
  claude: "https://claude.ai/directory/notra",
  composio: "https://composio.dev/toolkits/notra",
};
