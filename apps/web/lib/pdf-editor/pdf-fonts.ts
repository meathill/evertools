import { getGlyphSet } from "@/lib/pdf-editor/pdf-glyph-set";
import { containsCjk, type FontResolution } from "@/lib/pdf-editor/pdf-types";

export type EmbeddedFontEntry = {
  bytes: Uint8Array;
  isType3: boolean;
  loadedName: string;
  mimeType: string;
  postScriptName: string;
};

export type UserFontEntry = {
  bytes: Uint8Array;
  fileName: string;
};

const embeddedStore = new Map<string, Map<string, EmbeddedFontEntry>>();
const documentBytes = new Map<string, Uint8Array>();
const userFonts = new Map<string, UserFontEntry>();
const registeredFontFaces = new Set<string>();

const CJK_FONT_KEY = "__cjk_fallback__";
const USER_FONT_KEY = "__user_font__";

let cjkFontCache: Uint8Array | null = null;

export function storeOriginalBytes(
  documentKey: string,
  bytes: Uint8Array,
): void {
  documentBytes.set(documentKey, bytes);
}

export function takeOriginalBytes(documentKey: string): Uint8Array | null {
  const value = documentBytes.get(documentKey) ?? null;
  return value;
}

export function storeEmbeddedFont(
  documentKey: string,
  entry: EmbeddedFontEntry,
): void {
  let map = embeddedStore.get(documentKey);
  if (!map) {
    map = new Map();
    embeddedStore.set(documentKey, map);
  }
  map.set(entry.loadedName, entry);
}

export function getEmbeddedFont(
  documentKey: string,
  loadedName: string,
): EmbeddedFontEntry | null {
  return embeddedStore.get(documentKey)?.get(loadedName) ?? null;
}

export function listEmbeddedFonts(
  documentKey: string,
): readonly EmbeddedFontEntry[] {
  const map = embeddedStore.get(documentKey);
  if (!map) {
    return [];
  }
  return Array.from(map.values());
}

export function clearDocumentFonts(documentKey: string): void {
  embeddedStore.delete(documentKey);
  documentBytes.delete(documentKey);
}

export function setUserFont(
  documentKey: string,
  entry: UserFontEntry | null,
): void {
  if (entry) {
    userFonts.set(documentKey, entry);
  } else {
    userFonts.delete(documentKey);
  }
}

export function getUserFont(documentKey: string): UserFontEntry | null {
  return userFonts.get(documentKey) ?? null;
}

export async function registerEmbeddedFontFace(
  entry: EmbeddedFontEntry,
): Promise<void> {
  if (typeof document === "undefined") {
    return;
  }
  if (registeredFontFaces.has(entry.loadedName)) {
    return;
  }
  registeredFontFaces.add(entry.loadedName);
  try {
    const blob = new Blob([entry.bytes as BlobPart], { type: entry.mimeType });
    const url = URL.createObjectURL(blob);
    const face = new FontFace(entry.loadedName, `url(${url})`);
    await face.load();
    document.fonts.add(face);
  } catch {
    registeredFontFaces.delete(entry.loadedName);
  }
}

export async function registerUserFontFace(
  entry: UserFontEntry,
  cssFamily: string,
): Promise<void> {
  if (typeof document === "undefined") {
    return;
  }
  try {
    const blob = new Blob([entry.bytes as BlobPart], { type: "font/otf" });
    const url = URL.createObjectURL(blob);
    const face = new FontFace(cssFamily, `url(${url})`);
    await face.load();
    document.fonts.add(face);
  } catch {
    /* noop */
  }
}

export function setCjkFontBytes(bytes: Uint8Array): void {
  cjkFontCache = bytes;
}

export function getCjkFontBytes(): Uint8Array | null {
  return cjkFontCache;
}

export function clearCjkFont(): void {
  cjkFontCache = null;
}

export async function registerCjkFontFace(
  bytes: Uint8Array,
  cssFamily: string,
): Promise<void> {
  if (typeof document === "undefined") {
    return;
  }
  try {
    const blob = new Blob([bytes as BlobPart], { type: "font/otf" });
    const url = URL.createObjectURL(blob);
    const face = new FontFace(cssFamily, `url(${url})`);
    await face.load();
    document.fonts.add(face);
  } catch {
    /* noop */
  }
}

export type ResolveFontOptions = {
  documentKey: string;
  fontLoadedName: string;
  text: string;
};

export type ResolveFontContext = {
  ensureCjkFont: () => Promise<Uint8Array>;
};

export async function resolveFontForText(
  options: ResolveFontOptions,
  context: ResolveFontContext,
): Promise<FontResolution> {
  const { documentKey, fontLoadedName, text } = options;
  const chars = uniqueChars(text);

  const embedded = getEmbeddedFont(documentKey, fontLoadedName);
  if (embedded && !embedded.isType3) {
    const missing = findMissingChars(embedded.bytes, chars);
    if (missing.length === 0) {
      return {
        embedKey: `embedded::${fontLoadedName}`,
        kind: "embedded",
        sourceFontName: embedded.postScriptName,
      };
    }
  }

  if (containsCjk(text)) {
    try {
      const bytes = await context.ensureCjkFont();
      const missing = findMissingChars(bytes, chars);
      if (missing.length === 0) {
        return { embedKey: `cjk::${CJK_FONT_KEY}`, kind: "cjkFallback" };
      }
    } catch {
      /* fall through */
    }
  }

  const userFont = getUserFont(documentKey);
  if (userFont) {
    const missing = findMissingChars(userFont.bytes, chars);
    if (missing.length === 0) {
      return { embedKey: `user::${USER_FONT_KEY}`, kind: "userUpload" };
    }
  }

  const missingFromAll = collectMissingChars({
    cjkBytes: cjkFontCache,
    embeddedBytes: embedded && !embedded.isType3 ? embedded.bytes : null,
    text,
    userBytes: userFont?.bytes ?? null,
  });

  return { kind: "missing", missingChars: missingFromAll };
}

function collectMissingChars(input: {
  cjkBytes: Uint8Array | null;
  embeddedBytes: Uint8Array | null;
  text: string;
  userBytes: Uint8Array | null;
}): readonly string[] {
  const missing: string[] = [];
  for (const ch of uniqueChars(input.text)) {
    const codePoint = ch.codePointAt(0) ?? 0;
    const hasEmbedded = input.embeddedBytes
      ? getGlyphSet(input.embeddedBytes).has(codePoint)
      : false;
    const hasCjk = input.cjkBytes
      ? getGlyphSet(input.cjkBytes).has(codePoint)
      : false;
    const hasUser = input.userBytes
      ? getGlyphSet(input.userBytes).has(codePoint)
      : false;
    if (!hasEmbedded && !hasCjk && !hasUser) {
      missing.push(ch);
    }
  }
  return missing;
}

function findMissingChars(
  fontBytes: Uint8Array,
  chars: readonly string[],
): readonly string[] {
  const set = getGlyphSet(fontBytes);
  const missing: string[] = [];
  for (const ch of chars) {
    const codePoint = ch.codePointAt(0) ?? 0;
    if (!set.has(codePoint)) {
      missing.push(ch);
    }
  }
  return missing;
}

function uniqueChars(text: string): readonly string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const ch of text) {
    if (!seen.has(ch)) {
      seen.add(ch);
      out.push(ch);
    }
  }
  return out;
}
