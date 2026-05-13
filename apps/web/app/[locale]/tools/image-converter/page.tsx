import type { Metadata } from "next";
import { LockIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import { ImageConverterClient } from "@/components/tools/image-converter-client";
import { StructuredData } from "@/components/structured-data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { getImageConverterTool } from "@/lib/content";
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
  const tool = getImageConverterTool(content);

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

export default async function ImageConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);
  const tool = getImageConverterTool(content);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      applicationCategory: "MultimediaApplication",
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
      name: content.imageConverter.content.stepsTitle,
      step: tool.steps.map((step, index) => ({
        "@type": "HowToStep",
        name: `${content.imageConverter.content.stepsTitle} ${index + 1}`,
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

      <section className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_right,rgba(17,24,39,0.12),transparent_35%)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:py-18">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {content.imageConverter.hero.badges.category}
              </Badge>
              <Badge variant="info">
                {content.imageConverter.hero.badges.localProcessing}
              </Badge>
              <Badge variant="outline">
                {content.imageConverter.hero.badges.singleImage}
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-heading font-semibold text-4xl tracking-tight text-foreground leading-tight sm:text-5xl">
                {content.imageConverter.hero.title}
              </h1>
              <p className="max-w-3xl text-base text-muted-foreground leading-7 sm:text-lg">
                {content.imageConverter.hero.description}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader className="border-b border-border/60 bg-muted/35">
              <CardTitle>{content.imageConverter.scenarios.title}</CardTitle>
              <CardDescription>
                {content.imageConverter.scenarios.description}
              </CardDescription>
            </CardHeader>
            <CardPanel className="space-y-4 text-sm text-muted-foreground leading-6">
              <div className="flex gap-3">
                <ShieldCheckIcon className="mt-0.5 size-4.5 shrink-0 text-primary" />
                <p>{content.imageConverter.scenarios.privacy}</p>
              </div>
              <div className="flex gap-3">
                <SparklesIcon className="mt-0.5 size-4.5 shrink-0 text-primary" />
                <p>{content.imageConverter.scenarios.transform}</p>
              </div>
              <div className="flex gap-3">
                <LockIcon className="mt-0.5 size-4.5 shrink-0 text-primary" />
                <p>{content.imageConverter.scenarios.ratio}</p>
              </div>
            </CardPanel>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <ImageConverterClient content={content.imageConverter} />
      </section>

      <section className="border-t border-border/70 bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <ContentCard
              description={content.imageConverter.content.supportDescription}
              items={tool.features}
              title={content.imageConverter.content.supportTitle}
            />
            <ContentCard
              description={content.imageConverter.content.stepsDescription}
              items={tool.steps}
              ordered
              title={content.imageConverter.content.stepsTitle}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {content.imageConverter.content.privacyTitle}
                </CardTitle>
                <CardDescription>
                  {content.imageConverter.content.privacyDescription}
                </CardDescription>
              </CardHeader>
              <CardPanel className="space-y-3 text-muted-foreground text-sm leading-6">
                {content.imageConverter.content.privacyItems.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </CardPanel>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{content.imageConverter.content.faqTitle}</CardTitle>
                <CardDescription>
                  {content.imageConverter.content.faqDescription}
                </CardDescription>
              </CardHeader>
              <CardPanel className="space-y-4">
                {tool.faq.map((item) => (
                  <div className="space-y-1" key={item.question}>
                    <h3 className="font-medium text-foreground text-sm">
                      {item.question}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-6">
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
        <ListTag className="space-y-3 text-muted-foreground text-sm leading-6">
          {items.map((item, index) => (
            <li className="flex gap-3" key={item}>
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
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
