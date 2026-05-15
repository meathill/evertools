import { ensureCjkFallbackFont } from "@/lib/pdf-editor/pdf-cjk-fallback";
import {
  createPdfEditorError,
  PDF_EDITOR_ERROR_CODES,
} from "@/lib/pdf-editor/pdf-errors";
import {
  getCjkFontBytes,
  getEmbeddedFont,
  getUserFont,
  resolveFontForText,
} from "@/lib/pdf-editor/pdf-fonts";
import {
  type EditedBlock,
  MIN_EXPORT_FONT_SIZE,
  type PdfPageMeta,
  type PdfTextBlock,
} from "@/lib/pdf-editor/pdf-types";

export type ExportPdfOptions = {
  documentKey: string;
  editedBlocks: ReadonlyMap<string, EditedBlock>;
  onProgress?: (current: number, total: number) => void;
  originalBytes: Uint8Array;
  pages: readonly PdfPageMeta[];
  textBlocksByKey: ReadonlyMap<string, PdfTextBlock>;
};

export type ExportPdfResult = {
  bytes: Uint8Array;
  missingGlyphBlocks: readonly { blockKey: string; chars: readonly string[] }[];
};

export async function exportEditedPdf(
  options: ExportPdfOptions,
): Promise<ExportPdfResult> {
  const pdfLibMod = await import("pdf-lib");
  const fontkitMod = await import("@pdf-lib/fontkit");
  const fontkit =
    (fontkitMod as unknown as { default?: unknown }).default ?? fontkitMod;

  let doc: Awaited<ReturnType<typeof pdfLibMod.PDFDocument.load>>;
  try {
    doc = await pdfLibMod.PDFDocument.load(
      options.originalBytes as unknown as ArrayBuffer,
      {
        ignoreEncryption: false,
        updateMetadata: false,
      },
    );
  } catch (error) {
    throw createPdfEditorError(
      PDF_EDITOR_ERROR_CODES.EXPORT_FAILED,
      error instanceof Error ? error.message : undefined,
    );
  }
  doc.registerFontkit(fontkit as Parameters<typeof doc.registerFontkit>[0]);

  const fontCache: Map<string, PdfLibFont> = new Map();
  const missingGlyphBlocks: { blockKey: string; chars: readonly string[] }[] =
    [];

  const total = options.editedBlocks.size;
  let processed = 0;
  options.onProgress?.(0, total);

  for (const [blockKey, edited] of options.editedBlocks) {
    if (edited.newText === edited.originalText) {
      processed += 1;
      options.onProgress?.(processed, total);
      continue;
    }

    const block = options.textBlocksByKey.get(blockKey);
    if (!block) {
      processed += 1;
      options.onProgress?.(processed, total);
      continue;
    }

    const page = options.pages[block.pageIndex];
    if (!page) {
      processed += 1;
      options.onProgress?.(processed, total);
      continue;
    }

    const resolution = await resolveFontForText(
      {
        documentKey: options.documentKey,
        fontLoadedName: block.fontName,
        text: edited.newText,
      },
      { ensureCjkFont: ensureCjkFallbackFont },
    );

    if (resolution.kind === "missing") {
      missingGlyphBlocks.push({
        blockKey,
        chars: resolution.missingChars,
      });
      processed += 1;
      options.onProgress?.(processed, total);
      continue;
    }

    const pdfFont = await getOrEmbedFont({
      cacheKey: resolution.embedKey,
      doc,
      documentKey: options.documentKey,
      fontCache,
      kind: resolution.kind,
    });

    if (!pdfFont) {
      missingGlyphBlocks.push({
        blockKey,
        chars: Array.from(edited.newText),
      });
      processed += 1;
      options.onProgress?.(processed, total);
      continue;
    }

    drawReplacedBlock({
      block,
      edited,
      page: doc.getPage(block.pageIndex),
      pageMeta: page,
      pdfFont,
      pdfLib: pdfLibMod,
    });

    processed += 1;
    options.onProgress?.(processed, total);
    if (typeof window !== "undefined") {
      await yieldToMain();
    }
  }

  let bytes: Uint8Array;
  try {
    bytes = await doc.save({ useObjectStreams: true });
  } catch (error) {
    throw createPdfEditorError(
      PDF_EDITOR_ERROR_CODES.EXPORT_FAILED,
      error instanceof Error ? error.message : undefined,
    );
  }

  return { bytes, missingGlyphBlocks };
}

type PdfLibDocument = Awaited<
  ReturnType<typeof import("pdf-lib").PDFDocument.load>
>;
type PdfLibFont = Awaited<ReturnType<PdfLibDocument["embedFont"]>>;

type GetOrEmbedFontInput = {
  cacheKey: string;
  doc: PdfLibDocument;
  documentKey: string;
  fontCache: Map<string, PdfLibFont>;
  kind: "embedded" | "cjkFallback" | "userUpload";
};

async function getOrEmbedFont(
  input: GetOrEmbedFontInput,
): Promise<PdfLibFont | null> {
  const cached = input.fontCache.get(input.cacheKey);
  if (cached) {
    return cached;
  }

  const bytes = pickBytes(input);
  if (!bytes) {
    return null;
  }

  try {
    const font = await input.doc.embedFont(bytes as unknown as ArrayBuffer, {
      subset: true,
    });
    input.fontCache.set(input.cacheKey, font);
    return font;
  } catch {
    return null;
  }
}

function pickBytes(input: GetOrEmbedFontInput): Uint8Array | null {
  if (input.kind === "embedded") {
    const [, loadedName] = input.cacheKey.split("::");
    const entry = getEmbeddedFont(input.documentKey, loadedName ?? "");
    return entry?.bytes ?? null;
  }
  if (input.kind === "cjkFallback") {
    return getCjkFontBytes();
  }
  const userFont = getUserFont(input.documentKey);
  return userFont?.bytes ?? null;
}

type PdfLibPage = ReturnType<PdfLibDocument["getPage"]>;

type DrawReplacedBlockInput = {
  block: PdfTextBlock;
  edited: EditedBlock;
  page: PdfLibPage;
  pageMeta: PdfPageMeta;
  pdfFont: PdfLibFont;
  pdfLib: typeof import("pdf-lib");
};

function drawReplacedBlock(input: DrawReplacedBlockInput): void {
  const { block, edited, page, pageMeta, pdfFont, pdfLib } = input;
  const viewportScale = pageMeta.viewportScale || 1;
  const pdfX = block.transform[4] / viewportScale;
  const topY = block.transform[5] / viewportScale;
  const renderedHeight = block.height / viewportScale;
  const renderedWidth = block.width / viewportScale;
  const pdfHeight = pageMeta.height / viewportScale;

  const bottomY = pdfHeight - topY;

  const padding = renderedHeight * 0.15;
  page.drawRectangle({
    color: pdfLib.rgb(1, 1, 1),
    height: renderedHeight + padding * 2,
    width: Math.max(renderedWidth, 1) + padding * 2,
    x: pdfX - padding,
    y: bottomY - padding,
  });

  const desiredSize = edited.fontSize || block.fontSize / viewportScale;
  const measuredWidth = pdfFont.widthOfTextAtSize(edited.newText, desiredSize);
  const maxWidth = Math.max(renderedWidth, 1);
  let drawSize = desiredSize;
  if (measuredWidth > maxWidth && measuredWidth > 0) {
    drawSize = Math.max(
      MIN_EXPORT_FONT_SIZE,
      (desiredSize * maxWidth) / measuredWidth,
    );
  }

  page.drawText(edited.newText, {
    color: pdfLib.rgb(0, 0, 0),
    font: pdfFont,
    size: drawSize,
    x: pdfX,
    y: bottomY,
  });
}

function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve(), { timeout: 60 });
      return;
    }
    setTimeout(resolve, 0);
  });
}
