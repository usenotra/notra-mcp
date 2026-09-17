// OpenAI Apps domain verification. The ChatGPT Apps directory confirms
// ownership of `mcp.usenotra.com` by fetching this well-known path and
// comparing the plain-text body against the token issued in the OpenAI
// developer dashboard.
export const OPENAI_APPS_CHALLENGE_PATH = "/.well-known/openai-apps-challenge";
export const OPENAI_APPS_CHALLENGE_TOKEN = "MAfayiwGdhzDm2qJgrEYYzjLaF4ZeCXff0WjTvIAKHM";
