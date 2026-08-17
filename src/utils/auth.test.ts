import { describe, expect, it } from "vitest";
import type { OAuthConfig } from "../types/auth.js";
import { extractScopes, isAllowedAudience, looksLikeJwt, parseBearerToken } from "./auth.js";

describe("parseBearerToken", () => {
  it("parses a standard bearer header", () => {
    expect(parseBearerToken("Bearer abc")).toBe("abc");
  });

  it("accepts a lowercase bearer scheme", () => {
    expect(parseBearerToken("bearer abc")).toBe("abc");
  });

  it("tolerates extra whitespace around the token", () => {
    expect(parseBearerToken("Bearer  abc ")).toBe("abc");
  });

  it("picks the bearer entry from an array header", () => {
    expect(parseBearerToken(["Basic xyz", "Bearer abc"])).toBe("abc");
  });

  it("returns undefined for a non-bearer scheme", () => {
    expect(parseBearerToken("Basic abc")).toBeUndefined();
  });

  it("returns undefined when the token contains a space", () => {
    expect(parseBearerToken("Bearer a b")).toBeUndefined();
  });

  it("returns undefined for a bare Bearer header", () => {
    expect(parseBearerToken("Bearer")).toBeUndefined();
    expect(parseBearerToken("Bearer ")).toBeUndefined();
  });

  it("returns undefined for undefined input", () => {
    expect(parseBearerToken(undefined)).toBeUndefined();
  });
});

describe("looksLikeJwt", () => {
  it("returns true for a structurally valid JWT", () => {
    const header = Buffer.from(JSON.stringify({ alg: "none" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify({ sub: "user_1" })).toString("base64url");
    const signature = Buffer.from("sig").toString("base64url");
    expect(looksLikeJwt(`${header}.${payload}.${signature}`)).toBe(true);
  });

  it("returns false for an opaque API key", () => {
    expect(looksLikeJwt("ntra_abc123")).toBe(false);
  });

  it("returns false for a two-segment string", () => {
    expect(looksLikeJwt("a.b")).toBe(false);
  });
});

describe("extractScopes", () => {
  it("unions scope and permissions claims", () => {
    expect(extractScopes({ scope: "posts.read posts.write", permissions: ["posts.read", "chats.read"] })).toEqual([
      "posts.read",
      "posts.write",
      "chats.read",
    ]);
  });

  it("reads array scopes from the scp claim", () => {
    expect(extractScopes({ scp: ["skills.read"] })).toEqual(["skills.read"]);
  });

  it("reads the permissions claim on its own", () => {
    expect(extractScopes({ permissions: ["posts.read"] })).toEqual(["posts.read"]);
  });

  it("treats a token without any scope claims as first-party full access", () => {
    expect(extractScopes({ sub: "user_1" })).toEqual(["*"]);
  });

  it("keeps an explicitly empty scope claim empty", () => {
    expect(extractScopes({ scope: "" })).toEqual([]);
  });
});

describe("isAllowedAudience", () => {
  const config: OAuthConfig = {
    issuer: "https://auth.usenotra.com",
    jwksUrl: "https://auth.usenotra.com/oauth2/jwks",
    clientId: "client_123",
    resource: "https://mcp.usenotra.com",
    resourceAudiences: ["https://mcp.usenotra.com", "https://api.usenotra.com", "https://mcp.usenotra.com/mcp"],
    authorizationServerMetadataUrl: "https://auth.usenotra.com/.well-known/oauth-authorization-server",
  };

  it("allows a token without an audience", () => {
    expect(isAllowedAudience(undefined, config)).toBe(true);
  });

  it("allows the MCP resource audiences", () => {
    expect(isAllowedAudience("https://mcp.usenotra.com", config)).toBe(true);
    expect(isAllowedAudience("https://mcp.usenotra.com/mcp", config)).toBe(true);
  });

  it("allows the Notra API audience", () => {
    expect(isAllowedAudience("https://api.usenotra.com", config)).toBe(true);
  });

  it("allows the WorkOS client id", () => {
    expect(isAllowedAudience("client_123", config)).toBe(true);
  });

  it("allows an audience array containing an allowed value", () => {
    expect(isAllowedAudience(["https://other.example.com", "client_123"], config)).toBe(true);
  });

  it("rejects an unknown audience", () => {
    expect(isAllowedAudience("https://evil.example.com", config)).toBe(false);
  });

  it("does not allow a client id audience when none is configured", () => {
    expect(isAllowedAudience("client_123", { ...config, clientId: undefined })).toBe(false);
  });
});
