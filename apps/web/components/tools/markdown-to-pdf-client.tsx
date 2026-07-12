"use client";

import { FileTextIcon, PrinterIcon, XIcon } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
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

  function handleClear() {
    setMarkdown("");
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
          <Button
            disabled={isEmpty}
            onClick={handleClear}
            size="sm"
            variant="ghost"
          >
            <XIcon />
            {t.input.clear}
          </Button>
        </CardHeader>
        <CardPanel className="flex flex-col gap-3">
          <Textarea
            className="font-mono text-xs leading-relaxed [&_textarea]:max-h-[34rem] [&_textarea]:min-h-[26rem]"
            onChange={(event) => setMarkdown(event.target.value)}
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
            <div className="mb-4 rounded-lg border border-warning/40 bg-warning-bg p-3 text-sm text-ink-soft">
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
