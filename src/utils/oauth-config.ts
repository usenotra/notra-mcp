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

function buildResourceAudiences(resource: string): string[] {
  const audiences = new Set([resource]);

  if (resource.endsWith("/mcp")) {
    audiences.add(resource.slice(0, -4));
  } else {
    try {
      audiences.add(new URL("/mcp", resource).toString());
    } catch {
      // Non-URL resource indicators are valid OAuth values, but do not have a
      // predictable MCP endpoint alias.
    }
  }

  return [...audiences];
}

export function getOAuthConfig(): OAuthConfig {
  const issuer =
    process.env.NOTRA_OAUTH_ISSUER ??
    (process.env.NODE_ENV === "development" ? LOCAL_OAUTH_ISSUER : PRODUCTION_OAUTH_ISSUER);
  const resource = process.env.NOTRA_MCP_RESOURCE ?? DEFAULT_MCP_RESOURCE;

  return {
    issuer,
    jwksUrl: process.env.NOTRA_OAUTH_JWKS_URL ?? buildIssuerUrl(OAUTH_JWKS_PATH, issuer),
    resource,
    resourceAudiences: buildResourceAudiences(resource),
    authorizationServerMetadataUrl: buildIssuerUrl(OAUTH_AUTHORIZATION_SERVER_METADATA_PATH, issuer),
  };
}

export function getProtectedResourceMetadata(config: OAuthConfig): OAuthProtectedResourceMetadata {
  return {
    resource: config.resource,
    authorization_servers: [config.issuer],
    authorization_server_metadata_url: config.authorizationServerMetadataUrl,
    bearer_methods_supported: ["header"],
    scopes_supported: [...OAUTH_SCOPES],
  };
}
