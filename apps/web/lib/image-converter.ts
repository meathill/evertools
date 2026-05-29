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
export const CROP_VERTICALS = ["top", "middle", "bottom"] as const;
export const CROP_HORIZONTALS = ["left", "center", "right"] as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[number]["value"];
export type OutputFormatKey = (typeof OUTPUT_FORMATS)[number]["key"];
export type ResizeMode = (typeof RESIZE_MODES)[number];
export type CropVertical = (typeof CROP_VERTICALS)[number];
export type CropHorizontal = (typeof CROP_HORIZONTALS)[number];
export type CropAnchor = { horizontal: CropHorizontal; vertical: CropVertical };
export type ImageConverterErrorCode =
  (typeof IMAGE_CONVERTER_ERROR_CODES)[keyof typeof IMAGE_CONVERTER_ERROR_CODES];

type DimensionField = "height" | "width";

type DimensionToken =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "value"; value: number };

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

export type CropSourceRect = {
  sHeight: number;
  sWidth: number;
  sx: number;
  sy: number;
};

const acceptedImageTypeSet = new Set<string>(ACCEPTED_IMAGE_TYPES);

export function isAcceptedImageType(type: string): boolean {
  return acceptedImageTypeSet.has(type);
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

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
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

export function buildOutputFilename(
  sourceName: string,
  format: OutputFormat,
): string {
  const extension = getOutputExtension(format);
  const baseName = sourceName.replace(/\.[^.]+$/, "").trim() || "image";

  return `${baseName}-converted.${extension}`;
}

export function getSyncedDimensionValue(options: {
  changedField: DimensionField;
  nextValue: string;
  originalHeight: number;
  originalWidth: number;
}): string {
  const token = parseDimensionToken(options.nextValue);

  if (token.kind !== "value") {
    return "";
  }

  if (options.changedField === "width") {
    return String(
      scaleByRatio(token.value, options.originalWidth, options.originalHeight),
    );
  }

  return String(
    scaleByRatio(token.value, options.originalHeight, options.originalWidth),
  );
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

export function computeCropSourceRect(input: {
  anchor: CropAnchor;
  sourceHeight: number;
  sourceWidth: number;
  targetHeight: number;
  targetWidth: number;
}): CropSourceRect {
  const scale = Math.max(
    input.targetWidth / input.sourceWidth,
    input.targetHeight / input.sourceHeight,
  );

  const sWidth = Math.min(
    input.sourceWidth,
    Math.round(input.targetWidth / scale),
  );
  const sHeight = Math.min(
    input.sourceHeight,
    Math.round(input.targetHeight / scale),
  );

  return {
    sHeight,
    sWidth,
    sx: resolveCropOffset(input.anchor.horizontal, input.sourceWidth, sWidth),
    sy: resolveCropOffset(input.anchor.vertical, input.sourceHeight, sHeight),
  };
}

function resolveCropOffset(
  anchor: CropHorizontal | CropVertical,
  sourceSize: number,
  cropSize: number,
): number {
  const maxOffset = sourceSize - cropSize;

  if (anchor === "left" || anchor === "top") {
    return 0;
  }

  if (anchor === "right" || anchor === "bottom") {
    return maxOffset;
  }

  return Math.min(maxOffset, Math.max(0, Math.round(maxOffset / 2)));
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

function parseDimensionToken(input: string): DimensionToken {
  const value = input.trim();

  if (value === "") {
    return { kind: "empty" };
  }

  if (!/^\d+$/.test(value)) {
    return { kind: "invalid" };
  }

  const parsed = Number.parseInt(value, 10);

  if (parsed <= 0) {
    return { kind: "invalid" };
  }

  return { kind: "value", value: parsed };
}

function scaleByRatio(value: number, source: number, target: number): number {
  return Math.max(1, Math.round((value / source) * target));
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
