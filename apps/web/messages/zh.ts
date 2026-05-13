export const zhMessages = {
  metadata: {
    defaultTitle: "常用在线工具",
    siteDescription:
      "Meathill Tools 提供可直接在浏览器中使用的在线小工具。当前已上线图片格式与尺寸转换，支持本地处理、无需上传。",
    siteTitle: "Meathill Tools",
  },
  header: {
    languageSwitcherLabel: "语言",
    localProcessing: "本地处理",
    nav: {
      home: "首页",
      imageConverter: "图片转换",
    },
    tagline: "在线常用工具集合",
  },
  footer: {
    description:
      "这是一个面向日常效率场景的在线工具站。当前首个工具为图片格式与尺寸转换，后续会持续补充更多无需安装、打开即用的小工具。",
    toolsTitle: "已上线工具",
  },
  toolCard: {
    firstBatch: "首批工具",
    footerHint: "适合快速处理单张图片",
    openTool: "打开工具",
  },
  home: {
    metadata: {
      description:
        "Meathill Tools 提供可以直接在浏览器中使用的在线工具。当前已上线图片格式与尺寸转换，强调本地处理、快速使用与可索引页面结构。",
      keywords: [
        "在线工具",
        "常用工具网站",
        "图片格式转换",
        "图片尺寸调整",
        "browser tools",
      ],
      title: "常用在线工具",
    },
    structuredData: {
      toolListName: "Meathill Tools 工具列表",
    },
    hero: {
      badges: {
        scalable: "持续扩展",
        seo: "SEO 友好",
        stack: "Next.js + Cloudflare",
      },
      description:
        "Meathill Tools 收集常用在线小工具。首个上线功能是图片格式与尺寸转换，强调快速、直接、本地处理，避免把一个简单需求做成又慢又重的 SaaS 流程。",
      primaryCta: "立即使用图片转换",
      secondaryCta: "查看已上线工具",
      title: "一个能被搜索引擎发现，也能真正马上拿来用的工具站。",
    },
    strategy: {
      description:
        "不是工具堆砌，而是优先做高频、可搜索、可直接解决问题的页面。",
      indexedPagesDescription:
        "每个工具页都提供完整说明、步骤与 FAQ，避免只有一个上传框的薄内容页面。",
      indexedPagesTitle: "可索引页面",
      lightweightExpansionDescription:
        "基于 Cloudflare Workers 部署，后续继续补充更多小工具和独立 SEO 入口。",
      lightweightExpansionTitle: "轻量扩展",
      localProcessingDescription:
        "首个工具完全在浏览器内处理图片，不上传文件，兼顾速度和隐私。",
      localProcessingTitle: "本地处理",
      title: "当前站点策略",
    },
    tools: {
      description:
        "每个工具都会有独立页面、独立标题和独立描述，方便用户通过搜索直接抵达具体问题的解决入口，而不是先进入一个空泛首页再层层点击。",
      title: "已上线工具",
    },
    info: {
      expansionMatrixDescription:
        "站点会逐步沉淀为多个清晰的工具入口，每个入口都能独立承接自然搜索流量。",
      expansionMatrixTitle: "逐步扩展站点矩阵",
      highFrequencyDescription:
        "首批工具优先覆盖高频操作，例如图片处理、文本处理、编码转换、开发辅助等场景。",
      highFrequencyTitle: "从高频需求开始",
      substantialPagesDescription:
        "工具页会明确说明支持格式、使用步骤、限制条件与隐私边界，方便搜索引擎理解页面主题。",
      substantialPagesTitle: "页面不是空壳",
    },
  },
  imageConverter: {
    metadata: {
      description:
        "在线完成 PNG、JPG、WebP 的格式转换与尺寸调整。所有处理都在浏览器本地完成，不上传图片，适合快速压缩、改尺寸和换格式。",
      keywords: [
        "图片格式转换",
        "图片尺寸修改",
        "image converter",
        "png 转 jpg",
        "webp 转 png",
        "在线改尺寸",
      ],
      title: "图片格式与尺寸转换",
    },
    hero: {
      badges: {
        category: "图片工具",
        localProcessing: "浏览器本地处理",
        singleImage: "单图转换",
      },
      description:
        "在线完成 PNG、JPG、WebP 的格式切换与尺寸缩放。图片在浏览器本地处理，不上传服务器，适合临时换格式、改尺寸和快速导出结果图。",
      title: "图片格式与尺寸转换",
    },
    scenarios: {
      description: "更适合快速处理常见网页图片，不做复杂编辑器。",
      privacy: "对隐私敏感，不想把图片上传到第三方服务。",
      ratio: "需要锁定比例，避免手动计算宽高。",
      title: "这版工具适合什么场景",
      transform: "想把 PNG 转 JPG / WebP，或者把大图缩成适合网页的尺寸。",
    },
    tool: {
      category: "图片工具",
      description:
        "在线完成 PNG、JPG、WebP 的格式转换与尺寸调整。所有处理都在浏览器本地完成，不上传图片，适合快速压缩、改尺寸和换格式。",
      faq: [
        {
          answer:
            "不会。首版工具完全在浏览器本地处理图片，文件不会发送到服务器。",
          question: "图片会上传到服务器吗？",
        },
        {
          answer: "首版支持 PNG、JPG/JPEG、WebP 三种常用格式的单图转换与缩放。",
          question: "当前支持哪些图片格式？",
        },
        {
          answer:
            "JPEG 不支持透明通道。若原图包含透明背景，导出为 JPEG 时会自动填充为白色背景。",
          question: "透明背景导出为 JPEG 会怎样？",
        },
      ],
      features: [
        "支持 PNG、JPG、WebP 三种常用格式互转",
        "支持自定义宽高，并可锁定原始比例",
        "支持 JPEG / WebP 质量调节",
        "结果图可直接预览与下载",
        "本地处理，不上传原图",
      ],
      keywords: [
        "图片格式转换",
        "图片尺寸修改",
        "image converter",
        "png 转 jpg",
        "webp 转 png",
        "在线改尺寸",
      ],
      name: "图片格式与尺寸转换",
      steps: [
        "上传一张 PNG、JPG 或 WebP 图片。",
        "选择目标格式，并按需填写宽高。",
        "如果需要，开启或关闭锁定比例，并调整压缩质量。",
        "点击生成结果，预览并下载转换后的图片。",
      ],
      summary: "在浏览器本地完成图片格式转换、尺寸缩放与质量调整。",
    },
    content: {
      faqDescription: "搜索用户最常关心的几个问题。",
      faqTitle: "常见问题",
      privacyDescription: "这几个边界要先说清楚，避免误解。",
      privacyItems: [
        "图片不会上传到服务器，所有转换都在你的浏览器里完成。",
        "JPEG 不支持透明背景，导出时会自动补成白底。",
        "首版暂不处理 HEIC、GIF 动图、SVG 导出、批量转换等复杂场景。",
      ],
      privacyTitle: "隐私与限制说明",
      stepsDescription:
        "为了让搜索用户也能快速判断这个页面是否适合自己，这里把使用方式写清楚。",
      stepsTitle: "使用步骤",
      supportDescription:
        "首版聚焦最常用的网页图片场景，因此当前只支持 PNG、JPG/JPEG、WebP 的输入与输出。",
      supportTitle: "当前支持范围",
    },
    client: {
      badges: {
        firstVersion: "首版功能",
        localProcessing: "浏览器本地处理",
        stale: "参数已变化",
        stalePreview: "需重新生成",
        supportedFormats: "支持 {formats}",
      },
      upload: {
        chooseImage: "选择图片",
        clear: "清空",
        description:
          "拖拽图片到下方区域，或点击按钮选择一张图片。首版只处理单张图片，不会上传到服务器。",
        emptyDescription:
          "支持 PNG、JPG/JPEG、WebP。你可以直接改尺寸，也可以切换输出格式并调节质量。",
        emptyTitle: "拖入图片开始转换",
        pendingResult: "调整参数后点击生成结果",
        reselect: "重新选择",
        resultLabel: "结果图",
        sourceLabel: "原图",
        title: "上传原图",
      },
      settings: {
        aspectLockDescription: "开启后修改一边尺寸，另一边会自动同步。",
        aspectLockTitle: "锁定原始比例",
        description:
          "先选目标格式，再决定是否改宽高。JPEG 与 WebP 可以额外设置压缩质量。",
        download: "下载图片",
        generate: "生成结果",
        height: "高度（px）",
        heightPlaceholder: "例如 800",
        quality: "输出质量",
        qualityAria: "输出质量",
        qualityDescription:
          "质量越高，文件通常越大。建议先从 82 左右开始尝试。",
        regenerate: "重新生成结果",
        targetFormat: "目标格式",
        title: "转换设置",
        width: "宽度（px）",
        widthPlaceholder: "例如 1200",
      },
      preview: {
        alt: "{label}预览",
        emptyDescription: "生成后会在这里显示结果图，你可以直接预览并下载。",
      },
      errors: {
        blobFailed: "浏览器没有生成结果图片，请稍后重试。",
        canvasUnsupported: "当前浏览器不支持 Canvas，暂时无法转换图片。",
        convertFailed: "转换失败，请稍后重试。",
        imageBroken: "图片读取失败，请确认文件没有损坏。",
        invalidDimensions: "宽度和高度必须是大于 0 的整数。",
        readFailed: "图片读取失败，请换一张图片再试。",
        unsupportedFormat: "暂不支持该格式，请上传 {formats} 图片。",
        unsupportedOutput: "当前浏览器暂不支持导出 {format}。",
        uploadFirst: "请先上传一张图片。",
      },
    },
    formats: {
      jpg: {
        description: "有损，适合照片；透明背景会转为白底",
        label: "JPG",
      },
      png: {
        description: "无损，适合截图、图标和透明背景",
        label: "PNG",
      },
      webp: {
        description: "压缩率更高，适合网页图片",
        label: "WebP",
      },
    },
  },
} as const;
