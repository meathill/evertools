import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import type { ToolDefinition } from "@/lib/content";
import {
  createLocalizedUrl,
  getLanguageAlternates,
  localeMetadata,
  siteConfig,
} from "@/lib/site";

export function generateToolPageMetadata(
  locale: AppLocale,
  tool: ToolDefinition,
): Metadata {
  return {
    alternates: {
      canonical: createLocalizedUrl(locale, tool.href),
      languages: getLanguageAlternates(tool.href),
    },
    description: tool.description,
    keywords: [...tool.keywords],
    openGraph: {
      description: tool.description,
      title: tool.name,
      type: "website",
      url: createLocalizedUrl(locale, tool.href),
    },
    title: tool.name,
    twitter: {
      description: tool.description,
      title: tool.name,
    },
  };
}

export function buildToolStructuredData(
  locale: AppLocale,
  tool: ToolDefinition,
  homeLabel: string,
): Array<Record<string, unknown>> {
  return [
    // 刻意不用 SoftwareApplication/WebApplication：Google 的 Software App
    // 富结果要求 aggregateRating 或 review，我们没有真实评分，标了只会被判校验失败。
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      description: tool.description,
      inLanguage: localeMetadata[locale].languageTag,
      isPartOf: {
        "@type": "WebSite",
        name: siteConfig.name,
        url: createLocalizedUrl(locale, "/"),
      },
      name: tool.name,
      url: createLocalizedUrl(locale, tool.href),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faq.map((item) => ({
        "@type": "Question",
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
        name: item.question,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      description: tool.summary,
      name: tool.stepsTitle,
      step: tool.steps.map((step, index) => ({
        "@type": "HowToStep",
        name: `${tool.stepsTitle} ${index + 1}`,
        text: step,
        url: createLocalizedUrl(locale, tool.href),
      })),
      totalTime: tool.totalTime,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          item: createLocalizedUrl(locale, "/"),
          name: homeLabel,
          position: 1,
        },
        {
          "@type": "ListItem",
          item: createLocalizedUrl(locale, tool.href),
          name: tool.name,
          position: 2,
        },
      ],
    },
  ];
}
