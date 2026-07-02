import { type ChangeEvent, type FormEvent, useState } from "react";
import type { ValidationReport } from "@/lib/sitemap/validator";

type SitemapApiResponse =
  | { finalUrl: string; ok: true; report: ValidationReport }
  | { code: string; detail?: string; ok: false };

export type SitemapValidatorResult = {
  finalUrl: string;
  report: ValidationReport;
};

export function useSitemapValidator() {
  const [urlInput, setUrlInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [result, setResult] = useState<SitemapValidatorResult | null>(null);

  function handleUrlChange(event: ChangeEvent<HTMLInputElement>) {
    setUrlInput(event.target.value);
    setErrorCode(null);
  }

  async function runValidation() {
    const target = urlInput.trim();
    if (!target) {
      setErrorCode("INVALID_URL");
      return;
    }
    setIsFetching(true);
    setErrorCode(null);
    try {
      const params = new URLSearchParams({ url: target });
      const response = await fetch(`/api/sitemap?${params.toString()}`);
      const data = (await response.json()) as SitemapApiResponse;
      if (!data.ok) {
        setErrorCode(data.code);
        setResult(null);
        return;
      }
      setResult({ finalUrl: data.finalUrl, report: data.report });
    } catch {
      setErrorCode("UNKNOWN");
      setResult(null);
    } finally {
      setIsFetching(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runValidation();
  }

  function handleResubmit() {
    void runValidation();
  }

  function handleClear() {
    setUrlInput("");
    setErrorCode(null);
    setResult(null);
  }

  return {
    errorCode,
    handleClear,
    handleResubmit,
    handleSubmit,
    handleUrlChange,
    isFetching,
    result,
    urlInput,
  };
}

export type SitemapValidatorController = ReturnType<typeof useSitemapValidator>;
