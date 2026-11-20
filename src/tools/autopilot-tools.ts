import type { NotraClient } from "../notra-client.js";
import {
  getAutopilotStatusSchema,
  runAutopilotSchema,
  runAutopilotWorkflowSchema,
  stopAutopilotRunSchema,
} from "../schemas/autopilot.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerAutopilotTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "get_autopilot_status",
      description:
        "Read Autopilot settings, active runs, recent open findings, custom workflows and standing rules in the current workspace. Use this first to find run and workflow IDs and see whether the authenticated member can manage Autopilot. Requires OAuth or an account API key with autopilot.read.",
      annotations: {
        title: "Get Autopilot Status",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getAutopilotStatusSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getAutopilotStatus")),
    },
    () => handleError(() => client.getAutopilotStatus()),
  );

  server.tool(
    {
      name: "run_autopilot",
      description:
        "Start a full Autopilot run now, or run only the selected built-in automation. This can spend AI credits and open or merge GitHub pull requests according to the workspace's approval settings. Get explicit user confirmation first. Requires a workspace owner or admin with autopilot.write. Returns runId and alreadyRunning; if alreadyRunning is true, no new run started. Use get_autopilot_status to check active runs before retrying an uncertain request.",
      annotations: {
        title: "Run Autopilot",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(runAutopilotSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("startAutopilotRun")),
    },
    (body) => handleError(() => client.startAutopilotRun(body)),
  );

  server.tool(
    {
      name: "stop_autopilot_run",
      description:
        "Stop an active Autopilot or custom workflow run using its runId from get_autopilot_status. This interrupts the run, but does not undo completed work. Get explicit user confirmation first. Requires a workspace owner or admin with autopilot.write.",
      annotations: {
        title: "Stop Autopilot Run",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(stopAutopilotRunSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("stopAutopilotRun")),
    },
    ({ runId }) => handleError(() => client.stopAutopilotRun(runId)),
  );

  server.tool(
    {
      name: "run_autopilot_workflow",
      description:
        "Start a saved custom Autopilot workflow now using its workflowId from get_autopilot_status. Its configured steps may spend AI credits or change external systems. Get explicit user confirmation first. Requires a workspace owner or admin with autopilot.write. Returns runId; use get_autopilot_status to check active runs before retrying an uncertain request.",
      annotations: {
        title: "Run Autopilot Workflow",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(runAutopilotWorkflowSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("startAutopilotWorkflowRun")),
    },
    ({ workflowId }) => handleError(() => client.startAutopilotWorkflowRun(workflowId)),
  );
}
