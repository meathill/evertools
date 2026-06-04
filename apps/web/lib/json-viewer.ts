export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonValueType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "array"
  | "object";

export type JsonParseError = {
  column: number;
  line: number;
  message: string;
  position: number;
};

export type JsonParseResult =
  | { ok: true; value: JsonValue }
  | { ok: false; error: JsonParseError };

export type ContainerSummary = {
  count: number;
  type: "array" | "object";
};

export const ROOT_PATH = "$";

/**
 * 生成子节点的稳定路径，供树组件的 React key、展开状态 Map 以及搜索索引共用，
 * 保证三处对“同一个节点”的标识完全一致。
 */
export function childPath(parentPath: string, key: string | number): string {
  return typeof key === "number"
    ? `${parentPath}[${key}]`
    : `${parentPath}.${key}`;
}

export function getValueType(value: JsonValue): JsonValueType {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (typeof value === "object") {
    return "object";
  }
  return typeof value as "string" | "number" | "boolean";
}

export function isContainer(
  value: JsonValue,
): value is JsonValue[] | { [key: string]: JsonValue } {
  return value !== null && typeof value === "object";
}

export function summarizeContainer(value: JsonValue): ContainerSummary | null {
  if (Array.isArray(value)) {
    return { count: value.length, type: "array" };
  }
  if (value !== null && typeof value === "object") {
    return { count: Object.keys(value).length, type: "object" };
  }
  return null;
}

export function formatJson(value: JsonValue): string {
  return JSON.stringify(value, null, 2);
}

/**
 * 把字符位置换算成 1 起始的行/列，用于在解析失败时定位错误。
 */
export function getLineColumn(
  text: string,
  position: number,
): { column: number; line: number } {
  const clamped = Math.max(0, Math.min(position, text.length));
  let line = 1;
  let column = 1;
  for (let index = 0; index < clamped; index += 1) {
    if (text[index] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { column, line };
}

export function parseJson(input: string): JsonParseResult {
  try {
    return { ok: true, value: JSON.parse(input) as JsonValue };
  } catch (error) {
    return { error: toParseError(input, error), ok: false };
  }
}

/**
 * 仅当字符串去空白后形如 `{...}` / `[...]` 且能解析成对象或数组时，才认定为嵌套
 * JSON 字符串。避免把 "42"、"true" 这类可解析的标量误判为可展开的嵌套结构。
 */
export function tryParseNestedJson(value: string): JsonValue | null {
  const trimmed = value.trim();
  if (trimmed.length < 2) {
    return null;
  }
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  const looksLikeContainer =
    (first === "{" && last === "}") || (first === "[" && last === "]");
  if (!looksLikeContainer) {
    return null;
  }
  try {
    const parsed = JSON.parse(trimmed) as JsonValue;
    return parsed !== null && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * 构建搜索索引：返回所有“命中节点”及其祖先节点的路径集合。
 * 命中判定 = 节点的 key 或基础值字符串化后大小写不敏感地包含 query。
 * 树组件据此高亮命中、自动展开到命中处，以及在“仅显示匹配”模式下过滤。
 */
export function buildMatchIndex(value: JsonValue, query: string): Set<string> {
  const matched = new Set<string>();
  const needle = query.trim().toLowerCase();
  if (needle === "") {
    return matched;
  }

  const walk = (
    node: JsonValue,
    path: string,
    keyLabel: string | null,
  ): boolean => {
    let hit = Boolean(keyLabel?.toLowerCase().includes(needle));

    if (Array.isArray(node)) {
      node.forEach((child, index) => {
        if (walk(child, childPath(path, index), null)) {
          hit = true;
        }
      });
    } else if (node !== null && typeof node === "object") {
      for (const [key, child] of Object.entries(node)) {
        if (walk(child, childPath(path, key), key)) {
          hit = true;
        }
      }
    } else if (primitiveToText(node).toLowerCase().includes(needle)) {
      hit = true;
    }

    if (hit) {
      matched.add(path);
    }
    return hit;
  };

  walk(value, ROOT_PATH, null);
  return matched;
}

function primitiveToText(value: JsonValue): string {
  return value === null ? "null" : String(value);
}

function toParseError(text: string, error: unknown): JsonParseError {
  const message = error instanceof Error ? error.message : String(error);
  const lineColumn = message.match(/line (\d+) column (\d+)/i);
  const positionToken = message.match(/position (\d+)/i);

  if (positionToken) {
    const position = Number.parseInt(positionToken[1], 10);
    if (lineColumn) {
      return {
        column: Number.parseInt(lineColumn[2], 10),
        line: Number.parseInt(lineColumn[1], 10),
        message,
        position,
      };
    }
    return { ...getLineColumn(text, position), message, position };
  }

  // 形如 "Unexpected end of JSON input" 不带位置，定位到文本末尾。
  const position = text.length;
  return { ...getLineColumn(text, position), message, position };
}
