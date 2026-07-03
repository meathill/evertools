import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useFileDropInput } from "@/hooks/use-file-drop-input";
import {
  ACCEPTED_IMAGE_TYPES,
  buildOutputFilename,
  convertImageFile,
  getCurrentTargetDimensions,
  getImageConverterErrorMessage,
  getSyncedDimensionValue,
  OUTPUT_FORMATS,
  type OutputFormat,
  type ResizeMode,
  type ResultImage,
  resolveTargetDimensions,
  supportsQuality,
} from "@/lib/image-converter";
import {
  type BatchConversionSettings,
  type BatchItem,
  buildBatchZip,
  MAX_BATCH_SIZE,
  prepareBatchItem,
  selectItemsNeedingConversion,
  splitAcceptedBatchFiles,
} from "@/lib/image-converter-batch";
import type { LocaleContent } from "@/messages/types";
import { useImageConverterStore } from "@/stores/image-converter-store";

export function useImageConverter(
  content: LocaleContent["imageConverter"],
  preferredOutputFormat?: OutputFormat,
) {
  const acceptedFormatsText = [
    ...ACCEPTED_IMAGE_TYPES.map((type) =>
      type.replace("image/", "").toUpperCase(),
    ),
    "HEIC",
  ].join(" / ");

  const [items, setItems] = useState<BatchItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const itemsRef = useRef<BatchItem[]>(items);
  itemsRef.current = items;

  const {
    cropAnchor,
    hydrateFromSource,
    outputFormat,
    quality,
    reset,
    resizeMode,
    setCropAnchor,
    setOutputFormat,
    setQuality,
    setResizeMode,
    setTargetDimensions,
    setTargetHeight,
    setTargetWidth,
    targetHeight,
    targetWidth,
  } = useImageConverterStore();

  const {
    handleBrowseClick,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInputChange,
    inputId,
    inputRef,
    isDragging,
    stopDragging,
  } = useFileDropInput(handleAddFiles);

  // 卸载时释放所有还没被清理的预览地址，避免 object URL 泄漏。用 ref 拿最新值，
  // 避免这个只在卸载时运行一次的 effect 因为 items 变化而重复挂载。
  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
        if (item.result) {
          URL.revokeObjectURL(item.result.previewUrl);
        }
      }
    };
  }, []);

  const isAspectLocked = resizeMode === "lock";
  const firstItem = items[0];
  const isBatchMode = items.length > 1;

  // 转换落地页（如 /tools/heic-to-jpg）预设目标输出格式；通用页不传则行为不变。
  useEffect(() => {
    if (preferredOutputFormat) {
      setOutputFormat(preferredOutputFormat);
    }
  }, [preferredOutputFormat, setOutputFormat]);

  const outputFormatInfo = OUTPUT_FORMATS.find(
    (item) => item.value === outputFormat,
  );
  const outputFormatContent = outputFormatInfo
    ? content.formats[outputFormatInfo.key]
    : null;
  const qualityEnabled = supportsQuality(outputFormat);

  const currentSettings: BatchConversionSettings = {
    cropAnchor,
    heightInput: targetHeight,
    isAspectLocked,
    outputFormat,
    quality,
    resizeMode,
    widthInput: targetWidth,
  };

  // 单图模式的“过期”徽标：只在已经成功生成过一次的前提下，判断当前设置是否已经不匹配。
  const isResultStale = Boolean(
    firstItem?.result &&
      selectItemsNeedingConversion({
        items: [firstItem],
        settings: currentSettings,
      }).length > 0,
  );

  // 批量模式下更有用的信号：点一次“全部生成”会实际处理多少张（待生成 + 失败重试 + 已过期）。
  const staleCount = selectItemsNeedingConversion({
    items,
    settings: currentSettings,
  }).length;

  async function handleAddFiles(files: File[]) {
    if (files.length === 0) {
      return;
    }

    const { accepted, rejectedOverCap, rejectedUnsupported } =
      splitAcceptedBatchFiles({ existingCount: items.length, files });

    const rejectionMessages: string[] = [];

    if (rejectedUnsupported.length > 0) {
      rejectionMessages.push(
        content.client.batch.partiallyRejected
          .replace("{accepted}", String(accepted.length))
          .replace("{rejected}", String(rejectedUnsupported.length)),
      );
    }

    if (rejectedOverCap.length > 0) {
      rejectionMessages.push(
        content.client.batch.overCapRejected
          .replace("{max}", String(MAX_BATCH_SIZE))
          .replace("{rejected}", String(rejectedOverCap.length)),
      );
    }

    setErrorMessage(
      rejectionMessages.length > 0 ? rejectionMessages.join(" ") : null,
    );

    if (accepted.length === 0) {
      return;
    }

    const wasEmpty = items.length === 0;

    setIsPreparing(true);
    const prepared = await Promise.all(
      accepted.map((originalFile) =>
        prepareBatchItem({ acceptedFormatsText, content, originalFile }),
      ),
    );
    setIsPreparing(false);

    setItems((current) => [...current, ...prepared]);

    if (wasEmpty) {
      const firstReady = prepared.find((item) => item.status !== "error");

      if (firstReady) {
        hydrateFromSource({
          height: firstReady.height,
          preferredFormat: preferredOutputFormat,
          type: firstReady.type,
          width: firstReady.width,
        });
      } else if (prepared.length === 1) {
        // 单图模式下没有逐行错误文案可看，沿用之前“整卡报错”的体验。
        setErrorMessage(prepared[0].errorMessage);
      }
    }
  }

  function handleWidthChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;

    setTargetWidth(nextValue);

    // 批量模式下每张图宽高比不同，自动同步没有唯一正确答案，交给生成时各自计算。
    if (items.length !== 1 || !isAspectLocked || !firstItem) {
      return;
    }

    setTargetHeight(
      getSyncedDimensionValue({
        changedField: "width",
        nextValue,
        originalHeight: firstItem.height,
        originalWidth: firstItem.width,
      }),
    );
  }

  function handleHeightChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;

    setTargetHeight(nextValue);

    if (items.length !== 1 || !isAspectLocked || !firstItem) {
      return;
    }

    setTargetWidth(
      getSyncedDimensionValue({
        changedField: "height",
        nextValue,
        originalHeight: firstItem.height,
        originalWidth: firstItem.width,
      }),
    );
  }

  function handleResizeModeChange(mode: ResizeMode) {
    setResizeMode(mode);

    if (mode !== "lock" || items.length !== 1 || !firstItem) {
      return;
    }

    if (targetWidth.trim() !== "") {
      setTargetHeight(
        getSyncedDimensionValue({
          changedField: "width",
          nextValue: targetWidth,
          originalHeight: firstItem.height,
          originalWidth: firstItem.width,
        }),
      );

      return;
    }

    if (targetHeight.trim() !== "") {
      setTargetWidth(
        getSyncedDimensionValue({
          changedField: "height",
          nextValue: targetHeight,
          originalHeight: firstItem.height,
          originalWidth: firstItem.width,
        }),
      );

      return;
    }

    setTargetDimensions(String(firstItem.width), String(firstItem.height));
  }

  function handleFormatChange(value: OutputFormat | null) {
    if (!value) {
      return;
    }

    setOutputFormat(value);
    setErrorMessage(null);
  }

  function handleQualityChange(value: number | readonly number[]) {
    if (typeof value === "number") {
      setQuality(value);
      return;
    }

    setQuality(value[0] ?? quality);
  }

  async function handleGenerateAllClick() {
    if (items.length === 0) {
      setErrorMessage(content.client.errors.uploadFirst);
      return;
    }

    const itemsToConvert = selectItemsNeedingConversion({
      items,
      settings: currentSettings,
    });

    if (itemsToConvert.length === 0) {
      return;
    }

    setIsConverting(true);
    setErrorMessage(null);
    setBatchProgress({ done: 0, total: itemsToConvert.length });

    for (let index = 0; index < itemsToConvert.length; index += 1) {
      const target = itemsToConvert[index];

      setItems((current) =>
        current.map((item) =>
          item.id === target.id ? { ...item, status: "converting" } : item,
        ),
      );

      try {
        const targetDimensions = resolveTargetDimensions({
          heightInput: targetHeight,
          isAspectLocked,
          originalHeight: target.height,
          originalWidth: target.width,
          widthInput: targetWidth,
        });

        const blob = await convertImageFile({
          crop: resizeMode === "crop" ? { anchor: cropAnchor } : undefined,
          file: target.file,
          format: outputFormat,
          height: targetDimensions.height,
          quality,
          width: targetDimensions.width,
        });

        const previewUrl = URL.createObjectURL(blob);
        const result: ResultImage = {
          blob,
          cropAnchor: resizeMode === "crop" ? cropAnchor : null,
          fileName: buildOutputFilename(target.originalName, outputFormat),
          format: outputFormat,
          height: targetDimensions.height,
          previewUrl,
          quality,
          resizeMode,
          size: blob.size,
          width: targetDimensions.width,
        };

        setItems((current) =>
          current.map((item) => {
            if (item.id !== target.id) {
              return item;
            }

            if (item.result) {
              URL.revokeObjectURL(item.result.previewUrl);
            }

            return { ...item, errorMessage: null, result, status: "done" };
          }),
        );
      } catch (error) {
        setItems((current) =>
          current.map((item) =>
            item.id === target.id
              ? {
                  ...item,
                  errorMessage: getImageConverterErrorMessage(
                    error,
                    content,
                    acceptedFormatsText,
                    content.client.errors.convertFailed,
                  ),
                  status: "error",
                }
              : item,
          ),
        );
      } finally {
        setBatchProgress({ done: index + 1, total: itemsToConvert.length });
      }
    }

    // 单图模式下把实际生效的目标尺寸回填到输入框；批量模式各图尺寸可能不同，没有唯一答案，跳过。
    if (items.length === 1 && firstItem) {
      const resolved = getCurrentTargetDimensions({
        heightInput: targetHeight,
        isAspectLocked,
        originalHeight: firstItem.height,
        originalWidth: firstItem.width,
        widthInput: targetWidth,
      });

      if (resolved) {
        setTargetDimensions(String(resolved.width), String(resolved.height));
      }
    }

    setIsConverting(false);
    setBatchProgress(null);
  }

  function handleDownloadItem(id: string) {
    const item = items.find((entry) => entry.id === id);

    if (!item?.result) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = item.result.previewUrl;
    anchor.download = item.result.fileName;
    anchor.click();
  }

  async function handleDownloadAllClick() {
    const readyItems = items.filter((item) => item.result);

    if (readyItems.length === 0) {
      setErrorMessage(content.client.batch.zipEmpty);
      return;
    }

    try {
      setIsZipping(true);

      const zipBlob = await buildBatchZip(readyItems);
      const zipUrl = URL.createObjectURL(zipBlob);
      const anchor = document.createElement("a");

      anchor.href = zipUrl;
      anchor.download = "images-converted.zip";
      anchor.click();

      // 给浏览器留出发起下载的时间后再释放，这个 URL 不进状态，不走统一的卸载清理。
      setTimeout(() => {
        URL.revokeObjectURL(zipUrl);
      }, 1000);
    } finally {
      setIsZipping(false);
    }
  }

  function handleRemoveItem(id: string) {
    setItems((current) => {
      const target = current.find((item) => item.id === id);

      if (target) {
        if (target.previewUrl) {
          URL.revokeObjectURL(target.previewUrl);
        }
        if (target.result) {
          URL.revokeObjectURL(target.result.previewUrl);
        }
      }

      return current.filter((item) => item.id !== id);
    });
  }

  function handleResetClick() {
    for (const item of items) {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      if (item.result) {
        URL.revokeObjectURL(item.result.previewUrl);
      }
    }

    setItems([]);
    setBatchProgress(null);
    setErrorMessage(null);
    stopDragging();
    reset();
  }

  return {
    acceptedFormatsText,
    batchProgress,
    cropAnchor,
    errorMessage,
    firstItem,
    handleBrowseClick,
    handleDownloadAllClick,
    handleDownloadItem,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInputChange,
    handleFormatChange,
    handleGenerateAllClick,
    handleHeightChange,
    handleQualityChange,
    handleRemoveItem,
    handleResetClick,
    handleResizeModeChange,
    handleWidthChange,
    inputId,
    inputRef,
    isBatchMode,
    isConverting,
    isDragging,
    isPreparing,
    isResultStale,
    isZipping,
    items,
    outputFormat,
    outputFormatContent,
    quality,
    qualityEnabled,
    resizeMode,
    setCropAnchor,
    staleCount,
    targetHeight,
    targetWidth,
  };
}

export type ImageConverterController = ReturnType<typeof useImageConverter>;
