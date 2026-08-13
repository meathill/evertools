import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { OG_IMAGE_CACHE_RULE } from "./lib/cache-headers";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  reactStrictMode: true,
  serverExternalPackages: ["pdfjs-dist", "pdf-lib", "@pdf-lib/fontkit"],
  async headers() {
    return [OG_IMAGE_CACHE_RULE];
  },
};

export default withNextIntl(nextConfig);
