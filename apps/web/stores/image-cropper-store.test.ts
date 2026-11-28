// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
  IMAGE_CROPPER_SETTINGS_STORAGE_KEY,
  useImageCropperStore,
} from "@/stores/image-cropper-store";

function readStoredSettings(): Record<string, unknown> {
  const raw = localStorage.getItem(IMAGE_CROPPER_SETTINGS_STORAGE_KEY);

  if (!raw) {
    throw new Error("expected settings to be persisted to localStorage");
  }

  const parsed = JSON.parse(raw) as { state?: Record<string, unknown> };

  return parsed.state ?? {};
}

beforeEach(() => {
  localStorage.clear();
  useImageCropperStore.setState({
    hasRestoredSettings: false,
    outputFormat: "image/png",
    quality: 82,
  });
});

describe("image cropper settings persistence", () => {
  it("persists format and quality changes to localStorage", () => {
    const { setOutputFormat, setQuality } = useImageCropperStore.getState();

    setOutputFormat("image/webp");
    setQuality(90);

    const stored = readStoredSettings();

    expect(stored.outputFormat).toBe("image/webp");
    expect(stored.quality).toBe(90);
  });

  it("clamps out-of-range quality before persisting", () => {
    useImageCropperStore.getState().setQuality(999);

    expect(useImageCropperStore.getState().quality).toBe(100);
    expect(readStoredSettings().quality).toBe(100);
  });

  it("skips auto rehydration and restores only when rehydrate is called", async () => {
    localStorage.setItem(
      IMAGE_CROPPER_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        state: { outputFormat: "image/webp", quality: 90 },
        version: 1,
      }),
    );

    // skipHydration：store 创建时不读 localStorage，挂载前的首帧
    // 保持默认值、与 SSR HTML 一致，由 hook 挂载后手动恢复。
    expect(useImageCropperStore.persist.hasHydrated()).toBe(false);
    expect(useImageCropperStore.getState().outputFormat).toBe("image/png");
    expect(useImageCropperStore.getState().quality).toBe(82);

    await useImageCropperStore.persist.rehydrate();

    expect(useImageCropperStore.persist.hasHydrated()).toBe(true);
    expect(useImageCropperStore.getState().outputFormat).toBe("image/webp");
    expect(useImageCropperStore.getState().quality).toBe(90);
    expect(useImageCropperStore.getState().hasRestoredSettings).toBe(true);
  });

  it("restores valid settings and sanitizes invalid ones on rehydrate", async () => {
    localStorage.setItem(
      IMAGE_CROPPER_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        state: {
          outputFormat: "image/gif",
          quality: 999,
        },
        version: 1,
      }),
    );

    await useImageCropperStore.persist.rehydrate();

    const state = useImageCropperStore.getState();

    expect(state.hasRestoredSettings).toBe(true);
    expect(state.outputFormat).toBe("image/png");
    expect(state.quality).toBe(100);
  });

  it("keeps remembered format when hydrating from a new source", () => {
    useImageCropperStore.setState({
      hasRestoredSettings: true,
      outputFormat: "image/webp",
      quality: 90,
    });

    useImageCropperStore.getState().hydrateFromSource({ type: "image/jpeg" });

    const state = useImageCropperStore.getState();

    expect(state.outputFormat).toBe("image/webp");
    expect(state.quality).toBe(90);
  });

  it("uses type-based format on first visit", () => {
    useImageCropperStore.getState().hydrateFromSource({ type: "image/jpeg" });

    const state = useImageCropperStore.getState();

    expect(state.outputFormat).toBe("image/jpeg");
    expect(state.quality).toBe(82);
  });
});
