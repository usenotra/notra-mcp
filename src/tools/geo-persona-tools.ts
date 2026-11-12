import {
  listGeoPersonasSchema,
  updateGeoPersonaSchema,
  archiveGeoPersonaSchema,
  restoreGeoPersonaSchema,
  getGeoPersonaResultsSchema,
  getGeoPersonaActivitySchema,
  runGeoPersonaSchema,
  generateGeoPersonasSchema,
  getGeoPersonaGenerationSchema,
  geoPersonaActivityOutputSchema,
} from "../schemas/geo-persona.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { chartView } from "../utils/views.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoPersonaTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_geo_personas",
      description:
        "List a project's GEO personas: AI buyer profiles that hold multi-turn conversations with answer engines that have web search, each with its profile, memories and conversation prompts. Archived personas are included with archivedAt set. A project keeps at most five active personas.",
      annotations: {
        title: "List GEO Personas",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoPersonasSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoPersonas")),
    },
    ({ projectId }) => handleError(() => client.listGeoPersonas(projectId)),
  );

  server.tool(
    {
      name: "update_geo_persona",
      description:
        "Turn a GEO persona on or off for scheduled scans, or edit its details. Editing details clears its conversation prompts, so call generate_geo_personas with personaId and promptsOnly: true before running it again. Archived personas must be restored first.",
      annotations: {
        title: "Update GEO Persona",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateGeoPersonaSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateGeoPersona")),
    },
    ({ projectId, personaId, ...body }) => handleError(() => client.updateGeoPersona(projectId, personaId, body)),
  );

  server.tool(
    {
      name: "archive_geo_persona",
      description:
        "Archive and disable a GEO persona so future scans skip it. Its past results stay readable and restore_geo_persona brings it back.",
      annotations: {
        title: "Archive GEO Persona",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(archiveGeoPersonaSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("archiveGeoPersona")),
    },
    ({ projectId, personaId }) => handleError(() => client.archiveGeoPersona(projectId, personaId)),
  );

  server.tool(
    {
      name: "restore_geo_persona",
      description:
        "Restore an archived GEO persona. It comes back disabled; turn it on with update_geo_persona. Fails when the project already has five active personas.",
      annotations: {
        title: "Restore GEO Persona",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(restoreGeoPersonaSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("restoreGeoPersona")),
    },
    ({ projectId, personaId }) => handleError(() => client.restoreGeoPersona(projectId, personaId)),
  );

  server.tool(
    {
      name: "get_geo_persona_results",
      description:
        "Get every turn of one scan's conversations for a GEO persona, per engine: the prompt, the answer, whether the brand was mentioned, its position and the cited sources. Defaults to the latest scan; scans lists the others, newest first.",
      annotations: {
        title: "Get GEO Persona Results",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoPersonaResultsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoPersonaResults")),
    },
    ({ projectId, personaId, scanId }) => handleError(() => client.getGeoPersonaResults(projectId, personaId, scanId)),
  );

  server.tool(
    {
      name: "get_geo_persona_activity",
      description:
        "Get daily checks and brand mentions per GEO persona and persona version. Returns the window's from and to dates and one point per persona, version and day with checks, mentions and last check time. Defaults to the last 30 days.",
      annotations: {
        title: "Get GEO Persona Activity",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoPersonaActivitySchema),
      outputSchema: shareJsonSchema(geoPersonaActivityOutputSchema),
      ...chartView(
        "geo-persona-activity",
        "Mention rate per persona over time",
        "Loading persona activity",
        "Persona activity ready",
      ),
    },
    ({ projectId, ...params }) =>
      handleError(async () => {
        const [activity, list] = await Promise.all([
          client.getGeoPersonaActivity(projectId, params),
          client.listGeoPersonas(projectId).catch(() => null),
        ]);
        return { ...activity, personas: list?.personas.map(({ id, name }) => ({ id, name })) ?? [] };
      }),
  );

  server.tool(
    {
      name: "run_geo_persona",
      description:
        "Play a GEO persona's conversation now. This uses AI credits at twice the rate of a single prompt check. API-based answer engines run in this call, which can take several minutes; the result reports their checks, mentions and engines. Consumer apps are queued as a background scan instead: poll get_geo_scan, passing the returned queuedScanId as scanId. If the call fails with a 409 the run is still finishing on its own; do not run it again, read get_geo_persona_results later.",
      annotations: {
        title: "Run GEO Persona",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(runGeoPersonaSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("runGeoPersona")),
    },
    ({ projectId, personaId }) => handleError(() => client.runGeoPersona(projectId, personaId)),
  );

  server.tool(
    {
      name: "generate_geo_personas",
      description:
        "Start AI persona generation in the background. Uses billed AI credits. With only projectId it creates a full set from the project's brand, prompts and competitors; brief adds one persona; personaId regenerates that persona in place, replacing its details (with promptsOnly, only its conversation prompts). One job runs per project; while one runs, it is returned instead. Returns the job's ID, status and error. Poll get_geo_persona_generation_status until completed or failed, then call list_geo_personas.",
      annotations: {
        title: "Generate GEO Personas",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(generateGeoPersonasSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("generateGeoPersonas")),
    },
    ({ projectId, ...body }) => handleError(() => client.generateGeoPersonas(projectId, body)),
  );

  server.tool(
    {
      name: "get_geo_persona_generation_status",
      description:
        "Get the project's latest GEO persona generation job: its ID, status, the persona it targets, start time and error message. Use it to poll after generate_geo_personas. A job that never started within a few minutes is reported as failed.",
      annotations: {
        title: "Get GEO Persona Generation Status",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoPersonaGenerationSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoPersonaGeneration")),
    },
    ({ projectId }) => handleError(() => client.getGeoPersonaGeneration(projectId)),
  );
}
