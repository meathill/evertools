import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  getConversionPageCopy,
  getConversionTool,
} from "@/lib/conversion-content";
import {
  CONVERSION_PAIRS,
  conversionFormatLabel,
  conversionNoteKeys,
  conversionOutputFormat,
  conversionSlug,
  parseConversionSlug,
} from "@/lib/conversions";
import { getLocaleContent } from "@/messages";

const LOCALES = ["zh", "en", "ja", "es", "pt", "th", "vi"] as const;
const TARGETS = ["jpg", "png", "webp"];

describe("conversion pairs", () => {
  it("keeps every pair unique, non-identity and encodable by canvas", () => {
    const slugs = CONVERSION_PAIRS.map(conversionSlug);

    expect(new Set(slugs).size).toBe(CONVERSION_PAIRS.length);

    for (const pair of CONVERSION_PAIRS) {
      expect(pair.from).not.toBe(pair.to);
      expect(TARGETS).toContain(pair.to);
    }
  });

  it("round-trips slug parsing", () => {
    for (const pair of CONVERSION_PAIRS) {
      expect(parseConversionSlug(conversionSlug(pair))).toEqual(pair);
    }
  });

  it("returns null for unknown or malformed slugs", () => {
    expect(parseConversionSlug("heic-to-heic")).toBeNull();
    expect(parseConversionSlug("png-to-gif")).toBeNull();
    expect(parseConversionSlug("jpg-to-avif")).toBeNull();
    expect(parseConversionSlug("not-a-pair")).toBeNull();
    expect(parseConversionSlug("")).toBeNull();
  });

  it("maps targets to output MIME types", () => {
    expect(conversionOutputFormat("jpg")).toBe("image/jpeg");
    expect(conversionOutputFormat("png")).toBe("image/png");
    expect(conversionOutputFormat("webp")).toBe("image/webp");
  });

  it("labels formats for display", () => {
    expect(conversionFormatLabel("heic")).toBe("HEIC");
    expect(conversionFormatLabel("jpg")).toBe("JPG");
    expect(conversionFormatLabel("webp")).toBe("WebP");
    expect(conversionFormatLabel("avif")).toBe("AVIF");
  });

  it("offers every decode-only source against all three targets", () => {
    for (const from of ["heic", "avif", "gif", "bmp"]) {
      const targets = CONVERSION_PAIRS.filter((pair) => pair.from === from).map(
        (pair) => pair.to,
      );

      expect([...targets].sort()).toEqual(["jpg", "png", "webp"]);
    }
  });
});

describe("conversionNoteKeys", () => {
  it("derives caveats from format traits", () => {
    expect(conversionNoteKeys({ from: "png", to: "jpg" })).toEqual([
      "alphaLoss",
      "sizeGain",
      "qualityControl",
    ]);
    expect(conversionNoteKeys({ from: "jpg", to: "png" })).toEqual([
      "upconvert",
      "losslessOutput",
    ]);
    expect(conversionNoteKeys({ from: "gif", to: "png" })).toEqual([
      "animationLoss",
      "losslessOutput",
    ]);
    expect(conversionNoteKeys({ from: "heic", to: "webp" })).toEqual([
      "heicDecode",
      "qualityControl",
    ]);
  });

  it("never leaves a landing page without a caveat", () => {
    for (const pair of CONVERSION_PAIRS) {
      expect(conversionNoteKeys(pair).length).toBeGreaterThan(0);
    }
  });

  it("keeps mutually exclusive caveats apart", () => {
    for (const pair of CONVERSION_PAIRS) {
      const keys = conversionNoteKeys(pair);

      expect(
        keys.includes("qualityControl") && keys.includes("losslessOutput"),
      ).toBe(false);
      expect(keys.includes("upconvert") && keys.includes("sizeGain")).toBe(
        false,
      );
    }
  });
});

describe("getConversionTool", () => {
  it("interpolates labels into title, description and keywords", () => {
    const tool = getConversionTool(getLocaleContent("en"), {
      from: "heic",
      to: "jpg",
    });

    expect(tool.href).toBe("/tools/heic-to-jpg");
    expect(tool.slug).toBe("heic-to-jpg");
    expect(tool.name).toContain("HEIC");
    expect(tool.name).toContain("JPG");
    expect(tool.description).toContain("HEIC");
    expect(tool.keywords).toContain("HEIC to JPG");
  });

  it("leaves no template placeholder in any locale or pair", () => {
    const placeholder = /\{from\}|\{to\}/;

    for (const locale of LOCALES) {
      const content = getLocaleContent(locale);

      for (const pair of CONVERSION_PAIRS) {
        const tool = getConversionTool(content, pair);
        const copy = getConversionPageCopy(content, pair);
        const strings = [
          tool.name,
          tool.description,
          tool.summary,
          ...tool.keywords,
          ...tool.features,
          ...tool.steps,
          ...tool.faq.flatMap((item) => [item.question, item.answer]),
          copy.badge,
          ...copy.privacyItems,
          copy.scenarios.title,
          copy.scenarios.description,
          ...copy.scenarios.rows,
        ];

        for (const value of strings) {
          expect(value).not.toMatch(placeholder);
          expect(value.length).toBeGreaterThan(0);
        }
      }
    }
  });

  // 落地页体系的意义在于「每页讲不同的事」。整段复用会被判重复内容，
  // 所以正文必须随配对变化，而不是同一段话换个格式名。
  it("gives every pair a distinct body, not just a renamed template", () => {
    const content = getLocaleContent("en");
    const bodies = CONVERSION_PAIRS.map((pair) => {
      const tool = getConversionTool(content, pair);

      return JSON.stringify([tool.features, tool.faq, tool.steps]);
    });

    expect(new Set(bodies).size).toBe(CONVERSION_PAIRS.length);
  });

  it("varies the caveat count with the pair", () => {
    const content = getLocaleContent("en");
    const counts = new Set(
      CONVERSION_PAIRS.map(
        (pair) => getConversionTool(content, pair).faq.length,
      ),
    );

    expect(counts.size).toBeGreaterThan(1);
  });

  it("keeps FAQ questions unique within a page", () => {
    for (const locale of LOCALES) {
      const content = getLocaleContent(locale);

      for (const pair of CONVERSION_PAIRS) {
        const questions = getConversionTool(content, pair).faq.map(
          (item) => item.question,
        );

        expect(new Set(questions).size).toBe(questions.length);
      }
    }
  });

  it("does not repeat the hero caveat inside the feature list", () => {
    const content = getLocaleContent("en");

    for (const pair of CONVERSION_PAIRS) {
      const copy = getConversionPageCopy(content, pair);
      const { features } = getConversionTool(content, pair);

      expect(features).not.toContain(copy.scenarios.rows[2]);
    }
  });
});

describe("getConversionPageCopy", () => {
  it("describes the source and the target separately", () => {
    const copy = getConversionPageCopy(getLocaleContent("en"), {
      from: "webp",
      to: "png",
    });

    expect(copy.badge).toBe("WebP → PNG");
    expect(copy.scenarios.rows).toHaveLength(3);
    expect(copy.scenarios.rows[0]).toContain("WebP");
    expect(copy.scenarios.rows[1]).toContain("PNG");
  });

  it("swaps the note when a format changes role", () => {
    const content = getLocaleContent("en");
    const asSource = getConversionPageCopy(content, { from: "png", to: "jpg" });
    const asTarget = getConversionPageCopy(content, { from: "jpg", to: "png" });

    expect(asSource.scenarios.rows[0]).not.toBe(asTarget.scenarios.rows[1]);
  });
});

// 转换器 ↔ 裁切器互链：裁切器页之前是孤岛，没有任何站内入口。
describe("related tools wiring", () => {
  const toolsDir = path.join(
    import.meta.dirname,
    "..",
    "app",
    "[locale]",
    "tools",
  );

  function readPage(...segments: string[]): string {
    return readFileSync(path.join(toolsDir, ...segments), "utf8");
  }

  it("exposes a non-empty related-tools title in every locale", () => {
    for (const locale of LOCALES) {
      expect(
        getLocaleContent(locale).relatedTools.title.length,
      ).toBeGreaterThan(0);
    }
  });

  it("links the converter hub, the cropper and every conversion page together", () => {
    expect(readPage("image-converter", "page.tsx")).toContain("RelatedTools");
    expect(readPage("image-cropper", "page.tsx")).toContain("RelatedTools");
    expect(readPage("[conversion]", "page.tsx")).toContain("RelatedTools");
  });

  it("keeps the free-of-charge cue in es/pt/vi landing titles", () => {
    expect(
      getConversionTool(getLocaleContent("es"), { from: "bmp", to: "jpg" })
        .name,
    ).toContain("gratis");
    expect(
      getConversionTool(getLocaleContent("pt"), { from: "bmp", to: "jpg" })
        .name,
    ).toContain("grátis");
    expect(
      getConversionTool(getLocaleContent("vi"), { from: "webp", to: "png" })
        .name,
    ).toContain("miễn phí");
  });
});

// issue #1 的回归护栏。`dynamicParams = false` 会让 prerender-manifest 中本路由的
// fallback 变成 false（FallbackMode.NOT_FOUND）；OpenNext/Cloudflare 没有磁盘缓存，
// 每次请求都是 cache MISS，Next 无从确认路径预渲染过，于是白名单 slug 也一律 404。
// 这个失效只在 workerd 运行时暴露，单测跑不到，所以在源码层面钉死。
describe("conversion route", () => {
  const routeSource = readFileSync(
    path.join(
      import.meta.dirname,
      "..",
      "app",
      "[locale]",
      "tools",
      "[conversion]",
      "page.tsx",
    ),
    "utf8",
  );

  it("never re-introduces dynamicParams = false", () => {
    expect(routeSource).not.toMatch(/^\s*export const dynamicParams/m);
  });

  it("keeps the whitelist guard that 404s unknown slugs", () => {
    expect(routeSource).toContain("parseConversionSlug");
    expect(routeSource).toContain("notFound()");
  });
});
