"use client";

import { BracesIcon, ChevronRightIcon } from "lucide-react";
import { Fragment, type ReactNode, useState } from "react";
import {
  childPath,
  getValueType,
  type JsonValue,
  type JsonValueType,
  ROOT_PATH,
  summarizeContainer,
  tryParseNestedJson,
} from "@/lib/json-viewer";
import { cn } from "@/lib/utils";

export type JsonTreeContext = {
  allMode: "expand" | "collapse" | null;
  defaultOpenDepth: number;
  matchIndex: Set<string>;
  onlyMatches: boolean;
  openOverride: Map<string, boolean>;
  parseNestedLabel: string;
  query: string;
  toggle: (path: string, next: boolean) => void;
};

const VALUE_CLASS: Record<JsonValueType, string> = {
  array: "text-mute",
  boolean: "text-warning",
  null: "text-mute italic",
  number: "text-info",
  object: "text-mute",
  string: "text-success",
};

type Entry = { key: string | number; path: string; value: JsonValue };

export function JsonTree({
  ctx,
  value,
}: {
  ctx: JsonTreeContext;
  value: JsonValue;
}): ReactNode {
  return (
    <div className="font-mono text-ink-soft text-sm leading-relaxed">
      <JsonNode
        ctx={ctx}
        depth={0}
        nodeKey={null}
        path={ROOT_PATH}
        value={value}
      />
    </div>
  );
}

type JsonNodeProps = {
  ctx: JsonTreeContext;
  depth: number;
  nodeKey: string | number | null;
  path: string;
  value: JsonValue;
};

function JsonNode({
  ctx,
  depth,
  nodeKey,
  path,
  value,
}: JsonNodeProps): ReactNode {
  const [showNested, setShowNested] = useState(false);

  if (ctx.onlyMatches && ctx.query.trim() !== "" && !ctx.matchIndex.has(path)) {
    return null;
  }

  const type = getValueType(value);
  const summary = summarizeContainer(value);
  const keyNode =
    nodeKey === null ? null : (
      <span className="text-ink">
        <Highlight query={ctx.query} text={String(nodeKey)} />
        <span className="text-mute">: </span>
      </span>
    );

  // 容器：对象 / 数组
  if (summary) {
    const [open, close] = summary.type === "array" ? ["[", "]"] : ["{", "}"];

    if (summary.count === 0) {
      return (
        <Row depth={depth}>
          <Spacer />
          {keyNode}
          <span className="text-mute">{`${open}${close}`}</span>
        </Row>
      );
    }

    const isOpen = resolveOpen(ctx, path, depth);
    const entries = toEntries(value, path);

    return (
      <div>
        <Row depth={depth} onToggle={() => ctx.toggle(path, !isOpen)}>
          <Chevron open={isOpen} />
          {keyNode}
          {isOpen ? (
            <span className="text-mute">{open}</span>
          ) : (
            <span className="text-mute">
              {`${open} … ${close}`}
              <span className="ml-1.5 text-mute/70">{summary.count}</span>
            </span>
          )}
        </Row>
        {isOpen && (
          <>
            <div className="ml-[7px] border-rule/60 border-l pl-3">
              {entries.map((entry) => (
                <JsonNode
                  ctx={ctx}
                  depth={depth + 1}
                  key={entry.path}
                  nodeKey={entry.key}
                  path={entry.path}
                  value={entry.value}
                />
              ))}
            </div>
            <Row depth={depth}>
              <Spacer />
              <span className="text-mute">{close}</span>
            </Row>
          </>
        )}
      </div>
    );
  }

  // 基础值（可能是可二次解析的嵌套 JSON 字符串）
  const nested = type === "string" ? tryParseNestedJson(value as string) : null;

  function handleNestedToggle() {
    const next = !showNested;
    setShowNested(next);
    if (next) {
      ctx.toggle(`${path}::parsed`, true);
    }
  }

  return (
    <div>
      <Row depth={depth}>
        <Spacer />
        {keyNode}
        <PrimitiveValue query={ctx.query} type={type} value={value} />
        {nested && (
          <button
            aria-label={ctx.parseNestedLabel}
            className={cn(
              "ml-1.5 inline-flex size-5 shrink-0 items-center justify-center rounded border border-rule text-mute transition-colors hover:border-ink hover:text-ink",
              showNested && "border-ink bg-yellow text-ink",
            )}
            onClick={handleNestedToggle}
            title={ctx.parseNestedLabel}
            type="button"
          >
            <BracesIcon className="size-3" />
          </button>
        )}
      </Row>
      {nested && showNested && (
        <div className="ml-[7px] border-rule/60 border-l border-dashed pl-3">
          <JsonNode
            ctx={ctx}
            depth={depth + 1}
            nodeKey={null}
            path={`${path}::parsed`}
            value={nested}
          />
        </div>
      )}
    </div>
  );
}

function resolveOpen(
  ctx: JsonTreeContext,
  path: string,
  depth: number,
): boolean {
  const override = ctx.openOverride.get(path);
  if (override !== undefined) {
    return override;
  }
  if (ctx.query.trim() !== "" && ctx.matchIndex.has(path)) {
    return true;
  }
  if (ctx.allMode === "expand") {
    return true;
  }
  if (ctx.allMode === "collapse") {
    return depth === 0;
  }
  return depth < ctx.defaultOpenDepth;
}

function toEntries(value: JsonValue, path: string): Entry[] {
  if (Array.isArray(value)) {
    return value.map((item, index) => ({
      key: index,
      path: childPath(path, index),
      value: item,
    }));
  }
  return Object.entries(value as { [key: string]: JsonValue }).map(
    ([key, item]) => ({ key, path: childPath(path, key), value: item }),
  );
}

function Row({
  children,
  depth,
  onToggle,
}: {
  children: ReactNode;
  depth: number;
  onToggle?: () => void;
}): ReactNode {
  const className = "flex items-start gap-0.5 py-0.5";
  if (onToggle) {
    return (
      <button
        className={cn(
          className,
          "w-full cursor-pointer rounded text-left hover:bg-paper-deep/40",
        )}
        data-depth={depth}
        onClick={onToggle}
        type="button"
      >
        {children}
      </button>
    );
  }
  return (
    <div className={className} data-depth={depth}>
      {children}
    </div>
  );
}

function Spacer(): ReactNode {
  return <span className="inline-block w-3 shrink-0" />;
}

function Chevron({ open }: { open: boolean }): ReactNode {
  return (
    <ChevronRightIcon
      className={cn(
        "mt-0.5 size-3 shrink-0 text-mute transition-transform",
        open && "rotate-90",
      )}
    />
  );
}

function PrimitiveValue({
  query,
  type,
  value,
}: {
  query: string;
  type: JsonValueType;
  value: JsonValue;
}): ReactNode {
  if (type === "string") {
    return (
      <span className="break-words text-success">
        <span className="text-success/60">"</span>
        <Highlight query={query} text={value as string} />
        <span className="text-success/60">"</span>
      </span>
    );
  }
  const text = value === null ? "null" : String(value);
  return (
    <span className={cn("break-words", VALUE_CLASS[type])}>
      <Highlight query={query} text={text} />
    </span>
  );
}

function Highlight({
  query,
  text,
}: {
  query: string;
  text: string;
}): ReactNode {
  const needle = query.trim().toLowerCase();
  if (needle === "") {
    return text;
  }
  const haystack = text.toLowerCase();
  const parts: ReactNode[] = [];
  let cursor = 0;
  let index = haystack.indexOf(needle);
  let key = 0;
  if (index === -1) {
    return text;
  }
  while (index !== -1) {
    if (index > cursor) {
      parts.push(<Fragment key={key}>{text.slice(cursor, index)}</Fragment>);
      key += 1;
    }
    parts.push(
      <mark className="rounded bg-yellow/50 text-ink" key={key}>
        {text.slice(index, index + needle.length)}
      </mark>,
    );
    key += 1;
    cursor = index + needle.length;
    index = haystack.indexOf(needle, cursor);
  }
  if (cursor < text.length) {
    parts.push(<Fragment key={key}>{text.slice(cursor)}</Fragment>);
  }
  return parts;
}
