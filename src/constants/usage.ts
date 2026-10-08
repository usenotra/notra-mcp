export const USAGE_DELIVERY_TIMEOUT_MS = 5000;
export const USAGE_MAX_PENDING_DELIVERIES = 64;
export const POSTHOG_DEFAULT_HOST = "https://us.i.posthog.com";

export const MCP_CLIENT_PATTERNS = [
  { name: "claude-code", pattern: /claude[-_ ]?code/i },
  { name: "claude", pattern: /claude/i },
  { name: "cursor", pattern: /cursor/i },
  { name: "codex", pattern: /codex/i },
  { name: "chatgpt", pattern: /chatgpt|openai/i },
  { name: "vscode", pattern: /visual studio code|vscode/i },
  { name: "openclaw", pattern: /openclaw/i },
] as const;
