// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { ImageConverterUploadCard } from "@/components/tools/image-converter-upload-card";
import type { ImageConverterController } from "@/hooks/use-image-converter";
import type { BatchItem } from "@/lib/image-converter-batch";
import { getLocaleContent } from "@/messages";

const content = getLocaleContent("zh").imageConverter;
const animatedNote = content.client.batch.animatedNote;

function makeItem(type: string): BatchItem {
  return {
    errorMessage: null,
    file: new File([new Uint8Array([1])], "t.img", { type }),
    height: 1,
    id: "item-1",
    originalName: "t.img",
    previewUrl: "blob:preview",
    result: null,
    size: 43,
    status: "pending",
    type,
    width: 1,
  };
}

// 单图模式走 PreviewCard 而不是 BatchList，首帧徽标必须在这里也出现，
// 否则最常见的单张 GIF 转换看不到任何提示（线上验收发现）。
function renderCard(item: BatchItem) {
  const controller = {
    acceptedFormatsText: "PNG / GIF",
    firstItem: item,
    handleBrowseClick: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDragOver: vi.fn(),
    handleDrop: vi.fn(),
    handleFileInputChange: vi.fn(),
    handleResetClick: vi.fn(),
    inputId: "image-input",
    inputRef: { current: null },
    isDragging: false,
    isPreparing: false,
    isResultStale: false,
    items: [item],
  } as unknown as ImageConverterController;

  return render(
    React.createElement(ImageConverterUploadCard, { content, controller }),
  );
}

describe("image converter upload card", () => {
  it("shows the first-frame note for a single GIF", () => {
    const { unmount } = renderCard(makeItem("image/gif"));

    expect(screen.queryByText(animatedNote)).not.toBeNull();
    unmount();
  });

  it("hides the first-frame note for a single PNG", () => {
    const { unmount } = renderCard(makeItem("image/png"));

    expect(screen.queryByText(animatedNote)).toBeNull();
    unmount();
  });
});
