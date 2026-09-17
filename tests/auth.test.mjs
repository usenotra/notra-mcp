import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { test, onTestFinished } from "vitest";
import { exportJWK, generateKeyPair, SignJWT } from "jose";
import { AuthError, authenticateBearerToken, extractScopes, parseBearerToken } from "../src/utils/auth.ts";
import { getOAuthConfig, getMcpResourceUrl, getProtectedResourceMetadata } from "../src/utils/oauth-config.ts";

test("bearer parsing handles header arrays and rejects missing or split tokens", () => {
  assert.equal(parseBearerToken("  bEaReR   abc  "), "abc");
  assert.equal(parseBearerToken(["Basic abc", "Bearer token"]), "token");
  for (const input of [undefined, "", "Basic abc", "Bearer ", "Bearer a b", "Bearer a\tb"]) {
    assert.equal(parseBearerToken(input), undefined);
  }
});

test("scope claims merge and deduplicate without granting wildcard for explicit empty scopes", () => {
  assert.deepEqual(extractScopes({}), []);
  assert.deepEqual(extractScopes({ scope: "posts.read posts.write", permissions: ["posts.read", "skills.read", 42] }), [
    "posts.read",
    "posts.write",
    "skills.read",
  ]);
  for (const payload of [{ scope: "" }, { scp: [] }, { scopes: [] }, { permissions: [] }])
    assert.deepEqual(extractScopes(payload), []);
});

test("OAuth configuration discovers the configured issuer and both resource aliases", () => {
  const keys = ["NODE_ENV", "WORKOS_AUTHKIT_DOMAIN", "NOTRA_MCP_RESOURCE", "WORKOS_CLIENT_ID"];
  const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  onTestFinished(() => {
    for (const key of keys) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  });
  delete process.env.WORKOS_AUTHKIT_DOMAIN;
  process.env.NODE_ENV = "production";
  process.env.NOTRA_MCP_RESOURCE = "https://mcp.example.test";
  assert.equal(getOAuthConfig().issuer, "https://oauth.usenotra.com");
  process.env.NODE_ENV = "development";
  assert.match(getOAuthConfig().issuer, /development-2.authkit.app$/);
  process.env.WORKOS_AUTHKIT_DOMAIN = "auth.example.test";
  for (const resource of ["https://mcp.example.test", "https://mcp.example.test/mcp"]) {
    process.env.NOTRA_MCP_RESOURCE = resource;
    const config = getOAuthConfig();
    assert.equal(config.jwksUrl, "https://auth.example.test/oauth2/jwks");
    assert.deepEqual(
      new Set(config.resourceAudiences),
      new Set(["https://mcp.example.test", "https://mcp.example.test/mcp", "https://api.usenotra.com"]),
    );
    assert.equal(getMcpResourceUrl(config), "https://mcp.example.test/mcp");
    assert.deepEqual(getProtectedResourceMetadata(config).authorization_servers, [config.issuer]);
  }
  process.env.NOTRA_MCP_RESOURCE = "urn:notra:mcp";
  assert.equal(getMcpResourceUrl(getOAuthConfig()), "urn:notra:mcp");
});

test("OAuth verifies signatures and claims; API keys remain delegated to the API", async () => {
  const { publicKey, privateKey } = await generateKeyPair("RS256");
  const jwk = { ...(await exportJWK(publicKey)), kid: "test-key", alg: "RS256" };
  let jwksRequests = 0;
  const server = createServer((_req, res) => {
    jwksRequests++;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ keys: [jwk] }));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  onTestFinished(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      }),
  );
  const issuer = `http://127.0.0.1:${server.address().port}`;
  const config = {
    issuer,
    jwksUrl: `${issuer}/jwks`,
    resource: "https://mcp.example.test",
    resourceAudiences: ["https://mcp.example.test"],
    clientId: "client-1",
  };
  const sign = (claims = {}, key = privateKey) =>
    new SignJWT({
      iss: issuer,
      aud: config.resource,
      sub: "user-1",
      org_id: "org-1",
      exp: Math.floor(Date.now() / 1000) + 300,
      ...claims,
    })
      .setProtectedHeader({ alg: "RS256", kid: "test-key" })
      .sign(key);
  const token = await sign({ scope: "posts.read" });
  assert.deepEqual(await authenticateBearerToken(token, config), {
    kind: "oauth",
    token,
    userId: "user-1",
    organizationId: "org-1",
    scopes: ["posts.read"],
  });
  for (const aud of ["client-1", config.resource, ["other", config.resource]])
    assert.equal((await authenticateBearerToken(await sign({ aud }), config)).kind, "oauth");
  for (const claims of [
    { aud: "wrong" },
    { aud: undefined },
    { sub: undefined },
    { org_id: undefined },
    { org_id: "" },
    { org_id: 42 },
    { exp: 1 },
  ]) {
    await assert.rejects(authenticateBearerToken(await sign(claims), config), AuthError);
  }
  const organizationToken = await sign({ org_id: "workos-org", "urn:notra:access": "read" });
  const organizationAuth = await authenticateBearerToken(organizationToken, config);
  assert.equal(organizationAuth.organizationId, "workos-org");
  assert.equal(organizationAuth.scopes.length, 17);
  assert.ok(organizationAuth.scopes.includes("traffic.read"));
  assert.ok(!organizationAuth.scopes.includes("posts.write"));

  const consentToken = await sign({
    org_id: undefined,
    "urn:notra:workspace": "local-workspace",
    "urn:notra:permission:posts": "read",
    "urn:notra:permission:scans": "write",
    scope: "openid offline_access",
    permissions: ["*"],
  });
  const consentAuth = await authenticateBearerToken(consentToken, config);
  assert.equal(consentAuth.organizationId, "local-workspace");
  assert.deepEqual(consentAuth.scopes, ["posts.read", "scans.read", "scans.write"]);
  for (const claims of [
    { org_id: undefined, "urn:notra:permission:posts": "write" },
    { "urn:notra:workspace": "", permissions: ["*"] },
    { "urn:notra:workspace": "local-workspace", "urn:notra:permission:posts": "*" },
  ]) {
    await assert.rejects(authenticateBearerToken(await sign(claims), config), AuthError);
  }
  const other = await generateKeyPair("RS256");
  await assert.rejects(authenticateBearerToken(await sign({}, other.privateKey), config), AuthError);
  assert.equal(jwksRequests, 1, "JWKS should be cached across token verification");
  for (const key of [
    "notra-api-key",
    "a.b.c",
    await sign({ iss: "https://api.example.test" }),
    await sign({ iss: undefined }),
  ]) {
    assert.deepEqual(await authenticateBearerToken(key, config), { kind: "apiKey", token: key });
  }
});

test("access levels expand scopes without broader claims overriding consent", () => {
  for (const level of ["read", "write", "full"]) {
    const scopes = extractScopes({
      "urn:notra:workspace": "workspace-1",
      "urn:notra:access": level,
      "urn:notra:permission:posts": "write",
      permissions: ["*"],
    });
    assert.equal(scopes.length, level === "full" ? 34 : 17);
    assert.equal(scopes.includes("posts.read"), level !== "write");
    assert.equal(scopes.includes("scans.write"), level !== "read");
    assert.equal(scopes.includes("traffic.read"), level !== "write");
    assert.ok(!scopes.includes("*"));
  }
  assert.throws(
    () => extractScopes({ "urn:notra:workspace": "workspace-1", "urn:notra:access": "invalid" }),
    AuthError,
  );
  assert.throws(() => extractScopes({ "urn:notra:access": "full" }), AuthError);
});
