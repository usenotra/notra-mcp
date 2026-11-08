import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";
import {
  createSitePostPreviewSchema,
  listSiteDeploymentsSchema,
  listSitesSchema,
  siteDeploymentSchema,
  sitePostSchema,
  siteSchema,
} from "../schemas/site.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

const READ = { readOnlyHint: true, openWorldHint: false, destructiveHint: false };

export function registerSiteTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_sites",
    {
      description:
        "List the workspace's Notra Sites, hosted blogs and changelogs built from a GitHub repository, with each Site's URL, whether it is live and its blog mount. Pass a Site's id to the other Site tools; get_site has its settings, domains and previews.",
      annotations: { title: "List Sites", ...READ },
      inputSchema: shareJsonSchema(listSitesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listSites")),
    },
    () => handleError(() => client.listSites()),
  );

  server.registerTool(
    "get_site",
    {
      description:
        "Get a Site's settings, live deployment, custom domains with the DNS records they need, and open previews.",
      annotations: { title: "Get Site", ...READ },
      inputSchema: shareJsonSchema(siteSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getSite")),
    },
    ({ siteId }) => handleError(() => client.getSite(siteId)),
  );

  server.registerTool(
    "list_site_deployments",
    {
      description:
        "List a Site's production and preview builds, newest first, with status, commit, error message and compiler diagnostics (file, line, message).",
      annotations: { title: "List Site Deployments", ...READ },
      inputSchema: shareJsonSchema(listSiteDeploymentsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listSiteDeployments")),
    },
    ({ siteId, ...params }) => handleError(() => client.listSiteDeployments(siteId, params)),
  );

  server.registerTool(
    "get_site_deployment",
    {
      description:
        "Get one Site deployment with its compiler diagnostics and the newest build log output. Use it to follow a build until its status is final, or to find out why it failed; fixes go to the Site's GitHub repository (blog.json and the content files).",
      annotations: { title: "Get Site Deployment", ...READ },
      inputSchema: shareJsonSchema(siteDeploymentSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getSiteDeployment")),
    },
    ({ siteId, deploymentId }) => handleError(() => client.getSiteDeployment(siteId, deploymentId)),
  );

  server.registerTool(
    "deploy_site",
    {
      description:
        "Build the newest commit on a Site's production branch. It goes live unless production is pinned to an older build (rollbackActive in get_site), which someone has to promote in the dashboard. Returns the queued deployment; poll get_site_deployment until its status is final.",
      annotations: { title: "Deploy Site", readOnlyHint: false, openWorldHint: true, destructiveHint: true },
      inputSchema: shareJsonSchema(siteSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("startSiteDeployment")),
    },
    ({ siteId }) => handleError(() => client.startSiteDeployment(siteId)),
  );

  server.registerTool(
    "redeploy_site_deployment",
    {
      description:
        "Build the same commit as an existing deployment again, for example to retry a failed build. A production deployment older than the live one cannot be rebuilt this way; that is a rollback, done in the dashboard. Poll get_site_deployment until its status is final.",
      annotations: {
        title: "Redeploy Site Deployment",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
      },
      inputSchema: shareJsonSchema(siteDeploymentSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("redeploySiteDeployment")),
    },
    ({ siteId, deploymentId }) => handleError(() => client.redeploySiteDeployment(siteId, deploymentId)),
  );

  server.registerTool(
    "preview_post_on_site",
    {
      description:
        "Build a private preview of a Site with a saved blog post or changelog added, without changing the repository or the live site, and return its URL. Workspace members open it after signing in; password-protected sharing is set up in the dashboard. Poll get_site_post_preview until live is true before sharing the link.",
      annotations: { title: "Preview Post on Site", readOnlyHint: false, openWorldHint: true, destructiveHint: false },
      inputSchema: shareJsonSchema(createSitePostPreviewSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createSitePostPreview")),
    },
    ({ siteId, ...body }) => handleError(() => client.createSitePostPreview(siteId, body)),
  );

  server.registerTool(
    "get_site_post_preview",
    {
      description: "Get the status and URL of a post's preview on a Site. preview is null when there is none.",
      annotations: { title: "Get Site Post Preview", ...READ },
      inputSchema: shareJsonSchema(sitePostSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getSitePostPreview")),
    },
    ({ siteId, postId }) => handleError(() => client.getSitePostPreview(siteId, postId)),
  );

  server.registerTool(
    "publish_post_to_site",
    {
      description:
        "Open a pull request that adds a saved blog post or changelog, with its images and frontmatter, to a Site's GitHub repository, or update the post's open pull request. The post goes live once someone merges the pull request; it is never committed straight to the production branch.",
      annotations: {
        title: "Publish Post to Site",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(sitePostSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("publishPostToSite")),
    },
    ({ siteId, postId }) => handleError(() => client.publishPostToSite(siteId, postId)),
  );
}
