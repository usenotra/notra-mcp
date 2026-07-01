import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { beforeAll, describe, expect, it } from "vitest";
import { createServer } from "../server.js";

const EXPECTED_TOOL_COUNT = 29;

type ListedTool = {
  name: string;
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
  };
};

let tools: ListedTool[] = [];

beforeAll(async () => {
  const server = createServer("dummy-key");
  const client = new Client({ name: "annotations-test", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  const result = await client.listTools();
  tools = result.tools as ListedTool[];
  await client.close();
  await server.close();
});

describe("tool annotations", () => {
  it("registers the expected number of tools", () => {
    expect(tools).toHaveLength(EXPECTED_TOOL_COUNT);
  });

  it("declares annotations with a title on every tool", () => {
    for (const tool of tools) {
      expect(tool.annotations, `${tool.name} is missing annotations`).toBeDefined();
      expect(tool.annotations?.title, `${tool.name} is missing an annotations title`).toBeTruthy();
    }
  });

  it("marks every list_*/get_* tool as read-only", () => {
    const readOnlyTools = tools.filter((tool) => tool.name.startsWith("list_") || tool.name.startsWith("get_"));
    expect(readOnlyTools.length).toBeGreaterThan(0);
    for (const tool of readOnlyTools) {
      expect(tool.annotations?.readOnlyHint, `${tool.name} should have readOnlyHint: true`).toBe(true);
    }
  });

  it("marks every delete_* tool as destructive", () => {
    const deleteTools = tools.filter((tool) => tool.name.startsWith("delete_"));
    expect(deleteTools).toHaveLength(5);
    for (const tool of deleteTools) {
      expect(tool.annotations?.destructiveHint, `${tool.name} should have destructiveHint: true`).toBe(true);
    }
  });

  it("exposes the expected hints on list_posts and delete_post", () => {
    const listPosts = tools.find((tool) => tool.name === "list_posts");
    const deletePost = tools.find((tool) => tool.name === "delete_post");
    expect(listPosts?.annotations?.readOnlyHint).toBe(true);
    expect(deletePost?.annotations?.destructiveHint).toBe(true);
  });
});
