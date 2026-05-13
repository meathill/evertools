import type { AppLocale } from "@/i18n/routing";
import { enMessages } from "./en";
import { jaMessages } from "./ja";
import { thMessages } from "./th";
import type { LocaleContent } from "./types";
import { zhMessages } from "./zh";

export const localeContent: Record<AppLocale, LocaleContent> = {
  en: enMessages,
  es: enMessages,
  ja: jaMessages,
  pt: enMessages,
  th: thMessages,
  vi: enMessages,
  zh: zhMessages,
};

export function getLocaleContent(locale: AppLocale): LocaleContent {
  return localeContent[locale];
}
