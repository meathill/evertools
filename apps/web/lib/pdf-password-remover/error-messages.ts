import { formatBytes } from "@/lib/format";
import {
  PDF_PASSWORD_REMOVER_ERROR_CODES,
  type PdfPasswordRemoverErrorCode,
} from "@/lib/pdf-password-remover/errors";
import { MAX_PDF_FILE_SIZE } from "@/lib/pdf-password-remover/types";
import type { LocaleContent } from "@/messages/types";

export function getPdfPasswordRemoverErrorMessage(
  code: PdfPasswordRemoverErrorCode | null,
  detail: string | null,
  content: LocaleContent["pdfPasswordRemover"],
): string {
  switch (code) {
    case PDF_PASSWORD_REMOVER_ERROR_CODES.FILE_TOO_LARGE:
      return content.client.errors.fileTooLarge.replace(
        "{size}",
        formatBytes(MAX_PDF_FILE_SIZE),
      );
    case PDF_PASSWORD_REMOVER_ERROR_CODES.INVALID_PASSWORD:
      return content.client.errors.invalidPassword;
    case PDF_PASSWORD_REMOVER_ERROR_CODES.LOAD_FAILED:
      return content.client.errors.loadFailed;
    case PDF_PASSWORD_REMOVER_ERROR_CODES.UNSUPPORTED_FORMAT:
      return content.client.errors.unsupportedFormat;
    case PDF_PASSWORD_REMOVER_ERROR_CODES.DECRYPT_FAILED:
      return detail
        ? content.client.errors.decryptFailedDetail.replace("{detail}", detail)
        : content.client.errors.decryptFailed;
    default:
      return detail
        ? content.client.errors.decryptFailedDetail.replace("{detail}", detail)
        : content.client.errors.decryptFailed;
  }
}
