import { create } from "zustand";
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

type ImageConverterState = {
  backgroundColor: string;
  cropAnchor: CropAnchor;
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

const DEFAULT_CROP_ANCHOR: CropAnchor = {
  horizontal: "center",
  vertical: "middle",
};

const initialState = {
  backgroundColor: DEFAULT_BACKGROUND_COLOR,
  cropAnchor: DEFAULT_CROP_ANCHOR,
  outputFormat: "image/png" as OutputFormat,
  quality: DEFAULT_QUALITY,
  resizeMode: "lock" as ResizeMode,
  targetHeight: "",
  targetWidth: "",
};

export const useImageConverterStore = create<ImageConverterState>((set) => ({
  ...initialState,
  hydrateFromSource: ({ height, preferredFormat, type, width }) => {
    set({
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
      cropAnchor: DEFAULT_CROP_ANCHOR,
      outputFormat: preferredFormat ?? getDefaultOutputFormat(type),
      quality: DEFAULT_QUALITY,
      resizeMode: "lock",
      targetHeight: String(height),
      targetWidth: String(width),
    });
  },
  reset: () => {
    set(initialState);
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
}));
