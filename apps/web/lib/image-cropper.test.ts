import { describe, expect, it } from "vitest";
import {
  ASPECT_PRESETS,
  buildCropOutputFilename,
  computeCropPixelRect,
  getAspectPresetValue,
  getCenteredCrop,
  moveCropByPixels,
  pixelRectToPercentCrop,
  resizeCropToDimensions,
  snapCropToPixels,
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

describe("pixelRectToPercentCrop & snapCropToPixels", () => {
  it("精确将像素坐标转换为百分比", () => {
    const crop = pixelRectToPercentCrop(
      { sHeight: 500, sWidth: 1000, sx: 200, sy: 100 },
      2000,
      1000,
    );

    expect(crop).toEqual({
      height: 50,
      width: 50,
      x: 10,
      y: 10,
    });
  });

  it("浮点百分比通过 snapCropToPixels 强制吸附到整像素", () => {
    const rawCrop = {
      height: 33.33333,
      width: 33.33333,
      x: 12.34567,
      y: 12.34567,
    };
    const snapped = snapCropToPixels(rawCrop, 1000, 1000);
    const rect = computeCropPixelRect({
      crop: snapped,
      naturalHeight: 1000,
      naturalWidth: 1000,
    });

    expect(Number.isInteger(rect.sx)).toBe(true);
    expect(Number.isInteger(rect.sy)).toBe(true);
    expect(Number.isInteger(rect.sWidth)).toBe(true);
    expect(Number.isInteger(rect.sHeight)).toBe(true);
    expect(rect.sx).toBe(123);
    expect(rect.sy).toBe(123);
    expect(rect.sWidth).toBe(333);
    expect(rect.sHeight).toBe(333);
  });
});

describe("moveCropByPixels", () => {
  const rect = { sHeight: 400, sWidth: 600, sx: 100, sy: 100 };
  const naturalWidth = 1000;
  const naturalHeight = 1000;

  it("支持 1px 平移", () => {
    const moved = moveCropByPixels({
      dx: 1,
      dy: -1,
      naturalHeight,
      naturalWidth,
      rect,
    });

    expect(moved).toEqual({
      sHeight: 400,
      sWidth: 600,
      sx: 101,
      sy: 99,
    });
  });

  it("支持 10px 平移", () => {
    const moved = moveCropByPixels({
      dx: -10,
      dy: 10,
      naturalHeight,
      naturalWidth,
      rect,
    });

    expect(moved).toEqual({
      sHeight: 400,
      sWidth: 600,
      sx: 90,
      sy: 110,
    });
  });

  it("左上边界阻挡，不越界为负数", () => {
    const moved = moveCropByPixels({
      dx: -200,
      dy: -200,
      naturalHeight,
      naturalWidth,
      rect,
    });

    expect(moved.sx).toBe(0);
    expect(moved.sy).toBe(0);
  });

  it("右下边界阻挡，不超过原图范围", () => {
    const moved = moveCropByPixels({
      dx: 800,
      dy: 800,
      naturalHeight,
      naturalWidth,
      rect,
    });

    expect(moved.sx).toBe(400); // 1000 - 600
    expect(moved.sy).toBe(600); // 1000 - 400
  });
});

describe("resizeCropToDimensions", () => {
  const naturalWidth = 2000;
  const naturalHeight = 1000;
  const rect = { sHeight: 400, sWidth: 600, sx: 100, sy: 100 };

  it("自由模式下可单独修改宽度，高度保持不变", () => {
    const next = resizeCropToDimensions({
      aspect: null,
      naturalHeight,
      naturalWidth,
      rect,
      width: 800,
    });

    expect(next).toEqual({
      sHeight: 400,
      sWidth: 800,
      sx: 100,
      sy: 100,
    });
  });

  it("自由模式下可单独修改高度，宽度保持不变", () => {
    const next = resizeCropToDimensions({
      aspect: null,
      height: 500,
      naturalHeight,
      naturalWidth,
      rect,
    });

    expect(next).toEqual({
      sHeight: 500,
      sWidth: 600,
      sx: 100,
      sy: 100,
    });
  });

  it("1:1 比例下修改宽度，高度自动等比联动", () => {
    const next = resizeCropToDimensions({
      aspect: 1,
      naturalHeight,
      naturalWidth,
      rect,
      width: 500,
    });

    expect(next.sWidth).toBe(500);
    expect(next.sHeight).toBe(500);
  });

  it("16:9 比例下修改高度，宽度自动联动", () => {
    const next = resizeCropToDimensions({
      aspect: 16 / 9,
      height: 450,
      naturalHeight,
      naturalWidth,
      rect,
    });

    expect(next.sHeight).toBe(450);
    expect(next.sWidth).toBe(800); // 450 * (16/9) = 800
  });

  it("输入尺寸过大导致越界时，自动推回图片内部", () => {
    const nearEdgeRect = { sHeight: 200, sWidth: 300, sx: 1800, sy: 850 };
    const next = resizeCropToDimensions({
      aspect: null,
      height: 300,
      naturalHeight,
      naturalWidth,
      rect: nearEdgeRect,
      width: 500,
    });

    expect(next.sWidth).toBe(500);
    expect(next.sHeight).toBe(300);
    expect(next.sx).toBe(1500); // 2000 - 500
    expect(next.sy).toBe(700); // 1000 - 300
  });

  it("输入超过原图尺寸时钳制到最大允许尺寸", () => {
    const next = resizeCropToDimensions({
      aspect: null,
      height: 5000,
      naturalHeight,
      naturalWidth,
      rect,
      width: 5000,
    });

    expect(next.sWidth).toBe(2000);
    expect(next.sHeight).toBe(1000);
    expect(next.sx).toBe(0);
    expect(next.sy).toBe(0);
  });
});
