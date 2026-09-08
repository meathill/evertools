// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ChangeEvent, DragEvent } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLocaleContent } from "@/messages";
import { useImageCropper } from "./use-image-cropper";

vi.mock("heic-to", () => ({
  heicTo: vi.fn(
    async () => new Blob([new Uint8Array([9])], { type: "image/jpeg" }),
  ),
}));

const content = getLocaleContent("zh").imageCropper;

// 与 use-image-converter.test.ts 同一套 mock 思路：jsdom 不解码真实图片，
// 用固定 800x600 的 MockImage 打通 readImageFile/cropImageFile 调用链。
class MockImage {
  decoding = "";
  naturalHeight = 600;
  naturalWidth = 800;
  onerror: (() => void) | null = null;
  onload: (() => void) | null = null;
  #src = "";

  get src() {
    return this.#src;
  }

  set src(value: string) {
    this.#src = value;
    queueMicrotask(() => this.onload?.());
  }
}

function makeFile(name: string, type: string): File {
  return new File([new Uint8Array([1, 2, 3])], name, { type });
}

function fileInputChangeEvent(files: File[]): ChangeEvent<HTMLInputElement> {
  return {
    currentTarget: { value: "" },
    target: { files },
  } as unknown as ChangeEvent<HTMLInputElement>;
}

function dropEvent(files: File[]): DragEvent<HTMLDivElement> {
  return {
    dataTransfer: { files },
    preventDefault: () => {},
  } as unknown as DragEvent<HTMLDivElement>;
}

let objectUrlCounter = 0;

beforeEach(() => {
  objectUrlCounter = 0;
  vi.stubGlobal("Image", MockImage);
  URL.createObjectURL = vi.fn(() => `blob:mock-${objectUrlCounter++}`);
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () =>
      ({
        drawImage: vi.fn(),
        fillRect: vi.fn(),
        fillStyle: "",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      }) as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
    (callback) => {
      callback(new Blob([new Uint8Array([1, 2, 3])], { type: "image/png" }));
    },
  );
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function uploadPng() {
  const { result } = renderHook(() => useImageCropper(content));

  act(() => {
    result.current.handleFileInputChange(
      fileInputChangeEvent([makeFile("photo.png", "image/png")]),
    );
  });
  await waitFor(() => expect(result.current.source).not.toBeNull());

  return result;
}

describe("useImageCropper", () => {
  it("loads a png and centers a free crop at 80%", async () => {
    const result = await uploadPng();

    expect(result.current.source?.width).toBe(800);
    expect(result.current.source?.height).toBe(600);
    expect(result.current.crop).toEqual({
      height: 80,
      width: 80,
      x: 10,
      y: 10,
    });
    expect(result.current.selectionRect).toEqual({
      sHeight: 480,
      sWidth: 640,
      sx: 80,
      sy: 60,
    });
    expect(result.current.outputFormat).toBe("image/png");
    expect(result.current.isPreparing).toBe(false);
  });

  it("rejects unsupported files with a message", async () => {
    const { result } = renderHook(() => useImageCropper(content));

    act(() => {
      result.current.handleFileInputChange(
        fileInputChangeEvent([makeFile("notes.txt", "text/plain")]),
      );
    });

    await waitFor(() => expect(result.current.errorMessage).not.toBeNull());
    expect(result.current.source).toBeNull();
  });

  it("accepts drop upload and recenters crop on aspect change", async () => {
    const { result } = renderHook(() => useImageCropper(content));

    act(() => {
      result.current.handleDrop(
        dropEvent([makeFile("photo.png", "image/png")]),
      );
    });
    await waitFor(() => expect(result.current.source).not.toBeNull());

    act(() => {
      result.current.handleAspectChange("square");
    });

    // 原图 800x600、目标 1:1：高度方向占满 90%，宽度按比例反推 67.5% 并居中。
    expect(result.current.aspectKey).toBe("square");
    expect(result.current.crop?.height).toBeCloseTo(90, 5);
    expect(result.current.crop?.width).toBeCloseTo(67.5, 5);
    expect(result.current.crop?.x).toBeCloseTo(16.25, 5);
    expect(result.current.crop?.y).toBeCloseTo(5, 5);
  });

  it("clamps zoom between 0.25 and 4", async () => {
    const result = await uploadPng();

    for (let i = 0; i < 20; i++) {
      act(() => {
        result.current.handleZoomIn();
      });
    }
    expect(result.current.zoom).toBe(4);

    for (let i = 0; i < 30; i++) {
      act(() => {
        result.current.handleZoomOut();
      });
    }
    expect(result.current.zoom).toBe(0.25);

    act(() => {
      result.current.handleZoomReset();
    });
    expect(result.current.zoom).toBe(1);
  });

  it("moves the selection with arrow keys", async () => {
    const result = await uploadPng();
    const beforeX = result.current.crop?.x ?? 0;

    act(() => {
      window.dispatchEvent(
        new window.KeyboardEvent("keydown", { key: "ArrowRight" }),
      );
    });

    // 右移 1px：800 宽的图上 x 增加 1/800*100。
    expect(result.current.crop?.x).toBeCloseTo(beforeX + 0.125, 5);
    expect(result.current.selectionRect?.sx).toBe(81);
  });

  it("generates a cropped result named after the source", async () => {
    const result = await uploadPng();

    await act(async () => {
      await result.current.handleGenerateClick();
    });

    expect(result.current.result?.fileName).toBe("photo-cropped.png");
    expect(result.current.result?.width).toBe(640);
    expect(result.current.result?.height).toBe(480);
    expect(result.current.result?.backgroundColor).toBeNull();
    expect(result.current.isCropping).toBe(false);
  });

  it("fills transparent areas with the chosen color for jpeg output", async () => {
    const result = await uploadPng();
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      (callback) => {
        callback(new Blob([new Uint8Array([1, 2, 3])], { type: "image/jpeg" }));
      },
    );

    act(() => {
      result.current.handleFormatChange("image/jpeg");
    });
    act(() => {
      result.current.handleBackgroundChange({
        target: { value: "#ff0000" },
      } as ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.backgroundColor).toBe("#ff0000");

    await act(async () => {
      await result.current.handleGenerateClick();
    });

    expect(result.current.result?.fileName).toBe("photo-cropped.jpg");
    expect(result.current.result?.backgroundColor).toBe("#ff0000");
  });

  it("auto-generates before download when there is no result yet", async () => {
    const result = await uploadPng();
    const clickSpy = vi.mocked(HTMLAnchorElement.prototype.click);

    await act(async () => {
      await result.current.handleDownloadClick();
    });

    expect(result.current.result).not.toBeNull();
    expect(clickSpy).toHaveBeenCalled();
  });

  it("clears source, crop, result and errors on reset", async () => {
    const result = await uploadPng();

    await act(async () => {
      await result.current.handleGenerateClick();
    });
    expect(result.current.result).not.toBeNull();

    act(() => {
      result.current.handleResetClick();
    });

    expect(result.current.source).toBeNull();
    expect(result.current.crop).toBeNull();
    expect(result.current.result).toBeNull();
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.aspectKey).toBe("free");
  });
});
