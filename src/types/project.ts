import type { Organization } from "./api.js";

export interface GeoProject {
  id: string;
  name: string;
  brandSettingsId: string;
  createdAt: string;
}

export interface ProjectListResponse {
  projects: GeoProject[];
  organization: Organization;
}

export interface ProjectResponse {
  project: GeoProject;
  organization: Organization;
}

export interface ProjectDeleteResponse {
  id: string;
  organization: Organization;
}

export interface CreateProjectRequest {
  name: string;
  brandSettingsId?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  brandSettingsId?: string;
}
