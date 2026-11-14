import {
  listGeoSequencesSchema,
  createGeoSequenceSchema,
  updateGeoSequenceSchema,
  deleteGeoSequenceSchema,
  runGeoSequenceSchema,
} from "../schemas/geo-sequence.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoSequenceTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_geo_sequences",
      description:
        "List a project's GEO prompt sequences: multi-turn conversations played against answer engines. Returns each sequence's ID, name, ordered steps, whether it is enabled for scans, and creation time, plus the organization.",
      annotations: {
        title: "List GEO Sequences",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoSequencesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoSequences")),
    },
    ({ projectId }) => handleError(() => client.listGeoSequences(projectId)),
  );

  server.tool(
    {
      name: "create_geo_sequence",
      description:
        "Add a multi-turn prompt sequence to a project. Its steps are sent in order as one conversation to each answer engine, to track brand mentions across follow-up questions. Enabled sequences play during scans, which use billed AI credits; run_geo_sequence plays one right away. Returns the saved sequence (id, name, steps, enabled, createdAt) and the organization.",
      annotations: {
        title: "Create AI Search Prompt Sequence",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(createGeoSequenceSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createGeoSequence")),
    },
    ({ projectId, ...body }) => handleError(() => client.createGeoSequence(projectId, body)),
  );

  server.tool(
    {
      name: "update_geo_sequence",
      description:
        "Change a GEO prompt sequence's name, steps or enabled state. Omitted fields keep their value; new steps replace all existing turns. Disabling stops the sequence from playing in scans. Reversible by sending the previous values. Get sequence IDs from list_geo_sequences. Returns the updated sequence (id, name, steps, enabled, createdAt) and the organization.",
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

  server.tool(
    {
      name: "delete_geo_sequence",
      description:
        "Permanently delete a GEO prompt sequence so scans no longer play it. This cannot be undone. To pause it instead, set enabled to false with update_geo_sequence. Get sequence IDs from list_geo_sequences. Returns the deleted sequence's id and the organization.",
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

  server.tool(
    {
      name: "run_geo_sequence",
      description:
        "Run a GEO prompt sequence now. API-based answer engines run in this call, which can take several minutes; the result reports their checks, mentions and engines. Consumer apps (ChatGPT, Perplexity, Gemini, AI Mode, Copilot) are queued as a background scan instead: poll get_geo_scan, passing the returned queuedScanId as scanId. If the call fails with a 409 the run is still finishing on its own; do not run it again, read the results with list_geo_prompt_result_summaries later. This uses AI credits.",
      annotations: {
        title: "Run GEO Sequence",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(runGeoSequenceSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("runGeoSequence")),
    },
    ({ projectId, sequenceId }) => handleError(() => client.runGeoSequence(projectId, sequenceId)),
  );
}
