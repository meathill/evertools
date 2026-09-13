// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
  IMAGE_CONVERTER_SETTINGS_STORAGE_KEY,
  useImageConverterStore,
} from "@/stores/image-converter-store";

function readStoredSettings(): Record<string, unknown> {
  const raw = localStorage.getItem(IMAGE_CONVERTER_SETTINGS_STORAGE_KEY);

  if (!raw) {
    throw new Error("expected settings to be persisted to localStorage");
  }

  const parsed = JSON.parse(raw) as { state?: Record<string, unknown> };

  return parsed.state ?? {};
}

beforeEach(() => {
  localStorage.clear();
  useImageConverterStore.setState({
    backgroundColor: "#ffffff",
    cropAnchor: { horizontal: "center", vertical: "middle" },
    hasRestoredSettings: false,
    outputFormat: "image/png",
    quality: 82,
    resizeMode: "lock",
    targetHeight: "",
    targetWidth: "",
  });
});

describe("image converter settings persistence", () => {
  it("persists settings changes to localStorage", () => {
    const { setCropAnchor, setOutputFormat, setQuality, setTargetDimensions } =
      useImageConverterStore.getState();

    setOutputFormat("image/webp");
    setQuality(90);
    setCropAnchor({ horizontal: "left", vertical: "top" });
    setTargetDimensions("1200", "800");

    const stored = readStoredSettings();

    expect(stored.outputFormat).toBe("image/webp");
    expect(stored.quality).toBe(90);
    expect(stored.targetWidth).toBe("1200");
    expect(stored.targetHeight).toBe("800");
    expect(stored.cropAnchor).toEqual({
      horizontal: "left",
      vertical: "top",
    });
  });

  it("restores valid settings and sanitizes invalid ones on rehydrate", async () => {
    localStorage.setItem(
      IMAGE_CONVERTER_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        state: {
          backgroundColor: "not-a-color",
          cropAnchor: { horizontal: "nope", vertical: "nope" },
          outputFormat: "image/gif",
          quality: 999,
          resizeMode: "nope",
          targetHeight: "800",
          targetWidth: "1200",
        },
        version: 1,
      }),
    );

    await useImageConverterStore.persist.rehydrate();

    const state = useImageConverterStore.getState();

    expect(state.hasRestoredSettings).toBe(true);
    expect(state.outputFormat).toBe("image/png");
    expect(state.resizeMode).toBe("lock");
    expect(state.quality).toBe(100);
    expect(state.backgroundColor).toBe("#ffffff");
    expect(state.cropAnchor).toEqual({
      horizontal: "center",
      vertical: "middle",
    });
    // 合法宽高保留，非法项回退默认值。
    expect(state.targetWidth).toBe("1200");
    expect(state.targetHeight).toBe("800");
  });

  it("keeps remembered settings when hydrating from a new source", () => {
    useImageConverterStore.setState({
      hasRestoredSettings: true,
      outputFormat: "image/webp",
      quality: 90,
      resizeMode: "crop",
      targetHeight: "800",
      targetWidth: "1200",
    });

    useImageConverterStore
      .getState()
      .hydrateFromSource({ height: 600, type: "image/jpeg", width: 800 });

    const state = useImageConverterStore.getState();

    expect(state.outputFormat).toBe("image/webp");
    expect(state.resizeMode).toBe("crop");
    expect(state.quality).toBe(90);
    expect(state.targetWidth).toBe("1200");
    expect(state.targetHeight).toBe("800");
  });

  it("fills empty dimensions and type-based format on first visit", () => {
    useImageConverterStore.getState().hydrateFromSource({
      height: 600,
      type: "image/jpeg",
      width: 800,
    });

    const state = useImageConverterStore.getState();

    expect(state.outputFormat).toBe("image/jpeg");
    expect(state.targetWidth).toBe("800");
    expect(state.targetHeight).toBe("600");
  });

  it("landing page preset still overrides remembered format", () => {
    useImageConverterStore.setState({
      hasRestoredSettings: true,
      outputFormat: "image/webp",
    });

    useImageConverterStore.getState().hydrateFromSource({
      height: 600,
      preferredFormat: "image/png",
      type: "image/jpeg",
      width: 800,
    });

    expect(useImageConverterStore.getState().outputFormat).toBe("image/png");
  });
});
