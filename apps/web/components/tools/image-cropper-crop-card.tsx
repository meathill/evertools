import {
  ImageUpIcon,
  Loader2Icon,
  RefreshCcwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import ReactCrop, { type PercentCrop } from "react-image-crop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
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
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInputChange,
    handleResetClick,
    inputId,
    inputRef,
    isDragging,
    isPreparing,
    selectionRect,
    setCrop,
    source,
  } = controller;

  function handleCropChange(_: unknown, percentCrop: PercentCrop) {
    setCrop({
      height: percentCrop.height,
      width: percentCrop.width,
      x: percentCrop.x,
      y: percentCrop.y,
    });
  }

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
        <div
          className={[
            "rounded-lg border-2 border-dashed p-5 transition-colors sm:p-6",
            isDragging
              ? "border-yellow bg-fluff/60"
              : "border-rule-strong bg-paper-deep/25",
          ].join(" ")}
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
                <div className="flex flex-wrap gap-2">
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

              <div className="flex justify-center rounded-md bg-paper-deep/40 p-3">
                <ReactCrop
                  aspect={aspect ?? undefined}
                  crop={crop ? { ...crop, unit: "%" } : undefined}
                  keepSelection
                  minWidth={16}
                  onChange={handleCropChange}
                  ruleOfThirds
                >
                  <img
                    alt={content.client.preview.alt.replace(
                      "{label}",
                      content.client.upload.sourceLabel,
                    )}
                    className="max-h-[520px] w-auto"
                    src={source.previewUrl}
                  />
                </ReactCrop>
              </div>

              {selectionRect ? (
                <div className="text-center font-medium text-ink text-sm">
                  {content.client.crop.selectionLabel
                    .replace("{width}", String(selectionRect.sWidth))
                    .replace("{height}", String(selectionRect.sHeight))}
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
        </div>
      </CardPanel>
    </Card>
  );
}
