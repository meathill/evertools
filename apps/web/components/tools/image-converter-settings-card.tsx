import { DownloadIcon, SparklesIcon } from "lucide-react";
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
import type { ImageConverterController } from "@/hooks/use-image-converter";
import {
  CROP_HORIZONTALS,
  CROP_VERTICALS,
  OUTPUT_FORMATS,
  RESIZE_MODES,
  type ResizeMode,
} from "@/lib/image-converter";
import type { LocaleContent } from "@/messages/types";

const RESIZE_MODE_LABEL_KEYS = {
  crop: "modeCrop",
  lock: "modeLock",
  stretch: "modeStretch",
} as const satisfies Record<ResizeMode, string>;

type ImageConverterSettingsCardProps = {
  content: LocaleContent["imageConverter"];
  controller: ImageConverterController;
};

export function ImageConverterSettingsCard({
  content,
  controller,
}: ImageConverterSettingsCardProps) {
  const {
    cropAnchor,
    errorMessage,
    handleDownloadClick,
    handleFormatChange,
    handleGenerateClick,
    handleHeightChange,
    handleQualityChange,
    handleResizeModeChange,
    handleWidthChange,
    isConverting,
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
  } = controller;

  return (
    <Card className="h-fit border-2 border-ink shadow-press-ink lg:sticky lg:top-24">
      <CardHeader className="border-b border-rule bg-paper-deep/50">
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

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2 rounded-md bg-paper-deep/40 px-3 py-2.5">
            <div>
              <div className="font-medium text-sm text-ink">
                {content.client.settings.resizeModeTitle}
              </div>
              <div className="text-mute text-xs">
                {content.client.settings.resizeModeDescription}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {RESIZE_MODES.map((mode) => (
                <Button
                  key={mode}
                  onClick={() => handleResizeModeChange(mode)}
                  size="sm"
                  variant={resizeMode === mode ? "default" : "outline"}
                >
                  {content.client.settings[RESIZE_MODE_LABEL_KEYS[mode]]}
                </Button>
              ))}
            </div>
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

          {resizeMode === "crop" ? (
            <div className="space-y-2">
              <div>
                <div className="font-medium text-sm text-ink">
                  {content.client.settings.cropAnchorTitle}
                </div>
                <div className="text-mute text-xs">
                  {content.client.settings.cropAnchorDescription}
                </div>
              </div>
              <div className="grid w-fit grid-cols-3 gap-1.5">
                {CROP_VERTICALS.map((vertical) =>
                  CROP_HORIZONTALS.map((horizontal) => {
                    const isActive =
                      cropAnchor.vertical === vertical &&
                      cropAnchor.horizontal === horizontal;

                    return (
                      <Button
                        aria-label={content.client.settings.cropAnchorAria
                          .replace(
                            "{vertical}",
                            content.client.settings.cropVertical[vertical],
                          )
                          .replace(
                            "{horizontal}",
                            content.client.settings.cropHorizontal[horizontal],
                          )}
                        aria-pressed={isActive}
                        className="size-10 p-0"
                        key={`${vertical}-${horizontal}`}
                        onClick={() => setCropAnchor({ horizontal, vertical })}
                        size="icon"
                        variant={isActive ? "default" : "outline"}
                      >
                        <span
                          className={[
                            "block size-2 rounded-full",
                            isActive ? "bg-current" : "bg-mute/40",
                          ].join(" ")}
                        />
                      </Button>
                    );
                  }),
                )}
              </div>
            </div>
          ) : null}
        </div>

        {qualityEnabled ? (
          <>
            <Separator />
            <Field>
              <div className="mb-1 flex items-center justify-between gap-3">
                <FieldLabel>{content.client.settings.quality}</FieldLabel>
                <span className="font-medium text-sm text-ink">{quality}</span>
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
          <div className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2.5 text-danger text-sm">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            loading={isConverting}
            onClick={handleGenerateClick}
            variant="press"
          >
            <SparklesIcon />
            {resultImage
              ? content.client.settings.regenerate
              : content.client.settings.generate}
          </Button>
          <Button
            disabled={!resultImage}
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
