import { MCP_BASE_PATH } from "../constants/http.js";
import {
  SERVER_CARD_DESCRIPTION,
  SERVER_CARD_SCHEMA_URL,
  SERVER_DIRECTORY_LISTINGS,
  SERVER_ICONS,
  SERVER_REGISTRY_NAME,
  SERVER_REPOSITORY_URL,
  SERVER_TITLE,
  SERVER_WEBSITE_URL,
} from "../constants/server.js";

export function getServerCard(origin: string, version: string) {
  return {
    $schema: SERVER_CARD_SCHEMA_URL,
    name: SERVER_REGISTRY_NAME,
    version,
    title: SERVER_TITLE,
    description: SERVER_CARD_DESCRIPTION,
    websiteUrl: SERVER_WEBSITE_URL,
    repository: { url: SERVER_REPOSITORY_URL, source: "github" },
    icons: SERVER_ICONS,
    remotes: [
      {
        type: "streamable-http",
        url: `${origin}${MCP_BASE_PATH}`,
        supportedProtocolVersions: ["2026-07-28", "2025-11-25"],
      },
      {
        type: "streamable-http",
        url: `${origin}${MCP_BASE_PATH}/{organization}`,
        variables: { organization: { description: "Workspace ID or slug this connection acts on", isRequired: true } },
      },
    ],
    _meta: { "com.usenotra/listings": SERVER_DIRECTORY_LISTINGS },
  };
}

export function getAiCatalog(origin: string) {
  return {
    entries: [
      {
        identifier: `urn:air:${new URL(origin).host}:mcp:notra`,
        type: "application/mcp-server-card+json",
        url: `${origin}${MCP_BASE_PATH}/server-card`,
      },
    ],
  };
}
