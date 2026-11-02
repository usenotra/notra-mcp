import {
  listGeoSequencesSchema,
  createGeoSequenceSchema,
  updateGeoSequenceSchema,
  deleteGeoSequenceSchema,
  runGeoSequenceSchema,
} from "../schemas/geo-sequence.js";
import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoSequenceTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_geo_sequences",
    {
      description: "List a project's GEO prompt sequences (multi-turn conversations played against answer engines)",
      annotations: { title: "List GEO Sequences", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listGeoSequencesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoSequences")),
    },
    ({ projectId }) => handleError(() => client.listGeoSequences(projectId)),
  );

  server.registerTool(
    "create_geo_sequence",
    {
      description: "Create a GEO prompt sequence: an ordered list of prompts played as one conversation",
      annotations: { title: "Create GEO Sequence", readOnlyHint: false, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(createGeoSequenceSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createGeoSequence")),
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
      inputSchema: shareJsonSchema(updateGeoSequenceSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateGeoSequence")),
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
      inputSchema: shareJsonSchema(deleteGeoSequenceSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteGeoSequence")),
    },
    ({ projectId, sequenceId }) => handleError(() => client.deleteGeoSequence(projectId, sequenceId)),
  );

  server.registerTool(
    "run_geo_sequence",
    {
      description:
        "Run a GEO prompt sequence now. API-based answer engines run in this call, which can take several minutes; the result reports their checks, mentions and engines. Consumer apps (ChatGPT, Perplexity, Gemini, AI Mode, Copilot) are queued as a background scan instead: poll get_geo_scan with queuedScanId. If the call fails with a 409 the run is still finishing on its own; do not run it again, read the results with list_geo_prompt_result_summaries later. This uses AI credits.",
      annotations: { title: "Run GEO Sequence", readOnlyHint: false, openWorldHint: true, destructiveHint: false },
      inputSchema: shareJsonSchema(runGeoSequenceSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("runGeoSequence")),
    },
    ({ projectId, sequenceId }) => handleError(() => client.runGeoSequence(projectId, sequenceId)),
  );
}
