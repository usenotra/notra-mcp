import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";
import { GEO_SEQUENCE_MAX_TURNS } from "../constants/geo.js";
import type { NotraClient } from "../notra-client.js";
import {
  geoPromptTextSchema,
  geoResourceIdSchema,
  geoShortTextSchema,
  projectIdSchema,
} from "../schemas/geo-fields.js";
import { handleError } from "../utils/mcp.js";

export function registerGeoSequenceTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_geo_sequences",
    {
      description: "List a project's GEO prompt sequences (multi-turn conversations played against answer engines)",
      annotations: { title: "List GEO Sequences", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
      }),
    },
    async ({ projectId }) => {
      return handleError(() => client.listGeoSequences(projectId));
    },
  );

  server.registerTool(
    "create_geo_sequence",
    {
      description: "Create a GEO prompt sequence: an ordered list of prompts played as one conversation",
      annotations: { title: "Create GEO Sequence", destructiveHint: false },
      inputSchema: z.object({
        projectId: projectIdSchema,
        name: geoShortTextSchema.describe("Sequence name (1-128 characters)"),
        steps: z
          .array(geoPromptTextSchema)
          .min(1)
          .max(GEO_SEQUENCE_MAX_TURNS)
          .describe("Ordered conversation turns (1-5 turns, each 8-300 characters)"),
      }),
    },
    async ({ projectId, ...body }) => {
      return handleError(() => client.createGeoSequence(projectId, body));
    },
  );

  server.registerTool(
    "update_geo_sequence",
    {
      description: "Update a GEO prompt sequence's name, steps or enabled state",
      annotations: { title: "Update GEO Sequence", destructiveHint: true, idempotentHint: true },
      inputSchema: z
        .object({
          projectId: projectIdSchema,
          sequenceId: geoResourceIdSchema.describe("The sequence ID to update"),
          name: geoShortTextSchema.optional().describe("New sequence name (1-128 characters)"),
          steps: z
            .array(geoPromptTextSchema)
            .min(1)
            .max(GEO_SEQUENCE_MAX_TURNS)
            .optional()
            .describe("New ordered conversation turns"),
          enabled: z.boolean().optional().describe("Whether the sequence runs during scans"),
        })
        .refine(({ name, steps, enabled }) => name !== undefined || steps !== undefined || enabled !== undefined, {
          message: "Provide at least one field to update",
        }),
    },
    async ({ projectId, sequenceId, ...body }) => {
      return handleError(() => client.updateGeoSequence(projectId, sequenceId, body));
    },
  );

  server.registerTool(
    "delete_geo_sequence",
    {
      description: "Delete a GEO prompt sequence",
      annotations: { title: "Delete GEO Sequence", destructiveHint: true, idempotentHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        sequenceId: geoResourceIdSchema.describe("The sequence ID to delete"),
      }),
    },
    async ({ projectId, sequenceId }) => {
      return handleError(() => client.deleteGeoSequence(projectId, sequenceId));
    },
  );

  server.registerTool(
    "run_geo_sequence",
    {
      description:
        "Run a GEO prompt sequence now, synchronously, against every available answer engine. This uses AI credits and the request can take several minutes; the result reports checks, mentions and engines covered.",
      annotations: { title: "Run GEO Sequence", destructiveHint: false },
      inputSchema: z.object({
        projectId: projectIdSchema,
        sequenceId: geoResourceIdSchema.describe("The sequence ID to run"),
      }),
    },
    async ({ projectId, sequenceId }) => {
      return handleError(() => client.runGeoSequence(projectId, sequenceId));
    },
  );
}
