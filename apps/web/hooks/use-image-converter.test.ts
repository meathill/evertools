// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ChangeEvent, DragEvent } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLocaleContent } from "@/messages";
import { useImageConverterStore } from "@/stores/image-converter-store";
import { useImageConverter } from "./use-image-converter";

vi.mock("heic-to", () => ({
  heicTo: vi.fn(
    async () => new Blob([new Uint8Array([9])], { type: "image/jpeg" }),
  ),
}));

const content = getLocaleContent("zh").imageConverter;

// jsdom 不解码真实图片字节，也不实现 canvas 2D 渲染，用固定尺寸的 mock 打通
// readImageFile/convertImageFile 的调用链，不验证像素结果。
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
  // jsdom 未实现 createObjectURL/revokeObjectURL，vi.spyOn 要求方法已存在，
  // 这里直接赋值 mock 而非 spyOn。
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
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  act(() => {
    useImageConverterStore.getState().reset();
  });
});

describe("useImageConverter", () => {
  it("adds a single image via file input and hydrates target dimensions", async () => {
    const { result } = renderHook(() => useImageConverter(content));

    act(() => {
      result.current.handleFileInputChange(
        fileInputChangeEvent([makeFile("photo.png", "image/png")]),
      );
    });

    await waitFor(() => expect(result.current.items).toHaveLength(1));

    expect(result.current.firstItem?.status).toBe("pending");
    expect(result.current.targetWidth).toBe("800");
    expect(result.current.targetHeight).toBe("600");
    expect(result.current.isBatchMode).toBe(false);
  });

  it("adds multiple images via drop and enters batch mode", async () => {
    const { result } = renderHook(() => useImageConverter(content));

    act(() => {
      result.current.handleDrop(
        dropEvent([
          makeFile("a.png", "image/png"),
          makeFile("b.jpg", "image/jpeg"),
        ]),
      );
    });

    await waitFor(() => expect(result.current.items).toHaveLength(2));
    expect(result.current.isBatchMode).toBe(true);
  });

  it("rejects unsupported files with a message and keeps accepted ones", async () => {
    const { result } = renderHook(() => useImageConverter(content));

    act(() => {
      result.current.handleFileInputChange(
        fileInputChangeEvent([
          makeFile("photo.png", "image/png"),
          makeFile("notes.txt", "text/plain"),
        ]),
      );
    });

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(result.current.errorMessage).toBeTruthy();
  });

  it("generates a converted result for a single image and allows download", async () => {
    const { result } = renderHook(() => useImageConverter(content));

    act(() => {
      result.current.handleFileInputChange(
        fileInputChangeEvent([makeFile("photo.png", "image/png")]),
      );
    });
    await waitFor(() => expect(result.current.items).toHaveLength(1));

    await act(async () => {
      await result.current.handleGenerateAllClick();
    });

    expect(result.current.firstItem?.status).toBe("done");
    expect(result.current.firstItem?.result?.fileName).toBe(
      "photo-converted.png",
    );
    expect(result.current.isConverting).toBe(false);
  });

  it("syncs height when width changes with aspect lock enabled", async () => {
    const { result } = renderHook(() => useImageConverter(content));

    act(() => {
      result.current.handleFileInputChange(
        fileInputChangeEvent([makeFile("photo.png", "image/png")]),
      );
    });
    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(result.current.resizeMode).toBe("lock");

    act(() => {
      result.current.handleWidthChange({
        target: { value: "400" },
      } as ChangeEvent<HTMLInputElement>);
    });

    // 原图 800x600，宽改成 400 应按比例把高同步成 300。
    expect(result.current.targetWidth).toBe("400");
    expect(result.current.targetHeight).toBe("300");
  });

  it("resyncs dimensions to the source when switching to lock mode", async () => {
    const { result } = renderHook(() => useImageConverter(content));

    act(() => {
      result.current.handleFileInputChange(
        fileInputChangeEvent([makeFile("photo.png", "image/png")]),
      );
    });
    await waitFor(() => expect(result.current.items).toHaveLength(1));

    act(() => {
      result.current.handleResizeModeChange("stretch");
    });
    act(() => {
      result.current.handleWidthChange({
        target: { value: "100" },
      } as ChangeEvent<HTMLInputElement>);
    });
    act(() => {
      result.current.handleHeightChange({
        target: { value: "100" },
      } as ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleResizeModeChange("lock");
    });

    // 从 stretch(100x100) 切回 lock：以当前宽 100 为基准，按原图比例重算高。
    expect(result.current.targetWidth).toBe("100");
    expect(result.current.targetHeight).toBe("75");
  });

  it("revokes preview URLs when removing an item and when resetting", async () => {
    const { result } = renderHook(() => useImageConverter(content));

    act(() => {
      result.current.handleFileInputChange(
        fileInputChangeEvent([makeFile("photo.png", "image/png")]),
      );
    });
    await waitFor(() => expect(result.current.items).toHaveLength(1));

    const revokeSpy = vi.mocked(URL.revokeObjectURL);
    const id = result.current.firstItem?.id;

    if (!id) {
      throw new Error("expected an item to be present");
    }

    act(() => {
      result.current.handleRemoveItem(id);
    });

    expect(result.current.items).toHaveLength(0);
    expect(revokeSpy).toHaveBeenCalled();
  });

  it("clears items and dragging state on reset", async () => {
    const { result } = renderHook(() => useImageConverter(content));

    act(() => {
      result.current.handleFileInputChange(
        fileInputChangeEvent([makeFile("photo.png", "image/png")]),
      );
    });
    await waitFor(() => expect(result.current.items).toHaveLength(1));

    act(() => {
      result.current.handleResetClick();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.isDragging).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });
});
