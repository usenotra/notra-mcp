import type { Organization } from "./api.js";

export type AuthenticationIdentity =
  | {
      type: "apiKey";
    }
  | {
      type: "oauth";
      accountId: string;
      scopes: string[];
    };

export interface WorkspaceMembership extends Organization {
  role: string | null;
  status: "active" | "pending";
  isCurrent: boolean;
}

export interface WorkspaceContextResponse {
  currentWorkspace: Organization;
  workspaces: WorkspaceMembership[];
  authentication: AuthenticationIdentity;
}

/** `list_workspaces` output: the API's workspace context, without a current workspace while none is selected. */
export interface WorkspaceListResponse {
  currentWorkspace: Organization | null;
  selectionRequired: boolean;
  workspaces: WorkspaceMembership[];
  authentication: AuthenticationIdentity;
}

export interface WhoAmIResponse {
  workspace: Organization | null;
  selectionRequired: boolean;
  authentication: AuthenticationIdentity;
}
