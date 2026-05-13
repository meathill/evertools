import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { getLocaleFromParams } from "@/lib/locale";
import {
  createLocalizedUrl,
  getLanguageAlternates,
  localeMetadata,
  siteConfig,
} from "@/lib/site";
import { getLocaleContent } from "@/messages";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);
  const localeInfo = localeMetadata[locale];
  const title = `${siteConfig.name} | ${content.metadata.defaultTitle}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    applicationName: siteConfig.name,
    description: content.metadata.siteDescription,
    alternates: {
      canonical: createLocalizedUrl(locale, "/"),
      languages: getLanguageAlternates("/"),
    },
    openGraph: {
      type: "website",
      url: createLocalizedUrl(locale, "/"),
      siteName: siteConfig.name,
      locale: localeInfo.openGraphLocale,
      title,
      description: content.metadata.siteDescription,
      images: [
        {
          alt: siteConfig.name,
          height: 630,
          url: createLocalizedUrl(locale, "/opengraph-image"),
          width: 1200,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: content.metadata.siteDescription,
      images: [createLocalizedUrl(locale, "/opengraph-image")],
    },
    robots: {
      follow: true,
      index: true,
      googleBot: {
        follow: true,
        index: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = await getLocaleFromParams(params);
  const content = getLocaleContent(locale);

  setRequestLocale(locale);

  return (
    <div className="isolate relative flex min-h-svh flex-col">
      <SiteHeader content={content.header} locale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter content={content.footer} locale={locale} />
    </div>
  );
}
