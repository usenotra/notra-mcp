import type { StandardSchemaWithJSON } from "@modelcontextprotocol/server";

export type JsonSchemaConverter = StandardSchemaWithJSON["~standard"]["jsonSchema"];
export type JsonSchemaOptions = Parameters<JsonSchemaConverter["input"]>[0];
