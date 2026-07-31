import type { ToolDefinition } from "@/lib/content";
import {
  type ConversionPair,
  conversionFormatLabel,
  conversionNoteKeys,
  conversionSlug,
} from "@/lib/conversions";
import type { LocaleContent } from "@/messages/types";

// 落地页正文的"差异化"策略：不给 18 个配对 × 7 语言各写一份文案，
// 而是把事实拆成「来源格式的痛点 + 目标格式的收益 + 由格式特性推导出的注意事项」，
// 再按配对组合。每个页面拿到的 features / steps / faq 组合都不同，不是同一段话换名字。
function createFiller(pair: ConversionPair): (value: string) => string {
  const from = conversionFormatLabel(pair.from);
  const to = conversionFormatLabel(pair.to);

  return (value) => value.replaceAll("{from}", from).replaceAll("{to}", to);
}

export function getConversionTool(
  content: LocaleContent,
  pair: ConversionPair,
): ToolDefinition {
  const { imageConverter } = content;
  const { conversions } = imageConverter;
  const fill = createFiller(pair);
  const slug = conversionSlug(pair);
  // 第一条注意事项放进 hero 的场景卡，其余落到正文的特性卡，避免同页重复。
  const [, ...secondaryNoteKeys] = conversionNoteKeys(pair);

  return {
    category: imageConverter.tool.category,
    description: fill(conversions.description),
    faq: [
      ...conversions.faq.base,
      ...conversionNoteKeys(pair).map((key) => conversions.faq.notes[key]),
    ].map((item) => ({
      answer: fill(item.answer),
      question: fill(item.question),
    })),
    features: [
      ...conversions.features.map(fill),
      ...secondaryNoteKeys.map((key) => fill(conversions.notes[key])),
    ],
    href: `/tools/${slug}`,
    keywords: conversions.keywords.map(fill),
    name: fill(conversions.title),
    slug,
    steps: conversions.steps.map(fill),
    stepsTitle: imageConverter.content.stepsTitle,
    summary: fill(conversions.summary),
    totalTime: "PT1M",
  };
}

export type ConversionPageCopy = {
  badge: string;
  privacyItems: readonly string[];
  scenarios: {
    description: string;
    rows: readonly string[];
    title: string;
  };
};

// ToolDefinition 之外、只有落地页会用到的文案（hero 场景卡 / 徽标 / 说明卡）。
export function getConversionPageCopy(
  content: LocaleContent,
  pair: ConversionPair,
): ConversionPageCopy {
  const { conversions } = content.imageConverter;
  const fill = createFiller(pair);
  const [primaryNoteKey] = conversionNoteKeys(pair);

  return {
    badge: fill(conversions.badge),
    privacyItems: conversions.privacyItems.map(fill),
    scenarios: {
      description: fill(conversions.scenariosDescription),
      rows: [
        fill(conversions.sourceNotes[pair.from]),
        fill(conversions.targetNotes[pair.to]),
        fill(conversions.notes[primaryNoteKey]),
      ],
      title: fill(conversions.scenariosTitle),
    },
  };
}
