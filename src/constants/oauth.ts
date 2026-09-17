// The OAuth authorization server is WorkOS AuthKit. Tokens are minted with
// `iss` set to `https://{WORKOS_AUTHKIT_DOMAIN}`, so the issuer must match what
// we pass to jwtVerify — otherwise every bearer token is rejected.
// This has to be the AuthKit domain. Production uses the custom AuthKit domain
// `oauth.usenotra.com` (CNAME to WorkOS, replaces the default
// `strong-summit-11.authkit.app`). `auth.usenotra.com` is the WorkOS
// Authentication API custom domain and serves no `/oauth2/*` or `/.well-known/*`
// route, so pointing it here breaks both discovery and JWKS verification.
export const PRODUCTION_AUTHKIT_DOMAIN = "oauth.usenotra.com";
export const DEVELOPMENT_AUTHKIT_DOMAIN = "essential-berry-67-development-2.authkit.app";
export const DEFAULT_MCP_RESOURCE = "https://mcp.usenotra.com";
export const NOTRA_API_AUDIENCE = "https://api.usenotra.com";

export const OAUTH_AUTHORIZATION_SERVER_METADATA_PATH = "/.well-known/oauth-authorization-server";
export const OAUTH_PROTECTED_RESOURCE_METADATA_PATH = "/.well-known/oauth-protected-resource";

export const OAUTH_SCOPES = ["openid", "offline_access"] as const;
export const OAUTH_WORKSPACE_CLAIM = "urn:notra:workspace";
export const OAUTH_PERMISSION_CLAIM_PREFIX = "urn:notra:permission:";
export const OAUTH_PERMISSION_RESOURCES = [
  "posts",
  "brand-identities",
  "integrations",
  "schedules",
  "event-triggers",
  "chats",
  "skills",
  "feedback",
  "projects",
  "geo-settings",
  "prompts",
  "competitors",
  "scans",
  "visibility",
  "briefs",
  "agent-readiness",
  "traffic",
] as const;

export const OAUTH_ACCESS_CLAIM = "urn:notra:access";
