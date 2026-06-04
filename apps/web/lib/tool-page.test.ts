import { describe, expect, it } from "vitest";
import {
  getImageConverterTool,
  getJsonViewerTool,
  getPdfTextEditorTool,
} from "@/lib/content";
import { createLocalizedUrl, getLanguageAlternates } from "@/lib/site";
import {
  buildToolStructuredData,
  generateToolPageMetadata,
} from "@/lib/tool-page";
import { getLocaleContent } from "@/messages";

const zh = getLocaleContent("zh");
const homeLabel = zh.header.nav.home;

const cases = [
  {
    applicationCategory: "MultimediaApplication",
    label: "image-converter",
    tool: getImageConverterTool(zh),
    totalTime: "PT1M",
  },
  {
    applicationCategory: "BusinessApplication",
    label: "pdf-text-editor",
    tool: getPdfTextEditorTool(zh),
    totalTime: "PT3M",
  },
  {
    applicationCategory: "DeveloperApplication",
    label: "json-viewer",
    tool: getJsonViewerTool(zh),
    totalTime: "PT1M",
  },
];

describe("buildToolStructuredData", () => {
  it.each(cases)(
    "$label reproduces the four schema.org blocks",
    ({ applicationCategory, tool, totalTime }) => {
      const data = buildToolStructuredData("zh", tool, homeLabel);
      const url = createLocalizedUrl("zh", tool.href);

      expect(data).toEqual([
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          applicationCategory,
          description: tool.description,
          featureList: tool.features,
          isAccessibleForFree: true,
          name: tool.name,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          operatingSystem: "Any",
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
              item: createLocalizedUrl("zh", "/"),
              name: homeLabel,
              position: 1,
            },
            { "@type": "ListItem", item: url, name: tool.name, position: 2 },
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
        "SoftwareApplication",
        "FAQPage",
        "HowTo",
        "BreadcrumbList",
      ]);
      expect(Object.keys(data[0])).toEqual([
        "@context",
        "@type",
        "applicationCategory",
        "description",
        "featureList",
        "isAccessibleForFree",
        "name",
        "offers",
        "operatingSystem",
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

  it("prefixes non-default locale URLs", () => {
    const tool = getImageConverterTool(getLocaleContent("en"));
    const data = buildToolStructuredData("en", tool, "Home");

    expect(data[0].url).toBe(
      "https://tools.meathill.com/en/tools/image-converter",
    );
    expect(data[3].itemListElement).toEqual([
      {
        "@type": "ListItem",
        item: "https://tools.meathill.com/en",
        name: "Home",
        position: 1,
      },
      {
        "@type": "ListItem",
        item: "https://tools.meathill.com/en/tools/image-converter",
        name: tool.name,
        position: 2,
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
