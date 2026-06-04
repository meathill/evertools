import { describe, expect, it } from "vitest";
import {
  createAbsoluteUrl,
  createLocalizedUrl,
  getLanguageAlternates,
  getLocalizedPathname,
} from "@/lib/site";

describe("createAbsoluteUrl", () => {
  it("resolves a path against the site origin", () => {
    expect(createAbsoluteUrl("/tools/json-viewer")).toBe(
      "https://tools.meathill.com/tools/json-viewer",
    );
  });

  it("keeps the trailing slash for the root path", () => {
    expect(createAbsoluteUrl("/")).toBe("https://tools.meathill.com/");
  });
});

describe("getLocalizedPathname", () => {
  it("returns the path unchanged for the default locale", () => {
    expect(getLocalizedPathname("zh", "/tools/json-viewer")).toBe(
      "/tools/json-viewer",
    );
    expect(getLocalizedPathname("zh", "/")).toBe("/");
  });

  it("prefixes the locale for non-default locales", () => {
    expect(getLocalizedPathname("en", "/tools/json-viewer")).toBe(
      "/en/tools/json-viewer",
    );
  });

  it("maps the root path to the bare locale prefix", () => {
    expect(getLocalizedPathname("en", "/")).toBe("/en");
  });

  it("normalizes a missing leading slash", () => {
    expect(getLocalizedPathname("zh", "tools/x")).toBe("/tools/x");
    expect(getLocalizedPathname("en", "tools/x")).toBe("/en/tools/x");
  });
});

describe("createLocalizedUrl", () => {
  it("builds an absolute URL without a prefix for the default locale", () => {
    expect(createLocalizedUrl("zh", "/tools/json-viewer")).toBe(
      "https://tools.meathill.com/tools/json-viewer",
    );
  });

  it("builds an absolute URL with a locale prefix for other locales", () => {
    expect(createLocalizedUrl("en", "/tools/json-viewer")).toBe(
      "https://tools.meathill.com/en/tools/json-viewer",
    );
    expect(createLocalizedUrl("en", "/")).toBe("https://tools.meathill.com/en");
  });
});

describe("getLanguageAlternates", () => {
  it("maps every locale tag plus x-default to a localized URL", () => {
    expect(getLanguageAlternates("/tools/json-viewer")).toEqual({
      "zh-CN": "https://tools.meathill.com/tools/json-viewer",
      en: "https://tools.meathill.com/en/tools/json-viewer",
      ja: "https://tools.meathill.com/ja/tools/json-viewer",
      th: "https://tools.meathill.com/th/tools/json-viewer",
      vi: "https://tools.meathill.com/vi/tools/json-viewer",
      es: "https://tools.meathill.com/es/tools/json-viewer",
      pt: "https://tools.meathill.com/pt/tools/json-viewer",
      "x-default": "https://tools.meathill.com/tools/json-viewer",
    });
  });
});
