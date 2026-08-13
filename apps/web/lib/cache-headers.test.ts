import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { OG_IMAGE_CACHE_CONTROL, OG_IMAGE_CACHE_RULE } from "./cache-headers";

const webRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

describe("public/_headers", () => {
  it("为 /_next/static/* 设置一年 immutable 缓存，避免浏览器重复验证未变更 chunk", async () => {
    const content = await readFile(
      path.join(webRoot, "public/_headers"),
      "utf8",
    );
    expect(content).toMatch(
      /^\/_next\/static\/\*\s*\n\s*Cache-Control:\s*public,max-age=31536000,immutable\s*$/m,
    );
  });
});

describe("OG 图片缓存", () => {
  it("缓存头匹配文案低频更新节奏（1 天 + 7 天 SWR），不能用 immutable", () => {
    expect(OG_IMAGE_CACHE_CONTROL).not.toContain("immutable");
    expect(OG_IMAGE_CACHE_CONTROL).toMatch(/max-age=86400/);
    expect(OG_IMAGE_CACHE_CONTROL).toMatch(/stale-while-revalidate=604800/);
  });

  it("只命中 opengraph-image 路由，不波及 API 与普通页面", () => {
    const pattern = OG_IMAGE_CACHE_RULE.source;
    expect(pattern.endsWith("/opengraph-image")).toBe(true);
    expect(pattern).not.toContain("/api");
  });

  it("产出 Cache-Control 响应头", () => {
    expect(OG_IMAGE_CACHE_RULE.headers).toEqual([
      { key: "Cache-Control", value: OG_IMAGE_CACHE_CONTROL },
    ]);
  });
});
