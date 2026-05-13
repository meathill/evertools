import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const ADSENSE_CLIENT_ID = "ca-pub-9946806099979342";
const GOOGLE_ANALYTICS_ID = "G-1S0T1HF97B";

const fontHeading = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full antialiased" suppressHydrationWarning>
      <head>
        <Script
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          strategy="afterInteractive"
        />
      </head>
      <body
        className={cn(
          "relative min-h-full bg-background text-foreground",
          fontSans.variable,
          fontHeading.variable,
          fontMono.variable,
        )}
      >
        {children}
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      </body>
    </html>
  );
}
