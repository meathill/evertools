import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildIndexNowPayload,
  INDEXNOW_KEY,
  INDEXNOW_MAX_URLS,
  indexNowKeyLocation,
} from "@/lib/indexnow";
import { buildSitemapEntries } from "@/lib/sitemap-document";

const webRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

describe("IndexNow key", () => {
  it("matches the hosted key file and the protocol charset", async () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-zA-Z0-9-]{8,128}$/);

    const hosted = await readFile(
      path.join(webRoot, "public", `${INDEXNOW_KEY}.txt`),
      "utf8",
    );

    expect(hosted).toBe(INDEXNOW_KEY);
  });

  it("submits the same URLs as the sitemap", () => {
    const payload = buildIndexNowPayload();

    expect(payload).toMatchObject({
      host: "tools.meathill.com",
      key: INDEXNOW_KEY,
      keyLocation: indexNowKeyLocation(),
    });
    expect(payload.urlList).toEqual(
      buildSitemapEntries().map((entry) => entry.url),
    );
    expect(payload.urlList.length).toBeLessThanOrEqual(INDEXNOW_MAX_URLS);
  });

  it("rejects a batch over the protocol limit", () => {
    const urls = Array.from(
      { length: INDEXNOW_MAX_URLS + 1 },
      (_, index) => `https://tools.meathill.com/p/${index}`,
    );

    expect(() => buildIndexNowPayload(urls)).toThrow(/10000/);
  });
});
