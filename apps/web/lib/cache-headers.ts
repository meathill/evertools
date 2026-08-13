export const OG_IMAGE_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";

// opengraph-image 均为运行时渲染（next/og ImageResponse），不在构建期产出。
// URL 带源文件内容 hash，但渲染内容依赖 messages 文案——文案更新时 URL 不变，
// 所以不能 immutable，取与文案低频更新节奏匹配的缓存时长（1 天 + 7 天 SWR）。
export const OG_IMAGE_CACHE_RULE = {
  source: "/:path*/opengraph-image",
  headers: [{ key: "Cache-Control", value: OG_IMAGE_CACHE_CONTROL }],
};
