import {
  HttpError,
  handleOptions,
  jsonError,
  jsonOk,
} from "@/lib/http/response";
import { safeFetch } from "@/lib/http/safe-fetch";
import { validateSitemap } from "@/lib/sitemap/validator";

// sitemap 协议体积上限 50MB，对 Worker 单次请求偏大；这里用更保守的抓取上限，
// 命中上限不会静默截断结果——report 里会带 content-truncated 提示。
const FETCH_MAX_BYTES = 10 * 1024 * 1024;
const GZIP_MAGIC_BYTE_0 = 0x1f;
const GZIP_MAGIC_BYTE_1 = 0x8b;

function isGzipBytes(bytes: Uint8Array): boolean {
  return bytes[0] === GZIP_MAGIC_BYTE_0 && bytes[1] === GZIP_MAGIC_BYTE_1;
}

// GET /api/sitemap?url=<encoded>：抓取 sitemap.xml → 解析 → 按协议规范校验 → 返回结构化报告。
export async function GET(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  const target = new URL(request.url).searchParams.get("url");
  try {
    if (!target) {
      throw new HttpError("INVALID_URL", 400);
    }
    const page = await safeFetch(target, { maxBytes: FETCH_MAX_BYTES });
    if (page.status >= 400) {
      throw new HttpError("UPSTREAM_ERROR", 502, String(page.status));
    }
    const isGzip = isGzipBytes(page.bytes);
    const xml = isGzip ? "" : new TextDecoder("utf-8").decode(page.bytes);
    const report = validateSitemap(xml, {
      byteSize: page.bytes.byteLength,
      isGzip,
      truncated: page.bytes.byteLength >= FETCH_MAX_BYTES,
    });

    return jsonOk({ finalUrl: page.finalUrl, report }, origin, {
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
