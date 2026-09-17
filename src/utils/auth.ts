import { createRemoteJWKSet, decodeJwt, errors as joseErrors, jwtVerify, type JWTPayload } from "jose";
import {
  OAUTH_ACCESS_CLAIM,
  OAUTH_WORKSPACE_CLAIM,
  OAUTH_PERMISSION_CLAIM_PREFIX,
  OAUTH_PERMISSION_RESOURCES,
} from "../constants/oauth.js";
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
  const headers = Array.isArray(authorization) ? authorization : authorization ? [authorization] : [];
  const header = headers.find((value) => value.trimStart().slice(0, 7).toLowerCase() === "bearer ");
  if (typeof header !== "string") {
    return undefined;
  }

  const trimmed = header.trimStart();
  let tokenStart = "Bearer".length;
  while (tokenStart < trimmed.length) {
    const char = trimmed[tokenStart];
    if (char !== " " && char !== "\t") {
      break;
    }
    tokenStart += 1;
  }

  const token = trimmed.slice(tokenStart).trim();
  if (token.includes(" ") || token.includes("\t")) {
    return undefined;
  }
  return token.length > 0 ? token : undefined;
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

function normalizeScopeValue(rawScopes: unknown): string[] | undefined {
  if (typeof rawScopes === "string") {
    return rawScopes.split(/\s+/).filter(Boolean);
  }
  if (Array.isArray(rawScopes)) {
    return rawScopes.filter((scope): scope is string => typeof scope === "string" && scope.length > 0);
  }
  return undefined;
}

export function extractScopes(payload: JWTPayload): string[] {
  if (
    payload[OAUTH_ACCESS_CLAIM] !== undefined ||
    payload[OAUTH_WORKSPACE_CLAIM] !== undefined ||
    Object.keys(payload).some((key) => key.startsWith(OAUTH_PERMISSION_CLAIM_PREFIX))
  ) {
    const workspace = payload[OAUTH_WORKSPACE_CLAIM] ?? payload.org_id;
    if (typeof workspace !== "string" || !workspace.trim()) {
      throw new AuthError("OAuth token has an invalid consent workspace");
    }
    const accessLevel = payload[OAUTH_ACCESS_CLAIM];
    if (accessLevel !== undefined) {
      if (accessLevel !== "read" && accessLevel !== "write" && accessLevel !== "full") {
        throw new AuthError("OAuth token has an invalid access level");
      }
      return OAUTH_PERMISSION_RESOURCES.flatMap((resource) =>
        accessLevel === "full" ? [`${resource}.read`, `${resource}.write`] : [`${resource}.${accessLevel}`],
      );
    }
    const scopes: string[] = [];
    for (const resource of OAUTH_PERMISSION_RESOURCES) {
      const access = payload[`${OAUTH_PERMISSION_CLAIM_PREFIX}${resource}`];
      if (access === undefined || access === "none") continue;
      if (access !== "read" && access !== "write") {
        throw new AuthError("OAuth token has an invalid permission choice");
      }
      scopes.push(`${resource}.read`);
      if (access === "write") scopes.push(`${resource}.write`);
    }
    return scopes;
  }
  const scopeClaim = normalizeScopeValue(payload.scope ?? payload.scp ?? payload.scopes);
  const permissionsClaim = normalizeScopeValue(payload.permissions);

  if (scopeClaim === undefined && permissionsClaim === undefined) {
    return [];
  }

  return [...new Set([...(scopeClaim ?? []), ...(permissionsClaim ?? [])])];
}

export function isAllowedAudience(aud: JWTPayload["aud"], config: OAuthConfig): boolean {
  if (aud === undefined) {
    return false;
  }

  const allowed = new Set(config.resourceAudiences);
  if (config.clientId) {
    allowed.add(config.clientId);
  }

  const audiences = Array.isArray(aud) ? aud : [aud];
  return audiences.some((audience) => allowed.has(audience));
}

export async function authenticateBearerToken(token: string, config: OAuthConfig): Promise<AuthContext> {
  if (!looksLikeJwt(token)) {
    return { kind: "apiKey", token };
  }

  // Notra API keys can themselves be JWTs, but they are not issued by the
  // AuthKit authorization server (they carry no `iss` or a different one and are
  // signed by a different key). Only tokens whose `iss` matches our configured
  // AuthKit issuer are treated as OAuth access tokens and cryptographically
  // verified here; anything else is forwarded to the Notra API as an API key,
  // which performs its own authentication.
  // The `iss` read here is unverified and used solely for routing — OAuth tokens
  // are still fully verified below, and API keys are validated downstream.
  let unverifiedIssuer: string | undefined;
  try {
    unverifiedIssuer = decodeJwt(token).iss;
  } catch {
    unverifiedIssuer = undefined;
  }

  if (unverifiedIssuer !== config.issuer) {
    return { kind: "apiKey", token };
  }

  try {
    const { payload } = await jwtVerify(token, getRemoteJwks(config.jwksUrl), {
      issuer: config.issuer,
    });

    if (!isAllowedAudience(payload.aud, config)) {
      throw new AuthError("OAuth token has an invalid audience");
    }

    if (!payload.sub) {
      throw new AuthError("OAuth token is missing subject");
    }

    const organizationId = payload[OAUTH_WORKSPACE_CLAIM] ?? payload.org_id;
    if (typeof organizationId !== "string" || organizationId.length === 0) {
      throw new AuthError("OAuth token is missing workspace");
    }

    return {
      kind: "oauth",
      token,
      userId: payload.sub,
      organizationId,
      scopes: extractScopes(payload),
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
