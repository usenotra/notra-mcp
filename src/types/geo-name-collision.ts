import type { Organization } from "./api.js";

export interface GeoNameCollision {
  id: string;
  name: string;
  domain: string;
  status: "pending" | "accepted" | "dismissed";
  source: "manual" | "scan";
  evidenceUrl: string | null;
  createdAt: string;
}

export interface GeoNameCollisionListResponse {
  notConfusedWith: GeoNameCollision[];
  suggestions: GeoNameCollision[];
  organization: Organization;
}

export interface AddGeoNameCollisionRequest {
  name: string;
  domain: string;
}
