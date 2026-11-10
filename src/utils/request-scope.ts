import { AsyncLocalStorage } from "node:async_hooks";
import type { AuthContext } from "../types/auth.js";
import type { RequestScope } from "../types/request.js";

const requestScope = new AsyncLocalStorage<RequestScope>();

/**
 * Runs a tool handler with the MCP request's scope, so every Notra API call it
 * makes acts for that caller and stops when the MCP client cancels or disconnects.
 */
export async function runInRequestScope<T>(values: RequestScope, fn: () => T | Promise<T>): Promise<T> {
  const scope: RequestScope = { ...requestScope.getStore(), ...values };
  try {
    return await requestScope.run(scope, fn);
  } finally {
    // Timers created during the call capture this async context and can outlive
    // it (`AbortSignal.timeout` keeps its timer for the full deadline). Drop the
    // signal so they don't keep the request alive.
    scope.signal = undefined;
  }
}

export function getRequestSignal(): AbortSignal | undefined {
  return requestScope.getStore()?.signal;
}

export function getOrganizationScope(): string | undefined {
  return requestScope.getStore()?.organizationScope;
}

export function getRequestAuth(): AuthContext {
  const auth = requestScope.getStore()?.auth;
  if (!auth) {
    throw new Error("Notra API call made outside an authenticated MCP request");
  }
  return auth;
}

/** Combines a request deadline with caller and MCP request cancellation. */
export function createRequestSignal(timeoutMs: number, signal?: AbortSignal): AbortSignal {
  const signals = [AbortSignal.timeout(timeoutMs), signal, getRequestSignal()].filter(
    (candidate): candidate is AbortSignal => candidate !== undefined,
  );
  return signals.length === 1 ? signals[0] : AbortSignal.any(signals);
}
