import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { getTools } from "@/lib/content";
import { CONVERSION_PAIRS } from "@/lib/conversions";
import { buildSitemapEntries, renderSitemapXml } from "@/lib/sitemap-document";
import { getLocaleContent } from "@/messages";

const webRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

describe("buildSitemapEntries", () => {
  it("covers every locale home, tool, and conversion page once", () => {
    const entries = buildSitemapEntries();
    const perLocale =
      1 + getTools(getLocaleContent("zh")).length + CONVERSION_PAIRS.length;

    expect(new Set(entries.map((entry) => entry.url)).size).toBe(
      entries.length,
    );
    expect(entries).toHaveLength(routing.locales.length * perLocale);
    expect(entries[0]).toMatchObject({
      priority: 1,
      url: "https://tools.meathill.com/",
    });
    expect(entries.at(-1)?.url).toBe(
      "https://tools.meathill.com/pt/tools/webp-to-jpg",
    );
  });
});

describe("renderSitemapXml", () => {
  it("omits lastmod and escapes loc text", () => {
    const xml = renderSitemapXml([
      {
        changeFrequency: "weekly",
        priority: 0.5,
        url: "https://tools.meathill.com/a?b=1&c=2",
      },
    ]);

    expect(xml).not.toContain("<lastmod>");
    expect(xml).toContain(
      "<loc>https://tools.meathill.com/a?b=1&amp;c=2</loc>",
    );
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it("matches the committed public/sitemap.xml", async () => {
    const committed = await readFile(
      path.join(webRoot, "public/sitemap.xml"),
      "utf8",
    );

    expect(committed).toBe(renderSitemapXml(buildSitemapEntries()));
  });
});
