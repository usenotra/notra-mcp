import {
  DEFAULT_MCP_RESOURCE,
  LOCAL_OAUTH_ISSUER,
  OAUTH_AUTHORIZATION_SERVER_METADATA_PATH,
  OAUTH_SCOPES,
  OAUTH_JWKS_PATH,
  PRODUCTION_OAUTH_ISSUER,
} from "../constants/oauth.js";
import type { OAuthConfig, OAuthProtectedResourceMetadata } from "../types/auth.js";

function buildIssuerUrl(path: string, issuer: string): string {
  return new URL(path, issuer).toString();
}

export function getOAuthConfig(): OAuthConfig {
  const issuer =
    process.env.NOTRA_OAUTH_ISSUER ??
    (process.env.NODE_ENV === "development" ? LOCAL_OAUTH_ISSUER : PRODUCTION_OAUTH_ISSUER);

  return {
    issuer,
    jwksUrl: process.env.NOTRA_OAUTH_JWKS_URL ?? buildIssuerUrl(OAUTH_JWKS_PATH, issuer),
    resource: process.env.NOTRA_MCP_RESOURCE ?? DEFAULT_MCP_RESOURCE,
    authorizationServerMetadataUrl: buildIssuerUrl(OAUTH_AUTHORIZATION_SERVER_METADATA_PATH, issuer),
  };
}

export function getProtectedResourceMetadata(config: OAuthConfig): OAuthProtectedResourceMetadata {
  return {
    resource: config.resource,
    authorization_servers: [config.authorizationServerMetadataUrl],
    bearer_methods_supported: ["header"],
    scopes_supported: [...OAUTH_SCOPES],
  };
}
