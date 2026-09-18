import { AsyncLocalStorage } from "node:async_hooks";
import type { RequestScope } from "../types/request.js";

const requestScope = new AsyncLocalStorage<RequestScope>();

/**
 * Runs a tool handler with the MCP request's cancellation signal in scope, so
 * every Notra API call it makes stops when the MCP client cancels or disconnects.
 */
export async function runWithRequestSignal<T>(signal: AbortSignal | undefined, fn: () => T | Promise<T>): Promise<T> {
  if (!signal) {
    return fn();
  }

  const scope: RequestScope = { signal };
  try {
    return await requestScope.run(scope, fn);
  } finally {
    // Timers created during the call capture this async context and can outlive
    // it (`AbortSignal.timeout` keeps its timer for the full deadline). Drop the
    // signal so they don't keep the request, and its per-request server, alive.
    scope.signal = undefined;
  }
}

export function getRequestSignal(): AbortSignal | undefined {
  return requestScope.getStore()?.signal;
}

/** Combines a request deadline with caller and MCP request cancellation. */
export function createRequestSignal(timeoutMs: number, signal?: AbortSignal): AbortSignal {
  const signals = [AbortSignal.timeout(timeoutMs), signal, getRequestSignal()].filter(
    (candidate): candidate is AbortSignal => candidate !== undefined,
  );
  return signals.length === 1 ? signals[0] : AbortSignal.any(signals);
}
