import { describe, expect, it } from "vitest";
import {
  getImageConverterTool,
  getJsonViewerTool,
  getPdfPasswordRemoverTool,
  getPdfTextEditorTool,
} from "@/lib/content";
import {
  createLocalizedUrl,
  getLanguageAlternates,
  localeMetadata,
  siteConfig,
} from "@/lib/site";
import {
  buildToolStructuredData,
  generateToolPageMetadata,
} from "@/lib/tool-page";
import { getLocaleContent } from "@/messages";

const zh = getLocaleContent("zh");
const homeLabel = zh.header.nav.home;

const cases = [
  {
    label: "image-converter",
    tool: getImageConverterTool(zh),
    totalTime: "PT1M",
  },
  {
    label: "pdf-text-editor",
    tool: getPdfTextEditorTool(zh),
    totalTime: "PT3M",
  },
  {
    label: "pdf-password-remover",
    tool: getPdfPasswordRemoverTool(zh),
    totalTime: "PT1M",
  },
  {
    label: "json-viewer",
    tool: getJsonViewerTool(zh),
    totalTime: "PT1M",
  },
];

describe("buildToolStructuredData", () => {
  it.each(cases)(
    "$label reproduces the four schema.org blocks",
    ({ tool, totalTime }) => {
      const data = buildToolStructuredData("zh", tool, homeLabel);
      const url = createLocalizedUrl("zh", tool.href);

      expect(data).toEqual([
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          description: tool.description,
          inLanguage: localeMetadata.zh.languageTag,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: createLocalizedUrl("zh", "/"),
          },
          name: tool.name,
          url,
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faq.map((item) => ({
            "@type": "Question",
            acceptedAnswer: { "@type": "Answer", text: item.answer },
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
            url,
          })),
          totalTime,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              item: "https://meathill.com",
              name: "Meathill Studio",
              position: 1,
            },
            {
              "@type": "ListItem",
              item: siteConfig.url,
              name: siteConfig.name,
              position: 2,
            },
            { "@type": "ListItem", item: url, name: tool.name, position: 3 },
          ],
        },
      ]);
    },
  );

  it.each(cases)(
    "$label keeps a stable key order (locks JSON.stringify bytes)",
    ({ tool }) => {
      const data = buildToolStructuredData("zh", tool, homeLabel);

      expect(data.map((block) => block["@type"])).toEqual([
        "WebPage",
        "FAQPage",
        "HowTo",
        "BreadcrumbList",
      ]);
      expect(Object.keys(data[0])).toEqual([
        "@context",
        "@type",
        "description",
        "inLanguage",
        "isPartOf",
        "name",
        "url",
      ]);
      expect(Object.keys(data[1])).toEqual(["@context", "@type", "mainEntity"]);
      expect(Object.keys(data[2])).toEqual([
        "@context",
        "@type",
        "description",
        "name",
        "step",
        "totalTime",
      ]);
      expect(Object.keys(data[3])).toEqual([
        "@context",
        "@type",
        "itemListElement",
      ]);
    },
  );

  // 回归：SoftwareApplication 及其子类型会触发 Google Software App 富结果校验，
  // 而该校验要求 aggregateRating 或 review，我们没有真实评分，标了必然报错。
  it.each(cases)("$label emits no SoftwareApplication subtype", ({ tool }) => {
    const types = JSON.stringify(
      buildToolStructuredData("zh", tool, homeLabel),
    );

    expect(types).not.toMatch(/"(Software|Mobile|Web)Application"|"VideoGame"/);
  });

  it("prefixes non-default locale URLs", () => {
    const tool = getImageConverterTool(getLocaleContent("en"));
    const data = buildToolStructuredData("en", tool, "Home");

    expect(data[0].url).toBe(
      "https://tools.meathill.com/en/tools/image-converter",
    );
    expect(data[3].itemListElement).toEqual([
      {
        "@type": "ListItem",
        item: "https://meathill.com",
        name: "Meathill Studio",
        position: 1,
      },
      {
        "@type": "ListItem",
        item: siteConfig.url,
        name: siteConfig.name,
        position: 2,
      },
      {
        "@type": "ListItem",
        item: "https://tools.meathill.com/en/tools/image-converter",
        name: tool.name,
        position: 3,
      },
    ]);
  });
});

describe("generateToolPageMetadata", () => {
  it.each(cases)("$label maps tool fields onto Next metadata", ({ tool }) => {
    const meta = generateToolPageMetadata("zh", tool);
    const url = createLocalizedUrl("zh", tool.href);

    expect(meta.title).toBe(tool.name);
    expect(meta.description).toBe(tool.description);
    expect(meta.keywords).toEqual([...tool.keywords]);
    expect(meta.alternates?.canonical).toBe(url);
    expect(meta.alternates?.languages).toEqual(
      getLanguageAlternates(tool.href),
    );
    expect(meta.openGraph).toEqual({
      description: tool.description,
      title: tool.name,
      type: "website",
      url,
    });
    expect(meta.twitter).toEqual({
      description: tool.description,
      title: tool.name,
    });
  });

  it("uses the locale prefix in canonical URLs for non-default locales", () => {
    const tool = getPdfTextEditorTool(getLocaleContent("en"));
    const meta = generateToolPageMetadata("en", tool);

    expect(meta.alternates?.canonical).toBe(
      "https://tools.meathill.com/en/tools/pdf-text-editor",
    );
  });
});
