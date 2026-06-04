import { describe, expect, it } from "vitest";
import {
  buildMatchIndex,
  childPath,
  formatJson,
  getLineColumn,
  getValueType,
  parseJson,
  ROOT_PATH,
  summarizeContainer,
  tryParseNestedJson,
} from "@/lib/json-viewer";

describe("parseJson", () => {
  it("parses valid JSON into a value", () => {
    const result = parseJson('{"a": 1, "b": [true, null]}');
    expect(result).toEqual({ ok: true, value: { a: 1, b: [true, null] } });
  });

  it("parses a top-level primitive", () => {
    expect(parseJson("42")).toEqual({ ok: true, value: 42 });
    expect(parseJson('"hi"')).toEqual({ ok: true, value: "hi" });
  });

  it("reports an error with a 1-based location", () => {
    const result = parseJson("[1, 2,]");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.line).toBeGreaterThanOrEqual(1);
      expect(result.error.column).toBeGreaterThanOrEqual(1);
      expect(result.error.message.length).toBeGreaterThan(0);
    }
  });

  it("points empty input at the start", () => {
    const result = parseJson("");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.line).toBe(1);
      expect(result.error.column).toBe(1);
      expect(result.error.position).toBe(0);
    }
  });
});

describe("getLineColumn", () => {
  it("counts lines and columns across newlines", () => {
    expect(getLineColumn("abc\ndef", 5)).toEqual({ column: 2, line: 2 });
    expect(getLineColumn("abc", 0)).toEqual({ column: 1, line: 1 });
  });

  it("clamps positions beyond the text length", () => {
    expect(getLineColumn("ab", 99)).toEqual({ column: 3, line: 1 });
  });
});

describe("getValueType", () => {
  it("classifies every JSON value kind", () => {
    expect(getValueType(null)).toBe("null");
    expect(getValueType([])).toBe("array");
    expect(getValueType({})).toBe("object");
    expect(getValueType("x")).toBe("string");
    expect(getValueType(1)).toBe("number");
    expect(getValueType(true)).toBe("boolean");
  });
});

describe("summarizeContainer", () => {
  it("counts object and array entries", () => {
    expect(summarizeContainer({ a: 1, b: 2, c: 3 })).toEqual({
      count: 3,
      type: "object",
    });
    expect(summarizeContainer([1, 2, 3, 4, 5])).toEqual({
      count: 5,
      type: "array",
    });
  });

  it("returns null for primitives", () => {
    expect(summarizeContainer("x")).toBeNull();
    expect(summarizeContainer(null)).toBeNull();
  });
});

describe("tryParseNestedJson", () => {
  it("parses stringified objects and arrays", () => {
    expect(tryParseNestedJson('{"id": 1}')).toEqual({ id: 1 });
    expect(tryParseNestedJson("[1, 2]")).toEqual([1, 2]);
    expect(tryParseNestedJson('  {"id": 1}  ')).toEqual({ id: 1 });
  });

  it("ignores scalars and non-JSON strings", () => {
    expect(tryParseNestedJson("42")).toBeNull();
    expect(tryParseNestedJson('"hi"')).toBeNull();
    expect(tryParseNestedJson("hello world")).toBeNull();
    expect(tryParseNestedJson("{broken")).toBeNull();
  });
});

describe("formatJson", () => {
  it("pretty-prints with two-space indentation", () => {
    expect(formatJson({ a: 1 })).toBe('{\n  "a": 1\n}');
  });
});

describe("buildMatchIndex", () => {
  const tree = { a: { b: { c: 1 } }, d: 2 };

  it("returns an empty set for a blank query", () => {
    expect(buildMatchIndex(tree, "   ").size).toBe(0);
  });

  it("includes the matched node and all of its ancestors", () => {
    const index = buildMatchIndex(tree, "c");
    expect(index).toEqual(
      new Set([
        ROOT_PATH,
        childPath(ROOT_PATH, "a"),
        childPath(childPath(ROOT_PATH, "a"), "b"),
        childPath(childPath(childPath(ROOT_PATH, "a"), "b"), "c"),
      ]),
    );
  });

  it("matches primitive values, not just keys", () => {
    const index = buildMatchIndex(tree, "2");
    expect(index).toEqual(new Set([ROOT_PATH, childPath(ROOT_PATH, "d")]));
  });

  it("matches array elements by index path", () => {
    const index = buildMatchIndex({ items: ["x", "needle"] }, "needle");
    expect(index.has(childPath(childPath(ROOT_PATH, "items"), 1))).toBe(true);
  });
});
