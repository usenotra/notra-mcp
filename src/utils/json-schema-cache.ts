import type { StandardSchemaWithJSON } from "@modelcontextprotocol/server";
import type { JsonSchemaConverter, JsonSchemaOptions } from "../types/json-schema.js";
import { deepFreeze } from "./deep-freeze.js";

const wrappers = new WeakMap<object, StandardSchemaWithJSON>();

/**
 * The SDK converts a tool's zod schema to JSON Schema on every registration and
 * every `tools/list`, and HTTP builds a server per request. Tool schemas are
 * module-level constants, so each one gets a single process-wide wrapper whose
 * conversion result is memoized. The original schema is never modified — the
 * wrapper delegates validation to it and only intercepts `jsonSchema`. The
 * converted result is frozen because every server shares it, and `$schema` is
 * dropped because MCP already defaults tool schemas to draft 2020-12.
 */
export function shareJsonSchema<S extends StandardSchemaWithJSON>(schema: S): S {
  const existing = wrappers.get(schema);
  if (existing) {
    return existing as S;
  }

  const standard = schema["~standard"];
  const converted = new Map<string, Record<string, unknown>>();
  const convert =
    (io: keyof JsonSchemaConverter) =>
    (options?: JsonSchemaOptions): Record<string, unknown> => {
      // zod defaults a missing target to draft 2020-12; normalize so both call
      // shapes share one cache entry (the SDK always asks for 2020-12 anyway).
      const resolved = options ?? { target: "draft-2020-12" };
      const key = `${io}:${resolved.target}`;
      let json = converted.get(key);
      if (!json) {
        const { $schema: _, ...rest } = standard.jsonSchema[io](resolved);
        json = deepFreeze(rest);
        converted.set(key, json);
      }
      return json;
    };

  const wrapped: StandardSchemaWithJSON = {
    "~standard": {
      ...standard,
      validate: (data: unknown) => standard.validate(data),
      jsonSchema: { input: convert("input"), output: convert("output") },
    },
  } as StandardSchemaWithJSON;
  wrappers.set(schema, wrapped);
  return wrapped as S;
}
