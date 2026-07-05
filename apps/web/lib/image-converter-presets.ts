// 尺寸预设：常见的固定输出尺寸（App 商店截图、社交媒体、常用屏幕）。
// 预设名称走 i18n（content.client.settings.presetNames[key]），尺寸部分由 UI 拼接。

export const DIMENSION_PRESET_GROUPS = [
  "appStore",
  "social",
  "screen",
] as const;

export type DimensionPresetGroup = (typeof DIMENSION_PRESET_GROUPS)[number];

export type DimensionPreset = {
  group: DimensionPresetGroup;
  height: number;
  key: string;
  width: number;
};

export const DIMENSION_PRESETS = [
  { group: "appStore", height: 2868, key: "iphoneSixPointNine", width: 1320 },
  { group: "appStore", height: 2688, key: "iphoneSixPointFive", width: 1242 },
  { group: "appStore", height: 2208, key: "iphoneFivePointFive", width: 1242 },
  {
    group: "appStore",
    height: 2732,
    key: "ipadProTwelvePointNine",
    width: 2048,
  },
  { group: "appStore", height: 1920, key: "googlePlayPhone", width: 1080 },
  { group: "appStore", height: 500, key: "googlePlayFeature", width: 1024 },
  { group: "social", height: 630, key: "ogImage", width: 1200 },
  { group: "social", height: 675, key: "twitterCard", width: 1200 },
  { group: "social", height: 720, key: "youtubeCover", width: 1280 },
  { group: "social", height: 1080, key: "instagramSquare", width: 1080 },
  { group: "social", height: 1440, key: "xiaohongshuPortrait", width: 1080 },
  { group: "social", height: 383, key: "wechatCover", width: 900 },
  { group: "screen", height: 2160, key: "fourK", width: 3840 },
  { group: "screen", height: 1440, key: "qhd", width: 2560 },
  { group: "screen", height: 1080, key: "fullHd", width: 1920 },
  { group: "screen", height: 720, key: "hd", width: 1280 },
  { group: "screen", height: 600, key: "svga", width: 800 },
] as const satisfies readonly DimensionPreset[];

// 带字面量 key 类型的预设条目，方便用 key 直接索引 i18n 的 presetNames。
export type DimensionPresetEntry = (typeof DIMENSION_PRESETS)[number];
export type DimensionPresetKey = DimensionPresetEntry["key"];

export function getDimensionPreset(key: string): DimensionPresetEntry | null {
  return DIMENSION_PRESETS.find((preset) => preset.key === key) ?? null;
}

// 反查当前宽高输入对应的预设（下拉回显用）；输入不完整或不匹配任何预设时返回 null。
export function findMatchingPreset(
  widthInput: string,
  heightInput: string,
): DimensionPresetEntry | null {
  const width = Number(widthInput.trim());
  const height = Number(heightInput.trim());

  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    return null;
  }

  return (
    DIMENSION_PRESETS.find(
      (preset) => preset.width === width && preset.height === height,
    ) ?? null
  );
}
