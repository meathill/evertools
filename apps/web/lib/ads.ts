// AdSense 接入常量。
// 脚本在 app/[locale]/layout.tsx 以 lazyOnload 加载（不占 TBT 窗口）；
// 手动广告位用 components/ads/adsense-unit.tsx 渲染。

export const ADSENSE_CLIENT_ID = "ca-pub-9946806099979342";

/**
 * 手动广告位 ID，在 AdSense 控制台按标注的规格创建固定单元后填入。
 * 未填的槽位不渲染、不预留空间，页面行为与没有该组件完全一致。
 *
 * 注意：手动广告位只保证「自己不产生布局位移」，自动广告仍会动态
 * 插入内容引起 CLS，启用后需在控制台关闭 Auto ads 的 In-page 展示广告。
 */
export const ADSENSE_SLOTS = {
  /** 336x280 固定展示单元，渲染在所有工具页工具区下方 */
  toolBelow: "9590460578",
} as const;
