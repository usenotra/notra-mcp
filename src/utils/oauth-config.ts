import {
  DEFAULT_MCP_RESOURCE,
  DEVELOPMENT_AUTHKIT_DOMAIN,
  NOTRA_API_AUDIENCE,
  OAUTH_AUTHORIZATION_SERVER_METADATA_PATH,
  OAUTH_SCOPES,
  OAUTH_JWKS_PATH,
  PRODUCTION_AUTHKIT_DOMAIN,
} from "../constants/oauth.js";
import type { OAuthConfig, OAuthProtectedResourceMetadata } from "../types/auth.js";

function buildIssuerUrl(path: string, issuer: string): string {
  return new URL(path, issuer).toString();
}

function buildResourceAudiences(resource: string): string[] {
  const audiences = new Set([resource, NOTRA_API_AUDIENCE]);

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
  const authkitDomain =
    process.env.WORKOS_AUTHKIT_DOMAIN ??
    (process.env.NODE_ENV === "development" ? DEVELOPMENT_AUTHKIT_DOMAIN : PRODUCTION_AUTHKIT_DOMAIN);
  const issuer = `https://${authkitDomain}`;
  const resource = process.env.NOTRA_MCP_RESOURCE ?? DEFAULT_MCP_RESOURCE;

  return {
    issuer,
    jwksUrl: buildIssuerUrl(OAUTH_JWKS_PATH, issuer),
    clientId: process.env.WORKOS_CLIENT_ID,
    resource,
    resourceAudiences: buildResourceAudiences(resource),
    authorizationServerMetadataUrl: buildIssuerUrl(OAUTH_AUTHORIZATION_SERVER_METADATA_PATH, issuer),
  };
}

export function getMcpResourceUrl(config: OAuthConfig): string {
  if (config.resource.endsWith("/mcp")) {
    return config.resource;
  }

  try {
    return new URL("/mcp", config.resource).toString();
  } catch {
    return config.resource;
  }
}

export function getProtectedResourceMetadata(
  config: OAuthConfig,
  resource: string = config.resource,
): OAuthProtectedResourceMetadata {
  return {
    resource,
    authorization_servers: [config.issuer],
    bearer_methods_supported: ["header"],
    scopes_supported: [...OAUTH_SCOPES],
  };
}
