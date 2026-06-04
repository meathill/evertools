import { describe, expect, it } from "vitest";
import {
  getImageConverterTool,
  getJsonViewerTool,
  getPdfTextEditorTool,
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

describe("getTools", () => {
  it("returns the three tools in registration order", () => {
    expect(getTools(zh).map((tool) => tool.slug)).toEqual([
      "image-converter",
      "pdf-text-editor",
      "json-viewer",
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
