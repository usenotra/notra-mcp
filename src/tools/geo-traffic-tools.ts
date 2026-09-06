import {
  getGeoTrafficOverviewSchema,
  getGeoTrafficLogSchema,
  listGeoTrafficJourneysSchema,
  getGeoTrafficJourneySchema,
  listGeoTrafficPagesSchema,
  getGeoIngestSetupSchema,
  issueGeoIngestTokenSchema,
  rotateGeoIngestTokenSchema,
} from "../schemas/geo-traffic.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";

export function registerGeoTrafficTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "get_geo_traffic_overview",
    {
      description:
        "Get AI traffic totals for a project's website: crawler and AI-referral visit totals, a per-source breakdown and the daily timeseries behind it",
      annotations: { title: "Get AI Traffic Overview", readOnlyHint: true },
      inputSchema: getGeoTrafficOverviewSchema,
    },
    ({ projectId, ...params }) => handleError(() => client.getGeoTrafficOverview(projectId, params)),
  );

  server.registerTool(
    "get_geo_traffic_log",
    {
      description:
        "Get the most recent individual requests from AI crawlers and referrals. This endpoint has no time window; use limit to bound it.",
      annotations: { title: "Get AI Traffic Log", readOnlyHint: true },
      inputSchema: getGeoTrafficLogSchema,
    },
    ({ projectId, ...params }) => handleError(() => client.getGeoTrafficLog(projectId, params)),
  );

  server.registerTool(
    "list_geo_traffic_journeys",
    {
      description:
        "List AI traffic journeys: sessions grouped by agent, showing how many pages one agent read, over what span, with sample paths",
      annotations: { title: "List AI Traffic Journeys", readOnlyHint: true },
      inputSchema: listGeoTrafficJourneysSchema,
    },
    ({ projectId, ...params }) => handleError(() => client.listGeoTrafficJourneys(projectId, params)),
  );

  server.registerTool(
    "get_geo_traffic_journey",
    {
      description: "Get every event in one AI traffic journey",
      annotations: { title: "Get AI Traffic Journey", readOnlyHint: true },
      inputSchema: getGeoTrafficJourneySchema,
    },
    ({ projectId, journeyId, ...params }) =>
      handleError(() => client.getGeoTrafficJourney(projectId, journeyId, params)),
  );

  server.registerTool(
    "list_geo_traffic_pages",
    {
      description:
        "List the pages AI crawlers and referrals read most, with the previous window's count for comparison",
      annotations: { title: "List AI Traffic Pages", readOnlyHint: true },
      inputSchema: listGeoTrafficPagesSchema,
    },
    ({ projectId, ...params }) => handleError(() => client.listGeoTrafficPages(projectId, params)),
  );

  server.registerTool(
    "get_geo_ingest_setup",
    {
      description:
        "Get the AI traffic tracking install snippets (Next.js, Nuxt, Netlify) and the ingest endpoint. The snippets read the token from an environment variable; issue the token itself with issue_geo_ingest_token.",
      annotations: { title: "Get AI Traffic Ingest Setup", readOnlyHint: true },
      inputSchema: getGeoIngestSetupSchema,
    },
    () => handleError(() => client.getGeoIngestSetup()),
  );

  server.registerTool(
    "issue_geo_ingest_token",
    {
      description:
        "Issue the AI traffic tracking token together with the install snippets. Issuing does not invalidate previously issued tokens; use rotate_geo_ingest_token for that. Requires a write scope.",
      annotations: { title: "Issue AI Traffic Ingest Token", destructiveHint: false },
      inputSchema: issueGeoIngestTokenSchema,
    },
    ({ projectId }) => handleError(() => client.issueGeoIngestToken(projectId)),
  );

  server.registerTool(
    "rotate_geo_ingest_token",
    {
      description:
        "Rotate the AI traffic tracking token. This invalidates all tokens previously issued for the organization. Deployments using an old token will be rejected.",
      annotations: { title: "Rotate AI Traffic Ingest Token", destructiveHint: true },
      inputSchema: rotateGeoIngestTokenSchema,
    },
    ({ projectId }) => handleError(() => client.rotateGeoIngestToken(projectId)),
  );
}
