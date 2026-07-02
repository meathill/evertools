import { describe, expect, it, vi } from "vitest";
import {
  clearCjkFont,
  resolveFontForText,
  setCjkFontBytes,
  setUserFont,
  storeEmbeddedFont,
} from "@/lib/pdf-editor/pdf-fonts";

function u16(value: number): readonly [number, number] {
  return [(value >> 8) & 0xff, value & 0xff];
}

function u32(value: number): readonly [number, number, number, number] {
  return [
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ];
}

function tagBytes(tag: string): readonly number[] {
  return Array.from(tag, (ch) => ch.charCodeAt(0));
}

function buildCmapFormat4(start: number, end: number): readonly number[] {
  const segments = [
    { end, start },
    { end: 0xffff, start: 0xffff },
  ];
  const segCountX2 = segments.length * 2;
  const endCodes = segments.flatMap((segment) => u16(segment.end));
  const startCodes = segments.flatMap((segment) => u16(segment.start));
  return [
    ...u16(4),
    ...u16(0),
    ...u16(0),
    ...u16(segCountX2),
    ...u16(0),
    ...u16(0),
    ...u16(0),
    ...endCodes,
    ...u16(0),
    ...startCodes,
  ];
}

function buildFontBuffer(cmapTableBytes: readonly number[]): Uint8Array {
  const sfntHeader = [
    ...u32(0x00010000),
    ...u16(1),
    ...u16(0),
    ...u16(0),
    ...u16(0),
  ];
  const cmapTableOffset = sfntHeader.length + 16;
  const tableRecord = [
    ...tagBytes("cmap"),
    ...u32(0),
    ...u32(cmapTableOffset),
    ...u32(cmapTableBytes.length),
  ];
  return new Uint8Array([...sfntHeader, ...tableRecord, ...cmapTableBytes]);
}

// Builds a minimal font whose cmap covers exactly the code point range
// spanned by the given characters (min..max), which is enough to make
// findMissingChars report "no missing characters" for that text.
function buildFontCoveringChars(chars: string): Uint8Array {
  const codePoints = Array.from(chars, (ch) => ch.codePointAt(0) ?? 0);
  const start = Math.min(...codePoints);
  const end = Math.max(...codePoints);
  const cmapTable = [
    ...u16(0),
    ...u16(1),
    ...u16(3),
    ...u16(1),
    ...u32(12),
    ...buildCmapFormat4(start, end),
  ];
  return buildFontBuffer(cmapTable);
}

describe("resolveFontForText", () => {
  it("resolves to the embedded font when it covers every character", async () => {
    const documentKey = "resolve-embedded-ok";
    storeEmbeddedFont(documentKey, {
      bytes: buildFontCoveringChars("Hello"),
      isType3: false,
      loadedName: "Body-Font",
      mimeType: "font/opentype",
      postScriptName: "Body-Font-PS",
    });

    const result = await resolveFontForText(
      { documentKey, fontLoadedName: "Body-Font", text: "Hello" },
      { ensureCjkFont: vi.fn() },
    );

    expect(result).toEqual({
      embedKey: "embedded::Body-Font",
      kind: "embedded",
      sourceFontName: "Body-Font-PS",
    });
  });

  it("skips an embedded Type3 font even when its glyphs cover the text", async () => {
    const documentKey = "resolve-type3-skip";
    storeEmbeddedFont(documentKey, {
      bytes: buildFontCoveringChars("Hello"),
      isType3: true,
      loadedName: "Raster-Font",
      mimeType: "font/opentype",
      postScriptName: "Raster-Font-PS",
    });

    const result = await resolveFontForText(
      { documentKey, fontLoadedName: "Raster-Font", text: "Hello" },
      { ensureCjkFont: vi.fn() },
    );

    expect(result.kind).toBe("missing");
  });

  it("falls through to the CJK fallback font when the embedded font misses characters and the text contains CJK", async () => {
    const documentKey = "resolve-cjk-fallback";
    storeEmbeddedFont(documentKey, {
      bytes: buildFontCoveringChars("Hello"),
      isType3: false,
      loadedName: "Body-Font",
      mimeType: "font/opentype",
      postScriptName: "Body-Font-PS",
    });
    const ensureCjkFont = vi
      .fn()
      .mockResolvedValue(buildFontCoveringChars("你好"));

    const result = await resolveFontForText(
      { documentKey, fontLoadedName: "Body-Font", text: "你好" },
      { ensureCjkFont },
    );

    expect(ensureCjkFont).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      embedKey: "cjk::__cjk_fallback__",
      kind: "cjkFallback",
    });
  });

  it("does not call ensureCjkFont when the text has no CJK characters", async () => {
    const documentKey = "resolve-no-cjk-attempt";
    storeEmbeddedFont(documentKey, {
      bytes: buildFontCoveringChars("A"),
      isType3: false,
      loadedName: "Body-Font",
      mimeType: "font/opentype",
      postScriptName: "Body-Font-PS",
    });
    const ensureCjkFont = vi.fn();

    const result = await resolveFontForText(
      { documentKey, fontLoadedName: "Body-Font", text: "Hello" },
      { ensureCjkFont },
    );

    expect(ensureCjkFont).not.toHaveBeenCalled();
    expect(result.kind).toBe("missing");
  });

  it("falls through to the user-uploaded font when the CJK fallback still misses characters", async () => {
    const documentKey = "resolve-user-upload";
    storeEmbeddedFont(documentKey, {
      bytes: buildFontCoveringChars("A"),
      isType3: false,
      loadedName: "Body-Font",
      mimeType: "font/opentype",
      postScriptName: "Body-Font-PS",
    });
    setUserFont(documentKey, {
      bytes: buildFontCoveringChars("你好"),
      fileName: "custom.otf",
    });
    const ensureCjkFont = vi
      .fn()
      .mockResolvedValue(buildFontCoveringChars("A"));

    const result = await resolveFontForText(
      { documentKey, fontLoadedName: "Body-Font", text: "你好" },
      { ensureCjkFont },
    );

    expect(result).toEqual({
      embedKey: "user::__user_font__",
      kind: "userUpload",
    });
  });

  it("falls through to the next priority when ensureCjkFont rejects instead of throwing", async () => {
    const documentKey = "resolve-cjk-reject";
    storeEmbeddedFont(documentKey, {
      bytes: buildFontCoveringChars("A"),
      isType3: false,
      loadedName: "Body-Font",
      mimeType: "font/opentype",
      postScriptName: "Body-Font-PS",
    });
    setUserFont(documentKey, {
      bytes: buildFontCoveringChars("你好"),
      fileName: "custom.otf",
    });
    const ensureCjkFont = vi.fn().mockRejectedValue(new Error("network down"));

    const result = await resolveFontForText(
      { documentKey, fontLoadedName: "Body-Font", text: "你好" },
      { ensureCjkFont },
    );

    expect(result).toEqual({
      embedKey: "user::__user_font__",
      kind: "userUpload",
    });
  });

  it("returns kind missing with a deduped list of uncovered characters when no source covers the text", async () => {
    const documentKey = "resolve-missing-dedup";

    const result = await resolveFontForText(
      { documentKey, fontLoadedName: "Unknown-Font", text: "AAB" },
      { ensureCjkFont: vi.fn() },
    );

    expect(result.kind).toBe("missing");
    if (result.kind === "missing") {
      expect(result.missingChars).toEqual(["A", "B"]);
    }
  });

  it("collects missing chars using the cached CJK font bytes even when ensureCjkFont was not invoked this call", async () => {
    const documentKey = "resolve-cjk-cache-fallback";
    // "★" is not a CJK character per containsCjk, so ensureCjkFont is never
    // called here — but collectMissingChars reads the module-level
    // cjkFontCache directly, so a previously cached CJK font can still cover
    // this character.
    setCjkFontBytes(buildFontCoveringChars("★"));

    try {
      const result = await resolveFontForText(
        { documentKey, fontLoadedName: "Missing-Font", text: "★" },
        { ensureCjkFont: vi.fn() },
      );

      expect(result).toEqual({ kind: "missing", missingChars: [] });
    } finally {
      clearCjkFont();
    }
  });

  it("isolates embedded font resolution by documentKey", async () => {
    storeEmbeddedFont("resolve-isolation-a", {
      bytes: buildFontCoveringChars("Hello"),
      isType3: false,
      loadedName: "Body-Font",
      mimeType: "font/opentype",
      postScriptName: "A-PS",
    });
    storeEmbeddedFont("resolve-isolation-b", {
      bytes: buildFontCoveringChars("A"),
      isType3: false,
      loadedName: "Body-Font",
      mimeType: "font/opentype",
      postScriptName: "B-PS",
    });

    const resultA = await resolveFontForText(
      {
        documentKey: "resolve-isolation-a",
        fontLoadedName: "Body-Font",
        text: "Hello",
      },
      { ensureCjkFont: vi.fn() },
    );
    const resultB = await resolveFontForText(
      {
        documentKey: "resolve-isolation-b",
        fontLoadedName: "Body-Font",
        text: "Hello",
      },
      { ensureCjkFont: vi.fn() },
    );

    expect(resultA.kind).toBe("embedded");
    expect(resultB.kind).toBe("missing");
  });
});
