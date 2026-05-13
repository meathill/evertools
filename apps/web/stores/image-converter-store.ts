import { create } from "zustand";
import {
  DEFAULT_QUALITY,
  getDefaultOutputFormat,
  type OutputFormat,
  clampQuality,
} from "@/lib/image-converter";

type ImageConverterState = {
  hydrateFromSource: (input: {
    height: number;
    type?: string;
    width: number;
  }) => void;
  isAspectLocked: boolean;
  outputFormat: OutputFormat;
  quality: number;
  reset: () => void;
  setAspectLocked: (checked: boolean) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
  setTargetDimensions: (width: string, height: string) => void;
  setTargetHeight: (height: string) => void;
  setTargetWidth: (width: string) => void;
  targetHeight: string;
  targetWidth: string;
};

const initialState = {
  isAspectLocked: true,
  outputFormat: "image/png" as OutputFormat,
  quality: DEFAULT_QUALITY,
  targetHeight: "",
  targetWidth: "",
};

export const useImageConverterStore = create<ImageConverterState>((set) => ({
  ...initialState,
  hydrateFromSource: ({ height, type, width }) => {
    set({
      isAspectLocked: true,
      outputFormat: getDefaultOutputFormat(type),
      quality: DEFAULT_QUALITY,
      targetHeight: String(height),
      targetWidth: String(width),
    });
  },
  reset: () => {
    set(initialState);
  },
  setAspectLocked: (checked) => {
    set({ isAspectLocked: checked });
  },
  setOutputFormat: (format) => {
    set({ outputFormat: format });
  },
  setQuality: (quality) => {
    set({ quality: clampQuality(quality) });
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
