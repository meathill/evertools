import type { LocaleContent } from "./types";

export const enMessages: LocaleContent = {
  metadata: {
    defaultTitle: "Online Tools",
    siteDescription:
      "Meathill Tools offers online utilities that run directly in your browser. The first live tool converts image formats and sizes with local processing and no uploads.",
    siteTitle: "Meathill Tools",
  },
  header: {
    languageSwitcherLabel: "Language",
    localProcessing: "Local processing",
    nav: {
      home: "Home",
      imageConverter: "Image Converter",
    },
    tagline: "Practical online tools",
  },
  footer: {
    description:
      "This is an online toolbox for everyday productivity tasks. The first tool handles image format and size conversion, and more instant-use utilities will be added over time.",
    toolsTitle: "Available tools",
  },
  toolCard: {
    firstBatch: "Launch batch",
    footerHint: "Best for quick single-image edits",
    openTool: "Open tool",
  },
  home: {
    metadata: {
      description:
        "Meathill Tools provides browser-based online tools. The current release focuses on image format and size conversion with local processing, fast usage and indexable landing pages.",
      keywords: [
        "online tools",
        "browser tools",
        "image converter",
        "resize image",
        "convert png to jpg",
      ],
      title: "Online Tools",
    },
    structuredData: {
      toolListName: "Meathill Tools list",
    },
    hero: {
      badges: {
        scalable: "Expandable",
        seo: "SEO-friendly",
        stack: "Next.js + Cloudflare",
      },
      description:
        "Meathill Tools collects practical online utilities. The first release is an image format and size converter built for speed, direct use and local processing instead of a heavy SaaS workflow.",
      primaryCta: "Use image converter",
      secondaryCta: "Browse tools",
      title:
        "A tools site that search engines can find and people can use right away.",
    },
    strategy: {
      description:
        "The goal is not to pile up widgets, but to build searchable pages that solve frequent tasks directly.",
      indexedPagesDescription:
        "Each tool page includes clear explanations, steps and FAQ so it is not just a thin upload box.",
      indexedPagesTitle: "Indexable pages",
      lightweightExpansionDescription:
        "The site runs on Cloudflare Workers and will keep adding more focused tool pages with their own SEO entries.",
      lightweightExpansionTitle: "Lightweight expansion",
      localProcessingDescription:
        "The first tool processes images entirely in the browser, which is faster and better for privacy.",
      localProcessingTitle: "Local processing",
      title: "Current site strategy",
    },
    tools: {
      description:
        "Every tool gets its own page, title and description so users can land on the exact solution from search instead of drilling through a generic homepage.",
      title: "Available tools",
    },
    info: {
      expansionMatrixDescription:
        "The site will gradually grow into a clear set of tool entry points that can each capture organic search traffic.",
      expansionMatrixTitle: "Expand page by page",
      highFrequencyDescription:
        "The first batch focuses on frequent tasks such as image handling, text processing, encoding conversion and developer utilities.",
      highFrequencyTitle: "Start with frequent tasks",
      substantialPagesDescription:
        "Each tool page explains supported formats, steps, limits and privacy boundaries so search engines can understand the topic.",
      substantialPagesTitle: "Real pages, not shells",
    },
  },
  imageConverter: {
    metadata: {
      description:
        "Convert PNG, JPG and WebP images online and resize them in the browser. Files stay local, so it is ideal for quick format switches, resizing and exports.",
      keywords: [
        "image converter",
        "resize image online",
        "png to jpg",
        "webp to png",
        "compress image browser",
      ],
      title: "Image Format and Size Converter",
    },
    hero: {
      badges: {
        category: "Image tool",
        localProcessing: "Browser-side processing",
        singleImage: "Single image",
      },
      description:
        "Convert between PNG, JPG and WebP, resize images and export results directly in the browser without uploading files to a server.",
      title: "Image Format and Size Converter",
    },
    scenarios: {
      description:
        "It is designed for common web image tasks, not for complex editor workflows.",
      privacy:
        "You care about privacy and do not want to upload files to a third-party service.",
      ratio:
        "You want to keep aspect ratio without calculating width and height manually.",
      title: "What this version is good for",
      transform:
        "You want to turn PNG into JPG or WebP, or shrink a large image to a web-friendly size.",
    },
    tool: {
      category: "Image tool",
      description:
        "Convert PNG, JPG and WebP images and resize them online. Everything runs in your browser without uploads, which works well for quick compression, resizing and format changes.",
      faq: [
        {
          answer:
            "No. This first version processes images entirely in your browser and never sends files to the server.",
          question: "Will my image be uploaded?",
        },
        {
          answer:
            "The current release supports single-image conversion and resizing for PNG, JPG/JPEG and WebP.",
          question: "Which image formats are supported?",
        },
        {
          answer:
            "JPEG does not support transparency. If the source image has transparent pixels, the exported JPEG will use a white background.",
          question: "What happens to transparent backgrounds in JPEG?",
        },
      ],
      features: [
        "Convert between PNG, JPG and WebP",
        "Set custom width and height with optional aspect ratio lock",
        "Adjust JPEG and WebP quality",
        "Preview and download the output image directly",
        "Local processing with no uploads",
      ],
      keywords: [
        "image converter",
        "resize image online",
        "png to jpg",
        "webp to png",
        "compress image browser",
      ],
      name: "Image Format and Size Converter",
      steps: [
        "Upload a PNG, JPG or WebP image.",
        "Choose the output format and enter target dimensions if needed.",
        "Optionally lock aspect ratio and adjust compression quality.",
        "Generate the result, preview it and download the converted image.",
      ],
      summary:
        "Convert image formats, resize dimensions and tune quality entirely in the browser.",
    },
    content: {
      faqDescription:
        "A few questions people often care about before using the tool.",
      faqTitle: "FAQ",
      privacyDescription:
        "These boundaries are worth stating clearly before you use the tool.",
      privacyItems: [
        "Images are never uploaded. All conversion happens in your browser.",
        "JPEG does not support transparency, so transparent areas will be filled with white.",
        "This first version does not handle HEIC, animated GIF, SVG export or batch conversion yet.",
      ],
      privacyTitle: "Privacy and limitations",
      stepsDescription:
        "The usage flow is written out so search users can quickly judge whether this page fits their task.",
      stepsTitle: "How to use it",
      supportDescription:
        "The first version focuses on common web image tasks, so it currently supports PNG, JPG/JPEG and WebP for both input and output.",
      supportTitle: "Current support",
    },
    client: {
      badges: {
        firstVersion: "First release",
        localProcessing: "Browser-side processing",
        stale: "Settings changed",
        stalePreview: "Regenerate needed",
        supportedFormats: "Supports {formats}",
      },
      upload: {
        chooseImage: "Choose image",
        clear: "Clear",
        description:
          "Drag an image into the area below or click the button to choose one. This first release handles a single image only and never uploads it.",
        emptyDescription:
          "Supports PNG, JPG/JPEG and WebP. You can resize the image, switch output format and adjust quality.",
        emptyTitle: "Drop an image to begin",
        pendingResult: "Adjust settings and generate a result",
        reselect: "Choose another",
        resultLabel: "Result",
        sourceLabel: "Source",
        title: "Upload image",
      },
      settings: {
        aspectLockDescription:
          "When enabled, changing one side updates the other automatically.",
        aspectLockTitle: "Lock original ratio",
        description:
          "Choose the output format first, then decide whether to change width and height. JPEG and WebP also support quality control.",
        download: "Download image",
        generate: "Generate result",
        height: "Height (px)",
        heightPlaceholder: "e.g. 800",
        quality: "Output quality",
        qualityAria: "Output quality",
        qualityDescription:
          "Higher quality usually means a larger file. Starting around 82 is a practical default.",
        regenerate: "Regenerate result",
        targetFormat: "Output format",
        title: "Conversion settings",
        width: "Width (px)",
        widthPlaceholder: "e.g. 1200",
      },
      preview: {
        alt: "{label} preview",
        emptyDescription:
          "The generated image will appear here so you can preview and download it directly.",
      },
      errors: {
        blobFailed:
          "The browser did not generate an output image. Please try again.",
        canvasUnsupported:
          "This browser does not support Canvas, so image conversion is not available.",
        convertFailed: "Conversion failed. Please try again later.",
        imageBroken:
          "The image could not be read. Please make sure the file is not corrupted.",
        invalidDimensions: "Width and height must be integers greater than 0.",
        readFailed: "Failed to read the image. Please try another file.",
        unsupportedFormat:
          "This format is not supported yet. Please upload a {formats} image.",
        unsupportedOutput: "This browser cannot export {format} right now.",
        uploadFirst: "Please upload an image first.",
      },
    },
    formats: {
      jpg: {
        description: "Lossy, good for photos; transparent areas become white",
        label: "JPG",
      },
      png: {
        description: "Lossless, good for screenshots, icons and transparency",
        label: "PNG",
      },
      webp: {
        description: "Higher compression, good for web images",
        label: "WebP",
      },
    },
  },
};
