"use client";

import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress";
import type { LocaleContent } from "@/messages/types";

type PdfPasswordRemoverLoadingDialogProps = {
  content: LocaleContent["pdfPasswordRemover"]["client"]["loading"];
  open: boolean;
  percent: number | null;
  hasError: boolean;
  onRetry: () => void;
};

export function PdfPasswordRemoverLoadingDialog({
  content,
  open,
  percent,
  hasError,
  onRetry,
}: PdfPasswordRemoverLoadingDialogProps) {
  return (
    <Dialog open={open}>
      <DialogPopup
        bottomStickOnMobile={false}
        className="max-w-md"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            {!hasError ? (
              <Loader2Icon className="size-5 animate-spin text-primary" />
            ) : null}
            <DialogTitle>{content.title}</DialogTitle>
          </div>
          <DialogDescription>
            {hasError ? content.failed : content.description}
          </DialogDescription>
        </DialogHeader>
        {!hasError ? (
          <DialogPanel>
            <Progress value={percent} max={100}>
              <div className="flex items-center justify-between">
                <ProgressValue />
              </div>
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
            <p className="mt-2 text-muted-foreground text-xs">
              {content.progress.replace(
                "{percent}",
                percent === null ? "…" : String(percent),
              )}
            </p>
          </DialogPanel>
        ) : null}
        {hasError ? (
          <DialogFooter>
            <Button onClick={onRetry} variant="press">
              {content.retry}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogPopup>
    </Dialog>
  );
}
