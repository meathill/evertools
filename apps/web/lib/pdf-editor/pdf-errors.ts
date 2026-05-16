export const PDF_EDITOR_ERROR_CODES = {
  CJK_FONT_LOAD_FAILED: "CJK_FONT_LOAD_FAILED",
  ENCRYPTED_NOT_SUPPORTED: "ENCRYPTED_NOT_SUPPORTED",
  EXPORT_FAILED: "EXPORT_FAILED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FONT_EMBED_FAILED: "FONT_EMBED_FAILED",
  FONT_MISSING_GLYPH: "FONT_MISSING_GLYPH",
  LOAD_FAILED: "LOAD_FAILED",
  SCANNED_NOT_SUPPORTED: "SCANNED_NOT_SUPPORTED",
  UNSUPPORTED_FONT: "UNSUPPORTED_FONT",
  UNSUPPORTED_FORMAT: "UNSUPPORTED_FORMAT",
  WORKER_FAILED: "WORKER_FAILED",
} as const;

export type PdfEditorErrorCode =
  (typeof PDF_EDITOR_ERROR_CODES)[keyof typeof PDF_EDITOR_ERROR_CODES];

const errorCodeSet = new Set<string>(Object.values(PDF_EDITOR_ERROR_CODES));

export function createPdfEditorError(
  code: PdfEditorErrorCode,
  detail?: string,
): Error {
  return new Error(detail ? `${code}::${detail}` : code);
}

export function parsePdfEditorError(error: unknown): {
  code: PdfEditorErrorCode | null;
  detail?: string;
} {
  if (!(error instanceof Error)) {
    return { code: null };
  }

  const separatorIndex = error.message.indexOf("::");
  if (separatorIndex === -1) {
    return { code: null, detail: error.message || undefined };
  }

  const code = error.message.slice(0, separatorIndex);
  const detail = error.message.slice(separatorIndex + 2) || undefined;

  if (!errorCodeSet.has(code)) {
    return { code: null, detail: error.message || undefined };
  }

  return {
    code: code as PdfEditorErrorCode,
    detail,
  };
}
