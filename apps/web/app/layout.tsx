import { GoogleAnalytics } from "@next/third-parties/google";
import { Fraunces, JetBrains_Mono, Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

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
        {children}
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      </body>
    </html>
  );
}
