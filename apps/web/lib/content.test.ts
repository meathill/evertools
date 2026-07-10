import { describe, expect, it } from "vitest";
import {
  getHtmlToMarkdownTool,
  getImageConverterTool,
  getImageCropperTool,
  getJsonViewerTool,
  getOgImageValidatorTool,
  getPdfTextEditorTool,
  getSitemapValidatorTool,
  getTools,
} from "@/lib/content";
import { getLocaleContent } from "@/messages";

const zh = getLocaleContent("zh");

describe("getImageConverterTool", () => {
  it("builds the image-converter definition", () => {
    const tool = getImageConverterTool(zh);
    expect(tool.slug).toBe("image-converter");
    expect(tool.href).toBe("/tools/image-converter");
    expect(tool.applicationCategory).toBe("MultimediaApplication");
    expect(tool.totalTime).toBe("PT1M");
    expect(tool.stepsTitle).toBe(zh.imageConverter.content.stepsTitle);
    expect(tool.name).toBe(zh.imageConverter.tool.name);
    expect(tool.faq).toEqual(zh.imageConverter.tool.faq);
  });
});

describe("getImageCropperTool", () => {
  it("builds the image-cropper definition", () => {
    const tool = getImageCropperTool(zh);
    expect(tool.slug).toBe("image-cropper");
    expect(tool.href).toBe("/tools/image-cropper");
    expect(tool.applicationCategory).toBe("MultimediaApplication");
    expect(tool.totalTime).toBe("PT1M");
    expect(tool.stepsTitle).toBe(zh.imageCropper.content.stepsTitle);
    expect(tool.name).toBe(zh.imageCropper.tool.name);
    expect(tool.faq).toEqual(zh.imageCropper.tool.faq);
  });
});

describe("getPdfTextEditorTool", () => {
  it("builds the pdf-text-editor definition", () => {
    const tool = getPdfTextEditorTool(zh);
    expect(tool.slug).toBe("pdf-text-editor");
    expect(tool.href).toBe("/tools/pdf-text-editor");
    expect(tool.applicationCategory).toBe("BusinessApplication");
    expect(tool.totalTime).toBe("PT3M");
    expect(tool.stepsTitle).toBe(zh.pdfTextEditor.content.stepsTitle);
  });
});

describe("getJsonViewerTool", () => {
  it("builds the json-viewer definition", () => {
    const tool = getJsonViewerTool(zh);
    expect(tool.slug).toBe("json-viewer");
    expect(tool.href).toBe("/tools/json-viewer");
    expect(tool.applicationCategory).toBe("DeveloperApplication");
    expect(tool.totalTime).toBe("PT1M");
    expect(tool.stepsTitle).toBe(zh.jsonViewer.content.stepsTitle);
  });
});

describe("getOgImageValidatorTool", () => {
  it("builds the og-image-validator definition", () => {
    const tool = getOgImageValidatorTool(zh);
    expect(tool.slug).toBe("og-image-validator");
    expect(tool.href).toBe("/tools/og-image-validator");
    expect(tool.applicationCategory).toBe("DeveloperApplication");
    expect(tool.totalTime).toBe("PT1M");
    expect(tool.stepsTitle).toBe(zh.ogImageValidator.content.stepsTitle);
  });
});

describe("getSitemapValidatorTool", () => {
  it("builds the sitemap-validator definition", () => {
    const tool = getSitemapValidatorTool(zh);
    expect(tool.slug).toBe("sitemap-validator");
    expect(tool.href).toBe("/tools/sitemap-validator");
    expect(tool.applicationCategory).toBe("DeveloperApplication");
    expect(tool.totalTime).toBe("PT1M");
    expect(tool.stepsTitle).toBe(zh.sitemapValidator.content.stepsTitle);
  });
});

describe("getHtmlToMarkdownTool", () => {
  it("builds the html-to-markdown definition", () => {
    const tool = getHtmlToMarkdownTool(zh);
    expect(tool.slug).toBe("html-to-markdown");
    expect(tool.href).toBe("/tools/html-to-markdown");
    expect(tool.applicationCategory).toBe("UtilitiesApplication");
    expect(tool.totalTime).toBe("PT1M");
    expect(tool.stepsTitle).toBe(zh.htmlToMarkdown.content.stepsTitle);
    expect(tool.name).toBe(zh.htmlToMarkdown.tool.name);
    expect(tool.faq).toEqual(zh.htmlToMarkdown.tool.faq);
  });
});

describe("getTools", () => {
  it("returns the eight tools in registration order", () => {
    expect(getTools(zh).map((tool) => tool.slug)).toEqual([
      "image-converter",
      "image-cropper",
      "pdf-text-editor",
      "json-viewer",
      "og-image-validator",
      "markdown-to-pdf",
      "sitemap-validator",
      "html-to-markdown",
    ]);
  });

  it("gives every tool the fields the tool pages consume", () => {
    for (const tool of getTools(zh)) {
      expect(tool.applicationCategory.length).toBeGreaterThan(0);
      expect(tool.totalTime).toMatch(/^PT/);
      expect(tool.stepsTitle.length).toBeGreaterThan(0);
      expect(tool.name.length).toBeGreaterThan(0);
      expect(tool.description.length).toBeGreaterThan(0);
      expect(tool.features.length).toBeGreaterThan(0);
      expect(tool.steps.length).toBeGreaterThan(0);
    }
  });
});
