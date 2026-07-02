import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as pdfLib from "pdf-lib";

vi.mock("pdf-lib", () => ({
  PDFDocument: { load: vi.fn() },
  rgb: vi.fn((r: number, g: number, b: number) => ({ b, g, r })),
}));

vi.mock("@pdf-lib/fontkit", () => ({ default: { marker: "default-fontkit" } }));

vi.mock("@/lib/pdf-editor/pdf-fonts", () => ({
  getCjkFontBytes: vi.fn(),
  getEmbeddedFont: vi.fn(),
  getUserFont: vi.fn(),
  resolveFontForText: vi.fn(),
}));

vi.mock("@/lib/pdf-editor/pdf-cjk-fallback", () => ({
  ensureCjkFallbackFont: vi.fn(),
}));

import { exportEditedPdf } from "@/lib/pdf-editor/pdf-exporter";
import {
  getCjkFontBytes,
  getEmbeddedFont,
  getUserFont,
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

let fakeDoc: FakePdfLibDoc;

beforeEach(() => {
  const built = buildFakeDoc();
  fakeDoc = built.doc;
  vi.mocked(pdfLib.PDFDocument.load).mockResolvedValue(
    fakeDoc as unknown as Awaited<ReturnType<typeof pdfLib.PDFDocument.load>>,
  );
  vi.mocked(resolveFontForText).mockReset();
  vi.mocked(getEmbeddedFont).mockReset();
  vi.mocked(getCjkFontBytes).mockReset();
  vi.mocked(getUserFont).mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("exportEditedPdf font caching", () => {
  it("calls embedFont only once for two blocks sharing the same resolution.embedKey", async () => {
    mockEmbeddedFontBytes();
    vi.mocked(resolveFontForText).mockResolvedValue({
      embedKey: "embedded::Body",
      kind: "embedded",
      sourceFontName: "Body-PS",
    });
    const editedA = buildEditedBlock({ blockKey: "0::i0" });
    const editedB = buildEditedBlock({ blockKey: "0::i1" });

    await exportEditedPdf({
      documentKey: "exporter-doc",
      editedBlocks: new Map([
        [editedA.blockKey, editedA],
        [editedB.blockKey, editedB],
      ]),
      originalBytes: new Uint8Array([1]),
      pages: [buildPageMeta()],
      textBlocksByKey: new Map([
        [editedA.blockKey, buildTextBlock({ blockId: "i0" })],
        [editedB.blockKey, buildTextBlock({ blockId: "i1" })],
      ]),
    });

    expect(fakeDoc.embedFont).toHaveBeenCalledTimes(1);
  });

  it("calls embedFont again for a different embedKey", async () => {
    mockEmbeddedFontBytes();
    let call = 0;
    vi.mocked(resolveFontForText).mockImplementation(async () => {
      call += 1;
      return {
        embedKey: `embedded::Body-${call}`,
        kind: "embedded",
        sourceFontName: "Body-PS",
      };
    });
    const editedA = buildEditedBlock({ blockKey: "0::i0" });
    const editedB = buildEditedBlock({ blockKey: "0::i1" });

    await exportEditedPdf({
      documentKey: "exporter-doc",
      editedBlocks: new Map([
        [editedA.blockKey, editedA],
        [editedB.blockKey, editedB],
      ]),
      originalBytes: new Uint8Array([1]),
      pages: [buildPageMeta()],
      textBlocksByKey: new Map([
        [editedA.blockKey, buildTextBlock({ blockId: "i0" })],
        [editedB.blockKey, buildTextBlock({ blockId: "i1" })],
      ]),
    });

    expect(fakeDoc.embedFont).toHaveBeenCalledTimes(2);
  });

  it("routes kind embedded through getEmbeddedFont using the loadedName parsed from the cacheKey", async () => {
    mockEmbeddedFontBytes();
    vi.mocked(resolveFontForText).mockResolvedValue({
      embedKey: "embedded::Special-Name",
      kind: "embedded",
      sourceFontName: "PS",
    });

    await runSingleBlockExport();

    expect(getEmbeddedFont).toHaveBeenCalledWith(
      "exporter-doc",
      "Special-Name",
    );
  });

  it("routes kind cjkFallback through getCjkFontBytes without touching getEmbeddedFont or getUserFont", async () => {
    vi.mocked(getCjkFontBytes).mockReturnValue(new Uint8Array([1]));
    vi.mocked(resolveFontForText).mockResolvedValue({
      embedKey: "cjk::__cjk_fallback__",
      kind: "cjkFallback",
    });

    await runSingleBlockExport();

    expect(getCjkFontBytes).toHaveBeenCalled();
    expect(getEmbeddedFont).not.toHaveBeenCalled();
    expect(getUserFont).not.toHaveBeenCalled();
  });

  it("routes kind userUpload through getUserFont, falling back to missing when it returns null", async () => {
    vi.mocked(getUserFont).mockReturnValue(null);
    vi.mocked(resolveFontForText).mockResolvedValue({
      embedKey: "user::__user_font__",
      kind: "userUpload",
    });

    const result = await runSingleBlockExport({
      editedBlock: { newText: "Hi" },
    });

    expect(result.missingGlyphBlocks).toEqual([
      { blockKey: "0::i0", chars: Array.from("Hi") },
    ]);
  });
});

describe("exportEditedPdf progress callback", () => {
  it("calls onProgress with (0, total) synchronously before processing any block", async () => {
    const onProgress = vi.fn();
    vi.mocked(resolveFontForText).mockResolvedValue({
      kind: "missing",
      missingChars: [],
    });

    await runSingleBlockExport({ onProgress });

    expect(onProgress).toHaveBeenNthCalledWith(1, 0, 1);
  });

  it("calls onProgress after every block regardless of outcome, ending at (total, total)", async () => {
    const onProgress = vi.fn();
    mockEmbeddedFontBytes();
    vi.mocked(resolveFontForText)
      .mockResolvedValueOnce({ kind: "missing", missingChars: ["x"] })
      .mockResolvedValueOnce({
        embedKey: "embedded::Body",
        kind: "embedded",
        sourceFontName: "PS",
      });
    const skip = buildEditedBlock({
      blockKey: "0::skip",
      newText: "same",
      originalText: "same",
    });
    const missing = buildEditedBlock({ blockKey: "0::missing", newText: "x" });
    const drawn = buildEditedBlock({ blockKey: "0::drawn", newText: "y" });

    await exportEditedPdf({
      documentKey: "exporter-doc",
      editedBlocks: new Map([
        [skip.blockKey, skip],
        [missing.blockKey, missing],
        [drawn.blockKey, drawn],
      ]),
      onProgress,
      originalBytes: new Uint8Array([1]),
      pages: [buildPageMeta()],
      textBlocksByKey: new Map([
        [skip.blockKey, buildTextBlock({ blockId: "skip" })],
        [missing.blockKey, buildTextBlock({ blockId: "missing" })],
        [drawn.blockKey, buildTextBlock({ blockId: "drawn" })],
      ]),
    });

    expect(onProgress).toHaveBeenCalledTimes(4);
    expect(onProgress).toHaveBeenNthCalledWith(1, 0, 3);
    expect(onProgress).toHaveBeenNthCalledWith(4, 3, 3);
  });

  it("does not throw when onProgress is not provided", async () => {
    vi.mocked(resolveFontForText).mockResolvedValue({
      kind: "missing",
      missingChars: [],
    });

    await expect(runSingleBlockExport()).resolves.toBeDefined();
  });
});
