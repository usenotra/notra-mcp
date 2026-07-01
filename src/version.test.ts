import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// The installed SDK exposes no public accessor for the declared server version
// (only the private `_serverInfo`), so we assert on the version literal in
// src/server.ts source instead. The assertion target is:
// literal in createServer === package.json version === server.json version.

const packageVersion = (
  JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
    version: string;
  }
).version;

describe("version consistency", () => {
  it("keeps the McpServer version literal in sync with package.json", () => {
    const source = readFileSync(new URL("./server.ts", import.meta.url), "utf8");
    const match = source.match(/version:\s*"([^"]+)"/);
    expect(match, "expected a version literal in src/server.ts createServer").not.toBeNull();
    expect(match?.[1]).toBe(packageVersion);
  });

  it("keeps server.json in sync with package.json", () => {
    const serverJson = JSON.parse(readFileSync(new URL("../server.json", import.meta.url), "utf8")) as {
      version?: string;
      packages?: Array<{ version?: string }>;
    };
    expect(serverJson.version).toBe(packageVersion);
  });
});
