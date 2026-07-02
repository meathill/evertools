import {
  type CropAnchor,
  getCurrentTargetDimensions,
  getImageConverterErrorMessage,
  isAcceptedImageFile,
  normalizeSourceFile,
  type OutputFormat,
  type ResizeMode,
  type ResultImage,
  readImageFile,
  supportsQuality,
} from "@/lib/image-converter";
import type { LocaleContent } from "@/messages/types";

export const MAX_BATCH_SIZE = 30;

export const BATCH_ITEM_STATUSES = [
  "pending",
  "converting",
  "done",
  "error",
] as const;

export type BatchItemStatus = (typeof BATCH_ITEM_STATUSES)[number];

export type BatchItem = {
  errorMessage: string | null;
  file: File;
  height: number;
  id: string;
  originalName: string;
  previewUrl: string;
  result: ResultImage | null;
  size: number;
  status: BatchItemStatus;
  type: string;
  width: number;
};

// 把一个原始 File 归一化并读出预览信息，包成一条待转换的批量项；
// 失败时返回 status: "error" 而不是抛出，方便调用方按项展示各自的错误。
export async function prepareBatchItem(input: {
  acceptedFormatsText: string;
  content: LocaleContent["imageConverter"];
  originalFile: File;
}): Promise<BatchItem> {
  const { acceptedFormatsText, content, originalFile } = input;
  const id = crypto.randomUUID();

  try {
    // HEIC 先解码成标准 JPEG；非 HEIC 原样返回。之后下游全部按普通图片处理。
    const file = await normalizeSourceFile(originalFile);
    const image = await readImageFile(file);

    return {
      errorMessage: null,
      file,
      height: image.height,
      id,
      originalName: originalFile.name,
      previewUrl: image.previewUrl,
      result: null,
      size: originalFile.size,
      status: "pending",
      type: originalFile.type || file.type,
      width: image.width,
    };
  } catch (error) {
    return {
      errorMessage: getImageConverterErrorMessage(
        error,
        content,
        acceptedFormatsText,
        content.client.errors.readFailed,
      ),
      file: originalFile,
      height: 0,
      id,
      originalName: originalFile.name,
      previewUrl: "",
      result: null,
      size: originalFile.size,
      status: "error",
      type: originalFile.type,
      width: 0,
    };
  }
}

export type BatchConversionSettings = {
  cropAnchor: CropAnchor;
  heightInput: string;
  isAspectLocked: boolean;
  outputFormat: OutputFormat;
  quality: number;
  resizeMode: ResizeMode;
  widthInput: string;
};

export type SplitAcceptedBatchFilesResult = {
  accepted: File[];
  rejectedOverCap: File[];
  rejectedUnsupported: File[];
};

// 一次拖拽里，格式不支持和超出批量上限是两类独立、可能同时发生的拒绝原因，
// 分开两个桶返回，方便调用方拼出各自的计数提示，而不是互相掩盖。
export function splitAcceptedBatchFiles(input: {
  existingCount: number;
  files: File[];
}): SplitAcceptedBatchFilesResult {
  const accepted: File[] = [];
  const rejectedOverCap: File[] = [];
  const rejectedUnsupported: File[] = [];

  let remainingCapacity = Math.max(0, MAX_BATCH_SIZE - input.existingCount);

  for (const file of input.files) {
    if (!isAcceptedImageFile(file)) {
      rejectedUnsupported.push(file);
      continue;
    }

    if (remainingCapacity <= 0) {
      rejectedOverCap.push(file);
      continue;
    }

    accepted.push(file);
    remainingCapacity -= 1;
  }

  return { accepted, rejectedOverCap, rejectedUnsupported };
}

// zip 内文件名去重：同名文件在扩展名前追加 -2、-3……，避免后写入的条目覆盖前面的。
export function dedupeZipEntryName(input: {
  desiredName: string;
  usedNames: Set<string>;
}): string {
  if (!input.usedNames.has(input.desiredName)) {
    return input.desiredName;
  }

  const dotIndex = input.desiredName.lastIndexOf(".");
  const hasExtension = dotIndex > 0;
  const baseName = hasExtension
    ? input.desiredName.slice(0, dotIndex)
    : input.desiredName;
  const extension = hasExtension ? input.desiredName.slice(dotIndex) : "";

  let counter = 2;
  let candidate = `${baseName}-${counter}${extension}`;

  while (input.usedNames.has(candidate)) {
    counter += 1;
    candidate = `${baseName}-${counter}${extension}`;
  }

  return candidate;
}

// 判断某一项在当前共享设置下是否需要（重新）生成：
// pending/error 直接需要；done 则按这张图自己的原始宽高解析出当前目标尺寸，
// 与已生成结果逐项比对（格式/尺寸/缩放方式/裁剪锚点/质量）。
function isBatchItemStale(
  item: BatchItem,
  settings: BatchConversionSettings,
): boolean {
  if (item.status !== "done" || !item.result) {
    return true;
  }

  const target = getCurrentTargetDimensions({
    heightInput: settings.heightInput,
    isAspectLocked: settings.isAspectLocked,
    originalHeight: item.height,
    originalWidth: item.width,
    widthInput: settings.widthInput,
  });

  if (!target) {
    return false;
  }

  const { result } = item;
  const qualityMatters = supportsQuality(settings.outputFormat);

  return (
    result.format !== settings.outputFormat ||
    result.width !== target.width ||
    result.height !== target.height ||
    result.resizeMode !== settings.resizeMode ||
    (settings.resizeMode === "crop" &&
      (result.cropAnchor?.horizontal !== settings.cropAnchor.horizontal ||
        result.cropAnchor?.vertical !== settings.cropAnchor.vertical)) ||
    (qualityMatters && result.quality !== settings.quality)
  );
}

export function selectItemsNeedingConversion(input: {
  items: BatchItem[];
  settings: BatchConversionSettings;
}): BatchItem[] {
  return input.items.filter((item) => isBatchItemStale(item, input.settings));
}

// jszip 只在用户点击“打包下载”时才会用到，动态 import 避免所有用户都加载这部分体积
// （与 normalizeSourceFile 对 heic-to 的处理方式一致）。
export async function buildBatchZip(items: BatchItem[]): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (const item of items) {
    if (!item.result) {
      continue;
    }

    const name = dedupeZipEntryName({
      desiredName: item.result.fileName,
      usedNames,
    });

    usedNames.add(name);
    zip.file(name, item.result.blob);
  }

  return zip.generateAsync({ type: "blob" });
}
