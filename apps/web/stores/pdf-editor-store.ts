import { create } from "zustand";
import type { PdfEditorErrorCode } from "@/lib/pdf-editor/pdf-errors";
import type {
  EditedBlock,
  ImportPdfResult,
  PdfPageMeta,
  PdfTextBlock,
} from "@/lib/pdf-editor/pdf-types";
import { buildBlockKey } from "@/lib/pdf-editor/pdf-types";

export type CjkFallbackStatus = "idle" | "loading" | "ready" | "failed";

type PdfEditorState = {
  activeBlockKey: string | null;
  cjkLoadProgress: number;
  cjkStatus: CjkFallbackStatus;
  currentPageIndex: number;
  documentKey: string | null;
  editedBlocks: ReadonlyMap<string, EditedBlock>;
  errorCode: PdfEditorErrorCode | null;
  errorDetail: string | null;
  exportError: PdfEditorErrorCode | null;
  exportMissingGlyphs: ReadonlyMap<string, readonly string[]>;
  exportProgress: number;
  fileName: string | null;
  fileSize: number;
  isExporting: boolean;
  isLoading: boolean;
  isScanned: boolean;
  pages: readonly PdfPageMeta[];
  textBlocksByKey: ReadonlyMap<string, PdfTextBlock>;
  totalTextChars: number;
  userFontName: string | null;
};

type PdfEditorActions = {
  clearError: () => void;
  clearUserFont: () => void;
  discardBlockEdit: (blockKey: string) => void;
  finishExport: (
    missingGlyphBlocks: readonly {
      blockKey: string;
      chars: readonly string[];
    }[],
  ) => void;
  finishImport: (result: ImportPdfResult, documentKey: string) => void;
  reset: () => void;
  setActiveBlock: (blockKey: string | null) => void;
  setCjkProgress: (progress: number) => void;
  setCjkStatus: (status: CjkFallbackStatus) => void;
  setCurrentPageIndex: (pageIndex: number) => void;
  setError: (code: PdfEditorErrorCode, detail?: string) => void;
  setExportError: (code: PdfEditorErrorCode | null) => void;
  setExportProgress: (progress: number) => void;
  setUserFont: (fileName: string | null) => void;
  startExport: () => void;
  startImport: (fileName: string, fileSize: number) => void;
  updateBlockText: (blockKey: string, newText: string) => void;
};

const initialState: PdfEditorState = {
  activeBlockKey: null,
  cjkLoadProgress: 0,
  cjkStatus: "idle",
  currentPageIndex: 0,
  documentKey: null,
  editedBlocks: new Map(),
  errorCode: null,
  errorDetail: null,
  exportError: null,
  exportMissingGlyphs: new Map(),
  exportProgress: 0,
  fileName: null,
  fileSize: 0,
  isExporting: false,
  isLoading: false,
  isScanned: false,
  pages: [],
  textBlocksByKey: new Map(),
  totalTextChars: 0,
  userFontName: null,
};

export const usePdfEditorStore = create<PdfEditorState & PdfEditorActions>(
  (set, get) => ({
    ...initialState,
    clearError: () => {
      set({ errorCode: null, errorDetail: null });
    },
    clearUserFont: () => {
      set({ userFontName: null });
    },
    discardBlockEdit: (blockKey) => {
      const next = new Map(get().editedBlocks);
      next.delete(blockKey);
      set({ editedBlocks: next });
    },
    finishExport: (missingGlyphBlocks) => {
      const map = new Map<string, readonly string[]>();
      for (const item of missingGlyphBlocks) {
        map.set(item.blockKey, item.chars);
      }
      set({
        exportMissingGlyphs: map,
        exportProgress: 1,
        isExporting: false,
      });
    },
    finishImport: (result, documentKey) => {
      const textBlocksByKey = new Map<string, PdfTextBlock>();
      for (const page of result.pages) {
        for (const block of page.textBlocks) {
          textBlocksByKey.set(
            buildBlockKey(page.pageIndex, block.blockId),
            block,
          );
        }
      }
      set({
        currentPageIndex: 0,
        documentKey,
        editedBlocks: new Map(),
        errorCode: null,
        errorDetail: null,
        exportError: null,
        exportMissingGlyphs: new Map(),
        exportProgress: 0,
        fileName: result.fileName,
        fileSize: result.fileSize,
        isExporting: false,
        isLoading: false,
        isScanned: result.isScanned,
        pages: result.pages,
        textBlocksByKey,
        totalTextChars: result.totalTextChars,
      });
    },
    reset: () => {
      set(initialState);
    },
    setActiveBlock: (blockKey) => {
      set({ activeBlockKey: blockKey });
    },
    setCjkProgress: (progress) => {
      set({ cjkLoadProgress: Math.min(1, Math.max(0, progress)) });
    },
    setCjkStatus: (status) => {
      set({ cjkStatus: status });
    },
    setCurrentPageIndex: (pageIndex) => {
      set({ currentPageIndex: pageIndex });
    },
    setError: (code, detail) => {
      set({
        errorCode: code,
        errorDetail: detail ?? null,
        isLoading: false,
      });
    },
    setExportError: (code) => {
      set({
        exportError: code,
        isExporting: false,
      });
    },
    setExportProgress: (progress) => {
      set({ exportProgress: Math.min(1, Math.max(0, progress)) });
    },
    setUserFont: (fileName) => {
      set({ userFontName: fileName });
    },
    startExport: () => {
      set({
        exportError: null,
        exportMissingGlyphs: new Map(),
        exportProgress: 0,
        isExporting: true,
      });
    },
    startImport: (fileName, fileSize) => {
      set({
        ...initialState,
        fileName,
        fileSize,
        isLoading: true,
      });
    },
    updateBlockText: (blockKey, newText) => {
      const state = get();
      const block = state.textBlocksByKey.get(blockKey);
      if (!block) {
        return;
      }
      const next = new Map(state.editedBlocks);
      if (newText === block.text) {
        next.delete(blockKey);
        set({ editedBlocks: next });
        return;
      }
      next.set(blockKey, {
        blockKey,
        fontSize:
          block.fontSize / (state.pages[block.pageIndex]?.viewportScale ?? 1),
        isOverflow: false,
        newText,
        originalText: block.text,
      });
      set({ editedBlocks: next });
    },
  }),
);
