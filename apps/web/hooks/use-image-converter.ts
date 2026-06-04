import {
  type ChangeEvent,
  type DragEvent,
  useId,
  useRef,
  useState,
} from "react";
import { useRevocableObjectUrl } from "@/hooks/use-revocable-object-url";
import {
  ACCEPTED_IMAGE_TYPES,
  OUTPUT_FORMATS,
  buildOutputFilename,
  convertImageFile,
  getCurrentTargetDimensions,
  getImageConverterErrorMessage,
  getSyncedDimensionValue,
  isAcceptedImageType,
  type CropAnchor,
  type OutputFormat,
  readImageFile,
  resolveTargetDimensions,
  type ResizeMode,
  supportsQuality,
} from "@/lib/image-converter";
import type { LocaleContent } from "@/messages/types";
import { useImageConverterStore } from "@/stores/image-converter-store";

type SourceImage = {
  file: File;
  height: number;
  name: string;
  previewUrl: string;
  size: number;
  type: string;
  width: number;
};

type ResultImage = {
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

export function useImageConverter(content: LocaleContent["imageConverter"]) {
  const acceptedFormatsText = ACCEPTED_IMAGE_TYPES.map((type) =>
    type.replace("image/", "").toUpperCase(),
  ).join(" / ");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const replacePreviewUrl = useRevocableObjectUrl();
  const replaceResultUrl = useRevocableObjectUrl();

  const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
  const [resultImage, setResultImage] = useState<ResultImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const isAspectLocked = resizeMode === "lock";

  const outputFormatInfo = OUTPUT_FORMATS.find(
    (item) => item.value === outputFormat,
  );
  const outputFormatContent = outputFormatInfo
    ? content.formats[outputFormatInfo.key]
    : null;
  const qualityEnabled = supportsQuality(outputFormat);
  const currentTargetDimensions = getCurrentTargetDimensions({
    heightInput: targetHeight,
    isAspectLocked,
    originalHeight: sourceImage?.height,
    originalWidth: sourceImage?.width,
    widthInput: targetWidth,
  });

  const isResultStale =
    Boolean(resultImage) &&
    Boolean(currentTargetDimensions) &&
    Boolean(
      resultImage &&
        currentTargetDimensions &&
        (resultImage.format !== outputFormat ||
          resultImage.width !== currentTargetDimensions.width ||
          resultImage.height !== currentTargetDimensions.height ||
          resultImage.resizeMode !== resizeMode ||
          (resizeMode === "crop" &&
            (resultImage.cropAnchor?.horizontal !== cropAnchor.horizontal ||
              resultImage.cropAnchor?.vertical !== cropAnchor.vertical)) ||
          (qualityEnabled && resultImage.quality !== quality)),
    );

  async function handleSelectedFile(file: File) {
    if (!isAcceptedImageType(file.type)) {
      setErrorMessage(
        content.client.errors.unsupportedFormat.replace(
          "{formats}",
          acceptedFormatsText,
        ),
      );
      return;
    }

    try {
      const image = await readImageFile(file);

      replacePreviewUrl(image.previewUrl);
      setSourceImage({
        file,
        height: image.height,
        name: file.name,
        previewUrl: image.previewUrl,
        size: file.size,
        type: file.type,
        width: image.width,
      });
      clearResult();
      hydrateFromSource(image);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        getImageConverterErrorMessage(
          error,
          content,
          acceptedFormatsText,
          content.client.errors.readFailed,
        ),
      );
    }
  }

  function handleBrowseClick() {
    inputRef.current?.click();
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      void handleSelectedFile(file);
    }

    event.currentTarget.value = "";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void handleSelectedFile(file);
    }
  }

  function handleWidthChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;

    setTargetWidth(nextValue);

    if (!sourceImage || !isAspectLocked) {
      return;
    }

    setTargetHeight(
      getSyncedDimensionValue({
        changedField: "width",
        nextValue,
        originalHeight: sourceImage.height,
        originalWidth: sourceImage.width,
      }),
    );
  }

  function handleHeightChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;

    setTargetHeight(nextValue);

    if (!sourceImage || !isAspectLocked) {
      return;
    }

    setTargetWidth(
      getSyncedDimensionValue({
        changedField: "height",
        nextValue,
        originalHeight: sourceImage.height,
        originalWidth: sourceImage.width,
      }),
    );
  }

  function handleResizeModeChange(mode: ResizeMode) {
    setResizeMode(mode);

    if (mode !== "lock" || !sourceImage) {
      return;
    }

    if (targetWidth.trim() !== "") {
      setTargetHeight(
        getSyncedDimensionValue({
          changedField: "width",
          nextValue: targetWidth,
          originalHeight: sourceImage.height,
          originalWidth: sourceImage.width,
        }),
      );

      return;
    }

    if (targetHeight.trim() !== "") {
      setTargetWidth(
        getSyncedDimensionValue({
          changedField: "height",
          nextValue: targetHeight,
          originalHeight: sourceImage.height,
          originalWidth: sourceImage.width,
        }),
      );

      return;
    }

    setTargetDimensions(String(sourceImage.width), String(sourceImage.height));
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

  async function handleGenerateClick() {
    if (!sourceImage) {
      setErrorMessage(content.client.errors.uploadFirst);
      return;
    }

    try {
      setIsConverting(true);
      setErrorMessage(null);

      const targetDimensions = resolveTargetDimensions({
        heightInput: targetHeight,
        isAspectLocked,
        originalHeight: sourceImage.height,
        originalWidth: sourceImage.width,
        widthInput: targetWidth,
      });

      const blob = await convertImageFile({
        crop: resizeMode === "crop" ? { anchor: cropAnchor } : undefined,
        file: sourceImage.file,
        format: outputFormat,
        height: targetDimensions.height,
        quality,
        width: targetDimensions.width,
      });

      const previewUrl = URL.createObjectURL(blob);

      replaceResultUrl(previewUrl);
      setResultImage({
        blob,
        cropAnchor: resizeMode === "crop" ? cropAnchor : null,
        fileName: buildOutputFilename(sourceImage.name, outputFormat),
        format: outputFormat,
        height: targetDimensions.height,
        previewUrl,
        quality,
        resizeMode,
        size: blob.size,
        width: targetDimensions.width,
      });
      setTargetDimensions(
        String(targetDimensions.width),
        String(targetDimensions.height),
      );
    } catch (error) {
      setErrorMessage(
        getImageConverterErrorMessage(
          error,
          content,
          acceptedFormatsText,
          content.client.errors.convertFailed,
        ),
      );
    } finally {
      setIsConverting(false);
    }
  }

  function handleDownloadClick() {
    if (!resultImage) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = resultImage.previewUrl;
    anchor.download = resultImage.fileName;
    anchor.click();
  }

  function handleResetClick() {
    replacePreviewUrl(null);
    replaceResultUrl(null);
    setSourceImage(null);
    setResultImage(null);
    setErrorMessage(null);
    setIsDragging(false);
    reset();
  }

  function clearResult() {
    replaceResultUrl(null);
    setResultImage(null);
  }

  return {
    acceptedFormatsText,
    cropAnchor,
    errorMessage,
    handleBrowseClick,
    handleDownloadClick,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInputChange,
    handleFormatChange,
    handleGenerateClick,
    handleHeightChange,
    handleQualityChange,
    handleResetClick,
    handleResizeModeChange,
    handleWidthChange,
    inputId,
    inputRef,
    isConverting,
    isDragging,
    isResultStale,
    outputFormat,
    outputFormatContent,
    quality,
    qualityEnabled,
    resizeMode,
    resultImage,
    setCropAnchor,
    sourceImage,
    targetHeight,
    targetWidth,
  };
}

export type ImageConverterController = ReturnType<typeof useImageConverter>;
