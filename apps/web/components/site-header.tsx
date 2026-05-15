import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { AppLocale } from "@/i18n/routing";
import type { LocaleContent } from "@/messages/types";
import { getLocalizedPathname, localeMetadata } from "@/lib/site";

const navItems = [
  { href: "/", key: "home" },
  { href: "/tools/image-converter", key: "imageConverter" },
] as const;

type SiteHeaderProps = {
  content: LocaleContent["header"];
  locale: AppLocale;
};

export function SiteHeader({ content, locale }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-cream/88 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          className="flex min-w-0 items-center gap-3"
          href="/"
          locale={locale}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-yellow text-ink shadow-press-yellow">
            <span className="font-mono font-bold text-xs">MT</span>
          </div>
          <div className="min-w-0">
            <div className="truncate font-display font-bold text-base text-ink">
              Meathill Tools
            </div>
            <div className="flex items-center gap-2 text-mute text-xs">
              <span className="truncate">{content.tagline}</span>
              <Badge size="sm" variant="yellow">
                {content.localProcessing}
              </Badge>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                className="whitespace-nowrap rounded-sm px-2 py-1 text-ink-soft transition-colors hover:bg-fluff hover:text-ink"
                href={item.href}
                key={item.href}
                locale={locale}
              >
                {content.nav[item.key]}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 overflow-x-auto">
            {Object.entries(localeMetadata).map(([value, info]) => {
              const nextLocale = value as AppLocale;

              return (
                <Link
                  className="whitespace-nowrap rounded-sm px-2 py-1 text-mono text-xs text-mute transition-colors hover:bg-fluff hover:text-ink"
                  href={getLocalizedPathname(nextLocale, "/")}
                  key={value}
                >
                  {nextLocale === locale
                    ? `[${info.switcherLabel}]`
                    : info.switcherLabel}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
