// OG 校验核心：纯函数，网址模式（服务端）与上传模式（客户端）共用，保证判定一致。
// 校验结果只携带稳定 id + 可插值 values，文案在前端按 id 本地化。

export const OG_PLATFORMS = [
  "facebook",
  "twitter",
  "linkedin",
  "discord",
  "slack",
] as const;
export type OgPlatform = (typeof OG_PLATFORMS)[number];

export type CheckStatus = "pass" | "warn" | "fail";

export type CheckResult = {
  id: string;
  status: CheckStatus;
  values?: Record<string, string | number>;
};

export type PlatformReport = {
  checks: CheckResult[];
  platform: OgPlatform;
  status: CheckStatus;
};

export type ValidationReport = {
  general: CheckResult[];
  overall: CheckStatus;
  platforms: PlatformReport[];
};

export type ParsedTags = {
  canonical?: string;
  description?: string;
  favicon?: string;
  og: {
    description?: string;
    image?: string;
    imageAlt?: string;
    imageHeight?: number;
    imageWidth?: number;
    siteName?: string;
    title?: string;
    type?: string;
    url?: string;
  };
  title?: string;
  twitter: {
    card?: string;
    description?: string;
    image?: string;
    site?: string;
    title?: string;
  };
};

export type ImageFacts = {
  byteSize: number | null;
  filesizeKnown: boolean;
  format: string | null; // 归一化小写：'jpeg'|'png'|'webp'|'gif'|'avif'…
  height: number | null;
  width: number | null;
};

export type EffectiveTags = {
  card: string;
  description?: string;
  image?: string;
  title?: string;
};

// 通用甜点：1200×630、比例 1.91:1，是 FB/LinkedIn/Twitter(summary_large_image) 的共同推荐值。
export const OG_IDEAL = { height: 630, ratio: 1.91, width: 1200 } as const;
const RATIO_TOLERANCE = 0.1;
const HARD_MIN = { height: 200, width: 200 } as const;

const KB = 1024;
const MB = 1024 * KB;

type PlatformSpec = {
  formats: readonly string[];
  maxBytes: number;
  minHeight: number;
  minWidth: number;
  requiredTags: readonly string[];
};

// 数字依据各家官方/开发者文档（2026 现状）。规格常变，集中此处便于审计更新。
// 不支持的格式判 warn 而非 fail（平台多能回退/仍显示），避免误报。
export const PLATFORM_SPECS: Record<OgPlatform, PlatformSpec> = {
  // FB：建议 1200×630，最低 200×200，最大 8MB；读 og:*。
  facebook: {
    formats: ["jpeg", "png", "gif", "webp"],
    maxBytes: 8 * MB,
    minHeight: 200,
    minWidth: 200,
    requiredTags: ["og:title", "og:image"],
  },
  // X：summary_large_image 建议 ≥300×157、理想 1200×628，最大 5MB；
  // 需 twitter:card，图片/标题可从 og 回退，故不单列为必需。
  twitter: {
    formats: ["jpeg", "png", "gif", "webp"],
    maxBytes: 5 * MB,
    minHeight: 157,
    minWidth: 300,
    requiredTags: ["twitter:card"],
  },
  // LinkedIn：建议 1200×627、比例 1.91:1，最大 ~5MB；只读 og:*，webp 支持不稳→不在列表→warn。
  linkedin: {
    formats: ["jpeg", "png", "gif"],
    maxBytes: 5 * MB,
    minHeight: 105,
    minWidth: 200,
    requiredTags: ["og:title", "og:image"],
  },
  // Discord：读 og:*/twitter:*，建议 1200×630，嵌入图上限约 8MB。
  discord: {
    formats: ["jpeg", "png", "gif", "webp"],
    maxBytes: 8 * MB,
    minHeight: 105,
    minWidth: 200,
    requiredTags: ["og:image"],
  },
  // Slack unfurl：读 og:*；无公开硬性尺寸下限，体积保守取 5MB。
  slack: {
    formats: ["jpeg", "png", "gif", "webp"],
    maxBytes: 5 * MB,
    minHeight: 105,
    minWidth: 200,
    requiredTags: ["og:title", "og:image"],
  },
};

// 社媒抓取的真实回退顺序：twitter:* → og:* → 文档级 <title>/description。
export function resolveEffectiveTags(tags: ParsedTags): EffectiveTags {
  return {
    card: tags.twitter.card ?? "summary_large_image",
    description:
      tags.twitter.description ?? tags.og.description ?? tags.description,
    image: tags.og.image ?? tags.twitter.image,
    title: tags.twitter.title ?? tags.og.title ?? tags.title,
  };
}

function rollup(checks: readonly CheckResult[]): CheckStatus {
  if (checks.some((check) => check.status === "fail")) return "fail";
  if (checks.some((check) => check.status === "warn")) return "warn";
  return "pass";
}

function hasText(value: string | undefined): boolean {
  return Boolean(value && value.trim());
}

// 必需标签缺失判 fail，推荐标签缺失判 warn。
function tagCheck(
  id: string,
  value: string | undefined,
  required: boolean,
): CheckResult {
  if (hasText(value)) return { id, status: "pass" };
  return { id, status: required ? "fail" : "warn" };
}

function checkDimensions(image: ImageFacts): CheckResult {
  const { width, height } = image;
  if (!width || !height) {
    return { id: "image-dimensions", status: "warn" }; // 尺寸未知 → 提示而非判错
  }
  const values = {
    height,
    idealHeight: OG_IDEAL.height,
    idealWidth: OG_IDEAL.width,
    width,
  };
  if (width < HARD_MIN.width || height < HARD_MIN.height) {
    return { id: "image-dimensions", status: "fail", values };
  }
  if (width < OG_IDEAL.width || height < OG_IDEAL.height) {
    return { id: "image-dimensions", status: "warn", values };
  }
  return { id: "image-dimensions", status: "pass", values };
}

function checkRatio(image: ImageFacts): CheckResult {
  const { width, height } = image;
  if (!width || !height) return { id: "image-ratio", status: "warn" };
  const ratio = Math.round((width / height) * 100) / 100;
  return {
    id: "image-ratio",
    status:
      Math.abs(ratio - OG_IDEAL.ratio) <= RATIO_TOLERANCE ? "pass" : "warn",
    values: { idealRatio: OG_IDEAL.ratio, ratio },
  };
}

function checkPlatformMinSize(
  image: ImageFacts,
  spec: PlatformSpec,
): CheckResult {
  if (!image.width || !image.height) {
    return { id: "platform-min-size", status: "warn" };
  }
  const ok = image.width >= spec.minWidth && image.height >= spec.minHeight;
  return {
    id: "platform-min-size",
    status: ok ? "pass" : "fail",
    values: {
      height: image.height,
      minHeight: spec.minHeight,
      minWidth: spec.minWidth,
      width: image.width,
    },
  };
}

function checkPlatformFilesize(
  image: ImageFacts,
  spec: PlatformSpec,
): CheckResult {
  if (!image.filesizeKnown || image.byteSize == null) {
    return { id: "platform-filesize", status: "warn" };
  }
  const ok = image.byteSize <= spec.maxBytes;
  return {
    id: "platform-filesize",
    status: ok ? "pass" : "fail",
    values: { bytes: image.byteSize, maxBytes: spec.maxBytes },
  };
}

function checkPlatformFormat(
  image: ImageFacts,
  spec: PlatformSpec,
): CheckResult {
  if (!image.format) return { id: "platform-format", status: "warn" };
  const ok = spec.formats.includes(image.format);
  return {
    id: "platform-format",
    status: ok ? "pass" : "warn",
    values: { format: image.format },
  };
}

function isRequiredTagPresent(
  tag: string,
  tags: ParsedTags,
  effective: EffectiveTags,
): boolean {
  switch (tag) {
    case "og:title":
      return hasText(effective.title);
    case "og:image":
      return hasText(effective.image);
    case "og:description":
      return hasText(effective.description);
    case "twitter:card":
      return hasText(tags.twitter.card);
    default:
      return false;
  }
}

function checkRequiredTags(
  tags: ParsedTags,
  effective: EffectiveTags,
  spec: PlatformSpec,
): CheckResult {
  const missing = spec.requiredTags.filter(
    (tag) => !isRequiredTagPresent(tag, tags, effective),
  );
  return {
    id: "platform-required-tags",
    status: missing.length === 0 ? "pass" : "fail",
    values: { missing: missing.join(", ") },
  };
}

function buildPlatformReport(
  platform: OgPlatform,
  image: ImageFacts,
  tags: ParsedTags | null,
  effective: EffectiveTags | null,
): PlatformReport {
  const spec = PLATFORM_SPECS[platform];
  const checks: CheckResult[] = [
    checkPlatformMinSize(image, spec),
    checkPlatformFilesize(image, spec),
    checkPlatformFormat(image, spec),
  ];
  if (tags && effective) {
    checks.push(checkRequiredTags(tags, effective, spec));
  }
  return { checks, platform, status: rollup(checks) };
}

function buildGeneralImageChecks(image: ImageFacts): CheckResult[] {
  const checks = [checkDimensions(image)];
  if (image.width && image.height) checks.push(checkRatio(image));
  return checks;
}

// 网址模式：标签 + 图片事实 → 全量报告。
export function validateUrlResult(
  tags: ParsedTags,
  image: ImageFacts,
): ValidationReport {
  const effective = resolveEffectiveTags(tags);
  const general: CheckResult[] = [
    tagCheck("tag-title", effective.title, true),
    tagCheck("tag-description", effective.description, false),
    tagCheck("tag-og-image", effective.image, true),
    tagCheck("tag-og-url", tags.og.url, false),
    tagCheck("tag-twitter-card", tags.twitter.card, false),
    tagCheck("tag-image-alt", tags.og.imageAlt, false),
    ...buildGeneralImageChecks(image),
  ];
  const platforms = OG_PLATFORMS.map((platform) =>
    buildPlatformReport(platform, image, tags, effective),
  );
  const overall = rollup([
    ...general,
    ...platforms.flatMap((report) => report.checks),
  ]);
  return { general, overall, platforms };
}

// 上传模式：只有一张图，跑图片维度，不跑标签检查。
export function validateUploadedImage(image: ImageFacts): ValidationReport {
  const general = buildGeneralImageChecks(image);
  const platforms = OG_PLATFORMS.map((platform) =>
    buildPlatformReport(platform, image, null, null),
  );
  const overall = rollup([
    ...general,
    ...platforms.flatMap((report) => report.checks),
  ]);
  return { general, overall, platforms };
}
