import type { LocaleContent } from "./types";

export const enMessages: LocaleContent = {
  metadata: {
    defaultTitle: "Online Tools",
    siteDescription:
      "Meathill Tools offers online tools that run directly in your browser. Local processing, no uploads, free to use.",
    siteTitle: "Meathill Tools",
  },
  header: {
    languageSwitcherLabel: "Language",
    localProcessing: "Local processing",
    nav: {
      home: "Home",
      imageConverter: "Image Converter",
      pdfTextEditor: "PDF Text Editor",
    },
    tagline: "Practical online tools",
    theme: {
      dark: "Dark",
      light: "Light",
      system: "System",
    },
  },
  footer: {
    description:
      "Online tools that run directly in your browser. No install, no sign-up.",
    toolsTitle: "Available tools",
  },
  toolCard: {
    firstBatch: "Popular",
    footerHint: "Best for quick single-image edits",
    openTool: "Open tool",
  },
  home: {
    featuredTools: {
      description: "Tools currently available. Click to start using.",
      title: "Featured tools",
    },
    metadata: {
      description:
        "Meathill Tools offers online tools you can use right away in the browser. Start with image format conversion, resizing, and PDF text editing.",
      keywords: [
        "online tools",
        "browser tools",
        "image converter",
        "resize image",
        "pdf text editor",
      ],
      title: "Online Tools",
    },
    structuredData: {
      toolListName: "Meathill Tools list",
    },
    hero: {
      badges: {
        scalable: "Local processing",
        seo: "No install",
        stack: "Free to use",
      },
      description:
        "Online tools that run directly in your browser. No software to install, no files to upload — just open and use.",
      secondaryCta: "Browse tools",
      title: "Online tools, open and use.",
    },
    strategy: {
      description: "Focused on solving everyday problems with minimal steps.",
      indexedPagesDescription:
        "Select a file, adjust settings, preview results — all on one page.",
      indexedPagesTitle: "Start immediately",
      lightweightExpansionDescription:
        "Preview the output before deciding to download.",
      lightweightExpansionTitle: "Preview then download",
      localProcessingDescription:
        "Files are processed entirely in the browser, which is faster and better for privacy.",
      localProcessingTitle: "Local processing",
      title: "Why use it",
    },
    tools: {
      description: "Tools currently available for direct use.",
      title: "Available tools",
    },
    info: {
      expansionMatrixDescription:
        "Each tool supports common formats for everyday needs.",
      expansionMatrixTitle: "Common formats",
      highFrequencyDescription:
        "Focused on solving frequent, small-scale problems without over-engineering.",
      highFrequencyTitle: "Small and focused",
      substantialPagesDescription:
        "No sign-up required. Open the page, process your file, and download the result.",
      substantialPagesTitle: "Zero barrier",
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
        cropAnchorAria: "{vertical} {horizontal}",
        cropAnchorDescription:
          "Choose which area of the image to keep; the overflow is cropped away.",
        cropAnchorTitle: "Crop position",
        cropHorizontal: {
          center: "Center",
          left: "Left",
          right: "Right",
        },
        cropVertical: {
          bottom: "Bottom",
          middle: "Middle",
          top: "Top",
        },
        description:
          "Choose the output format first, then decide whether to change width and height. JPEG and WebP also support quality control.",
        download: "Download image",
        generate: "Generate result",
        height: "Height (px)",
        heightPlaceholder: "e.g. 800",
        modeCrop: "Crop to fill",
        modeLock: "Lock ratio",
        modeStretch: "Free stretch",
        quality: "Output quality",
        qualityAria: "Output quality",
        qualityDescription:
          "Higher quality usually means a larger file. Starting around 82 is a practical default.",
        regenerate: "Regenerate result",
        resizeModeDescription:
          "Lock ratio keeps the image undistorted; free stretch changes width and height independently; crop to fill scales by the larger ratio and crops the excess.",
        resizeModeTitle: "Resize mode",
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
  pdfTextEditor: {
    metadata: {
      description:
        "Edit existing text in a PDF online. Everything runs locally in your browser, your file is never uploaded, and you can download the result immediately.",
      keywords: [
        "edit pdf online",
        "pdf text editor",
        "modify pdf text",
        "online pdf editor",
        "browser pdf editor",
        "no upload pdf editor",
      ],
      title: "Online PDF Text Editor",
    },
    hero: {
      badges: {
        beta: "Beta",
        category: "Document tool",
        localProcessing: "Browser-side processing",
      },
      description:
        "Upload a PDF, click existing text on the page to edit it, then download the result. Everything happens in your browser, so the file never leaves your device.",
      title: "Edit existing PDF text right in your browser",
    },
    scenarios: {
      description:
        "Best for quick fixes to existing PDF text such as names, dates and addresses.",
      edit: "You want to change a small amount of text without buying a desktop PDF editor.",
      fontReuse:
        "You want to keep the original PDF look and only minimally change fonts after editing.",
      privacy:
        "Your PDF contains sensitive information you do not want to upload to a third-party service.",
      title: "Good for tasks like these",
    },
    tool: {
      category: "Document tool",
      description:
        "Edit existing PDF text online. The whole process happens in your browser without uploading the file, and you can download the result right after editing.",
      faq: [
        {
          answer:
            "No. The PDF is parsed, edited and exported entirely in your browser. Nothing is sent to a server.",
          question: "Will my PDF be uploaded?",
        },
        {
          answer:
            "The editor reuses the embedded PDF font when possible. If your new characters are missing from the embedded font, it falls back to Noto Sans SC automatically, and you can also upload a font of your own.",
          question: "Will fonts break after editing?",
        },
        {
          answer:
            "Not yet. Scanned PDFs do not have an editable text layer, so the tool detects them and asks for a text-based PDF instead.",
          question: "Can I edit scanned (image-only) PDFs?",
        },
        {
          answer:
            "Not yet. V1 only supports replacing existing text. Adding new text boxes, editing images and splitting pages will come in later versions.",
          question: "Can I add new text boxes to the PDF?",
        },
      ],
      features: [
        "Detects existing text blocks with their position, size and font",
        "Click any text block to edit in place",
        "Reuses embedded fonts when possible and falls back to Noto Sans SC for CJK",
        "Supports uploading your own TTF/OTF font as a fallback",
        "Runs entirely in the browser without uploading the file",
      ],
      keywords: [
        "edit pdf online",
        "pdf text editor",
        "modify pdf text",
        "online pdf editor",
        "browser pdf editor",
        "no upload pdf editor",
      ],
      name: "Online PDF Text Editor",
      steps: [
        "Upload a PDF that has a real text layer.",
        "Click any text in the preview to enter edit mode.",
        "If CJK characters are detected, wait for the Noto Sans SC fallback font to load.",
        "Review changes and download the edited PDF.",
      ],
      summary:
        "Replace text inside a PDF in the browser while keeping the original font look as much as possible.",
    },
    content: {
      faqDescription: "A few common questions before you start.",
      faqTitle: "FAQ",
      limitsDescription: "V1 intentionally leaves the following out of scope.",
      limitsItems: [
        "Scanned (image-only) PDFs without a text layer are detected and skipped.",
        "Adding new text boxes, editing images, reordering or deleting pages will arrive in later versions.",
        "Password-protected PDFs cannot be unlocked yet.",
        "Color text is exported in black for now. A manual color picker is planned.",
      ],
      limitsTitle: "Known limitations",
      stepsDescription: "Follow these steps to edit your PDF.",
      stepsTitle: "How to use it",
      supportDescription:
        "The tool detects editable text layers and lets you edit them in place.",
      supportTitle: "What the tool can do",
    },
    client: {
      badges: {
        beta: "Beta",
        localProcessing: "Browser-side processing",
        scannedDetected: "Scanned PDF detected",
        supportedFormats: "PDF",
      },
      upload: {
        choosePdf: "Choose PDF",
        clear: "Clear",
        description:
          "Drag a PDF into the area below or click the button to choose one. The file never leaves your browser.",
        emptyDescription:
          "Supports PDFs with a real text layer. Try a small file first.",
        emptyTitle: "Drop a PDF to begin editing",
        maxSizeHint: "Maximum file size is {size}.",
        pageCountLabel: "{count} pages",
        reselect: "Choose another",
        title: "Upload PDF",
      },
      scanned: {
        description:
          "This PDF does not have an editable text layer (likely a scan or image). Please OCR it first or pick a native text PDF.",
        title: "Scanned PDFs are not supported yet",
      },
      viewer: {
        nextPage: "Next page",
        pageOf: "Page {current} / {total}",
        prevPage: "Previous page",
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
      },
      editor: {
        activeBlockTitle: "Active text block",
        clickToEditHint:
          "Click text on the page to edit it. Press Esc or Enter to exit edit mode.",
        description: "Edited blocks have a yellow background.",
        editedCount: "{count} edited blocks",
        escToExit: "Press Esc or click elsewhere to leave edit mode.",
        overflowWarning:
          "Text exceeds the original area. Font size will shrink automatically on export.",
        resetBlock: "Discard this edit",
        title: "Edit text",
      },
      fonts: {
        acceptedFontTypes: "TTF or OTF font files supported.",
        cjkFailed:
          "Failed to load Noto Sans SC. Check your network or upload a font.",
        cjkIdle: "No CJK fallback font loaded yet",
        cjkLoading: "Loading Noto Sans SC",
        cjkReady: "Noto Sans SC is ready",
        description:
          "Prefer the embedded PDF font; auto-load Noto Sans SC for CJK; fall back to your uploaded font when characters are missing.",
        removeUserFont: "Remove",
        title: "Font strategy",
        uploadFontButton: "Upload font",
        userFontLoaded: "Font loaded: {name}",
      },
      export: {
        button: "Download PDF",
        buttonEdited: "Download edited PDF",
        cleanHint: "No edits yet. The download will return the original file.",
        description:
          "Click the button to download the edited PDF when everything looks right.",
        editedHint: "Will export the PDF with {count} edits applied.",
        exporting: "Exporting",
        missingGlyphChars: "Missing characters: {chars}",
        title: "Download",
      },
      errors: {
        cjkFontLoadFailed:
          "Failed to download Noto Sans SC. Please check your network or upload a font.",
        encryptedNotSupported: "Password-protected PDFs are not supported yet.",
        exportFailed: "Export failed. Please try again later.",
        fileTooLarge: "File is too large. Maximum is {size}.",
        fontEmbedFailed:
          "Failed to embed the font. The fallback font was used instead.",
        fontMissingGlyph:
          "Some edits contained characters the original font does not support. The fallback font was used or the change was skipped.",
        loadFailed:
          "Failed to parse the PDF. Please confirm the file is intact.",
        loadFailedDetail: "Failed to parse the PDF: {detail}",
        scannedNotSupported: "Scanned PDFs are not supported yet.",
        unsupportedFont:
          "The font file is invalid. Only TTF or OTF is supported.",
        unsupportedFormat:
          "This file type is not supported. Please upload a PDF.",
        workerFailed:
          "The PDF worker failed to start. Please refresh the page and try again.",
      },
    },
  },
};
