import { titleCase } from "./format";

type EngineFamilyRule = { key: string; patterns: readonly string[]; exact?: readonly string[] };

const ENGINE_FAMILY_RULES: readonly EngineFamilyRule[] = [
  {
    key: "fx",
    patterns: ["fx/"],
    exact: ["fx"],
  },
  {
    key: "tencent",
    patterns: ["tencent", "hunyuan", "hy3"],
  },
  {
    key: "xiaomi",
    patterns: ["xiaomi"],
  },
  {
    key: "copilot",
    patterns: ["copilot", "bingbot", "microsoft", "bing/"],
  },
  {
    key: "cursor",
    patterns: ["cursor", "composer", "anysphere"],
  },
  {
    key: "opencode",
    patterns: ["opencode"],
  },
  {
    key: "claude-code",
    patterns: ["claude-code", "claude code"],
  },
  {
    key: "codex",
    patterns: ["codex"],
  },
  {
    key: "openai",
    patterns: ["openai", "gpt", "chatgpt", "oai-"],
  },
  {
    key: "claude",
    patterns: ["anthropic", "claude"],
  },
  {
    key: "google",
    patterns: ["ai-overview", "ai-mode", "google-agent", "google-cloudvertex", "googleother", "googlebot"],
  },
  {
    key: "gemini",
    patterns: ["gemini", "google", "bard", "palm"],
  },
  {
    key: "apple",
    patterns: ["applebot", "apple"],
  },
  {
    key: "amazon",
    patterns: ["amazonbot", "amzn-"],
    exact: ["amazon"],
  },
  {
    key: "duckduckgo",
    patterns: ["duckassist", "duckduckgo"],
  },
  {
    key: "cloudflare",
    patterns: ["cloudflare"],
  },
  {
    key: "tiktok",
    patterns: ["tiktok", "bytespider", "bytedance", "trae"],
  },
  {
    key: "mozilla",
    patterns: ["tabstack"],
  },
  {
    key: "manus",
    patterns: ["manus"],
  },
  {
    key: "firecrawl",
    patterns: ["firecrawl"],
  },
  {
    key: "cohere",
    patterns: ["cohere"],
  },
  {
    key: "kimi",
    patterns: ["kimi", "moonshot"],
  },
  {
    key: "zai",
    patterns: ["chatglm", "zhipu", "glm-", "zai/", "z.ai/", "z-ai/"],
    exact: ["glm", "zai", "z.ai", "z-ai"],
  },
  {
    key: "exa",
    patterns: ["exabot", "exasearchbot"],
    exact: ["exa"],
  },
  {
    key: "parallel",
    patterns: ["shapbot", "shap-user"],
    exact: ["parallel"],
  },
  {
    key: "commoncrawl",
    patterns: ["ccbot", "common crawl", "commoncrawl"],
  },
  {
    key: "youcom",
    patterns: ["youbot", "you.com"],
    exact: ["you"],
  },
  {
    key: "liner",
    patterns: ["linerbot", "liner"],
  },
  {
    key: "cline",
    patterns: ["cline", "agentbot", "vscodeextension"],
  },
  {
    key: "devin",
    patterns: ["devin", "cognition"],
  },
  {
    key: "diffbot",
    patterns: ["diffbot"],
  },
  {
    key: "tavily",
    patterns: ["tavily"],
  },
  {
    key: "timpi",
    patterns: ["timpi"],
  },
  {
    key: "huawei",
    patterns: ["pangubot", "huawei", "petalbot"],
  },
  {
    key: "kagi",
    patterns: ["kagi"],
  },
  {
    key: "perplexity",
    patterns: ["perplexity", "sonar"],
  },
  {
    key: "mistral",
    patterns: ["mistral", "mixtral", "magistral", "codestral", "ministral"],
  },
  {
    key: "deepseek",
    patterns: ["deepseek"],
  },
  {
    key: "instagram",
    patterns: ["instagram", "instagr.am"],
  },
  {
    key: "meta",
    patterns: ["meta-", "meta/", "llama", "facebook", "muse-spark"],
    exact: ["meta"],
  },
  {
    key: "grok",
    patterns: ["grok", "x-ai", "xai", "spacexai"],
  },
  {
    key: "qwen",
    patterns: ["qwen", "qwq", "alibaba", "tongyi"],
  },
  {
    key: "cli",
    patterns: [
      "curl",
      "wget",
      "python-",
      "aiohttp",
      "go-http-client",
      "node-fetch",
      "node.js fetch",
      "undici",
      "axios",
      "bun",
      "deno",
      "java http",
      "okhttp",
      "libwww",
      "postman",
      "insomnia",
      "httpie",
    ],
  },
  {
    key: "agent",
    patterns: ["ai2bot", "omgili", "yiyanbot", "baidu", "browser-imitating", "markdown-negotiating"],
  },
];

const ENGINE_FAMILY_LABELS: Record<string, string> = {
  openai: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  google: "Google",
  amazon: "Amazon",
  perplexity: "Perplexity",
  cursor: "Cursor",
  opencode: "OpenCode",
  "claude-code": "Claude Code",
  codex: "Codex",
  fx: "fx",
  copilot: "Copilot",
  mistral: "Mistral",
  cohere: "Cohere",
  deepseek: "DeepSeek",
  meta: "Meta",
  grok: "Grok",
  kimi: "Kimi",
  moonshot: "Kimi",
  zai: "GLM",
  qwen: "Qwen",
  tencent: "Hunyuan",
  xiaomi: "Xiaomi",
};

function engineFamilyKey(engine: string): string | null {
  const value = engine.trim().toLowerCase();
  if (!value) return null;
  const exact = ENGINE_FAMILY_RULES.find((rule) => rule.exact?.includes(value));
  if (exact) return exact.key;
  return ENGINE_FAMILY_RULES.find((rule) => rule.patterns.some((pattern) => value.includes(pattern)))?.key ?? null;
}

export function engineFamily(engine: string): string {
  const key = engineFamilyKey(engine);
  if (key) return Object.hasOwn(ENGINE_FAMILY_LABELS, key) ? ENGINE_FAMILY_LABELS[key]! : titleCase(key);
  const model = engine.slice(engine.indexOf("/") + 1).replace(/(-direct)?-grounded$/, "");
  return titleCase(model);
}
