"use client";

import { ImageConverterSettingsCard } from "@/components/tools/image-converter-settings-card";
import { ImageConverterUploadCard } from "@/components/tools/image-converter-upload-card";
import { useImageConverter } from "@/hooks/use-image-converter";
import type { LocaleContent } from "@/messages/types";

type ImageConverterClientProps = {
  content: LocaleContent["imageConverter"];
};

export function ImageConverterClient({ content }: ImageConverterClientProps) {
  const controller = useImageConverter(content);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,380px)]">
      <ImageConverterUploadCard content={content} controller={controller} />
      <ImageConverterSettingsCard content={content} controller={controller} />
    </div>
  );
}
