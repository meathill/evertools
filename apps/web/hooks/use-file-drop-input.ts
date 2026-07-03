import {
  type ChangeEvent,
  type DragEvent,
  useId,
  useRef,
  useState,
} from "react";

// 拖拽 + 点击选择文件的通用交互层，把提取到的 File[] 交给调用方处理。
export function useFileDropInput(
  onFiles: (files: File[]) => void | Promise<void>,
) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function stopDragging() {
    setIsDragging(false);
  }

  function handleBrowseClick() {
    inputRef.current?.click();
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) {
      void onFiles(files);
    }

    event.currentTarget.value = "";
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

    const files = Array.from(event.dataTransfer.files ?? []);

    if (files.length > 0) {
      void onFiles(files);
    }
  }

  return {
    handleBrowseClick,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInputChange,
    inputId,
    inputRef,
    isDragging,
    stopDragging,
  };
}

export type FileDropInputController = ReturnType<typeof useFileDropInput>;
