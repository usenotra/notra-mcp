import {
  addGeoNameCollisionSchema,
  geoNameCollisionIdSchema,
  listGeoNameCollisionsSchema,
} from "../schemas/geo-name-collision.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoNameCollisionTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_geo_name_collisions",
      description:
        "List the project's not-confused-with list: other products that share the brand's name (such as Jam at jam.dev). Answers that name the brand but are about one of these products don't count as mentions. Returns notConfusedWith (accepted entries) and suggestions (same-named products that scan answers cited on other domains, waiting for review), each with id, name, domain, status, source, evidenceUrl and createdAt, plus the organization. Accept or dismiss suggestions with accept_geo_name_collision or dismiss_geo_name_collision.",
      annotations: {
        title: "List GEO Name Collisions",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoNameCollisionsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoNameCollisions")),
    },
    ({ projectId }) => handleError(() => client.listGeoNameCollisions(projectId)),
  );

  server.tool(
    {
      name: "add_geo_name_collision",
      description:
        "Add a same-named product on another domain to the not-confused-with list, so answers about it stop counting as brand mentions from the next scan on. Past results are not recomputed. Matches on domain: a pending suggestion or dismissed entry for it is accepted. Undo with dismiss_geo_name_collision. Returns the full list.",
      annotations: {
        title: "Add GEO Name Collision",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(addGeoNameCollisionSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("addGeoNameCollision")),
    },
    ({ projectId, ...body }) => handleError(() => client.addGeoNameCollision(projectId, body)),
  );

  server.tool(
    {
      name: "accept_geo_name_collision",
      description:
        "Accept a suggested name collision so answers about that product stop counting as brand mentions from the next scan on. Undo with dismiss_geo_name_collision. Returns the full list. Get IDs from list_geo_name_collisions.",
      annotations: {
        title: "Accept GEO Name Collision",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(geoNameCollisionIdSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("acceptGeoNameCollision")),
    },
    ({ projectId, collisionId }) => handleError(() => client.acceptGeoNameCollision(projectId, collisionId)),
  );

  server.tool(
    {
      name: "dismiss_geo_name_collision",
      description:
        "Dismiss a suggested name collision or remove an accepted one. Answers about that product count as brand mentions again from the next scan on, and scans won't suggest the domain again. Re-add it with add_geo_name_collision. Returns the full list.",
      annotations: {
        title: "Dismiss GEO Name Collision",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(geoNameCollisionIdSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("dismissGeoNameCollision")),
    },
    ({ projectId, collisionId }) => handleError(() => client.dismissGeoNameCollision(projectId, collisionId)),
  );
}
