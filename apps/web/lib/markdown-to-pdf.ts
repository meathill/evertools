import DOMPurify from "dompurify";
import { marked } from "marked";
import {
  CLASSIC_PRINT_BODY_CLASS_NAME,
  CLASSIC_PRINT_CSS,
} from "@/lib/markdown-print-styles/classic";
import {
  SHADCN_TYPESET_BODY_CLASS_NAME,
  SHADCN_TYPESET_PRINT_CSS,
} from "@/lib/markdown-print-styles/shadcn-typeset";
import {
  TAILWIND_TYPOGRAPHY_BODY_CLASS_NAME,
  TAILWIND_TYPOGRAPHY_PRINT_CSS,
} from "@/lib/markdown-print-styles/tailwind-typography";

export type PageWidth = "phone" | "a5" | "a4";
export type MarkdownStyle =
  | "classic"
  | "tailwind-typography"
  | "shadcn-typeset";
export type MarkdownDialect = "commonmark" | "github";

const PAGE_WIDTH_MM: Record<PageWidth, number> = {
  phone: 105,
  a5: 148,
  a4: 210,
};

const PRINT_STYLES: Record<
  MarkdownStyle,
  { css: string; bodyClassName: string }
> = {
  classic: {
    css: CLASSIC_PRINT_CSS,
    bodyClassName: CLASSIC_PRINT_BODY_CLASS_NAME,
  },
  "tailwind-typography": {
    css: TAILWIND_TYPOGRAPHY_PRINT_CSS,
    bodyClassName: TAILWIND_TYPOGRAPHY_BODY_CLASS_NAME,
  },
  "shadcn-typeset": {
    css: SHADCN_TYPESET_PRINT_CSS,
    bodyClassName: SHADCN_TYPESET_BODY_CLASS_NAME,
  },
};

marked.use({ breaks: false });

/**
 * marked 自 v5 起不再净化输出，原始 HTML 会原样透传。
 * 这里统一用 DOMPurify 兜住 XSS，同时保留 <details>、<br>、表格等合法内联 HTML。
 * 依赖 DOM，因此只能在浏览器（或 jsdom 测试环境）中调用。
 */
export function renderMarkdown(
  source: string,
  dialect: MarkdownDialect = "github",
): string {
  const html = DOMPurify.sanitize(
    marked(source, { gfm: dialect === "github" }) as string,
  );
  return normalizeTaskList(html);
}

/**
 * marked 18 的 GFM 任务列表只输出 `<li><input type="checkbox">`，
 * 不携带 GitHub 规范结构。这里用 DOM 补全规范 class：
 * ul.contains-task-list / li.task-list-item / input.task-list-item-checkbox，
 * 让打印与预览样式统一按 GitHub 规范选择器书写。
 */
function normalizeTaskList(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  for (const input of doc.querySelectorAll<HTMLInputElement>(
    'li > input[type="checkbox"]',
  )) {
    input.classList.add("task-list-item-checkbox");
    const li = input.parentElement;
    if (li) {
      li.classList.add("task-list-item");
      const list = li.parentElement;
      if (list && list.tagName === "UL") {
        list.classList.add("contains-task-list");
      }
    }
  }
  return doc.body.innerHTML;
}

export function buildPrintableHtml(
  source: string,
  width: PageWidth,
  style: MarkdownStyle,
  dialect: MarkdownDialect = "github",
): string {
  const html = renderMarkdown(source, dialect);
  const mm = PAGE_WIDTH_MM[width];
  const { css, bodyClassName } = PRINT_STYLES[style];
  const body = bodyClassName
    ? `<div class="${bodyClassName}">${html}</div>`
    : html;
  return `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<style>
@page { size: ${mm}mm auto; margin: 8mm 10mm; }
body { margin: 0; }
${css}
</style>
</head><body>${body}</body></html>`;
}

export function estimatePageCount(source: string): number {
  return Math.max(1, Math.ceil(source.length / 3000));
}

export const MAX_MARKDOWN_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function isSupportedMarkdownFile(file: File): boolean {
  const validExtensions = [
    ".md",
    ".markdown",
    ".mdown",
    ".mkd",
    ".mkdn",
    ".txt",
    ".text",
  ];
  const fileName = file.name.toLowerCase();
  const hasValidExt = validExtensions.some((ext) => fileName.endsWith(ext));
  if (hasValidExt) {
    return true;
  }
  return file.type.startsWith("text/");
}

export async function readMarkdownFile(file: File): Promise<string> {
  if (file.size > MAX_MARKDOWN_FILE_SIZE) {
    throw new Error("FILE_TOO_LARGE");
  }
  if (!isSupportedMarkdownFile(file)) {
    throw new Error("UNSUPPORTED_FILE_TYPE");
  }
  if (typeof file.text === "function") {
    return await file.text();
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    };
    reader.onerror = () => {
      reject(new Error("READ_ERROR"));
    };
    reader.readAsText(file);
  });
}
