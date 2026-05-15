import {
  createPdfEditorError,
  PDF_EDITOR_ERROR_CODES,
} from "@/lib/pdf-editor/pdf-errors";
import {
  getCjkFontBytes,
  registerCjkFontFace,
  setCjkFontBytes,
} from "@/lib/pdf-editor/pdf-fonts";

export const CJK_FONT_CSS_FAMILY = "PDF-Editor-CJK-Fallback";

const CJK_FONT_URL =
  "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/SimplifiedChinese/NotoSansSC-Regular.otf";

const DB_NAME = "pdf-editor-fonts";
const STORE_NAME = "cjk";
const CACHE_KEY = "noto-sans-sc-regular";

export type CjkLoadProgress = (loaded: number, total: number) => void;

export async function ensureCjkFallbackFont(
  onProgress?: CjkLoadProgress,
): Promise<Uint8Array> {
  const cached = getCjkFontBytes();
  if (cached) {
    return cached;
  }

  const fromDb = await readFromIndexedDb().catch(() => null);
  if (fromDb) {
    setCjkFontBytes(fromDb);
    await registerCjkFontFace(fromDb, CJK_FONT_CSS_FAMILY);
    return fromDb;
  }

  const bytes = await downloadCjkFont(onProgress);
  setCjkFontBytes(bytes);
  await registerCjkFontFace(bytes, CJK_FONT_CSS_FAMILY);
  void writeToIndexedDb(bytes).catch(() => {
    /* cache write is best-effort */
  });

  return bytes;
}

async function downloadCjkFont(
  onProgress?: CjkLoadProgress,
): Promise<Uint8Array> {
  let response: Response;
  try {
    response = await fetch(CJK_FONT_URL);
  } catch (error) {
    throw createPdfEditorError(
      PDF_EDITOR_ERROR_CODES.CJK_FONT_LOAD_FAILED,
      error instanceof Error ? error.message : undefined,
    );
  }

  if (!response.ok || !response.body) {
    throw createPdfEditorError(
      PDF_EDITOR_ERROR_CODES.CJK_FONT_LOAD_FAILED,
      `HTTP ${response.status}`,
    );
  }

  const contentLength = Number(response.headers.get("content-length")) || 0;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    received += value.length;
    if (onProgress) {
      onProgress(received, contentLength || received);
    }
  }

  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}

function openIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () =>
      reject(request.error ?? new Error("DB open failed"));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function readFromIndexedDb(): Promise<Uint8Array | null> {
  const db = await openIndexedDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(CACHE_KEY);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const value = request.result as ArrayBuffer | Uint8Array | undefined;
      if (!value) {
        resolve(null);
        return;
      }
      resolve(value instanceof Uint8Array ? value : new Uint8Array(value));
    };
    tx.oncomplete = () => db.close();
  });
}

async function writeToIndexedDb(bytes: Uint8Array): Promise<void> {
  const db = await openIndexedDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(bytes, CACHE_KEY);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    tx.oncomplete = () => db.close();
  });
}
