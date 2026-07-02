// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as pdfjsDist from "pdfjs-dist";

vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: vi.fn(),
}));

import {
  PDF_EDITOR_ERROR_CODES,
  parsePdfEditorError,
} from "@/lib/pdf-editor/pdf-errors";
import { parsePdfFile } from "@/lib/pdf-editor/pdf-parser";
import { MAX_PDF_FILE_SIZE } from "@/lib/pdf-editor/pdf-types";

type FakeTextRunItem = {
  fontName: string;
  height: number;
  str: string;
  transform: readonly [number, number, number, number, number, number];
  width: number;
};

type FakeMarkedContentItem = { type: string };

type FakeTextItem = FakeTextRunItem | FakeMarkedContentItem;

type FakePage = {
  cleanup: () => void;
  commonObjs: {
    _objs?: Record<string, unknown>;
    get: (id: string) => unknown;
    has: (id: string) => boolean;
  };
  getOperatorList: () => Promise<unknown>;
  getTextContent: () => Promise<{ items: readonly FakeTextItem[] }>;
  getViewport: (options: { scale: number }) => {
    height: number;
    rotation: number;
    width: number;
  };
  render: (options: unknown) => { promise: Promise<void> };
};

type FakePdfDocument = {
  cleanup: () => Promise<void>;
  destroy: () => void;
  getPage: (pageNumber: number) => Promise<FakePage>;
  numPages: number;
};

type FakePageSpec = {
  commonObjsEntries?: Record<string, unknown>;
  getOperatorListShouldFail?: boolean;
  getTextContentShouldFail?: boolean;
  renderShouldFail?: boolean;
  textItems?: readonly FakeTextItem[];
};

function buildFakePage(spec: FakePageSpec = {}): FakePage {
  const objs = spec.commonObjsEntries ?? {};
  const get = vi.fn((id: string): unknown => {
    const entry = objs[id];
    if (entry instanceof Error) {
      throw entry;
    }
    return entry;
  });
  return {
    cleanup: () => {},
    commonObjs: {
      _objs: objs,
      get,
      has: (id: string) => id in objs,
    },
    getOperatorList: () =>
      spec.getOperatorListShouldFail
        ? Promise.reject(new Error("operator list failed"))
        : Promise.resolve(undefined),
    getTextContent: () =>
      spec.getTextContentShouldFail
        ? Promise.reject(new Error("text content failed"))
        : Promise.resolve({ items: spec.textItems ?? [] }),
    getViewport: () => ({ height: 100, rotation: 0, width: 80 }),
    render: () => ({
      promise: spec.renderShouldFail
        ? Promise.reject(new Error("render failed"))
        : Promise.resolve(undefined),
    }),
  };
}

function buildFakePdfDoc(pageSpecs: readonly FakePageSpec[]): {
  doc: FakePdfDocument;
  pages: readonly FakePage[];
} {
  const pages = pageSpecs.map((spec) => buildFakePage(spec));
  const doc: FakePdfDocument = {
    cleanup: () => Promise.resolve(undefined),
    destroy: () => {},
    getPage: (pageNumber: number) => {
      const page = pages[pageNumber - 1];
      if (!page) {
        throw new Error(`no fake page configured for page ${pageNumber}`);
      }
      return Promise.resolve(page);
    },
    numPages: pages.length,
  };
  return { doc, pages };
}

function mockGetDocument(promise: Promise<FakePdfDocument>): void {
  vi.mocked(pdfjsDist.getDocument).mockReturnValue({
    promise,
  } as unknown as ReturnType<typeof pdfjsDist.getDocument>);
}

function buildPdfFile(options: { sizeOverride?: number } = {}): File {
  const file = new File(
    [new Uint8Array([0x25, 0x50, 0x44, 0x46])],
    "input.pdf",
    { type: "application/pdf" },
  );
  if (options.sizeOverride !== undefined) {
    Object.defineProperty(file, "size", {
      configurable: true,
      value: options.sizeOverride,
    });
  }
  return file;
}

async function captureRejection(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error("Expected the promise to reject, but it resolved");
}

function textItem(str: string): FakeTextRunItem {
  return {
    fontName: "Body",
    height: 10,
    str,
    transform: [1, 0, 0, 1, 0, 0],
    width: 10,
  };
}

beforeEach(() => {
  vi.mocked(pdfjsDist.getDocument).mockReset();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () => ({}) as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
    "data:image/png;base64,mock",
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("parsePdfFile", () => {
  describe("file validation", () => {
    it("throws FILE_TOO_LARGE before touching pdfjs when the file exceeds MAX_PDF_FILE_SIZE", async () => {
      const file = buildPdfFile({ sizeOverride: MAX_PDF_FILE_SIZE + 1 });

      const error = await captureRejection(
        parsePdfFile({ documentKey: "parser-too-large", file }),
      );

      expect(parsePdfEditorError(error)).toEqual({
        code: PDF_EDITOR_ERROR_CODES.FILE_TOO_LARGE,
        detail: String(MAX_PDF_FILE_SIZE),
      });
      expect(pdfjsDist.getDocument).not.toHaveBeenCalled();
    });
  });

  describe("document loading failures", () => {
    it("maps password/encrypted load errors to ENCRYPTED_NOT_SUPPORTED, case-insensitively", async () => {
      for (const message of ["Password required", "the file is Encrypted"]) {
        mockGetDocument(Promise.reject(new Error(message)));

        const error = await captureRejection(
          parsePdfFile({
            documentKey: "parser-encrypted",
            file: buildPdfFile(),
          }),
        );

        // createPdfEditorError is called here without a detail, so the
        // message is the bare code with no "::" separator — checked
        // directly rather than via parsePdfEditorError, which only
        // recognizes a code when a "::"-delimited detail is present.
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(
          PDF_EDITOR_ERROR_CODES.ENCRYPTED_NOT_SUPPORTED,
        );
      }
    });

    it("maps other load failures to LOAD_FAILED with the original message as detail", async () => {
      mockGetDocument(Promise.reject(new Error("corrupt xref table")));

      const error = await captureRejection(
        parsePdfFile({
          documentKey: "parser-load-failed",
          file: buildPdfFile(),
        }),
      );

      expect(parsePdfEditorError(error)).toEqual({
        code: PDF_EDITOR_ERROR_CODES.LOAD_FAILED,
        detail: "corrupt xref table",
      });
    });
  });

  describe("text extraction", () => {
    it("computes fontSize from the transform matrix via Math.hypot(c, d)", async () => {
      const { doc } = buildFakePdfDoc([
        {
          textItems: [
            {
              fontName: "Body",
              height: 12,
              str: "Hi",
              transform: [1, 0, 3, 4, 10, 20],
              width: 20,
            },
          ],
        },
      ]);
      mockGetDocument(Promise.resolve(doc));

      const { result } = await parsePdfFile({
        documentKey: "parser-fontsize",
        file: buildPdfFile(),
      });

      expect(result.pages[0]?.textBlocks[0]?.fontSize).toBeCloseTo(5);
    });

    it("skips items missing the str property and items with an empty string, excluding both from totalTextChars", async () => {
      const { doc } = buildFakePdfDoc([
        { textItems: [{ type: "marked-content-begin" }, textItem("")] },
      ]);
      mockGetDocument(Promise.resolve(doc));

      const { result } = await parsePdfFile({
        documentKey: "parser-skip-items",
        file: buildPdfFile(),
      });

      expect(result.pages[0]?.textBlocks).toEqual([]);
      expect(result.totalTextChars).toBe(0);
    });

    it("builds blockId as p{pageIndex}-i{itemIndex} across multiple pages", async () => {
      const { doc } = buildFakePdfDoc([
        { textItems: [textItem("a"), textItem("b")] },
        { textItems: [textItem("c")] },
      ]);
      mockGetDocument(Promise.resolve(doc));

      const { result } = await parsePdfFile({
        documentKey: "parser-block-ids",
        file: buildPdfFile(),
      });

      expect(result.pages[0]?.textBlocks.map((block) => block.blockId)).toEqual(
        ["p0-i0", "p0-i1"],
      );
      expect(result.pages[1]?.textBlocks.map((block) => block.blockId)).toEqual(
        ["p1-i0"],
      );
    });

    it("feeds pages.length and totalTextChars into detectScannedPdf", async () => {
      const { doc: scannedDoc } = buildFakePdfDoc([
        { textItems: [textItem("a")] },
      ]);
      mockGetDocument(Promise.resolve(scannedDoc));
      const scanned = await parsePdfFile({
        documentKey: "parser-scanned",
        file: buildPdfFile(),
      });
      expect(scanned.result.isScanned).toBe(true);

      const { doc: textDoc } = buildFakePdfDoc([
        { textItems: [textItem("a".repeat(30))] },
      ]);
      mockGetDocument(Promise.resolve(textDoc));
      const textHeavy = await parsePdfFile({
        documentKey: "parser-text-heavy",
        file: buildPdfFile(),
      });
      expect(textHeavy.result.isScanned).toBe(false);
    });
  });

  describe("canvas and render failures", () => {
    it("throws LOAD_FAILED without a detail when the canvas 2D context is unavailable", async () => {
      const { doc } = buildFakePdfDoc([{}]);
      mockGetDocument(Promise.resolve(doc));
      // Re-spying on an already-spied method returns the same spy instance,
      // so this overrides just the next call configured in beforeEach.
      vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValueOnce(
        null,
      );

      const error = await captureRejection(
        parsePdfFile({
          documentKey: "parser-no-context",
          file: buildPdfFile(),
        }),
      );

      // No detail is passed here either, so check the raw message directly
      // for the same reason as the encrypted-PDF case above.
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(PDF_EDITOR_ERROR_CODES.LOAD_FAILED);
    });

    it("throws LOAD_FAILED with the render error message when page.render() rejects", async () => {
      const { doc } = buildFakePdfDoc([{ renderShouldFail: true }]);
      mockGetDocument(Promise.resolve(doc));

      const error = await captureRejection(
        parsePdfFile({
          documentKey: "parser-render-fail",
          file: buildPdfFile(),
        }),
      );

      expect(parsePdfEditorError(error)).toEqual({
        code: PDF_EDITOR_ERROR_CODES.LOAD_FAILED,
        detail: "render failed",
      });
    });

    it("throws LOAD_FAILED with a page-numbered detail when getTextContent() rejects", async () => {
      const { doc } = buildFakePdfDoc([{ getTextContentShouldFail: true }]);
      mockGetDocument(Promise.resolve(doc));

      const error = await captureRejection(
        parsePdfFile({
          documentKey: "parser-text-content-fail",
          file: buildPdfFile(),
        }),
      );

      expect(parsePdfEditorError(error)).toEqual({
        code: PDF_EDITOR_ERROR_CODES.LOAD_FAILED,
        detail: "Page 1: text content failed",
      });
    });

    it("does not abort the parse when getOperatorList() rejects, since font loading is best-effort", async () => {
      const { doc } = buildFakePdfDoc([{ getOperatorListShouldFail: true }]);
      mockGetDocument(Promise.resolve(doc));

      const { result } = await parsePdfFile({
        documentKey: "parser-operator-list-fail",
        file: buildPdfFile(),
      });

      expect(result.pages).toHaveLength(1);
    });
  });

  describe("byte handling", () => {
    it("returns originalBytes as an independent copy from the buffer handed to pdfjs", async () => {
      const { doc } = buildFakePdfDoc([{}]);
      mockGetDocument(Promise.resolve(doc));

      const { originalBytes } = await parsePdfFile({
        documentKey: "parser-bytes-copy",
        file: buildPdfFile(),
      });

      const passedData = vi.mocked(pdfjsDist.getDocument).mock.calls[0]?.[0] as
        | { data?: Uint8Array }
        | undefined;
      expect(passedData?.data).not.toBe(originalBytes);
      expect(passedData?.data).toEqual(originalBytes);

      if (passedData?.data) {
        passedData.data[0] = 0xff;
      }
      expect(originalBytes[0]).not.toBe(0xff);
    });
  });
});
