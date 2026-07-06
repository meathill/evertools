"use client";

import { ImageCropperCropCard } from "@/components/tools/image-cropper-crop-card";
import { ImageCropperSettingsCard } from "@/components/tools/image-cropper-settings-card";
import { useImageCropper } from "@/hooks/use-image-cropper";
import type { LocaleContent } from "@/messages/types";

type ImageCropperClientProps = {
  content: LocaleContent["imageCropper"];
};

export function ImageCropperClient({ content }: ImageCropperClientProps) {
  const controller = useImageCropper(content);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,380px)]">
      <ImageCropperCropCard content={content} controller={controller} />
      <ImageCropperSettingsCard content={content} controller={controller} />
    </div>
  );
}
