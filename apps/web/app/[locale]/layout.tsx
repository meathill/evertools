import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Nunito } from "next/font/google";
import Script from "next/script";
import { setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { getLocaleFromParams } from "@/lib/locale";
import { ADSENSE_CLIENT_ID } from "@/lib/ads";
import {
  createLocalizedUrl,
  getLanguageAlternates,
  localeMetadata,
  siteConfig,
  siteIcons,
} from "@/lib/site";
import { cn } from "@/lib/utils";
import { getLocaleContent } from "@/messages";

const GOOGLE_ANALYTICS_ID = "G-1S0T1HF97B";
// Microsoft Clarity，tools.meathill.com 独立项目（与博客 meathill.com 分开）。
const CLARITY_PROJECT_ID = "zhpojb3g0o";

// 用独立 CSS 变量挂 next/font，globals.css 的字族栈再引用它们，
// 这样 size-adjust fallback 才会生效，减轻 webfont 交换时的 CLS。
const fontDisplay = Fraunces({
  adjustFontFallback: true,
  display: "swap",
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["700", "800"],
});

const fontSans = Nunito({
  adjustFontFallback: true,
  display: "swap",
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
});

const fontMono = JetBrains_Mono({
  adjustFontFallback: true,
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jetbrains",
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
    icons: siteIcons,
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
        {/* @next/third-parties 的 GoogleAnalytics 固定 afterInteractive，会挤进 TBT 窗口。
            统计不参与首屏交互，跟 AdSense 一样放到 load 之后。 */}
        <Script id="google-analytics" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GOOGLE_ANALYTICS_ID}');`}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="lazyOnload"
        />
        {/* Clarity 官方片段，同 GA 放到 load 之后。 */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");`}
        </Script>
      </body>
    </html>
  );
}
