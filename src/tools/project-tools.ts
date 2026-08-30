import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";
import type { NotraClient } from "../notra-client.js";
import { geoResourceIdSchema, geoShortTextSchema, projectIdSchema } from "../schemas/geo-fields.js";
import { handleError } from "../utils/mcp.js";

export function registerProjectTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_projects",
    {
      description: "List the organization's GEO projects. Most GEO tools take a projectId; call this first to find it.",
      annotations: { title: "List Projects", readOnlyHint: true },
      inputSchema: z.object({}),
    },
    async () => {
      return handleError(() => client.listProjects());
    },
  );

  server.registerTool(
    "get_project",
    {
      description: "Get a single GEO project by its ID",
      annotations: { title: "Get Project", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
      }),
    },
    async ({ projectId }) => {
      return handleError(() => client.getProject(projectId));
    },
  );

  server.registerTool(
    "create_project",
    {
      description: "Create a new GEO project, optionally linked to a brand identity",
      annotations: { title: "Create Project", destructiveHint: false },
      inputSchema: z.object({
        name: geoShortTextSchema.describe("Project name (1-128 characters)"),
        brandSettingsId: geoResourceIdSchema
          .optional()
          .describe("Brand identity ID to link (see list_brand_identities)"),
      }),
    },
    async (params) => {
      return handleError(() => client.createProject(params));
    },
  );

  server.registerTool(
    "update_project",
    {
      description: "Rename a GEO project or relink its brand identity",
      annotations: { title: "Update Project", destructiveHint: true, idempotentHint: true },
      inputSchema: z
        .object({
          projectId: projectIdSchema,
          name: geoShortTextSchema.optional().describe("New project name (1-128 characters)"),
          brandSettingsId: geoResourceIdSchema.optional().describe("Brand identity ID to link"),
        })
        .refine(({ name, brandSettingsId }) => name !== undefined || brandSettingsId !== undefined, {
          message: "Provide at least one field to update",
        }),
    },
    async ({ projectId, ...body }) => {
      return handleError(() => client.updateProject(projectId, body));
    },
  );

  server.registerTool(
    "delete_project",
    {
      description:
        "Delete a GEO project and its settings, prompts, sequences, competitors, scans, checks, and reports. This cannot be undone. The organization's last project cannot be deleted.",
      annotations: { title: "Delete Project", destructiveHint: true, idempotentHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
      }),
    },
    async ({ projectId }) => {
      return handleError(() => client.deleteProject(projectId));
    },
  );
}
