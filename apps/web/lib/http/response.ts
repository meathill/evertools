import { siteConfig } from "@/lib/site";

// 后端路由共用的错误码：机器码，前端按码本地化文案。
export const ERROR_CODES = {
  BLOCKED_HOST: "BLOCKED_HOST",
  FETCH_FAILED: "FETCH_FAILED",
  FETCH_TIMEOUT: "FETCH_TIMEOUT",
  INVALID_URL: "INVALID_URL",
  NOT_HTML: "NOT_HTML",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
  TOO_MANY_REDIRECTS: "TOO_MANY_REDIRECTS",
  UNKNOWN: "UNKNOWN",
  UPSTREAM_ERROR: "UPSTREAM_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// 抓取/解析过程中可预期的失败：携带对外错误码与 HTTP 状态。
export class HttpError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly detail?: string;

  constructor(code: ErrorCode, status: number, detail?: string) {
    super(code);
    this.name = "HttpError";
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}

// CORS 只放行本站源（生产域名 + 本地开发），不开放给任意第三方，
// 避免 Worker 被当成免费开放代理。服务器到服务器调用不受 CORS 影响，靠 SSRF 守卫兜底。
function isAllowedOrigin(origin: string): boolean {
  if (origin === siteConfig.url) {
    return true;
  }
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export function corsHeaders(
  requestOrigin: string | null,
): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    Vary: "Origin",
  };
  if (requestOrigin && isAllowedOrigin(requestOrigin)) {
    headers["Access-Control-Allow-Origin"] = requestOrigin;
  }
  return headers;
}

export function handleOptions(requestOrigin: string | null): Response {
  return new Response(null, {
    headers: corsHeaders(requestOrigin),
    status: 204,
  });
}

export function jsonOk(
  data: Record<string, unknown>,
  requestOrigin: string | null = null,
  init?: ResponseInit,
): Response {
  return Response.json(
    { ok: true, ...data },
    {
      ...init,
      headers: { ...corsHeaders(requestOrigin), ...init?.headers },
    },
  );
}

export function jsonError(
  error: unknown,
  requestOrigin: string | null = null,
): Response {
  const httpError =
    error instanceof HttpError
      ? error
      : new HttpError(ERROR_CODES.UNKNOWN, 500);
  const body: { code: ErrorCode; detail?: string; ok: false } = {
    code: httpError.code,
    ok: false,
  };
  if (httpError.detail) {
    body.detail = httpError.detail;
  }
  return Response.json(body, {
    headers: corsHeaders(requestOrigin),
    status: httpError.status,
  });
}
