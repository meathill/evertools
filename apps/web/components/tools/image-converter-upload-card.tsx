import {
  ImageUpIcon,
  Loader2Icon,
  RefreshCcwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { PreviewCard } from "@/components/tools/image-converter-preview-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import type { ImageConverterController } from "@/hooks/use-image-converter";
import { FILE_INPUT_ACCEPT, formatBytes } from "@/lib/image-converter";
import type { LocaleContent } from "@/messages/types";

type ImageConverterUploadCardProps = {
  content: LocaleContent["imageConverter"];
  controller: ImageConverterController;
};

export function ImageConverterUploadCard({
  content,
  controller,
}: ImageConverterUploadCardProps) {
  const {
    acceptedFormatsText,
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
    isResultStale,
    resultImage,
    sourceImage,
  } = controller;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2 border-ink shadow-press-ink">
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
            <CardDescription>
              {content.client.upload.description}
            </CardDescription>
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

            {sourceImage ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-sm text-ink">
                      {sourceImage.name}
                    </div>
                    <div className="text-mute text-xs">
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
                  <div className="font-semibold text-lg text-ink">
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
    </div>
  );
}
