import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CJK_FONT_CSS_FAMILY,
  ensureCjkFallbackFont,
} from "@/lib/pdf-editor/pdf-cjk-fallback";
import {
  getCjkFontBytes,
  registerCjkFontFace,
  setCjkFontBytes,
} from "@/lib/pdf-editor/pdf-fonts";

vi.mock("@/lib/pdf-editor/pdf-fonts", () => ({
  getCjkFontBytes: vi.fn(),
  registerCjkFontFace: vi.fn(async () => undefined),
  setCjkFontBytes: vi.fn(),
}));

// Mirrors the private CACHE_KEY constant in pdf-cjk-fallback.ts; there is no
// exported symbol for it, so the literal must match exactly.
const INDEXED_DB_CACHE_KEY = "noto-sans-sc-regular";

type FakeIdbRequest = {
  error: Error | null;
  onerror: (() => void) | null;
  onsuccess: (() => void) | null;
  result: unknown;
};

type FakeIdbOpenRequest = FakeIdbRequest & {
  onupgradeneeded: (() => void) | null;
};

function scheduleRequest(
  request: FakeIdbRequest,
  shouldFail: boolean,
  computeResult: () => unknown,
): void {
  queueMicrotask(() => {
    if (shouldFail) {
      request.error = new Error("fake indexeddb failure");
      request.onerror?.();
      return;
    }
    request.result = computeResult();
    request.onsuccess?.();
  });
}

function createFakeIndexedDb(
  options: { failGet?: boolean; failPut?: boolean } = {},
): { open: () => FakeIdbOpenRequest; store: Map<string, Uint8Array> } {
  const store = new Map<string, Uint8Array>();

  const objectStore = {
    get: (key: string): FakeIdbRequest => {
      const request: FakeIdbRequest = {
        error: null,
        onerror: null,
        onsuccess: null,
        result: undefined,
      };
      scheduleRequest(request, options.failGet ?? false, () => store.get(key));
      return request;
    },
    put: (value: Uint8Array, key: string): FakeIdbRequest => {
      const request: FakeIdbRequest = {
        error: null,
        onerror: null,
        onsuccess: null,
        result: undefined,
      };
      scheduleRequest(request, options.failPut ?? false, () => {
        store.set(key, value);
        return undefined;
      });
      return request;
    },
  };

  const transaction = {
    objectStore: () => objectStore,
    oncomplete: null as (() => void) | null,
  };

  const database = {
    close: () => {},
    createObjectStore: () => {},
    objectStoreNames: { contains: () => true },
    transaction: () => {
      queueMicrotask(() => transaction.oncomplete?.());
      return transaction;
    },
  };

  function open(): FakeIdbOpenRequest {
    const request: FakeIdbOpenRequest = {
      error: null,
      onerror: null,
      onsuccess: null,
      onupgradeneeded: null,
      result: database,
    };
    queueMicrotask(() => {
      request.onupgradeneeded?.();
      request.onsuccess?.();
    });
    return request;
  }

  return { open, store };
}

type FakeResponseOptions = {
  chunks: readonly Uint8Array[];
  contentLength?: number;
  ok?: boolean;
  status?: number;
  withBody?: boolean;
};

function buildFakeResponse(options: FakeResponseOptions): Response {
  const {
    chunks,
    contentLength,
    ok = true,
    status = 200,
    withBody = true,
  } = options;
  let index = 0;
  const body = withBody
    ? {
        getReader: () => ({
          read: async () => {
            if (index < chunks.length) {
              const value = chunks[index];
              index += 1;
              return { done: false, value };
            }
            return { done: true, value: undefined };
          },
        }),
      }
    : null;

  const fakeResponse = {
    body,
    headers: {
      get: (name: string) =>
        name === "content-length" && contentLength !== undefined
          ? String(contentLength)
          : null,
    },
    ok,
    status,
  };

  return fakeResponse as unknown as Response;
}

function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

beforeEach(() => {
  vi.mocked(getCjkFontBytes).mockReset().mockReturnValue(null);
  vi.mocked(setCjkFontBytes).mockReset();
  vi.mocked(registerCjkFontFace).mockReset().mockResolvedValue(undefined);
  vi.stubGlobal("indexedDB", undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("ensureCjkFallbackFont", () => {
  it("returns immediately from the in-memory cache without calling fetch", async () => {
    const cached = new Uint8Array([1, 2, 3]);
    vi.mocked(getCjkFontBytes).mockReturnValue(cached);
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await ensureCjkFallbackFont();

    expect(result).toBe(cached);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("falls back to the IndexedDB cache when the memory cache is empty and IndexedDB has an entry", async () => {
    const cachedBytes = new Uint8Array([4, 5, 6]);
    const fakeDb = createFakeIndexedDb();
    fakeDb.store.set(INDEXED_DB_CACHE_KEY, cachedBytes);
    vi.stubGlobal("indexedDB", fakeDb);
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await ensureCjkFallbackFont();

    expect(result).toEqual(cachedBytes);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(vi.mocked(setCjkFontBytes)).toHaveBeenCalledWith(result);
  });

  it("downloads from the CDN and concatenates multiple chunks in order when both caches are empty", async () => {
    const chunk1 = new Uint8Array([1, 2]);
    const chunk2 = new Uint8Array([3, 4, 5]);
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(
        buildFakeResponse({ chunks: [chunk1, chunk2], contentLength: 5 }),
      );
    vi.stubGlobal("fetch", fetchSpy);

    const result = await ensureCjkFallbackFont();

    expect(Array.from(result)).toEqual([1, 2, 3, 4, 5]);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("reports progress via onProgress proportional to content-length", async () => {
    const chunk1 = new Uint8Array([1, 2]);
    const chunk2 = new Uint8Array([3, 4, 5]);
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          buildFakeResponse({ chunks: [chunk1, chunk2], contentLength: 5 }),
        ),
    );
    const onProgress = vi.fn();

    await ensureCjkFallbackFont(onProgress);

    expect(onProgress).toHaveBeenNthCalledWith(1, 2, 5);
    expect(onProgress).toHaveBeenNthCalledWith(2, 5, 5);
  });

  it("falls back to the received byte count as the total when content-length is missing", async () => {
    const chunk = new Uint8Array([1, 2, 3]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(buildFakeResponse({ chunks: [chunk] })),
    );
    const onProgress = vi.fn();

    await ensureCjkFallbackFont(onProgress);

    expect(onProgress).toHaveBeenCalledWith(3, 3);
  });

  it("throws CJK_FONT_LOAD_FAILED when fetch itself rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );

    await expect(ensureCjkFallbackFont()).rejects.toThrow(
      /CJK_FONT_LOAD_FAILED/,
    );
  });

  it("throws CJK_FONT_LOAD_FAILED with the HTTP status in the detail when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          buildFakeResponse({ chunks: [], ok: false, status: 404 }),
        ),
    );

    await expect(ensureCjkFallbackFont()).rejects.toThrow(
      /CJK_FONT_LOAD_FAILED::HTTP 404/,
    );
  });

  it("throws CJK_FONT_LOAD_FAILED when the response has no body even though it is ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(buildFakeResponse({ chunks: [], withBody: false })),
    );

    await expect(ensureCjkFallbackFont()).rejects.toThrow(
      /CJK_FONT_LOAD_FAILED/,
    );
  });

  it("writes the downloaded bytes to IndexedDB best-effort after a successful download", async () => {
    const fakeDb = createFakeIndexedDb();
    vi.stubGlobal("indexedDB", fakeDb);
    const chunk = new Uint8Array([7, 8, 9]);
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          buildFakeResponse({ chunks: [chunk], contentLength: 3 }),
        ),
    );

    await ensureCjkFallbackFont();
    await flushMicrotasks();

    expect(fakeDb.store.get(INDEXED_DB_CACHE_KEY)).toEqual(chunk);
  });

  it("swallows an IndexedDB write failure without rejecting ensureCjkFallbackFont", async () => {
    const fakeDb = createFakeIndexedDb({ failPut: true });
    vi.stubGlobal("indexedDB", fakeDb);
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          buildFakeResponse({
            chunks: [new Uint8Array([1])],
            contentLength: 1,
          }),
        ),
    );

    await expect(ensureCjkFallbackFont()).resolves.toBeInstanceOf(Uint8Array);
  });

  it("registers the CJK font face with the fixed CSS family constant after an IndexedDB cache hit", async () => {
    const cachedBytes = new Uint8Array([1]);
    const fakeDb = createFakeIndexedDb();
    fakeDb.store.set(INDEXED_DB_CACHE_KEY, cachedBytes);
    vi.stubGlobal("indexedDB", fakeDb);

    await ensureCjkFallbackFont();

    expect(vi.mocked(registerCjkFontFace)).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      CJK_FONT_CSS_FAMILY,
    );
  });

  it("registers the CJK font face with the fixed CSS family constant after a download", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          buildFakeResponse({
            chunks: [new Uint8Array([1])],
            contentLength: 1,
          }),
        ),
    );

    await ensureCjkFallbackFont();

    expect(vi.mocked(registerCjkFontFace)).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      CJK_FONT_CSS_FAMILY,
    );
  });
});
