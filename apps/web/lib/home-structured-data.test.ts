import { describe, expect, it } from "vitest";
import { getTools } from "@/lib/content";
import {
  buildHomeStructuredData,
  ORGANIZATION_LOGO_URL,
} from "@/lib/home-structured-data";
import { siteConfig } from "@/lib/site";
import { getLocaleContent } from "@/messages";

describe("buildHomeStructuredData", () => {
  it("adds Organization logo pointing at an existing site asset", () => {
    const content = getLocaleContent("zh");
    const data = buildHomeStructuredData({
      locale: "zh",
      toolListName: content.home.structuredData.toolListName,
      tools: getTools(content),
      websiteDescription: content.home.metadata.description,
    });

    expect(ORGANIZATION_LOGO_URL).toBe(
      "https://tools.meathill.com/mui-mark.png",
    );
    expect(data[0]).toMatchObject({
      "@type": "Organization",
      logo: ORGANIZATION_LOGO_URL,
      name: "Meathill Studio",
      url: "https://meathill.com",
    });
    expect(data.map((block) => block["@type"])).toEqual([
      "Organization",
      "WebSite",
      "ItemList",
    ]);
    expect(data[1]).toMatchObject({
      "@type": "WebSite",
      name: siteConfig.name,
      publisher: { "@id": "https://meathill.com/#organization" },
    });
    expect(
      (data[2].itemListElement as Array<{ position: number }>).length,
    ).toBe(getTools(content).length);
  });
});
