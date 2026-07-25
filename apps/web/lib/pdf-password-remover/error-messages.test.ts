import { describe, expect, it } from "vitest";
import { formatBytes } from "@/lib/format";
import { getPdfPasswordRemoverErrorMessage } from "@/lib/pdf-password-remover/error-messages";
import {
  PDF_PASSWORD_REMOVER_ERROR_CODES,
  type PdfPasswordRemoverErrorCode,
} from "@/lib/pdf-password-remover/errors";
import { MAX_PDF_FILE_SIZE } from "@/lib/pdf-password-remover/types";
import { getLocaleContent } from "@/messages";

const content = getLocaleContent("zh").pdfPasswordRemover;

const knownCodeCases: readonly {
  code: PdfPasswordRemoverErrorCode;
  expected: string;
}[] = [
  {
    code: PDF_PASSWORD_REMOVER_ERROR_CODES.INVALID_PASSWORD,
    expected: content.client.errors.invalidPassword,
  },
  {
    code: PDF_PASSWORD_REMOVER_ERROR_CODES.LOAD_FAILED,
    expected: content.client.errors.loadFailed,
  },
  {
    code: PDF_PASSWORD_REMOVER_ERROR_CODES.UNSUPPORTED_FORMAT,
    expected: content.client.errors.unsupportedFormat,
  },
];

describe("getPdfPasswordRemoverErrorMessage", () => {
  it.each(knownCodeCases)(
    "maps $code to its localized message",
    ({ code, expected }) => {
      expect(getPdfPasswordRemoverErrorMessage(code, null, content)).toBe(
        expected,
      );
    },
  );

  it("interpolates the size limit for FILE_TOO_LARGE", () => {
    expect(
      getPdfPasswordRemoverErrorMessage(
        PDF_PASSWORD_REMOVER_ERROR_CODES.FILE_TOO_LARGE,
        null,
        content,
      ),
    ).toBe(
      content.client.errors.fileTooLarge.replace(
        "{size}",
        formatBytes(MAX_PDF_FILE_SIZE),
      ),
    );
  });

  it("interpolates detail for DECRYPT_FAILED", () => {
    expect(
      getPdfPasswordRemoverErrorMessage(
        PDF_PASSWORD_REMOVER_ERROR_CODES.DECRYPT_FAILED,
        "exit code 2",
        content,
      ),
    ).toBe(
      content.client.errors.decryptFailedDetail.replace(
        "{detail}",
        "exit code 2",
      ),
    );
  });

  it("falls back to decryptFailed for unknown code without detail", () => {
    expect(getPdfPasswordRemoverErrorMessage(null, null, content)).toBe(
      content.client.errors.decryptFailed,
    );
  });
});
