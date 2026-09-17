import {
  listGeoSequencesSchema,
  createGeoSequenceSchema,
  updateGeoSequenceSchema,
  deleteGeoSequenceSchema,
  runGeoSequenceSchema,
} from "../schemas/geo-sequence.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";

export function registerGeoSequenceTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_geo_sequences",
    {
      description: "List a project's GEO prompt sequences (multi-turn conversations played against answer engines)",
      annotations: { title: "List GEO Sequences", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: listGeoSequencesSchema,
    },
    ({ projectId }) => handleError(() => client.listGeoSequences(projectId)),
  );

  server.registerTool(
    "create_geo_sequence",
    {
      description: "Create a GEO prompt sequence: an ordered list of prompts played as one conversation",
      annotations: { title: "Create GEO Sequence", readOnlyHint: false, openWorldHint: false, destructiveHint: false },
      inputSchema: createGeoSequenceSchema,
    },
    ({ projectId, ...body }) => handleError(() => client.createGeoSequence(projectId, body)),
  );

  server.registerTool(
    "update_geo_sequence",
    {
      description: "Update a GEO prompt sequence's name, steps or enabled state",
      annotations: {
        title: "Update GEO Sequence",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: updateGeoSequenceSchema,
    },
    ({ projectId, sequenceId, ...body }) => handleError(() => client.updateGeoSequence(projectId, sequenceId, body)),
  );

  server.registerTool(
    "delete_geo_sequence",
    {
      description: "Delete a GEO prompt sequence",
      annotations: {
        title: "Delete GEO Sequence",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: deleteGeoSequenceSchema,
    },
    ({ projectId, sequenceId }) => handleError(() => client.deleteGeoSequence(projectId, sequenceId)),
  );

  server.registerTool(
    "run_geo_sequence",
    {
      description:
        "Run a GEO prompt sequence now, synchronously, against every available answer engine. This uses AI credits and the request can take several minutes; the result reports checks, mentions and engines covered.",
      annotations: { title: "Run GEO Sequence", readOnlyHint: false, openWorldHint: true, destructiveHint: false },
      inputSchema: runGeoSequenceSchema,
    },
    ({ projectId, sequenceId }) => handleError(() => client.runGeoSequence(projectId, sequenceId)),
  );
}
