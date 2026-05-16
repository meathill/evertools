import {
  createPdfEditorError,
  PDF_EDITOR_ERROR_CODES,
} from "@/lib/pdf-editor/pdf-errors";
import {
  type EmbeddedFontEntry,
  registerEmbeddedFontFace,
  storeEmbeddedFont,
} from "@/lib/pdf-editor/pdf-fonts";
import { detectScannedPdf } from "@/lib/pdf-editor/pdf-scan-detector";
import {
  type ImportPdfResult,
  MAX_PDF_FILE_SIZE,
  type PdfPageMeta,
  type PdfTextBlock,
} from "@/lib/pdf-editor/pdf-types";

const RENDER_SCALE = 1.5;

let workerConfigured = false;

async function loadPdfjs() {
  const mod = await import("pdfjs-dist");
  if (!workerConfigured && typeof window !== "undefined") {
    mod.GlobalWorkerOptions.workerSrc = "/pdf/pdf.worker.min.mjs";
    workerConfigured = true;
  }
  return mod;
}

export type ParsePdfOptions = {
  documentKey: string;
  file: File;
};

export async function parsePdfFile(
  options: ParsePdfOptions,
): Promise<{ result: ImportPdfResult; originalBytes: Uint8Array }> {
  const { documentKey, file } = options;

  if (file.size > MAX_PDF_FILE_SIZE) {
    throw createPdfEditorError(
      PDF_EDITOR_ERROR_CODES.FILE_TOO_LARGE,
      String(MAX_PDF_FILE_SIZE),
    );
  }

  const buffer = await file.arrayBuffer();
  const originalBytes = new Uint8Array(buffer.slice(0));
  const pdfjsBytes = new Uint8Array(buffer.slice(0));

  const pdfjs = await loadPdfjs();

  let pdfDoc: Awaited<ReturnType<typeof pdfjs.getDocument>["promise"]>;
  try {
    pdfDoc = await pdfjs.getDocument({
      data: pdfjsBytes,
      disableFontFace: false,
      useSystemFonts: false,
    }).promise;
  } catch (error) {
    if (error instanceof Error && /password|encrypted/i.test(error.message)) {
      throw createPdfEditorError(
        PDF_EDITOR_ERROR_CODES.ENCRYPTED_NOT_SUPPORTED,
      );
    }
    throw createPdfEditorError(
      PDF_EDITOR_ERROR_CODES.LOAD_FAILED,
      error instanceof Error ? error.message : undefined,
    );
  }

  const pages: PdfPageMeta[] = [];
  let totalTextChars = 0;
  const seenFontKeys = new Set<string>();

  for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: RENDER_SCALE });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) {
      throw createPdfEditorError(PDF_EDITOR_ERROR_CODES.LOAD_FAILED);
    }

    try {
      await page.render({ canvasContext, viewport }).promise;
    } catch (error) {
      throw createPdfEditorError(
        PDF_EDITOR_ERROR_CODES.LOAD_FAILED,
        error instanceof Error ? error.message : undefined,
      );
    }

    const canvasDataUrl = canvas.toDataURL("image/png");
    canvas.width = 0;
    canvas.height = 0;

    await page.getOperatorList().catch(() => {
      // Some PDFs throw here for non-fatal reasons; font loading is best-effort.
    });

    let textContent: Awaited<ReturnType<typeof page.getTextContent>>;
    try {
      textContent = await page.getTextContent();
    } catch (error) {
      throw createPdfEditorError(
        PDF_EDITOR_ERROR_CODES.LOAD_FAILED,
        `Page ${pageNumber}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const textBlocks: PdfTextBlock[] = [];
    for (let index = 0; index < textContent.items.length; index++) {
      const item = textContent.items[index];
      if (!("str" in item)) {
        continue;
      }
      if (item.str.length === 0) {
        continue;
      }
      const transform = item.transform as unknown as readonly [
        number,
        number,
        number,
        number,
        number,
        number,
      ];
      const fontSize = Math.hypot(transform[2], transform[3]);
      textBlocks.push({
        blockId: `p${pageNumber - 1}-i${index}`,
        fontName: item.fontName,
        fontSize,
        height: item.height,
        pageIndex: pageNumber - 1,
        text: item.str,
        transform,
        width: item.width,
      });
      totalTextChars += item.str.length;
    }

    try {
      extractEmbeddedFonts({
        documentKey,
        page,
        seenFontKeys,
      });
    } catch {
      // Font extraction is best-effort; failure here is non-fatal.
    }

    pages.push({
      canvasDataUrl,
      height: viewport.height,
      pageIndex: pageNumber - 1,
      rotation: viewport.rotation,
      textBlocks,
      viewportScale: RENDER_SCALE,
      width: viewport.width,
    });

    page.cleanup();
  }

  await pdfDoc.cleanup();
  pdfDoc.destroy();

  const isScanned = detectScannedPdf({
    pageCount: pages.length,
    totalTextChars,
  });

  return {
    originalBytes,
    result: {
      fileName: file.name,
      fileSize: file.size,
      isScanned,
      pages,
      totalTextChars,
    },
  };
}

type ExtractEmbeddedFontsInput = {
  documentKey: string;
  page: {
    commonObjs: {
      get: (id: string) => unknown;
      has: (id: string) => boolean;
    };
  };
  seenFontKeys: Set<string>;
};

function extractEmbeddedFonts(input: ExtractEmbeddedFontsInput): void {
  const objs = (
    input.page.commonObjs as unknown as {
      _objs?: Record<string, { data?: unknown }>;
    }
  )._objs;

  if (!objs) {
    return;
  }

  for (const objId of Object.keys(objs)) {
    if (input.seenFontKeys.has(objId)) {
      continue;
    }
    const fontEntry = objs[objId];
    if (!fontEntry || typeof fontEntry !== "object") {
      continue;
    }
    let fontObj: unknown;
    try {
      fontObj = input.page.commonObjs.get(objId);
    } catch {
      continue;
    }
    if (!isFontObject(fontObj)) {
      continue;
    }
    if (!fontObj.data) {
      continue;
    }
    const rawBytes =
      fontObj.data instanceof Uint8Array
        ? fontObj.data
        : new Uint8Array(fontObj.data);
    if (rawBytes.byteLength === 0) {
      continue;
    }
    const entry: EmbeddedFontEntry = {
      bytes: rawBytes,
      isType3: Boolean(fontObj.isType3Font),
      loadedName: fontObj.loadedName ?? objId,
      mimeType: fontObj.mimetype ?? "font/opentype",
      postScriptName: fontObj.name ?? fontObj.loadedName ?? objId,
    };
    storeEmbeddedFont(input.documentKey, entry);
    if (typeof document !== "undefined" && !entry.isType3) {
      void registerEmbeddedFontFace(entry);
    }
    input.seenFontKeys.add(objId);
  }
}

function isFontObject(value: unknown): value is {
  data?: Uint8Array | ArrayBuffer;
  isType3Font?: boolean;
  loadedName?: string;
  mimetype?: string;
  name?: string;
} {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    "loadedName" in (value as object)
  );
}
