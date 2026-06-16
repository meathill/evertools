import { ImageUpIcon, Loader2Icon, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import type { OgImageValidatorController } from "@/hooks/use-og-image-validator";
import { formatBytes } from "@/lib/image-converter";
import type { LocaleContent } from "@/messages/types";

type UploadCardProps = {
  content: LocaleContent["ogImageValidator"];
  controller: OgImageValidatorController;
};

export function OgImageValidatorUploadCard({
  content,
  controller,
}: UploadCardProps) {
  const { client } = content;
  const {
    handleBrowseClick,
    handleClear,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInputChange,
    inputId,
    inputRef,
    isDragging,
    isPreparing,
    result,
  } = controller;
  const image = result?.mode === "upload" ? result.image : null;

  return (
    <Card className="overflow-hidden border-2 border-ink shadow-press-ink">
      <CardHeader className="border-b border-rule bg-paper-deep/50">
        <CardTitle>{client.upload.title}</CardTitle>
        <CardDescription>{client.upload.description}</CardDescription>
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
            accept="image/*"
            className="sr-only"
            id={inputId}
            onChange={handleFileInputChange}
            ref={inputRef}
            type="file"
          />

          {image && result ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  alt={result.title ?? ""}
                  className="size-20 rounded-md border border-rule-strong object-cover"
                  src={result.imageUrl ?? undefined}
                />
                <div className="min-w-0">
                  <div className="truncate font-medium text-ink text-sm">
                    {result.title}
                  </div>
                  <div className="text-mute text-xs">
                    {image.width && image.height
                      ? `${image.width} x ${image.height} px`
                      : client.result.dimensionsUnknown}
                    {image.byteSize ? ` · ${formatBytes(image.byteSize)}` : ""}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleBrowseClick} size="sm" variant="outline">
                  {client.upload.reselect}
                </Button>
                <Button onClick={handleClear} size="sm" variant="ghost">
                  <RefreshCcwIcon />
                  {client.upload.clear}
                </Button>
              </div>
            </div>
          ) : isPreparing ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-lg bg-yellow text-ink shadow-press-yellow">
                <Loader2Icon className="size-6 animate-spin" />
              </div>
              <p className="max-w-md text-mute text-sm leading-6">
                {client.upload.decoding}
              </p>
            </div>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-lg bg-yellow text-ink shadow-press-yellow">
                <ImageUpIcon className="size-6" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-ink text-lg">
                  {client.upload.emptyTitle}
                </div>
                <p className="max-w-md text-mute text-sm leading-6">
                  {client.upload.emptyDescription}
                </p>
              </div>
              <Button onClick={handleBrowseClick} variant="press">
                <ImageUpIcon />
                {client.upload.choose}
              </Button>
            </div>
          )}
        </div>
      </CardPanel>
    </Card>
  );
}
