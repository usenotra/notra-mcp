// The OAuth issuer is the better-auth issuer identifier, which lives under
// /api/auth (see https://app.usenotra.com/.well-known/oauth-authorization-server).
// Tokens are minted with `iss` set to this exact value, so it must match what we
// pass to jwtVerify — otherwise every bearer token is rejected.
export const PRODUCTION_OAUTH_ISSUER = "https://app.usenotra.com/api/auth";
export const LOCAL_OAUTH_ISSUER = "http://localhost:3000/api/auth";
export const DEFAULT_MCP_RESOURCE = "https://mcp.usenotra.com";

export const OAUTH_AUTHORIZATION_SERVER_METADATA_PATH = "/.well-known/oauth-authorization-server";
export const OAUTH_PROTECTED_RESOURCE_METADATA_PATH = "/.well-known/oauth-protected-resource";
export const OAUTH_JWKS_PATH = "/api/auth/jwks";

export const OAUTH_SCOPES = [
  "offline_access",
  "api.read",
  "api.write",
  "posts.read",
  "posts.write",
  "brand-identities.read",
  "brand-identities.write",
  "integrations.read",
  "integrations.write",
  "schedules.read",
  "schedules.write",
  "chats.read",
  "chats.write",
  "skills.read",
  "skills.write",
] as const;
