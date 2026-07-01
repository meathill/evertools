import { describe, expect, it } from "vitest";
import type { ResultImage } from "@/lib/image-converter";
import {
  type BatchConversionSettings,
  type BatchItem,
  dedupeZipEntryName,
  MAX_BATCH_SIZE,
  selectItemsNeedingConversion,
  splitAcceptedBatchFiles,
} from "@/lib/image-converter-batch";

function makeFile(name: string, type: string): File {
  return new File([new Uint8Array([1, 2, 3])], name, { type });
}

function makeResult(overrides: Partial<ResultImage> = {}): ResultImage {
  return {
    blob: new Blob([new Uint8Array([1])], { type: "image/png" }),
    cropAnchor: null,
    fileName: "source-converted.png",
    format: "image/png",
    height: 800,
    previewUrl: "blob:result",
    quality: 82,
    resizeMode: "lock",
    size: 2048,
    width: 1600,
    ...overrides,
  };
}

function makeBatchItem(overrides: Partial<BatchItem> = {}): BatchItem {
  return {
    errorMessage: null,
    file: makeFile("source.png", "image/png"),
    height: 800,
    id: "item-1",
    originalName: "source.png",
    previewUrl: "blob:preview",
    result: null,
    size: 1024,
    status: "pending",
    type: "image/png",
    width: 1600,
    ...overrides,
  };
}

function makeSettings(
  overrides: Partial<BatchConversionSettings> = {},
): BatchConversionSettings {
  return {
    cropAnchor: { horizontal: "center", vertical: "middle" },
    heightInput: "",
    isAspectLocked: true,
    outputFormat: "image/png",
    quality: 82,
    resizeMode: "lock",
    widthInput: "",
    ...overrides,
  };
}

describe("splitAcceptedBatchFiles", () => {
  it("accepts all files when total stays under the cap", () => {
    const files = [
      makeFile("a.png", "image/png"),
      makeFile("b.jpg", "image/jpeg"),
    ];

    const result = splitAcceptedBatchFiles({ existingCount: 0, files });

    expect(result.accepted).toEqual(files);
    expect(result.rejectedOverCap).toEqual([]);
    expect(result.rejectedUnsupported).toEqual([]);
  });

  it("routes unsupported formats to rejectedUnsupported while keeping valid files accepted", () => {
    const valid = makeFile("a.png", "image/png");
    const invalid = makeFile("a.bmp", "image/bmp");

    const result = splitAcceptedBatchFiles({
      existingCount: 0,
      files: [valid, invalid],
    });

    expect(result.accepted).toEqual([valid]);
    expect(result.rejectedUnsupported).toEqual([invalid]);
  });

  it("truncates accepted files once the cap is reached", () => {
    const files = Array.from({ length: MAX_BATCH_SIZE + 5 }, (_, index) =>
      makeFile(`img-${index}.png`, "image/png"),
    );

    const result = splitAcceptedBatchFiles({ existingCount: 0, files });

    expect(result.accepted).toHaveLength(MAX_BATCH_SIZE);
    expect(result.rejectedOverCap).toHaveLength(5);
  });

  it("rejects every new file when the existing batch already fills the cap", () => {
    const files = [
      makeFile("a.png", "image/png"),
      makeFile("b.png", "image/png"),
    ];

    const result = splitAcceptedBatchFiles({
      existingCount: MAX_BATCH_SIZE,
      files,
    });

    expect(result.accepted).toEqual([]);
    expect(result.rejectedOverCap).toEqual(files);
  });

  it("buckets unsupported-format and over-cap rejections independently within the same drop", () => {
    const validFiles = Array.from({ length: MAX_BATCH_SIZE }, (_, index) =>
      makeFile(`img-${index}.png`, "image/png"),
    );
    const overflow = makeFile("overflow.png", "image/png");
    const invalid = makeFile("bad.bmp", "image/bmp");

    const result = splitAcceptedBatchFiles({
      existingCount: 0,
      files: [...validFiles, overflow, invalid],
    });

    expect(result.accepted).toHaveLength(MAX_BATCH_SIZE);
    expect(result.rejectedOverCap).toEqual([overflow]);
    expect(result.rejectedUnsupported).toEqual([invalid]);
  });

  it("accepts HEIC files alongside canvas-native formats", () => {
    const heic = makeFile("a.heic", "");

    const result = splitAcceptedBatchFiles({ existingCount: 0, files: [heic] });

    expect(result.accepted).toEqual([heic]);
  });
});

describe("dedupeZipEntryName", () => {
  it("returns the desired name unchanged when it is not already used", () => {
    expect(
      dedupeZipEntryName({ desiredName: "photo.jpg", usedNames: new Set() }),
    ).toBe("photo.jpg");
  });

  it("appends -2 on the first collision", () => {
    expect(
      dedupeZipEntryName({
        desiredName: "photo.jpg",
        usedNames: new Set(["photo.jpg"]),
      }),
    ).toBe("photo-2.jpg");
  });

  it("appends -3 when -2 is already taken too", () => {
    expect(
      dedupeZipEntryName({
        desiredName: "photo.jpg",
        usedNames: new Set(["photo.jpg", "photo-2.jpg"]),
      }),
    ).toBe("photo-3.jpg");
  });

  it("keeps the extension after the last dot for multi-dot filenames", () => {
    expect(
      dedupeZipEntryName({
        desiredName: "photo.v2-converted.jpg",
        usedNames: new Set(["photo.v2-converted.jpg"]),
      }),
    ).toBe("photo.v2-converted-2.jpg");
  });

  it("does not leave a stray dot for extensionless filenames", () => {
    expect(
      dedupeZipEntryName({
        desiredName: "photo",
        usedNames: new Set(["photo"]),
      }),
    ).toBe("photo-2");
  });
});

describe("selectItemsNeedingConversion", () => {
  it("returns an empty array for an empty batch", () => {
    expect(
      selectItemsNeedingConversion({ items: [], settings: makeSettings() }),
    ).toEqual([]);
  });

  it("includes pending items", () => {
    const pending = makeBatchItem({ status: "pending" });

    expect(
      selectItemsNeedingConversion({
        items: [pending],
        settings: makeSettings(),
      }),
    ).toEqual([pending]);
  });

  it("includes error items so they can be retried", () => {
    const errored = makeBatchItem({ errorMessage: "boom", status: "error" });

    expect(
      selectItemsNeedingConversion({
        items: [errored],
        settings: makeSettings(),
      }),
    ).toEqual([errored]);
  });

  it("excludes done items whose result already matches the current settings", () => {
    const done = makeBatchItem({
      height: 800,
      result: makeResult({ format: "image/png", height: 800, width: 1600 }),
      status: "done",
      width: 1600,
    });

    expect(
      selectItemsNeedingConversion({ items: [done], settings: makeSettings() }),
    ).toEqual([]);
  });

  it("includes done items whose result format differs from the current output format", () => {
    const done = makeBatchItem({
      height: 800,
      result: makeResult({ format: "image/png", height: 800, width: 1600 }),
      status: "done",
      width: 1600,
    });
    const settings = makeSettings({ outputFormat: "image/webp" });

    expect(selectItemsNeedingConversion({ items: [done], settings })).toEqual([
      done,
    ]);
  });

  it("resolves each item's target height from its own aspect ratio under a shared width setting", () => {
    const settings = makeSettings({ isAspectLocked: true, widthInput: "800" });

    // 1600x800（2:1）锁定宽度 800 时，正确目标高度是 400。
    const wideStale = makeBatchItem({
      height: 800,
      id: "wide-stale",
      result: makeResult({ height: 800, width: 800 }),
      status: "done",
      width: 1600,
    });
    const wideFresh = makeBatchItem({
      height: 800,
      id: "wide-fresh",
      result: makeResult({ height: 400, width: 800 }),
      status: "done",
      width: 1600,
    });

    // 900x1200（3:4）锁定宽度 800 时，正确目标高度是 round(800/900*1200) = 1067。
    const tallStale = makeBatchItem({
      height: 1200,
      id: "tall-stale",
      result: makeResult({ height: 1200, width: 800 }),
      status: "done",
      width: 900,
    });
    const tallFresh = makeBatchItem({
      height: 1200,
      id: "tall-fresh",
      result: makeResult({ height: 1067, width: 800 }),
      status: "done",
      width: 900,
    });

    const stale = selectItemsNeedingConversion({
      items: [wideStale, wideFresh, tallStale, tallFresh],
      settings,
    });

    expect(stale.map((item) => item.id).sort()).toEqual([
      "tall-stale",
      "wide-stale",
    ]);
  });

  it("includes done items whose resize mode differs from the current setting", () => {
    const done = makeBatchItem({
      height: 800,
      result: makeResult({ height: 800, resizeMode: "stretch", width: 1600 }),
      status: "done",
      width: 1600,
    });
    const settings = makeSettings({ resizeMode: "lock" });

    expect(selectItemsNeedingConversion({ items: [done], settings })).toEqual([
      done,
    ]);
  });

  it("only compares crop anchor when the current resize mode is crop", () => {
    const lockDone = makeBatchItem({
      height: 800,
      result: makeResult({
        cropAnchor: { horizontal: "left", vertical: "top" },
        height: 800,
        resizeMode: "lock",
        width: 1600,
      }),
      status: "done",
      width: 1600,
    });
    const lockSettings = makeSettings({
      cropAnchor: { horizontal: "right", vertical: "bottom" },
      resizeMode: "lock",
    });

    // resizeMode 不是 crop 时，裁剪锚点字段即使不同也不该判定为 stale。
    expect(
      selectItemsNeedingConversion({
        items: [lockDone],
        settings: lockSettings,
      }),
    ).toEqual([]);

    const cropDone = makeBatchItem({
      height: 800,
      result: makeResult({
        cropAnchor: { horizontal: "left", vertical: "top" },
        height: 800,
        resizeMode: "crop",
        width: 1600,
      }),
      status: "done",
      width: 1600,
    });
    const cropSettings = makeSettings({
      cropAnchor: { horizontal: "right", vertical: "bottom" },
      resizeMode: "crop",
    });

    expect(
      selectItemsNeedingConversion({
        items: [cropDone],
        settings: cropSettings,
      }),
    ).toEqual([cropDone]);
  });

  it("only treats quality changes as stale when the output format supports quality", () => {
    const pngDone = makeBatchItem({
      height: 800,
      result: makeResult({
        format: "image/png",
        height: 800,
        quality: 82,
        width: 1600,
      }),
      status: "done",
      width: 1600,
    });
    const pngSettings = makeSettings({
      outputFormat: "image/png",
      quality: 40,
    });

    // PNG 不支持质量参数，质量数值差异不应影响判定。
    expect(
      selectItemsNeedingConversion({ items: [pngDone], settings: pngSettings }),
    ).toEqual([]);

    const jpgDone = makeBatchItem({
      height: 800,
      result: makeResult({
        format: "image/jpeg",
        height: 800,
        quality: 82,
        width: 1600,
      }),
      status: "done",
      width: 1600,
    });
    const jpgSettings = makeSettings({
      outputFormat: "image/jpeg",
      quality: 40,
    });

    expect(
      selectItemsNeedingConversion({ items: [jpgDone], settings: jpgSettings }),
    ).toEqual([jpgDone]);
  });

  it("does not flag a done item as stale when the current width/height input can't be resolved", () => {
    const done = makeBatchItem({
      height: 800,
      result: makeResult({ format: "image/png", height: 800, width: 1600 }),
      status: "done",
      width: 1600,
    });
    const settings = makeSettings({ widthInput: "abc" });

    expect(selectItemsNeedingConversion({ items: [done], settings })).toEqual(
      [],
    );
  });

  it("returns exactly the pending, error, and stale-done subset from a mixed batch", () => {
    const pending = makeBatchItem({ id: "pending", status: "pending" });
    const errored = makeBatchItem({
      errorMessage: "boom",
      id: "errored",
      status: "error",
    });
    const freshDone = makeBatchItem({
      height: 800,
      id: "fresh-done",
      result: makeResult({ format: "image/png", height: 800, width: 1600 }),
      status: "done",
      width: 1600,
    });
    const staleDone = makeBatchItem({
      height: 800,
      id: "stale-done",
      result: makeResult({ format: "image/webp", height: 800, width: 1600 }),
      status: "done",
      width: 1600,
    });
    const settings = makeSettings({ outputFormat: "image/png" });

    const result = selectItemsNeedingConversion({
      items: [pending, errored, freshDone, staleDone],
      settings,
    });

    expect(result.map((item) => item.id).sort()).toEqual([
      "errored",
      "pending",
      "stale-done",
    ]);
  });
});
