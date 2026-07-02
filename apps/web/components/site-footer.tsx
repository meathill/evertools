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
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <div className="font-display font-bold text-ink">Meathill Tools</div>
          <p className="max-w-xl text-ink-soft leading-relaxed">
            {content.description}
          </p>
          <p className="text-mute text-xs">
            © {new Date().getFullYear()} Meathill LLC. All rights reserved.
          </p>
        </div>

        <div className="grid gap-2 text-ink-soft">
          <div className="font-mono text-xs font-bold uppercase tracking-wide text-mute">
            {content.toolsTitle}
          </div>
          {tools.map((tool) => (
            <Link
              className="transition-colors hover:text-ink"
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
