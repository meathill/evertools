import { imageSize } from "image-size";
import { safeFetch } from "@/lib/http/safe-fetch";
import type { ImageFacts } from "@/lib/og/validator";

const IMAGE_PROBE_BYTES = 64 * 1024; // 头部 64KB 足够读出主流格式宽高
const IMAGE_MAX_BYTES = 256 * 1024; // 服务器忽略 Range 时的兜底上限

function normalizeFormat(type: string | undefined): string | null {
  if (!type) return null;
  const lower = type.toLowerCase();
  return lower === "jpg" ? "jpeg" : lower;
}

// 从头部字节读尺寸/格式；头部不足或损坏时 image-size 抛错 → 返回空，交上层降级为 warn。
export function readImageDimensions(bytes: Uint8Array): {
  format: string | null;
  height: number | null;
  width: number | null;
} {
  try {
    const result = imageSize(bytes);
    return {
      format: normalizeFormat(result.type),
      height: result.height ?? null,
      width: result.width ?? null,
    };
  } catch {
    return { format: null, height: null, width: null };
  }
}

// 优先用 Content-Range 的总大小（206 响应也能拿到真实体积），否则用 Content-Length。
// 注意：206 的 Content-Length 是分片大小而非全量，故不能直接当体积用。
function resolveByteSize(headers: Headers): number | null {
  const contentRange = headers.get("content-range");
  if (contentRange) {
    const total = contentRange.split("/")[1]?.trim();
    if (total && total !== "*") {
      const parsed = Number.parseInt(total, 10);
      if (Number.isFinite(parsed)) return parsed;
    }
    return null; // 有 Range 响应但拿不到总量 → 体积未知
  }
  const contentLength = headers.get("content-length");
  if (contentLength) {
    const parsed = Number.parseInt(contentLength, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

// 复用 safeFetch（同一 SSRF 守卫）抓 og:image：ranged GET 只取头部，读尺寸/体积/格式。
export async function fetchImageMeta(
  imageUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ImageFacts> {
  const result = await safeFetch(
    imageUrl,
    {
      headers: { Range: `bytes=0-${IMAGE_PROBE_BYTES - 1}` },
      maxBytes: IMAGE_MAX_BYTES,
      timeoutMs: 6000,
    },
    fetchImpl,
  );

  const dimensions = readImageDimensions(result.bytes);
  const byteSize = resolveByteSize(result.headers);

  return {
    byteSize,
    filesizeKnown: byteSize != null,
    format: dimensions.format,
    height: dimensions.height,
    width: dimensions.width,
  };
}
