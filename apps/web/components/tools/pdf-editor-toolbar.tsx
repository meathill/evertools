"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  RefreshCcwIcon,
  UploadIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { type RefObject, useId } from "react";
import type { CjkFallbackStatus } from "@/stores/pdf-editor-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { LocaleContent } from "@/messages/types";

type PdfEditorToolbarProps = {
  cjkLoadProgress: number;
  cjkStatus: CjkFallbackStatus;
  containerScale: number;
  content: LocaleContent["pdfTextEditor"];
  currentPageIndex: number;
  documentKey: string | null;
  editedCount: number;
  errorMessage: string | null;
  exportErrorMessage: string | null;
  exportProgress: number;
  fileName: string;
  fileSize: number;
  fontInputRef: RefObject<HTMLInputElement | null>;
  hasEdits: boolean;
  isExporting: boolean;
  isScanned: boolean;
  missingGlyphList: string | null;
  onClear: () => void;
  onExport: () => void;
  onFontInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (pageIndex: number) => void;
  onRemoveUserFont: () => void;
  onReselect: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  pagesCount: number;
  statusMessage: string | null;
  userFontName: string | null;
};

export function PdfEditorToolbar({
  cjkLoadProgress,
  cjkStatus,
  containerScale,
  content,
  currentPageIndex,
  documentKey,
  editedCount,
  errorMessage,
  exportErrorMessage,
  exportProgress,
  fileName,
  fileSize,
  fontInputRef,
  hasEdits,
  isExporting,
  isScanned,
  missingGlyphList,
  onClear,
  onExport,
  onFontInputChange,
  onPageChange,
  onRemoveUserFont,
  onReselect,
  onZoomIn,
  onZoomOut,
  pagesCount,
  statusMessage,
  userFontName,
}: PdfEditorToolbarProps) {
  const fontInputId = useId();

  return (
    <div className="sticky top-0 z-20 border-b border-rule/60 bg-cream/80 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-3 px-4 py-2">
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-sm text-ink">
            {fileName}
          </div>
          <div className="text-mute text-xs">
            {formatFileSize(fileSize)} · {pagesCount}{" "}
            {content.client.upload.pageCountLabel.replace("{count}", "")}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={currentPageIndex === 0}
            onClick={() => onPageChange(Math.max(0, currentPageIndex - 1))}
            size="sm"
            variant="outline"
          >
            <ChevronLeftIcon />
          </Button>
          <span className="text-sm text-mute">
            {currentPageIndex + 1} / {pagesCount}
          </span>
          <Button
            disabled={currentPageIndex >= pagesCount - 1}
            onClick={() =>
              onPageChange(Math.min(pagesCount - 1, currentPageIndex + 1))
            }
            size="sm"
            variant="outline"
          >
            <ChevronRightIcon />
          </Button>
        </div>

        <Separator className="h-6" orientation="vertical" />

        <div className="flex items-center gap-2">
          <Button onClick={onZoomOut} size="sm" variant="outline">
            <ZoomOutIcon />
          </Button>
          <span className="text-sm text-mute">
            {Math.round(containerScale * 100)}%
          </span>
          <Button onClick={onZoomIn} size="sm" variant="outline">
            <ZoomInIcon />
          </Button>
        </div>

        <Separator className="h-6" orientation="vertical" />

        <div className="flex items-center gap-2">
          <input
            accept=".ttf,.otf"
            className="sr-only"
            id={fontInputId}
            onChange={onFontInputChange}
            ref={fontInputRef}
            type="file"
          />
          {userFontName ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-mute">{userFontName}</span>
              <Button onClick={onRemoveUserFont} size="sm" variant="ghost">
                <RefreshCcwIcon />
              </Button>
            </div>
          ) : (
            <Button
              disabled={!documentKey}
              onClick={() => fontInputRef.current?.click()}
              size="sm"
              variant="outline"
            >
              <UploadIcon />
              {content.client.fonts.uploadFontButton}
            </Button>
          )}
        </div>

        <Separator className="h-6" orientation="vertical" />

        <div className="flex items-center gap-2">
          {editedCount > 0 && (
            <Badge variant="warning">
              {content.client.editor.editedCount.replace(
                "{count}",
                String(editedCount),
              )}
            </Badge>
          )}
          <Button
            disabled={
              !documentKey || isScanned || pagesCount === 0 || isExporting
            }
            loading={isExporting}
            onClick={onExport}
            size="sm"
            variant="press"
          >
            <DownloadIcon />
            {hasEdits
              ? content.client.export.buttonEdited
              : content.client.export.button}
          </Button>
        </div>

        <Separator className="h-6" orientation="vertical" />

        <div className="flex items-center gap-2">
          <Button onClick={onReselect} size="sm" variant="outline">
            {content.client.upload.reselect}
          </Button>
          <Button onClick={onClear} size="sm" variant="ghost">
            <RefreshCcwIcon />
            {content.client.upload.clear}
          </Button>
        </div>
      </div>

      {(statusMessage || errorMessage || exportErrorMessage) && (
        <div className="border-t border-rule/60 px-4 py-2">
          {statusMessage && (
            <div className="rounded-lg bg-success-bg px-3 py-2 text-success text-xs">
              {statusMessage}
            </div>
          )}
          {errorMessage && (
            <div className="rounded-lg border border-danger/30 bg-danger-bg px-3 py-2 text-danger text-xs">
              {errorMessage}
            </div>
          )}
          {exportErrorMessage && (
            <div className="rounded-lg border border-danger/30 bg-danger-bg px-3 py-2 text-danger text-xs">
              <div>{exportErrorMessage}</div>
              {missingGlyphList && (
                <div className="mt-1">
                  {content.client.export.missingGlyphChars.replace(
                    "{chars}",
                    missingGlyphList,
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
