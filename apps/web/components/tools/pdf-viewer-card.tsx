"use client";

import { PdfPageCanvas } from "@/components/tools/pdf-page-canvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { EditedBlock, PdfPageMeta } from "@/lib/pdf-editor/pdf-types";
import type { LocaleContent } from "@/messages/types";

type PdfViewerCardProps = {
  activeBlockKey: string | null;
  activePage: PdfPageMeta | undefined;
  containerScale: number;
  content: LocaleContent["pdfTextEditor"];
  currentPageIndex: number;
  editedBlocks: ReadonlyMap<string, EditedBlock>;
  editedCount: number;
  onActivateBlock: (blockKey: string) => void;
  onDeactivateBlock: () => void;
  onPageChange: (pageIndex: number) => void;
  onTextChange: (blockKey: string, text: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  pagesCount: number;
};

export function PdfViewerCard({
  activeBlockKey,
  activePage,
  containerScale,
  content,
  currentPageIndex,
  editedBlocks,
  editedCount,
  onActivateBlock,
  onDeactivateBlock,
  onPageChange,
  onTextChange,
  onZoomIn,
  onZoomOut,
  pagesCount,
}: PdfViewerCardProps) {
  const pageOfText = content.client.viewer.pageOf
    .replace("{current}", String(currentPageIndex + 1))
    .replace("{total}", String(pagesCount || 1));

  return (
    <Card>
      <CardHeader className="border-b border-border/60 bg-muted/35">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{pageOfText}</Badge>
          {editedCount > 0 ? (
            <Badge variant="warning">
              {content.client.editor.editedCount.replace(
                "{count}",
                String(editedCount),
              )}
            </Badge>
          ) : null}
        </div>
        <CardTitle>{content.client.editor.title}</CardTitle>
        <CardDescription>{content.client.editor.description}</CardDescription>
      </CardHeader>
      <CardPanel>
        <div className="flex flex-wrap items-center gap-2 pb-4">
          <Button
            disabled={currentPageIndex === 0}
            onClick={() => onPageChange(Math.max(0, currentPageIndex - 1))}
            size="sm"
            variant="outline"
          >
            {content.client.viewer.prevPage}
          </Button>
          <Button
            disabled={currentPageIndex >= pagesCount - 1}
            onClick={() =>
              onPageChange(Math.min(pagesCount - 1, currentPageIndex + 1))
            }
            size="sm"
            variant="outline"
          >
            {content.client.viewer.nextPage}
          </Button>
          <Separator className="mx-1 h-6" orientation="vertical" />
          <Button onClick={onZoomOut} size="sm" variant="outline">
            {content.client.viewer.zoomOut}
          </Button>
          <span className="text-muted-foreground text-xs">
            {Math.round(containerScale * 100)}%
          </span>
          <Button onClick={onZoomIn} size="sm" variant="outline">
            {content.client.viewer.zoomIn}
          </Button>
        </div>
        <div className="overflow-auto rounded-xl bg-muted/30 p-4">
          {activePage ? (
            <PdfPageCanvas
              activeBlockKey={activeBlockKey}
              containerScale={containerScale}
              editedBlocks={editedBlocks}
              onActivateBlock={onActivateBlock}
              onDeactivateBlock={onDeactivateBlock}
              onTextChange={onTextChange}
              page={activePage}
            />
          ) : null}
        </div>
        <p className="pt-3 text-muted-foreground text-xs leading-5">
          {content.client.editor.clickToEditHint}
        </p>
      </CardPanel>
    </Card>
  );
}
