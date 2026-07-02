import { describe, expect, it } from "vitest";
import {
  PDF_EDITOR_ERROR_CODES,
  type PdfEditorErrorCode,
} from "@/lib/pdf-editor/pdf-errors";
import { getPdfEditorErrorMessage } from "@/lib/pdf-editor/pdf-error-messages";
import { formatBytes, MAX_PDF_FILE_SIZE } from "@/lib/pdf-editor/pdf-types";
import { getLocaleContent } from "@/messages";

const content = getLocaleContent("zh").pdfTextEditor;

const knownCodeCases: readonly {
  code: PdfEditorErrorCode;
  expected: string;
}[] = [
  {
    code: PDF_EDITOR_ERROR_CODES.CJK_FONT_LOAD_FAILED,
    expected: content.client.errors.cjkFontLoadFailed,
  },
  {
    code: PDF_EDITOR_ERROR_CODES.ENCRYPTED_NOT_SUPPORTED,
    expected: content.client.errors.encryptedNotSupported,
  },
  {
    code: PDF_EDITOR_ERROR_CODES.EXPORT_FAILED,
    expected: content.client.errors.exportFailed,
  },
  {
    code: PDF_EDITOR_ERROR_CODES.FONT_EMBED_FAILED,
    expected: content.client.errors.fontEmbedFailed,
  },
  {
    code: PDF_EDITOR_ERROR_CODES.FONT_MISSING_GLYPH,
    expected: content.client.errors.fontMissingGlyph,
  },
  {
    code: PDF_EDITOR_ERROR_CODES.SCANNED_NOT_SUPPORTED,
    expected: content.client.errors.scannedNotSupported,
  },
  {
    code: PDF_EDITOR_ERROR_CODES.UNSUPPORTED_FONT,
    expected: content.client.errors.unsupportedFont,
  },
  {
    code: PDF_EDITOR_ERROR_CODES.UNSUPPORTED_FORMAT,
    expected: content.client.errors.unsupportedFormat,
  },
  {
    code: PDF_EDITOR_ERROR_CODES.WORKER_FAILED,
    expected: content.client.errors.workerFailed,
  },
];

describe("getPdfEditorErrorMessage", () => {
  it.each(knownCodeCases)(
    "maps $code to its localized message",
    ({ code, expected }) => {
      expect(getPdfEditorErrorMessage(code, null, content)).toBe(expected);
    },
  );

  it("interpolates the formatted max file size into the FILE_TOO_LARGE message", () => {
    expect(
      getPdfEditorErrorMessage(
        PDF_EDITOR_ERROR_CODES.FILE_TOO_LARGE,
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

  it("falls back to loadFailedDetail with the interpolated detail for an unrecognized code when detail is provided", () => {
    const unknownCode = "UNKNOWN_CODE" as PdfEditorErrorCode;

    expect(getPdfEditorErrorMessage(unknownCode, "boom", content)).toBe(
      content.client.errors.loadFailedDetail.replace("{detail}", "boom"),
    );
  });

  it("falls back to the plain loadFailed message for an unrecognized code when detail is null", () => {
    const unknownCode = "UNKNOWN_CODE" as PdfEditorErrorCode;

    expect(getPdfEditorErrorMessage(unknownCode, null, content)).toBe(
      content.client.errors.loadFailed,
    );
  });

  it("falls back to the plain loadFailed message for an unrecognized code when detail is an empty string", () => {
    const unknownCode = "UNKNOWN_CODE" as PdfEditorErrorCode;

    expect(getPdfEditorErrorMessage(unknownCode, "", content)).toBe(
      content.client.errors.loadFailed,
    );
  });
});
