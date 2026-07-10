import { CodeXmlIcon, FolderInputIcon, NotebookPenIcon } from "lucide-react";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tool-page/tool-page-layout";
import { HtmlToMarkdownClient } from "@/components/tools/html-to-markdown-client";
import { getHtmlToMarkdownTool } from "@/lib/content";
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
  const tool = getHtmlToMarkdownTool(getLocaleContent(locale));
  return generateToolPageMetadata(locale, tool);
}

export default async function HtmlToMarkdownPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);
  const page = content.htmlToMarkdown;
  const tool = getHtmlToMarkdownTool(content);

  return (
    <ToolPageLayout
      badges={[
        page.hero.badges.category,
        page.hero.badges.localProcessing,
        page.hero.badges.pasteReady,
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
          { icon: NotebookPenIcon, text: page.scenarios.notes },
          { icon: FolderInputIcon, text: page.scenarios.migrate },
          { icon: CodeXmlIcon, text: page.scenarios.dev },
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
      <HtmlToMarkdownClient content={page} />
    </ToolPageLayout>
  );
}
