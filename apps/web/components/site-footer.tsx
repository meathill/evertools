import { BrandFooter } from "meathill-brand-react";
import Link from "next/link";
import type { AppLocale } from "@/i18n/routing";
import { getTools } from "@/lib/content";
import { getLocalizedPathname } from "@/lib/site";
import { getLocaleContent } from "@/messages";
import type { LocaleContent } from "@/messages/types";

type SiteFooterProps = {
  content: LocaleContent["footer"];
  locale: AppLocale;
};

export function SiteFooter({ content, locale }: SiteFooterProps) {
  const tools = getTools(getLocaleContent(locale));

  return (
    <BrandFooter
      currentSiteId="evertools"
      description={content.description}
      locale={locale}
    >
      <nav
        aria-label={content.toolsTitle}
        className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-soft"
      >
        {tools.slice(0, 6).map((tool) => (
          <Link
            className="transition-colors hover:text-ink"
            href={getLocalizedPathname(locale, tool.href)}
            key={tool.slug}
          >
            {tool.name}
          </Link>
        ))}
      </nav>
    </BrandFooter>
  );
}
