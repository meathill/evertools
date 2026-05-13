import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getTools } from "@/lib/content";
import { createLocalizedUrl } from "@/lib/site";
import { getLocaleContent } from "@/messages";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routing.locales.flatMap((locale) => {
    const tools = getTools(getLocaleContent(locale));

    return [
      {
        changeFrequency: "weekly",
        lastModified,
        priority: locale === routing.defaultLocale ? 1 : 0.9,
        url: createLocalizedUrl(locale, "/"),
      },
      ...tools.map((tool) => ({
        changeFrequency: "weekly" as const,
        lastModified,
        priority: locale === routing.defaultLocale ? 0.9 : 0.8,
        url: createLocalizedUrl(locale, tool.href),
      })),
    ];
  });
}
