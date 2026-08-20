import {
  ImageUpIcon,
  Loader2Icon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { DropZone } from "@/components/ui/drop-zone";
import { Kbd } from "@/components/ui/kbd";
import type { ImageCropperController } from "@/hooks/use-image-cropper";
import { formatBytes } from "@/lib/format";
import { FILE_INPUT_ACCEPT } from "@/lib/image-converter";
import type { LocaleContent } from "@/messages/types";
import "react-image-crop/dist/ReactCrop.css";

type ImageCropperCropCardProps = {
  content: LocaleContent["imageCropper"];
  controller: ImageCropperController;
};

export function ImageCropperCropCard({
  content,
  controller,
}: ImageCropperCropCardProps) {
  const {
    acceptedFormatsText,
    aspect,
    crop,
    handleBrowseClick,
    handleCropChange,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInputChange,
    handleResetClick,
    handleSetCropHeight,
    handleSetCropWidth,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    inputId,
    inputRef,
    isDragging,
    isPreparing,
    selectionRect,
    source,
    zoom,
  } = controller;

  const [widthInput, setWidthInput] = useState<string>("");
  const [heightInput, setHeightInput] = useState<string>("");

  useEffect(() => {
    if (selectionRect) {
      setWidthInput(String(selectionRect.sWidth));
      setHeightInput(String(selectionRect.sHeight));
    }
  }, [selectionRect]);

  function handleWidthInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setWidthInput(e.target.value);
    const parsed = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      handleSetCropWidth(parsed);
    }
  }

  function handleWidthInputBlur() {
    if (!selectionRect) {
      return;
    }
    const parsed = Number.parseInt(widthInput, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setWidthInput(String(selectionRect.sWidth));
    } else {
      handleSetCropWidth(parsed);
    }
  }

  function handleHeightInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setHeightInput(e.target.value);
    const parsed = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      handleSetCropHeight(parsed);
    }
  }

  function handleHeightInputBlur() {
    if (!selectionRect) {
      return;
    }
    const parsed = Number.parseInt(heightInput, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setHeightInput(String(selectionRect.sHeight));
    } else {
      handleSetCropHeight(parsed);
    }
  }

  const fitScale = source
    ? Math.min(1, 480 / source.height, 680 / source.width)
    : 1;
  const displayWidth = source
    ? Math.max(120, Math.round(source.width * fitScale * zoom))
    : undefined;

  return (
    <Card className="h-fit overflow-hidden border-2 border-ink shadow-press-ink">
      <CardHeader className="border-b border-rule bg-paper-deep/50">
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
          <CardDescription>{content.client.upload.description}</CardDescription>
        </div>
      </CardHeader>

      <CardPanel>
        <DropZone
          isDragging={isDragging}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            accept={FILE_INPUT_ACCEPT}
            className="sr-only"
            id={inputId}
            onChange={handleFileInputChange}
            ref={inputRef}
            type="file"
          />

          {source ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-sm text-ink">
                    {source.originalName}
                  </div>
                  <div className="text-mute text-xs">
                    {content.client.crop.originalLabel
                      .replace("{width}", String(source.width))
                      .replace("{height}", String(source.height))}{" "}
                    · {formatBytes(source.size)}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 rounded-md border border-rule bg-paper px-1.5 py-0.5">
                    <Button
                      aria-label={content.client.crop.zoomOut}
                      disabled={zoom <= 0.25}
                      onClick={handleZoomOut}
                      size="sm"
                      variant="ghost"
                    >
                      <ZoomOutIcon className="size-4" />
                    </Button>
                    <Button
                      className="h-7 px-2 font-medium text-xs text-ink"
                      onClick={handleZoomReset}
                      size="sm"
                      title={content.client.crop.zoomReset}
                      variant="ghost"
                    >
                      {Math.round(zoom * 100)}%
                    </Button>
                    <Button
                      aria-label={content.client.crop.zoomIn}
                      disabled={zoom >= 4}
                      onClick={handleZoomIn}
                      size="sm"
                      variant="ghost"
                    >
                      <ZoomInIcon className="size-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={handleBrowseClick}
                    size="sm"
                    variant="outline"
                  >
                    {content.client.upload.reselect}
                  </Button>
                  <Button onClick={handleResetClick} size="sm" variant="ghost">
                    <RefreshCcwIcon />
                    {content.client.upload.clear}
                  </Button>
                </div>
              </div>

              <div className="max-h-[540px] w-full overflow-auto rounded-md bg-paper-deep/40 p-4">
                <div className="flex min-h-full min-w-full items-center justify-center">
                  <ReactCrop
                    aspect={aspect ?? undefined}
                    crop={crop ? { ...crop, unit: "%" } : undefined}
                    keepSelection
                    minWidth={16}
                    onChange={(_, percentCrop) => handleCropChange(percentCrop)}
                    ruleOfThirds
                  >
                    <img
                      alt={content.client.preview.alt.replace(
                        "{label}",
                        content.client.upload.sourceLabel,
                      )}
                      className="select-none"
                      src={source.previewUrl}
                      style={{
                        height: "auto",
                        maxWidth: "none",
                        width: displayWidth ? `${displayWidth}px` : "auto",
                      }}
                    />
                  </ReactCrop>
                </div>
              </div>

              {selectionRect ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-rule bg-paper-deep/30 px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink text-sm">
                      {content.client.crop.selectionTitle}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <label className="flex items-center gap-1 rounded-md border border-rule bg-paper px-2 py-1 text-xs shadow-xs focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
                        <span className="font-medium text-mute">
                          {content.client.crop.width}
                        </span>
                        <input
                          aria-label={content.client.crop.width}
                          className="w-16 bg-transparent text-center font-medium text-ink tabular-nums outline-none"
                          max={source.width}
                          min={1}
                          onBlur={handleWidthInputBlur}
                          onChange={handleWidthInputChange}
                          type="number"
                          value={widthInput}
                        />
                        <span className="text-mute">px</span>
                      </label>
                      <span className="text-mute text-xs">×</span>
                      <label className="flex items-center gap-1 rounded-md border border-rule bg-paper px-2 py-1 text-xs shadow-xs focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
                        <span className="font-medium text-mute">
                          {content.client.crop.height}
                        </span>
                        <input
                          aria-label={content.client.crop.height}
                          className="w-16 bg-transparent text-center font-medium text-ink tabular-nums outline-none"
                          max={source.height}
                          min={1}
                          onBlur={handleHeightInputBlur}
                          onChange={handleHeightInputChange}
                          type="number"
                          value={heightInput}
                        />
                        <span className="text-mute">px</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-mute text-xs">
                    <Kbd>↑↓←→</Kbd>
                    <span>1px</span>
                    <span className="text-rule">·</span>
                    <Kbd>Ctrl</Kbd>
                    <span>+</span>
                    <Kbd>↑↓←→</Kbd>
                    <span>10px</span>
                  </div>
                </div>
              ) : null}
            </div>
          ) : isPreparing ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-lg bg-yellow text-ink shadow-press-yellow">
                <Loader2Icon className="size-6 animate-spin" />
              </div>
              <p className="max-w-md text-mute text-sm leading-6">
                {content.client.upload.decoding}
              </p>
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-lg bg-yellow text-ink shadow-press-yellow">
                <ImageUpIcon className="size-6" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-ink text-lg">
                  {content.client.upload.emptyTitle}
                </div>
                <p className="max-w-md text-mute text-sm leading-6">
                  {content.client.upload.emptyDescription}
                </p>
              </div>
              <Button onClick={handleBrowseClick} variant="press">
                <ImageUpIcon />
                {content.client.upload.chooseImage}
              </Button>
            </div>
          )}
        </DropZone>
      </CardPanel>
    </Card>
  );
}
