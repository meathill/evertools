import { describe, expect, it } from "vitest";
import {
  createPdfEditorError,
  PDF_EDITOR_ERROR_CODES,
  parsePdfEditorError,
} from "@/lib/pdf-editor/pdf-errors";
import { detectScannedPdf } from "@/lib/pdf-editor/pdf-scan-detector";
import {
  buildBlockKey,
  buildOutputFilename,
  containsCjk,
  isAcceptedFontName,
  isAcceptedPdfType,
} from "@/lib/pdf-editor/pdf-types";

describe("pdf editor helpers", () => {
  it("detects scanned pdf below the dynamic threshold", () => {
    expect(detectScannedPdf({ pageCount: 1, totalTextChars: 5 })).toBe(true);
    expect(detectScannedPdf({ pageCount: 1, totalTextChars: 20 })).toBe(false);
    expect(detectScannedPdf({ pageCount: 5, totalTextChars: 24 })).toBe(true);
    expect(detectScannedPdf({ pageCount: 5, totalTextChars: 25 })).toBe(false);
    expect(detectScannedPdf({ pageCount: 10, totalTextChars: 49 })).toBe(true);
    expect(detectScannedPdf({ pageCount: 5, totalTextChars: 100 })).toBe(false);
  });

  it("treats empty document as scanned", () => {
    expect(detectScannedPdf({ pageCount: 0, totalTextChars: 0 })).toBe(true);
  });

  it("parses encoded error messages", () => {
    const error = new Error("FILE_TOO_LARGE::50000000");
    expect(parsePdfEditorError(error)).toEqual({
      code: PDF_EDITOR_ERROR_CODES.FILE_TOO_LARGE,
      detail: "50000000",
    });
  });

  it("returns null for unknown error codes but preserves detail", () => {
    expect(parsePdfEditorError(new Error("RANDOM_THING"))).toEqual({
      code: null,
      detail: "RANDOM_THING",
    });
    expect(parsePdfEditorError("not an error")).toEqual({ code: null });
  });

  it("round-trips an error created without a detail", () => {
    const error = createPdfEditorError(
      PDF_EDITOR_ERROR_CODES.ENCRYPTED_NOT_SUPPORTED,
    );
    expect(error.message).toBe("ENCRYPTED_NOT_SUPPORTED");
    expect(parsePdfEditorError(error)).toEqual({
      code: PDF_EDITOR_ERROR_CODES.ENCRYPTED_NOT_SUPPORTED,
      detail: undefined,
    });
  });

  it("builds output filenames with the edited suffix", () => {
    expect(buildOutputFilename("contract.pdf")).toBe("contract-edited.pdf");
    expect(buildOutputFilename("nested.report.PDF")).toBe(
      "nested.report-edited.pdf",
    );
    expect(buildOutputFilename("")).toBe("document-edited.pdf");
  });

  it("detects CJK characters", () => {
    expect(containsCjk("Hello world")).toBe(false);
    expect(containsCjk("Hello 你好")).toBe(true);
    expect(containsCjk("こんにちは")).toBe(true);
    expect(containsCjk("！？")).toBe(true);
  });

  it("validates pdf mime types", () => {
    expect(isAcceptedPdfType("application/pdf")).toBe(true);
    expect(isAcceptedPdfType("image/png")).toBe(false);
  });

  it("validates accepted font extensions", () => {
    expect(isAcceptedFontName("NotoSans.ttf")).toBe(true);
    expect(isAcceptedFontName("Noto.OTF")).toBe(true);
    expect(isAcceptedFontName("NotoSans.woff2")).toBe(false);
    expect(isAcceptedFontName("plain")).toBe(false);
  });

  it("builds stable block keys", () => {
    expect(buildBlockKey(2, "p2-i7")).toBe("2::p2-i7");
  });

  it("normalizes a whitespace-only base name to the document fallback", () => {
    expect(buildOutputFilename("   .pdf")).toBe("document-edited.pdf");
  });

  it("detects Hangul characters as CJK", () => {
    expect(containsCjk("안녕")).toBe(true);
  });

  it("treats a trailing '::' with no detail as an undefined detail, not an empty string", () => {
    expect(parsePdfEditorError(new Error("EXPORT_FAILED::"))).toEqual({
      code: PDF_EDITOR_ERROR_CODES.EXPORT_FAILED,
      detail: undefined,
    });
  });

  it("accepts font names with multiple dots or no base name before the extension", () => {
    expect(isAcceptedFontName("archive.tar.ttf")).toBe(true);
    expect(isAcceptedFontName(".ttf")).toBe(true);
  });
});
