import { describe, expect, it } from "vitest";
import { parseHeadTags } from "@/lib/og/html";

const FULL_HTML = `<!doctype html>
<html>
<head>
  <title>  Example Page  </title>
  <meta name="description" content="A description" />
  <link rel="canonical" href="/canonical-path" />
  <link rel="icon" href="/favicon.png" />
  <meta property="og:title" content="OG Title" />
  <meta property="og:description" content="OG Desc" />
  <meta property="og:image" content="/images/card.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Alt text" />
  <meta property="og:url" content="https://example.com/page" />
  <meta property="og:site_name" content="Example" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="TW Title" />
  <meta name="twitter:image" content="https://cdn.example.com/tw.png" />
</head>
<body><p>ignored</p></body>
</html>`;

describe("parseHeadTags", () => {
  it("extracts og, twitter, title, canonical and favicon", () => {
    const tags = parseHeadTags(FULL_HTML, "https://example.com/blog/post");

    expect(tags.title).toBe("Example Page");
    expect(tags.description).toBe("A description");
    expect(tags.og.title).toBe("OG Title");
    expect(tags.og.description).toBe("OG Desc");
    expect(tags.og.imageWidth).toBe(1200);
    expect(tags.og.imageHeight).toBe(630);
    expect(tags.og.imageAlt).toBe("Alt text");
    expect(tags.og.siteName).toBe("Example");
    expect(tags.twitter.card).toBe("summary_large_image");
    expect(tags.twitter.title).toBe("TW Title");
  });

  it("resolves relative urls against the base url", () => {
    const tags = parseHeadTags(FULL_HTML, "https://example.com/blog/post");

    expect(tags.og.image).toBe("https://example.com/images/card.png");
    expect(tags.canonical).toBe("https://example.com/canonical-path");
    expect(tags.favicon).toBe("https://example.com/favicon.png");
  });

  it("keeps absolute twitter image urls intact", () => {
    const tags = parseHeadTags(FULL_HTML, "https://example.com/");
    expect(tags.twitter.image).toBe("https://cdn.example.com/tw.png");
  });

  it("returns undefined for missing tags and falls back to /favicon.ico", () => {
    const tags = parseHeadTags(
      "<html><head><title>Only Title</title></head></html>",
      "https://site.test/x/y",
    );

    expect(tags.title).toBe("Only Title");
    expect(tags.og.image).toBeUndefined();
    expect(tags.og.title).toBeUndefined();
    expect(tags.twitter.card).toBeUndefined();
    expect(tags.favicon).toBe("https://site.test/favicon.ico");
  });

  it("ignores meta tags with empty content", () => {
    const tags = parseHeadTags(
      '<html><head><meta property="og:title" content="" /></head></html>',
      "https://site.test/",
    );
    expect(tags.og.title).toBeUndefined();
  });
});
