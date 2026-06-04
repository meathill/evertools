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

export function getTools(content: LocaleContent): ToolDefinition[] {
  return [
    getImageConverterTool(content),
    getPdfTextEditorTool(content),
    getJsonViewerTool(content),
  ];
}
