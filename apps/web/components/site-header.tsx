"use client";

import Link from "next/link";
import {
  ExternalLinkIcon,
  GlobeIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectButton,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppLocale } from "@/i18n/routing";
import type { LocaleContent } from "@/messages/types";
import { getLocalizedPathname, localeMetadata } from "@/lib/site";

const navItems = [
  { href: "/tools/image-converter", key: "imageConverter" },
  { href: "/tools/pdf-text-editor", key: "pdfTextEditor" },
] as const;

type ThemeMode = "light" | "dark" | "system";

type SiteHeaderProps = {
  content: LocaleContent["header"];
  locale: AppLocale;
};

export function SiteHeader({ content, locale }: SiteHeaderProps) {
  function handleLocaleChange(value: string | null) {
    if (!value) return;
    const nextLocale = value as AppLocale;
    window.location.href = getLocalizedPathname(nextLocale, "/");
  }

  function handleThemeChange(value: string | null) {
    if (!value) return;
    const mode = value as ThemeMode;
    const root = document.documentElement;

    if (mode === "system") {
      localStorage.removeItem("theme");
      root.classList.toggle(
        "dark",
        window.matchMedia("(prefers-color-scheme: dark)").matches,
      );
    } else if (mode === "dark") {
      localStorage.setItem("theme", "dark");
      root.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      root.classList.remove("dark");
    }
  }

  function getCurrentTheme(): ThemeMode {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return "system";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-cream/88 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          className="flex min-w-0 items-center gap-3"
          href={getLocalizedPathname(locale, "/")}
        >
          <img
            alt="Meathill Tools"
            className="size-10 shrink-0 rounded-lg object-contain"
            height={40}
            src="/mui-mark.png"
            width={40}
          />
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

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                className="whitespace-nowrap rounded-sm px-2 py-1 text-ink-soft transition-colors hover:bg-fluff hover:text-ink"
                href={getLocalizedPathname(locale, item.href)}
                key={item.href}
              >
                {content.nav[item.key]}
              </Link>
            ))}
            <a
              className="flex items-center gap-1 whitespace-nowrap rounded-sm px-2 py-1 text-ink-soft transition-colors hover:bg-fluff hover:text-ink"
              href="https://meathill.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              meathill.com
              <ExternalLinkIcon className="size-3" />
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Select onValueChange={handleLocaleChange} value={locale}>
              <SelectTrigger
                className="h-8 min-w-[120px] gap-1.5 border-rule-strong bg-paper font-mono text-xs text-mute"
                size="sm"
              >
                <GlobeIcon className="size-3.5" />
                <SelectValue>
                  {(value) =>
                    value ? localeMetadata[value as AppLocale].nativeLabel : ""
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>
                {Object.entries(localeMetadata).map(([value, info]) => (
                  <SelectItem key={value} value={value}>
                    {info.nativeLabel}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>

            <Select
              defaultValue={getCurrentTheme()}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger
                className="h-8 min-w-[100px] gap-1.5 border-rule-strong bg-paper font-mono text-xs text-mute"
                size="sm"
              >
                <SunIcon className="size-3.5 dark:hidden" />
                <MoonIcon className="hidden size-3.5 dark:block" />
                <SelectValue>
                  {(value) => (value ? content.theme[value as ThemeMode] : "")}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <SunIcon className="size-3.5" />
                    <span>{content.theme.light}</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <MoonIcon className="size-3.5" />
                    <span>{content.theme.dark}</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <MonitorIcon className="size-3.5" />
                    <span>{content.theme.system}</span>
                  </div>
                </SelectItem>
              </SelectPopup>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}
