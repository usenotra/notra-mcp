export const SERVER_INSTRUCTIONS = [
  "Notra MCP server: create, schedule and publish content, manage brand identities, integrations and reusable writing skills.",
  "GEO tools are scoped to projects. Call `list_projects` first, then use `get_geo_snapshot` for a compact diagnosis and recommended next actions. Use settings, prompt, sequence, and competitor tools to configure tracking. `create_geo_scan` starts a scan; visibility tools return results. Prefer prompt-result summaries plus targeted detail over the unbounded full result list. Content-gap and brief tools plan articles. Traffic tools report AI crawler and referral activity. GEO tools require an organization-scoped API key and the GEO plan.",
  "Scans, sequence runs, and content briefs use billed AI credits. Confirm with the user before starting them.",
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
