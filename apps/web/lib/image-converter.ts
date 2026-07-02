import {
  type CropAnchor,
  computeCropSourceRect,
  parseDimensionToken,
  scaleByRatio,
} from "@/lib/image-converter-geometry";
import type { LocaleContent } from "@/messages/types";

export {
  CROP_HORIZONTALS,
  CROP_VERTICALS,
  type CropAnchor,
  type CropHorizontal,
  type CropSourceRect,
  type CropVertical,
  computeCropSourceRect,
  getSyncedDimensionValue,
} from "@/lib/image-converter-geometry";

export const DEFAULT_QUALITY = 82;

export const IMAGE_CONVERTER_ERROR_CODES = {
  BLOB_FAILED: "BLOB_FAILED",
  CANVAS_UNSUPPORTED: "CANVAS_UNSUPPORTED",
  IMAGE_READ_FAILED: "IMAGE_READ_FAILED",
  INVALID_DIMENSIONS: "INVALID_DIMENSIONS",
  UNSUPPORTED_OUTPUT: "UNSUPPORTED_OUTPUT",
} as const;

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const OUTPUT_FORMATS = [
  {
    extension: "png",
    key: "png",
    value: "image/png",
  },
  {
    extension: "jpg",
    key: "jpg",
    value: "image/jpeg",
  },
  {
    extension: "webp",
    key: "webp",
    value: "image/webp",
  },
] as const;

export const RESIZE_MODES = ["lock", "stretch", "crop"] as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[number]["value"];
export type OutputFormatKey = (typeof OUTPUT_FORMATS)[number]["key"];
export type ResizeMode = (typeof RESIZE_MODES)[number];
export type ImageConverterErrorCode =
  (typeof IMAGE_CONVERTER_ERROR_CODES)[keyof typeof IMAGE_CONVERTER_ERROR_CODES];

export type ResolveTargetDimensionsInput = {
  heightInput: string;
  isAspectLocked: boolean;
  originalHeight: number;
  originalWidth: number;
  widthInput: string;
};

export type ReadImageResult = {
  previewUrl: string;
  type: string;
  width: number;
  height: number;
};

export type ConvertImageInput = {
  crop?: { anchor: CropAnchor };
  file: File;
  format: OutputFormat;
  height: number;
  quality: number;
  width: number;
};

export type ResultImage = {
  blob: Blob;
  cropAnchor: CropAnchor | null;
  fileName: string;
  format: OutputFormat;
  height: number;
  previewUrl: string;
  quality: number;
  resizeMode: ResizeMode;
  size: number;
  width: number;
};

const acceptedImageTypeSet = new Set<string>(ACCEPTED_IMAGE_TYPES);

export function isAcceptedImageType(type: string): boolean {
  return acceptedImageTypeSet.has(type);
}

// HEIC/HEIF 系列 MIME。浏览器原生 <img> 只有 Safari 能解码 HEIC，
// 因此这些类型不进 ACCEPTED_IMAGE_TYPES（canvas 原生类型），而是先经
// normalizeSourceFile 解码成标准位图再进入既有管线。
const HEIC_MIME_TYPES = new Set<string>([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

const HEIC_EXTENSION_PATTERN = /\.(heic|heif)$/i;

// HEIC 在很多系统上 file.type 为空，必须用后缀兜底判断。
export function isHeicFile(file: File): boolean {
  return (
    HEIC_MIME_TYPES.has(file.type.toLowerCase()) ||
    HEIC_EXTENSION_PATTERN.test(file.name)
  );
}

export function isAcceptedImageFile(file: File): boolean {
  return isAcceptedImageType(file.type) || isHeicFile(file);
}

// 给 <input accept> 用：同时带 MIME 与后缀，确保各 OS 文件选择器都能筛到 .heic。
export const FILE_INPUT_ACCEPT = [
  ...ACCEPTED_IMAGE_TYPES,
  "image/heic",
  "image/heif",
  ".heic",
  ".heif",
].join(",");

// 把 HEIC 归一化成浏览器可解码的 JPEG File；非 HEIC 原样返回（零开销，不触发动态 import）。
// 解码在 heic-to 的内部 worker 中完成（WASM 经 Blob 内联，无需额外资源配置）。
export async function normalizeSourceFile(file: File): Promise<File> {
  if (!isHeicFile(file)) {
    return file;
  }

  try {
    const { heicTo } = await import("heic-to");
    const blob = await heicTo({
      blob: file,
      quality: 0.92,
      type: "image/jpeg",
    });
    const baseName = file.name.replace(/\.[^.]+$/, "").trim() || "image";

    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } catch {
    throw createImageConverterError(
      IMAGE_CONVERTER_ERROR_CODES.IMAGE_READ_FAILED,
    );
  }
}

export function supportsQuality(format: OutputFormat): boolean {
  return format !== "image/png";
}

export function clampQuality(value: number): number {
  return Math.min(100, Math.max(1, Math.round(value)));
}

export function getDefaultOutputFormat(type?: string): OutputFormat {
  if (type === "image/jpeg" || type === "image/png" || type === "image/webp") {
    return type;
  }

  return "image/png";
}

export function getOutputExtension(format: OutputFormat): string {
  const match = OUTPUT_FORMATS.find((item) => item.value === format);

  return match?.extension ?? "png";
}

export function getOutputFormatKey(format: OutputFormat): OutputFormatKey {
  const match = OUTPUT_FORMATS.find((item) => item.value === format);

  return match?.key ?? "png";
}

export function parseImageConverterError(error: unknown): {
  code: ImageConverterErrorCode | null;
  detail?: string;
} {
  if (!(error instanceof Error)) {
    return { code: null };
  }

  const [code, detail] = error.message.split("::");

  if (
    !Object.values(IMAGE_CONVERTER_ERROR_CODES).includes(
      code as ImageConverterErrorCode,
    )
  ) {
    return { code: null };
  }

  return {
    code: code as ImageConverterErrorCode,
    detail,
  };
}

export function getCurrentTargetDimensions(input: {
  heightInput: string;
  isAspectLocked: boolean;
  originalHeight?: number;
  originalWidth?: number;
  widthInput: string;
}): { height: number; width: number } | null {
  if (!input.originalHeight || !input.originalWidth) {
    return null;
  }

  try {
    return resolveTargetDimensions({
      heightInput: input.heightInput,
      isAspectLocked: input.isAspectLocked,
      originalHeight: input.originalHeight,
      originalWidth: input.originalWidth,
      widthInput: input.widthInput,
    });
  } catch {
    return null;
  }
}

export function getImageConverterErrorMessage(
  error: unknown,
  content: LocaleContent["imageConverter"],
  acceptedFormatsText: string,
  fallbackMessage: string,
): string {
  const parsed = parseImageConverterError(error);

  switch (parsed.code) {
    case IMAGE_CONVERTER_ERROR_CODES.BLOB_FAILED:
      return content.client.errors.blobFailed;
    case IMAGE_CONVERTER_ERROR_CODES.CANVAS_UNSUPPORTED:
      return content.client.errors.canvasUnsupported;
    case IMAGE_CONVERTER_ERROR_CODES.IMAGE_READ_FAILED:
      return content.client.errors.imageBroken;
    case IMAGE_CONVERTER_ERROR_CODES.INVALID_DIMENSIONS:
      return content.client.errors.invalidDimensions;
    case IMAGE_CONVERTER_ERROR_CODES.UNSUPPORTED_OUTPUT:
      return content.client.errors.unsupportedOutput.replace(
        "{format}",
        parsed.detail ?? "",
      );
    default:
      return fallbackMessage.replace("{formats}", acceptedFormatsText);
  }
}

export function buildOutputFilename(
  sourceName: string,
  format: OutputFormat,
): string {
  const extension = getOutputExtension(format);
  const baseName = sourceName.replace(/\.[^.]+$/, "").trim() || "image";

  return `${baseName}-converted.${extension}`;
}

export function resolveTargetDimensions(input: ResolveTargetDimensionsInput): {
  height: number;
  width: number;
} {
  const widthToken = parseDimensionToken(input.widthInput);
  const heightToken = parseDimensionToken(input.heightInput);

  if (widthToken.kind === "invalid" || heightToken.kind === "invalid") {
    throw createImageConverterError(
      IMAGE_CONVERTER_ERROR_CODES.INVALID_DIMENSIONS,
    );
  }

  if (input.isAspectLocked) {
    if (widthToken.kind === "value") {
      return {
        height: scaleByRatio(
          widthToken.value,
          input.originalWidth,
          input.originalHeight,
        ),
        width: widthToken.value,
      };
    }

    if (heightToken.kind === "value") {
      return {
        height: heightToken.value,
        width: scaleByRatio(
          heightToken.value,
          input.originalHeight,
          input.originalWidth,
        ),
      };
    }

    return {
      height: input.originalHeight,
      width: input.originalWidth,
    };
  }

  return {
    height:
      heightToken.kind === "value" ? heightToken.value : input.originalHeight,
    width: widthToken.kind === "value" ? widthToken.value : input.originalWidth,
  };
}

export async function readImageFile(file: File): Promise<ReadImageResult> {
  const previewUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(previewUrl);

    return {
      height: image.naturalHeight,
      previewUrl,
      type: file.type,
      width: image.naturalWidth,
    };
  } catch (error) {
    URL.revokeObjectURL(previewUrl);
    throw error;
  }
}

export async function convertImageFile(
  input: ConvertImageInput,
): Promise<Blob> {
  const sourceUrl = URL.createObjectURL(input.file);

  try {
    const image = await loadImage(sourceUrl);
    const canvas = document.createElement("canvas");

    canvas.width = input.width;
    canvas.height = input.height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw createImageConverterError(
        IMAGE_CONVERTER_ERROR_CODES.CANVAS_UNSUPPORTED,
      );
    }

    if (input.format === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, input.width, input.height);
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    if (input.crop) {
      const rect = computeCropSourceRect({
        anchor: input.crop.anchor,
        sourceHeight: image.naturalHeight,
        sourceWidth: image.naturalWidth,
        targetHeight: input.height,
        targetWidth: input.width,
      });

      context.drawImage(
        image,
        rect.sx,
        rect.sy,
        rect.sWidth,
        rect.sHeight,
        0,
        0,
        input.width,
        input.height,
      );
    } else {
      context.drawImage(image, 0, 0, input.width, input.height);
    }

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

function loadImage(sourceUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.decoding = "async";
    image.onerror = () => {
      reject(
        createImageConverterError(
          IMAGE_CONVERTER_ERROR_CODES.IMAGE_READ_FAILED,
        ),
      );
    };
    image.onload = () => {
      resolve(image);
    };
    image.src = sourceUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: OutputFormat,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            createImageConverterError(IMAGE_CONVERTER_ERROR_CODES.BLOB_FAILED),
          );
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

function createImageConverterError(
  code: ImageConverterErrorCode,
  detail?: string,
): Error {
  return new Error(detail ? `${code}::${detail}` : code);
}
