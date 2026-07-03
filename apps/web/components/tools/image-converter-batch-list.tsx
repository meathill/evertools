import type { VariantProps } from "class-variance-authority";
import {
  DownloadIcon,
  PackageIcon,
  SparklesIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { ImageConverterController } from "@/hooks/use-image-converter";
import { formatBytes } from "@/lib/format";
import type { BatchItemStatus } from "@/lib/image-converter-batch";
import type { LocaleContent } from "@/messages/types";

type ImageConverterBatchListProps = {
  content: LocaleContent["imageConverter"];
  controller: ImageConverterController;
};

const STATUS_BADGE_VARIANT = {
  converting: "info",
  done: "success",
  error: "error",
  pending: "outline",
} as const satisfies Record<
  BatchItemStatus,
  VariantProps<typeof badgeVariants>["variant"]
>;

export function ImageConverterBatchList({
  content,
  controller,
}: ImageConverterBatchListProps) {
  const {
    batchProgress,
    handleDownloadAllClick,
    handleDownloadItem,
    handleGenerateAllClick,
    handleRemoveItem,
    isConverting,
    isZipping,
    items,
  } = controller;

  const statusLabels: Record<BatchItemStatus, string> = {
    converting: content.client.batch.statusConverting,
    done: content.client.batch.statusDone,
    error: content.client.batch.statusError,
    pending: content.client.batch.statusPending,
  };
  const doneCount = items.filter((item) => item.status === "done").length;

  return (
    <div className="space-y-4">
      {batchProgress ? (
        <Progress
          value={Math.round((batchProgress.done / batchProgress.total) * 100)}
        >
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
          <p className="text-mute text-xs">
            {content.client.batch.progressLabel
              .replace("{done}", String(batchProgress.done))
              .replace("{total}", String(batchProgress.total))}
          </p>
        </Progress>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-rule-strong bg-cream">
        <Table>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.previewUrl ? (
                    <img
                      alt=""
                      className="size-12 rounded-md object-cover"
                      src={item.previewUrl}
                    />
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-md bg-paper-deep/40 text-mute">
                      <TriangleAlertIcon className="size-4" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="whitespace-normal">
                  <div className="font-medium text-ink text-sm">
                    {item.originalName}
                  </div>
                  <div className="text-mute text-xs">
                    {item.width > 0
                      ? `${item.width} x ${item.height} px · `
                      : ""}
                    {formatBytes(item.size)}
                  </div>
                  {item.status === "error" && item.errorMessage ? (
                    <div className="text-danger text-xs">
                      {item.errorMessage}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE_VARIANT[item.status]}>
                    {item.status === "converting" ? (
                      <Spinner className="size-3" />
                    ) : null}
                    {statusLabels[item.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      aria-label={content.client.batch.downloadAria.replace(
                        "{name}",
                        item.originalName,
                      )}
                      disabled={item.status !== "done"}
                      onClick={() => handleDownloadItem(item.id)}
                      size="icon-sm"
                      variant="outline"
                    >
                      <DownloadIcon />
                    </Button>
                    <Button
                      aria-label={content.client.batch.removeAria.replace(
                        "{name}",
                        item.originalName,
                      )}
                      onClick={() => handleRemoveItem(item.id)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <XIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          loading={isConverting}
          onClick={handleGenerateAllClick}
          variant="press"
        >
          <SparklesIcon />
          {content.client.settings.generateAll}
        </Button>
        <Button
          disabled={doneCount === 0}
          loading={isZipping}
          onClick={handleDownloadAllClick}
          variant="press-ink"
        >
          <PackageIcon />
          {content.client.settings.downloadAll}
        </Button>
      </div>
    </div>
  );
}
