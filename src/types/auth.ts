export type OAuthAuthContext = {
  kind: "oauth";
  token: string;
  userId: string;
  organizationId: string;
  scopes: string[];
};

export type ApiKeyAuthContext = {
  kind: "apiKey";
  token: string;
  /** Workspace an account API key acts on, sent as `X-Notra-Organization-Id`. Organization keys ignore it. */
  organizationId?: string;
};

export type AuthContext = ApiKeyAuthContext | OAuthAuthContext;

export type OAuthConfig = {
  issuer: string;
  jwksUrl: string;
  clientId: string | undefined;
  resource: string;
  resourceAudiences: string[];
  authorizationServerMetadataUrl: string;
};

export type OAuthProtectedResourceMetadata = {
  resource: string;
  authorization_servers: string[];
  bearer_methods_supported: string[];
  scopes_supported: string[];
  resource_name: string;
  resource_documentation: string;
};
