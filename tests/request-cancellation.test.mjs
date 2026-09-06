import { createServer } from "node:http";
import { once } from "node:events";
import { expect, onTestFinished, test, vi } from "vitest";
import { NotraClient } from "../src/notra-client.ts";

test.each([
  { operation: "JSON", phase: "headers", timeout: 30_000 },
  { operation: "JSON", phase: "body", timeout: 30_000 },
  { operation: "chat", phase: "headers", timeout: 180_000 },
  { operation: "chat", phase: "body", timeout: 180_000 },
  { operation: "sequence", phase: "headers", timeout: 300_000 },
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
