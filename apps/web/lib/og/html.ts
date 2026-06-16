import { parse } from "node-html-parser";
import type { ParsedTags } from "@/lib/og/validator";

// 相对/协议相对/绝对路径统一规整成绝对 URL；非法返回 undefined。
function absolutize(
  href: string | undefined,
  base: string,
): string | undefined {
  if (!href) return undefined;
  try {
    return new URL(href, base).toString();
  } catch {
    return undefined;
  }
}

function toInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

// 解析页面 <head> 的社媒/SEO 元信息。node-html-parser 容错足够，纯函数可单测。
// baseUrl 用重定向后的 finalUrl，确保相对 og:image 相对正确位置解析。
export function parseHeadTags(html: string, baseUrl: string): ParsedTags {
  const root = parse(html, { comment: false });

  // OG 用 property，Twitter/SEO 用 name，统一取；同名只取首个。
  const metaMap = new Map<string, string>();
  for (const element of root.querySelectorAll("meta")) {
    const key = (
      element.getAttribute("property") ?? element.getAttribute("name")
    )?.toLowerCase();
    const content = element.getAttribute("content");
    if (key && content != null && !metaMap.has(key)) {
      metaMap.set(key, content.trim());
    }
  }
  const meta = (key: string): string | undefined =>
    metaMap.get(key) || undefined;

  const title = root.querySelector("title")?.textContent?.trim() || undefined;
  const canonicalHref = root
    .querySelector('link[rel="canonical"]')
    ?.getAttribute("href");
  const iconHref = root
    .querySelectorAll("link")
    .find((link) =>
      (link.getAttribute("rel") ?? "").toLowerCase().includes("icon"),
    )
    ?.getAttribute("href");

  return {
    canonical: absolutize(canonicalHref, baseUrl),
    description: meta("description"),
    favicon: absolutize(iconHref ?? "/favicon.ico", baseUrl),
    og: {
      description: meta("og:description"),
      image: absolutize(meta("og:image") ?? meta("og:image:url"), baseUrl),
      imageAlt: meta("og:image:alt"),
      imageHeight: toInt(meta("og:image:height")),
      imageWidth: toInt(meta("og:image:width")),
      siteName: meta("og:site_name"),
      title: meta("og:title"),
      type: meta("og:type"),
      url: absolutize(meta("og:url"), baseUrl),
    },
    title,
    twitter: {
      card: meta("twitter:card"),
      description: meta("twitter:description"),
      image: absolutize(
        meta("twitter:image") ?? meta("twitter:image:src"),
        baseUrl,
      ),
      site: meta("twitter:site"),
      title: meta("twitter:title"),
    },
  };
}
