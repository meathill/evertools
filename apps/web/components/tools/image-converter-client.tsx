"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  DownloadIcon,
  ImageUpIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ACCEPTED_IMAGE_TYPES,
  IMAGE_CONVERTER_ERROR_CODES,
  OUTPUT_FORMATS,
  buildOutputFilename,
  convertImageFile,
  formatBytes,
  getOutputFormatKey,
  getSyncedDimensionValue,
  isAcceptedImageType,
  parseImageConverterError,
  readImageFile,
  resolveTargetDimensions,
  supportsQuality,
  type OutputFormat,
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
  fileName: string;
  format: OutputFormat;
  height: number;
  previewUrl: string;
  quality: number;
  size: number;
  width: number;
};

type ImageConverterClientProps = {
  content: LocaleContent["imageConverter"];
};

export function ImageConverterClient({ content }: ImageConverterClientProps) {
  const acceptedFormatsText = ACCEPTED_IMAGE_TYPES.map((type) =>
    type.replace("image/", "").toUpperCase(),
  ).join(" / ");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
  const [resultImage, setResultImage] = useState<ResultImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    hydrateFromSource,
    isAspectLocked,
    outputFormat,
    quality,
    reset,
    setAspectLocked,
    setOutputFormat,
    setQuality,
    setTargetDimensions,
    setTargetHeight,
    setTargetWidth,
    targetHeight,
    targetWidth,
  } = useImageConverterStore();

  useEffect(() => {
    return () => {
      cleanupUrl(previewUrlRef.current);
      cleanupUrl(resultUrlRef.current);
    };
  }, []);

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
        getErrorMessage(
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

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      void handleSelectedFile(file);
    }

    event.currentTarget.value = "";
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void handleSelectedFile(file);
    }
  }

  function handleWidthChange(event: React.ChangeEvent<HTMLInputElement>) {
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

  function handleHeightChange(event: React.ChangeEvent<HTMLInputElement>) {
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

  function handleAspectLockChange(checked: boolean) {
    setAspectLocked(checked);

    if (!checked || !sourceImage) {
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
        fileName: buildOutputFilename(sourceImage.name, outputFormat),
        format: outputFormat,
        height: targetDimensions.height,
        previewUrl,
        quality,
        size: blob.size,
        width: targetDimensions.width,
      });
      setTargetDimensions(
        String(targetDimensions.width),
        String(targetDimensions.height),
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
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
    cleanupUrl(previewUrlRef.current);
    cleanupUrl(resultUrlRef.current);
    previewUrlRef.current = null;
    resultUrlRef.current = null;

    setSourceImage(null);
    setResultImage(null);
    setErrorMessage(null);
    setIsDragging(false);
    reset();
  }

  function replacePreviewUrl(nextUrl: string) {
    cleanupUrl(previewUrlRef.current);
    previewUrlRef.current = nextUrl;
  }

  function replaceResultUrl(nextUrl: string) {
    cleanupUrl(resultUrlRef.current);
    resultUrlRef.current = nextUrl;
  }

  function clearResult() {
    cleanupUrl(resultUrlRef.current);
    resultUrlRef.current = null;
    setResultImage(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,380px)]">
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/35">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">
                <ShieldCheckIcon />
                {content.client.badges.localProcessing}
              </Badge>
              <Badge variant="outline">
                {content.client.badges.supportedFormats.replace(
                  "{formats}",
                  acceptedFormatsText,
                )}
              </Badge>
            </div>
            <div className="space-y-2">
              <CardTitle>{content.client.upload.title}</CardTitle>
              <CardDescription>
                {content.client.upload.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardPanel>
            <div
              className={[
                "rounded-2xl border border-dashed p-5 transition-colors sm:p-6",
                isDragging
                  ? "border-primary bg-primary/6"
                  : "border-border bg-gradient-to-br from-muted/40 via-background to-background",
              ].join(" ")}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                className="sr-only"
                id={inputId}
                onChange={handleFileInputChange}
                ref={inputRef}
                type="file"
              />

              {sourceImage ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm text-foreground">
                        {sourceImage.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {sourceImage.width} x {sourceImage.height} px ·{" "}
                        {formatBytes(sourceImage.size)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={handleBrowseClick}
                        size="sm"
                        variant="outline"
                      >
                        {content.client.upload.reselect}
                      </Button>
                      <Button
                        onClick={handleResetClick}
                        size="sm"
                        variant="ghost"
                      >
                        <RefreshCcwIcon />
                        {content.client.upload.clear}
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <PreviewCard
                      altText={content.client.preview.alt.replace(
                        "{label}",
                        content.client.upload.sourceLabel,
                      )}
                      emptyDescription={content.client.preview.emptyDescription}
                      label={content.client.upload.sourceLabel}
                      meta={`${sourceImage.width} x ${sourceImage.height} px`}
                      src={sourceImage.previewUrl}
                      staleLabel={content.client.badges.stalePreview}
                      stale={false}
                    />
                    <PreviewCard
                      altText={content.client.preview.alt.replace(
                        "{label}",
                        content.client.upload.resultLabel,
                      )}
                      emptyDescription={content.client.preview.emptyDescription}
                      label={content.client.upload.resultLabel}
                      meta={
                        resultImage
                          ? `${resultImage.width} x ${resultImage.height} px · ${formatBytes(resultImage.size)}`
                          : content.client.upload.pendingResult
                      }
                      src={resultImage?.previewUrl}
                      staleLabel={content.client.badges.stalePreview}
                      stale={Boolean(isResultStale)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ImageUpIcon className="size-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="font-heading font-semibold text-lg text-foreground">
                      {content.client.upload.emptyTitle}
                    </div>
                    <p className="max-w-md text-muted-foreground text-sm leading-6">
                      {content.client.upload.emptyDescription}
                    </p>
                  </div>
                  <Button onClick={handleBrowseClick}>
                    <ImageUpIcon />
                    {content.client.upload.chooseImage}
                  </Button>
                </div>
              )}
            </div>
          </CardPanel>
        </Card>
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <CardHeader className="border-b border-border/60 bg-muted/35">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {content.client.badges.firstVersion}
            </Badge>
            {isResultStale ? (
              <Badge variant="warning">{content.client.badges.stale}</Badge>
            ) : null}
          </div>
          <div className="space-y-2">
            <CardTitle>{content.client.settings.title}</CardTitle>
            <CardDescription>
              {content.client.settings.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardPanel className="space-y-5">
          <Field>
            <FieldLabel>{content.client.settings.targetFormat}</FieldLabel>
            <Select onValueChange={handleFormatChange} value={outputFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {OUTPUT_FORMATS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <div className="flex flex-col gap-0.5">
                      <span>{content.formats[item.key].label}</span>
                      <span className="text-muted-foreground text-xs">
                        {content.formats[item.key].description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
            <FieldDescription>
              {outputFormatContent?.description}
            </FieldDescription>
          </Field>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2.5">
              <div>
                <div className="font-medium text-sm text-foreground">
                  {content.client.settings.aspectLockTitle}
                </div>
                <div className="text-muted-foreground text-xs">
                  {content.client.settings.aspectLockDescription}
                </div>
              </div>
              <Switch
                checked={isAspectLocked}
                onCheckedChange={handleAspectLockChange}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>{content.client.settings.width}</FieldLabel>
                <Input
                  inputMode="numeric"
                  onChange={handleWidthChange}
                  placeholder={
                    sourceImage
                      ? String(sourceImage.width)
                      : content.client.settings.widthPlaceholder
                  }
                  value={targetWidth}
                />
              </Field>

              <Field>
                <FieldLabel>{content.client.settings.height}</FieldLabel>
                <Input
                  inputMode="numeric"
                  onChange={handleHeightChange}
                  placeholder={
                    sourceImage
                      ? String(sourceImage.height)
                      : content.client.settings.heightPlaceholder
                  }
                  value={targetHeight}
                />
              </Field>
            </div>
          </div>

          {qualityEnabled ? (
            <>
              <Separator />
              <Field>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <FieldLabel>{content.client.settings.quality}</FieldLabel>
                  <span className="font-medium text-sm text-foreground">
                    {quality}
                  </span>
                </div>
                <Slider
                  aria-label={content.client.settings.qualityAria}
                  max={100}
                  min={1}
                  onValueChange={handleQualityChange}
                  value={quality}
                />
                <FieldDescription>
                  {content.client.settings.qualityDescription}
                </FieldDescription>
              </Field>
            </>
          ) : null}

          {errorMessage ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/6 px-3 py-2.5 text-destructive-foreground text-sm">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button loading={isConverting} onClick={handleGenerateClick}>
              <SparklesIcon />
              {resultImage
                ? content.client.settings.regenerate
                : content.client.settings.generate}
            </Button>
            <Button
              disabled={!resultImage}
              onClick={handleDownloadClick}
              variant="outline"
            >
              <DownloadIcon />
              {content.client.settings.download}
            </Button>
          </div>
        </CardPanel>
      </Card>
    </div>
  );
}

type PreviewCardProps = {
  altText: string;
  emptyDescription: string;
  label: string;
  meta: string;
  src?: string;
  stale?: boolean;
  staleLabel: string;
};

function PreviewCard({
  altText,
  emptyDescription,
  label,
  meta,
  src,
  stale = false,
  staleLabel,
}: PreviewCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <div>
          <div className="font-medium text-sm text-foreground">{label}</div>
          <div className="text-muted-foreground text-xs">{meta}</div>
        </div>
        {stale ? <Badge variant="warning">{staleLabel}</Badge> : null}
      </div>
      <div className="flex min-h-64 items-center justify-center bg-muted/30 p-4">
        {src ? (
          <img
            alt={altText}
            className="max-h-80 w-full rounded-xl object-contain"
            src={src}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
              <SparklesIcon className="size-5" />
            </div>
            <p className="max-w-xs text-sm leading-6">{emptyDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getCurrentTargetDimensions(input: {
  heightInput: string;
  isAspectLocked: boolean;
  originalHeight?: number;
  originalWidth?: number;
  widthInput: string;
}) {
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

function cleanupUrl(url: string | null) {
  if (!url) {
    return;
  }

  URL.revokeObjectURL(url);
}

function getErrorMessage(
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
