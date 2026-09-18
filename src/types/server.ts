import type { Toolset } from "./toolset.js";

export type CreateServerOptions = {
  /** Tool groups to expose. Defaults to `NOTRA_MCP_TOOLSETS`, or every toolset. */
  toolsets?: ReadonlySet<Toolset>;
  /**
   * Register only the module owning this tool (modern per-request servers
   * serving a single tools/call). Unknown or toolset-filtered names fall back
   * to full registration so error semantics stay intact.
   */
  onlyTool?: string;
};
