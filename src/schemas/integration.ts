import * as z from "zod";

export const listIntegrationsSchema = z.object({});

export const createGithubIntegrationSchema = z.strictObject({
  owner: z.string().min(1).describe("GitHub repository owner (user or organization)"),
  repo: z.string().min(1).describe("GitHub repository name"),
  branch: z.string().min(1).optional().nullable().describe("Default branch (auto-detected if not set)"),
});

export const deleteIntegrationSchema = z.object({
  integrationId: z.string().min(1).describe("The integration ID to delete"),
});
