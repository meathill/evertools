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
    <footer className="border-t border-border/80 bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <div className="font-heading font-semibold text-foreground">
            Meathill Tools
          </div>
          <p className="max-w-xl text-muted-foreground leading-6">
            {content.description}
          </p>
        </div>

        <div className="grid gap-2 text-muted-foreground">
          <div className="font-heading font-medium text-foreground">
            {content.toolsTitle}
          </div>
          {tools.map((tool) => (
            <Link
              className="transition-colors hover:text-foreground"
              href={getLocalizedPathname(locale, tool.href)}
              key={tool.slug}
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
