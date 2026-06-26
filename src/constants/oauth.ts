export const PRODUCTION_OAUTH_ISSUER = "https://app.usenotra.com";
export const LOCAL_OAUTH_ISSUER = "http://localhost:3000";
export const DEFAULT_MCP_RESOURCE = "https://mcp.usenotra.com";

export const OAUTH_AUTHORIZATION_SERVER_METADATA_PATH = "/.well-known/oauth-authorization-server";
export const OAUTH_PROTECTED_RESOURCE_METADATA_PATH = "/.well-known/oauth-protected-resource";
export const OAUTH_JWKS_PATH = "/api/auth/jwks";

export const OAUTH_SCOPES = [
  "posts:read",
  "posts:write",
  "brand-identities:read",
  "brand-identities:write",
  "integrations:read",
  "integrations:write",
  "schedules:read",
  "schedules:write",
  "chats:read",
  "chats:write",
  "skills:read",
  "skills:write",
] as const;
