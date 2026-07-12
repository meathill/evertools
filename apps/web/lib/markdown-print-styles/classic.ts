/**
 * Print CSS for the "classic" style — byte-identical to the tool's
 * original (pre-multi-style) hardcoded look. No wrapper element: rules
 * target bare tags directly on <body>, exactly as before.
 */
export const CLASSIC_PRINT_CSS = `
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
`;

export const CLASSIC_PRINT_BODY_CLASS_NAME = "";
