import { BracesIcon, SearchIcon, ShieldCheckIcon } from "lucide-react";
import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { JsonViewerClient } from "@/components/tools/json-viewer-client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { getJsonViewerTool } from "@/lib/content";
import { getLocaleFromParams } from "@/lib/locale";
import { createLocalizedUrl, getLanguageAlternates } from "@/lib/site";
import { getLocaleContent } from "@/messages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);
  const tool = getJsonViewerTool(content);

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

export default async function JsonViewerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);
  const tool = getJsonViewerTool(content);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      applicationCategory: "DeveloperApplication",
      description: tool.description,
      featureList: tool.features,
      isAccessibleForFree: true,
      name: tool.name,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      operatingSystem: "Any",
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
      name: content.jsonViewer.content.stepsTitle,
      step: tool.steps.map((step, index) => ({
        "@type": "HowToStep",
        name: `${content.jsonViewer.content.stepsTitle} ${index + 1}`,
        text: step,
        url: createLocalizedUrl(locale, tool.href),
      })),
      totalTime: "PT1M",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          item: createLocalizedUrl(locale, "/"),
          name: content.header.nav.home,
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

  return (
    <>
      <StructuredData data={structuredData} />

      <section className="border-rule border-b">
        <div className="absolute inset-0 bg-sun" />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:py-18">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="yellow">
                {content.jsonViewer.hero.badges.category}
              </Badge>
              <Badge variant="info">
                {content.jsonViewer.hero.badges.localProcessing}
              </Badge>
              <Badge variant="outline">
                {content.jsonViewer.hero.badges.nested}
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-bold font-display text-4xl text-ink leading-tight tracking-tight sm:text-5xl">
                {content.jsonViewer.hero.title}
              </h1>
              <p className="max-w-3xl text-base text-ink-soft leading-relaxed sm:text-lg">
                {content.jsonViewer.hero.description}
              </p>
            </div>
          </div>

          <Card className="border-2 border-ink shadow-press-ink">
            <CardHeader className="border-rule border-b bg-paper-deep/50">
              <CardTitle>{content.jsonViewer.scenarios.title}</CardTitle>
              <CardDescription>
                {content.jsonViewer.scenarios.description}
              </CardDescription>
            </CardHeader>
            <CardPanel className="space-y-4 text-ink-soft text-sm leading-relaxed">
              <div className="flex gap-3">
                <ShieldCheckIcon className="mt-0.5 size-4.5 shrink-0 text-yellow-deep" />
                <p>{content.jsonViewer.scenarios.local}</p>
              </div>
              <div className="flex gap-3">
                <BracesIcon className="mt-0.5 size-4.5 shrink-0 text-yellow-deep" />
                <p>{content.jsonViewer.scenarios.nested}</p>
              </div>
              <div className="flex gap-3">
                <SearchIcon className="mt-0.5 size-4.5 shrink-0 text-yellow-deep" />
                <p>{content.jsonViewer.scenarios.search}</p>
              </div>
            </CardPanel>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <JsonViewerClient content={content.jsonViewer} />
      </section>

      <section className="border-rule border-t bg-fluff/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <ContentCard
              description={content.jsonViewer.content.supportDescription}
              items={tool.features}
              title={content.jsonViewer.content.supportTitle}
            />
            <ContentCard
              description={content.jsonViewer.content.stepsDescription}
              items={tool.steps}
              ordered
              title={content.jsonViewer.content.stepsTitle}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{content.jsonViewer.content.privacyTitle}</CardTitle>
                <CardDescription>
                  {content.jsonViewer.content.privacyDescription}
                </CardDescription>
              </CardHeader>
              <CardPanel className="space-y-3 text-ink-soft text-sm leading-relaxed">
                {content.jsonViewer.content.privacyItems.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </CardPanel>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{content.jsonViewer.content.faqTitle}</CardTitle>
                <CardDescription>
                  {content.jsonViewer.content.faqDescription}
                </CardDescription>
              </CardHeader>
              <CardPanel className="space-y-4">
                {tool.faq.map((item) => (
                  <div className="space-y-1" key={item.question}>
                    <h3 className="font-bold text-ink text-sm">
                      {item.question}
                    </h3>
                    <p className="text-ink-soft text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </CardPanel>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

type ContentCardProps = {
  description: string;
  items: readonly string[];
  ordered?: boolean;
  title: string;
};

function ContentCard({
  description,
  items,
  ordered = false,
  title,
}: ContentCardProps) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardPanel>
        <ListTag className="space-y-3 text-ink-soft text-sm leading-relaxed">
          {items.map((item, index) => (
            <li className="flex gap-3" key={item}>
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-yellow font-bold font-mono text-ink text-xs shadow-press-yellow">
                {ordered ? index + 1 : "•"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ListTag>
      </CardPanel>
    </Card>
  );
}
