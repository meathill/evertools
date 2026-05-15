const fontGlyphSetCache = new WeakMap<Uint8Array, Set<number>>();

export function getGlyphSet(bytes: Uint8Array): Set<number> {
  const cached = fontGlyphSetCache.get(bytes);
  if (cached) {
    return cached;
  }
  const set = parseCmapCodePoints(bytes);
  fontGlyphSetCache.set(bytes, set);
  return set;
}

export function parseCmapCodePoints(bytes: Uint8Array): Set<number> {
  const result = new Set<number>();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  const offsets = collectCmapOffsets(view);
  for (const offset of offsets) {
    try {
      readCmapSubtable(view, offset, result);
    } catch {
      // Skip invalid subtables
    }
  }
  return result;
}

function collectCmapOffsets(view: DataView): readonly number[] {
  if (view.byteLength < 12) {
    return [];
  }

  const scaler = view.getUint32(0, false);
  const offsets: number[] = [];

  if (scaler === 0x74746366) {
    const numFonts = view.getUint32(8, false);
    for (let i = 0; i < numFonts; i++) {
      const fontOffset = view.getUint32(12 + i * 4, false);
      offsets.push(...readSingleFontCmaps(view, fontOffset));
    }
    return offsets;
  }

  return readSingleFontCmaps(view, 0);
}

function readSingleFontCmaps(
  view: DataView,
  fontOffset: number,
): readonly number[] {
  if (fontOffset + 12 > view.byteLength) {
    return [];
  }
  const numTables = view.getUint16(fontOffset + 4, false);
  for (let i = 0; i < numTables; i++) {
    const recordOffset = fontOffset + 12 + i * 16;
    if (recordOffset + 16 > view.byteLength) {
      break;
    }
    const tag = readTag(view, recordOffset);
    if (tag === "cmap") {
      const offset = view.getUint32(recordOffset + 8, false);
      return [offset];
    }
  }
  return [];
}

function readTag(view: DataView, offset: number): string {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3),
  );
}

function readCmapSubtable(
  view: DataView,
  cmapOffset: number,
  out: Set<number>,
): void {
  if (cmapOffset + 4 > view.byteLength) {
    return;
  }
  const numSubtables = view.getUint16(cmapOffset + 2, false);
  for (let i = 0; i < numSubtables; i++) {
    const encodingRecordOffset = cmapOffset + 4 + i * 8;
    if (encodingRecordOffset + 8 > view.byteLength) {
      break;
    }
    const subtableOffset =
      cmapOffset + view.getUint32(encodingRecordOffset + 4, false);
    if (subtableOffset + 2 > view.byteLength) {
      continue;
    }
    const format = view.getUint16(subtableOffset, false);
    if (format === 4) {
      readCmapFormat4(view, subtableOffset, out);
    } else if (format === 6) {
      readCmapFormat6(view, subtableOffset, out);
    } else if (format === 12) {
      readCmapFormat12(view, subtableOffset, out);
    }
  }
}

function readCmapFormat4(
  view: DataView,
  offset: number,
  out: Set<number>,
): void {
  const segCountX2 = view.getUint16(offset + 6, false);
  const segCount = segCountX2 / 2;
  const endCodesOffset = offset + 14;
  const startCodesOffset = endCodesOffset + segCountX2 + 2;
  for (let i = 0; i < segCount; i++) {
    const end = view.getUint16(endCodesOffset + i * 2, false);
    const start = view.getUint16(startCodesOffset + i * 2, false);
    if (start === 0xffff && end === 0xffff) {
      continue;
    }
    for (let c = start; c <= end; c++) {
      out.add(c);
    }
  }
}

function readCmapFormat6(
  view: DataView,
  offset: number,
  out: Set<number>,
): void {
  const firstCode = view.getUint16(offset + 6, false);
  const entryCount = view.getUint16(offset + 8, false);
  for (let i = 0; i < entryCount; i++) {
    out.add(firstCode + i);
  }
}

function readCmapFormat12(
  view: DataView,
  offset: number,
  out: Set<number>,
): void {
  const numGroups = view.getUint32(offset + 12, false);
  for (let i = 0; i < numGroups; i++) {
    const groupOffset = offset + 16 + i * 12;
    const startChar = view.getUint32(groupOffset, false);
    const endChar = view.getUint32(groupOffset + 4, false);
    for (let c = startChar; c <= endChar; c++) {
      out.add(c);
    }
  }
}
