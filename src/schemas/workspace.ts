import * as z from "zod";
import { apiObjectOutputSchema, apiResponsePropertySchema } from "../utils/output-schema.js";

export const whoAmIInputSchema = z.object({});

export const listWorkspacesInputSchema = z.object({});

const workspaceSchema = apiResponsePropertySchema("getWorkspaces", "currentWorkspace");
const authenticationSchema = apiResponsePropertySchema("getWorkspaces", "authentication");

const selectionRequiredSchema = z
  .boolean()
  .describe(
    "True when tools have no workspace to act on: an account API key that reaches several workspaces with none selected, or with a selection it can't use. Ask the user which workspace to use; the connection then selects it with the /mcp/<workspace> URL, the X-Notra-Organization-Id header or NOTRA_ORGANIZATION_ID.",
  );

export const whoAmIOutputSchema = z.object({
  workspace: workspaceSchema
    .nullable()
    .describe("Workspace the other tools act on. Null while selectionRequired is true."),
  selectionRequired: selectionRequiredSchema,
  authentication: authenticationSchema,
});

export const listWorkspacesOutputSchema = apiObjectOutputSchema("getWorkspaces").extend({
  currentWorkspace: workspaceSchema
    .nullable()
    .describe("Workspace the other tools act on. Null while selectionRequired is true; then no workspace is current."),
  selectionRequired: selectionRequiredSchema,
});
