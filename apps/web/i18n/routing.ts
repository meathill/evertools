import { defineRouting } from "next-intl/routing";

export const locales = ["zh", "en", "ja", "th", "vi", "es", "pt"] as const;

export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
  defaultLocale: "zh",
  localeDetection: false,
  localePrefix: "as-needed",
  locales,
});
