"use client";

import {
  ArrowRightLeftIcon,
  CheckIcon,
  CopyIcon,
  LanguagesIcon,
  XIcon,
} from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  type ChineseVariant,
  type ConversionDirection,
  convertChineseText,
} from "@/lib/chinese-converter";
import type { LocaleContent } from "@/messages/types";

const COPIED_RESET_MS = 1500;
const DIRECTIONS: readonly ConversionDirection[] = [
  "toTraditional",
  "toSimplified",
];
const VARIANTS: readonly ChineseVariant[] = ["standard", "taiwan", "hongkong"];

type ChineseConverterClientProps = {
  content: LocaleContent["chineseConverter"];
};

export function ChineseConverterClient({
  content,
}: ChineseConverterClientProps) {
  const t = content.client;
  const [input, setInput] = useState("");
  const [direction, setDirection] =
    useState<ConversionDirection>("toTraditional");
  const [variant, setVariant] = useState<ChineseVariant>("standard");
  const [output, setOutput] = useState<string | null>("");
  const [isConverting, setIsConverting] = useState(false);
  const [copied, setCopied] = useState(false);

  const deferredInput = useDeferredValue(input);
  const trimmedInput = deferredInput.trim();

  // opencc-js 首次调用才动态加载词典，之后 convertChineseText 内部按 from:to 缓存
  // converter，几乎同步返回；用 cancelled 防止旧请求在新请求之后返回时覆盖结果。
  useEffect(() => {
    if (trimmedInput === "") {
      setOutput("");
      setIsConverting(false);
      return;
    }
    let cancelled = false;
    setIsConverting(true);
    convertChineseText(deferredInput, direction, variant)
      .then((result) => {
        if (!cancelled) {
          setOutput(result);
          setIsConverting(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOutput(null);
          setIsConverting(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [deferredInput, direction, variant, trimmedInput]);

  function handleClear() {
    setInput("");
    setCopied(false);
  }

  function handleSwap() {
    setDirection((previous) =>
      previous === "toTraditional" ? "toSimplified" : "toTraditional",
    );
    if (output) {
      setInput(output);
    }
  }

  async function handleCopy() {
    if (!output) {
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      // 剪贴板不可用时静默，不打断转换流程
    }
  }

  const hasResult = output !== null && output !== "";
  const hasError = trimmedInput !== "" && output === null;
  const isFirstLoad = isConverting && !hasResult && !hasError;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="grid grid-cols-2 gap-1.5">
          {DIRECTIONS.map((item) => (
            <Button
              key={item}
              onClick={() => setDirection(item)}
              size="sm"
              variant={direction === item ? "default" : "outline"}
            >
              {t.direction[item]}
            </Button>
          ))}
        </div>
        <Button onClick={handleSwap} size="sm" variant="ghost">
          <ArrowRightLeftIcon />
          {t.toolbar.swap}
        </Button>
        <div className="ml-auto">
          <Select
            onValueChange={(value) => setVariant(value as ChineseVariant)}
            value={variant}
          >
            <SelectTrigger aria-label={t.variant.label} size="sm">
              <SelectValue>{t.variant[variant]}</SelectValue>
            </SelectTrigger>
            <SelectPopup>
              {VARIANTS.map((item) => (
                <SelectItem key={item} value={item}>
                  {t.variant[item]}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-ink shadow-press-ink">
          <CardHeader className="flex items-center justify-between border-rule border-b bg-paper-deep/50">
            <CardTitle className="text-base">{t.input.title}</CardTitle>
            <Button
              disabled={input === ""}
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
              className="text-sm leading-relaxed [&_textarea]:max-h-[34rem] [&_textarea]:min-h-[26rem]"
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.input.placeholder}
              spellCheck={false}
              value={input}
            />
            <div className="flex items-center gap-2 text-mute text-xs">
              <span className="ml-auto tabular-nums">
                {t.status.characters.replace("{count}", String(input.length))}
              </span>
            </div>
          </CardPanel>
        </Card>

        <Card className="border-2 border-ink shadow-press-ink">
          <CardHeader className="flex items-center justify-between border-rule border-b bg-paper-deep/50">
            <CardTitle className="text-base">{t.output.title}</CardTitle>
            <Button
              disabled={!hasResult}
              onClick={handleCopy}
              size="sm"
              variant="press-ink"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? t.toolbar.copied : t.toolbar.copy}
            </Button>
          </CardHeader>
          <CardPanel className="max-h-[34rem] min-h-[26rem] overflow-auto">
            {trimmedInput === "" ? (
              <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 text-center text-mute">
                <LanguagesIcon className="size-10 text-rule-strong" />
                <p className="font-bold text-ink-soft">{t.empty.title}</p>
                <p className="max-w-xs text-sm">{t.empty.description}</p>
              </div>
            ) : hasError ? (
              <div className="rounded-lg border border-danger/40 bg-danger-bg p-4 text-sm text-ink-soft">
                {t.error}
              </div>
            ) : isFirstLoad ? (
              <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 text-center text-mute">
                <Spinner className="size-6" />
                <p className="text-sm">{t.status.converting}</p>
              </div>
            ) : (
              <Textarea
                className="text-sm leading-relaxed [&_textarea]:max-h-[34rem] [&_textarea]:min-h-[26rem]"
                readOnly
                value={output ?? ""}
              />
            )}
          </CardPanel>
        </Card>
      </div>
    </div>
  );
}
