import {
  listProjectsSchema,
  getProjectSchema,
  createProjectSchema,
  updateProjectSchema,
  deleteProjectSchema,
} from "../schemas/project.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerProjectTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_projects",
    {
      description: "List the organization's GEO projects. Most GEO tools take a projectId; call this first to find it.",
      annotations: { title: "List Projects", readOnlyHint: true },
      inputSchema: listProjectsSchema,
      outputSchema: apiOutputSchema("listProjects"),
    },
    () => handleError(() => client.listProjects()),
  );

  server.registerTool(
    "get_project",
    {
      description: "Get a single GEO project by its ID",
      annotations: { title: "Get Project", readOnlyHint: true },
      inputSchema: getProjectSchema,
      outputSchema: apiOutputSchema("getProject"),
    },
    ({ projectId }) => handleError(() => client.getProject(projectId)),
  );

  server.registerTool(
    "create_project",
    {
      description: "Create a new GEO project, optionally linked to a brand identity",
      annotations: { title: "Create Project", destructiveHint: false },
      inputSchema: createProjectSchema,
      outputSchema: apiOutputSchema("createProject"),
    },
    (params) => handleError(() => client.createProject(params)),
  );

  server.registerTool(
    "update_project",
    {
      description: "Rename a GEO project or relink its brand identity",
      annotations: { title: "Update Project", destructiveHint: true, idempotentHint: true },
      inputSchema: updateProjectSchema,
      outputSchema: apiOutputSchema("updateProject"),
    },
    ({ projectId, ...body }) => handleError(() => client.updateProject(projectId, body)),
  );

  server.registerTool(
    "delete_project",
    {
      description:
        "Delete a GEO project and its settings, prompts, sequences, competitors, scans, checks, and reports. This cannot be undone. The organization's last project cannot be deleted.",
      annotations: { title: "Delete Project", destructiveHint: true, idempotentHint: true },
      inputSchema: deleteProjectSchema,
      outputSchema: apiOutputSchema("deleteProject"),
    },
    ({ projectId }) => handleError(() => client.deleteProject(projectId)),
  );
}
