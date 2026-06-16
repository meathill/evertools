import { HttpError } from "@/lib/http/response";

// 受控的服务端抓取核心：所有需要抓取「用户提供 URL」的功能共用（OG 分析、通用代理等）。
// 重点是 SSRF 防护——别让 Worker 沦为访问内网 / 云元数据的跳板。
export const SAFE_FETCH_DEFAULTS = {
  maxBytes: 5 * 1024 * 1024,
  maxRedirects: 3,
  timeoutMs: 8000,
} as const;

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (compatible; EvertoolsBot/1.0; +https://tools.meathill.com)";

export type SafeFetchOptions = {
  headers?: Record<string, string>;
  maxBytes?: number;
  maxRedirects?: number;
  timeoutMs?: number;
};

export type SafeFetchResult = {
  bytes: Uint8Array<ArrayBuffer>;
  finalUrl: string;
  headers: Headers;
  status: number;
};

function isIpv4(host: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
}

function isBlockedIpv4(host: string): boolean {
  const parts = host.split(".").map((part) => Number.parseInt(part, 10));
  if (parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b, c] = parts;
  if (a === 0) return true; // 0.0.0.0/8 本网络
  if (a === 10) return true; // 10/8 私有
  if (a === 127) return true; // 127/8 环回
  if (a === 169 && b === 254) return true; // 169.254/16 链路本地（含 169.254.169.254 云元数据）
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16/12 私有
  if (a === 192 && b === 168) return true; // 192.168/16 私有
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64/10 CGNAT
  if (a === 192 && b === 0 && c === 0) return true; // 192.0.0/24
  if (a >= 224) return true; // 224/4 组播 + 240/4 保留
  return false;
}

function isBlockedIpv6(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "::1" || h === "::") return true; // 环回 / 未指定
  if (/^fe[89ab]/.test(h)) return true; // fe80::/10 链路本地
  if (/^f[cd]/.test(h)) return true; // fc00::/7 ULA
  // IPv4-mapped (::ffff:a.b.c.d)：复查内嵌的 IPv4。
  const mapped = h.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mapped) return isBlockedIpv4(mapped[1]);
  return false;
}

// 注意：仅能筛字面量 IP 与 localhost。workerd 上无法自行解析 DNS、也拿不到实际命中的 IP，
// 故 DNS-rebinding（域名解析到内网）无法在此完全封堵，属已知残余风险。
export function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (isIpv4(host)) return isBlockedIpv4(host);
  if (host.includes(":")) return isBlockedIpv6(host);
  return false;
}

export function assertSafeUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new HttpError("INVALID_URL", 400);
  }
  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new HttpError("INVALID_URL", 400, url.protocol);
  }
  if (isBlockedHostname(url.hostname)) {
    throw new HttpError("BLOCKED_HOST", 400);
  }
  return url;
}

function isRedirectStatus(status: number): boolean {
  return (
    status === 301 ||
    status === 302 ||
    status === 303 ||
    status === 307 ||
    status === 308
  );
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function concatBytes(
  chunks: Uint8Array[],
  maxBytes: number,
): Uint8Array<ArrayBuffer> {
  const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  // 末尾分块可能略微超出上限，统一截断到 maxBytes。
  return total > maxBytes ? out.subarray(0, maxBytes) : out;
}

async function readBodyCapped(
  response: Response,
  maxBytes: number,
): Promise<Uint8Array<ArrayBuffer>> {
  const reader = response.body?.getReader();
  if (!reader) {
    return new Uint8Array(0);
  }
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.byteLength;
      if (total >= maxBytes) {
        await reader.cancel();
        break;
      }
    }
  }
  return concatBytes(chunks, maxBytes);
}

// 抓取 + 手动逐跳跟随重定向（每跳重跑 SSRF 筛查）+ 超时 + 限大小读取。
// fetch 作为参数注入，单测可传 fake，无需 stub 全局。
export async function safeFetch(
  rawUrl: string,
  options: SafeFetchOptions = {},
  fetchImpl: typeof fetch = fetch,
): Promise<SafeFetchResult> {
  const maxRedirects = options.maxRedirects ?? SAFE_FETCH_DEFAULTS.maxRedirects;
  const timeoutMs = options.timeoutMs ?? SAFE_FETCH_DEFAULTS.timeoutMs;
  const maxBytes = options.maxBytes ?? SAFE_FETCH_DEFAULTS.maxBytes;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let currentUrl = assertSafeUrl(rawUrl);
    for (let redirect = 0; redirect <= maxRedirects; redirect++) {
      const response = await fetchImpl(currentUrl.toString(), {
        headers: {
          Accept: "*/*",
          "User-Agent": DEFAULT_USER_AGENT,
          ...options.headers,
        },
        redirect: "manual",
        signal: controller.signal,
      });

      if (isRedirectStatus(response.status)) {
        const location = response.headers.get("location");
        await response.body?.cancel();
        if (!location) {
          return {
            bytes: new Uint8Array(0),
            finalUrl: currentUrl.toString(),
            headers: response.headers,
            status: response.status,
          };
        }
        currentUrl = assertSafeUrl(new URL(location, currentUrl).toString());
        continue;
      }

      const bytes = await readBodyCapped(response, maxBytes);
      return {
        bytes,
        finalUrl: currentUrl.toString(),
        headers: response.headers,
        status: response.status,
      };
    }
    throw new HttpError("TOO_MANY_REDIRECTS", 400);
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (isAbortError(error)) throw new HttpError("FETCH_TIMEOUT", 504);
    throw new HttpError(
      "FETCH_FAILED",
      502,
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    clearTimeout(timer);
  }
}
