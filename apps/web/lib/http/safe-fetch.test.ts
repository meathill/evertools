import { describe, expect, it } from "vitest";
import { HttpError } from "@/lib/http/response";
import {
  assertSafeUrl,
  isBlockedHostname,
  safeFetch,
} from "@/lib/http/safe-fetch";

describe("isBlockedHostname", () => {
  const blocked = [
    "localhost",
    "app.localhost",
    "127.0.0.1",
    "10.0.0.1",
    "172.16.5.4",
    "172.31.255.255",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "::1",
    "fe80::1",
    "fc00::1",
    "fd12:3456::1",
    "::ffff:127.0.0.1",
    "[::1]",
    "224.0.0.1",
  ];
  const allowed = [
    "example.com",
    "8.8.8.8",
    "1.1.1.1",
    "172.32.0.1",
    "172.15.0.1",
    "tools.meathill.com",
    "2001:4860:4860::8888",
  ];

  it.each(blocked)("blocks %s", (host) => {
    expect(isBlockedHostname(host)).toBe(true);
  });

  it.each(allowed)("allows %s", (host) => {
    expect(isBlockedHostname(host)).toBe(false);
  });
});

describe("assertSafeUrl", () => {
  it("rejects non-http(s) schemes", () => {
    expect(() => assertSafeUrl("ftp://example.com")).toThrow(HttpError);
    expect(() => assertSafeUrl("file:///etc/passwd")).toThrow(HttpError);
  });

  it("rejects malformed urls", () => {
    expect(() => assertSafeUrl("not a url")).toThrow(/INVALID_URL/);
  });

  it("rejects private and metadata hosts", () => {
    expect(() =>
      assertSafeUrl("http://169.254.169.254/latest/meta-data/"),
    ).toThrow(/BLOCKED_HOST/);
    expect(() => assertSafeUrl("http://localhost:3000")).toThrow(
      /BLOCKED_HOST/,
    );
  });

  it("accepts public https urls", () => {
    expect(assertSafeUrl("https://example.com/page").hostname).toBe(
      "example.com",
    );
  });
});

function textResponse(body: string, init?: ResponseInit): Response {
  return new Response(body, init);
}

function redirectResponse(location: string, status = 302): Response {
  return new Response(null, { headers: { location }, status });
}

function fakeFetch(handler: (url: string) => Response): typeof fetch {
  return (async (input: RequestInfo | URL) =>
    handler(String(input))) as typeof fetch;
}

describe("safeFetch", () => {
  it("returns body bytes for a 200 response", async () => {
    const result = await safeFetch(
      "https://example.com",
      {},
      fakeFetch(() => textResponse("hello", { status: 200 })),
    );
    expect(new TextDecoder().decode(result.bytes)).toBe("hello");
    expect(result.finalUrl).toBe("https://example.com/");
    expect(result.status).toBe(200);
  });

  it("follows redirects to a public url and re-validates each hop", async () => {
    const calls: string[] = [];
    const result = await safeFetch(
      "https://example.com",
      {},
      fakeFetch((url) => {
        calls.push(url);
        return url === "https://example.com/"
          ? redirectResponse("https://example.com/final")
          : textResponse("done", { status: 200 });
      }),
    );
    expect(result.finalUrl).toBe("https://example.com/final");
    expect(new TextDecoder().decode(result.bytes)).toBe("done");
    expect(calls).toEqual([
      "https://example.com/",
      "https://example.com/final",
    ]);
  });

  it("blocks a redirect that points at a private ip", async () => {
    await expect(
      safeFetch(
        "https://example.com",
        {},
        fakeFetch((url) =>
          url === "https://example.com/"
            ? redirectResponse("http://169.254.169.254/")
            : textResponse("unreachable", { status: 200 }),
        ),
      ),
    ).rejects.toThrow(/BLOCKED_HOST/);
  });

  it("throws after exceeding the redirect cap", async () => {
    await expect(
      safeFetch(
        "https://example.com",
        { maxRedirects: 2 },
        fakeFetch(() => redirectResponse("https://example.com/loop")),
      ),
    ).rejects.toThrow(/TOO_MANY_REDIRECTS/);
  });

  it("caps the body at maxBytes", async () => {
    const result = await safeFetch(
      "https://example.com",
      { maxBytes: 100 },
      fakeFetch(() => textResponse("x".repeat(1000), { status: 200 })),
    );
    expect(result.bytes.byteLength).toBe(100);
  });

  it("maps aborts to FETCH_TIMEOUT", async () => {
    await expect(
      safeFetch("https://example.com", {}, (async () => {
        throw Object.assign(new Error("aborted"), { name: "AbortError" });
      }) as typeof fetch),
    ).rejects.toThrow(/FETCH_TIMEOUT/);
  });

  it("maps unknown network errors to FETCH_FAILED", async () => {
    await expect(
      safeFetch("https://example.com", {}, (async () => {
        throw new Error("ECONNRESET");
      }) as typeof fetch),
    ).rejects.toThrow(/FETCH_FAILED/);
  });
});
