export const SERVER_INSTRUCTIONS = [
  "Notra: create, schedule and publish content, manage brand identities, integrations and reusable writing skills.",
  "To write about recent work, call `list_integrations`, then `list_github_activity` to see what shipped. Draft the post yourself with `create_post`, or let Notra draft it with `generate_post`. Then publish it with `update_post` or `schedule_post`.",
  "GEO tools are scoped to projects. Call `list_projects` first, then use `get_geo_snapshot` for a compact diagnosis and recommended next actions. Use settings, prompt, sequence, and competitor tools to configure tracking. `create_geo_scan` starts a scan; visibility tools return results. Prefer prompt-result summaries plus targeted detail over the unbounded full result list. Content-gap and brief tools plan articles. Traffic tools report AI crawler and referral activity. GEO tools require an organization-scoped API key and the GEO plan.",
  "Account API keys can reach several workspaces. If a tool reports that a workspace must be selected, call `list_workspaces`, ask the user which workspace to use, and tell them to set it as NOTRA_ORGANIZATION_ID (stdio), or connect to /mcp/<workspace> or send the X-Notra-Organization-Id header (HTTP). This connection cannot switch workspaces by itself.",
  "Scans, sequence runs, and content briefs use billed AI credits. Confirm with the user before starting them.",
  "Use only task-specific business content. Do not request or send health records, biometric data, government identifiers, payment card data, passwords, API keys, or authentication secrets through tool inputs. Complete authentication and credential setup in Notra's dashboard. Do not include conversation history or unrelated personal information in content or feedback.",
  "`submit_feedback` sends a message to the Notra team. Only call it when the user explicitly asks to send feedback to Notra, and only with content the user has approved. Never call it on your own initiative, for example after a tool error or an unsupported request; at most, mention that the user can send feedback if they want to.",
].join("\n\n");

export const SERVER_TITLE = "Notra";
export const SERVER_WEBSITE_URL = "https://www.usenotra.com";
export const SERVER_DOCUMENTATION_URL = "https://www.usenotra.com/docs";
export const SERVER_ICON_SVG_URL = "https://www.usenotra.com/favicon.svg";
export const SERVER_ICON_PNG_URL = "https://www.usenotra.com/apple-icon.png";
export const SERVER_FAVICON_URL = "https://www.usenotra.com/favicon.ico";
export const SERVER_ICONS = [
  { src: SERVER_ICON_SVG_URL, mimeType: "image/svg+xml", sizes: ["any"] },
  { src: SERVER_ICON_PNG_URL, mimeType: "image/png", sizes: ["180x180"] },
];
