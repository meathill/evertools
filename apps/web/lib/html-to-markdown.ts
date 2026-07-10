import { HTMLElement, type Node as ParserNode, parse } from "node-html-parser";
import {
  collapseWhitespace,
  detectCodeLanguage,
  escapeLineStartMarkers,
  escapeMarkdownText,
  getLongestBacktickRun,
  indentListItem,
  trimCodeContent,
  wrapEmphasis,
  wrapHref,
} from "@/lib/html-to-markdown-format";

type RenderContext = {
  inTableCell: boolean;
};

const DEFAULT_CONTEXT: RenderContext = { inTableCell: false };

// 不进入输出的标签：脚本/样式/嵌入内容，以及完整文档粘贴时的 head 噪音。
const SKIPPED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "SVG",
  "IFRAME",
  "TEMPLATE",
  "HEAD",
  "TITLE",
  "META",
  "LINK",
]);

// 会独立成块（而非并入内联文本流）的标签；未列出的标签一律按内联透传处理。
const BLOCK_TAGS = new Set([
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "P",
  "HR",
  "UL",
  "OL",
  "BLOCKQUOTE",
  "PRE",
  "TABLE",
  "DT",
  "DD",
  "DL",
  "DIV",
  "SECTION",
  "ARTICLE",
  "HEADER",
  "FOOTER",
  "MAIN",
  "ASIDE",
  "NAV",
  "FIGURE",
  "FIGCAPTION",
  "FORM",
  "ADDRESS",
  "FIELDSET",
]);

const HEADING_LEVEL: Record<string, number> = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6,
};

export function convertHtmlToMarkdown(html: string): string {
  const root = parse(html, {
    comment: false,
    // 故意不写 pre：这个 key 只要存在（不论值），<pre> 内部就会被整段当字符串处理，
    // <code class="language-x"> 解析不出子元素，语言检测会直接失效。
    blockTextElements: { noscript: true, script: true, style: true },
  });
  const body = root.querySelector("body");

  return renderBlock(
    body ? body.childNodes : root.childNodes,
    DEFAULT_CONTEXT,
  ).trim();
}

function renderBlock(nodes: ParserNode[], ctx: RenderContext): string {
  const blocks: string[] = [];
  let run: ParserNode[] = [];

  function flushRun() {
    if (run.length === 0) {
      return;
    }
    const text = renderProseBlock(run, ctx);
    run = [];
    if (text !== "") {
      blocks.push(text);
    }
  }

  for (const node of nodes) {
    if (node instanceof HTMLElement) {
      const tag = node.tagName;
      if (SKIPPED_TAGS.has(tag)) {
        continue;
      }
      if (BLOCK_TAGS.has(tag)) {
        flushRun();
        const rendered = renderElementAsBlock(node, ctx);
        if (rendered.trim() !== "") {
          blocks.push(rendered);
        }
        continue;
      }
      run.push(node);
    } else if (node.textContent.trim() !== "") {
      // comment:false 保证这里只会是 TextNode；纯空白文本节点在块级语境下直接丢弃。
      run.push(node);
    }
  }
  flushRun();

  return blocks.join("\n\n");
}

function renderProseBlock(nodes: ParserNode[], ctx: RenderContext): string {
  return escapeLineStartMarkers(renderInline(nodes, ctx).trim());
}

function renderElementAsBlock(el: HTMLElement, ctx: RenderContext): string {
  switch (el.tagName) {
    case "H1":
    case "H2":
    case "H3":
    case "H4":
    case "H5":
    case "H6":
      return renderHeading(el, ctx);
    case "P":
    case "DT":
    case "DD":
      return renderProseBlock(el.childNodes, ctx);
    case "HR":
      return "---";
    case "UL":
      return renderList(el, ctx, false);
    case "OL":
      return renderList(el, ctx, true);
    case "BLOCKQUOTE":
      return renderBlockquote(el, ctx);
    case "PRE":
      return renderCodeBlock(el);
    case "TABLE":
      return renderTable(el);
    default:
      // 通用容器（div/section 等）：递归但不产出任何语法。
      return renderBlock(el.childNodes, ctx);
  }
}

function renderHeading(el: HTMLElement, ctx: RenderContext): string {
  const text = renderInline(el.childNodes, ctx).trim();
  if (text === "") {
    return "";
  }
  return `${"#".repeat(HEADING_LEVEL[el.tagName])} ${text}`;
}

function renderList(
  el: HTMLElement,
  ctx: RenderContext,
  ordered: boolean,
): string {
  const items = el.childNodes.filter(
    (node): node is HTMLElement =>
      node instanceof HTMLElement && node.tagName === "LI",
  );

  return items
    .map((item, index) => {
      const marker = ordered ? `${index + 1}. ` : "- ";
      return indentListItem(renderBlock(item.childNodes, ctx), marker);
    })
    .join("\n");
}

function renderBlockquote(el: HTMLElement, ctx: RenderContext): string {
  const content = renderBlock(el.childNodes, ctx);
  if (content === "") {
    return "";
  }
  // 空行也要带上 ">"，否则会被当成引用结束，破坏后续嵌套内容。
  return content
    .split("\n")
    .map((line) => (line === "" ? ">" : `> ${line}`))
    .join("\n");
}

function renderTable(el: HTMLElement): string {
  const allRows = el.querySelectorAll("tr");
  const firstRow = allRows[0];
  if (!firstRow) {
    return "";
  }

  const thead = el.querySelector("thead");
  const headerRow =
    thead?.querySelector("tr") ??
    allRows.find((row) => row.querySelector("th") !== null) ??
    firstRow;
  const bodyRows = allRows.filter((row) => row !== headerRow);
  const tableCtx: RenderContext = { inTableCell: true };
  const columnCount = Math.max(
    getCells(headerRow).length,
    ...bodyRows.map((row) => getCells(row).length),
    1,
  );

  function renderRow(row: HTMLElement): string {
    const cells = getCells(row);
    const values: string[] = [];
    for (let index = 0; index < columnCount; index += 1) {
      values.push(cells[index] ? renderTableCell(cells[index], tableCtx) : "");
    }
    return `| ${values.join(" | ")} |`;
  }

  const separatorRow = `| ${Array(columnCount).fill("---").join(" | ")} |`;

  return [renderRow(headerRow), separatorRow, ...bodyRows.map(renderRow)].join(
    "\n",
  );
}

function getCells(row: HTMLElement): HTMLElement[] {
  return row.childNodes.filter(
    (node): node is HTMLElement =>
      node instanceof HTMLElement &&
      (node.tagName === "TD" || node.tagName === "TH"),
  );
}

function renderTableCell(cell: HTMLElement, ctx: RenderContext): string {
  // 表格专属转义：字面 "|" 会打断行结构，这条规则不影响正文的转义规则。
  return renderInline(cell.childNodes, ctx).trim().replace(/\|/g, "\\|");
}

function renderCodeBlock(el: HTMLElement): string {
  const codeEl = el.querySelector("code");
  const container = codeEl ?? el;
  const language =
    detectCodeLanguage(container.getAttribute("class")) ||
    detectCodeLanguage(el.getAttribute("class"));
  const content = trimCodeContent(container.textContent);
  const fence = content.includes("```") ? "~~~" : "```";

  return `${fence}${language}\n${content}\n${fence}`;
}

function renderInline(nodes: ParserNode[], ctx: RenderContext): string {
  const parts: string[] = [];

  for (const node of nodes) {
    if (node instanceof HTMLElement) {
      if (SKIPPED_TAGS.has(node.tagName)) {
        continue;
      }
      parts.push(renderInlineElement(node, ctx));
    } else {
      // comment:false 保证这里只会是 TextNode。空白折叠必须逐节点做，
      // 否则会把 <br> 自己生成的硬换行也一起折叠掉。
      parts.push(collapseWhitespace(escapeMarkdownText(node.textContent)));
    }
  }

  // wrapEmphasis 会把定界符外侧保留一个空格，紧邻的文本节点自己也带一个
  // 空格时会拼出两个空格连在一起，这里只清理空格（不动 <br> 生成的换行）。
  return parts.join("").replace(/ {2,}/g, " ");
}

function renderInlineElement(el: HTMLElement, ctx: RenderContext): string {
  switch (el.tagName) {
    case "BR":
      return ctx.inTableCell ? "<br>" : "\\\n";
    case "STRONG":
    case "B":
      return wrapEmphasis(renderInline(el.childNodes, ctx), "**");
    case "EM":
    case "I":
      return wrapEmphasis(renderInline(el.childNodes, ctx), "_");
    case "DEL":
    case "S":
    case "STRIKE":
      return wrapEmphasis(renderInline(el.childNodes, ctx), "~~");
    case "CODE":
      return renderInlineCode(el);
    case "A":
      return renderLink(el, ctx);
    case "IMG":
      return renderImage(el);
    default:
      // 通用内联容器（span 等）：透传，不产出语法。
      return renderInline(el.childNodes, ctx);
  }
}

function renderInlineCode(el: HTMLElement): string {
  const content = el.textContent;
  if (content === "") {
    return "";
  }
  const fence = "`".repeat(getLongestBacktickRun(content) + 1);
  const pad = content.startsWith("`") || content.endsWith("`") ? " " : "";

  return `${fence}${pad}${content}${pad}${fence}`;
}

function renderLink(el: HTMLElement, ctx: RenderContext): string {
  const text = renderInline(el.childNodes, ctx);
  const href = el.getAttribute("href");

  return href ? `[${text}](${wrapHref(href)})` : text;
}

function renderImage(el: HTMLElement): string {
  const src = el.getAttribute("src");
  const alt = escapeMarkdownText(el.getAttribute("alt") ?? "");

  return src ? `![${alt}](${wrapHref(src)})` : alt;
}
