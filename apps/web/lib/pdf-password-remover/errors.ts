export const PDF_PASSWORD_REMOVER_ERROR_CODES = {
  DECRYPT_FAILED: "DECRYPT_FAILED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  LOAD_FAILED: "LOAD_FAILED",
  UNSUPPORTED_FORMAT: "UNSUPPORTED_FORMAT",
} as const;

export type PdfPasswordRemoverErrorCode =
  (typeof PDF_PASSWORD_REMOVER_ERROR_CODES)[keyof typeof PDF_PASSWORD_REMOVER_ERROR_CODES];

const errorCodeSet = new Set<string>(
  Object.values(PDF_PASSWORD_REMOVER_ERROR_CODES),
);

export function createPdfPasswordRemoverError(
  code: PdfPasswordRemoverErrorCode,
  detail?: string,
): Error {
  return new Error(detail ? `${code}::${detail}` : code);
}

export function parsePdfPasswordRemoverError(error: unknown): {
  code: PdfPasswordRemoverErrorCode | null;
  detail?: string;
} {
  if (!(error instanceof Error)) {
    return { code: null };
  }

  const separatorIndex = error.message.indexOf("::");
  if (separatorIndex === -1) {
    if (errorCodeSet.has(error.message)) {
      return {
        code: error.message as PdfPasswordRemoverErrorCode,
        detail: undefined,
      };
    }
    return { code: null, detail: error.message || undefined };
  }

  const code = error.message.slice(0, separatorIndex);
  const detail = error.message.slice(separatorIndex + 2) || undefined;

  if (!errorCodeSet.has(code)) {
    return { code: null, detail: error.message || undefined };
  }

  return {
    code: code as PdfPasswordRemoverErrorCode,
    detail,
  };
}
