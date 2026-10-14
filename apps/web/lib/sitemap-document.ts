import { routing } from "@/i18n/routing";
import { getTools } from "@/lib/content";
import { CONVERSION_PAIRS, conversionSlug } from "@/lib/conversions";
import { createLocalizedUrl } from "@/lib/site";
import { getLocaleContent } from "@/messages";

export type SitemapChangeFrequency = "weekly";

export type SitemapEntry = {
  changeFrequency: SitemapChangeFrequency;
  priority: number;
  url: string;
};

/**
 * 全站可索引 URL。不写 lastmod：页面没有独立的更新时间，
 * 以前在请求里用 `new Date()` 会让每条 URL 每次抓取都像刚改过，
 * 静态文件也无法保持稳定。
 */
export function buildSitemapEntries(): SitemapEntry[] {
  return routing.locales.flatMap((locale) => {
    const tools = getTools(getLocaleContent(locale));
    const isDefaultLocale = locale === routing.defaultLocale;

    return [
      {
        changeFrequency: "weekly",
        priority: isDefaultLocale ? 1 : 0.9,
        url: createLocalizedUrl(locale, "/"),
      },
      ...tools.map((tool) => ({
        changeFrequency: "weekly" as const,
        priority: isDefaultLocale ? 0.9 : 0.8,
        url: createLocalizedUrl(locale, tool.href),
      })),
      ...CONVERSION_PAIRS.map((pair) => ({
        changeFrequency: "weekly" as const,
        priority: isDefaultLocale ? 0.7 : 0.6,
        url: createLocalizedUrl(locale, `/tools/${conversionSlug(pair)}`),
      })),
    ];
  });
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderSitemapXml(entries: readonly SitemapEntry[]): string {
  const urls = entries
    .map(
      (entry) =>
        `<url><loc>${escapeXml(entry.url)}</loc><changefreq>${entry.changeFrequency}</changefreq><priority>${entry.priority}</priority></url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
