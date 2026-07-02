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

function buildFakePage(): FakePdfLibPage {
  return { drawRectangle: vi.fn(), drawText: vi.fn() };
}

function buildFakeDoc(): {
  doc: FakePdfLibDoc;
  pages: Map<number, FakePdfLibPage>;
} {
  const pages = new Map<number, FakePdfLibPage>();
  const doc: FakePdfLibDoc = {
    embedFont: vi.fn(),
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

type DrawScenario = {
  blockFontSize?: number;
  blockHeight?: number;
  blockWidth?: number;
  editedFontSize?: number;
  newText?: string;
  pageHeight?: number;
  transform?: readonly [number, number, number, number, number, number];
  viewportScale?: number;
  widthOfTextAtSize?: (text: string, size: number) => number;
};

// Draws a single edited block through the real exportEditedPdf orchestration
// (kind "embedded" is always resolved) so drawReplacedBlock's coordinate and
// font-size math runs for real; only pdf-lib and pdf-fonts are mocked.
async function runDrawExport(
  scenario: DrawScenario = {},
): Promise<{ page: FakePdfLibPage }> {
  const font: FakePdfLibFont = {
    widthOfTextAtSize: vi.fn(scenario.widthOfTextAtSize ?? (() => 0)),
  };
  const { doc, pages } = buildFakeDoc();
  doc.embedFont.mockResolvedValue(font);
  vi.mocked(pdfLib.PDFDocument.load).mockResolvedValue(
    doc as unknown as Awaited<ReturnType<typeof pdfLib.PDFDocument.load>>,
  );
  vi.mocked(getEmbeddedFont).mockReturnValue({
    bytes: new Uint8Array([1]),
    isType3: false,
    loadedName: "Body",
    mimeType: "font/opentype",
    postScriptName: "Body-PS",
  });
  vi.mocked(resolveFontForText).mockResolvedValue({
    embedKey: "embedded::Body",
    kind: "embedded",
    sourceFontName: "Body-PS",
  });

  const textBlock = buildTextBlock({
    fontSize: scenario.blockFontSize ?? 24,
    height: scenario.blockHeight ?? 30,
    transform: scenario.transform ?? [1, 0, 0, 1, 20, 40],
    width: scenario.blockWidth ?? 60,
  });
  const pageMeta = buildPageMeta({
    height: scenario.pageHeight ?? 200,
    viewportScale: scenario.viewportScale ?? 2,
  });
  const editedBlock = buildEditedBlock({
    fontSize: scenario.editedFontSize ?? 0,
    newText: scenario.newText ?? "Bonjour",
  });

  await exportEditedPdf({
    documentKey: "exporter-draw-doc",
    editedBlocks: new Map([[editedBlock.blockKey, editedBlock]]),
    originalBytes: new Uint8Array([1]),
    pages: [pageMeta],
    textBlocksByKey: new Map([[editedBlock.blockKey, textBlock]]),
  });

  const page = pages.get(0);
  if (!page) {
    throw new Error("expected page 0 to have been drawn on");
  }
  return { page };
}

beforeEach(() => {
  vi.mocked(resolveFontForText).mockReset();
  vi.mocked(getEmbeddedFont).mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("exportEditedPdf coordinate transform and padding", () => {
  it("converts the pdfjs canvas-space transform into PDF coordinate space using viewportScale", async () => {
    const { page } = await runDrawExport({
      pageHeight: 200,
      transform: [1, 0, 0, 1, 20, 40],
      viewportScale: 2,
    });

    const textCall = page.drawText.mock.calls[0]?.[1] as {
      x: number;
      y: number;
    };
    expect(textCall.x).toBeCloseTo(10);
    expect(textCall.y).toBeCloseTo(80);
  });

  it("draws a white covering rectangle sized to the block plus 15% padding on each axis", async () => {
    const { page } = await runDrawExport({
      blockHeight: 30,
      blockWidth: 60,
      pageHeight: 200,
      transform: [1, 0, 0, 1, 20, 40],
      viewportScale: 2,
    });

    const rectCall = page.drawRectangle.mock.calls[0]?.[0] as {
      color: unknown;
      height: number;
      width: number;
      x: number;
      y: number;
    };
    expect(rectCall.width).toBeCloseTo(34.5);
    expect(rectCall.height).toBeCloseTo(19.5);
    expect(rectCall.x).toBeCloseTo(7.75);
    expect(rectCall.y).toBeCloseTo(77.75);
    expect(rectCall.color).toEqual({ b: 1, g: 1, r: 1 });
  });

  it("enforces a minimum rectangle width of 1 when the rendered width rounds to 0", async () => {
    const { page } = await runDrawExport({ blockWidth: 0, viewportScale: 1 });

    const rectCall = page.drawRectangle.mock.calls[0]?.[0] as {
      width: number;
    };
    // blockHeight defaults to 30 with viewportScale 1, so padding = 30*0.15
    // = 4.5, and width = max(renderedWidth=0, 1) + 2*4.5.
    expect(rectCall.width).toBeCloseTo(10);
  });
});

describe("exportEditedPdf font size resolution", () => {
  it("uses edited.fontSize when provided instead of block.fontSize / viewportScale", async () => {
    const { page } = await runDrawExport({
      editedFontSize: 16,
      widthOfTextAtSize: () => 5,
    });

    const textCall = page.drawText.mock.calls[0]?.[1] as { size: number };
    expect(textCall.size).toBe(16);
  });

  it("falls back to block.fontSize / viewportScale when edited.fontSize is 0", async () => {
    const { page } = await runDrawExport({
      blockFontSize: 24,
      viewportScale: 2,
      widthOfTextAtSize: () => 5,
    });

    const textCall = page.drawText.mock.calls[0]?.[1] as { size: number };
    expect(textCall.size).toBe(12);
  });

  it("keeps the desired font size when the measured text width fits within the block width", async () => {
    const { page } = await runDrawExport({
      blockFontSize: 24,
      blockWidth: 60,
      viewportScale: 2,
      widthOfTextAtSize: () => 25,
    });

    const textCall = page.drawText.mock.calls[0]?.[1] as { size: number };
    expect(textCall.size).toBe(12);
  });

  it("shrinks the font size proportionally when the measured text width exceeds the block width", async () => {
    const { page } = await runDrawExport({
      blockFontSize: 24,
      blockWidth: 60,
      viewportScale: 2,
      widthOfTextAtSize: () => 40,
    });

    const textCall = page.drawText.mock.calls[0]?.[1] as { size: number };
    expect(textCall.size).toBeCloseTo(9);
  });

  it("clamps the shrunk font size at MIN_EXPORT_FONT_SIZE when the proportional formula would go lower", async () => {
    const { page } = await runDrawExport({
      blockFontSize: 24,
      blockWidth: 60,
      viewportScale: 2,
      widthOfTextAtSize: () => 120,
    });

    const textCall = page.drawText.mock.calls[0]?.[1] as { size: number };
    expect(textCall.size).toBe(6);
  });

  it("does not shrink when the measured width is 0", async () => {
    const { page } = await runDrawExport({
      blockFontSize: 24,
      viewportScale: 2,
      widthOfTextAtSize: () => 0,
    });

    const textCall = page.drawText.mock.calls[0]?.[1] as { size: number };
    expect(textCall.size).toBe(12);
  });
});
