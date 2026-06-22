import { describe, expect, it } from "vitest";
import {
  buildPrintableHtml,
  estimatePageCount,
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

describe("buildPrintableHtml", () => {
  it("includes @page size 105mm for phone", () => {
    const html = buildPrintableHtml("# test", "phone");
    expect(html).toContain("size: 105mm auto");
  });

  it("includes @page size 148mm for a5", () => {
    const html = buildPrintableHtml("# test", "a5");
    expect(html).toContain("size: 148mm auto");
  });

  it("includes @page size 210mm for a4", () => {
    const html = buildPrintableHtml("# test", "a4");
    expect(html).toContain("size: 210mm auto");
  });

  it("renders markdown content in body", () => {
    const html = buildPrintableHtml("# Hello", "phone");
    expect(html).toContain("<h1>Hello</h1>");
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
