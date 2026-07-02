import { ListChecksIcon, RocketIcon, SearchIcon } from "lucide-react";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tool-page/tool-page-layout";
import { SitemapValidatorClient } from "@/components/tools/sitemap-validator-client";
import { getSitemapValidatorTool } from "@/lib/content";
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
  const tool = getSitemapValidatorTool(getLocaleContent(locale));
  return generateToolPageMetadata(locale, tool);
}

export default async function SitemapValidatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);
  const page = content.sitemapValidator;
  const tool = getSitemapValidatorTool(content);

  return (
    <ToolPageLayout
      badges={[
        page.hero.badges.category,
        page.hero.badges.protocol,
        page.hero.badges.instant,
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
          { icon: RocketIcon, text: page.scenarios.launch },
          { icon: SearchIcon, text: page.scenarios.seo },
          { icon: ListChecksIcon, text: page.scenarios.audit },
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
      <SitemapValidatorClient content={page} />
    </ToolPageLayout>
  );
}
