import * as z from "zod";

export const listIntegrationsSchema = z.object({});

export const createGithubIntegrationSchema = z.object({
  owner: z.string().min(1).describe("GitHub repository owner (user or organization)"),
  repo: z.string().min(1).describe("GitHub repository name"),
  branch: z.string().min(1).optional().nullable().describe("Default branch (auto-detected if not set)"),
});

export const deleteIntegrationSchema = z.object({
  integrationId: z
    .string()
    .min(1)
    .describe("ID of the GitHub or Linear integration to remove, from the github or linear array of list_integrations"),
});

export const listGithubActivitySchema = z.object({
  integrationId: z
    .string()
    .min(1)
    .describe("GitHub integration ID of the repository to read, from the github array of list_integrations"),
  type: z
    .enum(["pull_requests", "commits", "releases"])
    .optional()
    .describe(
      "Which activity to list: pull requests merged into the default branch, commits on that branch, or published releases. Omit for pull requests.",
    ),
  since: z.iso
    .datetime({ offset: true })
    .optional()
    .describe("Start of the time window, such as 2025-01-01T00:00:00Z. Omit to start 7 days ago."),
  until: z.iso
    .datetime({ offset: true })
    .optional()
    .describe("End of the time window, such as 2025-01-31T23:59:59Z. Omit to end now."),
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe("Page to fetch: pass pagination.nextPage from the previous response. Omit for the first page."),
});
