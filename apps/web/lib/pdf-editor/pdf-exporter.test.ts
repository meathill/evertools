import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as pdfLib from "pdf-lib";

vi.mock("pdf-lib", () => ({
  PDFDocument: { load: vi.fn() },
  rgb: vi.fn((r: number, g: number, b: number) => ({ b, g, r })),
}));

let fontkitDefaultValue: unknown;

vi.mock("@pdf-lib/fontkit", () => ({
  get default() {
    return fontkitDefaultValue;
  },
  bareMarker: "bare-fontkit",
}));

vi.mock("@/lib/pdf-editor/pdf-fonts", () => ({
  getCjkFontBytes: vi.fn(),
  getEmbeddedFont: vi.fn(),
  getUserFont: vi.fn(),
  resolveFontForText: vi.fn(),
}));

vi.mock("@/lib/pdf-editor/pdf-cjk-fallback", () => ({
  ensureCjkFallbackFont: vi.fn(),
}));

import {
  PDF_EDITOR_ERROR_CODES,
  parsePdfEditorError,
} from "@/lib/pdf-editor/pdf-errors";
import { exportEditedPdf } from "@/lib/pdf-editor/pdf-exporter";
import {
  getEmbeddedFont,
  resolveFontForText,
} from "@/lib/pdf-editor/pdf-fonts";
import type {
  EditedBlock,
  PdfPageMeta,
  PdfTextBlock,
} from "@/lib/pdf-editor/pdf-types";

type FakePdfLibFont = {
  widthOfTextAtSize: (text: string, size: number) => number;
};
type FakePdfLibPage = {
  drawRectangle: ReturnType<typeof vi.fn>;
  drawText: ReturnType<typeof vi.fn>;
};
type FakePdfLibDoc = {
  embedFont: ReturnType<typeof vi.fn>;
  getPage: ReturnType<typeof vi.fn>;
  registerFontkit: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
};

function buildFakeFont(): FakePdfLibFont {
  return { widthOfTextAtSize: vi.fn(() => 10) };
}

function buildFakePage(): FakePdfLibPage {
  return { drawRectangle: vi.fn(), drawText: vi.fn() };
}

function buildFakeDoc(): {
  doc: FakePdfLibDoc;
  pages: Map<number, FakePdfLibPage>;
} {
  const pages = new Map<number, FakePdfLibPage>();
  const doc: FakePdfLibDoc = {
    embedFont: vi.fn(async () => buildFakeFont()),
    getPage: vi.fn((pageIndex: number) => {
      let page = pages.get(pageIndex);
      if (!page) {
        page = buildFakePage();
        pages.set(pageIndex, page);
      }
      return page;
    }),
    registerFontkit: vi.fn(),
    save: vi.fn(async () => new Uint8Array([9, 9, 9])),
  };
  return { doc, pages };
}

function buildTextBlock(overrides: Partial<PdfTextBlock> = {}): PdfTextBlock {
  return {
    blockId: "i0",
    fontName: "Body",
    fontSize: 12,
    height: 14,
    pageIndex: 0,
    text: "Hello",
    transform: [1, 0, 0, 1, 10, 20],
    width: 40,
    ...overrides,
  };
}

function buildPageMeta(overrides: Partial<PdfPageMeta> = {}): PdfPageMeta {
  return {
    canvasDataUrl: "data:image/png;base64,mock",
    height: 100,
    pageIndex: 0,
    rotation: 0,
    textBlocks: [],
    viewportScale: 1,
    width: 80,
    ...overrides,
  };
}

function buildEditedBlock(overrides: Partial<EditedBlock> = {}): EditedBlock {
  return {
    blockKey: "0::i0",
    fontSize: 0,
    isOverflow: false,
    newText: "Bonjour",
    originalText: "Hello",
    ...overrides,
  };
}

type SingleBlockScenario = {
  editedBlock?: Partial<EditedBlock>;
  onProgress?: (current: number, total: number) => void;
};

function runSingleBlockExport(scenario: SingleBlockScenario = {}) {
  const textBlock = buildTextBlock();
  const editedBlock = buildEditedBlock({
    blockKey: "0::i0",
    ...scenario.editedBlock,
  });

  return exportEditedPdf({
    documentKey: "exporter-doc",
    editedBlocks: new Map([[editedBlock.blockKey, editedBlock]]),
    onProgress: scenario.onProgress,
    originalBytes: new Uint8Array([1]),
    pages: [buildPageMeta()],
    textBlocksByKey: new Map([[editedBlock.blockKey, textBlock]]),
  });
}

function mockEmbeddedFontBytes(): void {
  vi.mocked(getEmbeddedFont).mockReturnValue({
    bytes: new Uint8Array([1, 2, 3]),
    isType3: false,
    loadedName: "Body",
    mimeType: "font/opentype",
    postScriptName: "Body-PS",
  });
}

async function captureRejection(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error("Expected the promise to reject, but it resolved");
}

let fakeDoc: FakePdfLibDoc;

beforeEach(() => {
  const built = buildFakeDoc();
  fakeDoc = built.doc;
  vi.mocked(pdfLib.PDFDocument.load).mockResolvedValue(
    fakeDoc as unknown as Awaited<ReturnType<typeof pdfLib.PDFDocument.load>>,
  );
  fontkitDefaultValue = { defaultMarker: "default-fontkit" };
  vi.mocked(resolveFontForText).mockReset();
  vi.mocked(getEmbeddedFont).mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("exportEditedPdf orchestration and skip logic", () => {
  it("skips a block whose newText equals originalText without calling resolveFontForText", async () => {
    const onProgress = vi.fn();
    await runSingleBlockExport({
      editedBlock: { newText: "Hello", originalText: "Hello" },
      onProgress,
    });

    expect(resolveFontForText).not.toHaveBeenCalled();
    expect(onProgress).toHaveBeenNthCalledWith(2, 1, 1);
  });

  it("skips a block when textBlocksByKey has no entry for its blockKey", async () => {
    const editedBlock = buildEditedBlock({ blockKey: "missing-block" });

    const result = await exportEditedPdf({
      documentKey: "exporter-doc",
      editedBlocks: new Map([[editedBlock.blockKey, editedBlock]]),
      originalBytes: new Uint8Array([1]),
      pages: [buildPageMeta()],
      textBlocksByKey: new Map(),
    });

    expect(result.missingGlyphBlocks).toEqual([]);
    expect(resolveFontForText).not.toHaveBeenCalled();
  });

  it("skips a block when pages[block.pageIndex] is out of range", async () => {
    const textBlock = buildTextBlock({ pageIndex: 3 });
    const editedBlock = buildEditedBlock();

    const result = await exportEditedPdf({
      documentKey: "exporter-doc",
      editedBlocks: new Map([[editedBlock.blockKey, editedBlock]]),
      originalBytes: new Uint8Array([1]),
      pages: [buildPageMeta()],
      textBlocksByKey: new Map([[editedBlock.blockKey, textBlock]]),
    });

    expect(result.missingGlyphBlocks).toEqual([]);
    expect(resolveFontForText).not.toHaveBeenCalled();
  });

  it("collects missing-glyph blocks when resolveFontForText reports kind missing", async () => {
    vi.mocked(resolveFontForText).mockResolvedValue({
      kind: "missing",
      missingChars: ["B"],
    });

    const result = await runSingleBlockExport();

    expect(result.missingGlyphBlocks).toEqual([
      { blockKey: "0::i0", chars: ["B"] },
    ]);
    expect(fakeDoc.getPage).not.toHaveBeenCalled();
  });

  it("falls back to missing-glyph collection using all newText characters when embedFont fails", async () => {
    mockEmbeddedFontBytes();
    vi.mocked(resolveFontForText).mockResolvedValue({
      embedKey: "embedded::Body",
      kind: "embedded",
      sourceFontName: "Body-PS",
    });
    fakeDoc.embedFont.mockRejectedValueOnce(new Error("embed failed"));

    const result = await runSingleBlockExport({
      editedBlock: { newText: "Bonjour" },
    });

    expect(result.missingGlyphBlocks).toEqual([
      { blockKey: "0::i0", chars: Array.from("Bonjour") },
    ]);
  });

  it("resolves with an empty missingGlyphBlocks list and a single onProgress(0,0) call for an empty editedBlocks map", async () => {
    const onProgress = vi.fn();

    const result = await exportEditedPdf({
      documentKey: "exporter-doc",
      editedBlocks: new Map(),
      onProgress,
      originalBytes: new Uint8Array([1]),
      pages: [],
      textBlocksByKey: new Map(),
    });

    expect(result).toEqual({
      bytes: new Uint8Array([9, 9, 9]),
      missingGlyphBlocks: [],
    });
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress).toHaveBeenCalledWith(0, 0);
  });
});

describe("exportEditedPdf failure paths and fontkit ESM interop", () => {
  it("wraps PDFDocument.load rejection as EXPORT_FAILED with the original message as detail", async () => {
    vi.mocked(pdfLib.PDFDocument.load).mockRejectedValue(new Error("bad pdf"));

    const error = await captureRejection(runSingleBlockExport());

    expect(parsePdfEditorError(error)).toEqual({
      code: PDF_EDITOR_ERROR_CODES.EXPORT_FAILED,
      detail: "bad pdf",
    });
  });

  it("wraps doc.save() rejection as EXPORT_FAILED", async () => {
    fakeDoc.save.mockRejectedValueOnce(new Error("disk full"));
    vi.mocked(resolveFontForText).mockResolvedValue({
      kind: "missing",
      missingChars: [],
    });

    const error = await captureRejection(runSingleBlockExport());

    expect(parsePdfEditorError(error)).toEqual({
      code: PDF_EDITOR_ERROR_CODES.EXPORT_FAILED,
      detail: "disk full",
    });
  });

  it("unwraps a default-exported fontkit module before passing it to registerFontkit", async () => {
    fontkitDefaultValue = { defaultMarker: "explicit-default" };
    vi.mocked(resolveFontForText).mockResolvedValue({
      kind: "missing",
      missingChars: [],
    });

    await runSingleBlockExport();

    expect(fakeDoc.registerFontkit).toHaveBeenCalledWith({
      defaultMarker: "explicit-default",
    });
  });

  it("passes the fontkit module through as-is when it has no default export", async () => {
    fontkitDefaultValue = undefined;
    vi.mocked(resolveFontForText).mockResolvedValue({
      kind: "missing",
      missingChars: [],
    });

    await runSingleBlockExport();

    expect(fakeDoc.registerFontkit).toHaveBeenCalledWith({
      bareMarker: "bare-fontkit",
    });
  });
});
