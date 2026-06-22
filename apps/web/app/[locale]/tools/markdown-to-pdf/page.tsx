import { FileTextIcon, ShieldCheckIcon, SmartphoneIcon } from "lucide-react";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tool-page/tool-page-layout";
import { MarkdownToPdfClient } from "@/components/tools/markdown-to-pdf-client";
import { getMarkdownToPdfTool } from "@/lib/content";
import { getLocaleFromParams } from "@/lib/locale";
import {
  buildToolStructuredData,
  generateToolPageMetadata,
} from "@/lib/tool-page";
import { getLocaleContent } from "@/messages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const tool = getMarkdownToPdfTool(getLocaleContent(locale));
  return generateToolPageMetadata(locale, tool);
}

export default async function MarkdownToPdfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);
  const page = content.markdownToPdf;
  const tool = getMarkdownToPdfTool(content);

  return (
    <ToolPageLayout
      badges={[
        page.hero.badges.category,
        page.hero.badges.localProcessing,
        page.hero.badges.mobileFriendly,
      ]}
      contentSection={page.content}
      description={page.hero.description}
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
          { icon: FileTextIcon, text: page.scenarios.ai },
          { icon: SmartphoneIcon, text: page.scenarios.share },
          { icon: ShieldCheckIcon, text: page.scenarios.privacy },
        ],
        title: page.scenarios.title,
      }}
      steps={tool.steps}
      structuredData={buildToolStructuredData(
        locale,
        tool,
        content.header.nav.home,
      )}
      title={page.hero.title}
    >
      <MarkdownToPdfClient content={page} />
    </ToolPageLayout>
  );
}
