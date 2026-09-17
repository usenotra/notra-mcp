import * as z from "zod";
import { apiOutputSchema, apiResponsePropertySchema } from "../utils/output-schema.js";

export const whoAmIInputSchema = z.object({});

export const listWorkspacesInputSchema = z.object({});

const workspaceSchema = apiResponsePropertySchema("getWorkspaces", "currentWorkspace");
const authenticationSchema = apiResponsePropertySchema("getWorkspaces", "authentication");

export const whoAmIOutputSchema = z.object({
  workspace: workspaceSchema,
  authentication: authenticationSchema,
});

export const listWorkspacesOutputSchema = apiOutputSchema("getWorkspaces");
