// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearCjkFont,
  clearDocumentFonts,
  type EmbeddedFontEntry,
  getCjkFontBytes,
  getEmbeddedFont,
  getUserFont,
  listEmbeddedFonts,
  registerCjkFontFace,
  registerEmbeddedFontFace,
  registerUserFontFace,
  setCjkFontBytes,
  setUserFont,
  storeEmbeddedFont,
  storeOriginalBytes,
  takeOriginalBytes,
  type UserFontEntry,
} from "@/lib/pdf-editor/pdf-fonts";

let nextLoadShouldFail = false;

class MockFontFace {
  readonly family: string;
  readonly source: string;

  constructor(family: string, source: string) {
    this.family = family;
    this.source = source;
  }

  load(): Promise<this> {
    if (nextLoadShouldFail) {
      return Promise.reject(new Error("mock font load failure"));
    }
    return Promise.resolve(this);
  }
}

let fontsAdd: ReturnType<typeof vi.fn>;

beforeEach(() => {
  nextLoadShouldFail = false;
  fontsAdd = vi.fn();
  vi.stubGlobal("FontFace", MockFontFace);
  URL.createObjectURL = vi.fn(() => "blob:mock-url");
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { add: fontsAdd },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("embedded font and original bytes storage", () => {
  it("stores and retrieves an embedded font by documentKey + loadedName, isolated across documentKeys", () => {
    const fontA: EmbeddedFontEntry = {
      bytes: new Uint8Array([1]),
      isType3: false,
      loadedName: "Shared",
      mimeType: "font/opentype",
      postScriptName: "A-PS",
    };
    const fontB: EmbeddedFontEntry = {
      bytes: new Uint8Array([2]),
      isType3: false,
      loadedName: "Shared",
      mimeType: "font/opentype",
      postScriptName: "B-PS",
    };

    storeEmbeddedFont("doc-iso-a", fontA);
    storeEmbeddedFont("doc-iso-b", fontB);

    expect(getEmbeddedFont("doc-iso-a", "Shared")).toEqual(fontA);
    expect(getEmbeddedFont("doc-iso-b", "Shared")).toEqual(fontB);
  });

  it("returns null for an unknown documentKey or loadedName", () => {
    storeEmbeddedFont("doc-unknown-known", {
      bytes: new Uint8Array([1]),
      isType3: false,
      loadedName: "KnownFont",
      mimeType: "font/opentype",
      postScriptName: "PS",
    });

    expect(getEmbeddedFont("doc-unknown-missing-doc", "KnownFont")).toBeNull();
    expect(getEmbeddedFont("doc-unknown-known", "MissingFont")).toBeNull();
  });

  it("listEmbeddedFonts returns all fonts for a document and an empty array for an unknown document", () => {
    storeEmbeddedFont("doc-list-a", {
      bytes: new Uint8Array([1]),
      isType3: false,
      loadedName: "F1",
      mimeType: "font/opentype",
      postScriptName: "PS1",
    });
    storeEmbeddedFont("doc-list-a", {
      bytes: new Uint8Array([2]),
      isType3: false,
      loadedName: "F2",
      mimeType: "font/opentype",
      postScriptName: "PS2",
    });

    expect(listEmbeddedFonts("doc-list-a")).toHaveLength(2);
    expect(listEmbeddedFonts("doc-list-unknown")).toEqual([]);
  });

  it("clearDocumentFonts removes embedded fonts and original bytes for that document only", () => {
    storeEmbeddedFont("doc-clear-a", {
      bytes: new Uint8Array([1]),
      isType3: false,
      loadedName: "FontA",
      mimeType: "font/opentype",
      postScriptName: "FontA-PS",
    });
    storeOriginalBytes("doc-clear-a", new Uint8Array([9]));
    storeEmbeddedFont("doc-clear-b", {
      bytes: new Uint8Array([2]),
      isType3: false,
      loadedName: "FontB",
      mimeType: "font/opentype",
      postScriptName: "FontB-PS",
    });

    clearDocumentFonts("doc-clear-a");

    expect(getEmbeddedFont("doc-clear-a", "FontA")).toBeNull();
    expect(takeOriginalBytes("doc-clear-a")).toBeNull();
    expect(getEmbeddedFont("doc-clear-b", "FontB")).not.toBeNull();
  });

  it("takeOriginalBytes returns the stored bytes without deleting them, despite the function name", () => {
    const bytes = new Uint8Array([1, 2, 3]);
    storeOriginalBytes("doc-bytes-1", bytes);

    expect(takeOriginalBytes("doc-bytes-1")).toBe(bytes);
    expect(takeOriginalBytes("doc-bytes-1")).toBe(bytes);
  });

  it("returns null for original bytes under an unknown documentKey", () => {
    expect(takeOriginalBytes("doc-bytes-unknown")).toBeNull();
  });
});

describe("user font and CJK font cache storage", () => {
  it("setUserFont stores an entry, then clears it when set to null", () => {
    const entry: UserFontEntry = {
      bytes: new Uint8Array([1]),
      fileName: "custom.ttf",
    };
    setUserFont("doc-user-1", entry);
    expect(getUserFont("doc-user-1")).toEqual(entry);

    setUserFont("doc-user-1", null);
    expect(getUserFont("doc-user-1")).toBeNull();
  });

  it("stores, retrieves, and clears the module-level CJK font cache", () => {
    expect(getCjkFontBytes()).toBeNull();
    const bytes = new Uint8Array([5, 6, 7]);

    setCjkFontBytes(bytes);
    expect(getCjkFontBytes()).toBe(bytes);

    clearCjkFont();
    expect(getCjkFontBytes()).toBeNull();
  });
});

describe("register*FontFace", () => {
  it("registerEmbeddedFontFace creates a FontFace, awaits load, and adds it to document.fonts", async () => {
    const entry: EmbeddedFontEntry = {
      bytes: new Uint8Array([1, 2, 3]),
      isType3: false,
      loadedName: "RegisterTest-Normal",
      mimeType: "font/opentype",
      postScriptName: "RegisterTest-Normal-PS",
    };

    await registerEmbeddedFontFace(entry);

    expect(fontsAdd).toHaveBeenCalledTimes(1);
    const addedFace = fontsAdd.mock.calls[0]?.[0] as MockFontFace;
    expect(addedFace.family).toBe("RegisterTest-Normal");
  });

  it("only registers once for the same loadedName", async () => {
    const entry: EmbeddedFontEntry = {
      bytes: new Uint8Array([1]),
      isType3: false,
      loadedName: "RegisterTest-Dedup",
      mimeType: "font/opentype",
      postScriptName: "RegisterTest-Dedup-PS",
    };

    await registerEmbeddedFontFace(entry);
    await registerEmbeddedFontFace(entry);

    expect(fontsAdd).toHaveBeenCalledTimes(1);
  });

  it("removes the loadedName from the registered set after a load failure, allowing a later retry to succeed", async () => {
    const entry: EmbeddedFontEntry = {
      bytes: new Uint8Array([1]),
      isType3: false,
      loadedName: "RegisterTest-Retry",
      mimeType: "font/opentype",
      postScriptName: "RegisterTest-Retry-PS",
    };

    nextLoadShouldFail = true;
    await registerEmbeddedFontFace(entry);
    expect(fontsAdd).not.toHaveBeenCalled();

    nextLoadShouldFail = false;
    await registerEmbeddedFontFace(entry);
    expect(fontsAdd).toHaveBeenCalledTimes(1);
  });

  it("registerUserFontFace creates a FontFace with the given cssFamily and adds it to document.fonts", async () => {
    const entry: UserFontEntry = {
      bytes: new Uint8Array([1]),
      fileName: "custom.ttf",
    };

    await registerUserFontFace(entry, "PDF-Editor-User-Font");

    expect(fontsAdd).toHaveBeenCalledTimes(1);
    const addedFace = fontsAdd.mock.calls[0]?.[0] as MockFontFace;
    expect(addedFace.family).toBe("PDF-Editor-User-Font");
  });

  it("registerUserFontFace swallows load failures without throwing", async () => {
    const entry: UserFontEntry = {
      bytes: new Uint8Array([1]),
      fileName: "broken.ttf",
    };
    nextLoadShouldFail = true;

    await expect(
      registerUserFontFace(entry, "PDF-Editor-User-Font-Fail"),
    ).resolves.toBeUndefined();
    expect(fontsAdd).not.toHaveBeenCalled();
  });

  it("registerCjkFontFace creates a FontFace with the given cssFamily and adds it to document.fonts", async () => {
    await registerCjkFontFace(new Uint8Array([1]), "PDF-Editor-CJK-Fallback");

    expect(fontsAdd).toHaveBeenCalledTimes(1);
    const addedFace = fontsAdd.mock.calls[0]?.[0] as MockFontFace;
    expect(addedFace.family).toBe("PDF-Editor-CJK-Fallback");
  });

  it("registerCjkFontFace swallows load failures without throwing", async () => {
    nextLoadShouldFail = true;

    await expect(
      registerCjkFontFace(new Uint8Array([1]), "PDF-Editor-CJK-Fail"),
    ).resolves.toBeUndefined();
    expect(fontsAdd).not.toHaveBeenCalled();
  });
});
