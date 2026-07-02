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
  home: {
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
        singleImage: "Batch conversion",
      },
      description:
        "Convert iPhone HEIC photos to JPG, PNG or WebP, switch between PNG, JPG and WebP, and resize images directly in the browser without uploading files to a server.",
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
        "Convert iPhone HEIC/HEIF photos to JPG, PNG or WebP, switch between PNG, JPG and WebP, and resize images online. Everything runs in your browser without uploads, which works well for quick compression, resizing and format changes.",
      faq: [
        {
          answer:
            "No. Image processing happens entirely in your browser and files are never sent to the server.",
          question: "Will my image be uploaded?",
        },
        {
          answer:
            "It converts HEIC/HEIF (iPhone photos) to JPG, PNG and WebP, plus single-image conversion and resizing between PNG, JPG/JPEG and WebP.",
          question: "Which image formats are supported?",
        },
        {
          answer:
            "Yes. Just upload the .heic/.heif file — your browser decodes it locally and converts it to JPG, PNG or WebP, with no upload.",
          question: "Can I convert iPhone HEIC photos?",
        },
        {
          answer:
            "JPEG does not support transparency. If the source image has transparent pixels, the exported JPEG will use a white background.",
          question: "What happens to transparent backgrounds in JPEG?",
        },
      ],
      features: [
        "Convert iPhone HEIC/HEIF photos to JPG, PNG or WebP",
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
        "heic to jpg",
        "heic to png",
        "convert heic",
        "iphone photo converter",
      ],
      name: "Image Format & Size Converter — HEIC Supported",
      steps: [
        "Upload a PNG, JPG, WebP or HEIC image.",
        "Choose the output format and enter target dimensions if needed.",
        "Optionally lock aspect ratio and adjust compression quality.",
        "Generate the result, preview it and download the converted image.",
      ],
      summary:
        "Convert HEIC and other photos to JPG/PNG/WebP, resize dimensions and tune quality entirely in the browser.",
    },
    content: {
      faqDescription: "A few common questions before you start.",
      faqTitle: "FAQ",
      privacyDescription:
        "A few limitations and notes worth knowing before you use the tool.",
      privacyItems: [
        "Images are never uploaded. All conversion happens in your browser.",
        "JPEG does not support transparency, so transparent areas will be filled with white.",
        "Animated GIF and SVG export are not supported yet.",
      ],
      privacyTitle: "Notes and limitations",
      stepsDescription: "Follow these steps to convert your image.",
      stepsTitle: "How to use it",
      supportDescription:
        "PNG, JPG/JPEG, WebP and HEIC/HEIF can be imported; PNG, JPG/JPEG and WebP are available for export (HEIC is input only).",
      supportTitle: "Supported formats",
    },
    client: {
      badges: {
        localProcessing: "Browser-side processing",
        stale: "Settings changed",
        staleCount: "{count} need regeneration",
        stalePreview: "Regenerate needed",
        supportedFormats: "Supports {formats}",
      },
      batch: {
        downloadAria: "Download {name}",
        overCapRejected:
          "You can process up to {max} images at once; {rejected} were skipped.",
        partiallyRejected:
          "Added {accepted} images; {rejected} were skipped (unsupported format).",
        progressLabel: "Converting {done} of {total}",
        removeAria: "Remove {name}",
        statusConverting: "Converting",
        statusDone: "Done",
        statusError: "Failed",
        statusPending: "Pending",
        zipEmpty: "No converted images yet to download as a ZIP.",
      },
      upload: {
        addMore: "Add more",
        chooseImage: "Choose image",
        clear: "Clear",
        clearAll: "Clear all",
        decoding: "Decoding HEIC photo…",
        description:
          "Drag images into the area below, or click the button to choose one or more files. Everything runs locally and is never uploaded.",
        emptyDescription:
          "Supports PNG, JPG/JPEG, WebP and HEIC (iPhone photos). You can resize the image, switch output format and adjust quality.",
        emptyTitle: "Drop an image to begin",
        pendingResult: "Adjust settings and generate a result",
        reselect: "Choose another",
        resultLabel: "Result",
        selectedCount: "{count} images selected",
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
        downloadAll: "Download all as ZIP",
        generate: "Generate result",
        generateAll: "Generate all",
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
    conversions: {
      description:
        "Convert {from} to {to} online — free, private and right in your browser. No upload, no signup; your files never leave your device.",
      keywords: [
        "{from} to {to}",
        "convert {from} to {to}",
        "{from} to {to} converter",
        "{from} to {to} online",
      ],
      relatedTitle: "Popular conversions",
      title: "{from} to {to} Converter",
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
  ogImageValidator: {
    metadata: {
      description:
        "Enter a URL to fetch and validate its Open Graph and Twitter Card tags, preview the share cards on Facebook, X, LinkedIn, Discord and Slack, and check the og:image dimensions, ratio and file size. You can also upload an image to validate directly.",
      keywords: [
        "og image validator",
        "open graph debugger",
        "twitter card validator",
        "social share preview",
        "og:image size",
        "opengraph validator",
        "og image checker",
      ],
      title: "OG Image Validator / Social Share Preview Debugger",
    },
    hero: {
      badges: {
        category: "SEO tool",
        platforms: "5-platform preview",
        realtime: "Live tag check",
      },
      description:
        "Enter a URL to fetch and parse its Open Graph / Twitter Card tags, preview how it looks when shared on Facebook, X, LinkedIn, Discord and Slack, and validate the og:image dimensions, ratio, file size and format. You can also upload a single image to validate on its own.",
      title: "OG Image & Social Share Preview Validator",
    },
    scenarios: {
      description:
        "Best for checking share appearance before publishing, not for bulk monitoring.",
      debug:
        "Your shared link shows no image or title on social platforms and you want to debug the OG tags.",
      optimize:
        "You want to confirm the og:image dimensions, ratio and size meet each platform's requirements to improve click-through.",
      preview:
        "Before publishing an article or landing page, you want to see how it will look when shared on each platform.",
      title: "Good for these cases",
    },
    tool: {
      category: "SEO tool",
      description:
        "Fetch the Open Graph and Twitter Card tags of any URL online, preview the share cards for Facebook, X, LinkedIn, Discord and Slack, and validate the og:image dimensions, ratio, file size and format. You can also upload an image for offline validation.",
      faq: [
        {
          answer:
            "URL mode fetches the target page on the server to parse its tags (browsers can't fetch cross-origin pages); it only reads public page content and stores nothing. Upload mode runs entirely in your browser and never uploads the image.",
          question: "How is my data handled when validating a URL?",
        },
        {
          answer:
            "Some sites return stripped-down content to non-browser requests, or inject OG tags via JavaScript; such pages may not expose complete tags, which is expected.",
          question: "Why can't some sites be parsed?",
        },
        {
          answer:
            "1200×630 pixels with roughly a 1.91:1 ratio is the common recommendation. Below 600×315 some platforms show a small card, and below 200×200 the image is generally not picked up.",
          question: "What's the recommended og:image size?",
        },
        {
          answer:
            "Roughly 8MB for Facebook / Discord and 5MB for X / LinkedIn / Slack. Always defer to each platform's official docs; this tool flags issues against those thresholds.",
          question: "What are the image file-size limits per platform?",
        },
      ],
      features: [
        "Fetch the Open Graph and Twitter Card tags of any URL",
        "Preview share cards for Facebook, X, LinkedIn, Discord and Slack",
        "Validate og:image dimensions, ratio (1.91:1), file size and format",
        "Per-platform pass / warning / fail diagnostics",
        "Upload an image to validate dimensions and ratio offline",
        "Resolve twitter:image→og:image and og:title→title fallbacks",
      ],
      keywords: [
        "og image validator",
        "open graph debugger",
        "twitter card validator",
        "social share preview",
        "og:image size",
        "share card preview",
        "opengraph validator",
        "og image checker",
      ],
      name: "OG Image Validator — Social Share Preview Debugger",
      steps: [
        'Switch to "From URL" and paste the page URL you want to check.',
        "Click Check and wait while we fetch and parse the page's OG / Twitter tags.",
        "Review the per-platform share-card previews and the dimension, ratio, size and tag report.",
        'Or switch to "Upload image" to validate a single image against each platform\'s spec.',
      ],
      summary:
        "Fetch a URL's Open Graph / Twitter tags, preview multi-platform share cards and validate the image.",
    },
    content: {
      faqDescription: "A few common questions before you start.",
      faqTitle: "FAQ",
      privacyDescription: "A few notes before you use it.",
      privacyItems: [
        "URL mode needs the server to fetch the target page for you (to bypass browser cross-origin limits); it reads public content only and stores nothing.",
        "Private, loopback and internal-network addresses are blocked by the safety policy and can't be fetched.",
        "Upload mode validates entirely in your browser; the image never leaves your device.",
      ],
      privacyTitle: "Notes",
      stepsDescription: "Follow the steps below to run a check.",
      stepsTitle: "How to use",
      supportDescription:
        "Validates Open Graph, Twitter Card and basic SEO tags, covering the share cards of Facebook, X, LinkedIn, Discord and Slack.",
      supportTitle: "What it checks",
    },
    client: {
      modes: {
        upload: "Upload image",
        url: "From URL",
      },
      url: {
        emptyDescription:
          "Paste a publicly accessible page URL and we'll fetch its OG / Twitter tags and preview the share cards for each platform.",
        emptyTitle: "Enter a URL to start",
        fetching: "Fetching and parsing the page…",
        hint: "Enter the full URL (including https://) whose share appearance you want to check.",
        label: "Page URL",
        placeholder: "https://example.com/article",
        resubmit: "Re-check",
        submit: "Check",
      },
      upload: {
        choose: "Choose image",
        clear: "Clear",
        decoding: "Reading image…",
        description:
          "Drag an image onto the area below, or click to choose. It only validates dimensions, ratio, size and format locally — nothing is uploaded.",
        dropHint: "Release to load the image",
        emptyDescription:
          "Supports PNG, JPG, WebP and GIF. Validates dimensions, ratio and size against each platform's OG spec.",
        emptyTitle: "Drop an image to validate",
        reselect: "Reselect",
        title: "Upload image",
      },
      result: {
        dimensionsUnknown: "Dimensions unknown",
        generalTitle: "Overall checks",
        noImage: "No og:image found",
        overallFail: "Issues found",
        overallPass: "All good",
        overallWarn: "Room for improvement",
        platformsTitle: "Per-platform diagnostics",
        previewTitle: "Share card previews",
        sizeUnknown: "Size unknown",
        sourceLabel: "Image source",
        tagsTitle: "Parsed tags",
      },
      status: {
        fail: "Fail",
        pass: "Pass",
        warn: "Warn",
      },
      platforms: {
        discord: "Discord",
        facebook: "Facebook",
        linkedin: "LinkedIn",
        slack: "Slack",
        twitter: "X (Twitter)",
      },
      checks: {
        "image-dimensions": "Image dimensions",
        "image-ratio": "Aspect ratio",
        "platform-filesize": "File size",
        "platform-format": "Image format",
        "platform-min-size": "Minimum size",
        "platform-required-tags": "Required tags",
        "tag-description": "Description (description)",
        "tag-image-alt": "Image alt text (og:image:alt)",
        "tag-og-image": "Image (og:image)",
        "tag-og-url": "Canonical URL (og:url)",
        "tag-title": "Title (og:title / title)",
        "tag-twitter-card": "Card type (twitter:card)",
      },
      details: {
        "image-dimensions":
          "{width}×{height} px (recommended {idealWidth}×{idealHeight})",
        "image-ratio": "{ratio} : 1 (recommended {idealRatio} : 1)",
        missing: "Missing",
        "platform-filesize": "{size} / limit {max}",
        "platform-format": "{format}",
        "platform-min-size":
          "{width}×{height} px (minimum {minWidth}×{minHeight})",
        present: "Set",
        requiredTagsMissing: "Missing {missing}",
        unknown: "Couldn't read",
      },
      errors: {
        BLOCKED_HOST:
          "This address is blocked by the safety policy (private / local / internal addresses can't be fetched).",
        FETCH_FAILED:
          "Couldn't connect to the target site. Check that the URL is reachable.",
        FETCH_TIMEOUT:
          "The fetch timed out — the target site responded too slowly. Try again later.",
        INVALID_URL: "Invalid URL. Please enter a full http(s) URL.",
        NOT_HTML: "This URL didn't return a web page, so tags can't be parsed.",
        TOO_MANY_REDIRECTS: "Too many redirects — couldn't fetch this URL.",
        UPSTREAM_ERROR:
          "The target site returned an error — the page may not exist or is temporarily unavailable.",
        UNKNOWN: "Validation failed. Please try again later.",
      },
    },
  },
  jsonViewer: {
    metadata: {
      description:
        "Paste JSON online and format it into a collapsible tree with type-based colors. Search and filter, and expand nested JSON strings. Everything runs locally in your browser — great for inspecting HTTP requests and responses.",
      keywords: [
        "JSON formatter",
        "JSON viewer",
        "json viewer",
        "json formatter",
        "json tree",
        "online json tool",
      ],
      title: "JSON Formatter & Tree Viewer",
    },
    hero: {
      badges: {
        category: "Developer tools",
        localProcessing: "Runs in your browser",
        nested: "Nested JSON support",
      },
      description:
        "Paste JSON and instantly format it into an expandable, collapsible tree. Type-based colors, search and filter, and parsing of nested JSON strings — built for inspecting HTTP requests and responses, with data never leaving your browser.",
      title: "JSON Formatter & Tree Viewer",
    },
    scenarios: {
      description:
        "Best for quickly viewing and debugging JSON, not for large-scale data editing.",
      local:
        "You care about privacy and don't want to paste API data into a third-party site.",
      nested:
        "An escaped JSON string is nested inside an HTTP body and you want to expand it.",
      search:
        "You work with a large response and want to search for a field or value and jump to it.",
      title: "Great when you need to",
    },
    tool: {
      category: "Developer tools",
      description:
        "Paste JSON online and format it into a collapsible tree with type-based colors. Search and filter, and expand nested JSON strings. Everything runs locally in your browser — great for inspecting HTTP requests and responses.",
      faq: [
        {
          answer:
            "No. Parsing, formatting and search all happen locally in your browser; your data is never sent to a server.",
          question: "Is my JSON uploaded to a server?",
        },
        {
          answer:
            "It shows why parsing failed and pinpoints the exact line and column so you can fix it quickly.",
          question: "What happens if my JSON is invalid?",
        },
        {
          answer:
            "HTTP responses often store a chunk of JSON as a string inside a field. When such a string is detected, you can click a button to expand it into a subtree.",
          question: "What does “parse nested JSON strings” mean?",
        },
      ],
      features: [
        "Format on paste and render an expandable, collapsible tree",
        "Color values by type: string / number / boolean / null",
        "Search keys and values, highlight matches and auto-expand, with a matches-only mode",
        "Expand or collapse all nodes at once, and copy the formatted JSON",
        "Detect and expand JSON strings nested inside fields",
      ],
      keywords: [
        "JSON formatter",
        "JSON viewer",
        "json viewer",
        "json formatter",
        "json tree",
        "online json tool",
      ],
      name: "JSON Formatter & Tree Viewer",
      steps: [
        "Paste or type JSON into the box on the left.",
        "The right side instantly formats it into a collapsible, color-coded tree.",
        "Use the search box to locate a field or value, and turn on “Matches only” if needed.",
        "For nested JSON strings, click the button on the node to expand them; copy the formatted result when you need it.",
      ],
      summary:
        "Format JSON into a collapsible tree locally in your browser, with search and nested-JSON expansion.",
    },
    content: {
      faqDescription: "A few common questions before you start.",
      faqTitle: "FAQ",
      privacyDescription: "Good to know before you use it.",
      privacyItems: [
        "Nothing is uploaded — parsing and search run entirely in your browser.",
        "Standard JSON is supported; comments, trailing commas and other non-standard syntax will fail to parse.",
        "Expanding a very large JSON fully can be slow — collapse it first or use search to navigate.",
      ],
      privacyTitle: "Notes",
      stepsDescription: "Follow these steps to view your JSON.",
      stepsTitle: "How to use",
      supportDescription:
        "Practical features built around inspecting HTTP requests and responses.",
      supportTitle: "Key features",
    },
    client: {
      empty: {
        description:
          "Paste JSON on the left and the formatted, collapsible tree will appear here.",
        title: "Paste JSON to get started",
      },
      error: {
        location: "Line {line}, column {column}",
        title: "Couldn't parse JSON",
      },
      input: {
        clear: "Clear",
        placeholder:
          "Paste JSON here, e.g. the body of an HTTP request or response…",
        title: "JSON input",
      },
      status: {
        characters: "{count} characters",
        invalid: "Invalid JSON",
        valid: "Valid JSON",
      },
      toolbar: {
        collapseAll: "Collapse all",
        copied: "Copied",
        copy: "Copy",
        expandAll: "Expand all",
        onlyMatches: "Matches only",
        searchPlaceholder: "Search keys or values…",
      },
      tree: {
        parseNested: "Parse as JSON",
      },
    },
  },
  markdownToPdf: {
    metadata: {
      description:
        "Convert AI-generated Markdown into a formatted PDF, readable on both mobile and desktop. Supports headings, lists, tables, and code blocks. All processing happens locally in your browser.",
      keywords: [
        "markdown to pdf",
        "convert markdown pdf",
        "AI output to PDF",
        "markdown formatter",
        "mobile friendly PDF",
      ],
      title: "Markdown to PDF",
    },
    hero: {
      badges: {
        category: "Document Tools",
        localProcessing: "Browser-local Processing",
        mobileFriendly: "Mobile Friendly",
      },
      description:
        "Paste your AI Markdown output, see a live formatted preview, and export to PDF via browser print. The default phone-friendly width lets friends read on mobile without zooming.",
      title: "Markdown to PDF",
    },
    scenarios: {
      description:
        "Great for turning AI text into shareable formatted documents. Not for complex layouts.",
      ai: "Got a Markdown reply from AI and want to send a formatted document to friends unfamiliar with Markdown.",
      share:
        "Friends can't render Markdown on their phones and need a PDF with visible formatting.",
      privacy:
        "Content is sensitive and you don't want to upload it to a third-party server.",
      title: "Good For",
    },
    tool: {
      category: "Document Tools",
      description:
        "Free online Markdown to PDF converter. Turn ChatGPT, Claude, or any AI Markdown output into a formatted PDF friends can read on any phone without zooming. Supports headings, lists, tables, and code blocks. All processing is local — nothing uploaded.",
      faq: [
        {
          answer:
            "No. Markdown is rendered to HTML locally in your browser and never sent to a server.",
          question: "Will my content be uploaded to a server?",
        },
        {
          answer:
            "Click 'Download PDF' to open a new tab. The browser print dialog appears automatically — choose 'Save as PDF' to export.",
          question: "How do I export to PDF?",
        },
        {
          answer:
            "The default 'Phone Friendly' width is ~105mm, close to a phone's portrait width, so the PDF fills the screen without zooming. You can switch to A5 or A4.",
          question: "Why set a page width?",
        },
        {
          answer:
            "A popup-blocked message will appear. Click the popup icon in your browser's address bar to allow popups from this site, then try again.",
          question:
            "Nothing happens when I click 'Download PDF'. What do I do?",
        },
        {
          answer:
            "Yes. Paste text from ChatGPT, Claude, Gemini, or any AI tool directly — the converter handles standard GFM Markdown, which nearly all AI assistants produce.",
          question: "Can I use output from ChatGPT, Claude, or other AI tools?",
        },
      ],
      features: [
        "Supports headings (H1–H6), paragraphs, bold, italic, and links",
        "Supports ordered lists, unordered lists, and task lists",
        "Supports GFM tables",
        "Supports fenced code blocks (```) with automatic line wrapping",
        "Supports blockquotes",
        "Three page widths: Phone Friendly / A5 / A4",
        "Browser-local processing — content never leaves your device",
        "Designed for ChatGPT, Claude, and other AI output — paste and convert instantly",
      ],
      keywords: [
        "markdown to pdf",
        "convert markdown to pdf",
        "chatgpt to pdf",
        "claude to pdf",
        "AI output to PDF",
        "chatgpt output pdf",
        "markdown pdf online free",
        "markdown to pdf no upload",
        "mobile friendly PDF",
        "online document tool",
      ],
      name: "Markdown to PDF",
      steps: [
        "Paste your Markdown into the left panel — a live preview appears on the right.",
        "Choose a page width: 'Phone Friendly' for mobile sharing, 'A5' for general use.",
        "Click 'Download PDF', then choose 'Save as PDF' in the browser print dialog.",
      ],
      summary:
        "Render Markdown in the browser and export it as a mobile-friendly PDF via browser print.",
    },
    content: {
      faqDescription: "Common questions before you start.",
      faqTitle: "FAQ",
      privacyDescription: "Read these notes before using the tool.",
      privacyItems: [
        "Markdown is rendered locally in your browser and never uploaded to a server.",
        "Click 'Download PDF' to open a new tab, then choose 'Save as PDF' in the print dialog.",
        "If popups are blocked, allow this site to open popups in your browser's address bar, then retry.",
        "The default 'Phone Friendly' width produces a PDF that fills a mobile screen without zooming.",
      ],
      privacyTitle: "Notes",
      stepsDescription: "Follow these steps to export your PDF.",
      stepsTitle: "How to Use",
      supportDescription: "Based on GFM (GitHub Flavored Markdown).",
      supportTitle: "Supported Formats",
    },
    client: {
      empty: {
        description:
          "Enter Markdown on the left to see a live formatted preview here.",
        title: "Paste Markdown to Preview",
      },
      input: {
        clear: "Clear",
        placeholder:
          "Paste AI-generated Markdown here, or write your own…\n\n# Heading\n\n**Bold** and *italic*\n\n- List item 1\n- List item 2\n\n```\ncode block\n```",
        title: "Markdown Input",
      },
      preview: {
        title: "Preview",
      },
      toolbar: {
        estimatedPages: "~{count} page(s)",
        pageWidth: "Page Width",
        pageWidthOptions: {
          a4: "Standard (A4 210mm)",
          a5: "Universal (A5 148mm)",
          phone: "Phone Friendly (105mm)",
        },
        popupBlockedWarning:
          "Popup blocked. Click the popup icon in your browser's address bar to allow popups from this site, then try again.",
        print: "Download PDF",
        wordCount: "{count} characters",
      },
    },
  },
  sitemapValidator: {
    hero: {
      badges: {
        category: "SEO tool",
        instant: "Results in one fetch",
        protocol: "Protocol compliance check",
      },
      description:
        "Enter a sitemap.xml URL and we'll fetch it and validate it against the sitemaps.org protocol: whether the root element is valid, whether every URL has a valid <loc>, and whether lastmod, priority and changefreq are formatted correctly — plus whether the entry count or file size exceed the protocol limits.",
      title: "Sitemap Validator",
    },
    scenarios: {
      description:
        "Great for a quick sitemap compliance check, not for checking whether every listed link is reachable.",
      audit:
        "Periodically health-check a live sitemap after redesigns or migrations.",
      launch:
        "Before launching a new site or redesign, confirm sitemap.xml itself is well-formed.",
      seo: "Before submitting a sitemap to search engines, catch entries that would get rejected or ignored.",
      title: "Good for these situations",
    },
    tool: {
      category: "SEO tool",
      description:
        "Fetch a sitemap.xml online and validate its structure against the sitemaps.org protocol: root element type, whether every URL's <loc> is valid, whether lastmod/priority/changefreq follow the spec, plus duplicate URLs, entry count and file size limits. Sitemap index files are supported.",
      faq: [
        {
          answer:
            "The server fetches that URL's content on your behalf to parse it (browsers can't read cross-origin), reads it once, and doesn't store it. Private, loopback and internal addresses are blocked by the safety policy and can't be fetched.",
          question: "What happens to my sitemap content during validation?",
        },
        {
          answer:
            "We list two things: the validation result for the index file itself, and whether each child sitemap's <loc> is valid. To avoid unbounded fan-out fetches, we don't recursively validate the entries inside child sitemaps yet.",
          question: "How are sitemap index files (sitemapindex) validated?",
        },
        {
          answer:
            "This tool only checks structure and spec compliance — it doesn't visit the pages listed in the sitemap, so it won't catch broken links.",
          question: "Does it check whether the listed links actually work?",
        },
        {
          answer:
            "Per the sitemaps.org protocol, a single sitemap can list at most 50,000 URLs and must not exceed 50MB uncompressed; going over either limit is flagged as a failure.",
          question: "Are there limits on entry count or file size?",
        },
      ],
      features: [
        "Fetch any sitemap.xml URL and parse its structure",
        "Detect a regular sitemap (urlset) vs. a sitemap index (sitemapindex)",
        "Validate that every <loc> is a valid absolute URL",
        "Validate lastmod, priority and changefreq against the protocol format",
        "Detect duplicate URLs and flag entry count / file size limit overruns",
        "Problem entries are shown as a capped sample so huge sitemaps won't stall the page",
      ],
      keywords: [
        "sitemap validator",
        "sitemap.xml checker",
        "sitemap compliance",
        "sitemap index",
        "sitemapindex",
        "seo sitemap tool",
        "validate sitemap",
        "sitemap check before submit",
      ],
      name: "Sitemap Validator",
      steps: [
        "Paste the full sitemap.xml URL you want to check.",
        "Click Validate and wait for the server to fetch and parse the file.",
        "Review the general checks: root element type, entry count, size, duplicate URLs and more.",
        "For any problem entries, see whether it's a missing <loc> or an invalid field format.",
      ],
      summary:
        "Fetch sitemap.xml and validate its structure, entry fields and size limits against the protocol.",
    },
    content: {
      faqDescription: "A few common questions before you start.",
      faqTitle: "FAQ",
      privacyDescription:
        "A few limitations and notes worth knowing before you use the tool.",
      privacyItems: [
        "Validation requires the server to fetch the target sitemap on your behalf (to bypass browser cross-origin limits); it's read once and never stored.",
        "Private, loopback and internal addresses are blocked by the safety policy and can't be fetched.",
        "This only checks structure and spec compliance — it doesn't visit the pages in the sitemap, so it won't catch broken links.",
      ],
      privacyTitle: "Notes",
      stepsDescription: "Follow these steps to validate a sitemap.",
      stepsTitle: "How it works",
      supportDescription:
        "Covers the core sitemaps.org protocol rules: root structure, URL field formats, entry count and size limits.",
      supportTitle: "What gets checked",
    },
    client: {
      url: {
        emptyDescription:
          "Paste a publicly accessible sitemap.xml URL and we'll fetch it and validate its structure against the protocol.",
        emptyTitle: "Enter a URL to start validating",
        hint: "Enter the full sitemap.xml URL (including https://).",
        label: "Sitemap URL",
        placeholder: "https://example.com/sitemap.xml",
        resubmit: "Re-validate",
        submit: "Validate",
      },
      result: {
        entryCount: "{count} URL(s) found",
        generalTitle: "General checks",
        issuesTitle: "Entry issues",
        noIssues: "No entry-level issues found.",
        overallFail: "Issues found",
        overallPass: "All checks passed",
        overallWarn: "Some improvements suggested",
        rootTypeSitemapindex: "Sitemap index (sitemapindex)",
        rootTypeUnknown: "Unrecognized root element",
        rootTypeUrlset: "Regular sitemap (urlset)",
        showingSample: "Showing the first {shown} of {total} problem entries",
      },
      status: {
        fail: "Fail",
        pass: "Pass",
        warn: "Suggestion",
      },
      checks: {
        "byte-size-limit": "File size limit (50MB)",
        "changefreq-invalid": "<changefreq> value is invalid",
        "content-truncated": "Content was truncated",
        "duplicate-locs": "Duplicate URLs",
        "entry-count-limit": "Entry count limit (50,000)",
        "entry-count-zero": "Has at least one valid entry",
        "gzip-unsupported": "Gzip-compressed sitemap",
        "lastmod-invalid": "<lastmod> format is invalid",
        "loc-invalid": "<loc> is not a valid URL",
        "loc-missing": "Missing <loc>",
        "priority-invalid": "<priority> is outside 0.0–1.0",
        "root-element": "Root element is valid",
      },
      details: {
        "byte-size-limit": "{bytes} / limit {maxBytes}",
        "changefreq-invalid": "Value is {changefreq}",
        "content-truncated": "Read {bytes}; content may be incomplete",
        "duplicate-locs": "Found {count} duplicate(s)",
        "entry-count-limit": "{count} entries / limit {maxEntries}",
        "lastmod-invalid": "Value is {lastmod}",
        "loc-invalid": "Value is {loc}",
        "priority-invalid": "Value is {priority}",
      },
      errors: {
        BLOCKED_HOST:
          "That address is blocked by the safety policy (private/local/internal addresses can't be fetched).",
        FETCH_FAILED:
          "Couldn't connect to the target site — check that the URL is reachable.",
        FETCH_TIMEOUT:
          "The fetch timed out because the target site responded too slowly. Try again later.",
        INVALID_URL: "Invalid URL. Please enter a full http(s) URL.",
        TOO_MANY_REDIRECTS: "Too many redirects — couldn't fetch that URL.",
        UNKNOWN: "Validation failed. Please try again later.",
        UPSTREAM_ERROR:
          "The target site returned an error — the file may not exist or may be temporarily unavailable.",
      },
    },
  },
};
