import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Nunito } from "next/font/google";
import Script from "next/script";
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
import { cn } from "@/lib/utils";
import { getLocaleContent } from "@/messages";

const ADSENSE_CLIENT_ID = "ca-pub-9946806099979342";
const GOOGLE_ANALYTICS_ID = "G-1S0T1HF97B";

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const fontSans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

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
    <html
      className="h-full antialiased"
      lang={localeMetadata[locale].languageTag}
      suppressHydrationWarning
    >
      <head>
        <Script
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          strategy="lazyOnload"
        />
      </head>
      <body
        className={cn(
          "relative min-h-full bg-background text-foreground",
          fontDisplay.variable,
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <div className="isolate relative flex min-h-svh flex-col">
          <SiteHeader content={content.header} locale={locale} />
          <main className="flex-1">{children}</main>
          <SiteFooter content={content.footer} locale={locale} />
        </div>
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      </body>
    </html>
  );
}
