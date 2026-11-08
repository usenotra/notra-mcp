import * as z from "zod";

const siteId = z.string().min(1).describe("Site ID (see list_sites)");
const deploymentId = z.string().min(1).describe("Deployment ID (see list_site_deployments)");
const postId = z.string().min(1).describe("ID of a saved blog post or changelog (see list_posts)");

export const listSitesSchema = z.object({});

export const siteSchema = z.object({ siteId });

export const listSiteDeploymentsSchema = z.object({
  siteId,
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe("Newest deployments to return (1-100, default 20). Live deployments are always included."),
});

export const siteDeploymentSchema = z.object({ siteId, deploymentId });

export const createSitePostPreviewSchema = z.object({
  siteId,
  postId,
  lifetime: z.enum(["1h", "1d", "3d", "7d"]).optional().describe("How long the preview stays open (default 1d)"),
});

export const sitePostSchema = z.object({ siteId, postId });
