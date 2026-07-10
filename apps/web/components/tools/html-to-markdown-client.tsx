"use client";

import { CheckIcon, CodeXmlIcon, CopyIcon, XIcon } from "lucide-react";
import {
  type ClipboardEvent,
  useDeferredValue,
  useMemo,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { convertHtmlToMarkdown } from "@/lib/html-to-markdown";
import type { LocaleContent } from "@/messages/types";

const COPIED_RESET_MS = 1500;

type HtmlToMarkdownClientProps = {
  content: LocaleContent["htmlToMarkdown"];
};

export function HtmlToMarkdownClient({ content }: HtmlToMarkdownClientProps) {
  const t = content.client;
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const deferredInput = useDeferredValue(input);
  const trimmedInput = deferredInput.trim();

  // node-html-parser 基本不会抛异常，这层 try/catch 只兜极端场景（比如粘贴了
  // 嵌套几百层的复杂页面 DOM 导致递归遍历栈溢出），避免整页白屏。
  const markdown = useMemo(() => {
    if (trimmedInput === "") {
      return "";
    }
    try {
      return convertHtmlToMarkdown(deferredInput);
    } catch {
      return null;
    }
  }, [deferredInput, trimmedInput]);

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    // 粘贴富文本（从网页选中复制）时剪贴板带 text/html，优先取用；
    // 否则不拦截，走浏览器默认的纯文本粘贴（本身也可能就是 HTML 源码文本）。
    const html = event.clipboardData.getData("text/html");
    if (html) {
      event.preventDefault();
      setInput(html);
    }
  }

  function handleClear() {
    setInput("");
    setCopied(false);
  }

  async function handleCopy() {
    if (!markdown) {
      return;
    }
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      // 剪贴板不可用时静默，不打断转换流程
    }
  }

  const hasResult = markdown !== null && markdown !== "";
  const hasError = trimmedInput !== "" && markdown === null;

  return (
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
            className="font-mono text-xs leading-relaxed [&_textarea]:max-h-[34rem] [&_textarea]:min-h-[26rem]"
            onChange={(event) => setInput(event.target.value)}
            onPaste={handlePaste}
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
              <CodeXmlIcon className="size-10 text-rule-strong" />
              <p className="font-bold text-ink-soft">{t.empty.title}</p>
              <p className="max-w-xs text-sm">{t.empty.description}</p>
            </div>
          ) : hasError ? (
            <div className="rounded-lg border border-danger/40 bg-danger-bg p-4 text-sm text-ink-soft">
              {t.error}
            </div>
          ) : (
            <Textarea
              className="font-mono text-xs leading-relaxed [&_textarea]:max-h-[34rem] [&_textarea]:min-h-[26rem]"
              readOnly
              value={markdown ?? ""}
            />
          )}
        </CardPanel>
      </Card>
    </div>
  );
}
