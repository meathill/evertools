import type { LocaleContent } from "./types";

export const enMessages: LocaleContent = {
  metadata: {
    defaultTitle: "Online Tools",
    siteDescription:
      "Meathill Tools offers online tools that run directly in your browser. You can currently convert image formats and resize images with local processing and no uploads.",
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
      "Online tools for quick everyday tasks. Right now you can convert image formats and resize images directly in the browser.",
    toolsTitle: "Available tools",
  },
  toolCard: {
    firstBatch: "Popular",
    footerHint: "Best for quick single-image edits",
    openTool: "Open tool",
  },
  home: {
    metadata: {
      description:
        "Meathill Tools offers online tools you can use right away in the browser. Start with image format conversion, resizing and direct download.",
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
        scalable: "Local processing",
        seo: "No upload",
        stack: "Fast export",
      },
      description:
        "Start with image format conversion and resizing. Choose an image, adjust format and dimensions in the browser, then preview and download the result.",
      primaryCta: "Start converting images",
      secondaryCta: "Browse tools",
      title: "Online tools you can open and use right away.",
    },
    strategy: {
      description: "Built for quick image tasks with as few steps as possible.",
      indexedPagesDescription:
        "Choose an image, set format and size, then generate the result on one page.",
      indexedPagesTitle: "Start immediately",
      lightweightExpansionDescription:
        "Preview the output and download it right away.",
      lightweightExpansionTitle: "Easy export",
      localProcessingDescription:
        "Images are processed entirely in the browser, which is faster and better for privacy.",
      localProcessingTitle: "Local processing",
      title: "Why use it",
    },
    tools: {
      description: "Tools currently available for direct use.",
      title: "Available tools",
    },
    info: {
      expansionMatrixDescription:
        "Check the result before saving it to your device.",
      expansionMatrixTitle: "Preview and download",
      highFrequencyDescription:
        "Convert between PNG, JPG/JPEG and WebP, and resize when needed.",
      highFrequencyTitle: "Common formats",
      substantialPagesDescription:
        "No sign-up or install, just open the page and process your image.",
      substantialPagesTitle: "Quick workflow",
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
        "If you just need a quick format change, resize or export, this tool keeps it simple.",
      privacy:
        "You care about privacy and do not want to upload files to a third-party service.",
      ratio:
        "You want to keep aspect ratio without calculating width and height manually.",
      title: "Good for tasks like these",
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
            "No. Image processing happens entirely in your browser and files are never sent to the server.",
          question: "Will my image be uploaded?",
        },
        {
          answer:
            "It currently supports single-image conversion and resizing for PNG, JPG/JPEG and WebP.",
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
      faqDescription: "A few common questions before you start.",
      faqTitle: "FAQ",
      privacyDescription:
        "A few limitations and notes worth knowing before you use the tool.",
      privacyItems: [
        "Images are never uploaded. All conversion happens in your browser.",
        "JPEG does not support transparency, so transparent areas will be filled with white.",
        "HEIC, animated GIF, SVG export and batch conversion are not supported yet.",
      ],
      privacyTitle: "Notes and limitations",
      stepsDescription: "Follow these steps to convert your image.",
      stepsTitle: "How to use it",
      supportDescription:
        "PNG, JPG/JPEG and WebP are supported for both input and output.",
      supportTitle: "Supported formats",
    },
    client: {
      badges: {
        firstVersion: "Single image",
        localProcessing: "Browser-side processing",
        stale: "Settings changed",
        stalePreview: "Regenerate needed",
        supportedFormats: "Supports {formats}",
      },
      upload: {
        chooseImage: "Choose image",
        clear: "Clear",
        description:
          "Drag an image into the area below or click the button to choose one. It currently handles one image at a time and never uploads it.",
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
