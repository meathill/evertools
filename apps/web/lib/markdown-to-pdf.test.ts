// @vitest-environment jsdom
// renderMarkdown 依赖 DOMPurify，必须有 DOM 才能净化
import { describe, expect, it } from "vitest";
import {
  buildPrintableHtml,
  estimatePageCount,
  isSupportedMarkdownFile,
  readMarkdownFile,
  renderMarkdown,
} from "./markdown-to-pdf";

describe("renderMarkdown", () => {
  it("renders headings", () => {
    const result = renderMarkdown("# Hello\n## World");
    expect(result).toContain("<h1>Hello</h1>");
    expect(result).toContain("<h2>World</h2>");
  });

  it("renders GFM tables", () => {
    const result = renderMarkdown("| a | b |\n|---|---|\n| 1 | 2 |");
    expect(result).toContain("<table>");
    expect(result).toContain("<th>a</th>");
  });

  it("renders fenced code blocks", () => {
    const result = renderMarkdown("```js\nconsole.log('hi')\n```");
    expect(result).toContain("<pre>");
    expect(result).toContain("<code");
  });

  it("renders inline code", () => {
    const result = renderMarkdown("use `const` here");
    expect(result).toContain("<code>const</code>");
  });

  it("renders blockquotes", () => {
    const result = renderMarkdown("> hello");
    expect(result).toContain("<blockquote>");
  });

  it("handles empty string", () => {
    const result = renderMarkdown("");
    expect(result).toBe("");
  });

  it("renders unordered lists", () => {
    const result = renderMarkdown("- item 1\n- item 2");
    expect(result).toContain("<ul>");
    expect(result).toContain("<li>item 1</li>");
  });
});

describe("renderMarkdown 净化", () => {
  it("移除 script 标签", () => {
    const result = renderMarkdown("# 标题\n\n<script>alert('xss')</script>");
    expect(result).not.toContain("<script");
    expect(result).not.toContain("alert('xss')");
    expect(result).toContain("<h1>标题</h1>");
  });

  it("移除内联事件处理器", () => {
    const result = renderMarkdown('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain("onerror");
    expect(result).not.toContain("alert(1)");
    expect(result).toContain("<img");
  });

  it("移除 body/svg 等其他标签上的事件处理器", () => {
    const result = renderMarkdown(
      '<div onmouseover="alert(1)">hover</div>\n\n<svg><animate onbegin="alert(2)" /></svg>',
    );
    expect(result).not.toContain("onmouseover");
    expect(result).not.toContain("onbegin");
    expect(result).toContain("hover");
  });

  it("移除 Markdown 链接语法里的 javascript: 协议", () => {
    const result = renderMarkdown("[点我](javascript:alert(1))");
    expect(result).not.toContain("javascript:");
    expect(result).toContain("点我");
  });

  it("移除原始 HTML 里的 javascript: 与 data: 协议", () => {
    const result = renderMarkdown(
      '<a href="javascript:alert(1)">a</a>\n\n<iframe src="data:text/html,<script>alert(2)</script>"></iframe>',
    );
    expect(result).not.toContain("javascript:");
    expect(result).not.toContain("<iframe");
    expect(result).not.toContain("<script");
  });

  it("保留 details/summary 等合法内联 HTML", () => {
    const result = renderMarkdown(
      "<details><summary>更多</summary>\n\n正文\n\n</details>",
    );
    expect(result).toContain("<details>");
    expect(result).toContain("<summary>更多</summary>");
    expect(result).toContain("正文");
  });

  it("保留 br、strong 等内联标签", () => {
    const result = renderMarkdown("第一行<br>第二行 <strong>粗体</strong>");
    expect(result).toContain("<br>");
    expect(result).toContain("<strong>粗体</strong>");
  });

  it("保留表格结构与 GFM 表格", () => {
    const raw = renderMarkdown(
      "<table><thead><tr><th>头</th></tr></thead><tbody><tr><td>格</td></tr></tbody></table>",
    );
    expect(raw).toContain("<table>");
    expect(raw).toContain("<th>头</th>");
    expect(raw).toContain("<td>格</td>");

    const gfm = renderMarkdown("| a | b |\n|---|---|\n| 1 | 2 |");
    expect(gfm).toContain("<table>");
    expect(gfm).toContain("<td>1</td>");
  });

  it("保留普通链接与图片", () => {
    const result = renderMarkdown(
      "[站点](https://example.com)\n\n![图](https://example.com/a.png)",
    );
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('src="https://example.com/a.png"');
  });
});

describe("buildPrintableHtml", () => {
  it("includes @page size 105mm for phone", () => {
    const html = buildPrintableHtml("# test", "phone", "classic");
    expect(html).toContain("size: 105mm auto");
  });

  it("includes @page size 148mm for a5", () => {
    const html = buildPrintableHtml("# test", "a5", "classic");
    expect(html).toContain("size: 148mm auto");
  });

  it("includes @page size 210mm for a4", () => {
    const html = buildPrintableHtml("# test", "a4", "classic");
    expect(html).toContain("size: 210mm auto");
  });

  it("renders markdown content in body", () => {
    const html = buildPrintableHtml("# Hello", "phone", "classic");
    expect(html).toContain("<h1>Hello</h1>");
  });

  it("classic style renders body content unwrapped", () => {
    const html = buildPrintableHtml("# Hello", "phone", "classic");
    expect(html).toMatch(/<body><h1>Hello<\/h1>\s*<\/body>/);
  });

  it("shadcn-typeset style wraps content and includes typeset CSS", () => {
    const html = buildPrintableHtml("# Hello", "phone", "shadcn-typeset");
    expect(html).toContain('<body><div class="typeset typeset-md-pdf">');
    expect(html).toContain("<h1>Hello</h1>");
    expect(html).toContain(".typeset-md-pdf");
  });

  it("打印用 HTML 同样经过净化", () => {
    const html = buildPrintableHtml(
      '<script>alert(1)</script><img src="x" onerror="alert(2)">',
      "a4",
      "classic",
    );
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).not.toContain("onerror");
  });

  it("tailwind-typography style wraps content and includes prose-scale CSS", () => {
    const html = buildPrintableHtml("# Hello", "phone", "tailwind-typography");
    expect(html).toContain('<body><div class="tw-typography-print">');
    expect(html).toContain("<h1>Hello</h1>");
    expect(html).toContain(".tw-typography-print");
  });
});

describe("estimatePageCount", () => {
  it("returns 1 for short content", () => {
    expect(estimatePageCount("hello")).toBe(1);
  });

  it("returns 1 for empty string", () => {
    expect(estimatePageCount("")).toBe(1);
  });

  it("estimates proportionally for longer content", () => {
    const longText = "a".repeat(9000);
    expect(estimatePageCount(longText)).toBe(3);
  });
});

describe("isSupportedMarkdownFile", () => {
  it("identifies markdown and text files", () => {
    expect(isSupportedMarkdownFile(new File(["# title"], "document.md"))).toBe(
      true,
    );
    expect(
      isSupportedMarkdownFile(
        new File(["# title"], "readme.markdown", { type: "text/plain" }),
      ),
    ).toBe(true);
    expect(isSupportedMarkdownFile(new File(["hello"], "notes.txt"))).toBe(
      true,
    );
    expect(isSupportedMarkdownFile(new File(["hello"], "doc.text"))).toBe(true);
  });

  it("rejects unsupported file extensions without text mime type", () => {
    expect(
      isSupportedMarkdownFile(
        new File([new Uint8Array([1, 2, 3])], "image.png", {
          type: "image/png",
        }),
      ),
    ).toBe(false);
  });
});

describe("readMarkdownFile", () => {
  it("reads markdown content successfully", async () => {
    const content = "# Hello World\nThis is a test.";
    const file = new File([content], "test.md", { type: "text/markdown" });
    const result = await readMarkdownFile(file);
    expect(result).toBe(content);
  });

  it("rejects when file is too large", async () => {
    const file = new File([], "big.md");
    Object.defineProperty(file, "size", { value: 11 * 1024 * 1024 });
    await expect(readMarkdownFile(file)).rejects.toThrow("FILE_TOO_LARGE");
  });

  it("rejects unsupported file type", async () => {
    const file = new File([new Uint8Array([0, 1, 2])], "data.bin", {
      type: "application/octet-stream",
    });
    await expect(readMarkdownFile(file)).rejects.toThrow(
      "UNSUPPORTED_FILE_TYPE",
    );
  });
});
