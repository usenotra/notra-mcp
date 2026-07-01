import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer } from "../server.js";

let client: Client;
let close: () => Promise<void>;

beforeAll(async () => {
  const server = createServer("dummy-key");
  client = new Client({ name: "generate-post-schema-test", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  close = async () => {
    await client.close();
    await server.close();
  };
});

afterAll(async () => {
  await close();
});

describe("generate_post input schema", () => {
  it("rejects empty commit SHAs in selectedItems", async () => {
    const result = await client.callTool({
      name: "generate_post",
      arguments: { contentType: "changelog", selectedItems: { commitShas: [""] } },
    });

    expect(result.isError).toBe(true);
    expect(JSON.stringify(result.content)).toContain("commitShas");
  });

  it("rejects non-positive pull request numbers in selectedItems", async () => {
    const result = await client.callTool({
      name: "generate_post",
      arguments: {
        contentType: "changelog",
        selectedItems: { pullRequestNumbers: [{ repositoryId: "r1", number: 0 }] },
      },
    });

    expect(result.isError).toBe(true);
    expect(JSON.stringify(result.content)).toContain("pullRequestNumbers");
  });
});
