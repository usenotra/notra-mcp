// The OAuth authorization server is WorkOS AuthKit. Tokens are minted with
// `iss` set to `https://{WORKOS_AUTHKIT_DOMAIN}`, so the issuer must match what
// we pass to jwtVerify — otherwise every bearer token is rejected.
// This has to be the AuthKit domain. `auth.usenotra.com` is the WorkOS
// Authentication API custom domain and serves no `/oauth2/*` or `/.well-known/*`
// route, so pointing it here breaks both discovery and JWKS verification.
export const PRODUCTION_AUTHKIT_DOMAIN = "strong-summit-11.authkit.app";
export const DEVELOPMENT_AUTHKIT_DOMAIN = "essential-berry-67-development-2.authkit.app";
export const DEFAULT_MCP_RESOURCE = "https://mcp.usenotra.com";
export const NOTRA_API_AUDIENCE = "https://api.usenotra.com";

export const OAUTH_AUTHORIZATION_SERVER_METADATA_PATH = "/.well-known/oauth-authorization-server";
export const OAUTH_AUTHORIZATION_SERVER_MCP_METADATA_PATH = "/.well-known/oauth-authorization-server/mcp";
export const OAUTH_PROTECTED_RESOURCE_METADATA_PATH = "/.well-known/oauth-protected-resource";
export const OAUTH_PROTECTED_RESOURCE_MCP_METADATA_PATH = "/.well-known/oauth-protected-resource/mcp";
export const OAUTH_JWKS_PATH = "/oauth2/jwks";

export const OAUTH_SCOPES = [
  "offline_access",
  "posts.read",
  "posts.write",
  "brand-identities.read",
  "brand-identities.write",
  "integrations.read",
  "integrations.write",
  "schedules.read",
  "schedules.write",
  "event-triggers.read",
  "event-triggers.write",
  "chats.read",
  "chats.write",
  "skills.read",
  "skills.write",
] as const;
