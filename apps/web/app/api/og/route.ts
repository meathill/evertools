import {
  HttpError,
  handleOptions,
  jsonError,
  jsonOk,
} from "@/lib/http/response";
import { safeFetch } from "@/lib/http/safe-fetch";
import { parseHeadTags } from "@/lib/og/html";
import { fetchImageMeta } from "@/lib/og/image-meta";
import {
  type ImageFacts,
  resolveEffectiveTags,
  validateUrlResult,
} from "@/lib/og/validator";

// 社媒爬虫只读 <head>，1MB 足够，避免被超大页拖垮。
const HTML_MAX_BYTES = 1024 * 1024;
const HTML_CONTENT_TYPE = /^(text\/html|application\/xhtml\+xml)/i;

const EMPTY_IMAGE: ImageFacts = {
  byteSize: null,
  filesizeKnown: false,
  format: null,
  height: null,
  width: null,
};

// GET /api/og?url=<encoded>：抓取页面 → 解析标签 → 取图片元信息 → 校验 → 返回报告。
export async function GET(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  const target = new URL(request.url).searchParams.get("url");
  try {
    if (!target) {
      throw new HttpError("INVALID_URL", 400);
    }
    const page = await safeFetch(target, { maxBytes: HTML_MAX_BYTES });
    if (page.status >= 400) {
      throw new HttpError("UPSTREAM_ERROR", 502, String(page.status));
    }
    const contentType = page.headers.get("content-type") ?? "";
    if (!HTML_CONTENT_TYPE.test(contentType)) {
      throw new HttpError("NOT_HTML", 415, contentType || undefined);
    }

    const html = new TextDecoder("utf-8").decode(page.bytes);
    const tags = parseHeadTags(html, page.finalUrl);
    const effective = resolveEffectiveTags(tags);
    // 图片抓取失败不致命：置空，由校验报告体现为 warn。
    const image = effective.image
      ? await fetchImageMeta(effective.image).catch(() => EMPTY_IMAGE)
      : EMPTY_IMAGE;
    const report = validateUrlResult(tags, image);

    return jsonOk({ finalUrl: page.finalUrl, image, report, tags }, origin, {
      // 工具用于「改完标签再验证」，缓存放短，避免看到旧结果。
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return jsonError(error, origin);
  }
}

export function OPTIONS(request: Request): Response {
  return handleOptions(request.headers.get("origin"));
}
