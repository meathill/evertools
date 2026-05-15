"use client";

import { DownloadIcon, UploadIcon } from "lucide-react";
import { type RefObject, useId } from "react";
import type { CjkFallbackStatus } from "@/stores/pdf-editor-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { LocaleContent } from "@/messages/types";

const USER_FONT_CSS_FAMILY = "PDF-Editor-User-Font";

type PdfExportPanelProps = {
  cjkLoadProgress: number;
  cjkStatus: CjkFallbackStatus;
  content: LocaleContent["pdfTextEditor"];
  documentKey: string | null;
  editedCount: number;
  errorMessage: string | null;
  exportErrorMessage: string | null;
  exportProgress: number;
  fontInputRef: RefObject<HTMLInputElement | null>;
  hasEdits: boolean;
  isExporting: boolean;
  isScanned: boolean;
  missingGlyphList: string | null;
  onExport: () => void;
  onFontInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveUserFont: () => void;
  pagesCount: number;
  statusMessage: string | null;
  userFontName: string | null;
};

export function PdfExportPanel({
  cjkLoadProgress,
  cjkStatus,
  content,
  documentKey,
  editedCount,
  errorMessage,
  exportErrorMessage,
  exportProgress,
  fontInputRef,
  hasEdits,
  isExporting,
  isScanned,
  missingGlyphList,
  onExport,
  onFontInputChange,
  onRemoveUserFont,
  pagesCount,
  statusMessage,
  userFontName,
}: PdfExportPanelProps) {
  const fontInputId = useId();

  return (
    <Card className="h-fit lg:sticky lg:top-24">
      <CardHeader className="border-b border-border/60 bg-muted/35">
        <CardTitle>{content.client.export.title}</CardTitle>
        <CardDescription>{content.client.export.description}</CardDescription>
      </CardHeader>
      <CardPanel className="space-y-4">
        <div className="rounded-xl bg-muted/40 px-3 py-3">
          <div className="font-medium text-sm text-foreground">
            {content.client.fonts.title}
          </div>
          <p className="pt-1 text-muted-foreground text-xs leading-5">
            {content.client.fonts.description}
          </p>
          <div className="pt-3 text-xs">
            <CjkStatusLabel
              content={content}
              progress={cjkLoadProgress}
              status={cjkStatus}
            />
          </div>
          <Separator className="my-3" />
          <input
            accept=".ttf,.otf"
            className="sr-only"
            id={fontInputId}
            onChange={onFontInputChange}
            ref={fontInputRef}
            type="file"
          />
          {userFontName ? (
            <div className="flex items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-medium text-foreground">
                  {userFontName}
                </div>
                <div
                  className="text-muted-foreground"
                  style={{
                    fontFamily: `"${USER_FONT_CSS_FAMILY}", sans-serif`,
                  }}
                >
                  Aa Bb 字体预览 サンプル
                </div>
              </div>
              <Button onClick={onRemoveUserFont} size="sm" variant="ghost">
                {content.client.fonts.removeUserFont}
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
          <p className="pt-2 text-muted-foreground text-xs leading-5">
            {content.client.fonts.acceptedFontTypes}
          </p>
        </div>

        {statusMessage ? (
          <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-emerald-700 text-xs">
            {statusMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/6 px-3 py-2.5 text-destructive-foreground text-sm">
            {errorMessage}
          </div>
        ) : null}

        {exportErrorMessage ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/6 px-3 py-2.5 text-destructive-foreground text-sm">
            <div>{exportErrorMessage}</div>
            {missingGlyphList ? (
              <div className="pt-1 text-xs">
                {content.client.export.missingGlyphChars.replace(
                  "{chars}",
                  missingGlyphList,
                )}
              </div>
            ) : null}
          </div>
        ) : null}

        {isExporting ? (
          <div className="rounded-xl bg-muted/40 px-3 py-2 text-xs">
            {content.client.export.exporting} {Math.round(exportProgress * 100)}
            %
          </div>
        ) : null}

        <Button
          disabled={
            !documentKey || isScanned || pagesCount === 0 || isExporting
          }
          loading={isExporting}
          onClick={onExport}
        >
          <DownloadIcon />
          {hasEdits
            ? content.client.export.buttonEdited
            : content.client.export.button}
        </Button>
        <p className="text-muted-foreground text-xs leading-5">
          {hasEdits
            ? content.client.export.editedHint.replace(
                "{count}",
                String(editedCount),
              )
            : content.client.export.cleanHint}
        </p>
      </CardPanel>
    </Card>
  );
}

type CjkStatusLabelProps = {
  content: LocaleContent["pdfTextEditor"];
  progress: number;
  status: CjkFallbackStatus;
};

function CjkStatusLabel({ content, progress, status }: CjkStatusLabelProps) {
  if (status === "idle") {
    return (
      <span className="text-muted-foreground">
        {content.client.fonts.cjkIdle}
      </span>
    );
  }
  if (status === "loading") {
    return (
      <span className="text-foreground">
        {content.client.fonts.cjkLoading} {Math.round(progress * 100)}%
      </span>
    );
  }
  if (status === "ready") {
    return (
      <span className="text-emerald-700">{content.client.fonts.cjkReady}</span>
    );
  }
  return (
    <span className="text-destructive-foreground">
      {content.client.fonts.cjkFailed}
    </span>
  );
}
