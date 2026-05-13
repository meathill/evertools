import { routing, type AppLocale } from "@/i18n/routing";

export const siteConfig = {
  host: "tools.meathill.com",
  name: "Meathill Tools",
  url: "https://tools.meathill.com",
} as const;

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
