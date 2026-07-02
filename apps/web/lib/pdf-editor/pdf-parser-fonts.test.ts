// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as pdfjsDist from "pdfjs-dist";

vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: vi.fn(),
}));

vi.mock("@/lib/pdf-editor/pdf-fonts", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/pdf-editor/pdf-fonts")>();
  return {
    ...actual,
    registerEmbeddedFontFace: vi.fn(async () => undefined),
  };
});

import {
  getEmbeddedFont,
  registerEmbeddedFontFace,
} from "@/lib/pdf-editor/pdf-fonts";
import { parsePdfFile } from "@/lib/pdf-editor/pdf-parser";

type FakePage = {
  cleanup: () => void;
  commonObjs: {
    _objs?: Record<string, unknown>;
    get: (id: string) => unknown;
    has: (id: string) => boolean;
  };
  getOperatorList: () => Promise<unknown>;
  getTextContent: () => Promise<{ items: readonly unknown[] }>;
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
    getOperatorList: () => Promise.resolve(undefined),
    getTextContent: () => Promise.resolve({ items: [] }),
    getViewport: () => ({ height: 100, rotation: 0, width: 80 }),
    render: () => ({ promise: Promise.resolve(undefined) }),
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

function buildPdfFile(): File {
  return new File([new Uint8Array([0x25, 0x50, 0x44, 0x46])], "input.pdf", {
    type: "application/pdf",
  });
}

beforeEach(() => {
  vi.mocked(pdfjsDist.getDocument).mockReset();
  vi.mocked(registerEmbeddedFontFace).mockReset().mockResolvedValue(undefined);
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

describe("parsePdfFile embedded font extraction", () => {
  it("extracts embedded fonts from commonObjs and stores them under documentKey", async () => {
    const documentKey = "parser-embed-store";
    const { doc } = buildFakePdfDoc([
      {
        commonObjsEntries: {
          g1: {
            data: new Uint8Array([1, 2, 3]),
            isType3Font: false,
            loadedName: "Embedded-Body",
            mimetype: "font/opentype",
            name: "Embedded-Body-PS",
          },
        },
      },
    ]);
    mockGetDocument(Promise.resolve(doc));

    await parsePdfFile({ documentKey, file: buildPdfFile() });

    expect(getEmbeddedFont(documentKey, "Embedded-Body")).toEqual({
      bytes: new Uint8Array([1, 2, 3]),
      isType3: false,
      loadedName: "Embedded-Body",
      mimeType: "font/opentype",
      postScriptName: "Embedded-Body-PS",
    });
  });

  it("skips a commonObjs entry when the referenced font object has no data", async () => {
    const documentKey = "parser-embed-no-data";
    const { doc } = buildFakePdfDoc([
      { commonObjsEntries: { g1: { loadedName: "No-Data-Font" } } },
    ]);
    mockGetDocument(Promise.resolve(doc));

    await parsePdfFile({ documentKey, file: buildPdfFile() });

    expect(getEmbeddedFont(documentKey, "No-Data-Font")).toBeNull();
  });

  it("does not re-extract the same objId on a later page", async () => {
    const documentKey = "parser-embed-dedup";
    const fontEntry = {
      data: new Uint8Array([1]),
      isType3Font: false,
      loadedName: "Shared-Font",
      mimetype: "font/opentype",
      name: "Shared-Font-PS",
    };
    const { doc, pages } = buildFakePdfDoc([
      { commonObjsEntries: { g1: fontEntry } },
      { commonObjsEntries: { g1: fontEntry } },
    ]);
    mockGetDocument(Promise.resolve(doc));

    await parsePdfFile({ documentKey, file: buildPdfFile() });

    expect(pages[0]?.commonObjs.get).toHaveBeenCalledTimes(1);
    expect(pages[1]?.commonObjs.get).not.toHaveBeenCalled();
  });

  it("does not abort the parse when commonObjs.get() throws", async () => {
    const documentKey = "parser-embed-get-throws";
    const { doc } = buildFakePdfDoc([
      { commonObjsEntries: { g1: new Error("boom") } },
    ]);
    mockGetDocument(Promise.resolve(doc));

    const { result } = await parsePdfFile({
      documentKey,
      file: buildPdfFile(),
    });

    expect(result.pages).toHaveLength(1);
    expect(getEmbeddedFont(documentKey, "g1")).toBeNull();
  });

  it("attempts FontFace registration for a non-Type3 embedded font but not for a Type3 font", async () => {
    const documentKey = "parser-embed-type3";
    const { doc } = buildFakePdfDoc([
      {
        commonObjsEntries: {
          normal: {
            data: new Uint8Array([1]),
            isType3Font: false,
            loadedName: "Normal-Font",
            mimetype: "font/opentype",
            name: "Normal-Font-PS",
          },
          raster: {
            data: new Uint8Array([1]),
            isType3Font: true,
            loadedName: "Raster-Font",
            mimetype: "font/opentype",
            name: "Raster-Font-PS",
          },
        },
      },
    ]);
    mockGetDocument(Promise.resolve(doc));

    await parsePdfFile({ documentKey, file: buildPdfFile() });

    expect(registerEmbeddedFontFace).toHaveBeenCalledWith(
      expect.objectContaining({ loadedName: "Normal-Font" }),
    );
    expect(registerEmbeddedFontFace).not.toHaveBeenCalledWith(
      expect.objectContaining({ loadedName: "Raster-Font" }),
    );
  });
});
