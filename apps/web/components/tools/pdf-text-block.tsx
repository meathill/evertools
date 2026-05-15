"use client";

import { useEffect, useRef } from "react";
import type { PdfTextBlock } from "@/lib/pdf-editor/pdf-types";

type PdfTextBlockProps = {
  block: PdfTextBlock;
  blockKey: string;
  editedText: string | null;
  isActive: boolean;
  onActivate: (blockKey: string) => void;
  onDeactivate: () => void;
  onTextChange: (blockKey: string, text: string) => void;
};

export function PdfTextBlockView({
  block,
  blockKey,
  editedText,
  isActive,
  onActivate,
  onDeactivate,
  onTextChange,
}: PdfTextBlockProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const currentText = editedText ?? block.text;
  const isDirty = editedText !== null && editedText !== block.text;

  useEffect(() => {
    if (!isActive || !spanRef.current) {
      return;
    }
    if (document.activeElement === spanRef.current) {
      return;
    }
    spanRef.current.focus();
    placeCaretAtEnd(spanRef.current);
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      return;
    }
    if (!spanRef.current) {
      return;
    }
    if (spanRef.current.textContent !== currentText) {
      spanRef.current.textContent = currentText;
    }
  }, [currentText, isActive]);

  const transform = block.transform;
  const baseline = transform[5];
  const ascentScale = 0.8;
  const top = baseline - block.height * ascentScale;
  const fontSize = Math.max(1, block.fontSize);

  function handlePointerDown(event: React.PointerEvent<HTMLSpanElement>) {
    event.stopPropagation();
    if (!isActive) {
      onActivate(blockKey);
    }
  }

  function handleInput(event: React.FormEvent<HTMLSpanElement>) {
    const value = (event.currentTarget.textContent ?? "").replace(
      /\r?\n/g,
      " ",
    );
    onTextChange(blockKey, value);
  }

  function handleBlur() {
    onDeactivate();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Escape" || event.key === "Enter") {
      event.preventDefault();
      spanRef.current?.blur();
    }
  }

  return (
    <span
      className={[
        "pointer-events-auto absolute origin-top-left cursor-text whitespace-pre rounded-sm px-[1px] outline-none",
        "transition-[background-color,box-shadow]",
        isActive
          ? "bg-white text-foreground shadow-[0_0_0_2px_rgb(59_130_246/.6)]"
          : isDirty
            ? "bg-amber-100/80 hover:bg-amber-200/90"
            : "bg-transparent text-transparent hover:bg-primary/15 hover:text-foreground/80",
      ].join(" ")}
      contentEditable={isActive}
      data-pdf-block-key={blockKey}
      onBlur={handleBlur}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      ref={spanRef}
      role="textbox"
      style={{
        fontFamily: `"${block.fontName}", sans-serif`,
        fontSize: `${fontSize}px`,
        left: `${transform[4]}px`,
        lineHeight: 1,
        top: `${Math.max(0, top)}px`,
      }}
      suppressContentEditableWarning
      tabIndex={0}
    >
      {currentText}
    </span>
  );
}

function placeCaretAtEnd(node: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  selection.removeAllRanges();
  selection.addRange(range);
}
