import { describe, expect, it } from "vitest";
import {
  IMAGE_CONVERTER_ERROR_CODES,
  buildOutputFilename,
  clampQuality,
  formatBytes,
  getDefaultOutputFormat,
  getSyncedDimensionValue,
  resolveTargetDimensions,
} from "@/lib/image-converter";

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

  it("formats bytes for human reading", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1_536)).toBe("1.5 KB");
    expect(formatBytes(12 * 1024 * 1024)).toBe("12 MB");
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
