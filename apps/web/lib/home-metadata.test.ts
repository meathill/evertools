import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import { getLocaleContent } from "@/messages";

// SEO-10 回归：首页 title 必须自带品牌 + 主要工具意图，且与 H1 分工清楚。
// 品牌口径统一为 Meathill Tools，EverTools 不再出现在用户可见文案中。
describe("home metadata brand and title", () => {
  it("uses Meathill Tools as the site name", () => {
    expect(siteConfig.name).toBe("Meathill Tools");
  });

  it.each(routing.locales)(
    "%s home title carries brand and intent",
    (locale) => {
      const content = getLocaleContent(locale);
      const title = content.home.metadata.title;

      expect(title.startsWith("Meathill Tools")).toBe(true);
      // 标题过长会被 SERP 截断，各语种控制在 75 个字符内。
      expect(title.length).toBeLessThanOrEqual(75);
      // title 与 H1 分工：标题承担品牌 + 意图，H1 承担价值主张。
      expect(title).not.toBe(content.home.hero.title);
    },
  );

  it.each(routing.locales)(
    "%s layout default title avoids brand duplication",
    (locale) => {
      const content = getLocaleContent(locale);

      // layout 用 `${siteConfig.name} | ${defaultTitle}` 拼默认标题，defaultTitle 不能再含品牌。
      expect(content.metadata.defaultTitle).not.toContain("Meathill Tools");
      expect(content.metadata.defaultTitle).not.toContain("EverTools");
      expect(content.metadata.defaultTitle.length).toBeGreaterThan(0);
    },
  );

  it.each(routing.locales)(
    "%s home description and keywords match page content",
    (locale) => {
      const content = getLocaleContent(locale);
      const { description, keywords } = content.home.metadata;

      expect(description).toContain("Meathill Tools");
      expect(description.length).toBeGreaterThan(20);
      expect(keywords.length).toBeGreaterThanOrEqual(4);
      for (const keyword of keywords) {
        expect(keyword.toLowerCase()).not.toBe("browser tools");
      }
    },
  );

  it.each(routing.locales)("%s has no leftover EverTools copy", (locale) => {
    const content = getLocaleContent(locale);
    const seen = JSON.stringify([
      content.metadata,
      content.home.metadata,
      content.home.structuredData,
    ]);

    expect(seen).not.toContain("EverTools");
    expect(content.home.structuredData.toolListName).toContain(
      "Meathill Tools",
    );
  });
});
