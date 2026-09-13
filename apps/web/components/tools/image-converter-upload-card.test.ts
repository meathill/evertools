// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
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

function renderEmptyCard() {
  const controller = {
    acceptedFormatsText: "PNG / GIF",
    firstItem: undefined,
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
    items: [],
  } as unknown as ImageConverterController;

  const view = render(
    React.createElement(ImageConverterUploadCard, { content, controller }),
  );

  return { controller, view };
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

  it("opens the file dialog when clicking the empty drop zone", () => {
    const { controller, view } = renderEmptyCard();
    const zone = view.container.querySelector(".cursor-pointer");

    expect(zone).not.toBeNull();

    fireEvent.click(zone as Element);

    expect(controller.handleBrowseClick).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  it("opens the file dialog only once when clicking the choose button", () => {
    const { controller, view } = renderEmptyCard();

    fireEvent.click(
      screen.getByRole("button", { name: content.client.upload.chooseImage }),
    );

    // 按钮自身 onClick 触发一次，冒泡到 DropZone 时被过滤，不会触发第二次。
    expect(controller.handleBrowseClick).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  it("does not open the file dialog from the drop zone once images are selected", () => {
    const view = renderCard(makeItem("image/png"));
    const zone = view.container.querySelector(".border-dashed");

    expect(zone).not.toBeNull();
    expect(zone?.classList.contains("cursor-pointer")).toBe(false);
    view.unmount();
  });
});
