import { marked } from "marked";

export type PageWidth = "phone" | "a5" | "a4";

const PAGE_WIDTH_MM: Record<PageWidth, number> = {
  phone: 105,
  a5: 148,
  a4: 210,
};

marked.use({ gfm: true, breaks: false });

export function renderMarkdown(source: string): string {
  return marked(source) as string;
}

export function buildPrintableHtml(source: string, width: PageWidth): string {
  const html = renderMarkdown(source);
  const mm = PAGE_WIDTH_MM[width];
  return `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<style>
@page { size: ${mm}mm auto; margin: 8mm 10mm; }
body {
  font-family: system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 13pt;
  line-height: 1.7;
  color: #1a1a1a;
  margin: 0;
}
h1 { font-size: 1.6em; border-bottom: 2px solid #333; padding-bottom: 0.2em; }
h2 { font-size: 1.3em; border-bottom: 1px solid #ccc; padding-bottom: 0.15em; }
h3 { font-size: 1.1em; }
h1, h2, h3, h4 { page-break-after: avoid; margin: 1em 0 0.4em; }
p { margin: 0.6em 0; }
pre {
  background: #f4f4f4;
  padding: 0.8em;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.85em;
  page-break-inside: avoid;
}
code {
  font-family: "Courier New", monospace;
  background: #f0f0f0;
  padding: 0.1em 0.3em;
  border-radius: 2px;
}
pre code { background: none; padding: 0; }
blockquote {
  border-left: 3px solid #999;
  margin: 0.5em 0;
  padding-left: 0.8em;
  color: #555;
}
table { border-collapse: collapse; width: 100%; font-size: 0.9em; }
th, td { border: 1px solid #bbb; padding: 0.3em 0.6em; }
th { background: #f0f0f0; }
img { max-width: 100%; }
a { color: #1a1a1a; }
ul, ol { padding-left: 1.5em; }
li { margin: 0.2em 0; }
hr { border: none; border-top: 1px solid #ddd; margin: 1em 0; }
</style>
</head><body>${html}</body></html>`;
}

export function estimatePageCount(source: string): number {
  return Math.max(1, Math.ceil(source.length / 3000));
}
