import type { NotraClient } from "../notra-client.js";
import {
  disconnectOutreachMailboxSchema,
  editOutreachPitchSchema,
  getOutreachMailboxSchema,
  listOutreachPitchesSchema,
  logOutreachContactSchema,
  outreachPitchSchema,
  sendOutreachPitchSchema,
  setOutreachPitchLaterSchema,
  updateOutreachPitchDetailsSchema,
} from "../schemas/autopilot.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

const READ = "Requires OAuth or an account API key with autopilot.read.";
const WRITE =
  "Requires OAuth or an account API key of a workspace owner or admin, with autopilot.write; organization API keys are refused.";
const readOnly = {
  readOnlyHint: true,
  openWorldHint: false,
  destructiveHint: false,
  idempotentHint: true,
} as const;
const localWrite = {
  readOnlyHint: false,
  openWorldHint: false,
  destructiveHint: false,
  idempotentHint: true,
} as const;

export function registerAutopilotOutreachTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_outreach_pitches",
      description: `List Autopilot's outreach pitches: emails asking third-party pages that AI answers cite to list the brand. Filter by status, conversation stage, due follow-ups or a search. ${READ}`,
      annotations: { title: "List Outreach Pitches", ...readOnly },
      inputSchema: shareJsonSchema(listOutreachPitchesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listOutreachPitches")),
    },
    (params) => handleError(() => client.listOutreachPitches(params)),
  );

  server.tool(
    {
      name: "get_outreach_pitch",
      description: `Read one pitch: its email, why Autopilot picked the page, the prompts citing it, ways to reach the publisher, the reply thread and any deal. ${READ}`,
      annotations: { title: "Get Outreach Pitch", ...readOnly },
      inputSchema: shareJsonSchema(outreachPitchSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getOutreachPitch")),
    },
    ({ pitchId }) => handleError(() => client.getOutreachPitch(pitchId)),
  );

  server.tool(
    {
      name: "log_outreach_contact",
      description: `Record that the user contacted someone about listing the brand themselves, by email, a form, a call, a DM or in person, so it shows in Outreach with its stage, follow-up date and notes. Use it when they say something like "I emailed Jane at TechCrunch, note that down". Nothing is sent. Search list_outreach_pitches first: if the page already has a pitch, this answers 409 with its id, so use mark_outreach_pitch_sent or update_outreach_pitch_details on that one instead. Replies to mail sent outside Notra aren't read, so update the stage when the user says they answered. ${WRITE}`,
      annotations: {
        title: "Log Outreach Contact",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(logOutreachContactSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("logOutreachPitch")),
    },
    (params) => handleError(() => client.logOutreachContact(params)),
  );

  server.tool(
    {
      name: "edit_outreach_pitch",
      description: `Edit a drafted pitch's recipient, subject or body before it is sent. ${WRITE}`,
      annotations: { title: "Edit Outreach Pitch", ...localWrite },
      inputSchema: shareJsonSchema(editOutreachPitchSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("editOutreachPitch")),
    },
    ({ pitchId, ...body }) => handleError(() => client.editOutreachPitch(pitchId, body)),
  );

  server.tool(
    {
      name: "send_outreach_pitch",
      description: `Send a drafted pitch from the workspace's connected mailbox now, at a set time, or at its suggested weekday morning in the recipient's time zone. This emails a real person outside the company under the user's name; show the user the final email and get explicit user confirmation first. ${WRITE}`,
      annotations: {
        title: "Send Outreach Pitch",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(sendOutreachPitchSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("sendOutreachPitch")),
    },
    ({ pitchId, ...body }) => handleError(() => client.sendOutreachPitch(pitchId, body)),
  );

  server.tool(
    {
      name: "cancel_outreach_pitch",
      description: `Cancel a scheduled pitch before it goes out; it turns back into a draft. ${WRITE}`,
      annotations: {
        title: "Cancel Scheduled Pitch",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(outreachPitchSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("cancelOutreachPitch")),
    },
    ({ pitchId }) => handleError(() => client.cancelOutreachPitch(pitchId)),
  );

  server.tool(
    {
      name: "mark_outreach_pitch_sent",
      description: `Mark a pitch as sent when the user sent it themselves, outside Notra. ${WRITE}`,
      annotations: { title: "Mark Pitch Sent", ...localWrite },
      inputSchema: shareJsonSchema(outreachPitchSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("markOutreachPitchSent")),
    },
    ({ pitchId }) => handleError(() => client.markOutreachPitchSent(pitchId)),
  );

  server.tool(
    {
      name: "mark_outreach_pitch_listed",
      description: `Mark a pitch as listed: the page now lists the brand. ${WRITE}`,
      annotations: { title: "Mark Pitch Listed", ...localWrite },
      inputSchema: shareJsonSchema(outreachPitchSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("markOutreachPitchListed")),
    },
    ({ pitchId }) => handleError(() => client.markOutreachPitchListed(pitchId)),
  );

  server.tool(
    {
      name: "set_outreach_pitch_later",
      description: `Put a draft off until the next daily brief (later: true), or undo that (later: false). ${WRITE}`,
      annotations: { title: "Put Pitch Off", ...localWrite },
      inputSchema: shareJsonSchema(setOutreachPitchLaterSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("laterOutreachPitch")),
    },
    ({ pitchId, later }) =>
      handleError(() => (later ? client.laterOutreachPitch(pitchId) : client.undoLaterOutreachPitch(pitchId))),
  );

  server.tool(
    {
      name: "update_outreach_pitch_details",
      description: `Correct a pitch's conversation stage, follow-up date or deal (free, paid with a price, declined) by hand, or replace the team's notes on the contact. ${WRITE}`,
      annotations: { title: "Update Pitch Details", ...localWrite },
      inputSchema: shareJsonSchema(updateOutreachPitchDetailsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateOutreachPitchDetails")),
    },
    ({ pitchId, ...body }) => handleError(() => client.updateOutreachPitchDetails(pitchId, body)),
  );

  server.tool(
    {
      name: "delete_outreach_pitch",
      description: `Delete a pitch; its page is skipped from then on. Get explicit user confirmation first. ${WRITE}`,
      annotations: {
        title: "Delete Outreach Pitch",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(outreachPitchSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteOutreachPitch")),
    },
    ({ pitchId }) => handleError(() => client.deleteOutreachPitch(pitchId)),
  );

  server.tool(
    {
      name: "get_outreach_mailbox",
      description: `Read which Gmail or Outlook mailbox pitches are sent from and whether it needs reconnecting. Connecting needs the person's own sign-in: give them connectUrl to open in a browser. ${READ}`,
      annotations: { title: "Get Outreach Mailbox", ...readOnly },
      inputSchema: shareJsonSchema(getOutreachMailboxSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getOutreachMailbox")),
    },
    () => handleError(() => client.getOutreachMailbox()),
  );

  server.tool(
    {
      name: "disconnect_outreach_mailbox",
      description: `Disconnect the outreach mailbox. Scheduled pitches are cancelled and nothing can be sent until a mailbox is connected again. Get explicit user confirmation first. ${WRITE}`,
      annotations: {
        title: "Disconnect Outreach Mailbox",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(disconnectOutreachMailboxSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("disconnectOutreachMailbox")),
    },
    () => handleError(() => client.disconnectOutreachMailbox()),
  );
}
