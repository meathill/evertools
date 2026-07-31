import type { OutputFormat } from "@/lib/image-converter";

// 转换落地页（/tools/{from}-to-{to}）的配置中心。
// 标签在各语言间一致，因此放在这里而非 i18n。
export const CONVERSION_FORMAT_LABELS = {
  avif: "AVIF",
  bmp: "BMP",
  gif: "GIF",
  heic: "HEIC",
  jpg: "JPG",
  png: "PNG",
  webp: "WebP",
} as const;

export type ConversionFormat = keyof typeof CONVERSION_FORMAT_LABELS;
// canvas 只保证能编码 PNG/JPEG/WebP，其余格式一律只作输入。
export type ConversionTarget = "jpg" | "png" | "webp";

const OUTPUT_FORMAT_BY_TARGET: Record<ConversionTarget, OutputFormat> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

// 决定落地页文案的格式特性。落地页的"注意事项"全部由这张表推导，
// 新增格式只要填这里，文案组合自动成立。
type FormatTraits = {
  // 支持透明通道；转到不支持的目标时会被填成白底。
  hasAlpha: boolean;
  // 可能是动图；本工具只取第一帧。
  isAnimated: boolean;
  // 有损压缩；转成无损目标不会找回已丢失的细节。
  isLossy: boolean;
};

const FORMAT_TRAITS: Record<ConversionFormat, FormatTraits> = {
  avif: { hasAlpha: true, isAnimated: true, isLossy: true },
  bmp: { hasAlpha: false, isAnimated: false, isLossy: false },
  gif: { hasAlpha: true, isAnimated: true, isLossy: false },
  heic: { hasAlpha: false, isAnimated: false, isLossy: true },
  jpg: { hasAlpha: false, isAnimated: false, isLossy: true },
  png: { hasAlpha: true, isAnimated: false, isLossy: false },
  webp: { hasAlpha: true, isAnimated: true, isLossy: true },
};

export type ConversionPair = {
  from: ConversionFormat;
  to: ConversionTarget;
};

// 落地页矩阵：4 个"只进不出"的来源（HEIC/AVIF/GIF/BMP）× 3 个目标，
// 外加 PNG/JPG/WebP 三者互转。
export const CONVERSION_PAIRS: readonly ConversionPair[] = [
  { from: "heic", to: "jpg" },
  { from: "heic", to: "png" },
  { from: "heic", to: "webp" },
  { from: "avif", to: "jpg" },
  { from: "avif", to: "png" },
  { from: "avif", to: "webp" },
  { from: "gif", to: "png" },
  { from: "gif", to: "jpg" },
  { from: "gif", to: "webp" },
  { from: "bmp", to: "jpg" },
  { from: "bmp", to: "png" },
  { from: "bmp", to: "webp" },
  { from: "png", to: "jpg" },
  { from: "png", to: "webp" },
  { from: "jpg", to: "png" },
  { from: "jpg", to: "webp" },
  { from: "webp", to: "png" },
  { from: "webp", to: "jpg" },
] as const;

// 按配对推导出的注意事项。顺序即页面展示顺序，越靠前越该被用户先看到。
export const CONVERSION_NOTE_KEYS = [
  "heicDecode",
  "alphaLoss",
  "animationLoss",
  "upconvert",
  "sizeGain",
  "qualityControl",
  "losslessOutput",
] as const;

export type ConversionNoteKey = (typeof CONVERSION_NOTE_KEYS)[number];

const NOTE_PREDICATES: Record<
  ConversionNoteKey,
  (from: FormatTraits, to: FormatTraits, pair: ConversionPair) => boolean
> = {
  // HEIC 走 wasm 解码，和其它格式的原生 <img> 解码不是一条路径，值得单独说明。
  heicDecode: (_from, _to, pair) => pair.from === "heic",
  alphaLoss: (from, to) => from.hasAlpha && !to.hasAlpha,
  animationLoss: (from) => from.isAnimated,
  upconvert: (from, to) => from.isLossy && !to.isLossy,
  sizeGain: (from, to) => !from.isLossy && to.isLossy,
  qualityControl: (_from, to) => to.isLossy,
  losslessOutput: (_from, to) => !to.isLossy,
};

export function conversionNoteKeys(
  pair: ConversionPair,
): readonly ConversionNoteKey[] {
  const from = FORMAT_TRAITS[pair.from];
  const to = FORMAT_TRAITS[pair.to];

  return CONVERSION_NOTE_KEYS.filter((key) =>
    NOTE_PREDICATES[key](from, to, pair),
  );
}

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
