import { describe, expect, it } from "vitest";
import {
  getGlyphSet,
  parseCmapCodePoints,
} from "@/lib/pdf-editor/pdf-glyph-set";

type Segment = { end: number; start: number };
type Group = { end: number; start: number };
type Subtable = {
  body: readonly number[];
  encodingId: number;
  platformId: number;
};

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

// Only the fields actually read by parseCmapCodePoints are populated; idDelta/
// idRangeOffset/glyphIdArray are intentionally omitted since the parser never
// reads them.
function buildCmapFormat4(segments: readonly Segment[]): readonly number[] {
  const hasTerminator = segments.some(
    (segment) => segment.start === 0xffff && segment.end === 0xffff,
  );
  const allSegments = hasTerminator
    ? segments
    : [...segments, { end: 0xffff, start: 0xffff }];
  const segCountX2 = allSegments.length * 2;
  const endCodes = allSegments.flatMap((segment) => u16(segment.end));
  const startCodes = allSegments.flatMap((segment) => u16(segment.start));
  return [
    ...u16(4), // format
    ...u16(0), // length (unused by parser)
    ...u16(0), // language (unused by parser)
    ...u16(segCountX2),
    ...u16(0), // searchRange (unused by parser)
    ...u16(0), // entrySelector (unused by parser)
    ...u16(0), // rangeShift (unused by parser)
    ...endCodes,
    ...u16(0), // reservedPad
    ...startCodes,
  ];
}

function buildCmapFormat6(
  firstCode: number,
  entryCount: number,
): readonly number[] {
  return [
    ...u16(6), // format
    ...u16(0), // length (unused by parser)
    ...u16(0), // language (unused by parser)
    ...u16(firstCode),
    ...u16(entryCount),
  ];
}

function buildCmapFormat12(groups: readonly Group[]): readonly number[] {
  const header = [
    ...u16(12), // format
    ...u16(0), // reserved
    ...u32(0), // length (unused by parser)
    ...u32(0), // language (unused by parser)
    ...u32(groups.length),
  ];
  const groupBytes = groups.flatMap((group) => [
    ...u32(group.start),
    ...u32(group.end),
    ...u32(0), // startGlyphID (unused by parser)
  ]);
  return [...header, ...groupBytes];
}

function buildCmapTable(subtables: readonly Subtable[]): readonly number[] {
  const headerLength = 4;
  const recordsLength = subtables.length * 8;
  let bodyOffset = headerLength + recordsLength;
  const records: number[] = [];
  const bodies: number[] = [];
  for (const subtable of subtables) {
    records.push(
      ...u16(subtable.platformId),
      ...u16(subtable.encodingId),
      ...u32(bodyOffset),
    );
    bodies.push(...subtable.body);
    bodyOffset += subtable.body.length;
  }
  return [...u16(0), ...u16(subtables.length), ...records, ...bodies];
}

// Wraps a cmap table body in a minimal sfnt shell: a single "cmap" table
// record is enough because readSingleFontCmaps returns as soon as it finds
// one, so no other tables (head/glyf/...) are required.
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
    ...u32(0), // checksum (unused by parser)
    ...u32(cmapTableOffset),
    ...u32(cmapTableBytes.length),
  ];
  return new Uint8Array([...sfntHeader, ...tableRecord, ...cmapTableBytes]);
}

function buildFontBufferWithoutCmap(): Uint8Array {
  const sfntHeader = [
    ...u32(0x00010000),
    ...u16(1),
    ...u16(0),
    ...u16(0),
    ...u16(0),
  ];
  const tableRecord = [...tagBytes("head"), ...u32(0), ...u32(28), ...u32(4)];
  return new Uint8Array([...sfntHeader, ...tableRecord, 0, 0, 0, 0]);
}

// Table-record offsets inside a standalone sfnt buffer are relative to that
// buffer's own start. Once embedded inside a ttc collection at some absolute
// position, those offsets must be rebased to be absolute within the whole
// collection buffer, matching how collectCmapOffsets reads them.
function rebaseTableRecordOffsets(
  subFont: Uint8Array,
  base: number,
): Uint8Array {
  const rebased = new Uint8Array(subFont);
  const view = new DataView(rebased.buffer);
  const numTables = view.getUint16(4, false);
  for (let index = 0; index < numTables; index++) {
    const recordOffset = 12 + index * 16;
    const originalOffset = view.getUint32(recordOffset + 8, false);
    view.setUint32(recordOffset + 8, originalOffset + base, false);
  }
  return rebased;
}

function buildTtcFont(subFonts: readonly Uint8Array[]): Uint8Array {
  const headerLength = 12 + subFonts.length * 4;
  const rebasedFonts: Uint8Array[] = [];
  const fontOffsets: number[] = [];
  let cursor = headerLength;
  for (const subFont of subFonts) {
    fontOffsets.push(cursor);
    rebasedFonts.push(rebaseTableRecordOffsets(subFont, cursor));
    cursor += subFont.length;
  }
  const header = [
    ...tagBytes("ttcf"),
    ...u32(0), // version (unused by parser)
    ...u32(subFonts.length),
    ...fontOffsets.flatMap((offset) => u32(offset)),
  ];
  const body = rebasedFonts.flatMap((subFont) => Array.from(subFont));
  return new Uint8Array([...header, ...body]);
}

describe("parseCmapCodePoints", () => {
  it("parses a format 4 subtable and returns the covered code points", () => {
    const table = buildCmapTable([
      {
        body: buildCmapFormat4([{ end: 0x5a, start: 0x41 }]),
        encodingId: 1,
        platformId: 3,
      },
    ]);
    const result = parseCmapCodePoints(buildFontBuffer(table));
    expect(result.has(0x41)).toBe(true);
    expect(result.has(0x5a)).toBe(true);
    expect(result.has(0x40)).toBe(false);
    expect(result.has(0x5b)).toBe(false);
  });

  it("does not include the 0xffff/0xffff terminator segment from format 4", () => {
    const table = buildCmapTable([
      {
        body: buildCmapFormat4([{ end: 0x41, start: 0x41 }]),
        encodingId: 1,
        platformId: 3,
      },
    ]);
    const result = parseCmapCodePoints(buildFontBuffer(table));
    expect(result.has(0x41)).toBe(true);
    expect(result.has(0xffff)).toBe(false);
  });

  it("parses a format 6 subtable as a contiguous range", () => {
    const table = buildCmapTable([
      { body: buildCmapFormat6(0x4e00, 10), encodingId: 4, platformId: 3 },
    ]);
    const result = parseCmapCodePoints(buildFontBuffer(table));
    expect(result.has(0x4e00)).toBe(true);
    expect(result.has(0x4e09)).toBe(true);
    expect(result.has(0x4e0a)).toBe(false);
  });

  it("parses format 12 groups, including code points beyond the BMP", () => {
    const table = buildCmapTable([
      {
        body: buildCmapFormat12([{ end: 0x20002, start: 0x20000 }]),
        encodingId: 10,
        platformId: 3,
      },
    ]);
    const result = parseCmapCodePoints(buildFontBuffer(table));
    expect(result.has(0x20000)).toBe(true);
    expect(result.has(0x20002)).toBe(true);
    expect(result.has(0x20003)).toBe(false);
  });

  it("merges code points from multiple encoding records in one cmap table", () => {
    const table = buildCmapTable([
      {
        body: buildCmapFormat4([{ end: 0x5a, start: 0x41 }]),
        encodingId: 1,
        platformId: 3,
      },
      { body: buildCmapFormat6(0x4e00, 3), encodingId: 4, platformId: 3 },
    ]);
    const result = parseCmapCodePoints(buildFontBuffer(table));
    expect(result.has(0x41)).toBe(true);
    expect(result.has(0x4e00)).toBe(true);
    expect(result.has(0x4e02)).toBe(true);
  });

  it("reads the first font's cmap inside a ttc collection", () => {
    const table = buildCmapTable([
      { body: buildCmapFormat6(0x61, 3), encodingId: 1, platformId: 3 },
    ]);
    const ttc = buildTtcFont([
      buildFontBuffer(table),
      buildFontBufferWithoutCmap(),
    ]);
    const result = parseCmapCodePoints(ttc);
    expect(result.has(0x61)).toBe(true);
    expect(result.has(0x62)).toBe(true);
    expect(result.has(0x63)).toBe(true);
    expect(result.size).toBe(3);
  });

  it("returns an empty set when the buffer is too short to contain a header", () => {
    expect(parseCmapCodePoints(new Uint8Array(4)).size).toBe(0);
  });

  it("returns an empty set when no cmap table exists", () => {
    expect(parseCmapCodePoints(buildFontBufferWithoutCmap()).size).toBe(0);
  });

  it("swallows a malformed subtable and keeps code points parsed before it", () => {
    const validBody = buildCmapFormat6(0x61, 2);
    const truncatedFormat4Body = [...u16(4)];
    const table = buildCmapTable([
      { body: validBody, encodingId: 1, platformId: 3 },
      { body: truncatedFormat4Body, encodingId: 4, platformId: 3 },
    ]);
    const result = parseCmapCodePoints(buildFontBuffer(table));
    expect(result.has(0x61)).toBe(true);
    expect(result.has(0x62)).toBe(true);
  });
});

describe("getGlyphSet", () => {
  it("caches the parsed set by Uint8Array identity", () => {
    const buffer = buildFontBuffer(
      buildCmapTable([
        { body: buildCmapFormat6(0x41, 2), encodingId: 1, platformId: 3 },
      ]),
    );
    const first = getGlyphSet(buffer);
    const second = getGlyphSet(buffer);
    expect(second).toBe(first);
  });

  it("returns a different set instance for a different buffer with the same content", () => {
    const table = buildCmapTable([
      { body: buildCmapFormat6(0x41, 2), encodingId: 1, platformId: 3 },
    ]);
    const first = getGlyphSet(buildFontBuffer(table));
    const second = getGlyphSet(buildFontBuffer(table));
    expect(second).not.toBe(first);
    expect(second).toEqual(first);
  });
});
