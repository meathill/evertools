import {
  corsHeaders,
  handleOptions,
  HttpError,
  jsonError,
} from "@/lib/http/response";
import { safeFetch } from "@/lib/http/safe-fetch";

// 通用代理上限 5MB；SSRF 守卫 + 本站 origin 清单共同抗滥用。
const PROXY_MAX_BYTES = 5 * 1024 * 1024;

// GET /api/fetch?url=<encoded>：服务端安全抓取后，带 CORS 头回传原始内容，
// 供将来需要跨域原始数据的客户端工具使用（不是 OG 专用）。
export async function GET(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  const target = new URL(request.url).searchParams.get("url");
  try {
    if (!target) {
      throw new HttpError("INVALID_URL", 400);
    }
    const result = await safeFetch(target, { maxBytes: PROXY_MAX_BYTES });
    if (result.status >= 400) {
      throw new HttpError("UPSTREAM_ERROR", 502, String(result.status));
    }
    const contentType =
      result.headers.get("content-type") ?? "application/octet-stream";
    return new Response(result.bytes, {
      headers: {
        ...corsHeaders(origin),
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "Content-Type": contentType,
      },
      status: 200,
    });
  } catch (error) {
    return jsonError(error, origin);
  }
}

export function OPTIONS(request: Request): Response {
  return handleOptions(request.headers.get("origin"));
}
