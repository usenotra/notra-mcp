import assert from "node:assert/strict";
import { test, vi } from "vitest";
import { NotraClient } from "../src/notra-client.ts";
import { createServer } from "../src/server.ts";

const workspace = {
  id: "org_123",
  slug: "acme",
  name: "Acme",
  logo: null,
};

const response = {
  currentWorkspace: workspace,
  workspaces: [
    {
      ...workspace,
      role: "admin",
      status: "active",
      isCurrent: true,
    },
  ],
  authentication: {
    type: "oauth",
    accountId: "user_123",
    scopes: ["posts.read"],
  },
};

const pendingWorkspace = {
  id: "org_456",
  slug: "beta",
  name: "Beta",
  logo: "https://example.test/logo.png",
  role: "member",
  status: "pending",
  isCurrent: false,
};

test("the client fetches workspace context without a resource-specific API call", async () => {
  vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options) => {
    assert.equal(new URL(url).pathname, "/v1/me/workspaces");
    assert.equal(new URL(url).search, "");
    assert.equal(options.headers.Authorization, "Bearer secret");
    return Response.json(response);
  });

  const client = new NotraClient("secret", "https://api.example.test");
  assert.deepEqual(await client.getWorkspaceContext(), response);
});

test("whoami stays focused on the current workspace", async () => {
  vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
    assert.equal(new URL(url).search, "");
    return Response.json(response);
  });
  const server = createServer("secret");
  const tool = server._registeredTools.whoami;
  const whoami = {
    workspace,
    authentication: response.authentication,
  };

  assert.equal(tool.annotations.readOnlyHint, true);
  assert.deepEqual(await tool.handler({}), {
    content: [{ type: "text", text: JSON.stringify(whoami) }],
    structuredContent: whoami,
  });
});

test("list_workspaces exposes accepted and pending workspace discovery", async () => {
  const discoveryResponse = {
    ...response,
    workspaces: [...response.workspaces, { ...pendingWorkspace, invitationCode: "private" }],
    accessToken: "private",
  };
  vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
    assert.equal(new URL(url).search, "?includePending=true");
    return Response.json(discoveryResponse);
  });
  const server = createServer("secret");
  const tool = server._registeredTools.list_workspaces;
  const expected = {
    ...response,
    workspaces: [...response.workspaces, pendingWorkspace],
  };

  assert.equal(tool.annotations.readOnlyHint, true);
  assert.deepEqual(await tool.handler({}), {
    content: [{ type: "text", text: JSON.stringify(expected) }],
    structuredContent: expected,
  });
});

test("list_workspaces preserves API-key workspace isolation", async () => {
  const apiKeyResponse = {
    currentWorkspace: workspace,
    workspaces: [{ ...response.workspaces[0], role: null }],
    authentication: { type: "apiKey" },
  };
  vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json(apiKeyResponse));
  const server = createServer("secret");

  const result = await server._registeredTools.list_workspaces.handler({});

  assert.deepEqual(result.structuredContent, apiKeyResponse);
  assert.equal(result.structuredContent.workspaces.length, 1);
});

test("whoami never includes the bearer token in its result", async () => {
  vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json(response));
  const server = createServer("secret");

  const result = await server._registeredTools.whoami.handler({});

  assert.doesNotMatch(JSON.stringify(result), /secret/);
});
