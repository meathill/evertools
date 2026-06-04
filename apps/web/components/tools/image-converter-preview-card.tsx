import { SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type PreviewCardProps = {
  altText: string;
  emptyDescription: string;
  label: string;
  meta: string;
  src?: string;
  stale?: boolean;
  staleLabel: string;
};

export function PreviewCard({
  altText,
  emptyDescription,
  label,
  meta,
  src,
  stale = false,
  staleLabel,
}: PreviewCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-rule-strong bg-cream">
      <div className="flex items-center justify-between gap-3 border-b border-rule/60 px-4 py-3">
        <div>
          <div className="font-medium text-sm text-ink">{label}</div>
          <div className="text-mute text-xs">{meta}</div>
        </div>
        {stale ? <Badge variant="warning">{staleLabel}</Badge> : null}
      </div>
      <div className="flex min-h-64 items-center justify-center bg-paper-deep/30 p-4">
        {src ? (
          <img
            alt={altText}
            className="max-h-80 w-full rounded-md object-contain"
            src={src}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center text-mute">
            <div className="flex size-12 items-center justify-center rounded-lg bg-paper-deep">
              <SparklesIcon className="size-5" />
            </div>
            <p className="max-w-xs text-sm leading-6">{emptyDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}
