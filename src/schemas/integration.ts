import * as z from "zod";

export const listIntegrationsSchema = z.object({});

export const createGithubIntegrationSchema = z.object({
  owner: z.string().min(1).describe("GitHub repository owner (user or organization)"),
  repo: z.string().min(1).describe("GitHub repository name"),
  branch: z.string().min(1).optional().nullable().describe("Default branch (auto-detected if not set)"),
});

export const deleteIntegrationSchema = z.object({
  integrationId: z.string().min(1).describe("The integration ID to delete"),
});

export const listGithubActivitySchema = z.object({
  integrationId: z.string().min(1).describe("GitHub integration ID from list_integrations"),
  type: z
    .enum(["pull_requests", "commits", "releases"])
    .optional()
    .describe("Pull requests merged into the default branch (default), commits on it, or published releases"),
  since: z.iso.datetime({ offset: true }).optional().describe("Start of the window, ISO 8601 (default: 7 days ago)"),
  until: z.iso.datetime({ offset: true }).optional().describe("End of the window, ISO 8601 (default: now)"),
  page: z.number().int().min(1).optional().describe("Page from a previous response's pagination.nextPage"),
});
