import { afterEach, describe, expect, it, vi } from "vitest";
import { NotraClient } from "./notra-client.js";

function stubFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function okResponse() {
  return new Response(JSON.stringify({}), { status: 200 });
}

function requestedUrl(fetchMock: ReturnType<typeof vi.fn>): URL {
  return new URL(fetchMock.mock.calls[0][0] as string);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("NotraClient query serialization", () => {
  it("comma-joins brandIdentityId arrays", async () => {
    const fetchMock = stubFetch(okResponse());
    const client = new NotraClient("test-token");

    await client.listPosts({ brandIdentityId: ["a", "b"] });

    const url = requestedUrl(fetchMock);
    expect(url.search).toContain("brandIdentityId=a%2Cb");
    expect(url.searchParams.getAll("brandIdentityId")).toEqual(["a,b"]);
  });

  it("comma-joins repositoryIds arrays", async () => {
    const fetchMock = stubFetch(okResponse());
    const client = new NotraClient("test-token");

    await client.listSchedules({ repositoryIds: ["x", "y"] });

    const url = requestedUrl(fetchMock);
    expect(url.search).toContain("repositoryIds=x%2Cy");
    expect(url.searchParams.getAll("repositoryIds")).toEqual(["x,y"]);
  });

  it("comma-joins status arrays", async () => {
    const fetchMock = stubFetch(okResponse());
    const client = new NotraClient("test-token");

    await client.listPosts({ status: ["draft", "published"] });

    const url = requestedUrl(fetchMock);
    expect(url.search).toContain("status=draft%2Cpublished");
    expect(url.searchParams.getAll("status")).toEqual(["draft,published"]);
  });

  it("comma-joins contentType arrays", async () => {
    const fetchMock = stubFetch(okResponse());
    const client = new NotraClient("test-token");

    await client.listPosts({ contentType: ["blog_post", "changelog"] });

    const url = requestedUrl(fetchMock);
    expect(url.search).toContain("contentType=blog_post%2Cchangelog");
    expect(url.searchParams.getAll("contentType")).toEqual(["blog_post,changelog"]);
  });
});

describe("NotraClient error mapping", () => {
  it("rejects with the API-provided message on a non-ok JSON response", async () => {
    stubFetch(new Response(JSON.stringify({ message: "Nope" }), { status: 400 }));
    const client = new NotraClient("test-token");

    await expect(client.listPosts()).rejects.toThrow("Nope");
  });

  it("rejects with an HTTP status message on a non-JSON non-ok response", async () => {
    stubFetch(new Response("not json", { status: 502, statusText: "Bad Gateway" }));
    const client = new NotraClient("test-token");

    await expect(client.listPosts()).rejects.toThrow("HTTP 502");
  });
});
