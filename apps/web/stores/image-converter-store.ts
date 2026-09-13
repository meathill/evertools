import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  type CropAnchor,
  clampQuality,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_QUALITY,
  getDefaultOutputFormat,
  normalizeBackgroundColor,
  type OutputFormat,
  type ResizeMode,
} from "@/lib/image-converter";

export const IMAGE_CONVERTER_SETTINGS_STORAGE_KEY =
  "evertools:image-converter-settings:v1";

type ImageConverterState = {
  backgroundColor: string;
  cropAnchor: CropAnchor;
  /** 是否已从 localStorage 恢复过用户设置；用于区分首访（按原图给默认格式）与回访（保留用户偏好）。不持久化。 */
  hasRestoredSettings: boolean;
  hydrateFromSource: (input: {
    height: number;
    preferredFormat?: OutputFormat;
    type?: string;
    width: number;
  }) => void;
  outputFormat: OutputFormat;
  quality: number;
  reset: () => void;
  resizeMode: ResizeMode;
  setBackgroundColor: (color: string) => void;
  setCropAnchor: (anchor: CropAnchor) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
  setResizeMode: (mode: ResizeMode) => void;
  setTargetDimensions: (width: string, height: string) => void;
  setTargetHeight: (height: string) => void;
  setTargetWidth: (width: string) => void;
  targetHeight: string;
  targetWidth: string;
};

type PersistedSettings = {
  backgroundColor?: string;
  cropAnchor?: CropAnchor;
  outputFormat?: OutputFormat;
  quality?: number;
  resizeMode?: ResizeMode;
  targetHeight?: string;
  targetWidth?: string;
};

const DEFAULT_CROP_ANCHOR: CropAnchor = {
  horizontal: "center",
  vertical: "middle",
};

const initialState = {
  backgroundColor: DEFAULT_BACKGROUND_COLOR,
  cropAnchor: DEFAULT_CROP_ANCHOR,
  hasRestoredSettings: false,
  outputFormat: "image/png" as OutputFormat,
  quality: DEFAULT_QUALITY,
  resizeMode: "lock" as ResizeMode,
  targetHeight: "",
  targetWidth: "",
};

function sanitizeOutputFormat(value: unknown): OutputFormat {
  if (
    value === "image/png" ||
    value === "image/jpeg" ||
    value === "image/webp"
  ) {
    return value;
  }

  return "image/png";
}

function sanitizeResizeMode(value: unknown): ResizeMode {
  if (value === "lock" || value === "stretch" || value === "crop") {
    return value;
  }

  return "lock";
}

function sanitizeQuality(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return clampQuality(value);
  }

  return DEFAULT_QUALITY;
}

function sanitizeCropAnchor(value: unknown): CropAnchor {
  if (typeof value === "object" && value !== null) {
    const { horizontal, vertical } = value as Record<string, unknown>;
    const sanitizedHorizontal =
      horizontal === "left" || horizontal === "center" || horizontal === "right"
        ? horizontal
        : DEFAULT_CROP_ANCHOR.horizontal;
    const sanitizedVertical =
      vertical === "top" || vertical === "middle" || vertical === "bottom"
        ? vertical
        : DEFAULT_CROP_ANCHOR.vertical;

    return { horizontal: sanitizedHorizontal, vertical: sanitizedVertical };
  }

  return DEFAULT_CROP_ANCHOR;
}

function sanitizeDimension(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  if (trimmed === "" || !/^\d+$/.test(trimmed)) {
    return "";
  }

  const parsed = Number.parseInt(trimmed, 10);

  if (parsed <= 0 || parsed > 30_000) {
    return "";
  }

  return String(parsed);
}

function sanitizePersistedSettings(persisted: unknown): PersistedSettings {
  if (typeof persisted !== "object" || persisted === null) {
    return {};
  }

  const value = persisted as Record<string, unknown>;

  return {
    backgroundColor:
      typeof value.backgroundColor === "string"
        ? normalizeBackgroundColor(value.backgroundColor)
        : DEFAULT_BACKGROUND_COLOR,
    cropAnchor: sanitizeCropAnchor(value.cropAnchor),
    outputFormat: sanitizeOutputFormat(value.outputFormat),
    quality: sanitizeQuality(value.quality),
    resizeMode: sanitizeResizeMode(value.resizeMode),
    targetHeight: sanitizeDimension(value.targetHeight),
    targetWidth: sanitizeDimension(value.targetWidth),
  };
}

export const useImageConverterStore = create<ImageConverterState>()(
  persist(
    (set, get) => ({
      ...initialState,
      hydrateFromSource: ({ height, preferredFormat, type, width }) => {
        const current = get();
        // 回访用户：保留 localStorage 里的格式偏好，只在落地页预设时覆盖；
        // 首访用户：沿用之前的体验，按原图类型给默认输出格式。
        const outputFormat =
          preferredFormat ??
          (current.hasRestoredSettings
            ? current.outputFormat
            : getDefaultOutputFormat(type));
        // 记住的宽高优先：只在存储值为空时才用原图原生尺寸回填，
        // 这样用户设一次 1200x800，后续换图也不用重调。
        const targetWidth =
          current.targetWidth.trim() !== ""
            ? current.targetWidth
            : String(width);
        const targetHeight =
          current.targetHeight.trim() !== ""
            ? current.targetHeight
            : String(height);

        set({ outputFormat, targetHeight, targetWidth });
      },
      reset: () => {
        set({
          ...initialState,
          hasRestoredSettings: get().hasRestoredSettings,
        });
      },
      setBackgroundColor: (color) => {
        set({ backgroundColor: normalizeBackgroundColor(color) });
      },
      setCropAnchor: (anchor) => {
        set({ cropAnchor: anchor });
      },
      setOutputFormat: (format) => {
        set({ outputFormat: format });
      },
      setQuality: (quality) => {
        set({ quality: clampQuality(quality) });
      },
      setResizeMode: (mode) => {
        set({ resizeMode: mode });
      },
      setTargetDimensions: (width, height) => {
        set({ targetHeight: height, targetWidth: width });
      },
      setTargetHeight: (height) => {
        set({ targetHeight: height });
      },
      setTargetWidth: (width) => {
        set({ targetWidth: width });
      },
    }),
    {
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...sanitizePersistedSettings(persistedState),
        hasRestoredSettings:
          typeof persistedState === "object" && persistedState !== null,
      }),
      name: IMAGE_CONVERTER_SETTINGS_STORAGE_KEY,
      partialize: (state) => ({
        backgroundColor: state.backgroundColor,
        cropAnchor: state.cropAnchor,
        outputFormat: state.outputFormat,
        quality: state.quality,
        resizeMode: state.resizeMode,
        targetHeight: state.targetHeight,
        targetWidth: state.targetWidth,
      }),
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
