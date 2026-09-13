// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DropZone } from "@/components/ui/drop-zone";

afterEach(() => {
  cleanup();
});

function renderZone(options?: {
  clickable?: boolean;
  disabled?: boolean;
  onBrowseClick?: () => void;
}) {
  const onBrowseClick = options?.onBrowseClick ?? vi.fn();

  const view = render(
    React.createElement(DropZone, {
      // biome-ignore lint/correctness/noChildrenProp: .test.ts 里不能写 JSX，用 createElement 时 children 放 props 才能过类型检查
      children: [
        React.createElement("span", { key: "blank" }, "blank area"),
        React.createElement(
          "button",
          { key: "action", type: "button" },
          "inner action",
        ),
      ],
      clickable: options?.clickable,
      disabled: options?.disabled,
      isDragging: false,
      onBrowseClick,
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn(),
    }),
  );

  return { onBrowseClick, view };
}

describe("drop zone", () => {
  it("opens the file dialog when clicking blank area in clickable mode", () => {
    const { onBrowseClick } = renderZone({ clickable: true });

    fireEvent.click(screen.getByText("blank area"));

    expect(onBrowseClick).toHaveBeenCalledTimes(1);
  });

  it("ignores clicks on inner interactive elements", () => {
    const { onBrowseClick } = renderZone({ clickable: true });

    fireEvent.click(screen.getByRole("button", { name: "inner action" }));

    expect(onBrowseClick).not.toHaveBeenCalled();
  });

  it("does nothing when not clickable", () => {
    const { onBrowseClick, view } = renderZone({ clickable: false });

    fireEvent.click(screen.getByText("blank area"));

    expect(onBrowseClick).not.toHaveBeenCalled();
    expect(view.container.querySelector(".cursor-pointer")).toBeNull();
  });

  it("does nothing when disabled", () => {
    const { onBrowseClick } = renderZone({ clickable: true, disabled: true });

    fireEvent.click(screen.getByText("blank area"));

    expect(onBrowseClick).not.toHaveBeenCalled();
  });
});
