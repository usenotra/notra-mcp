import type { NotraClient } from "../notra-client.js";
import {
  cancelOutreachPitchSchema,
  deleteOutreachPitchSchema,
  disconnectOutreachMailboxSchema,
  editOutreachPitchSchema,
  getOutreachMailboxSchema,
  getOutreachPitchSchema,
  listOutreachPitchesSchema,
  markOutreachPitchListedSchema,
  markOutreachPitchSentSchema,
  sendOutreachPitchSchema,
  updateOutreachPitchDetailsSchema,
} from "../schemas/autopilot-outreach.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

const READ_ACCESS = "Requires OAuth or an account API key with autopilot.read.";
const WRITE_ACCESS = "Requires a workspace owner or admin with autopilot.write.";

export function registerAutopilotOutreachTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_outreach_pitches",
      description: `List Autopilot outreach pitches: emails Autopilot drafted to pages that AI answers cite without the brand, newest activity first, with status, conversation stage, recipient, follow-up and deal. Skipped pitches are left out unless status is skipped. Use this to find pitch IDs for the other outreach tools. ${READ_ACCESS}`,
      annotations: {
        title: "List Outreach Pitches",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listOutreachPitchesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listOutreachPitches")),
    },
    (params) => handleError(() => client.listOutreachPitches(params)),
  );

  server.tool(
    {
      name: "get_outreach_pitch",
      description: `Get one outreach pitch by its ID from list_outreach_pitches: the email body, why the page was picked, the prompts that cite it, every way to reach its editor, the suggested send time and the whole reply thread. ${READ_ACCESS}`,
      annotations: {
        title: "Get Outreach Pitch",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getOutreachPitchSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getOutreachPitch")),
    },
    ({ pitchId }) => handleError(() => client.getOutreachPitch(pitchId)),
  );

  server.tool(
    {
      name: "edit_outreach_pitch",
      description: `Change the recipient, subject or body of a drafted outreach pitch before it is sent. Omitted fields stay. Does not send anything; use send_outreach_pitch for that. ${WRITE_ACCESS} Returns the updated pitch.`,
      annotations: {
        title: "Edit Outreach Pitch",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(editOutreachPitchSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("editOutreachPitch")),
    },
    ({ pitchId, ...body }) => handleError(() => client.editOutreachPitch(pitchId, body)),
  );

  server.tool(
    {
      name: "send_outreach_pitch",
      description: `Send a drafted outreach pitch now from the workspace's connected Gmail or Outlook, or schedule it with sendAt. This emails a real person outside the workspace and cannot be unsent. Show the user the recipient, subject and body and get explicit user confirmation first. Needs a connected mailbox (get_outreach_mailbox); at most 20 pitches go out per mailbox per day. ${WRITE_ACCESS} Returns the pitch and scheduledAt (null when it went out now). A scheduled pitch can be taken back with cancel_outreach_pitch.`,
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
      description: `Take back a scheduled outreach pitch before it goes out; it becomes a draft again. ${WRITE_ACCESS} Returns the updated pitch.`,
      annotations: {
        title: "Cancel Outreach Pitch",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(cancelOutreachPitchSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("cancelOutreachPitch")),
    },
    ({ pitchId }) => handleError(() => client.cancelOutreachPitch(pitchId)),
  );

  server.tool(
    {
      name: "mark_outreach_pitch_sent",
      description: `Record that someone sent an outreach pitch themselves, through the page's contact form or their own mail app. Sends nothing. ${WRITE_ACCESS} Returns the updated pitch.`,
      annotations: {
        title: "Mark Outreach Pitch Sent",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(markOutreachPitchSentSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("markOutreachPitchSent")),
    },
    ({ pitchId }) => handleError(() => client.markOutreachPitchSent(pitchId)),
  );

  server.tool(
    {
      name: "mark_outreach_pitch_listed",
      description: `Record that the pitched page now lists the brand, before Autopilot's own page check notices. ${WRITE_ACCESS} Returns the updated pitch.`,
      annotations: {
        title: "Mark Outreach Pitch Listed",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(markOutreachPitchListedSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("markOutreachPitchListed")),
    },
    ({ pitchId }) => handleError(() => client.markOutreachPitchListed(pitchId)),
  );

  server.tool(
    {
      name: "update_outreach_pitch_details",
      description: `Correct what Autopilot read from an outreach pitch's reply thread: the conversation stage, when to follow up, or what the editor asked for in return (deal). Omitted fields stay. Sends nothing. ${WRITE_ACCESS} Returns the updated pitch.`,
      annotations: {
        title: "Update Outreach Pitch Details",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateOutreachPitchDetailsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateOutreachPitchDetails")),
    },
    ({ pitchId, ...body }) => handleError(() => client.updateOutreachPitchDetails(pitchId, body)),
  );

  server.tool(
    {
      name: "delete_outreach_pitch",
      description: `Delete an outreach pitch that shouldn't go out; a scheduled one is taken back first, and the page is never pitched again. Get explicit user confirmation first. ${WRITE_ACCESS}`,
      annotations: {
        title: "Delete Outreach Pitch",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteOutreachPitchSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteOutreachPitch")),
    },
    ({ pitchId }) => handleError(() => client.deleteOutreachPitch(pitchId)),
  );

  server.tool(
    {
      name: "get_outreach_mailbox",
      description: `Get the Gmail or Outlook mailbox outreach pitches are sent from (null when none is connected) and its status; needs_reauth means it must be connected again before sending. Connecting or reconnecting needs the mailbox owner to open connectUrl in a browser and sign in; this tool can't do it for them. ${READ_ACCESS}`,
      annotations: {
        title: "Get Outreach Mailbox",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getOutreachMailboxSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getOutreachMailbox")),
    },
    () => handleError(() => client.getOutreachMailbox()),
  );

  server.tool(
    {
      name: "disconnect_outreach_mailbox",
      description: `Disconnect the outreach mailbox so no more pitches are sent from it; scheduled pitches go back to drafts. Reconnecting needs the owner's sign-in in a browser. Get explicit user confirmation first. ${WRITE_ACCESS}`,
      annotations: {
        title: "Disconnect Outreach Mailbox",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(disconnectOutreachMailboxSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("disconnectOutreachMailbox")),
    },
    () => handleError(() => client.disconnectOutreachMailbox()),
  );
}
