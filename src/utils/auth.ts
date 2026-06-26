import { createRemoteJWKSet, errors as joseErrors, jwtVerify, type JWTPayload } from "jose";
import type { AuthContext, OAuthConfig } from "../types/auth.js";

const remoteJwksByUrl = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

export class AuthError extends Error {
  readonly code = "invalid_token";

  constructor(message = "Invalid bearer token") {
    super(message);
    this.name = "AuthError";
  }
}

export function parseBearerToken(authorization: string | string[] | undefined): string | undefined {
  const header = Array.isArray(authorization) ? authorization.find((value) => /^Bearer\s+/i.test(value.trim())) : authorization;
  if (typeof header !== "string") {
    return undefined;
  }

  const match = header.trim().match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim();
}

function getRemoteJwks(jwksUrl: string): ReturnType<typeof createRemoteJWKSet> {
  const cached = remoteJwksByUrl.get(jwksUrl);
  if (cached) {
    return cached;
  }

  const jwks = createRemoteJWKSet(new URL(jwksUrl), {
    cooldownDuration: 30_000,
    cacheMaxAge: 10 * 60 * 1000,
  });
  remoteJwksByUrl.set(jwksUrl, jwks);
  return jwks;
}

function decodeJsonSegment(segment: string): unknown {
  try {
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
  } catch {
    return undefined;
  }
}

export function looksLikeJwt(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const header = decodeJsonSegment(parts[0]);
  const payload = decodeJsonSegment(parts[1]);
  return typeof header === "object" && header !== null && typeof payload === "object" && payload !== null;
}

function extractScopes(payload: JWTPayload): { scopes: string[]; hasScopeClaim: boolean } {
  const rawScopes = payload.scope ?? payload.scp ?? payload.scopes;
  if (typeof rawScopes === "string") {
    return { scopes: rawScopes.split(/\s+/).filter(Boolean), hasScopeClaim: true };
  }
  if (Array.isArray(rawScopes)) {
    return {
      scopes: rawScopes.filter((scope): scope is string => typeof scope === "string" && scope.length > 0),
      hasScopeClaim: true,
    };
  }
  return { scopes: [], hasScopeClaim: false };
}

function getOrganizationId(payload: JWTPayload): string | undefined {
  const organizationId = payload.organizationId;
  return typeof organizationId === "string" && organizationId.length > 0 ? organizationId : undefined;
}

export async function authenticateBearerToken(token: string, config: OAuthConfig): Promise<AuthContext> {
  if (!looksLikeJwt(token)) {
    return { kind: "apiKey", token };
  }

  try {
    const { payload } = await jwtVerify(token, getRemoteJwks(config.jwksUrl), {
      issuer: config.issuer,
      audience: config.resource,
    });

    if (!payload.sub) {
      throw new AuthError("OAuth token is missing subject");
    }

    const organizationId = getOrganizationId(payload);
    if (!organizationId) {
      throw new AuthError("OAuth token is missing organizationId");
    }

    const { scopes, hasScopeClaim } = extractScopes(payload);

    return {
      kind: "oauth",
      token,
      userId: payload.sub,
      organizationId,
      scopes,
      hasScopeClaim,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    if (error instanceof joseErrors.JOSEError) {
      throw new AuthError(error.message);
    }
    throw new AuthError();
  }
}
