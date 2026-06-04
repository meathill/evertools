"use client";

import {
  BracesIcon,
  CheckIcon,
  CopyIcon,
  FoldVerticalIcon,
  SearchIcon,
  UnfoldVerticalIcon,
  XIcon,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { JsonTree, type JsonTreeContext } from "@/components/tools/json-tree";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buildMatchIndex, formatJson, parseJson } from "@/lib/json-viewer";
import type { LocaleContent } from "@/messages/types";

const EMPTY_MATCH: Set<string> = new Set();
const DEFAULT_OPEN_DEPTH = 2;
const COPIED_RESET_MS = 1500;

type JsonViewerClientProps = {
  content: LocaleContent["jsonViewer"];
};

export function JsonViewerClient({ content }: JsonViewerClientProps) {
  const t = content.client;
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [onlyMatches, setOnlyMatches] = useState(false);
  const [openOverride, setOpenOverride] = useState<Map<string, boolean>>(
    () => new Map(),
  );
  const [allMode, setAllMode] = useState<"expand" | "collapse" | null>(null);
  const [copied, setCopied] = useState(false);

  const deferredInput = useDeferredValue(input);
  const deferredQuery = useDeferredValue(query);

  const parseResult = useMemo(() => parseJson(deferredInput), [deferredInput]);
  const trimmedInput = deferredInput.trim();

  const matchIndex = useMemo(() => {
    if (!parseResult.ok || deferredQuery.trim() === "") {
      return EMPTY_MATCH;
    }
    return buildMatchIndex(parseResult.value, deferredQuery);
  }, [parseResult, deferredQuery]);

  function handleToggle(path: string, next: boolean) {
    setOpenOverride((prev) => new Map(prev).set(path, next));
  }

  function handleExpandAll() {
    setAllMode("expand");
    setOpenOverride(new Map());
  }

  function handleCollapseAll() {
    setAllMode("collapse");
    setOpenOverride(new Map());
  }

  function handleClear() {
    setInput("");
    setQuery("");
    setOnlyMatches(false);
    setOpenOverride(new Map());
    setAllMode(null);
  }

  async function handleCopy() {
    if (!parseResult.ok) {
      return;
    }
    try {
      await navigator.clipboard.writeText(formatJson(parseResult.value));
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      // 剪贴板不可用时静默，不打断查看流程
    }
  }

  const treeContext: JsonTreeContext = {
    allMode,
    defaultOpenDepth: DEFAULT_OPEN_DEPTH,
    matchIndex,
    onlyMatches,
    openOverride,
    parseNestedLabel: t.tree.parseNested,
    query: deferredQuery,
    toggle: handleToggle,
  };

  const hasTree = trimmedInput !== "" && parseResult.ok;
  const searchDisabled = !hasTree;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-2 border-ink shadow-press-ink">
        <CardHeader className="flex-row items-center justify-between border-rule border-b bg-paper-deep/50">
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
            className="font-mono text-xs leading-relaxed [&_textarea]:min-h-[26rem]"
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.input.placeholder}
            spellCheck={false}
            value={input}
          />
          <div className="flex items-center gap-2 text-mute text-xs">
            {trimmedInput !== "" &&
              (parseResult.ok ? (
                <Badge variant="success">{t.status.valid}</Badge>
              ) : (
                <Badge variant="error">{t.status.invalid}</Badge>
              ))}
            <span className="ml-auto tabular-nums">
              {t.status.characters.replace("{count}", String(input.length))}
            </span>
          </div>
        </CardPanel>
      </Card>

      <Card className="border-2 border-ink shadow-press-ink">
        <CardHeader className="border-rule border-b bg-paper-deep/50">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-40 flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-mute" />
              <Input
                className="[&_[data-slot=input]]:pl-8"
                disabled={searchDisabled}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.toolbar.searchPlaceholder}
                size="sm"
                type="search"
                value={query}
              />
            </div>
            <Button
              disabled={searchDisabled || query.trim() === ""}
              onClick={() => setOnlyMatches((value) => !value)}
              size="sm"
              variant={onlyMatches ? "press" : "outline"}
            >
              {t.toolbar.onlyMatches}
            </Button>
            <Button
              aria-label={t.toolbar.expandAll}
              disabled={searchDisabled}
              onClick={handleExpandAll}
              size="icon-sm"
              title={t.toolbar.expandAll}
              variant="outline"
            >
              <UnfoldVerticalIcon />
            </Button>
            <Button
              aria-label={t.toolbar.collapseAll}
              disabled={searchDisabled}
              onClick={handleCollapseAll}
              size="icon-sm"
              title={t.toolbar.collapseAll}
              variant="outline"
            >
              <FoldVerticalIcon />
            </Button>
            <Button
              disabled={searchDisabled}
              onClick={handleCopy}
              size="sm"
              variant="press-ink"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? t.toolbar.copied : t.toolbar.copy}
            </Button>
          </div>
        </CardHeader>
        <CardPanel className="max-h-[34rem] min-h-[26rem] overflow-auto">
          {trimmedInput === "" ? (
            <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 text-center text-mute">
              <BracesIcon className="size-10 text-rule-strong" />
              <p className="font-bold text-ink-soft">{t.empty.title}</p>
              <p className="max-w-xs text-sm">{t.empty.description}</p>
            </div>
          ) : parseResult.ok ? (
            <JsonTree ctx={treeContext} value={parseResult.value} />
          ) : (
            <div className="rounded-lg border border-danger/40 bg-danger-bg p-4 text-sm">
              <p className="font-bold text-danger">{t.error.title}</p>
              <p className="mt-1 text-ink-soft">
                {t.error.location
                  .replace("{line}", String(parseResult.error.line))
                  .replace("{column}", String(parseResult.error.column))}
              </p>
              <p className="mt-2 break-words font-mono text-ink-soft/80 text-xs">
                {parseResult.error.message}
              </p>
            </div>
          )}
        </CardPanel>
      </Card>
    </div>
  );
}
