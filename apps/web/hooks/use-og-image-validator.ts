import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { useFileDropInput } from "@/hooks/use-file-drop-input";
import { useRevocableObjectUrl } from "@/hooks/use-revocable-object-url";
import {
  type ImageFacts,
  type ParsedTags,
  resolveEffectiveTags,
  type ValidationReport,
  validateUploadedImage,
} from "@/lib/og/validator";

export type ValidatorMode = "url" | "upload";

type OgApiResponse =
  | {
      ok: true;
      finalUrl: string;
      tags: ParsedTags;
      image: ImageFacts;
      report: ValidationReport;
    }
  | { ok: false; code: string; detail?: string };

// 网址 / 上传两种模式统一成同一结果形状，供报告与预览组件消费。
export type ValidatorResult = {
  description: string | null;
  domain: string | null;
  image: ImageFacts;
  imageUrl: string | null;
  mode: ValidatorMode;
  report: ValidationReport;
  siteName: string | null;
  tags: ParsedTags | null;
  title: string | null;
};

const EMPTY_IMAGE: ImageFacts = {
  byteSize: null,
  filesizeKnown: false,
  format: null,
  height: null,
  width: null,
};

function normalizeFormat(type: string): string | null {
  if (!type.startsWith("image/")) return null;
  const format = type.slice("image/".length).toLowerCase();
  if (format === "jpg") return "jpeg";
  if (format === "svg+xml") return "svg";
  return format;
}

function domainFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

async function readImageSize(
  file: File,
): Promise<{ height: number | null; width: number | null }> {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { height: bitmap.height, width: bitmap.width };
    bitmap.close();
    return size;
  } catch {
    return { height: null, width: null };
  }
}

export function useOgImageValidator() {
  const freshCounter = useRef(0);
  const replacePreviewUrl = useRevocableObjectUrl();

  const [mode, setMode] = useState<ValidatorMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [result, setResult] = useState<ValidatorResult | null>(null);

  const {
    handleBrowseClick,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInputChange,
    inputId,
    inputRef,
    isDragging,
    stopDragging,
  } = useFileDropInput((files) => {
    const file = files[0];

    if (file) {
      void handleSelectedFile(file);
    }
  });

  function resetState() {
    setErrorCode(null);
    setResult(null);
    replacePreviewUrl(null);
  }

  function handleModeChange(nextMode: ValidatorMode) {
    if (nextMode === mode) return;
    setMode(nextMode);
    stopDragging();
    resetState();
  }

  function handleUrlChange(event: ChangeEvent<HTMLInputElement>) {
    setUrlInput(event.target.value);
    setErrorCode(null);
  }

  async function runUrlAnalysis(forceFresh: boolean) {
    const target = urlInput.trim();
    if (!target) {
      setErrorCode("INVALID_URL");
      return;
    }
    setIsFetching(true);
    setErrorCode(null);
    try {
      const params = new URLSearchParams({ url: target });
      if (forceFresh) {
        freshCounter.current += 1;
        params.set("fresh", String(freshCounter.current));
      }
      const response = await fetch(`/api/og?${params.toString()}`);
      const data = (await response.json()) as OgApiResponse;
      if (!data.ok) {
        setErrorCode(data.code);
        setResult(null);
        return;
      }
      const effective = resolveEffectiveTags(data.tags);
      setResult({
        description: effective.description ?? null,
        domain: domainFromUrl(data.finalUrl),
        image: data.image,
        imageUrl: effective.image ?? null,
        mode: "url",
        report: data.report,
        siteName: data.tags.og.siteName ?? null,
        tags: data.tags,
        title: effective.title ?? null,
      });
    } catch {
      setErrorCode("UNKNOWN");
      setResult(null);
    } finally {
      setIsFetching(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runUrlAnalysis(false);
  }

  function handleResubmit() {
    void runUrlAnalysis(true);
  }

  async function handleSelectedFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrorCode("INVALID_URL");
      return;
    }
    setIsPreparing(true);
    setErrorCode(null);
    try {
      const previewUrl = URL.createObjectURL(file);
      replacePreviewUrl(previewUrl);
      const { width, height } = await readImageSize(file);
      const image: ImageFacts = {
        byteSize: file.size,
        filesizeKnown: true,
        format: normalizeFormat(file.type),
        height,
        width,
      };
      setResult({
        description: null,
        domain: null,
        image,
        imageUrl: previewUrl,
        mode: "upload",
        report: validateUploadedImage(image),
        siteName: null,
        tags: null,
        title: file.name,
      });
    } finally {
      setIsPreparing(false);
    }
  }

  function handleClear() {
    setUrlInput("");
    resetState();
  }

  return {
    emptyImage: EMPTY_IMAGE,
    errorCode,
    handleBrowseClick,
    handleClear,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInputChange,
    handleModeChange,
    handleResubmit,
    handleSubmit,
    handleUrlChange,
    inputId,
    inputRef,
    isDragging,
    isFetching,
    isPreparing,
    mode,
    result,
    urlInput,
  };
}

export type OgImageValidatorController = ReturnType<typeof useOgImageValidator>;
