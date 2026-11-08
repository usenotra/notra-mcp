import {
  listSitesSchema,
  listSiteAuthorsSchema,
  upsertSiteAuthorSchema,
  deleteSiteAuthorSchema,
  importSiteAuthorsSchema,
  setSiteAuthorPageSchema,
  publishSiteDesignSchema,
} from "../schemas/site.js";
import type { McpServer } from "@modelcontextprotocol/server";
import {
  createSitePostPreviewSchema,
  listSiteDeploymentsSchema,
  siteDeploymentSchema,
  sitePostSchema,
  siteSchema,
} from "../schemas/site.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

const STAGED =
  "The change is saved to the site's blog.json as an unpublished Design change, the same draft the dashboard's Design tab shows, and is not live until publish_site_design or the dashboard publishes it.";

const SITE_READ_ANNOTATIONS = { readOnlyHint: true, openWorldHint: false, destructiveHint: false };

export function registerSiteTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_sites",
    {
      description:
        "List the workspace's Notra Sites with their URL, whether they are live and their blog mount. Only sites with a blogMount have authors; pass a site's id to the other site tools.",
      annotations: { title: "List Sites", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listSitesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listSites")),
    },
    () => handleError(() => client.listSites()),
  );

  server.registerTool(
    "list_site_authors",
    {
      description:
        "List a Notra Site's blog authors from its blog.json, including unpublished Design changes. Each author has its fields, live (in the published blog.json), posts (Notra posts crediting it) and ref, the site:<id> value update_post takes in authorIds. Also returns the author page layout and hasUnpublishedChanges.",
      annotations: { title: "List Site Authors", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listSiteAuthorsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listSiteAuthors")),
    },
    ({ siteId }) => handleError(() => client.listSiteAuthors(siteId)),
  );

  server.registerTool(
    "upsert_site_author",
    {
      description: `Create a Notra Site blog author, or replace every field of an existing one (fields you leave out are removed, so send the full author). Links must be full https:// URLs; the avatar is a site path like /images/jane.png or an https:// URL. To rename, send the new authorId with previousId. Renaming an author that is live or credited on posts fails with SITE_AUTHOR_IN_USE until force is true; ask the user first. ${STAGED}`,
      annotations: {
        title: "Upsert Site Author",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(upsertSiteAuthorSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("upsertSiteAuthor")),
    },
    ({ siteId, authorId, ...author }) => handleError(() => client.upsertSiteAuthor(siteId, authorId, author)),
  );

  server.registerTool(
    "delete_site_author",
    {
      description: `Remove an author from a Notra Site's blog.json. Deleting an author that is live or credited on posts fails with SITE_AUTHOR_IN_USE until force is true; ask the user first, since those posts then show the id as a plain name. ${STAGED}`,
      annotations: {
        title: "Delete Site Author",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteSiteAuthorSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteSiteAuthor")),
    },
    ({ siteId, authorId, force }) => handleError(() => client.deleteSiteAuthor(siteId, authorId, force)),
  );

  server.registerTool(
    "import_site_authors",
    {
      description: `Copy the workspace's Notra authors into a Notra Site's blog.json, using each author's slug as its id; with replace, authors that already use that id are overwritten. Avatars on https URLs are kept; avatars uploaded to Notra are listed in avatarsSkipped, set them afterwards with upsert_site_author. ${STAGED}`,
      annotations: {
        title: "Import Site Authors",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
      },
      inputSchema: shareJsonSchema(importSiteAuthorsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("importSiteAuthors")),
    },
    ({ siteId, ...body }) => handleError(() => client.importSiteAuthors(siteId, body)),
  );

  server.registerTool(
    "set_site_author_page",
    {
      description: `Set the layout of every author page on a Notra Site (blog.authorPage): inline or stacked. ${STAGED}`,
      annotations: {
        title: "Set Site Author Page",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(setSiteAuthorPageSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateSiteAuthorPage")),
    },
    ({ siteId, layout }) => handleError(() => client.setSiteAuthorPage(siteId, { layout })),
  );

  server.registerTool(
    "publish_site_design",
    {
      description:
        "Publish a Notra Site's unpublished blog.json Design changes (authors, author page layout and the images they use): commits them to the site's production branch and deploys the live site, like Publish in the dashboard. Confirm with the user before calling. Fails with SITE_HAS_OTHER_CHANGES while other files have unpublished changes; those are published from the dashboard. published is false when there was nothing to publish.",
      annotations: {
        title: "Publish Site Design",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
      },
      inputSchema: shareJsonSchema(publishSiteDesignSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("publishSite")),
    },
    ({ siteId, message }) => handleError(() => client.publishSiteDesign(siteId, { message })),
  );

  server.registerTool(
    "get_site",
    {
      description:
        "Get a Site's settings, live deployment, custom domains with the DNS records they need, and open previews.",
      annotations: { title: "Get Site", ...SITE_READ_ANNOTATIONS },
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
      annotations: { title: "List Site Deployments", ...SITE_READ_ANNOTATIONS },
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
      annotations: { title: "Get Site Deployment", ...SITE_READ_ANNOTATIONS },
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
      annotations: { title: "Get Site Post Preview", ...SITE_READ_ANNOTATIONS },
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
