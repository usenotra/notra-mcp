import type { StandardSchemaWithJSON } from "mcp-use";

export type JsonSchemaConverter = StandardSchemaWithJSON["~standard"]["jsonSchema"];
export type JsonSchemaOptions = Parameters<JsonSchemaConverter["input"]>[0];
