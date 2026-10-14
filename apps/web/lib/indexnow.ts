import { siteConfig } from "@/lib/site";
import { buildSitemapEntries } from "@/lib/sitemap-document";

/** IndexNow 协议上限。超了要拆批，目前全站远小于此。 */
export const INDEXNOW_MAX_URLS = 10_000;

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// 密钥公开托管在站点根目录，文件名与内容必须一致。轮换时两处一起改。
export const INDEXNOW_KEY = "b7e4c1a9f26d48e0a5c3b81d7f0e94a2";

export type IndexNowPayload = {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
};

export function indexNowKeyLocation(): string {
  return `${siteConfig.url}/${INDEXNOW_KEY}.txt`;
}

export function buildIndexNowPayload(
  urls: readonly string[] = buildSitemapEntries().map((entry) => entry.url),
): IndexNowPayload {
  if (urls.length > INDEXNOW_MAX_URLS) {
    throw new Error(
      `IndexNow accepts at most ${INDEXNOW_MAX_URLS} URLs per request`,
    );
  }

  return {
    host: siteConfig.host,
    key: INDEXNOW_KEY,
    keyLocation: indexNowKeyLocation(),
    urlList: [...urls],
  };
}
