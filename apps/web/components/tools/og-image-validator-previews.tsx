import { ImageOffIcon } from "lucide-react";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { OG_PLATFORMS } from "@/lib/og/validator";
import type { LocaleContent } from "@/messages/types";
import type { ValidatorResult } from "@/hooks/use-og-image-validator";

type ClientContent = LocaleContent["ogImageValidator"]["client"];

type PreviewsProps = {
  client: ClientContent;
  result: ValidatorResult;
};

function PlatformCard({
  client,
  label,
  result,
}: {
  client: ClientContent;
  label: string;
  result: ValidatorResult;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-rule-strong bg-card">
      <div className="border-b border-rule/60 bg-paper-deep/40 px-3 py-2 font-semibold text-ink text-xs">
        {label}
      </div>
      <div className="flex aspect-[1.91/1] items-center justify-center bg-paper-deep/30">
        {result.imageUrl ? (
          // 跨域图片仅作展示，不读取像素，CORS 不受限。
          <img
            alt={result.title ?? label}
            className="size-full object-cover"
            src={result.imageUrl}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-mute">
            <ImageOffIcon className="size-6" />
            <span className="text-xs">{client.result.noImage}</span>
          </div>
        )}
      </div>
      <div className="space-y-1 px-3 py-2.5">
        {result.domain ? (
          <div className="text-mute text-xs uppercase">{result.domain}</div>
        ) : null}
        <div className="line-clamp-1 font-semibold text-ink text-sm">
          {result.title ?? client.result.noImage}
        </div>
        {result.description ? (
          <div className="line-clamp-2 text-mute text-xs leading-5">
            {result.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function OgImageValidatorPreviews({ client, result }: PreviewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{client.result.previewTitle}</CardTitle>
      </CardHeader>
      <CardPanel className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OG_PLATFORMS.map((platform) => (
          <PlatformCard
            client={client}
            key={platform}
            label={
              (client.platforms as Record<string, string>)[platform] ?? platform
            }
            result={result}
          />
        ))}
      </CardPanel>
    </Card>
  );
}
