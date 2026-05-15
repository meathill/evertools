import type { LocaleContent } from "@/messages/types";

export type ToolFaq = {
  answer: string;
  question: string;
};

export type ToolDefinition = {
  category: string;
  description: string;
  faq: readonly ToolFaq[];
  features: readonly string[];
  href: string;
  keywords: readonly string[];
  name: string;
  slug: string;
  steps: readonly string[];
  summary: string;
};

export function getImageConverterTool(content: LocaleContent): ToolDefinition {
  return {
    category: content.imageConverter.tool.category,
    description: content.imageConverter.tool.description,
    faq: content.imageConverter.tool.faq,
    features: content.imageConverter.tool.features,
    href: "/tools/image-converter",
    keywords: content.imageConverter.tool.keywords,
    name: content.imageConverter.tool.name,
    slug: "image-converter",
    steps: content.imageConverter.tool.steps,
    summary: content.imageConverter.tool.summary,
  };
}

export function getPdfTextEditorTool(content: LocaleContent): ToolDefinition {
  return {
    category: content.pdfTextEditor.tool.category,
    description: content.pdfTextEditor.tool.description,
    faq: content.pdfTextEditor.tool.faq,
    features: content.pdfTextEditor.tool.features,
    href: "/tools/pdf-text-editor",
    keywords: content.pdfTextEditor.tool.keywords,
    name: content.pdfTextEditor.tool.name,
    slug: "pdf-text-editor",
    steps: content.pdfTextEditor.tool.steps,
    summary: content.pdfTextEditor.tool.summary,
  };
}

export function getTools(content: LocaleContent): ToolDefinition[] {
  return [getImageConverterTool(content), getPdfTextEditorTool(content)];
}
