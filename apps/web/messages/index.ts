import type { AppLocale } from "@/i18n/routing";
import { enMessages } from "./en";
import { esMessages } from "./es";
import { jaMessages } from "./ja";
import { ptMessages } from "./pt";
import { thMessages } from "./th";
import type { LocaleContent } from "./types";
import { viMessages } from "./vi";
import { zhMessages } from "./zh";

export const localeContent: Record<AppLocale, LocaleContent> = {
  en: enMessages,
  es: esMessages,
  ja: jaMessages,
  pt: ptMessages,
  th: thMessages,
  vi: viMessages,
  zh: zhMessages,
};

export function getLocaleContent(locale: AppLocale): LocaleContent {
  return localeContent[locale];
}
