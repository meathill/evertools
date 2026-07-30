"use client";

import { FileTextIcon, PrinterIcon, UploadIcon, XIcon } from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  useDeferredValue,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  buildPrintableHtml,
  estimatePageCount,
  type MarkdownStyle,
  type PageWidth,
  readMarkdownFile,
  renderMarkdown,
} from "@/lib/markdown-to-pdf";
import type { LocaleContent } from "@/messages/types";

type MarkdownToPdfClientProps = {
  content: LocaleContent["markdownToPdf"];
};

const PREVIEW_CLASS_NAME: Record<MarkdownStyle, string> = {
  classic: "md-preview text-sm",
  "tailwind-typography": "prose prose-sm dark:prose-invert max-w-none",
  "shadcn-typeset": "typeset typeset-md-pdf",
};

export function MarkdownToPdfClient({ content }: MarkdownToPdfClientProps) {
  const t = content.client;
  const [markdown, setMarkdown] = useState("");
  const [pageWidth, setPageWidth] = useState<PageWidth>("phone");
  const [style, setStyle] = useState<MarkdownStyle>("shadcn-typeset");
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputId = useId();

  const deferredMarkdown = useDeferredValue(markdown);

  const previewHtml = useMemo(
    () => (deferredMarkdown.trim() ? renderMarkdown(deferredMarkdown) : null),
    [deferredMarkdown],
  );

  const pageWidthOptions: { label: string; value: PageWidth }[] = [
    { label: t.toolbar.pageWidthOptions.phone, value: "phone" },
    { label: t.toolbar.pageWidthOptions.a5, value: "a5" },
    { label: t.toolbar.pageWidthOptions.a4, value: "a4" },
  ];

  const styleOptions: { label: string; value: MarkdownStyle }[] = [
    { label: t.toolbar.styleOptions.shadcnTypeset, value: "shadcn-typeset" },
    {
      label: t.toolbar.styleOptions.tailwindTypography,
      value: "tailwind-typography",
    },
    { label: t.toolbar.styleOptions.classic, value: "classic" },
  ];

  async function processFile(file: File) {
    setFileError(null);
    try {
      const text = await readMarkdownFile(file);
      setMarkdown(text);
      setFileName(file.name);
    } catch (error) {
      if (error instanceof Error && error.message === "FILE_TOO_LARGE") {
        setFileError(t.input.fileTooLarge);
      } else {
        setFileError(t.input.fileError);
      }
    }
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
    event.target.value = "";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }

  function handleClear() {
    setMarkdown("");
    setFileName(null);
    setFileError(null);
    setPopupBlocked(false);
  }

  function handlePrint() {
    setPopupBlocked(false);
    const html = buildPrintableHtml(markdown, pageWidth, style);
    const win = window.open("", "_blank");
    if (!win) {
      setPopupBlocked(true);
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  const charCount = markdown.length;
  const pageCount = estimatePageCount(markdown);
  const isEmpty = markdown.trim() === "";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-2 border-ink shadow-press-ink">
        <CardHeader className="flex items-center justify-between border-rule border-b bg-paper-deep/50">
          <CardTitle className="text-base">{t.input.title}</CardTitle>
          <div className="flex items-center gap-2">
            <input
              accept=".md,.markdown,.mdown,.mkd,.mkdn,.txt,.text,text/markdown,text/plain"
              className="sr-only"
              id={inputId}
              onChange={handleFileInputChange}
              ref={fileInputRef}
              type="file"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              variant="outline"
            >
              <UploadIcon />
              {t.input.upload}
            </Button>
            <Button
              disabled={isEmpty && !fileName}
              onClick={handleClear}
              size="sm"
              variant="ghost"
            >
              <XIcon />
              {t.input.clear}
            </Button>
          </div>
        </CardHeader>
        <CardPanel
          className={[
            "flex flex-col gap-3 transition-colors",
            isDragging
              ? "bg-fluff/50 outline-2 outline-dashed outline-yellow"
              : "",
          ].join(" ")}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {fileName ? (
            <div className="flex items-center justify-between rounded border border-rule/60 bg-paper-deep/60 px-3 py-1.5 text-ink-soft text-xs">
              <span className="flex items-center gap-1.5 truncate font-medium">
                <FileTextIcon className="size-3.5 shrink-0 text-mute" />
                {t.input.loadedFile.replace("{name}", fileName)}
              </span>
              <Button
                className="h-auto p-0 text-mute hover:text-ink"
                onClick={() => setFileName(null)}
                size="sm"
                variant="ghost"
              >
                <XIcon className="size-3" />
              </Button>
            </div>
          ) : null}

          {fileError ? (
            <div className="rounded-lg border border-danger/40 bg-danger-bg p-2.5 text-danger text-xs">
              {fileError}
            </div>
          ) : null}

          <Textarea
            className="font-mono text-xs leading-relaxed [&_textarea]:max-h-[34rem] [&_textarea]:min-h-[26rem]"
            onChange={(event) => {
              setMarkdown(event.target.value);
              if (fileError) {
                setFileError(null);
              }
            }}
            placeholder={t.input.placeholder}
            spellCheck={false}
            value={markdown}
          />
          <div className="flex items-center gap-2 text-mute text-xs">
            {!isEmpty && (
              <Badge variant="outline">
                {t.toolbar.estimatedPages.replace("{count}", String(pageCount))}
              </Badge>
            )}
            <span className="ml-auto tabular-nums">
              {t.toolbar.wordCount.replace("{count}", String(charCount))}
            </span>
          </div>
        </CardPanel>
      </Card>

      <Card className="border-2 border-ink shadow-press-ink">
        <CardHeader className="flex flex-wrap items-center justify-between gap-2 border-rule border-b bg-paper-deep/50">
          <CardTitle className="text-base">{t.preview.title}</CardTitle>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Select
              onValueChange={(value) => setStyle(value as MarkdownStyle)}
              value={style}
            >
              <SelectTrigger aria-label={t.toolbar.style} size="sm">
                <SelectValue>
                  {styleOptions.find((o) => o.value === style)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>
                {styleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
            <Select
              onValueChange={(value) => setPageWidth(value as PageWidth)}
              value={pageWidth}
            >
              <SelectTrigger aria-label={t.toolbar.pageWidth} size="sm">
                <SelectValue>
                  {pageWidthOptions.find((o) => o.value === pageWidth)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>
                {pageWidthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
            <Button
              disabled={isEmpty}
              onClick={handlePrint}
              size="sm"
              variant="press"
            >
              <PrinterIcon />
              {t.toolbar.print}
            </Button>
          </div>
        </CardHeader>
        <CardPanel className="max-h-[34rem] min-h-[26rem] overflow-auto">
          {popupBlocked && (
            <div className="mb-4 rounded-lg border border-warning/40 bg-warning-bg p-3 text-ink-soft text-sm">
              {t.toolbar.popupBlockedWarning}
            </div>
          )}
          {isEmpty ? (
            <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 text-center text-mute">
              <FileTextIcon className="size-10 text-rule-strong" />
              <p className="font-bold text-ink-soft">{t.empty.title}</p>
              <p className="max-w-xs text-sm">{t.empty.description}</p>
            </div>
          ) : (
            <div
              className={PREVIEW_CLASS_NAME[style]}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: previewHtml ?? "" }}
            />
          )}
        </CardPanel>
      </Card>
    </div>
  );
}
