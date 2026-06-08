import { LockIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConversionLinks } from "@/components/tool-page/conversion-links";
import { ToolPageLayout } from "@/components/tool-page/tool-page-layout";
import { ImageConverterClient } from "@/components/tools/image-converter-client";
import {
  CONVERSION_PAIRS,
  conversionOutputFormat,
  conversionSlug,
  parseConversionSlug,
} from "@/lib/conversions";
import { getConversionTool } from "@/lib/content";
import { getLocaleFromParams } from "@/lib/locale";
import {
  buildToolStructuredData,
  generateToolPageMetadata,
} from "@/lib/tool-page";
import { getLocaleContent } from "@/messages";

// 仅白名单 slug 静态生成，其余一律 404（不渲染任意 {x}-to-{y}）。
export const dynamicParams = false;

export function generateStaticParams() {
  return CONVERSION_PAIRS.map((pair) => ({ conversion: conversionSlug(pair) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ conversion: string; locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const { conversion } = await params;
  const pair = parseConversionSlug(conversion);

  if (!pair) {
    notFound();
  }

  const tool = getConversionTool(getLocaleContent(locale), pair);
  return generateToolPageMetadata(locale, tool);
}

export default async function ConversionPage({
  params,
}: {
  params: Promise<{ conversion: string; locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const { conversion } = await params;
  const pair = parseConversionSlug(conversion);

  if (!pair) {
    notFound();
  }

  const content = getLocaleContent(locale);
  const page = content.imageConverter;
  const tool = getConversionTool(content, pair);

  return (
    <ToolPageLayout
      badges={[
        page.hero.badges.category,
        page.hero.badges.localProcessing,
        page.hero.badges.singleImage,
      ]}
      contentSection={page.content}
      description={tool.description}
      faq={tool.faq}
      features={tool.features}
      infoCard={{
        description: page.content.privacyDescription,
        items: page.content.privacyItems,
        title: page.content.privacyTitle,
      }}
      scenarios={{
        description: page.scenarios.description,
        rows: [
          { icon: ShieldCheckIcon, text: page.scenarios.privacy },
          { icon: SparklesIcon, text: page.scenarios.transform },
          { icon: LockIcon, text: page.scenarios.ratio },
        ],
        title: page.scenarios.title,
      }}
      steps={tool.steps}
      structuredData={buildToolStructuredData(
        locale,
        tool,
        content.header.nav.home,
      )}
      title={tool.name}
    >
      <ImageConverterClient
        content={page}
        initialOutputFormat={conversionOutputFormat(pair.to)}
      />
      <ConversionLinks
        currentSlug={conversionSlug(pair)}
        locale={locale}
        title={page.conversions.relatedTitle}
      />
    </ToolPageLayout>
  );
}
