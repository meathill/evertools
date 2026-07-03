"use client";

import {
  FileTextIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  UploadIcon,
} from "lucide-react";
import { type RefObject, useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { formatBytes } from "@/lib/format";
import { MAX_PDF_FILE_SIZE } from "@/lib/pdf-editor/pdf-types";
import type { LocaleContent } from "@/messages/types";

type PdfUploadCardProps = {
  content: LocaleContent["pdfTextEditor"];
  fileName: string | null;
  fileSize: number;
  inputRef: RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  isLoading: boolean;
  isScanned: boolean;
  onClear: () => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  pagesCount: number;
};

export function PdfUploadCard({
  content,
  fileName,
  fileSize,
  inputRef,
  isDragging,
  isLoading,
  isScanned,
  onClear,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileInputChange,
  pagesCount,
}: PdfUploadCardProps) {
  const inputId = useId();

  return (
    <Card className="overflow-hidden border-2 border-ink shadow-press-ink">
      <CardHeader className="border-b border-rule/60 bg-paper-deep/35">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">
            <ShieldCheckIcon />
            {content.client.badges.localProcessing}
          </Badge>
          <Badge variant="outline">
            {content.client.badges.supportedFormats}
          </Badge>
          <Badge variant="secondary">{content.client.badges.beta}</Badge>
          {isScanned ? (
            <Badge variant="warning">
              {content.client.badges.scannedDetected}
            </Badge>
          ) : null}
        </div>
        <div className="space-y-2">
          <CardTitle>{content.client.upload.title}</CardTitle>
          <CardDescription>{content.client.upload.description}</CardDescription>
        </div>
      </CardHeader>
      <CardPanel>
        <div
          className={[
            "rounded-lg border-2 border-dashed p-5 transition-colors sm:p-6",
            isDragging
              ? "border-yellow bg-fluff/60"
              : "border-rule-strong bg-paper-deep/25",
          ].join(" ")}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <input
            accept="application/pdf,.pdf"
            className="sr-only"
            id={inputId}
            onChange={onFileInputChange}
            ref={inputRef}
            type="file"
          />
          {fileName ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-medium text-sm text-ink">{fileName}</div>
                <div className="text-mute text-xs">
                  {formatBytes(fileSize)} ·{" "}
                  {content.client.upload.pageCountLabel.replace(
                    "{count}",
                    String(pagesCount),
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => inputRef.current?.click()}
                  size="sm"
                  variant="outline"
                >
                  {content.client.upload.reselect}
                </Button>
                <Button onClick={onClear} size="sm" variant="ghost">
                  <RefreshCcwIcon />
                  {content.client.upload.clear}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-lg bg-yellow text-ink shadow-press-yellow">
                <FileTextIcon className="size-6" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-lg text-ink">
                  {content.client.upload.emptyTitle}
                </div>
                <p className="max-w-md text-mute text-sm leading-6">
                  {content.client.upload.emptyDescription}
                </p>
              </div>
              <Button
                loading={isLoading}
                onClick={() => inputRef.current?.click()}
                variant="press"
              >
                <UploadIcon />
                {content.client.upload.choosePdf}
              </Button>
              <p className="text-mute text-xs">
                {content.client.upload.maxSizeHint.replace(
                  "{size}",
                  formatBytes(MAX_PDF_FILE_SIZE),
                )}
              </p>
            </div>
          )}
        </div>
      </CardPanel>
    </Card>
  );
}
