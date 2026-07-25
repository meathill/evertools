import { KeyRoundIcon, ShieldCheckIcon, UnlockIcon } from "lucide-react";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tool-page/tool-page-layout";
import { PdfPasswordRemoverClient } from "@/components/tools/pdf-password-remover-client";
import { getPdfPasswordRemoverTool } from "@/lib/content";
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
  const tool = getPdfPasswordRemoverTool(getLocaleContent(locale));
  return generateToolPageMetadata(locale, tool);
}

export default async function PdfPasswordRemoverPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);
  const page = content.pdfPasswordRemover;
  const tool = getPdfPasswordRemoverTool(content);

  return (
    <ToolPageLayout
      badges={[
        page.hero.badges.category,
        page.hero.badges.localProcessing,
        page.hero.badges.noUpload,
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
          { icon: KeyRoundIcon, text: page.scenarios.knownPassword },
          { icon: UnlockIcon, text: page.scenarios.permission },
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
      <PdfPasswordRemoverClient content={page} />
    </ToolPageLayout>
  );
}
