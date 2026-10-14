import type { Metadata } from "next";
import { type AppLocale, routing } from "@/i18n/routing";

export const siteConfig = {
  host: "tools.meathill.com",
  name: "Meathill Tools",
  url: "https://tools.meathill.com",
} as const;

// Yandex 只可靠地收 120 / 32 / 16。文件放 public/，链接不带内容 hash，
// 避免把 256px PNG 标成 image/x-icon 之后爬虫解不开。
export const siteIcons: Metadata["icons"] = {
  icon: [
    { sizes: "120x120", type: "image/png", url: "/icon.png" },
    { sizes: "32x32", type: "image/x-icon", url: "/favicon.ico" },
  ],
};

export const localeMetadata: Record<
  AppLocale,
  {
    languageTag: string;
    nativeLabel: string;
    openGraphLocale: string;
    switcherLabel: string;
  }
> = {
  en: {
    languageTag: "en",
    nativeLabel: "English",
    openGraphLocale: "en_US",
    switcherLabel: "EN",
  },
  es: {
    languageTag: "es",
    nativeLabel: "Español",
    openGraphLocale: "es_ES",
    switcherLabel: "ES",
  },
  ja: {
    languageTag: "ja",
    nativeLabel: "日本語",
    openGraphLocale: "ja_JP",
    switcherLabel: "JA",
  },
  pt: {
    languageTag: "pt",
    nativeLabel: "Português",
    openGraphLocale: "pt_PT",
    switcherLabel: "PT",
  },
  th: {
    languageTag: "th",
    nativeLabel: "ไทย",
    openGraphLocale: "th_TH",
    switcherLabel: "TH",
  },
  vi: {
    languageTag: "vi",
    nativeLabel: "Tiếng Việt",
    openGraphLocale: "vi_VN",
    switcherLabel: "VI",
  },
  zh: {
    languageTag: "zh-CN",
    nativeLabel: "简体中文",
    openGraphLocale: "zh_CN",
    switcherLabel: "ZH",
  },
};

export function createAbsoluteUrl(pathname: string): string {
  return new URL(pathname, siteConfig.url).toString();
}

export function getLocalizedPathname(
  locale: AppLocale,
  pathname: string,
): string {
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  if (locale === routing.defaultLocale) {
    return normalizedPathname;
  }

  return normalizedPathname === "/"
    ? `/${locale}`
    : `/${locale}${normalizedPathname}`;
}

export function createLocalizedUrl(
  locale: AppLocale,
  pathname: string,
): string {
  return createAbsoluteUrl(getLocalizedPathname(locale, pathname));
}

export function getLanguageAlternates(
  pathname: string,
): Record<string, string> {
  const alternates = Object.fromEntries(
    routing.locales.map((locale) => [
      localeMetadata[locale].languageTag,
      createLocalizedUrl(locale, pathname),
    ]),
  );

  return {
    ...alternates,
    "x-default": createLocalizedUrl(routing.defaultLocale, pathname),
  };
}
