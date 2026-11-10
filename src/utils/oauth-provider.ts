import { decodeJwt } from "jose";
import { OAuthError, OAuthErrorCode, oauthCustomProvider, type OAuthMetadata, type OAuthProvider } from "mcp-use/oauth";
import { API_KEY_AUTH_TTL_SECONDS, OAUTH_SCOPES } from "../constants/oauth.js";
import { SERVER_DOCUMENTATION_URL, SERVER_TITLE } from "../constants/server.js";
import type { AuthContext, OAuthConfig } from "../types/auth.js";
import { authenticateBearerToken } from "./auth.js";
import { getMcpResourceUrl } from "./oauth-config.js";

export function getAuthorizationServerMetadata(config: OAuthConfig): OAuthMetadata {
  return {
    issuer: config.issuer,
    authorization_endpoint: new URL("/oauth2/authorize", config.issuer).toString(),
    token_endpoint: new URL("/oauth2/token", config.issuer).toString(),
    registration_endpoint: new URL("/oauth2/register", config.issuer).toString(),
    jwks_uri: config.jwksUrl,
    scopes_supported: [...OAUTH_SCOPES],
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
  };
}

export async function fetchAuthorizationServerMetadata(config: OAuthConfig): Promise<OAuthMetadata> {
  try {
    const response = await fetch(config.authorizationServerMetadataUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      throw new Error(`Authorization server metadata request failed with HTTP ${response.status}`);
    }
    return (await response.json()) as OAuthMetadata;
  } catch (error) {
    console.error("Error fetching authorization server metadata, serving defaults:", error);
    return getAuthorizationServerMetadata(config);
  }
}

function tokenExpiry(auth: AuthContext): number {
  const expiresAt = auth.kind === "oauth" ? decodeJwt(auth.token).exp : undefined;
  return expiresAt ?? Math.floor(Date.now() / 1000) + API_KEY_AUTH_TTL_SECONDS;
}

export function createOAuthProvider(
  config: OAuthConfig,
  metadata: OAuthMetadata = getAuthorizationServerMetadata(config),
): OAuthProvider<AuthContext> {
  return oauthCustomProvider<AuthContext>({
    resource: getMcpResourceUrl(config),
    scopesSupported: [...OAUTH_SCOPES],
    resourceName: SERVER_TITLE,
    serviceDocumentationUrl: new URL(SERVER_DOCUMENTATION_URL),
    oauthMetadata: metadata,
    createTokenVerifier: (resource) => ({
      verifyAccessToken: async (token) => {
        let auth: AuthContext;
        try {
          auth = await authenticateBearerToken(token, config);
        } catch (error) {
          throw new OAuthError(
            OAuthErrorCode.InvalidToken,
            error instanceof Error ? error.message : "Invalid bearer token",
          );
        }
        return {
          token,
          clientId: auth.kind === "oauth" ? (config.clientId ?? auth.userId) : "notra-api-key",
          scopes: auth.kind === "oauth" ? auth.scopes : ["*"],
          expiresAt: tokenExpiry(auth),
          resource,
          extra: { auth },
        };
      },
    }),
    mapAuthInfo: (authInfo) => ({
      user: authInfo.extra?.auth as AuthContext,
      payload: {},
      permissions: authInfo.scopes,
    }),
  });
}
