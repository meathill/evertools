import { describe, expect, it } from "vitest";
import { convertChineseText } from "@/lib/chinese-converter";

describe("convertChineseText", () => {
  it("空字符串返回空字符串", async () => {
    expect(await convertChineseText("", "toTraditional", "standard")).toBe("");
    expect(await convertChineseText("", "toSimplified", "taiwan")).toBe("");
  });

  it("非中文内容原样透传", async () => {
    const text = "Hello 123 ，测试！";
    expect(await convertChineseText(text, "toTraditional", "standard")).toBe(
      "Hello 123 ，測試！",
    );
  });

  describe("简体转标准繁体", () => {
    it("字符级转换", async () => {
      expect(
        await convertChineseText("汉字", "toTraditional", "standard"),
      ).toBe("漢字");
      expect(
        await convertChineseText("软件", "toTraditional", "standard"),
      ).toBe("軟件");
    });

    it("无变化的词保持不变", async () => {
      expect(
        await convertChineseText("皇后", "toTraditional", "standard"),
      ).toBe("皇后");
    });
  });

  describe("简体转台湾正体", () => {
    it("地区惯用词转换", async () => {
      expect(await convertChineseText("软件", "toTraditional", "taiwan")).toBe(
        "軟體",
      );
      expect(await convertChineseText("网络", "toTraditional", "taiwan")).toBe(
        "網路",
      );
      expect(await convertChineseText("鼠标", "toTraditional", "taiwan")).toBe(
        "滑鼠",
      );
    });
  });

  describe("简体转港澳繁体", () => {
    it("地区惯用词转换", async () => {
      expect(
        await convertChineseText("硬盘", "toTraditional", "hongkong"),
      ).toBe("硬碟");
      expect(
        await convertChineseText("软件", "toTraditional", "hongkong"),
      ).toBe("軟件");
    });
  });

  describe("繁体转简体", () => {
    it("标准繁体转回简体", async () => {
      expect(await convertChineseText("漢字", "toSimplified", "standard")).toBe(
        "汉字",
      );
    });

    it("台湾正体转回简体", async () => {
      expect(await convertChineseText("軟體", "toSimplified", "taiwan")).toBe(
        "软件",
      );
      expect(await convertChineseText("滑鼠", "toSimplified", "taiwan")).toBe(
        "鼠标",
      );
    });

    it("港澳繁体转回简体", async () => {
      expect(await convertChineseText("硬碟", "toSimplified", "hongkong")).toBe(
        "硬盘",
      );
    });
  });

  it("往返转换保持一致", async () => {
    const original = "打印机";
    const traditional = await convertChineseText(
      original,
      "toTraditional",
      "taiwan",
    );
    expect(traditional).toBe("印表機");
    const roundTrip = await convertChineseText(
      traditional,
      "toSimplified",
      "taiwan",
    );
    expect(roundTrip).toBe(original);
  });
});
