import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  clampQuality,
  DEFAULT_QUALITY,
  getDefaultOutputFormat,
  type OutputFormat,
  sanitizeOutputFormat,
  sanitizeQuality,
} from "@/lib/image-converter";

export const IMAGE_CROPPER_SETTINGS_STORAGE_KEY =
  "evertools:image-cropper-settings:v1";

type ImageCropperState = {
  /** 是否已从 localStorage 恢复过用户设置；用于区分首访（按原图给默认格式）与回访（保留用户偏好）。不持久化。 */
  hasRestoredSettings: boolean;
  hydrateFromSource: (input: { type?: string }) => void;
  outputFormat: OutputFormat;
  quality: number;
  setOutputFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
};

type PersistedSettings = {
  outputFormat?: OutputFormat;
  quality?: number;
};

function sanitizePersistedSettings(persisted: unknown): PersistedSettings {
  if (typeof persisted !== "object" || persisted === null) {
    return {};
  }

  const value = persisted as Record<string, unknown>;

  return {
    outputFormat: sanitizeOutputFormat(value.outputFormat),
    quality: sanitizeQuality(value.quality),
  };
}

export const useImageCropperStore = create<ImageCropperState>()(
  persist(
    (set, get) => ({
      hasRestoredSettings: false,
      hydrateFromSource: ({ type }) => {
        const current = get();
        // 回访用户：保留 localStorage 里的格式偏好；
        // 首访用户：沿用之前的体验，按原图类型给默认输出格式。
        set({
          outputFormat: current.hasRestoredSettings
            ? current.outputFormat
            : getDefaultOutputFormat(type),
        });
      },
      outputFormat: "image/png",
      quality: DEFAULT_QUALITY,
      setOutputFormat: (format) => {
        set({ outputFormat: format });
      },
      setQuality: (quality) => {
        set({ quality: clampQuality(quality) });
      },
    }),
    {
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...sanitizePersistedSettings(persistedState),
        hasRestoredSettings:
          typeof persistedState === "object" && persistedState !== null,
      }),
      name: IMAGE_CROPPER_SETTINGS_STORAGE_KEY,
      partialize: (state) => ({
        outputFormat: state.outputFormat,
        quality: state.quality,
      }),
      // SSR 下避免“SSR 渲染默认值、客户端首帧就是持久化值”的水合不匹配：
      // 创建时不读 localStorage，由 hook 挂载后调用 persist.rehydrate()。
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
