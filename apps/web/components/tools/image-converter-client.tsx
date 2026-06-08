"use client";

import { ImageConverterSettingsCard } from "@/components/tools/image-converter-settings-card";
import { ImageConverterUploadCard } from "@/components/tools/image-converter-upload-card";
import { useImageConverter } from "@/hooks/use-image-converter";
import type { OutputFormat } from "@/lib/image-converter";
import type { LocaleContent } from "@/messages/types";

type ImageConverterClientProps = {
  content: LocaleContent["imageConverter"];
  // 转换落地页预设目标输出格式（如 heic-to-png 预设 image/png）。
  initialOutputFormat?: OutputFormat;
};

export function ImageConverterClient({
  content,
  initialOutputFormat,
}: ImageConverterClientProps) {
  const controller = useImageConverter(content, initialOutputFormat);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,380px)]">
      <ImageConverterUploadCard content={content} controller={controller} />
      <ImageConverterSettingsCard content={content} controller={controller} />
    </div>
  );
}
