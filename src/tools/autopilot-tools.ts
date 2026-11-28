import type { NotraClient } from "../notra-client.js";
import {
  addAutopilotRuleSchema,
  autopilotFindingSchema,
  deleteAutopilotRuleSchema,
  deleteAutopilotWorkflowSchema,
  dismissAutopilotFindingSchema,
  getAutopilotBriefSchema,
  getAutopilotRunSchema,
  getAutopilotStatusSchema,
  listAutopilotFindingsSchema,
  listAutopilotRunsSchema,
  mergeAutopilotFindingSchema,
  requestAutopilotChangesSchema,
  runAutopilotSchema,
  runAutopilotWorkflowSchema,
  setAutopilotWorkflowEnabledSchema,
  stopAutopilotRunSchema,
  updateAutopilotSettingsSchema,
  updateAutopilotSettingsWithoutOutreachSchema,
} from "../schemas/autopilot.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

const READ =
  "Requires OAuth, or an account API key with a selected workspace, and autopilot.read; organization API keys are refused.";
const WRITE =
  "Requires a workspace owner or admin, through OAuth or an account API key with a selected workspace, and autopilot.write; organization API keys are refused.";

export function registerAutopilotTools(server: ToolRegistry, client: NotraClient, outreachEnabled: boolean) {
  server.tool(
    {
      name: "get_autopilot_status",
      description: `Read Autopilot settings (automations, approvals, brief time, reviewers, release filters), active runs, recent open findings, custom workflows and standing rules in the current workspace. Use this first to find run, workflow and rule IDs, read current settings before changing them, and see whether the authenticated member can manage Autopilot. ${READ}`,
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
      description: `Start a full Autopilot run now, or run only the selected built-in automation. This can spend AI credits and open or merge GitHub pull requests according to the workspace's approval settings. Get explicit user confirmation first. ${WRITE} Returns runId and alreadyRunning; if alreadyRunning is true, no new run started. Use get_autopilot_status to check active runs before retrying an uncertain request.`,
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
      description: `Stop an active Autopilot or custom workflow run using its runId from get_autopilot_status. This interrupts the run, but does not undo completed work. Get explicit user confirmation first. ${WRITE}`,
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
      description: `Start a saved custom Autopilot workflow now using its workflowId from get_autopilot_status. Its configured steps may spend AI credits or change external systems. Get explicit user confirmation first. ${WRITE} Returns runId; use get_autopilot_status to check active runs before retrying an uncertain request.`,
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

  const readOnly = {
    readOnlyHint: true,
    openWorldHint: false,
    destructiveHint: false,
    idempotentHint: true,
  } as const;

  server.tool(
    {
      name: "update_autopilot_settings",
      description: `Change Autopilot settings: turn it on or off, turn automations on or off, choose whether posts, updates and fixes wait for a person (ask) or publish on their own (auto), the daily brief and its hour and timezone, draft emails, pull request reviewers, the stale draft period, the content folder and which pull requests release posts are written about. Only the fields given change; read current values with get_autopilot_status first. Setting an approval to auto lets Autopilot publish to the live site without review, so get explicit user confirmation first. ${WRITE}`,
      annotations: {
        title: "Update Autopilot Settings",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(
        outreachEnabled ? updateAutopilotSettingsSchema : updateAutopilotSettingsWithoutOutreachSchema,
      ),
      outputSchema: shareJsonSchema(apiOutputSchema("updateAutopilotSettings")),
    },
    (body) => handleError(() => client.updateAutopilotSettings(body)),
  );

  server.tool(
    {
      name: "list_autopilot_findings",
      description: `List what Autopilot found and made, newest first: ideas waiting to be written (suggested), drafts being written (open), pull requests waiting for review (proposed), and merged, dismissed, expired or failed ones. Filter by status or automation. ${READ}`,
      annotations: { title: "List Autopilot Findings", ...readOnly },
      inputSchema: shareJsonSchema(listAutopilotFindingsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listAutopilotFindings")),
    },
    (params) => handleError(() => client.listAutopilotFindings(params)),
  );

  server.tool(
    {
      name: "get_autopilot_finding",
      description: `Read one finding: why Autopilot picked it, its pull request and head commit, and whether and when it will publish on its own. ${READ}`,
      annotations: { title: "Get Autopilot Finding", ...readOnly },
      inputSchema: shareJsonSchema(autopilotFindingSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getAutopilotFinding")),
    },
    ({ findingId }) => handleError(() => client.getAutopilotFinding(findingId)),
  );

  server.tool(
    {
      name: "write_autopilot_finding",
      description: `Write a suggested idea now instead of waiting for the daily run. Uses AI credits and opens a pull request. Get explicit user confirmation first. ${WRITE}`,
      annotations: {
        title: "Write Autopilot Finding",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(autopilotFindingSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("writeAutopilotFinding")),
    },
    ({ findingId }) => handleError(() => client.writeAutopilotFinding(findingId)),
  );

  server.tool(
    {
      name: "dismiss_autopilot_finding",
      description: `Drop an idea, or close its pull request on GitHub. A reason that states a preference becomes a standing rule Autopilot follows from then on. Get explicit user confirmation first. ${WRITE}`,
      annotations: {
        title: "Dismiss Autopilot Finding",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(dismissAutopilotFindingSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("dismissAutopilotFinding")),
    },
    ({ findingId, ...body }) => handleError(() => client.dismissAutopilotFinding(findingId, body)),
  );

  server.tool(
    {
      name: "merge_autopilot_finding",
      description: `Merge a finding's open pull request on GitHub, which publishes the change. headSha from get_autopilot_finding is required, so a newer, unread commit is never merged. Get explicit user confirmation first. ${WRITE}`,
      annotations: {
        title: "Merge Autopilot Finding",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(mergeAutopilotFindingSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("mergeAutopilotFinding")),
    },
    ({ findingId, ...body }) => handleError(() => client.mergeAutopilotFinding(findingId, body)),
  );

  server.tool(
    {
      name: "hold_autopilot_finding",
      description: `Stop Autopilot from publishing a pull request on its own at its publishAt time; it then waits for a person to merge it. ${WRITE}`,
      annotations: {
        title: "Hold Autopilot Publish",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(autopilotFindingSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("holdAutopilotFinding")),
    },
    ({ findingId }) => handleError(() => client.holdAutopilotFinding(findingId)),
  );

  server.tool(
    {
      name: "request_autopilot_changes",
      description: `Ask Autopilot to change an open pull request. The instruction is posted as a public comment on the pull request under the user's name, then Autopilot changes the branch. Uses AI credits. Get explicit user confirmation first. ${WRITE}`,
      annotations: {
        title: "Request Autopilot Changes",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(requestAutopilotChangesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("requestAutopilotChanges")),
    },
    ({ findingId, ...body }) => handleError(() => client.requestAutopilotChanges(findingId, body)),
  );

  server.tool(
    {
      name: "add_autopilot_rule",
      description: `Add a standing rule Autopilot follows in every run, like "Never write about pricing". ${WRITE}`,
      annotations: {
        title: "Add Autopilot Rule",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(addAutopilotRuleSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("addAutopilotRule")),
    },
    (body) => handleError(() => client.addAutopilotRule(body)),
  );

  server.tool(
    {
      name: "delete_autopilot_rule",
      description: `Delete a standing rule using its id from get_autopilot_status. Get explicit user confirmation first. ${WRITE}`,
      annotations: {
        title: "Delete Autopilot Rule",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteAutopilotRuleSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteAutopilotRule")),
    },
    ({ ruleId }) => handleError(() => client.deleteAutopilotRule(ruleId)),
  );

  server.tool(
    {
      name: "set_autopilot_workflow_enabled",
      description: `Turn a saved custom workflow on or off. On resumes its schedule, and each scheduled run can spend AI credits and change connected services such as GitHub or Slack; off stops the schedule. Get explicit user confirmation before turning one on. ${WRITE}`,
      annotations: {
        title: "Turn Autopilot Workflow On or Off",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(setAutopilotWorkflowEnabledSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("setAutopilotWorkflowEnabled")),
    },
    ({ workflowId, enabled }) => handleError(() => client.setAutopilotWorkflowEnabled(workflowId, enabled)),
  );

  server.tool(
    {
      name: "delete_autopilot_workflow",
      description: `Delete a saved custom workflow and its schedule. Its past runs stay. This cannot be undone; get explicit user confirmation first. ${WRITE}`,
      annotations: {
        title: "Delete Autopilot Workflow",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteAutopilotWorkflowSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteAutopilotWorkflow")),
    },
    ({ workflowId }) => handleError(() => client.deleteAutopilotWorkflow(workflowId)),
  );

  server.tool(
    {
      name: "list_autopilot_runs",
      description: `List recent Autopilot runs, newest first: daily, manual and single-item runs with their status, counts, insights and what each came to. ${READ}`,
      annotations: { title: "List Autopilot Runs", ...readOnly },
      inputSchema: shareJsonSchema(listAutopilotRunsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listAutopilotRuns")),
    },
    (params) => handleError(() => client.listAutopilotRuns(params)),
  );

  server.tool(
    {
      name: "get_autopilot_run",
      description: `Read one run and its log: what it skipped, decided, changed and where it failed. Use it to explain why Autopilot did or didn't do something. ${READ}`,
      annotations: { title: "Get Autopilot Run", ...readOnly },
      inputSchema: shareJsonSchema(getAutopilotRunSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getAutopilotRun")),
    },
    ({ runId }) => handleError(() => client.getAutopilotRun(runId)),
  );

  server.tool(
    {
      name: "get_autopilot_brief",
      description: `Read today's daily brief: its headline, summary, sections and the findings it lists. brief is null before it is written or while the brief is off. ${READ}`,
      annotations: { title: "Get Autopilot Brief", ...readOnly },
      inputSchema: shareJsonSchema(getAutopilotBriefSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getAutopilotBrief")),
    },
    () => handleError(() => client.getAutopilotBrief()),
  );
}
