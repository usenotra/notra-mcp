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
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

const STAGED =
  "The change is saved to the site's blog.json as an unpublished Design change, the same draft the dashboard's Design tab shows, and is not live until publish_site_design or the dashboard publishes it.";

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
      description: `Copy the workspace's Notra authors into a Notra Site's blog.json, using each author's slug as its id. Avatars on https URLs are kept; avatars uploaded to Notra are listed in avatarsSkipped, set them afterwards with upsert_site_author. ${STAGED}`,
      annotations: {
        title: "Import Site Authors",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
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
}
