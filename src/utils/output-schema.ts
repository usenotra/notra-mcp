import * as z from "zod";
import type { JSONSchema } from "zod/v4/core";
import { API_RESPONSE_SCHEMAS, type ApiOperationId } from "../schemas/api-responses.js";

const cache = new Map<string, z.ZodType>();

function memoize(key: string, build: () => z.ZodType): z.ZodType {
  let schema = cache.get(key);
  if (!schema) {
    schema = build();
    cache.set(key, schema);
  }
  return schema;
}

export function apiOutputSchema(operationId: ApiOperationId): z.ZodType {
  return memoize(operationId, () => z.fromJSONSchema(API_RESPONSE_SCHEMAS[operationId]));
}

export function apiResponseProperty(operationId: ApiOperationId, ...path: string[]): JSONSchema.BaseSchema {
  let schema: JSONSchema.BaseSchema = API_RESPONSE_SCHEMAS[operationId];
  for (const property of path) {
    const next = schema.properties?.[property];
    if (!next || typeof next !== "object") {
      throw new Error(`Response of ${operationId} has no "${path.join(".")}" property in the OpenAPI spec`);
    }
    schema = next;
  }
  return schema;
}

export function apiResponsePropertySchema(operationId: ApiOperationId, ...path: string[]): z.ZodType {
  return memoize(`${operationId}.${path.join(".")}`, () => z.fromJSONSchema(apiResponseProperty(operationId, ...path)));
}
