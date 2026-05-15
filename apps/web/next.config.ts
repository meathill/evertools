import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  reactStrictMode: true,
  serverExternalPackages: ["pdfjs-dist", "pdf-lib", "@pdf-lib/fontkit"],
};

export default withNextIntl(nextConfig);
