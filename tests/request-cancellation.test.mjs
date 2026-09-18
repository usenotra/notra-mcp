import { createServer } from "node:http";
import { once } from "node:events";
import { expect, onTestFinished, test, vi } from "vitest";
import { NotraClient } from "../src/notra-client.ts";
import { loadGeoSnapshot } from "../src/utils/geo-snapshot.ts";
import { getRequestSignal, runWithRequestSignal } from "../src/utils/request-signal.ts";

async function listen(handler) {
  const server = createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  onTestFinished(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  );
  return `http://127.0.0.1:${server.address().port}`;
}

test.each([
  { operation: "JSON", phase: "headers", timeout: 30_000 },
  { operation: "JSON", phase: "body", timeout: 30_000 },
  { operation: "chat", phase: "headers", timeout: 180_000 },
  { operation: "chat", phase: "body", timeout: 180_000 },
  { operation: "sequence", phase: "headers", timeout: 300_000 },
  { operation: "snapshot optional", phase: "headers", timeout: 5_000 },
])("$operation cancels a request stalled at $phase", async ({ operation, phase, timeout }) => {
  let received;
  const requestReceived = new Promise((resolve) => {
    received = resolve;
  });
  let disconnected;
  const requestDisconnected = new Promise((resolve) => {
    disconnected = resolve;
  });
  const server = createServer((_req, res) => {
    res.on("close", disconnected);
    if (phase === "body") {
      res.writeHead(200, { "content-type": operation === "chat" ? "text/event-stream" : "application/json" });
      res.flushHeaders();
      res.write(operation === "chat" ? 'data: {"type":"text-delta","delta":"partial"}\n' : '{"posts":');
    }
    received();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  onTestFinished(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  );

  // Start the real timeout once the local server receives the request. This keeps
  // connection setup out of the deadline without waiting 30–300 seconds per case.
  const nativeTimeout = AbortSignal.timeout.bind(AbortSignal);
  const controller = new AbortController();
  const deadline = vi.spyOn(AbortSignal, "timeout").mockReturnValue(controller.signal);
  const nativeFetch = globalThis.fetch;
  let responseReturned;
  const responseReceived = new Promise((resolve) => {
    responseReturned = resolve;
  });
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async (...args) => {
    const response = await nativeFetch(...args);
    responseReturned();
    return response;
  });
  const client = new NotraClient("test-token", `http://127.0.0.1:${server.address().port}`);
  const request =
    operation === "JSON"
      ? client.listPosts()
      : operation === "chat"
        ? client.createChat({ message: "Hello" })
        : operation === "snapshot optional"
          ? client.getGeoChanges("project", { timeoutMs: timeout })
          : client.runGeoSequence("project", "sequence");
  const rejected = expect(request).rejects.toThrow(`Notra API request timed out after ${timeout / 1000}s`);
  await requestReceived;
  if (phase === "body") await responseReceived;
  expect(deadline).toHaveBeenCalledWith(timeout);
  expect(fetch.mock.calls[0][1].signal).toBe(controller.signal);
  const signal = nativeTimeout(20);
  signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  await rejected;
  await requestDisconnected;
  expect(controller.signal.aborted).toBe(true);
});

test.each(["JSON", "chat"])("MCP request cancellation disconnects the upstream %s request", async (operation) => {
  const disconnects = [];
  let received;
  const requestReceived = new Promise((resolve) => {
    received = resolve;
  });
  const baseUrl = await listen((_req, res) => {
    const started = Date.now();
    res.on("close", () => disconnects.push(Date.now() - started));
    received();
  });
  const client = new NotraClient("test-token", baseUrl);
  const controller = new AbortController();
  const request = runWithRequestSignal(controller.signal, () =>
    operation === "JSON" ? client.listPosts() : client.createChat({ message: "Hello" }),
  );
  const rejected = expect(request).rejects.toThrow("Notra API request was cancelled");
  await requestReceived;
  controller.abort();
  await rejected;
  await vi.waitFor(() => expect(disconnects).toHaveLength(1));
  expect(disconnects[0]).toBeLessThan(1_000);
});

test("cancellation while reading the body is reported as cancelled, not as a parse error", async () => {
  let received;
  const requestReceived = new Promise((resolve) => {
    received = resolve;
  });
  const baseUrl = await listen((_req, res) => {
    res.writeHead(200, { "content-type": "application/json" });
    res.flushHeaders();
    res.write('{"posts":'); // Partial body; never completed.
    received();
  });
  const client = new NotraClient("test-token", baseUrl);
  const controller = new AbortController();
  const request = runWithRequestSignal(controller.signal, () => client.listPosts());
  const rejected = expect(request).rejects.toThrow("Notra API request was cancelled");
  await requestReceived;
  controller.abort();
  await rejected;
});

test("snapshot aborts optional sections when the overview fails", async () => {
  const optional = { started: 0, disconnected: 0, completed: 0 };
  const baseUrl = await listen((req, res) => {
    if (req.url.includes("/visibility/overview")) {
      // Let the optional requests reach the server before failing.
      setTimeout(
        () => res.writeHead(404, { "content-type": "application/json" }).end('{"error":"Project not found"}'),
        50,
      );
      return;
    }
    optional.started += 1;
    res.on("close", () => {
      if (!res.writableEnded) optional.disconnected += 1;
    });
    setTimeout(() => {
      if (!res.destroyed) {
        optional.completed += 1;
        res.end("{}");
      }
    }, 3_000);
  });
  const client = new NotraClient("test-token", baseUrl);
  const started = performance.now();
  await expect(loadGeoSnapshot(client, "missing", {})).rejects.toThrow("Project not found");
  expect(performance.now() - started).toBeLessThan(1_000);
  await vi.waitFor(() => expect(optional.disconnected).toBe(7));
  expect(optional).toEqual({ started: 7, disconnected: 7, completed: 0 });
});

test("async work that outlives a tool call no longer holds its request signal", async () => {
  // AbortSignal.timeout and similar timers capture the async context for their full
  // deadline; holding the signal there kept each per-request server alive for 30s.
  const controller = new AbortController();
  let during;
  let afterHandler;
  await runWithRequestSignal(controller.signal, async () => {
    during = getRequestSignal();
    afterHandler = new Promise((resolve) => setTimeout(() => resolve(getRequestSignal()), 10));
  });
  expect(during).toBe(controller.signal);
  expect(await afterHandler).toBeUndefined();
});
