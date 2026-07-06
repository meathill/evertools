import { DownloadIcon, SparklesIcon } from "lucide-react";
import { PreviewCard } from "@/components/tools/image-converter-preview-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import type { ImageCropperController } from "@/hooks/use-image-cropper";
import { formatBytes } from "@/lib/format";
import { OUTPUT_FORMATS } from "@/lib/image-converter";
import { ASPECT_PRESETS } from "@/lib/image-cropper";
import type { LocaleContent } from "@/messages/types";

type ImageCropperSettingsCardProps = {
  content: LocaleContent["imageCropper"];
  controller: ImageCropperController;
};

export function ImageCropperSettingsCard({
  content,
  controller,
}: ImageCropperSettingsCardProps) {
  const {
    aspectKey,
    errorMessage,
    handleAspectChange,
    handleDownloadClick,
    handleFormatChange,
    handleGenerateClick,
    handleQualityChange,
    isCropping,
    outputFormat,
    outputFormatContent,
    quality,
    qualityEnabled,
    result,
    source,
  } = controller;

  return (
    <Card className="h-fit border-2 border-ink shadow-press-ink lg:sticky lg:top-24">
      <CardHeader className="border-b border-rule bg-paper-deep/50">
        <div className="space-y-2">
          <CardTitle>{content.client.settings.title}</CardTitle>
          <CardDescription>
            {content.client.settings.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardPanel className="space-y-5">
        <div className="space-y-2">
          <div className="font-medium text-ink text-sm">
            {content.client.crop.aspectTitle}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {ASPECT_PRESETS.map((preset) => (
              <Button
                key={preset.key}
                onClick={() => handleAspectChange(preset.key)}
                size="sm"
                variant={aspectKey === preset.key ? "default" : "outline"}
              >
                {content.client.crop.aspects[preset.key]}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <Field>
          <FieldLabel>{content.client.settings.targetFormat}</FieldLabel>
          <Select onValueChange={handleFormatChange} value={outputFormat}>
            <SelectTrigger>
              <SelectValue>{outputFormatContent?.label}</SelectValue>
            </SelectTrigger>
            <SelectPopup>
              {OUTPUT_FORMATS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <div className="flex flex-col gap-0.5">
                    <span>{content.formats[item.key].label}</span>
                    <span className="text-mute text-xs">
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

        {qualityEnabled ? (
          <Field>
            <div className="mb-1 flex items-center justify-between gap-3">
              <FieldLabel>{content.client.settings.quality}</FieldLabel>
              <span className="font-medium text-ink text-sm">{quality}</span>
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
        ) : null}

        <Separator />

        <PreviewCard
          altText={content.client.preview.alt.replace(
            "{label}",
            content.client.settings.resultLabel,
          )}
          emptyDescription={content.client.preview.emptyDescription}
          label={content.client.settings.resultLabel}
          meta={
            result
              ? `${result.width} x ${result.height} px · ${formatBytes(result.size)}`
              : content.client.settings.pendingResult
          }
          src={result?.previewUrl}
          staleLabel=""
        />

        {errorMessage ? (
          <div className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2.5 text-danger text-sm">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            loading={isCropping}
            onClick={handleGenerateClick}
            variant="press"
          >
            <SparklesIcon />
            {result
              ? content.client.settings.regenerate
              : content.client.settings.generate}
          </Button>
          <Button
            disabled={!source}
            onClick={handleDownloadClick}
            variant="press-ink"
          >
            <DownloadIcon />
            {content.client.settings.download}
          </Button>
        </div>
      </CardPanel>
    </Card>
  );
}
