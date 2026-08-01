type StructuredDataProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

// JSON-LD 只能靠 dangerouslySetInnerHTML 注入：React 会把 children 里的文本转义成
// HTML 实体，搜索引擎解析 ld+json 时就拿到坏数据了。
// 转义 `<` 是这里唯一的实际风险点——正文里出现 `</script>` 会提前闭合标签。
function serializeJsonLd(data: StructuredDataProps["data"]): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: ld+json 无法用 children 渲染，内容来自本仓库文案且已转义 `<`
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      type="application/ld+json"
    />
  );
}
