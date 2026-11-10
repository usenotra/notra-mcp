import { readFileSync } from "node:fs";
import type { ViewsManifest } from "mcp-use";
import { getMcpResourceUrl, getOAuthConfig } from "./oauth-config.js";

export function loadViewsManifest(): ViewsManifest | undefined {
  try {
    return JSON.parse(readFileSync(new URL("../views.json", import.meta.url), "utf8")) as ViewsManifest;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw error;
  }
}

export function chartView(name: string, description: string, invoking: string, invoked: string) {
  return {
    view: { name, description, domain: new URL(getMcpResourceUrl(getOAuthConfig())).origin, prefersBorder: true },
    _meta: { "openai/toolInvocation/invoking": invoking, "openai/toolInvocation/invoked": invoked },
  };
}
