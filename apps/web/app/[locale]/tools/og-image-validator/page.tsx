import { BugIcon, EyeIcon, TrendingUpIcon } from "lucide-react";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tool-page/tool-page-layout";
import { OgImageValidatorClient } from "@/components/tools/og-image-validator-client";
import { getOgImageValidatorTool } from "@/lib/content";
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
  const tool = getOgImageValidatorTool(getLocaleContent(locale));
  return generateToolPageMetadata(locale, tool);
}

export default async function OgImageValidatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);
  const page = content.ogImageValidator;
  const tool = getOgImageValidatorTool(content);

  return (
    <ToolPageLayout
      badges={[
        page.hero.badges.category,
        page.hero.badges.platforms,
        page.hero.badges.realtime,
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
          { icon: BugIcon, text: page.scenarios.debug },
          { icon: EyeIcon, text: page.scenarios.preview },
          { icon: TrendingUpIcon, text: page.scenarios.optimize },
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
      <OgImageValidatorClient content={page} />
    </ToolPageLayout>
  );
}
