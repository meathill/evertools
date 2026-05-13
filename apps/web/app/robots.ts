import type { MetadataRoute } from "next";
import { createAbsoluteUrl, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteConfig.host,
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: createAbsoluteUrl("/sitemap.xml"),
  };
}
