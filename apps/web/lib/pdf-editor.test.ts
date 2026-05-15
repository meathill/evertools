import { describe, expect, it } from "vitest";
import {
  PDF_EDITOR_ERROR_CODES,
  parsePdfEditorError,
} from "@/lib/pdf-editor/pdf-errors";
import { detectScannedPdf } from "@/lib/pdf-editor/pdf-scan-detector";
import {
  buildBlockKey,
  buildOutputFilename,
  containsCjk,
  formatBytes,
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

  it("returns null for unknown error codes", () => {
    expect(parsePdfEditorError(new Error("RANDOM_THING"))).toEqual({
      code: null,
    });
    expect(parsePdfEditorError("not an error")).toEqual({ code: null });
  });

  it("builds output filenames with the edited suffix", () => {
    expect(buildOutputFilename("contract.pdf")).toBe("contract-edited.pdf");
    expect(buildOutputFilename("nested.report.PDF")).toBe(
      "nested.report-edited.pdf",
    );
    expect(buildOutputFilename("")).toBe("document-edited.pdf");
  });

  it("formats bytes for the size hint", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
    expect(formatBytes(50 * 1024 * 1024)).toBe("50 MB");
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
});
