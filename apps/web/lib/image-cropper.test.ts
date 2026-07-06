import { describe, expect, it } from "vitest";
import {
  ASPECT_PRESETS,
  buildCropOutputFilename,
  computeCropPixelRect,
  getAspectPresetValue,
  getCenteredCrop,
} from "@/lib/image-cropper";

describe("computeCropPixelRect", () => {
  it("100% 选框恰好覆盖全图", () => {
    const rect = computeCropPixelRect({
      crop: { height: 100, width: 100, x: 0, y: 0 },
      naturalHeight: 3024,
      naturalWidth: 4032,
    });

    expect(rect).toEqual({ sHeight: 3024, sWidth: 4032, sx: 0, sy: 0 });
  });

  it("非整除尺寸 round 后仍不越界", () => {
    const rect = computeCropPixelRect({
      crop: { height: 33.333, width: 33.333, x: 33.333, y: 33.333 },
      naturalHeight: 1001,
      naturalWidth: 1003,
    });

    expect(rect.sx + rect.sWidth).toBeLessThanOrEqual(1003);
    expect(rect.sy + rect.sHeight).toBeLessThanOrEqual(1001);
    expect(rect.sWidth).toBeGreaterThan(0);
    expect(rect.sHeight).toBeGreaterThan(0);
  });

  it("浮点越界时把宽度钳回图内", () => {
    const rect = computeCropPixelRect({
      crop: { height: 10, width: 1.2, x: 99.5, y: 0 },
      naturalHeight: 1000,
      naturalWidth: 1000,
    });

    expect(rect.sx).toBeLessThanOrEqual(999);
    expect(rect.sx + rect.sWidth).toBeLessThanOrEqual(1000);
    expect(rect.sWidth).toBeGreaterThanOrEqual(1);
  });

  it("宽高 round 后为 0 时钳到 1", () => {
    const rect = computeCropPixelRect({
      crop: { height: 0.01, width: 0.01, x: 0, y: 0 },
      naturalHeight: 1000,
      naturalWidth: 1000,
    });

    expect(rect.sWidth).toBe(1);
    expect(rect.sHeight).toBe(1);
  });

  it("负值输入钳到 0（防御性）", () => {
    const rect = computeCropPixelRect({
      crop: { height: 50, width: 50, x: -5, y: -5 },
      naturalHeight: 1000,
      naturalWidth: 1000,
    });

    expect(rect.sx).toBe(0);
    expect(rect.sy).toBe(0);
  });
});

describe("getCenteredCrop", () => {
  it("自由模式返回居中 80%", () => {
    const crop = getCenteredCrop({
      aspect: null,
      naturalHeight: 1080,
      naturalWidth: 1920,
    });

    expect(crop).toEqual({ height: 80, width: 80, x: 10, y: 10 });
  });

  it("1:1 在横图上得到居中正方形且不越界", () => {
    const crop = getCenteredCrop({
      aspect: 1,
      naturalHeight: 1080,
      naturalWidth: 1920,
    });

    const widthPx = (crop.width / 100) * 1920;
    const heightPx = (crop.height / 100) * 1080;

    expect(crop.height).toBe(90);
    expect(Math.abs(widthPx - heightPx)).toBeLessThanOrEqual(0.001);
    expect(crop.x + crop.width).toBeLessThanOrEqual(100);
    expect(crop.y + crop.height).toBeLessThanOrEqual(100);
    // 居中
    expect(crop.x).toBeCloseTo((100 - crop.width) / 2);
    expect(crop.y).toBeCloseTo((100 - crop.height) / 2);
  });

  it("16:9 在竖图上宽度方向占满并垂直居中", () => {
    const crop = getCenteredCrop({
      aspect: 16 / 9,
      naturalHeight: 1920,
      naturalWidth: 1080,
    });

    const widthPx = (crop.width / 100) * 1080;
    const heightPx = (crop.height / 100) * 1920;

    expect(crop.width).toBe(90);
    expect(widthPx / heightPx).toBeCloseTo(16 / 9);
    expect(crop.y).toBeCloseTo((100 - crop.height) / 2);
  });

  it("居中选框换算像素后与目标比例误差不超过 1px", () => {
    for (const preset of ASPECT_PRESETS) {
      if (preset.value === null) {
        continue;
      }

      const naturalWidth = 4032;
      const naturalHeight = 3024;
      const crop = getCenteredCrop({
        aspect: preset.value,
        naturalHeight,
        naturalWidth,
      });
      const rect = computeCropPixelRect({ crop, naturalHeight, naturalWidth });
      const expectedHeight = rect.sWidth / preset.value;

      expect(Math.abs(rect.sHeight - expectedHeight)).toBeLessThanOrEqual(1);
    }
  });
});

describe("getAspectPresetValue", () => {
  it("free 返回 null，square 返回 1", () => {
    expect(getAspectPresetValue("free")).toBeNull();
    expect(getAspectPresetValue("square")).toBe(1);
  });
});

describe("buildCropOutputFilename", () => {
  it("替换扩展名并追加 -cropped 后缀", () => {
    expect(buildCropOutputFilename("photo.jpg", "image/webp")).toBe(
      "photo-cropped.webp",
    );
    expect(buildCropOutputFilename("photo.PNG", "image/jpeg")).toBe(
      "photo-cropped.jpg",
    );
  });

  it("无扩展名或空名时兜底为 image", () => {
    expect(buildCropOutputFilename("photo", "image/png")).toBe(
      "photo-cropped.png",
    );
    expect(buildCropOutputFilename(".png", "image/png")).toBe(
      "image-cropped.png",
    );
  });
});
