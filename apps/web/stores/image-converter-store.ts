import { create } from "zustand";
import {
  DEFAULT_QUALITY,
  getDefaultOutputFormat,
  type CropAnchor,
  type OutputFormat,
  type ResizeMode,
  clampQuality,
} from "@/lib/image-converter";

type ImageConverterState = {
  cropAnchor: CropAnchor;
  hydrateFromSource: (input: {
    height: number;
    type?: string;
    width: number;
  }) => void;
  outputFormat: OutputFormat;
  quality: number;
  reset: () => void;
  resizeMode: ResizeMode;
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
  cropAnchor: DEFAULT_CROP_ANCHOR,
  outputFormat: "image/png" as OutputFormat,
  quality: DEFAULT_QUALITY,
  resizeMode: "lock" as ResizeMode,
  targetHeight: "",
  targetWidth: "",
};

export const useImageConverterStore = create<ImageConverterState>((set) => ({
  ...initialState,
  hydrateFromSource: ({ height, type, width }) => {
    set({
      cropAnchor: DEFAULT_CROP_ANCHOR,
      outputFormat: getDefaultOutputFormat(type),
      quality: DEFAULT_QUALITY,
      resizeMode: "lock",
      targetHeight: String(height),
      targetWidth: String(width),
    });
  },
  reset: () => {
    set(initialState);
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
