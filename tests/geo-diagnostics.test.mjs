import assert from "node:assert/strict";
import { test, vi } from "vitest";
import { NotraClient } from "../src/notra-client.ts";
import { loadGeoSnapshot } from "../src/utils/geo-snapshot.ts";

const organization = { id: "org-1", slug: "acme", name: "Acme", logo: null };

test("diagnostic client methods use the public API contracts", async () => {
  const requests = [];
  vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
    requests.push(new URL(url));
    return Response.json({ organization });
  });
  const client = new NotraClient("token", "https://api.example.test");

  await client.listGeoPromptResultSummaries("project/1", {
    limit: 10,
    mentioned: false,
    cursor: "20",
  });
  await client.getGeoPromptResultDetail("project/1", "check/1");
  await client.getGeoPromptHistory("project/1", "prompt/1", "scan/1");
  await client.listGeoSentimentEvidence("project/1", { days: 30, cursor: "opaque" });
  await client.listGeoShelfSources("project/1", { offset: 20, limit: 10 });

  assert.equal(requests[0].pathname, "/v1/projects/project%2F1/geo/visibility/prompt-results/summaries");
  assert.equal(requests[0].searchParams.get("mentioned"), "false");
  assert.equal(requests[1].pathname, "/v1/projects/project%2F1/geo/visibility/prompt-results/check%2F1");
  assert.equal(requests[2].pathname, "/v1/projects/project%2F1/geo/prompts/prompt%2F1/history");
  assert.equal(requests[2].searchParams.get("scanId"), "scan/1");
  assert.equal(requests[3].pathname, "/v1/projects/project%2F1/geo/sentiment/evidence");
  assert.equal(requests[3].searchParams.get("cursor"), "opaque");
  assert.equal(requests[4].pathname, "/v1/projects/project%2F1/geo/shelf-sources");
  assert.equal(requests[4].searchParams.get("offset"), "20");
});

test("snapshot bounds slow optional signals and preserves a warning", async () => {
  const timeouts = [];
  const recordTimeout = (options) => timeouts.push(options?.timeoutMs);
  const client = {
    getGeoVisibilityOverview: async () => ({
      configured: true,
      engines: [
        {
          engine: "openai",
          checks: 10,
          mentions: 4,
          mentionRate: 0.4,
          citations: 3,
          visibility: 5,
          visibilityRate: 0.5,
          avgPosition: 2,
          lastCheckedAt: "2026-09-16T00:00:00.000Z",
        },
      ],
      organization,
    }),
    getGeoVisibilityCompetitorShare: async (_projectId, _window, options) => {
      recordTimeout(options);
      return { points: [], timeseries: [], organization };
    },
    listGeoContentGaps: async (_projectId, options) => {
      recordTimeout(options);
      return {
        promptGaps: [],
        searchGaps: [],
        hasScanData: true,
        organization,
      };
    },
    getGeoAgentReadiness: async (_projectId, options) => {
      recordTimeout(options);
      throw new Error("Notra API request timed out after 5s");
    },
    getGeoTrafficOverview: async (_projectId, _window, options) => {
      recordTimeout(options);
      return {
        configured: false,
        totals: { crawler: 0, aiReferral: 0 },
        sources: [],
        points: [],
        organization,
      };
    },
    getGeoSentiment: async (_projectId, _window, options) => {
      recordTimeout(options);
      return {
        summary: {
          totalChecks: 10,
          mentions: 4,
          positive: 1,
          neutral: 1,
          negative: 2,
          lastCheckedAt: "2026-09-16T00:00:00.000Z",
          score: -0.25,
          classifiedMentions: 4,
          unknownMentions: 0,
          notMentioned: 6,
          positiveShare: 0.25,
          neutralShare: 0.25,
          negativeShare: 0.5,
          classificationCoverage: 1,
        },
        organization,
      };
    },
    getGeoChanges: async (_projectId, options) => {
      recordTimeout(options);
      return {
        summary: {
          gained: 0,
          lost: 1,
          positionImproved: 0,
          positionDropped: 0,
          citationsAdded: 0,
          citationsRemoved: 1,
        },
        organization,
      };
    },
    listGeoShelfSources: async (_projectId, _params, options) => {
      recordTimeout(options);
      return { sources: [], nextOffset: null, organization };
    },
  };

  const snapshot = await loadGeoSnapshot(client, "project-1", { days: 30 });

  assert.equal(snapshot.visibility.mentionRate, 0.4);
  assert.equal(snapshot.sentiment.negativeShare, 0.5);
  assert.equal(snapshot.changes.lost, 1);
  assert.deepEqual(snapshot.warnings, [{ section: "agentReadiness", message: "Notra API request timed out after 5s" }]);
  assert.deepEqual(timeouts, [5_000, 5_000, 5_000, 5_000, 5_000, 5_000, 5_000]);
  assert.deepEqual(
    snapshot.recommendedNextActions.map(({ action, tool, arguments: args }) => [action, tool, args]),
    [
      ["review_content_gaps", "list_geo_content_gaps", { projectId: "project-1" }],
      ["investigate_visibility_losses", "get_geo_changes", { projectId: "project-1" }],
      ["review_negative_sentiment", "list_geo_sentiment_evidence", { projectId: "project-1", days: 30 }],
      ["configure_ai_traffic", "get_geo_ingest_setup", {}],
    ],
  );
});
