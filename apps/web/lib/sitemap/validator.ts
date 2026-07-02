import { parse } from "node-html-parser";

// Sitemap 校验核心：纯函数，服务端 API 路由调用。规则依据 sitemaps.org 协议。
// 用 node-html-parser 解析（现有依赖，见 lib/og/html.ts），它对 XML 较宽容、不校验良构性，
// 因此这里只做「结构存在性 + 字段合法性」判断，无法保证严格 XML 合法性——已知限制。
export const SITEMAP_LIMITS = {
  maxBytes: 50 * 1024 * 1024,
  maxEntries: 50_000,
  maxSampleIssues: 20,
} as const;

const CHANGEFREQ_VALUES = new Set([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
]);

// 覆盖 YYYY / YYYY-MM / YYYY-MM-DD / 带时分秒与时区的完整 W3C datetime。
const LASTMOD_RE =
  /^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?)?)?$/;

export type CheckStatus = "pass" | "warn" | "fail";

export type CheckResult = {
  id: string;
  status: CheckStatus;
  values?: Record<string, string | number>;
};

export type SitemapRootType = "urlset" | "sitemapindex" | "unknown";

export type EntryIssue = {
  checks: CheckResult[];
  loc: string | null;
};

export type ValidationReport = {
  byteSize: number;
  entryCount: number;
  general: CheckResult[];
  issues: EntryIssue[];
  overall: CheckStatus;
  rootType: SitemapRootType;
  totalIssueCount: number;
};

type RawEntry = {
  changefreq?: string;
  lastmod?: string;
  loc: string | null;
  priority?: string;
};

type ParsedSitemap = {
  entries: RawEntry[];
  rootType: SitemapRootType;
};

type XmlElement = {
  querySelector(selector: string): XmlElement | null;
  textContent?: string;
};

function textOf(el: XmlElement, tag: string): string | undefined {
  const value = el.querySelector(tag)?.textContent?.trim();
  return value ? value : undefined;
}

export function parseSitemapXml(xml: string): ParsedSitemap {
  const root = parse(xml, { comment: false });

  if (root.querySelector("sitemapindex")) {
    const entries = root.querySelectorAll("sitemap").map((el) => ({
      lastmod: textOf(el, "lastmod"),
      loc: textOf(el, "loc") ?? null,
    }));
    return { entries, rootType: "sitemapindex" };
  }

  if (root.querySelector("urlset")) {
    const entries = root.querySelectorAll("url").map((el) => ({
      changefreq: textOf(el, "changefreq"),
      lastmod: textOf(el, "lastmod"),
      loc: textOf(el, "loc") ?? null,
      priority: textOf(el, "priority"),
    }));
    return { entries, rootType: "urlset" };
  }

  return { entries: [], rootType: "unknown" };
}

function isValidAbsoluteUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidLastmod(value: string): boolean {
  return LASTMOD_RE.test(value) && !Number.isNaN(Date.parse(value));
}

function isValidPriority(value: string): boolean {
  if (!/^\d(\.\d+)?$/.test(value)) return false;
  const num = Number(value);
  return num >= 0 && num <= 1;
}

function validateEntry(entry: RawEntry): CheckResult[] {
  const checks: CheckResult[] = [];

  if (!entry.loc) {
    checks.push({ id: "loc-missing", status: "fail" });
  } else if (!isValidAbsoluteUrl(entry.loc)) {
    checks.push({
      id: "loc-invalid",
      status: "fail",
      values: { loc: entry.loc },
    });
  }
  if (entry.lastmod && !isValidLastmod(entry.lastmod)) {
    checks.push({
      id: "lastmod-invalid",
      status: "warn",
      values: { lastmod: entry.lastmod },
    });
  }
  if (entry.priority && !isValidPriority(entry.priority)) {
    checks.push({
      id: "priority-invalid",
      status: "warn",
      values: { priority: entry.priority },
    });
  }
  if (
    entry.changefreq &&
    !CHANGEFREQ_VALUES.has(entry.changefreq.toLowerCase())
  ) {
    checks.push({
      id: "changefreq-invalid",
      status: "warn",
      values: { changefreq: entry.changefreq },
    });
  }

  return checks;
}

function rollup(checks: readonly CheckResult[]): CheckStatus {
  if (checks.some((check) => check.status === "fail")) return "fail";
  if (checks.some((check) => check.status === "warn")) return "warn";
  return "pass";
}

function countDuplicateLocs(entries: readonly RawEntry[]): number {
  const seen = new Set<string>();
  let duplicates = 0;
  for (const entry of entries) {
    if (!entry.loc) continue;
    if (seen.has(entry.loc)) {
      duplicates += 1;
    } else {
      seen.add(entry.loc);
    }
  }
  return duplicates;
}

export type ValidateSitemapOptions = {
  byteSize: number;
  isGzip?: boolean;
  truncated?: boolean;
};

// 空报告的公共部分（gzip 不支持等前置失败场景复用）。
function emptyReport(
  byteSize: number,
  general: CheckResult[],
): ValidationReport {
  return {
    byteSize,
    entryCount: 0,
    general,
    issues: [],
    overall: rollup(general),
    rootType: "unknown",
    totalIssueCount: 0,
  };
}

export function validateSitemap(
  xml: string,
  options: ValidateSitemapOptions,
): ValidationReport {
  const { byteSize, isGzip = false, truncated = false } = options;

  if (isGzip) {
    return emptyReport(byteSize, [{ id: "gzip-unsupported", status: "fail" }]);
  }

  const { entries, rootType } = parseSitemapXml(xml);

  const general: CheckResult[] = [
    { id: "root-element", status: rootType === "unknown" ? "fail" : "pass" },
  ];

  if (byteSize > SITEMAP_LIMITS.maxBytes) {
    general.push({
      id: "byte-size-limit",
      status: "fail",
      values: { bytes: byteSize, maxBytes: SITEMAP_LIMITS.maxBytes },
    });
  }

  if (entries.length > SITEMAP_LIMITS.maxEntries) {
    general.push({
      id: "entry-count-limit",
      status: "fail",
      values: { count: entries.length, maxEntries: SITEMAP_LIMITS.maxEntries },
    });
  } else if (rootType !== "unknown" && entries.length === 0) {
    general.push({ id: "entry-count-zero", status: "warn" });
  }

  const duplicateCount = countDuplicateLocs(entries);
  if (duplicateCount > 0) {
    general.push({
      id: "duplicate-locs",
      status: "warn",
      values: { count: duplicateCount },
    });
  }

  if (truncated) {
    general.push({
      id: "content-truncated",
      status: "warn",
      values: { bytes: byteSize },
    });
  }

  const allIssues: EntryIssue[] = entries
    .map((entry) => ({ checks: validateEntry(entry), loc: entry.loc }))
    .filter((issue) => issue.checks.length > 0);

  const overall = rollup([
    ...general,
    ...allIssues.flatMap((issue) => issue.checks),
  ]);

  return {
    byteSize,
    entryCount: entries.length,
    general,
    issues: allIssues.slice(0, SITEMAP_LIMITS.maxSampleIssues),
    overall,
    rootType,
    totalIssueCount: allIssues.length,
  };
}
