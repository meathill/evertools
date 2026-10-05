import { brandCatalog, getOrganizationJsonLd } from "meathill-brand";
import type { AppLocale } from "@/i18n/routing";
import type { ToolDefinition } from "@/lib/content";
import { createAbsoluteUrl, createLocalizedUrl, siteConfig } from "@/lib/site";

/** 站内已有的品牌标：header / hero 都用它，线上 curl -sI 返回 200。 */
export const ORGANIZATION_LOGO_URL = createAbsoluteUrl("/mui-mark.png");

type HomeStructuredDataInput = {
  locale: AppLocale;
  toolListName: string;
  tools: readonly ToolDefinition[];
  websiteDescription: string;
};

/**
 * 首页 JSON-LD：Organization（含 logo）+ WebSite + 工具 ItemList。
 * logo 挂在本站 Organization 块上——meathill-brand 的 getOrganizationJsonLd 暂不带 logo。
 */
export function buildHomeStructuredData({
  locale,
  toolListName,
  tools,
  websiteDescription,
}: HomeStructuredDataInput): Array<Record<string, unknown>> {
  return [
    {
      ...getOrganizationJsonLd(),
      logo: ORGANIZATION_LOGO_URL,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      description: websiteDescription,
      name: siteConfig.name,
      publisher: { "@id": brandCatalog.organization.id },
      url: createLocalizedUrl(locale, "/"),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: createLocalizedUrl(locale, tool.href),
      })),
      name: toolListName,
    },
  ];
}
