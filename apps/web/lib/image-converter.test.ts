import { describe, expect, it, vi } from "vitest";
import {
  buildOutputFilename,
  clampQuality,
  computeCropSourceRect,
  FILE_INPUT_ACCEPT,
  getCurrentTargetDimensions,
  getDefaultOutputFormat,
  getImageConverterErrorMessage,
  getSyncedDimensionValue,
  IMAGE_CONVERTER_ERROR_CODES,
  isAcceptedImageFile,
  isHeicFile,
  normalizeSourceFile,
  resolveTargetDimensions,
} from "@/lib/image-converter";
import { getLocaleContent } from "@/messages";

// 用轻量 mock 替代真实 heic-to（避免在 node 环境加载 WASM/Worker）。
vi.mock("heic-to", () => ({
  heicTo: vi.fn(
    async () => new Blob([new Uint8Array([9])], { type: "image/jpeg" }),
  ),
}));

describe("image converter helpers", () => {
  it("resolves locked dimensions from width", () => {
    expect(
      resolveTargetDimensions({
        heightInput: "",
        isAspectLocked: true,
        originalHeight: 800,
        originalWidth: 1600,
        widthInput: "400",
      }),
    ).toEqual({
      height: 200,
      width: 400,
    });
  });

  it("resolves free dimensions independently", () => {
    expect(
      resolveTargetDimensions({
        heightInput: "320",
        isAspectLocked: false,
        originalHeight: 800,
        originalWidth: 1600,
        widthInput: "640",
      }),
    ).toEqual({
      height: 320,
      width: 640,
    });
  });

  it("throws for invalid dimensions", () => {
    expect(() =>
      resolveTargetDimensions({
        heightInput: "320",
        isAspectLocked: false,
        originalHeight: 800,
        originalWidth: 1600,
        widthInput: "abc",
      }),
    ).toThrow(IMAGE_CONVERTER_ERROR_CODES.INVALID_DIMENSIONS);
  });

  it("syncs height when width changes", () => {
    expect(
      getSyncedDimensionValue({
        changedField: "width",
        nextValue: "500",
        originalHeight: 1200,
        originalWidth: 2000,
      }),
    ).toBe("300");
  });

  it("builds output filenames with new extension", () => {
    expect(buildOutputFilename("summer.photo.png", "image/webp")).toBe(
      "summer.photo-converted.webp",
    );
  });

  it("clamps quality and picks default formats", () => {
    expect(clampQuality(101)).toBe(100);
    expect(clampQuality(-1)).toBe(1);
    expect(getDefaultOutputFormat("image/jpeg")).toBe("image/jpeg");
    expect(getDefaultOutputFormat("image/gif")).toBe("image/png");
  });
});

describe("computeCropSourceRect", () => {
  // 1600x800 横图裁成 600x600 方图：scale=max(600/1600, 600/800)=0.75，
  // 可见区域 = 600/0.75 = 800，正好是原图高度。宽度裁到 800。
  const baseInput = {
    sourceHeight: 800,
    sourceWidth: 1600,
    targetHeight: 600,
    targetWidth: 600,
  } as const;

  it("scales by the larger ratio and crops the wider axis", () => {
    const rect = computeCropSourceRect({
      ...baseInput,
      anchor: { horizontal: "center", vertical: "middle" },
    });

    expect(rect.sWidth).toBe(800);
    expect(rect.sHeight).toBe(800);
    expect(rect.sWidth).toBeLessThan(baseInput.sourceWidth);
    expect(rect.sHeight).toBe(baseInput.sourceHeight);
  });

  it("offsets horizontally by anchor", () => {
    expect(
      computeCropSourceRect({
        ...baseInput,
        anchor: { horizontal: "left", vertical: "middle" },
      }).sx,
    ).toBe(0);
    expect(
      computeCropSourceRect({
        ...baseInput,
        anchor: { horizontal: "center", vertical: "middle" },
      }).sx,
    ).toBe(400);
    expect(
      computeCropSourceRect({
        ...baseInput,
        anchor: { horizontal: "right", vertical: "middle" },
      }).sx,
    ).toBe(800);
  });

  it("offsets vertically by anchor", () => {
    // 800x1600 竖图裁成 600x600：可见区域高度裁到 800，宽度满。
    const portrait = {
      sourceHeight: 1600,
      sourceWidth: 800,
      targetHeight: 600,
      targetWidth: 600,
    } as const;

    expect(
      computeCropSourceRect({
        ...portrait,
        anchor: { horizontal: "center", vertical: "top" },
      }).sy,
    ).toBe(0);
    expect(
      computeCropSourceRect({
        ...portrait,
        anchor: { horizontal: "center", vertical: "middle" },
      }).sy,
    ).toBe(400);
    expect(
      computeCropSourceRect({
        ...portrait,
        anchor: { horizontal: "center", vertical: "bottom" },
      }).sy,
    ).toBe(800);
  });

  it("covers the whole source when target ratio matches", () => {
    const rect = computeCropSourceRect({
      anchor: { horizontal: "center", vertical: "middle" },
      sourceHeight: 800,
      sourceWidth: 1600,
      targetHeight: 400,
      targetWidth: 800,
    });

    expect(rect).toEqual({ sHeight: 800, sWidth: 1600, sx: 0, sy: 0 });
  });
});

describe("getCurrentTargetDimensions", () => {
  it("returns null when the source size is unknown", () => {
    expect(
      getCurrentTargetDimensions({
        heightInput: "100",
        isAspectLocked: true,
        widthInput: "100",
      }),
    ).toBeNull();
  });

  it("resolves dimensions when the source size is known", () => {
    expect(
      getCurrentTargetDimensions({
        heightInput: "",
        isAspectLocked: true,
        originalHeight: 800,
        originalWidth: 1600,
        widthInput: "400",
      }),
    ).toEqual({ height: 200, width: 400 });
  });

  it("returns null instead of throwing on invalid input", () => {
    expect(
      getCurrentTargetDimensions({
        heightInput: "abc",
        isAspectLocked: false,
        originalHeight: 800,
        originalWidth: 1600,
        widthInput: "xyz",
      }),
    ).toBeNull();
  });
});

describe("getImageConverterErrorMessage", () => {
  const content = getLocaleContent("zh").imageConverter;
  const acceptedFormats = "PNG, JPEG";
  const fallback = "Unsupported file. Use {formats}.";

  it("maps known error codes to localized messages", () => {
    expect(
      getImageConverterErrorMessage(
        new Error(IMAGE_CONVERTER_ERROR_CODES.BLOB_FAILED),
        content,
        acceptedFormats,
        fallback,
      ),
    ).toBe(content.client.errors.blobFailed);
    expect(
      getImageConverterErrorMessage(
        new Error(IMAGE_CONVERTER_ERROR_CODES.INVALID_DIMENSIONS),
        content,
        acceptedFormats,
        fallback,
      ),
    ).toBe(content.client.errors.invalidDimensions);
  });

  it("interpolates the offending format for unsupported output", () => {
    expect(
      getImageConverterErrorMessage(
        new Error(`${IMAGE_CONVERTER_ERROR_CODES.UNSUPPORTED_OUTPUT}::avif`),
        content,
        acceptedFormats,
        fallback,
      ),
    ).toBe(content.client.errors.unsupportedOutput.replace("{format}", "avif"));
  });

  it("falls back with the accepted formats for unknown errors", () => {
    expect(
      getImageConverterErrorMessage(
        new Error("something else"),
        content,
        acceptedFormats,
        fallback,
      ),
    ).toBe("Unsupported file. Use PNG, JPEG.");
    expect(
      getImageConverterErrorMessage(
        "not an error",
        content,
        acceptedFormats,
        fallback,
      ),
    ).toBe("Unsupported file. Use PNG, JPEG.");
  });
});

describe("HEIC detection and normalization", () => {
  function makeFile(name: string, type: string): File {
    return new File([new Uint8Array([1, 2, 3])], name, { type });
  }

  it("detects HEIC by MIME type", () => {
    expect(isHeicFile(makeFile("x", "image/heic"))).toBe(true);
    expect(isHeicFile(makeFile("x", "image/heif"))).toBe(true);
    expect(isHeicFile(makeFile("x", "image/heic-sequence"))).toBe(true);
  });

  it("detects HEIC by extension when the MIME type is missing", () => {
    expect(isHeicFile(makeFile("IMG_1234.HEIC", ""))).toBe(true);
    expect(isHeicFile(makeFile("photo.heif", ""))).toBe(true);
  });

  it("rejects non-HEIC files", () => {
    expect(isHeicFile(makeFile("a.png", "image/png"))).toBe(false);
    expect(isHeicFile(makeFile("notes.txt", "text/plain"))).toBe(false);
  });

  it("accepts canvas-native and HEIC sources, rejects others", () => {
    expect(isAcceptedImageFile(makeFile("a.png", "image/png"))).toBe(true);
    expect(isAcceptedImageFile(makeFile("a.jpg", "image/jpeg"))).toBe(true);
    expect(isAcceptedImageFile(makeFile("a.webp", "image/webp"))).toBe(true);
    expect(isAcceptedImageFile(makeFile("a.heic", ""))).toBe(true);
    expect(isAcceptedImageFile(makeFile("a.bmp", "image/bmp"))).toBe(false);
  });

  it("exposes HEIC alongside PNG in the file input accept list", () => {
    expect(FILE_INPUT_ACCEPT).toContain("image/heic");
    expect(FILE_INPUT_ACCEPT).toContain(".heic");
    expect(FILE_INPUT_ACCEPT).toContain("image/png");
  });

  it("returns non-HEIC files unchanged without decoding", async () => {
    const file = makeFile("a.png", "image/png");
    expect(await normalizeSourceFile(file)).toBe(file);
  });

  it("decodes HEIC to a JPEG file, preserving the base name", async () => {
    const result = await normalizeSourceFile(
      makeFile("IMG_0001.heic", "image/heic"),
    );
    expect(result.name).toBe("IMG_0001.jpg");
    expect(result.type).toBe("image/jpeg");
  });

  it("maps HEIC decode failures to IMAGE_READ_FAILED", async () => {
    const { heicTo } = await import("heic-to");
    vi.mocked(heicTo).mockRejectedValueOnce(new Error("boom"));
    await expect(
      normalizeSourceFile(makeFile("bad.heic", "image/heic")),
    ).rejects.toThrow(IMAGE_CONVERTER_ERROR_CODES.IMAGE_READ_FAILED);
  });
});
