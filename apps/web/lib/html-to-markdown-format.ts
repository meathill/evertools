const ESCAPE_CHARACTERS_PATTERN = /[\\`*_[\]<]/g;

// 位置无关转义：不管出现在哪里都可能被下游 Markdown 渲染器误读的字符。
export function escapeMarkdownText(text: string): string {
  return text.replace(ESCAPE_CHARACTERS_PATTERN, "\\$&");
}

const LEADING_HASH_PATTERN = /^#/;
const LEADING_LIST_MARKER_PATTERN = /^[->+]/;
const LEADING_ORDERED_MARKER_PATTERN = /^(\d+)([.)])/;

// 位置相关转义：只在行首才会被误读成标题/列表/引用的字符。调用方必须
// 先转义原始文本、再拼接自己生成的语法前缀，否则会连自己生成的符号也转义掉。
export function escapeLineStartMarkers(text: string): string {
  return text.split("\n").map(escapeLineStart).join("\n");
}

function escapeLineStart(line: string): string {
  if (
    LEADING_HASH_PATTERN.test(line) ||
    LEADING_LIST_MARKER_PATTERN.test(line)
  ) {
    return `\\${line}`;
  }
  if (LEADING_ORDERED_MARKER_PATTERN.test(line)) {
    return line.replace(LEADING_ORDERED_MARKER_PATTERN, "$1\\$2");
  }
  return line;
}

export function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ");
}

const LANGUAGE_CLASS_PATTERN = /(?:^|\s)(?:language|lang)-([a-z0-9#+.-]+)/i;

export function detectCodeLanguage(
  classAttr: string | null | undefined,
): string {
  if (!classAttr) {
    return "";
  }
  const match = classAttr.match(LANGUAGE_CLASS_PATTERN);
  return match ? match[1] : "";
}

export function wrapEmphasis(content: string, marker: string): string {
  const trimmed = content.trim();
  if (trimmed === "") {
    return "";
  }
  // 把定界符内侧的空白挪到外侧：CommonMark 里 "** text **" 这种两侧带空白
  // 的强调无法被识别，源 HTML 标签内侧带空格却极常见。
  const leading = content.startsWith(" ") ? " " : "";
  const trailing = content.endsWith(" ") ? " " : "";

  return `${leading}${marker}${trimmed}${marker}${trailing}`;
}

export function wrapHref(href: string): string {
  // 含空格或圆括号时必须用尖括号包裹，否则会打断链接语法——真实网页
  // （如维基百科）的链接大量带圆括号，这不是边角情况。
  return /[\s()]/.test(href) ? `<${href}>` : href;
}

export function getLongestBacktickRun(text: string): number {
  const runs = text.match(/`+/g);
  return runs ? Math.max(...runs.map((run) => run.length)) : 0;
}

export function trimCodeContent(text: string): string {
  return text.replace(/^\n/, "").replace(/\s+$/, "");
}

export function indentListItem(content: string, marker: string): string {
  const indent = " ".repeat(marker.length);

  return content
    .split("\n")
    .map((line, index) => {
      if (index === 0) {
        return `${marker}${line}`;
      }
      return line === "" ? "" : `${indent}${line}`;
    })
    .join("\n");
}
