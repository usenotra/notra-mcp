import { GEO_SNAPSHOT_OPTIONAL_TIMEOUT_MS } from "../constants/geo.js";
import type { NotraClient } from "../notra-client.js";
import type { GeoWindowParams } from "../types/geo-common.js";
import type { GeoNextAction, GeoSnapshotResponse } from "../types/geo-diagnostics.js";

const SNAPSHOT_ITEM_LIMIT = 5;

function failureMessage(result: PromiseRejectedResult): string {
  return result.reason instanceof Error ? result.reason.message : String(result.reason);
}

export async function loadGeoSnapshot(
  client: NotraClient,
  projectId: string,
  window: GeoWindowParams,
): Promise<GeoSnapshotResponse> {
  const overviewPromise = client.getGeoVisibilityOverview(projectId, window);
  // Optional sections are useless without the overview, so stop them when it fails.
  const optionalController = new AbortController();
  const timeout = { timeoutMs: GEO_SNAPSHOT_OPTIONAL_TIMEOUT_MS, signal: optionalController.signal };
  const optionalResults = Promise.allSettled([
    client.getGeoVisibilityCompetitorShare(projectId, window, timeout),
    client.listGeoContentGaps(projectId, timeout),
    client.getGeoAgentReadiness(projectId, timeout),
    client.getGeoTrafficOverview(projectId, window, timeout),
    client.getGeoSentiment(projectId, window, timeout),
    client.getGeoChanges(projectId, timeout),
    client.listGeoShelfSources(projectId, { limit: SNAPSHOT_ITEM_LIMIT }, timeout),
  ]);
  let overview: Awaited<typeof overviewPromise>;
  try {
    overview = await overviewPromise;
  } catch (error) {
    optionalController.abort();
    throw error;
  }
  const [competitorResult, gapsResult, readinessResult, trafficResult, sentimentResult, changesResult, shelfResult] =
    await optionalResults;
  const warnings: GeoSnapshotResponse["warnings"] = [];

  const competitors =
    competitorResult.status === "fulfilled"
      ? {
          tracked: competitorResult.value.points.length,
          leaders: [...competitorResult.value.points]
            .sort((left, right) => right.mentions - left.mentions)
            .slice(0, SNAPSHOT_ITEM_LIMIT),
        }
      : null;
  if (competitorResult.status === "rejected") {
    warnings.push({ section: "competitors", message: failureMessage(competitorResult) });
  }

  const contentGaps =
    gapsResult.status === "fulfilled"
      ? {
          hasScanData: gapsResult.value.hasScanData,
          promptGapCount: gapsResult.value.promptGaps.length,
          searchGapCount: gapsResult.value.searchGaps.length,
          topPromptGaps: [...gapsResult.value.promptGaps]
            .sort((left, right) => right.opportunity - left.opportunity)
            .slice(0, SNAPSHOT_ITEM_LIMIT),
          topSearchGaps: [...gapsResult.value.searchGaps]
            .sort((left, right) => (right.impressions ?? -1) - (left.impressions ?? -1))
            .slice(0, SNAPSHOT_ITEM_LIMIT),
        }
      : null;
  if (gapsResult.status === "rejected") {
    warnings.push({ section: "contentGaps", message: failureMessage(gapsResult) });
  }

  const readinessReport = readinessResult.status === "fulfilled" ? readinessResult.value.report : null;
  const readinessScan = readinessResult.status === "fulfilled" ? readinessResult.value.scan : null;
  const agentReadiness =
    readinessResult.status === "fulfilled"
      ? {
          targetUrl: readinessResult.value.targetUrl,
          status: readinessScan?.status ?? readinessReport?.status ?? ("not_scanned" as const),
          score: readinessReport?.score ?? null,
          scoreLabel: readinessReport?.scoreLabel ?? null,
          topIssues: (readinessReport?.issues ?? []).slice(0, SNAPSHOT_ITEM_LIMIT),
        }
      : null;
  if (readinessResult.status === "rejected") {
    warnings.push({ section: "agentReadiness", message: failureMessage(readinessResult) });
  }

  const traffic =
    trafficResult.status === "fulfilled"
      ? {
          configured: trafficResult.value.configured,
          totals: trafficResult.value.totals,
          topSources: [...trafficResult.value.sources]
            .sort((left, right) => right.visits - left.visits)
            .slice(0, SNAPSHOT_ITEM_LIMIT),
        }
      : null;
  if (trafficResult.status === "rejected") {
    warnings.push({ section: "traffic", message: failureMessage(trafficResult) });
  }

  const sentiment = sentimentResult.status === "fulfilled" ? sentimentResult.value.summary : null;
  if (sentimentResult.status === "rejected") {
    warnings.push({ section: "sentiment", message: failureMessage(sentimentResult) });
  }
  const changes = changesResult.status === "fulfilled" ? changesResult.value.summary : null;
  if (changesResult.status === "rejected") {
    warnings.push({ section: "changes", message: failureMessage(changesResult) });
  }
  const shelf =
    shelfResult.status === "fulfilled"
      ? {
          returnedSources: shelfResult.value.sources.length,
          hasMore: shelfResult.value.nextOffset !== null,
          topSources: shelfResult.value.sources,
        }
      : null;
  if (shelfResult.status === "rejected") {
    warnings.push({ section: "shelf", message: failureMessage(shelfResult) });
  }

  const checks = overview.engines.reduce((sum, engine) => sum + engine.checks, 0);
  const mentions = overview.engines.reduce((sum, engine) => sum + engine.mentions, 0);
  const citations = overview.engines.reduce((sum, engine) => sum + engine.citations, 0);
  const visibility = overview.engines.reduce((sum, engine) => sum + engine.visibility, 0);
  const positioned = overview.engines.filter((engine) => engine.avgPosition !== null && engine.mentions > 0);
  const positionWeight = positioned.reduce((sum, engine) => sum + engine.mentions, 0);
  const avgPosition =
    positionWeight === 0
      ? null
      : positioned.reduce((sum, engine) => sum + (engine.avgPosition ?? 0) * engine.mentions, 0) / positionWeight;
  const mentionRate = checks === 0 ? 0 : mentions / checks;
  const visibilityRate = checks === 0 ? 0 : visibility / checks;
  const recommendedNextActions: GeoNextAction[] = [];
  const next = (
    priority: GeoNextAction["priority"],
    action: string,
    reason: string,
    tool: string | null,
    args: Record<string, unknown> | null,
    usesCredits = false,
  ) => recommendedNextActions.push({ priority, action, reason, tool, arguments: args, usesCredits });
  const projectArgs = { projectId };
  const windowArgs = { projectId, ...window };

  if (!overview.configured) {
    next("high", "configure_visibility", "The visibility analytics backend is not configured.", null, null);
  } else if (checks === 0) {
    next(
      "high",
      "run_geo_scan",
      "No answer-engine checks exist in the selected window.",
      "create_geo_scan",
      projectArgs,
      true,
    );
  } else if (mentionRate < 0.5) {
    next(
      "medium",
      "review_content_gaps",
      `The aggregate mention rate is ${Math.round(mentionRate * 100)}%.`,
      "list_geo_content_gaps",
      projectArgs,
    );
  }
  if (changes && (changes.lost > 0 || changes.citationsRemoved > 0)) {
    next(
      "high",
      "investigate_visibility_losses",
      `${changes.lost} mentions and ${changes.citationsRemoved} citations were lost since the previous scan.`,
      "get_geo_changes",
      projectArgs,
    );
  }
  if (contentGaps && contentGaps.promptGapCount + contentGaps.searchGapCount > 0) {
    next(
      "high",
      "prioritize_content_gaps",
      `${contentGaps.promptGapCount} prompt gaps and ${contentGaps.searchGapCount} search gaps are open.`,
      "list_geo_content_gaps",
      projectArgs,
    );
  }
  if (sentiment && sentiment.negativeShare !== null && sentiment.negativeShare >= 0.25) {
    next(
      "medium",
      "review_negative_sentiment",
      `${Math.round(sentiment.negativeShare * 100)}% of classified mentions are negative.`,
      "list_geo_sentiment_evidence",
      windowArgs,
    );
  }
  if (agentReadiness && agentReadiness.score !== null && agentReadiness.score < 80) {
    next(
      "medium",
      "fix_agent_readiness",
      `The latest agent readiness score is ${agentReadiness.score}.`,
      "get_geo_agent_readiness",
      projectArgs,
    );
  }
  if (traffic && !traffic.configured) {
    next("low", "configure_ai_traffic", "AI traffic measurement is not configured.", "get_geo_ingest_setup", {});
  }

  return {
    generatedAt: new Date().toISOString(),
    window,
    visibility: {
      configured: overview.configured,
      checks,
      mentions,
      mentionRate,
      citations,
      visibility,
      visibilityRate,
      avgPosition,
      engines: overview.engines,
    },
    sentiment,
    changes,
    competitors,
    contentGaps,
    shelf,
    agentReadiness,
    traffic,
    recommendedNextActions,
    warnings,
    organization: overview.organization,
  };
}
