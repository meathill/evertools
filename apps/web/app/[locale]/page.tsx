import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  CloudUploadIcon,
  FileTextIcon,
  ImageIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { StructuredData } from "@/components/structured-data";
import { ToolCard } from "@/components/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { getTools } from "@/lib/content";
import { getLocaleFromParams } from "@/lib/locale";
import {
  createLocalizedUrl,
  getLanguageAlternates,
  getLocalizedPathname,
  siteConfig,
} from "@/lib/site";
import { getLocaleContent } from "@/messages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);

  return {
    alternates: {
      canonical: createLocalizedUrl(locale, "/"),
      languages: getLanguageAlternates("/"),
    },
    description: content.home.metadata.description,
    keywords: [...content.home.metadata.keywords],
    title: content.home.metadata.title,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);
  const tools = getTools(content);

  const homeStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      description: content.home.metadata.description,
      name: siteConfig.name,
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
      name: content.home.structuredData.toolListName,
    },
  ];

  return (
    <>
      <StructuredData data={homeStructuredData} />

      <section className="relative overflow-hidden border-b border-rule">
        <div className="absolute inset-0 bg-sun" />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:py-24">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="yellow">{content.home.hero.badges.stack}</Badge>
              <Badge variant="info">{content.home.hero.badges.seo}</Badge>
              <Badge variant="success">
                {content.home.hero.badges.scalable}
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="h-hero max-w-3xl text-balance text-ink">
                {content.home.hero.title}
              </h1>
              <p className="max-w-2xl text-base text-ink-soft leading-relaxed sm:text-lg">
                {content.home.hero.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                className="glow-yellow"
                render={<a href="#tools" />}
                size="lg"
                variant="press"
              >
                {content.home.hero.secondaryCta}
                <ArrowRightIcon />
              </Button>
            </div>

            <img
              alt=""
              aria-hidden="true"
              className="wiggle hidden size-28 origin-bottom select-none lg:mt-4 lg:block dark:lg:hidden"
              height={112}
              src="/mui-mark.png"
              width={112}
            />
          </div>

          <Card className="overflow-hidden border-2 border-ink shadow-press-ink">
            <CardHeader className="border-b border-rule bg-paper-deep/50">
              <CardTitle>{content.home.strategy.title}</CardTitle>
              <CardDescription>
                {content.home.strategy.description}
              </CardDescription>
            </CardHeader>
            <CardPanel className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <FeatureStat
                description={content.home.strategy.indexedPagesDescription}
                icon={<ArrowRightIcon className="size-4.5" />}
                title={content.home.strategy.indexedPagesTitle}
              />
              <FeatureStat
                description={content.home.strategy.localProcessingDescription}
                icon={<ShieldCheckIcon className="size-4.5" />}
                title={content.home.strategy.localProcessingTitle}
              />
              <FeatureStat
                description={
                  content.home.strategy.lightweightExpansionDescription
                }
                icon={<CloudUploadIcon className="size-4.5" />}
                title={content.home.strategy.lightweightExpansionTitle}
              />
            </CardPanel>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 space-y-2">
          <h2 className="font-display font-bold text-2xl text-ink">
            {content.home.featuredTools.title}
          </h2>
          <p className="text-ink-soft">
            {content.home.featuredTools.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden border-2 border-ink shadow-press-ink transition-transform hover:-translate-y-0.5">
            <CardHeader className="border-b border-rule bg-paper-deep/50">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-md bg-yellow text-ink shadow-press-yellow">
                  <ImageIcon className="size-5" />
                </div>
                <div>
                  <CardTitle>{tools[0].name}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {tools[0].category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardPanel className="space-y-4">
              <p className="text-ink-soft text-sm leading-relaxed">
                {tools[0].summary}
              </p>
              <ul className="space-y-2 text-sm text-ink-soft">
                {tools[0].features.slice(0, 2).map((feature) => (
                  <li className="flex gap-2" key={feature}>
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-yellow-deep" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardPanel>
            <div className="border-t border-rule bg-fluff/40 px-6 py-4">
              <Button
                render={
                  <Link href={getLocalizedPathname(locale, tools[0].href)} />
                }
                size="sm"
                variant="press"
              >
                {content.toolCard.openTool}
                <ArrowRightIcon />
              </Button>
            </div>
          </Card>

          <Card className="overflow-hidden border-2 border-ink shadow-press-ink transition-transform hover:-translate-y-0.5">
            <CardHeader className="border-b border-rule bg-paper-deep/50">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-md bg-info text-cream shadow-press-ink">
                  <FileTextIcon className="size-5" />
                </div>
                <div>
                  <CardTitle>{tools[1].name}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {tools[1].category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardPanel className="space-y-4">
              <p className="text-ink-soft text-sm leading-relaxed">
                {tools[1].summary}
              </p>
              <ul className="space-y-2 text-sm text-ink-soft">
                {tools[1].features.slice(0, 2).map((feature) => (
                  <li className="flex gap-2" key={feature}>
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-info" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardPanel>
            <div className="border-t border-rule bg-fluff/40 px-6 py-4">
              <Button
                render={
                  <Link href={getLocalizedPathname(locale, tools[1].href)} />
                }
                size="sm"
                variant="press"
              >
                {content.toolCard.openTool}
                <ArrowRightIcon />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" id="tools">
        <div className="mb-8 space-y-3">
          <h2 className="font-display font-bold text-3xl text-ink">
            {content.home.tools.title}
          </h2>
          <p className="max-w-2xl text-ink-soft leading-relaxed">
            {content.home.tools.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              content={content.toolCard}
              key={tool.slug}
              locale={locale}
              tool={tool}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-rule bg-fluff/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3">
          <InfoBlock
            description={content.home.info.substantialPagesDescription}
            title={content.home.info.substantialPagesTitle}
          />
          <InfoBlock
            description={content.home.info.highFrequencyDescription}
            title={content.home.info.highFrequencyTitle}
          />
          <InfoBlock
            description={content.home.info.expansionMatrixDescription}
            title={content.home.info.expansionMatrixTitle}
          />
        </div>
      </section>
    </>
  );
}

type FeatureStatProps = {
  description: string;
  icon: React.ReactNode;
  title: string;
};

function FeatureStat({ description, icon, title }: FeatureStatProps) {
  return (
    <div className="rounded-lg border border-rule-strong bg-cream p-4 transition-transform hover:-translate-y-0.5">
      <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-yellow text-ink shadow-press-yellow">
        {icon}
      </div>
      <div className="space-y-1.5">
        <div className="font-bold text-ink">{title}</div>
        <p className="text-ink-soft text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

type InfoBlockProps = {
  description: string;
  title: string;
};

function InfoBlock({ description, title }: InfoBlockProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-display font-bold text-lg text-ink">{title}</h3>
      <p className="text-ink-soft leading-relaxed">{description}</p>
    </div>
  );
}
