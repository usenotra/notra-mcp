#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSpec } from "./load-openapi-spec.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_FILE = path.join(ROOT, "src", "schemas", "api-responses.ts");
const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];
const SUCCESS_STATUSES = ["200", "201", "202"];
const DROPPED_KEYWORDS = new Set(["example", "examples"]);

function resolveRef(spec, ref) {
  if (!ref.startsWith("#/")) throw new Error(`Unsupported external $ref: ${ref}`);
  return ref
    .slice(2)
    .split("/")
    .reduce((node, segment) => {
      if (node === undefined || node === null) throw new Error(`Unresolvable $ref: ${ref}`);
      return node[segment.replaceAll("~1", "/").replaceAll("~0", "~")];
    }, spec);
}

function dereference(spec, node, stack = []) {
  if (Array.isArray(node)) return node.map((item) => dereference(spec, item, stack));
  if (node === null || typeof node !== "object") return node;
  if (typeof node.$ref === "string") {
    if (stack.includes(node.$ref)) throw new Error(`Recursive $ref cannot be inlined: ${node.$ref}`);
    const { $ref, ...siblings } = node;
    const resolved = dereference(spec, resolveRef(spec, $ref), [...stack, $ref]);
    return { ...resolved, ...dereference(spec, siblings, stack) };
  }
  const result = {};
  for (const [key, value] of Object.entries(node)) {
    if (DROPPED_KEYWORDS.has(key)) continue;
    result[key] = dereference(spec, value, stack);
  }
  return result;
}

function successSchema(operation) {
  for (const status of SUCCESS_STATUSES) {
    const schema = operation.responses?.[status]?.content?.["application/json"]?.schema;
    if (schema) return schema;
  }
  return undefined;
}

function collectResponseSchemas(spec) {
  const schemas = new Map();
  for (const [specPath, item] of Object.entries(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const operation = item[method];
      if (!operation) continue;
      const schema = successSchema(operation);
      if (!schema) continue;
      const operationId = operation.operationId;
      if (!operationId) throw new Error(`${method.toUpperCase()} ${specPath} has no operationId`);
      if (schemas.has(operationId)) throw new Error(`Duplicate operationId: ${operationId}`);
      schemas.set(operationId, dereference(spec, schema));
    }
  }
  return new Map([...schemas].sort(([left], [right]) => left.localeCompare(right)));
}

function render(schemas) {
  const ids = [...schemas.keys()];
  const entries = ids.map((id) => `  ${id}: ${JSON.stringify(schemas.get(id))},`).join("\n");
  return [
    'import type { JSONSchema } from "zod/v4/core";',
    "",
    `export type ApiOperationId =\n${ids.map((id) => `  | "${id}"`).join("\n")};`,
    "",
    `export const API_RESPONSE_SCHEMAS: Record<ApiOperationId, JSONSchema.BaseSchema> = {\n${entries}\n};`,
    "",
  ].join("\n");
}

async function formatWithPrettier(source) {
  const { default: prettier } = await import("prettier");
  const options = (await prettier.resolveConfig(OUTPUT_FILE)) ?? {};
  return prettier.format(source, { ...options, filepath: OUTPUT_FILE });
}

async function main() {
  const check = process.argv.includes("--check");
  const spec = await loadSpec();
  const schemas = collectResponseSchemas(spec);
  const rendered = await formatWithPrettier(render(schemas));

  if (check) {
    const current = await readFile(OUTPUT_FILE, "utf8").catch(() => "");
    if (current !== rendered) {
      console.error(`${path.relative(ROOT, OUTPUT_FILE)} is out of date. Run \`pnpm run generate:output-schemas\`.`);
      process.exit(1);
    }
    console.log(`${path.relative(ROOT, OUTPUT_FILE)} matches the spec (${schemas.size} operations).`);
    return;
  }

  await writeFile(OUTPUT_FILE, rendered);
  console.log(`Wrote ${schemas.size} response schemas to ${path.relative(ROOT, OUTPUT_FILE)}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
