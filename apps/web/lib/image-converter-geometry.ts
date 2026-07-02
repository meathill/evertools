export const CROP_VERTICALS = ["top", "middle", "bottom"] as const;
export const CROP_HORIZONTALS = ["left", "center", "right"] as const;

export type CropVertical = (typeof CROP_VERTICALS)[number];
export type CropHorizontal = (typeof CROP_HORIZONTALS)[number];
export type CropAnchor = { horizontal: CropHorizontal; vertical: CropVertical };

export type CropSourceRect = {
  sHeight: number;
  sWidth: number;
  sx: number;
  sy: number;
};

type DimensionField = "height" | "width";

type DimensionToken =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "value"; value: number };

export function parseDimensionToken(input: string): DimensionToken {
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

export function scaleByRatio(
  value: number,
  source: number,
  target: number,
): number {
  return Math.max(1, Math.round((value / source) * target));
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
