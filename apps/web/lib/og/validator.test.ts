import { describe, expect, it } from "vitest";
import {
  type CheckResult,
  type ImageFacts,
  OG_PLATFORMS,
  type ParsedTags,
  PLATFORM_SPECS,
  resolveEffectiveTags,
  validateUploadedImage,
  validateUrlResult,
} from "@/lib/og/validator";

function imageFacts(overrides: Partial<ImageFacts> = {}): ImageFacts {
  return {
    byteSize: 200 * 1024,
    filesizeKnown: true,
    format: "png",
    height: 630,
    width: 1200,
    ...overrides,
  };
}

function emptyTags(overrides: Partial<ParsedTags> = {}): ParsedTags {
  return { og: {}, twitter: {}, ...overrides };
}

function findCheck(
  checks: readonly CheckResult[],
  id: string,
): CheckResult | undefined {
  return checks.find((check) => check.id === id);
}

describe("PLATFORM_SPECS invariants", () => {
  it("covers every platform with sane numbers", () => {
    for (const platform of OG_PLATFORMS) {
      const spec = PLATFORM_SPECS[platform];
      expect(spec.requiredTags.length).toBeGreaterThan(0);
      expect(spec.maxBytes).toBeGreaterThan(0);
      expect(spec.formats.length).toBeGreaterThan(0);
      expect(spec.minWidth).toBeGreaterThan(0);
    }
  });
});

describe("resolveEffectiveTags fallback chain", () => {
  it("prefers twitter over og over document title", () => {
    const effective = resolveEffectiveTags(
      emptyTags({
        og: { title: "og" },
        title: "doc",
        twitter: { title: "tw" },
      }),
    );
    expect(effective.title).toBe("tw");
  });

  it("falls back to og and document level", () => {
    expect(resolveEffectiveTags(emptyTags({ og: { title: "og" } })).title).toBe(
      "og",
    );
    expect(resolveEffectiveTags(emptyTags({ title: "doc" })).title).toBe("doc");
  });

  it("prefers og:image, falls back to twitter:image", () => {
    expect(resolveEffectiveTags(emptyTags({ og: { image: "a" } })).image).toBe(
      "a",
    );
    expect(
      resolveEffectiveTags(emptyTags({ twitter: { image: "b" } })).image,
    ).toBe("b");
  });
});

describe("image dimension checks", () => {
  it("passes the ideal 1200x630", () => {
    const report = validateUploadedImage(imageFacts());
    expect(findCheck(report.general, "image-dimensions")?.status).toBe("pass");
  });

  it("warns when below ideal but above hard minimum", () => {
    const report = validateUploadedImage(
      imageFacts({ height: 315, width: 600 }),
    );
    expect(findCheck(report.general, "image-dimensions")?.status).toBe("warn");
  });

  it("fails when below the hard minimum", () => {
    const report = validateUploadedImage(
      imageFacts({ height: 630, width: 199 }),
    );
    expect(findCheck(report.general, "image-dimensions")?.status).toBe("fail");
  });

  it("warns and skips ratio when dimensions are unknown", () => {
    const report = validateUploadedImage(
      imageFacts({ height: null, width: null }),
    );
    expect(findCheck(report.general, "image-dimensions")?.status).toBe("warn");
    expect(findCheck(report.general, "image-ratio")).toBeUndefined();
  });
});

describe("image ratio check", () => {
  it("passes near 1.91:1", () => {
    const report = validateUploadedImage(
      imageFacts({ height: 628, width: 1200 }),
    );
    expect(findCheck(report.general, "image-ratio")?.status).toBe("pass");
  });

  it("warns on a square image", () => {
    const report = validateUploadedImage(
      imageFacts({ height: 1200, width: 1200 }),
    );
    expect(findCheck(report.general, "image-ratio")?.status).toBe("warn");
  });
});

describe("per-platform filesize and format", () => {
  it("fails twitter but passes facebook for a 6MB image", () => {
    const report = validateUploadedImage(
      imageFacts({ byteSize: 6 * 1024 * 1024 }),
    );
    const twitter = report.platforms.find((p) => p.platform === "twitter");
    const facebook = report.platforms.find((p) => p.platform === "facebook");
    expect(findCheck(twitter?.checks ?? [], "platform-filesize")?.status).toBe(
      "fail",
    );
    expect(findCheck(facebook?.checks ?? [], "platform-filesize")?.status).toBe(
      "pass",
    );
  });

  it("warns when filesize is unknown", () => {
    const report = validateUploadedImage(
      imageFacts({ byteSize: null, filesizeKnown: false }),
    );
    const facebook = report.platforms.find((p) => p.platform === "facebook");
    expect(findCheck(facebook?.checks ?? [], "platform-filesize")?.status).toBe(
      "warn",
    );
  });

  it("warns webp on linkedin but passes on facebook", () => {
    const report = validateUploadedImage(imageFacts({ format: "webp" }));
    const linkedin = report.platforms.find((p) => p.platform === "linkedin");
    const facebook = report.platforms.find((p) => p.platform === "facebook");
    expect(findCheck(linkedin?.checks ?? [], "platform-format")?.status).toBe(
      "warn",
    );
    expect(findCheck(facebook?.checks ?? [], "platform-format")?.status).toBe(
      "pass",
    );
  });
});

describe("validateUrlResult tag checks", () => {
  it("fails when required og:image and og:title are missing", () => {
    const report = validateUrlResult(emptyTags(), imageFacts());
    expect(findCheck(report.general, "tag-og-image")?.status).toBe("fail");
    expect(findCheck(report.general, "tag-title")?.status).toBe("fail");
    expect(report.overall).toBe("fail");
  });

  it("warns on missing recommended tags but passes required ones", () => {
    const report = validateUrlResult(
      emptyTags({ og: { image: "https://x/y.png", title: "Hi" } }),
      imageFacts(),
    );
    expect(findCheck(report.general, "tag-title")?.status).toBe("pass");
    expect(findCheck(report.general, "tag-og-image")?.status).toBe("pass");
    expect(findCheck(report.general, "tag-description")?.status).toBe("warn");
  });

  it("omits required-tag checks in upload mode", () => {
    const report = validateUploadedImage(imageFacts());
    for (const platform of report.platforms) {
      expect(
        findCheck(platform.checks, "platform-required-tags"),
      ).toBeUndefined();
    }
  });

  it("flags twitter required-tags when twitter:card is missing", () => {
    const report = validateUrlResult(
      emptyTags({ og: { image: "https://x/y.png", title: "Hi" } }),
      imageFacts(),
    );
    const twitter = report.platforms.find((p) => p.platform === "twitter");
    expect(
      findCheck(twitter?.checks ?? [], "platform-required-tags")?.status,
    ).toBe("fail");
  });
});
