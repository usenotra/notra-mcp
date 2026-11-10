import { createInterface } from "node:readline";
import { MCP_STDIO_URL } from "../constants/http.js";
import type { NotraMcpServer } from "../types/server.js";

type JsonRpcMessage = {
  id?: string | number | null;
  method?: string;
  params?: { requestId?: string | number };
  result?: { protocolVersion?: unknown };
};

async function readMessages(response: Response): Promise<JsonRpcMessage[]> {
  const body = await response.text();
  if (!body.trim()) {
    return [];
  }
  if (response.headers.get("content-type")?.includes("text/event-stream")) {
    return body
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => JSON.parse(line.slice(5)) as JsonRpcMessage);
  }
  const parsed = JSON.parse(body) as JsonRpcMessage | JsonRpcMessage[];
  return [parsed].flat();
}

export function serveStdio(server: NotraMcpServer, headers: Record<string, string>): void {
  const inFlight = new Map<string | number, AbortController>();
  let protocolVersion: string | undefined;

  const write = (message: unknown) => {
    process.stdout.write(`${JSON.stringify(message)}\n`);
  };

  const forward = async (line: string) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      write({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error: invalid JSON" } });
      return;
    }
    if (typeof parsed !== "object" || parsed === null) {
      write({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "Invalid request" } });
      return;
    }
    const message = parsed as JsonRpcMessage;

    if (message.method === "notifications/cancelled" && message.params?.requestId !== undefined) {
      inFlight.get(message.params.requestId)?.abort();
      return;
    }

    const id = message.id ?? undefined;
    const controller = new AbortController();
    if (id !== undefined) inFlight.set(id, controller);
    try {
      const response = await server.fetch(
        new Request(MCP_STDIO_URL, {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
            ...(protocolVersion ? { "MCP-Protocol-Version": protocolVersion } : {}),
          },
          body: line,
          signal: controller.signal,
        }),
      );
      for (const reply of await readMessages(response)) {
        if (message.method === "initialize" && typeof reply.result?.protocolVersion === "string") {
          protocolVersion = reply.result.protocolVersion;
        }
        write(reply);
      }
    } catch (error) {
      if (id !== undefined && !controller.signal.aborted) {
        write({
          jsonrpc: "2.0",
          id,
          error: { code: -32603, message: error instanceof Error ? error.message : "Internal error" },
        });
      }
    } finally {
      if (id !== undefined) inFlight.delete(id);
    }
  };

  createInterface({ input: process.stdin, crlfDelay: Infinity })
    .on("line", (line) => {
      if (!line.trim()) return;
      forward(line).catch((error: unknown) => {
        console.error("MCP stdio error:", error);
      });
    })
    .on("close", () => process.exit(0));
}
