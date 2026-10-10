import { GEO_AGENT_READINESS_HIDDEN_CHECK_IDS } from "../constants/geo.js";
import type { GeoAgentReadinessReport, GeoAgentReadinessResponse } from "../types/geo-agent-readiness.js";

function isVisibleCheck(check: { id: string }): boolean {
  return !GEO_AGENT_READINESS_HIDDEN_CHECK_IDS.has(check.id);
}

function withoutHiddenIssues(report: GeoAgentReadinessReport | null): GeoAgentReadinessReport | null {
  return report && { ...report, issues: report.issues.filter(isVisibleCheck) };
}

export function withoutHiddenReadinessChecks(response: GeoAgentReadinessResponse): GeoAgentReadinessResponse {
  const { comparison } = response;
  return {
    ...response,
    report: withoutHiddenIssues(response.report),
    scan: withoutHiddenIssues(response.scan),
    comparison: comparison && {
      ...comparison,
      resolved: comparison.resolved.filter(isVisibleCheck),
      added: comparison.added.filter(isVisibleCheck),
      improved: comparison.improved.filter(isVisibleCheck),
      worsened: comparison.worsened.filter(isVisibleCheck),
    },
  };
}
