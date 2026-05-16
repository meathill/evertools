"use client";

import { PdfPageCanvas } from "@/components/tools/pdf-page-canvas";
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
  return (
    <div className="flex flex-col items-center">
      <div className="w-full overflow-auto rounded-xl bg-muted/30 p-4">
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
      <p className="mt-3 text-center text-muted-foreground text-xs leading-5">
        {content.client.editor.clickToEditHint}
      </p>
    </div>
  );
}
