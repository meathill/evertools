import { LockIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tool-page/tool-page-layout";
import { PdfTextEditorClient } from "@/components/tools/pdf-text-editor-client";
import { getPdfTextEditorTool } from "@/lib/content";
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
  const tool = getPdfTextEditorTool(getLocaleContent(locale));
  return generateToolPageMetadata(locale, tool);
}

export default async function PdfTextEditorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);
  const page = content.pdfTextEditor;
  const tool = getPdfTextEditorTool(content);

  return (
    <ToolPageLayout
      badges={[
        page.hero.badges.category,
        page.hero.badges.localProcessing,
        page.hero.badges.beta,
      ]}
      contentSection={page.content}
      description={page.hero.description}
      faq={tool.faq}
      features={tool.features}
      infoCard={{
        description: page.content.limitsDescription,
        items: page.content.limitsItems,
        title: page.content.limitsTitle,
      }}
      scenarios={{
        description: page.scenarios.description,
        rows: [
          { icon: ShieldCheckIcon, text: page.scenarios.privacy },
          { icon: SparklesIcon, text: page.scenarios.edit },
          { icon: LockIcon, text: page.scenarios.fontReuse },
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
      <PdfTextEditorClient content={page} />
    </ToolPageLayout>
  );
}
