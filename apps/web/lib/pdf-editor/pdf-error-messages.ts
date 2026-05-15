import {
  PDF_EDITOR_ERROR_CODES,
  type PdfEditorErrorCode,
} from "@/lib/pdf-editor/pdf-errors";
import { formatBytes, MAX_PDF_FILE_SIZE } from "@/lib/pdf-editor/pdf-types";
import type { LocaleContent } from "@/messages/types";

export function getPdfEditorErrorMessage(
  code: PdfEditorErrorCode,
  detail: string | null,
  content: LocaleContent["pdfTextEditor"],
): string {
  switch (code) {
    case PDF_EDITOR_ERROR_CODES.CJK_FONT_LOAD_FAILED:
      return content.client.errors.cjkFontLoadFailed;
    case PDF_EDITOR_ERROR_CODES.ENCRYPTED_NOT_SUPPORTED:
      return content.client.errors.encryptedNotSupported;
    case PDF_EDITOR_ERROR_CODES.EXPORT_FAILED:
      return content.client.errors.exportFailed;
    case PDF_EDITOR_ERROR_CODES.FILE_TOO_LARGE:
      return content.client.errors.fileTooLarge.replace(
        "{size}",
        formatBytes(MAX_PDF_FILE_SIZE),
      );
    case PDF_EDITOR_ERROR_CODES.FONT_EMBED_FAILED:
      return content.client.errors.fontEmbedFailed;
    case PDF_EDITOR_ERROR_CODES.FONT_MISSING_GLYPH:
      return content.client.errors.fontMissingGlyph;
    case PDF_EDITOR_ERROR_CODES.SCANNED_NOT_SUPPORTED:
      return content.client.errors.scannedNotSupported;
    case PDF_EDITOR_ERROR_CODES.UNSUPPORTED_FONT:
      return content.client.errors.unsupportedFont;
    case PDF_EDITOR_ERROR_CODES.UNSUPPORTED_FORMAT:
      return content.client.errors.unsupportedFormat;
    case PDF_EDITOR_ERROR_CODES.WORKER_FAILED:
      return content.client.errors.workerFailed;
    default:
      return detail
        ? content.client.errors.loadFailedDetail.replace("{detail}", detail)
        : content.client.errors.loadFailed;
  }
}
