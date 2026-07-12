/**
 * Print CSS for the "tailwind-typography" style. Hand-authored static
 * transcription of @tailwindcss/typography's real "sm" variant defaults
 * (verified against tailwindlabs/tailwindcss-typography src/styles.js,
 * 2026-07) — not a build-output extraction, since there's no Tailwind
 * build pipeline available inside the print popup. Uses a project-owned
 * class name (not "prose") since Tailwind isn't running in this
 * document, so the real utility class would resolve to nothing here.
 * One deliberate deviation from upstream: the code::before/::after
 * backtick characters are omitted (commonly overridden, and this
 * tool's content is often CJK where they read oddly).
 */
export const TAILWIND_TYPOGRAPHY_PRINT_CSS = `
.tw-typography-print {
  font-size: 0.875rem;
  line-height: 1.714;
  color: #374151;
}
.tw-typography-print h1, .tw-typography-print h2, .tw-typography-print h3, .tw-typography-print h4 {
  color: #111827;
  font-weight: 600;
  page-break-after: avoid;
}
.tw-typography-print h1 { font-size: 2.143em; line-height: 1.2; font-weight: 800; margin: 0 0 0.8em; }
.tw-typography-print h2 { font-size: 1.429em; line-height: 1.4; font-weight: 700; margin: 1.6em 0 0.8em; }
.tw-typography-print h3 { font-size: 1.286em; line-height: 1.556; margin: 1.556em 0 0.444em; }
.tw-typography-print h4 { font-size: 1em; line-height: 1.429; margin: 1.429em 0 0.571em; }
.tw-typography-print p { margin: 1.143em 0; }
.tw-typography-print a { color: #111827; text-decoration: underline; font-weight: 500; }
.tw-typography-print strong { color: #111827; font-weight: 600; }
.tw-typography-print code {
  font-family: "Courier New", monospace;
  font-size: 0.857em;
  font-weight: 600;
  color: #111827;
}
.tw-typography-print pre {
  background: #1f2937;
  color: #e5e7eb;
  font-size: 0.857em;
  line-height: 1.667;
  margin: 1.667em 0;
  border-radius: 0.25rem;
  padding: 0.667em 1em;
  white-space: pre-wrap;
  word-break: break-word;
  page-break-inside: avoid;
}
.tw-typography-print pre code { background: none; color: inherit; font-weight: 400; padding: 0; }
.tw-typography-print blockquote {
  font-weight: 500;
  font-style: italic;
  border-left: 0.25rem solid #e5e7eb;
  margin: 1.333em 0;
  padding-left: 1.111em;
  color: #374151;
  page-break-inside: avoid;
}
.tw-typography-print table { width: 100%; border-collapse: collapse; font-size: 0.857em; line-height: 1.5; page-break-inside: avoid; }
.tw-typography-print thead { border-bottom: 1px solid #d1d5db; }
.tw-typography-print thead th { padding: 0 1em 0.667em 0; font-weight: 600; color: #111827; text-align: left; }
.tw-typography-print tbody td { padding: 0.667em 1em 0.667em 0; border-bottom: 1px solid #e5e7eb; }
.tw-typography-print ul, .tw-typography-print ol { padding-left: 1.625em; margin: 1.143em 0; }
.tw-typography-print li { margin: 0.286em 0; }
.tw-typography-print li::marker { color: #9ca3af; }
.tw-typography-print img { max-width: 100%; border-radius: 0.25rem; }
.tw-typography-print hr { border: none; border-top: 1px solid #e5e7eb; margin: 2.857em 0; }
`;

export const TAILWIND_TYPOGRAPHY_BODY_CLASS_NAME = "tw-typography-print";
