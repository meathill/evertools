import type { Metadata } from "next";
import { ArrowRightIcon, CloudUploadIcon, ShieldCheckIcon } from "lucide-react";
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
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:py-14">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="yellow">{content.home.hero.badges.stack}</Badge>
              <Badge variant="info">{content.home.hero.badges.seo}</Badge>
              <Badge variant="success">
                {content.home.hero.badges.scalable}
              </Badge>
            </div>

            <div className="space-y-3">
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
            <ToolCard key={tool.slug} locale={locale} tool={tool} />
          ))}
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
    <div className="flex gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-yellow text-ink shadow-press-yellow">
        {icon}
      </div>
      <div className="space-y-1.5">
        <div className="font-bold text-ink">{title}</div>
        <p className="text-ink-soft text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
