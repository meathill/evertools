"use client";

import { useMemo } from "react";
import { PdfTextBlockView } from "@/components/tools/pdf-text-block";
import type { EditedBlock, PdfPageMeta } from "@/lib/pdf-editor/pdf-types";
import { buildBlockKey } from "@/lib/pdf-editor/pdf-types";

type PdfPageCanvasProps = {
  activeBlockKey: string | null;
  containerScale: number;
  editedBlocks: ReadonlyMap<string, EditedBlock>;
  onActivateBlock: (blockKey: string) => void;
  onDeactivateBlock: () => void;
  onTextChange: (blockKey: string, text: string) => void;
  page: PdfPageMeta;
};

export function PdfPageCanvas({
  activeBlockKey,
  containerScale,
  editedBlocks,
  onActivateBlock,
  onDeactivateBlock,
  onTextChange,
  page,
}: PdfPageCanvasProps) {
  const wrapperStyle = useMemo(
    () => ({
      height: `${page.height * containerScale}px`,
      width: `${page.width * containerScale}px`,
    }),
    [page.height, page.width, containerScale],
  );

  const innerStyle = useMemo(
    () => ({
      height: `${page.height}px`,
      transform: `scale(${containerScale})`,
      transformOrigin: "top left",
      width: `${page.width}px`,
    }),
    [page.height, page.width, containerScale],
  );

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border bg-white shadow-sm"
      style={wrapperStyle}
    >
      <div className="relative" style={innerStyle}>
        {/* biome-ignore lint/performance/noImgElement: page raster is a runtime blob/data URL */}
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 select-none"
          draggable={false}
          height={page.height}
          src={page.canvasDataUrl}
          style={{ height: `${page.height}px`, width: `${page.width}px` }}
          width={page.width}
        />
        <div className="pointer-events-none absolute inset-0">
          {page.textBlocks.map((block) => {
            const blockKey = buildBlockKey(page.pageIndex, block.blockId);
            const edited = editedBlocks.get(blockKey);
            return (
              <PdfTextBlockView
                block={block}
                blockKey={blockKey}
                editedText={edited?.newText ?? null}
                isActive={activeBlockKey === blockKey}
                key={blockKey}
                onActivate={onActivateBlock}
                onDeactivate={onDeactivateBlock}
                onTextChange={onTextChange}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
