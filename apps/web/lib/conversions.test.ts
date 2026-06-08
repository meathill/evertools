import { describe, expect, it } from "vitest";
import {
  CONVERSION_PAIRS,
  conversionFormatLabel,
  conversionOutputFormat,
  conversionSlug,
  parseConversionSlug,
} from "@/lib/conversions";
import { getConversionTool } from "@/lib/content";
import { getLocaleContent } from "@/messages";

const LOCALES = ["zh", "en", "ja", "es", "pt", "th", "vi"] as const;

describe("conversion pairs", () => {
  it("has 9 unique pairs without identity or HEIC output", () => {
    const slugs = CONVERSION_PAIRS.map(conversionSlug);

    expect(CONVERSION_PAIRS).toHaveLength(9);
    expect(new Set(slugs).size).toBe(9);

    for (const pair of CONVERSION_PAIRS) {
      expect(pair.from).not.toBe(pair.to);
      expect(pair.to).not.toBe("heic");
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
  });

  it("offers HEIC as a source for all three raster targets", () => {
    const heicTargets = CONVERSION_PAIRS.filter(
      (pair) => pair.from === "heic",
    ).map((pair) => pair.to);

    expect([...heicTargets].sort()).toEqual(["jpg", "png", "webp"]);
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

  it("reuses the image converter body (features/steps/faq)", () => {
    const content = getLocaleContent("en");
    const tool = getConversionTool(content, { from: "png", to: "webp" });

    expect(tool.features).toBe(content.imageConverter.tool.features);
    expect(tool.steps).toBe(content.imageConverter.tool.steps);
    expect(tool.faq).toBe(content.imageConverter.tool.faq);
  });

  it("leaves no template placeholders in any locale", () => {
    for (const locale of LOCALES) {
      const tool = getConversionTool(getLocaleContent(locale), {
        from: "webp",
        to: "png",
      });

      expect(tool.name).not.toMatch(/\{from\}|\{to\}/);
      expect(tool.description).not.toMatch(/\{from\}|\{to\}/);
      for (const keyword of tool.keywords) {
        expect(keyword).not.toMatch(/\{from\}|\{to\}/);
      }
    }
  });
});
