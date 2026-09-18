import { TOOLSET_VALUES } from "../constants/toolset.js";
import type { Toolset } from "../types/toolset.js";

/**
 * Parses a comma-separated toolset list such as `content,geo`. Empty input
 * enables every toolset; unknown names throw so typos don't silently hide tools.
 */
export function parseToolsets(value: string | undefined): ReadonlySet<Toolset> {
  const names = (value ?? "")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);
  if (names.length === 0) {
    return new Set(TOOLSET_VALUES);
  }

  const unknown = names.filter((name) => !(TOOLSET_VALUES as readonly string[]).includes(name));
  if (unknown.length > 0) {
    throw new Error(`Unknown toolset: ${unknown.join(", ")}. Valid toolsets: ${TOOLSET_VALUES.join(", ")}`);
  }
  return new Set(names as Toolset[]);
}
