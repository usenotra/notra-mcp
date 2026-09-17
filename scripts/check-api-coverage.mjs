#!/usr/bin/env node
/**
 * Compares the Notra OpenAPI spec against the routes this MCP server exposes.
 *
 * Run `npm run build` first. The script instantiates the built `NotraClient`
 * against a recording `fetch`, calls every public method with placeholder
 * arguments, and collects the `METHOD /path` pairs it produces. Those are
 * matched against the spec and against `client.<method>(` references made by
 * tools that `createServer()` really registers, either directly or through
 * helper functions those tools call. Unregistered tool modules and unused
 * helpers never count as coverage.
 *
 * Exit code 1 when a spec route has no tool, or when the client calls a route
 * the spec does not know (unless listed in PENDING_API_ROUTES).
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/server";
import { NotraClient } from "../build/notra-client.js";
import { createServer } from "../build/server.js";
import { loadSpec } from "./load-openapi-spec.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLACEHOLDER = "__P__";
const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];
const CLIENT_INTERNALS = new Set(["constructor", "request", "requestText", "geoPath"]);

/** Spec routes deliberately not exposed as MCP tools. */
const EXCLUDED_SPEC_ROUTES = {
  "GET /v1/status": "unauthenticated reachability probe, no value inside an authenticated MCP session",
  "POST /v1/feedback":
    "API-key variant; the spec directs agents to the organization feedback URL used by submit_feedback",
  "POST /v2/eve/v1/session":
    "eve session protocol needs the NDJSON event stream to read replies; create_chat covers conversational use",
  "POST /v2/eve/v1/session/{sessionId}":
    "eve session protocol needs the NDJSON event stream to read replies; post_chat_message covers conversational use",
  "GET /v2/eve/v1/session/{sessionId}/stream":
    "NDJSON event stream, cannot be surfaced through a request/response tool",
};

/** Routes covered by code that does not go through NotraClient. */
const MANUAL_COVERAGE = {
  "POST /v1/feedback/{organizationSlug}": ["submit_feedback"],
};

/** Client routes the production API has not shipped yet. Remove entries once they appear in the spec. */
const PENDING_API_ROUTES = {};

function normalizeSpecPath(specPath) {
  return specPath.replace(/\{[^}]+\}/g, PLACEHOLDER);
}

function listSpecRoutes(spec) {
  const routes = new Map();
  for (const [specPath, item] of Object.entries(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const operation = item[method];
      if (!operation) continue;
      const key = `${method.toUpperCase()} ${specPath}`;
      routes.set(`${method.toUpperCase()} ${normalizeSpecPath(specPath)}`, {
        key,
        tag: operation.tags?.[0] ?? "untagged",
        operationId: operation.operationId ?? "",
        summary: operation.summary ?? "",
      });
    }
  }
  return routes;
}

async function recordClientRoutes() {
  const originalFetch = globalThis.fetch;
  const recorded = new Map();
  let current;
  let hit = false;
  globalThis.fetch = async (input, init) => {
    const url = new URL(typeof input === "string" ? input : input.url);
    const key = `${(init?.method ?? "GET").toUpperCase()} ${decodeURIComponent(url.pathname)}`;
    if (!recorded.has(key)) recorded.set(key, new Set());
    recorded.get(key).add(current);
    hit = true;
    return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
  };

  try {
    const client = new NotraClient("coverage-token", "http://coverage.invalid");
    const methods = Object.getOwnPropertyNames(NotraClient.prototype).filter(
      (name) => !CLIENT_INTERNALS.has(name) && typeof client[name] === "function",
    );
    for (const name of methods) {
      current = name;
      const arity = client[name].length;
      // Path params want strings, query/body params want objects. Start with all
      // strings and swap trailing arguments for objects until a request is made.
      for (let objectArgs = 0; objectArgs <= arity; objectArgs++) {
        hit = false;
        const args = Array.from({ length: arity }, (_, i) => (i >= arity - objectArgs ? {} : PLACEHOLDER));
        try {
          await client[name](...args);
        } catch {
          // Response-shape errors are irrelevant; only the recorded request matters.
        }
        if (hit) break;
      }
      if (!hit) throw new Error(`NotraClient.${name} never issued a request with placeholder arguments`);
    }
    return { recorded, methods };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function collectSourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? collectSourceFiles(full) : entry.name.endsWith(".ts") ? [full] : [];
    }),
  );
  return files.flat();
}

/** Tool names the built server registers at runtime. */
function listRegisteredTools() {
  delete process.env.NOTRA_MCP_TOOLSETS;
  const names = new Set();
  const registerTool = McpServer.prototype.registerTool;
  McpServer.prototype.registerTool = function (name, ...rest) {
    names.add(name);
    return registerTool.call(this, name, ...rest);
  };
  try {
    createServer("coverage-token");
  } finally {
    McpServer.prototype.registerTool = registerTool;
  }
  return names;
}

/** Splits a source file into top-level function declarations. */
function splitTopLevelFunctions(source) {
  const starts = [...source.matchAll(/^(?:export\s+)?(?:async\s+)?function\s+(\w+)/gm)];
  return starts.map((match, index) => ({
    name: match[1],
    body: source.slice(match.index, starts[index + 1]?.index ?? source.length),
  }));
}

/** Maps each `client.<method>` reference to the registered tools that can reach it. */
async function mapMethodsToTools(registeredTools) {
  const helpers = new Map();
  const toolBlocks = [];
  const files = [
    ...(await collectSourceFiles(path.join(ROOT, "src", "tools"))),
    ...(await collectSourceFiles(path.join(ROOT, "src", "utils"))),
  ];
  for (const file of files) {
    for (const fn of splitTopLevelFunctions(await readFile(file, "utf8"))) {
      const blocks = fn.body.split(/registerTool\(\s*"/).slice(1);
      if (blocks.length === 0) {
        if (!helpers.has(fn.name)) helpers.set(fn.name, []);
        helpers.get(fn.name).push(fn.body);
      }
      for (const block of blocks) {
        toolBlocks.push({ toolName: block.slice(0, block.indexOf('"')), source: block });
      }
    }
  }

  const usage = new Map();
  for (const { toolName, source } of toolBlocks) {
    if (!registeredTools.has(toolName)) continue;
    // Follow helper calls transitively so indirect client calls count, but only for this tool.
    const reachable = [source];
    const visited = new Set();
    for (let i = 0; i < reachable.length; i++) {
      for (const [name, bodies] of helpers) {
        if (visited.has(name) || !new RegExp(`\\b${name}\\(`).test(reachable[i])) continue;
        visited.add(name);
        reachable.push(...bodies);
      }
    }
    for (const text of reachable) {
      for (const match of text.matchAll(/client\.(\w+)\(/g)) {
        if (!usage.has(match[1])) usage.set(match[1], new Set());
        usage.get(match[1]).add(toolName);
      }
    }
  }
  return usage;
}

function printGroup(title, rows) {
  if (rows.length === 0) return;
  console.log(`\n${title} (${rows.length})`);
  for (const row of rows) console.log(`  ${row}`);
}

async function main() {
  // Load the spec before recordClientRoutes swaps out globalThis.fetch.
  const spec = await loadSpec();
  const usage = await mapMethodsToTools(listRegisteredTools());
  const { recorded, methods } = await recordClientRoutes();
  const specRoutes = listSpecRoutes(spec);

  const covered = [];
  const missingTool = [];
  const clientOnly = [];
  const unknownRoutes = [];
  const stalePending = [];
  const excludedButCovered = [];

  for (const [normalized, route] of specRoutes) {
    const clientMethods = [...(recorded.get(normalized) ?? [])];
    const tools = new Set(MANUAL_COVERAGE[route.key] ?? []);
    for (const method of clientMethods) for (const user of usage.get(method) ?? []) tools.add(user);

    if (route.key in PENDING_API_ROUTES) stalePending.push(route.key);
    if (tools.size > 0) {
      covered.push(route.key);
      if (route.key in EXCLUDED_SPEC_ROUTES) excludedButCovered.push(route.key);
    } else if (clientMethods.length > 0) {
      clientOnly.push(`${route.key}  client: ${clientMethods.join(", ")}`);
    } else if (!(route.key in EXCLUDED_SPEC_ROUTES)) {
      missingTool.push(`${route.key}  [${route.tag}] ${route.operationId || route.summary}`);
    }
  }

  const pendingNormalized = new Map(Object.keys(PENDING_API_ROUTES).map((key) => [normalizeSpecPath(key), key]));
  for (const [normalized, clientMethods] of recorded) {
    if (specRoutes.has(normalized) || pendingNormalized.has(normalized)) continue;
    unknownRoutes.push(`${normalized.replaceAll(PLACEHOLDER, "{…}")}  client: ${[...clientMethods].join(", ")}`);
  }

  const unusedMethods = methods.filter((name) => !usage.has(name));

  console.log(`Notra API coverage: ${covered.length}/${specRoutes.size} spec routes reachable through MCP tools`);
  console.log(
    `Excluded on purpose: ${Object.keys(EXCLUDED_SPEC_ROUTES).length}, pending API routes: ${Object.keys(PENDING_API_ROUTES).length}`,
  );
  printGroup("Spec routes without an MCP tool", missingTool);
  printGroup("Spec routes reached by NotraClient but not by any tool", clientOnly);
  printGroup("NotraClient routes unknown to the spec", unknownRoutes);
  printGroup("NotraClient methods no registered tool reaches", unusedMethods);
  printGroup("PENDING_API_ROUTES entries now in the spec, remove them", stalePending);
  printGroup("EXCLUDED_SPEC_ROUTES entries that already have a tool, remove them", excludedButCovered);

  const failed =
    missingTool.length + clientOnly.length + unknownRoutes.length + stalePending.length + excludedButCovered.length > 0;
  console.log(failed ? "\nFAIL: MCP tools and API routes are out of sync." : "\nOK: every spec route has an MCP tool.");
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(2);
});
