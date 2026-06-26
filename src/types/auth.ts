export type AuthKind = "apiKey" | "oauth";

export type OAuthAuthContext = {
  kind: "oauth";
  token: string;
  userId: string;
  organizationId: string;
  scopes: string[];
  hasScopeClaim: boolean;
};

export type ApiKeyAuthContext = {
  kind: "apiKey";
  token: string;
};

export type AuthContext = ApiKeyAuthContext | OAuthAuthContext;

export type OAuthConfig = {
  issuer: string;
  jwksUrl: string;
  resource: string;
  authorizationServerMetadataUrl: string;
};

export type OAuthProtectedResourceMetadata = {
  resource: string;
  authorization_servers: string[];
  authorization_server_metadata_url: string;
  bearer_methods_supported: string[];
  scopes_supported: string[];
};
