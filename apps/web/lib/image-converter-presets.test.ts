import { describe, expect, it } from "vitest";
import {
  DIMENSION_PRESET_GROUPS,
  DIMENSION_PRESETS,
  findMatchingPreset,
  getDimensionPreset,
} from "@/lib/image-converter-presets";

describe("DIMENSION_PRESETS", () => {
  it("key 全局唯一", () => {
    const keys = DIMENSION_PRESETS.map((preset) => preset.key);

    expect(new Set(keys).size).toBe(keys.length);
  });

  it("宽高都是正整数", () => {
    for (const preset of DIMENSION_PRESETS) {
      expect(Number.isInteger(preset.width)).toBe(true);
      expect(Number.isInteger(preset.height)).toBe(true);
      expect(preset.width).toBeGreaterThan(0);
      expect(preset.height).toBeGreaterThan(0);
    }
  });

  it("每个分组都有预设，分组值合法", () => {
    for (const group of DIMENSION_PRESET_GROUPS) {
      expect(DIMENSION_PRESETS.some((preset) => preset.group === group)).toBe(
        true,
      );
    }

    for (const preset of DIMENSION_PRESETS) {
      expect(DIMENSION_PRESET_GROUPS).toContain(preset.group);
    }
  });
});

describe("getDimensionPreset", () => {
  it("按 key 命中预设", () => {
    const preset = getDimensionPreset("iphoneSixPointFive");

    expect(preset).toMatchObject({ height: 2688, width: 1242 });
  });

  it("未知 key 返回 null", () => {
    expect(getDimensionPreset("nonexistent")).toBeNull();
  });
});

describe("findMatchingPreset", () => {
  it("宽高完全匹配时返回对应预设", () => {
    const preset = findMatchingPreset("1242", "2688");

    expect(preset?.key).toBe("iphoneSixPointFive");
  });

  it("容忍首尾空格", () => {
    expect(findMatchingPreset(" 1920 ", " 1080 ")?.key).toBe("fullHd");
  });

  it("不匹配任何预设时返回 null", () => {
    expect(findMatchingPreset("123", "456")).toBeNull();
  });

  it("输入为空或非整数时返回 null", () => {
    expect(findMatchingPreset("", "")).toBeNull();
    expect(findMatchingPreset("1242", "")).toBeNull();
    expect(findMatchingPreset("1242.5", "2688")).toBeNull();
    expect(findMatchingPreset("abc", "2688")).toBeNull();
  });
});
