import type { OutputFormat } from "@/lib/image-converter";

// 转换落地页（/tools/{from}-to-{to}）的配置中心。
// 标签在各语言间一致，因此放在这里而非 i18n。
export const CONVERSION_FORMAT_LABELS = {
  heic: "HEIC",
  jpg: "JPG",
  png: "PNG",
  webp: "WebP",
} as const;

export type ConversionFormat = keyof typeof CONVERSION_FORMAT_LABELS;
// HEIC 仅作输入（canvas 无法跨浏览器编码 HEIC），所以不能作为输出。
export type ConversionTarget = Exclude<ConversionFormat, "heic">;

const OUTPUT_FORMAT_BY_TARGET: Record<ConversionTarget, OutputFormat> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export type ConversionPair = {
  from: ConversionFormat;
  to: ConversionTarget;
};

// 常见配对矩阵：HEIC 来源 + PNG/JPG/WebP 互转。
export const CONVERSION_PAIRS: readonly ConversionPair[] = [
  { from: "heic", to: "jpg" },
  { from: "heic", to: "png" },
  { from: "heic", to: "webp" },
  { from: "png", to: "jpg" },
  { from: "png", to: "webp" },
  { from: "jpg", to: "png" },
  { from: "jpg", to: "webp" },
  { from: "webp", to: "png" },
  { from: "webp", to: "jpg" },
] as const;

export function conversionSlug(pair: ConversionPair): string {
  return `${pair.from}-to-${pair.to}`;
}

export function conversionFormatLabel(format: ConversionFormat): string {
  return CONVERSION_FORMAT_LABELS[format];
}

export function conversionOutputFormat(target: ConversionTarget): OutputFormat {
  return OUTPUT_FORMAT_BY_TARGET[target];
}

const pairBySlug = new Map(
  CONVERSION_PAIRS.map((pair) => [conversionSlug(pair), pair]),
);

// 仅白名单 slug 命中，未知 slug 返回 null（路由据此 404）。
export function parseConversionSlug(slug: string): ConversionPair | null {
  return pairBySlug.get(slug) ?? null;
}
