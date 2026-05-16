"use client";

import { RefreshCcwIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PdfEditorToolbar } from "@/components/tools/pdf-editor-toolbar";
import { PdfUploadCard } from "@/components/tools/pdf-upload-card";
import { PdfViewerCard } from "@/components/tools/pdf-viewer-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { ensureCjkFallbackFont } from "@/lib/pdf-editor/pdf-cjk-fallback";
import { getPdfEditorErrorMessage } from "@/lib/pdf-editor/pdf-error-messages";
import {
  PDF_EDITOR_ERROR_CODES,
  parsePdfEditorError,
} from "@/lib/pdf-editor/pdf-errors";
import { exportEditedPdf } from "@/lib/pdf-editor/pdf-exporter";
import {
  clearDocumentFonts,
  registerUserFontFace,
  setUserFont,
  storeOriginalBytes,
  takeOriginalBytes,
} from "@/lib/pdf-editor/pdf-fonts";
import { parsePdfFile } from "@/lib/pdf-editor/pdf-parser";
import {
  buildOutputFilename,
  containsCjk,
  isAcceptedFontName,
  isAcceptedPdfType,
  MAX_PDF_FILE_SIZE,
} from "@/lib/pdf-editor/pdf-types";
import type { LocaleContent } from "@/messages/types";
import { usePdfEditorStore } from "@/stores/pdf-editor-store";

type PdfTextEditorClientProps = {
  content: LocaleContent["pdfTextEditor"];
};

const USER_FONT_CSS_FAMILY = "PDF-Editor-User-Font";

export function PdfTextEditorClient({ content }: PdfTextEditorClientProps) {
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const fontInputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [containerScale, setContainerScale] = useState(0.7);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const {
    activeBlockKey,
    cjkLoadProgress,
    cjkStatus,
    currentPageIndex,
    documentKey,
    editedBlocks,
    errorCode,
    errorDetail,
    exportError,
    exportMissingGlyphs,
    exportProgress,
    fileName,
    fileSize,
    isExporting,
    isLoading,
    isScanned,
    pages,
    textBlocksByKey,
    userFontName,
    clearError,
    clearUserFont,
    discardBlockEdit,
    finishExport,
    finishImport,
    reset,
    setActiveBlock,
    setCjkProgress,
    setCjkStatus,
    setCurrentPageIndex,
    setError,
    setExportError,
    setExportProgress,
    setUserFont: setUserFontInStore,
    startExport,
    startImport,
    updateBlockText,
  } = usePdfEditorStore();

  useEffect(() => {
    return () => {
      if (documentKey) {
        clearDocumentFonts(documentKey);
      }
    };
  }, [documentKey]);

  const hasEdits = editedBlocks.size > 0;
  const activePage = pages[currentPageIndex];

  async function handlePdfFile(file: File) {
    if (
      !isAcceptedPdfType(file.type) &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError(PDF_EDITOR_ERROR_CODES.UNSUPPORTED_FORMAT);
      return;
    }
    if (file.size > MAX_PDF_FILE_SIZE) {
      setError(PDF_EDITOR_ERROR_CODES.FILE_TOO_LARGE);
      return;
    }

    const nextDocumentKey = `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    startImport(file.name, file.size);

    try {
      const { originalBytes, result } = await parsePdfFile({
        documentKey: nextDocumentKey,
        file,
      });
      storeOriginalBytes(nextDocumentKey, originalBytes);
      finishImport(result, nextDocumentKey);

      const pdfHasCjk = result.pages.some((page) =>
        page.textBlocks.some((block) => containsCjk(block.text)),
      );
      if (pdfHasCjk) {
        void primeCjkFallback();
      }
    } catch (error) {
      const parsed = parsePdfEditorError(error);
      setError(
        parsed.code ?? PDF_EDITOR_ERROR_CODES.LOAD_FAILED,
        parsed.detail,
      );
    }
  }

  async function primeCjkFallback() {
    if (cjkStatus === "ready" || cjkStatus === "loading") {
      return;
    }
    setCjkStatus("loading");
    setCjkProgress(0);
    try {
      await ensureCjkFallbackFont((loaded, total) => {
        if (total > 0) {
          setCjkProgress(loaded / total);
        }
      });
      setCjkStatus("ready");
    } catch {
      setCjkStatus("failed");
    }
  }

  function handlePdfInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      void handlePdfFile(file);
    }
    event.currentTarget.value = "";
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      void handlePdfFile(file);
    }
  }

  async function handleFontFile(file: File) {
    if (!isAcceptedFontName(file.name)) {
      setError(PDF_EDITOR_ERROR_CODES.UNSUPPORTED_FONT);
      return;
    }
    if (!documentKey) {
      return;
    }
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      setUserFont(documentKey, { bytes, fileName: file.name });
      await registerUserFontFace(
        { bytes, fileName: file.name },
        USER_FONT_CSS_FAMILY,
      );
      setUserFontInStore(file.name);
      clearError();
      setStatusMessage(
        content.client.fonts.userFontLoaded.replace("{name}", file.name),
      );
    } catch {
      setError(PDF_EDITOR_ERROR_CODES.UNSUPPORTED_FONT);
    }
  }

  function handleFontInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      void handleFontFile(file);
    }
    event.currentTarget.value = "";
  }

  function handleRemoveUserFont() {
    if (!documentKey) {
      return;
    }
    setUserFont(documentKey, null);
    clearUserFont();
    setStatusMessage(null);
  }

  async function handleExport() {
    if (!documentKey || pages.length === 0) {
      return;
    }
    const originalBytes = takeOriginalBytes(documentKey);
    if (!originalBytes) {
      setExportError(PDF_EDITOR_ERROR_CODES.EXPORT_FAILED);
      return;
    }

    startExport();
    try {
      const { bytes, missingGlyphBlocks } = await exportEditedPdf({
        documentKey,
        editedBlocks,
        onProgress: (current, total) => {
          if (total > 0) {
            setExportProgress(current / total);
          }
        },
        originalBytes,
        pages,
        textBlocksByKey,
      });
      storeOriginalBytes(documentKey, originalBytes);
      finishExport(missingGlyphBlocks);

      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = buildOutputFilename(fileName ?? "document.pdf");
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      if (missingGlyphBlocks.length > 0) {
        setExportError(PDF_EDITOR_ERROR_CODES.FONT_MISSING_GLYPH);
      }
    } catch (error) {
      storeOriginalBytes(documentKey, originalBytes);
      const parsed = parsePdfEditorError(error);
      setExportError(parsed.code ?? PDF_EDITOR_ERROR_CODES.EXPORT_FAILED);
    }
  }

  function handleReset() {
    if (documentKey) {
      clearDocumentFonts(documentKey);
    }
    reset();
    setStatusMessage(null);
  }

  const errorMessage = useMemo(
    () =>
      errorCode
        ? getPdfEditorErrorMessage(errorCode, errorDetail, content)
        : null,
    [errorCode, errorDetail, content],
  );
  const exportErrorMessage = useMemo(
    () =>
      exportError ? getPdfEditorErrorMessage(exportError, null, content) : null,
    [exportError, content],
  );

  const missingGlyphList = useMemo(() => {
    if (exportMissingGlyphs.size === 0) {
      return null;
    }
    const allChars = new Set<string>();
    for (const chars of exportMissingGlyphs.values()) {
      for (const ch of chars) {
        allChars.add(ch);
      }
    }
    return Array.from(allChars).join(" ");
  }, [exportMissingGlyphs]);

  return (
    <div className="flex flex-col">
      {pages.length > 0 ? (
        <PdfEditorToolbar
          cjkLoadProgress={cjkLoadProgress}
          cjkStatus={cjkStatus}
          containerScale={containerScale}
          content={content}
          currentPageIndex={currentPageIndex}
          documentKey={documentKey}
          editedCount={editedBlocks.size}
          errorMessage={errorMessage}
          exportErrorMessage={exportErrorMessage}
          exportProgress={exportProgress}
          fileName={fileName ?? ""}
          fileSize={fileSize}
          fontInputRef={fontInputRef}
          hasEdits={hasEdits}
          isExporting={isExporting}
          isScanned={isScanned}
          missingGlyphList={missingGlyphList}
          onClear={handleReset}
          onExport={handleExport}
          onFontInputChange={handleFontInputChange}
          onPageChange={setCurrentPageIndex}
          onRemoveUserFont={handleRemoveUserFont}
          onReselect={() => pdfInputRef.current?.click()}
          onZoomIn={() =>
            setContainerScale((value) => Math.min(2, value + 0.1))
          }
          onZoomOut={() =>
            setContainerScale((value) => Math.max(0.3, value - 0.1))
          }
          pagesCount={pages.length}
          statusMessage={statusMessage}
          userFontName={userFontName}
        />
      ) : null}

      <div className="flex-1">
        {pages.length === 0 ? (
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
            <PdfUploadCard
              content={content}
              fileName={fileName}
              fileSize={fileSize}
              inputRef={pdfInputRef}
              isDragging={isDragging}
              isLoading={isLoading}
              isScanned={isScanned}
              onClear={handleReset}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onFileInputChange={handlePdfInputChange}
              pagesCount={pages.length}
            />
          </div>
        ) : isScanned ? (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>{content.client.scanned.title}</CardTitle>
                <CardDescription>
                  {content.client.scanned.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : (
          <div className="p-6">
            <PdfViewerCard
              activeBlockKey={activeBlockKey}
              activePage={activePage}
              containerScale={containerScale}
              content={content}
              currentPageIndex={currentPageIndex}
              editedBlocks={editedBlocks}
              editedCount={editedBlocks.size}
              onActivateBlock={(key) => setActiveBlock(key)}
              onDeactivateBlock={() => setActiveBlock(null)}
              onPageChange={setCurrentPageIndex}
              onTextChange={updateBlockText}
              onZoomIn={() =>
                setContainerScale((value) => Math.min(2, value + 0.1))
              }
              onZoomOut={() =>
                setContainerScale((value) => Math.max(0.3, value - 0.1))
              }
              pagesCount={pages.length}
            />
          </div>
        )}
      </div>

      <input
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={handlePdfInputChange}
        ref={pdfInputRef}
        type="file"
      />
    </div>
  );
}
