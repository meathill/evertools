import { ImageIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConversionLinks } from "@/components/tool-page/conversion-links";
import { ToolPageLayout } from "@/components/tool-page/tool-page-layout";
import { ImageConverterClient } from "@/components/tools/image-converter-client";
import {
  getConversionPageCopy,
  getConversionTool,
} from "@/lib/conversion-content";
import {
  CONVERSION_PAIRS,
  conversionOutputFormat,
  conversionSlug,
  parseConversionSlug,
} from "@/lib/conversions";
import { getLocaleFromParams } from "@/lib/locale";
import {
  buildToolStructuredData,
  generateToolPageMetadata,
} from "@/lib/tool-page";
import { getLocaleContent } from "@/messages";

// 白名单 slug 全部预渲染；未命中的 slug 由下面的 parseConversionSlug 守卫 404。
// 注意：这里**不能**加 `dynamicParams = false`。它会让 prerender-manifest 里本路由的
// fallback 变成 false（FallbackMode.NOT_FOUND），而 OpenNext/Cloudflare 没有磁盘缓存，
// 每次请求都是 cache MISS，Next 无从确认路径是否预渲染过，于是白名单 slug 也一律 404。
// 详见 DEV_NOTE.md。
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

const SCENARIO_ICONS = [ImageIcon, SparklesIcon, ShieldCheckIcon] as const;

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
  const copy = getConversionPageCopy(content, pair);

  return (
    <ToolPageLayout
      badges={[
        page.hero.badges.category,
        page.hero.badges.localProcessing,
        copy.badge,
      ]}
      contentSection={page.content}
      description={tool.description}
      faq={tool.faq}
      features={tool.features}
      infoCard={{
        description: page.content.privacyDescription,
        items: copy.privacyItems,
        title: page.content.privacyTitle,
      }}
      scenarios={{
        description: copy.scenarios.description,
        rows: copy.scenarios.rows.map((text, index) => ({
          icon: SCENARIO_ICONS[index],
          text,
        })),
        title: copy.scenarios.title,
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
