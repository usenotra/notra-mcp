import { describe, expect, it } from "vitest";
import { looksLikeJwt, parseBearerToken } from "./auth.js";

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
