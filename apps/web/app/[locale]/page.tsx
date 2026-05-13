import type { Metadata } from "next";
import Link from "next/link";
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

      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,rgba(17,24,39,0.14),transparent_40%),radial-gradient(circle_at_right,rgba(59,130,246,0.16),transparent_36%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:py-24">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {content.home.hero.badges.stack}
              </Badge>
              <Badge variant="info">{content.home.hero.badges.seo}</Badge>
              <Badge variant="success">
                {content.home.hero.badges.scalable}
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-heading font-semibold text-4xl tracking-tight text-foreground leading-tight sm:text-5xl">
                {content.home.hero.title}
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground leading-7 sm:text-lg">
                {content.home.hero.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                render={
                  <Link
                    href={getLocalizedPathname(
                      locale,
                      "/tools/image-converter",
                    )}
                  />
                }
                size="lg"
              >
                {content.home.hero.primaryCta}
                <ArrowRightIcon />
              </Button>
              <Button render={<a href="#tools" />} size="lg" variant="outline">
                {content.home.hero.secondaryCta}
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/60 bg-muted/35">
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
          <h2 className="font-heading font-semibold text-3xl text-foreground">
            {content.home.tools.title}
          </h2>
          <p className="max-w-2xl text-muted-foreground leading-7">
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

      <section className="border-t border-border/70 bg-muted/20">
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
    <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="space-y-1.5">
        <div className="font-medium text-foreground">{title}</div>
        <p className="text-muted-foreground text-sm leading-6">{description}</p>
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
      <h3 className="font-heading font-semibold text-lg text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground leading-7">{description}</p>
    </div>
  );
}
