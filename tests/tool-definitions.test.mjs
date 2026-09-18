import { expect, test, vi } from "vitest";
import * as z from "zod";
import { McpServer } from "@modelcontextprotocol/server";
import { TOOLSET_VALUES } from "../src/constants/toolset.ts";
import { createServer } from "../src/server.ts";
import { shareJsonSchema } from "../src/utils/json-schema-cache.ts";
import { runWithRequestSignal } from "../src/utils/request-signal.ts";
import { parseToolsets } from "../src/utils/toolsets.ts";

function registeredToolNames(options) {
  const names = [];
  const register = vi.spyOn(McpServer.prototype, "registerTool").mockImplementation((name) => names.push(name));
  createServer("key", options);
  register.mockRestore();
  return names;
}

test("JSON Schema conversion runs once per schema and keeps zod validation", () => {
  const schema = z.object({ id: z.string().describe("ID") });
  const convert = vi.spyOn(schema["~standard"].jsonSchema, "input");
  const wrapped = shareJsonSchema(schema);

  // One wrapper per schema; the original schema is never modified.
  expect(shareJsonSchema(schema)).toBe(wrapped);
  expect(wrapped).not.toBe(schema);

  const first = wrapped["~standard"].jsonSchema.input({ target: "draft-2020-12" });
  const second = wrapped["~standard"].jsonSchema.input({ target: "draft-2020-12" });
  // Callers that omit options (zod defaults them) share the same cache entry.
  expect(wrapped["~standard"].jsonSchema.input()).toBe(first);
  expect(convert).toHaveBeenCalledTimes(1);
  expect(second).toBe(first);
  expect(Object.isFrozen(first.properties.id)).toBe(true);
  expect(first).not.toHaveProperty("$schema");
  expect(first.properties.id).toEqual({ type: "string", description: "ID" });
  expect(wrapped["~standard"].validate({ id: "a" })).toEqual({ value: { id: "a" } });
  expect(wrapped["~standard"].validate({ id: 1 }).issues).toHaveLength(1);

  // The untouched original still converts on its own, $schema included.
  const pristine = schema["~standard"].jsonSchema.input({ target: "draft-2020-12" });
  expect(pristine).toHaveProperty("$schema");
  expect(Object.isFrozen(pristine.properties.id)).toBe(false);
});

test("servers built per request share converted tool schemas", () => {
  const [first, second] = [createServer("key-a"), createServer("key-b")];
  for (const name of ["list_posts", "import_geo_prompts", "get_geo_snapshot", "submit_feedback"]) {
    const schema = first.toolInputSchemaJson(name);
    expect(schema?.type).toBe("object");
    // The SDK wraps the root in a fresh object; the converted body is shared.
    expect(second.toolInputSchemaJson(name).properties).toBe(schema.properties);
  }
});

test("tool handlers expose the ambient request signal to Notra API calls", async () => {
  const handlers = new Map();
  vi.spyOn(McpServer.prototype, "registerTool").mockImplementation((name, _config, handler) => {
    handlers.set(name, handler);
  });
  const signals = [];
  vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
    signals.push(init.signal);
    return Response.json({ projects: [] });
  });
  createServer("key");
  const controller = new AbortController();
  await runWithRequestSignal(controller.signal, () => handlers.get("list_projects")({}));
  expect(signals[0].aborted).toBe(false);
  controller.abort();
  expect(signals[0].aborted).toBe(true);
});

test("toolsets default to everything and filter registered tools", () => {
  expect([...parseToolsets(undefined)]).toEqual([...TOOLSET_VALUES]);
  expect([...parseToolsets(" GEO , content ")]).toEqual(["geo", "content"]);
  expect(() => parseToolsets("content,geos")).toThrow("Unknown toolset: geos. Valid toolsets: content, geo");

  const all = registeredToolNames();
  const content = registeredToolNames({ toolsets: parseToolsets("content") });
  const geo = registeredToolNames({ toolsets: parseToolsets("geo") });
  expect(all).toHaveLength(97);
  expect(new Set([...content, ...geo])).toEqual(new Set(all));
  expect(content).toContain("create_chat");
  expect(content).not.toContain("list_projects");
  expect(geo).toContain("list_projects");
  expect(geo.filter((name) => content.includes(name)).sort()).toEqual(["list_workspaces", "submit_feedback", "whoami"]);
});

test("onlyTool registers just the owning module, with full registration as fallback", () => {
  // Every registered tool stays reachable through its owning module — guards
  // drift between the probe-learned owner map and the real registrars.
  const all = registeredToolNames();
  for (const name of all) {
    expect(registeredToolNames({ onlyTool: name })).toContain(name);
  }

  // Module granularity: a post tool comes with the other post tools only.
  const postOnly = registeredToolNames({ onlyTool: "list_posts" });
  expect(postOnly).toEqual([
    "list_posts",
    "get_post",
    "create_post",
    "update_post",
    "delete_post",
    "generate_post",
    "get_post_generation_status",
  ]);

  // Unknown names fall back to full registration so the SDK keeps answering
  // its standard not-found error.
  expect(registeredToolNames({ onlyTool: "does_not_exist" })).toHaveLength(97);

  // A tool outside the active toolsets falls back too, so the filtered server
  // still answers not-found instead of accidentally registering it.
  const contentOnly = registeredToolNames({ toolsets: parseToolsets("content"), onlyTool: "list_projects" });
  expect(contentOnly).not.toContain("list_projects");
  expect(contentOnly).toContain("list_posts");
});

test("NOTRA_MCP_TOOLSETS configures stdio servers", () => {
  vi.stubEnv("NOTRA_MCP_TOOLSETS", "geo");
  expect(registeredToolNames()).not.toContain("list_posts");
});
