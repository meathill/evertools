export const ACCEPTED_PDF_TYPES = ["application/pdf"] as const;

export const ACCEPTED_FONT_EXTENSIONS = [".ttf", ".otf"] as const;

export const MAX_PDF_FILE_SIZE = 50 * 1024 * 1024;

export const MIN_EXPORT_FONT_SIZE = 6;

export type PdfTextBlock = {
  blockId: string;
  fontName: string;
  fontSize: number;
  height: number;
  pageIndex: number;
  text: string;
  transform: readonly [number, number, number, number, number, number];
  width: number;
};

export type PdfPageMeta = {
  canvasDataUrl: string;
  height: number;
  pageIndex: number;
  rotation: number;
  textBlocks: readonly PdfTextBlock[];
  viewportScale: number;
  width: number;
};

export type ImportPdfResult = {
  fileName: string;
  fileSize: number;
  isScanned: boolean;
  pages: readonly PdfPageMeta[];
  totalTextChars: number;
};

export type EditedBlock = {
  blockKey: string;
  fontSize: number;
  isOverflow: boolean;
  newText: string;
  originalText: string;
};

export type FontResolution =
  | { kind: "embedded"; embedKey: string; sourceFontName: string }
  | { kind: "cjkFallback"; embedKey: string }
  | { kind: "userUpload"; embedKey: string }
  | { kind: "missing"; missingChars: readonly string[] };

export function buildBlockKey(pageIndex: number, blockId: string): string {
  return `${pageIndex}::${blockId}`;
}

export function buildOutputFilename(sourceName: string): string {
  const baseName = sourceName.replace(/\.[^.]+$/, "").trim() || "document";
  return `${baseName}-edited.pdf`;
}

export function containsCjk(text: string): boolean {
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (
      (code >= 0x3400 && code <= 0x4dbf) ||
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x20000 && code <= 0x2a6df) ||
      (code >= 0x3000 && code <= 0x303f) ||
      (code >= 0x3040 && code <= 0x309f) ||
      (code >= 0x30a0 && code <= 0x30ff) ||
      (code >= 0xac00 && code <= 0xd7af) ||
      (code >= 0xff00 && code <= 0xffef)
    ) {
      return true;
    }
  }
  return false;
}

export function isAcceptedPdfType(type: string): boolean {
  return (ACCEPTED_PDF_TYPES as readonly string[]).includes(type);
}

export function isAcceptedFontName(name: string): boolean {
  const lower = name.toLowerCase();
  return ACCEPTED_FONT_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
}
