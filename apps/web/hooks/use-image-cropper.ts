import { useEffect, useRef, useState } from "react";
import { useFileDropInput } from "@/hooks/use-file-drop-input";
import {
  ACCEPTED_IMAGE_TYPES,
  DEFAULT_QUALITY,
  getDefaultOutputFormat,
  IMAGE_CONVERTER_ERROR_CODES,
  isAcceptedImageFile,
  normalizeSourceFile,
  OUTPUT_FORMATS,
  type OutputFormat,
  parseImageConverterError,
  readImageFile,
  supportsQuality,
} from "@/lib/image-converter";
import {
  type AspectPresetKey,
  buildCropOutputFilename,
  computeCropPixelRect,
  cropImageFile,
  getAspectPresetValue,
  getCenteredCrop,
  type PercentCropRect,
} from "@/lib/image-cropper";
import type { LocaleContent } from "@/messages/types";

type CropperSource = {
  file: File;
  height: number;
  originalName: string;
  previewUrl: string;
  size: number;
  width: number;
};

type CropperResult = {
  blob: Blob;
  fileName: string;
  format: OutputFormat;
  height: number;
  previewUrl: string;
  size: number;
  width: number;
};

export function useImageCropper(content: LocaleContent["imageCropper"]) {
  const acceptedFormatsText = [
    ...ACCEPTED_IMAGE_TYPES.map((type) =>
      type.replace("image/", "").toUpperCase(),
    ),
    "HEIC",
  ].join(" / ");

  const [source, setSource] = useState<CropperSource | null>(null);
  const [crop, setCrop] = useState<PercentCropRect | null>(null);
  const [aspectKey, setAspectKey] = useState<AspectPresetKey>("free");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [result, setResult] = useState<CropperResult | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 卸载时释放预览地址；用 ref 拿最新值，effect 只在卸载时跑一次。
  const urlsRef = useRef<{ result: string | null; source: string | null }>({
    result: null,
    source: null,
  });
  urlsRef.current = {
    result: result?.previewUrl ?? null,
    source: source?.previewUrl ?? null,
  };

  useEffect(() => {
    return () => {
      if (urlsRef.current.source) {
        URL.revokeObjectURL(urlsRef.current.source);
      }
      if (urlsRef.current.result) {
        URL.revokeObjectURL(urlsRef.current.result);
      }
    };
  }, []);

  const fileDrop = useFileDropInput(handleAddFiles);

  const aspect = getAspectPresetValue(aspectKey);
  const qualityEnabled = supportsQuality(outputFormat);
  const outputFormatInfo = OUTPUT_FORMATS.find(
    (item) => item.value === outputFormat,
  );
  const outputFormatContent = outputFormatInfo
    ? content.formats[outputFormatInfo.key]
    : null;

  // 供 UI 实时显示选区对应的源图像素尺寸。
  const selectionRect =
    source && crop && crop.width > 0 && crop.height > 0
      ? computeCropPixelRect({
          crop,
          naturalHeight: source.height,
          naturalWidth: source.width,
        })
      : null;

  function getErrorMessage(error: unknown, fallback: string): string {
    const parsed = parseImageConverterError(error);

    switch (parsed.code) {
      case IMAGE_CONVERTER_ERROR_CODES.BLOB_FAILED:
        return content.client.errors.blobFailed;
      case IMAGE_CONVERTER_ERROR_CODES.CANVAS_UNSUPPORTED:
        return content.client.errors.canvasUnsupported;
      case IMAGE_CONVERTER_ERROR_CODES.IMAGE_READ_FAILED:
        return content.client.errors.imageBroken;
      case IMAGE_CONVERTER_ERROR_CODES.UNSUPPORTED_OUTPUT:
        return content.client.errors.unsupportedOutput.replace(
          "{format}",
          parsed.detail ?? "",
        );
      default:
        return fallback;
    }
  }

  function releaseSource() {
    if (source) {
      URL.revokeObjectURL(source.previewUrl);
    }
  }

  function releaseResult() {
    if (result) {
      URL.revokeObjectURL(result.previewUrl);
    }
    setResult(null);
  }

  async function handleAddFiles(files: File[]) {
    const file = files[0];

    if (!file) {
      return;
    }

    if (!isAcceptedImageFile(file)) {
      setErrorMessage(
        content.client.errors.unsupportedFormat.replace(
          "{formats}",
          acceptedFormatsText,
        ),
      );
      return;
    }

    setErrorMessage(null);
    setIsPreparing(true);

    try {
      const normalized = await normalizeSourceFile(file);
      const image = await readImageFile(normalized);

      releaseSource();
      releaseResult();
      setSource({
        file: normalized,
        height: image.height,
        originalName: file.name,
        previewUrl: image.previewUrl,
        size: normalized.size,
        width: image.width,
      });
      setCrop(
        getCenteredCrop({
          aspect,
          naturalHeight: image.height,
          naturalWidth: image.width,
        }),
      );
      setOutputFormat(getDefaultOutputFormat(image.type));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, content.client.errors.readFailed));
    } finally {
      setIsPreparing(false);
    }
  }

  function handleAspectChange(key: AspectPresetKey) {
    setAspectKey(key);

    if (!source) {
      return;
    }

    setCrop(
      getCenteredCrop({
        aspect: getAspectPresetValue(key),
        naturalHeight: source.height,
        naturalWidth: source.width,
      }),
    );
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

  async function generateResult(): Promise<CropperResult | null> {
    if (!source) {
      setErrorMessage(content.client.errors.uploadFirst);
      return null;
    }

    if (!selectionRect) {
      setErrorMessage(content.client.errors.invalidSelection);
      return null;
    }

    setIsCropping(true);
    setErrorMessage(null);

    try {
      const blob = await cropImageFile({
        file: source.file,
        format: outputFormat,
        quality,
        rect: selectionRect,
      });
      const next: CropperResult = {
        blob,
        fileName: buildCropOutputFilename(source.originalName, outputFormat),
        format: outputFormat,
        height: selectionRect.sHeight,
        previewUrl: URL.createObjectURL(blob),
        size: blob.size,
        width: selectionRect.sWidth,
      };

      if (result) {
        URL.revokeObjectURL(result.previewUrl);
      }
      setResult(next);

      return next;
    } catch (error) {
      setErrorMessage(getErrorMessage(error, content.client.errors.cropFailed));
      return null;
    } finally {
      setIsCropping(false);
    }
  }

  async function handleGenerateClick() {
    await generateResult();
  }

  // 下载前若还没生成过结果，先自动生成一次。
  async function handleDownloadClick() {
    const target = result ?? (await generateResult());

    if (!target) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = target.previewUrl;
    anchor.download = target.fileName;
    anchor.click();
  }

  function handleResetClick() {
    releaseSource();
    releaseResult();
    setSource(null);
    setCrop(null);
    setAspectKey("free");
    setErrorMessage(null);
    fileDrop.stopDragging();
  }

  return {
    acceptedFormatsText,
    aspect,
    aspectKey,
    crop,
    errorMessage,
    handleAspectChange,
    handleBrowseClick: fileDrop.handleBrowseClick,
    handleDownloadClick,
    handleDragLeave: fileDrop.handleDragLeave,
    handleDragOver: fileDrop.handleDragOver,
    handleDrop: fileDrop.handleDrop,
    handleFileInputChange: fileDrop.handleFileInputChange,
    handleFormatChange,
    handleGenerateClick,
    handleQualityChange,
    handleResetClick,
    inputId: fileDrop.inputId,
    inputRef: fileDrop.inputRef,
    isCropping,
    isDragging: fileDrop.isDragging,
    isPreparing,
    outputFormat,
    outputFormatContent,
    quality,
    qualityEnabled,
    result,
    selectionRect,
    setCrop,
    source,
  };
}

export type ImageCropperController = ReturnType<typeof useImageCropper>;
