import { describe, expect, it } from "vitest";
import {
  type CheckResult,
  parseSitemapXml,
  SITEMAP_LIMITS,
  validateSitemap,
} from "@/lib/sitemap/validator";

function findCheck(
  checks: readonly CheckResult[],
  id: string,
): CheckResult | undefined {
  return checks.find((check) => check.id === id);
}

function urlset(urls: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

describe("parseSitemapXml", () => {
  it("recognizes a urlset document", () => {
    const parsed = parseSitemapXml(
      urlset("<url><loc>https://example.com/</loc></url>"),
    );
    expect(parsed.rootType).toBe("urlset");
    expect(parsed.entries).toHaveLength(1);
    expect(parsed.entries[0].loc).toBe("https://example.com/");
  });

  it("recognizes a sitemapindex document", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://example.com/sitemap-1.xml</loc></sitemap>
</sitemapindex>`;
    const parsed = parseSitemapXml(xml);
    expect(parsed.rootType).toBe("sitemapindex");
    expect(parsed.entries).toHaveLength(1);
  });

  it("falls back to unknown when no recognizable root exists", () => {
    expect(parseSitemapXml("<rss></rss>").rootType).toBe("unknown");
  });
});

describe("validateSitemap general checks", () => {
  it("passes a well-formed sitemap with no issues", () => {
    const xml = urlset(
      `<url>
        <loc>https://example.com/</loc>
        <lastmod>2026-01-01</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
      </url>`,
    );
    const report = validateSitemap(xml, { byteSize: xml.length });
    expect(report.overall).toBe("pass");
    expect(report.rootType).toBe("urlset");
    expect(report.entryCount).toBe(1);
    expect(report.totalIssueCount).toBe(0);
    expect(findCheck(report.general, "root-element")?.status).toBe("pass");
  });

  it("fails when no urlset/sitemapindex root is found", () => {
    const report = validateSitemap("<rss></rss>", { byteSize: 10 });
    expect(report.overall).toBe("fail");
    expect(findCheck(report.general, "root-element")?.status).toBe("fail");
  });

  it("warns when a urlset has zero entries", () => {
    const report = validateSitemap(urlset(""), { byteSize: 50 });
    expect(findCheck(report.general, "entry-count-zero")?.status).toBe("warn");
  });

  it("flags duplicate <loc> entries", () => {
    const xml = urlset(
      "<url><loc>https://example.com/a</loc></url><url><loc>https://example.com/a</loc></url>",
    );
    const report = validateSitemap(xml, { byteSize: xml.length });
    const check = findCheck(report.general, "duplicate-locs");
    expect(check?.status).toBe("warn");
    expect(check?.values?.count).toBe(1);
  });

  it("fails when entry count exceeds the protocol limit", () => {
    const urls = Array.from(
      { length: SITEMAP_LIMITS.maxEntries + 1 },
      (_, i) => `<url><loc>https://example.com/${i}</loc></url>`,
    ).join("");
    const xml = urlset(urls);
    const report = validateSitemap(xml, { byteSize: xml.length });
    expect(findCheck(report.general, "entry-count-limit")?.status).toBe("fail");
  });

  it("fails when byte size exceeds the protocol limit", () => {
    const xml = urlset("<url><loc>https://example.com/</loc></url>");
    const report = validateSitemap(xml, {
      byteSize: SITEMAP_LIMITS.maxBytes + 1,
    });
    expect(findCheck(report.general, "byte-size-limit")?.status).toBe("fail");
  });

  it("warns when content was truncated by the fetch cap", () => {
    const xml = urlset("<url><loc>https://example.com/</loc></url>");
    const report = validateSitemap(xml, {
      byteSize: xml.length,
      truncated: true,
    });
    expect(findCheck(report.general, "content-truncated")?.status).toBe("warn");
  });

  it("reports gzip sitemaps as unsupported without parsing", () => {
    const report = validateSitemap("", { byteSize: 100, isGzip: true });
    expect(report.overall).toBe("fail");
    expect(findCheck(report.general, "gzip-unsupported")?.status).toBe("fail");
    expect(report.rootType).toBe("unknown");
  });
});

describe("validateSitemap entry-level checks", () => {
  it("fails entries missing <loc>", () => {
    const xml = urlset("<url><lastmod>2026-01-01</lastmod></url>");
    const report = validateSitemap(xml, { byteSize: xml.length });
    expect(report.issues).toHaveLength(1);
    expect(findCheck(report.issues[0].checks, "loc-missing")?.status).toBe(
      "fail",
    );
  });

  it("fails entries with a non-absolute <loc>", () => {
    const xml = urlset("<url><loc>/relative/path</loc></url>");
    const report = validateSitemap(xml, { byteSize: xml.length });
    expect(findCheck(report.issues[0].checks, "loc-invalid")?.status).toBe(
      "fail",
    );
  });

  it("warns on invalid <lastmod>", () => {
    const xml = urlset(
      "<url><loc>https://example.com/</loc><lastmod>not-a-date</lastmod></url>",
    );
    const report = validateSitemap(xml, { byteSize: xml.length });
    expect(findCheck(report.issues[0].checks, "lastmod-invalid")?.status).toBe(
      "warn",
    );
  });

  it("warns on out-of-range <priority>", () => {
    const xml = urlset(
      "<url><loc>https://example.com/</loc><priority>1.5</priority></url>",
    );
    const report = validateSitemap(xml, { byteSize: xml.length });
    expect(findCheck(report.issues[0].checks, "priority-invalid")?.status).toBe(
      "warn",
    );
  });

  it("warns on unrecognized <changefreq>", () => {
    const xml = urlset(
      "<url><loc>https://example.com/</loc><changefreq>often</changefreq></url>",
    );
    const report = validateSitemap(xml, { byteSize: xml.length });
    expect(
      findCheck(report.issues[0].checks, "changefreq-invalid")?.status,
    ).toBe("warn");
  });

  it("caps the sample issue list and reports the real total", () => {
    const urls = Array.from(
      { length: SITEMAP_LIMITS.maxSampleIssues + 5 },
      () => "<url></url>",
    ).join("");
    const xml = urlset(urls);
    const report = validateSitemap(xml, { byteSize: xml.length });
    expect(report.issues).toHaveLength(SITEMAP_LIMITS.maxSampleIssues);
    expect(report.totalIssueCount).toBe(SITEMAP_LIMITS.maxSampleIssues + 5);
  });
});

describe("validateSitemap sitemapindex", () => {
  it("validates child sitemap <loc> entries without recursing", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://example.com/sitemap-1.xml</loc></sitemap>
  <sitemap><loc>not-a-url</loc></sitemap>
</sitemapindex>`;
    const report = validateSitemap(xml, { byteSize: xml.length });
    expect(report.rootType).toBe("sitemapindex");
    expect(report.entryCount).toBe(2);
    expect(report.issues).toHaveLength(1);
    expect(findCheck(report.issues[0].checks, "loc-invalid")).toBeDefined();
  });
});
