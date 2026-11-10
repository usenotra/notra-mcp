import {
  listProjectsSchema,
  getProjectSchema,
  createProjectSchema,
  updateProjectSchema,
  deleteProjectSchema,
} from "../schemas/project.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerProjectTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_projects",
      description: "List the organization's GEO projects. Most GEO tools take a projectId; call this first to find it.",
      annotations: {
        title: "List Projects",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listProjectsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listProjects")),
    },
    () => handleError(() => client.listProjects()),
  );

  server.tool(
    {
      name: "get_project",
      description:
        "Get one GEO project by its ID. Returns the project's ID, name, linked brand identity ID (brandSettingsId) and creation time. Use list_projects to find project IDs.",
      annotations: {
        title: "Get Project",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getProjectSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getProject")),
    },
    ({ projectId }) => handleError(() => client.getProject(projectId)),
  );

  server.tool(
    {
      name: "create_project",
      description:
        "Create a GEO project from a brand identity's website. Notra analyzes the site and adds tracked prompts, competitors, conversations and answer engines, which can take up to a minute. If it times out, check list_projects before retrying so you don't create a duplicate. Review them with list_geo_prompts and list_geo_competitors. Scans stay off unless startScan is true.",
      annotations: {
        title: "Create Project",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(createProjectSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createProject")),
    },
    (params) => handleError(() => client.createProject(params)),
  );

  server.tool(
    {
      name: "update_project",
      description:
        "Rename a GEO project or link it to a different brand identity. Send at least one of name or brandSettingsId; omitted fields keep their value. Changes apply immediately and can be reverted by calling this again with the previous values. A new brandSettingsId replaces the current link. Returns the updated project.",
      annotations: {
        title: "Update Project",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateProjectSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateProject")),
    },
    ({ projectId, ...body }) => handleError(() => client.updateProject(projectId, body)),
  );

  server.tool(
    {
      name: "delete_project",
      description:
        "Delete a GEO project and its settings, prompts, sequences, competitors, scans, checks, and reports. This cannot be undone. The organization's last project cannot be deleted.",
      annotations: {
        title: "Delete Project",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteProjectSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteProject")),
    },
    ({ projectId }) => handleError(() => client.deleteProject(projectId)),
  );
}
