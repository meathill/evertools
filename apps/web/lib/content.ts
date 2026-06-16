import {
  type ConversionPair,
  conversionFormatLabel,
  conversionSlug,
} from "@/lib/conversions";
import type { LocaleContent } from "@/messages/types";

export type ToolFaq = {
  answer: string;
  question: string;
};

export type ToolDefinition = {
  applicationCategory: string;
  category: string;
  description: string;
  faq: readonly ToolFaq[];
  features: readonly string[];
  href: string;
  keywords: readonly string[];
  name: string;
  slug: string;
  steps: readonly string[];
  stepsTitle: string;
  summary: string;
  totalTime: string;
};

export function getImageConverterTool(content: LocaleContent): ToolDefinition {
  return {
    applicationCategory: "MultimediaApplication",
    category: content.imageConverter.tool.category,
    description: content.imageConverter.tool.description,
    faq: content.imageConverter.tool.faq,
    features: content.imageConverter.tool.features,
    href: "/tools/image-converter",
    keywords: content.imageConverter.tool.keywords,
    name: content.imageConverter.tool.name,
    slug: "image-converter",
    steps: content.imageConverter.tool.steps,
    stepsTitle: content.imageConverter.content.stepsTitle,
    summary: content.imageConverter.tool.summary,
    totalTime: "PT1M",
  };
}

// 转换落地页（如 heic-to-jpg）：唯一字段用模板插值生成强 SEO 信号，
// features/steps/faq 等正文直接复用图片转换器内容，避免重写 9×7 份文案。
export function getConversionTool(
  content: LocaleContent,
  pair: ConversionPair,
): ToolDefinition {
  const { imageConverter } = content;
  const { conversions } = imageConverter;
  const from = conversionFormatLabel(pair.from);
  const to = conversionFormatLabel(pair.to);
  const fill = (value: string) =>
    value.replaceAll("{from}", from).replaceAll("{to}", to);
  const slug = conversionSlug(pair);

  return {
    applicationCategory: "MultimediaApplication",
    category: imageConverter.tool.category,
    description: fill(conversions.description),
    faq: imageConverter.tool.faq,
    features: imageConverter.tool.features,
    href: `/tools/${slug}`,
    keywords: conversions.keywords.map(fill),
    name: fill(conversions.title),
    slug,
    steps: imageConverter.tool.steps,
    stepsTitle: imageConverter.content.stepsTitle,
    summary: imageConverter.tool.summary,
    totalTime: "PT1M",
  };
}

export function getPdfTextEditorTool(content: LocaleContent): ToolDefinition {
  return {
    applicationCategory: "BusinessApplication",
    category: content.pdfTextEditor.tool.category,
    description: content.pdfTextEditor.tool.description,
    faq: content.pdfTextEditor.tool.faq,
    features: content.pdfTextEditor.tool.features,
    href: "/tools/pdf-text-editor",
    keywords: content.pdfTextEditor.tool.keywords,
    name: content.pdfTextEditor.tool.name,
    slug: "pdf-text-editor",
    steps: content.pdfTextEditor.tool.steps,
    stepsTitle: content.pdfTextEditor.content.stepsTitle,
    summary: content.pdfTextEditor.tool.summary,
    totalTime: "PT3M",
  };
}

export function getJsonViewerTool(content: LocaleContent): ToolDefinition {
  return {
    applicationCategory: "DeveloperApplication",
    category: content.jsonViewer.tool.category,
    description: content.jsonViewer.tool.description,
    faq: content.jsonViewer.tool.faq,
    features: content.jsonViewer.tool.features,
    href: "/tools/json-viewer",
    keywords: content.jsonViewer.tool.keywords,
    name: content.jsonViewer.tool.name,
    slug: "json-viewer",
    steps: content.jsonViewer.tool.steps,
    stepsTitle: content.jsonViewer.content.stepsTitle,
    summary: content.jsonViewer.tool.summary,
    totalTime: "PT1M",
  };
}

export function getOgImageValidatorTool(
  content: LocaleContent,
): ToolDefinition {
  return {
    applicationCategory: "DeveloperApplication",
    category: content.ogImageValidator.tool.category,
    description: content.ogImageValidator.tool.description,
    faq: content.ogImageValidator.tool.faq,
    features: content.ogImageValidator.tool.features,
    href: "/tools/og-image-validator",
    keywords: content.ogImageValidator.tool.keywords,
    name: content.ogImageValidator.tool.name,
    slug: "og-image-validator",
    steps: content.ogImageValidator.tool.steps,
    stepsTitle: content.ogImageValidator.content.stepsTitle,
    summary: content.ogImageValidator.tool.summary,
    totalTime: "PT1M",
  };
}

export function getTools(content: LocaleContent): ToolDefinition[] {
  return [
    getImageConverterTool(content),
    getPdfTextEditorTool(content),
    getJsonViewerTool(content),
    getOgImageValidatorTool(content),
  ];
}
