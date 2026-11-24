import type { GeoTrafficOverviewResponse } from "../types/geo-traffic.js";

// Daily points include human and unknown visits; the AI-only sources table does not.
export function trafficClassification(points: GeoTrafficOverviewResponse["points"]) {
  let totalRequests = 0;
  let unknownRequests = 0;
  for (const { visitorType, visits } of points) {
    totalRequests += visits;
    if (visitorType === "unknown") unknownRequests += visits;
  }
  return {
    totalRequests,
    unknownRequests,
    classifiedShare: totalRequests ? (totalRequests - unknownRequests) / totalRequests : null,
  };
}
