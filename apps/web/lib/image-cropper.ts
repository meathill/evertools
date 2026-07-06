import {
  canvasToBlob,
  clampQuality,
  createImageConverterError,
  getOutputExtension,
  IMAGE_CONVERTER_ERROR_CODES,
  loadImage,
  type OutputFormat,
  supportsQuality,
} from "@/lib/image-converter";
import type { CropSourceRect } from "@/lib/image-converter-geometry";

// 比例预设：value 为 null 表示自由裁切（不锁定比例）。
export const ASPECT_PRESETS = [
  { key: "free", value: null },
  { key: "square", value: 1 },
  { key: "fourThree", value: 4 / 3 },
  { key: "threeTwo", value: 3 / 2 },
  { key: "sixteenNine", value: 16 / 9 },
  { key: "nineSixteen", value: 9 / 16 },
] as const;

export type AspectPresetKey = (typeof ASPECT_PRESETS)[number]["key"];

export function getAspectPresetValue(key: AspectPresetKey): number | null {
  return ASPECT_PRESETS.find((preset) => preset.key === key)?.value ?? null;
}

// 与 react-image-crop 的 PercentCrop 对齐（单位 0-100），但自持类型，
// 避免 lib 纯函数层依赖组件库。
export type PercentCropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// 百分比选框 → 源图像素矩形。round 之后钳制到图内，保证
// sx/sy >= 0、sWidth/sHeight >= 1 且不越界，可直接交给 drawImage。
export function computeCropPixelRect(input: {
  crop: PercentCropRect;
  naturalHeight: number;
  naturalWidth: number;
}): CropSourceRect {
  const { crop, naturalHeight, naturalWidth } = input;

  const sx = Math.min(
    Math.max(0, Math.round((crop.x / 100) * naturalWidth)),
    naturalWidth - 1,
  );
  const sy = Math.min(
    Math.max(0, Math.round((crop.y / 100) * naturalHeight)),
    naturalHeight - 1,
  );
  const sWidth = Math.min(
    Math.max(1, Math.round((crop.width / 100) * naturalWidth)),
    naturalWidth - sx,
  );
  const sHeight = Math.min(
    Math.max(1, Math.round((crop.height / 100) * naturalHeight)),
    naturalHeight - sy,
  );

  return { sHeight, sWidth, sx, sy };
}

// 初始/切换比例时的居中选框。自由模式取居中 80%；
// 带比例时先在图内 fit 出该比例的最大矩形，再取其 90% 居中。
export function getCenteredCrop(input: {
  aspect: number | null;
  naturalHeight: number;
  naturalWidth: number;
}): PercentCropRect {
  const { aspect, naturalHeight, naturalWidth } = input;

  if (aspect === null) {
    return { height: 80, width: 80, x: 10, y: 10 };
  }

  const sourceAspect = naturalWidth / naturalHeight;
  let widthPercent: number;
  let heightPercent: number;

  if (aspect >= sourceAspect) {
    // 目标比例比原图更宽：宽度方向占满，按比例反推高度。
    widthPercent = 90;
    heightPercent =
      (((widthPercent / 100) * naturalWidth) / aspect / naturalHeight) * 100;
  } else {
    heightPercent = 90;
    widthPercent =
      (((heightPercent / 100) * naturalHeight * aspect) / naturalWidth) * 100;
  }

  return {
    height: heightPercent,
    width: widthPercent,
    x: (100 - widthPercent) / 2,
    y: (100 - heightPercent) / 2,
  };
}

export function buildCropOutputFilename(
  sourceName: string,
  format: OutputFormat,
): string {
  const extension = getOutputExtension(format);
  const baseName = sourceName.replace(/\.[^.]+$/, "").trim() || "image";

  return `${baseName}-cropped.${extension}`;
}

export type CropImageInput = {
  file: File;
  format: OutputFormat;
  quality: number;
  rect: CropSourceRect;
};

// 按像素矩形裁切并导出。输出尺寸即选区尺寸，不做缩放。
export async function cropImageFile(input: CropImageInput): Promise<Blob> {
  const sourceUrl = URL.createObjectURL(input.file);

  try {
    const image = await loadImage(sourceUrl);
    const canvas = document.createElement("canvas");

    canvas.width = input.rect.sWidth;
    canvas.height = input.rect.sHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw createImageConverterError(
        IMAGE_CONVERTER_ERROR_CODES.CANVAS_UNSUPPORTED,
      );
    }

    if (input.format === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, input.rect.sWidth, input.rect.sHeight);
    }

    context.drawImage(
      image,
      input.rect.sx,
      input.rect.sy,
      input.rect.sWidth,
      input.rect.sHeight,
      0,
      0,
      input.rect.sWidth,
      input.rect.sHeight,
    );

    const blob = await canvasToBlob(
      canvas,
      input.format,
      supportsQuality(input.format)
        ? clampQuality(input.quality) / 100
        : undefined,
    );

    if (input.format !== "image/png" && blob.type !== input.format) {
      throw createImageConverterError(
        IMAGE_CONVERTER_ERROR_CODES.UNSUPPORTED_OUTPUT,
        getOutputExtension(input.format).toUpperCase(),
      );
    }

    return blob;
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}
