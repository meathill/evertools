import type { LocaleContent } from "./types";

export const jaMessages: LocaleContent = {
  metadata: {
    defaultTitle: "オンラインツール",
    siteDescription:
      "Meathill Tools はブラウザでそのまま使えるオンラインツールを提供します。現在は画像形式とサイズの変換ツールを公開しており、ローカル処理でアップロード不要です。",
    siteTitle: "Meathill Tools",
  },
  header: {
    languageSwitcherLabel: "言語",
    localProcessing: "ローカル処理",
    nav: {
      home: "ホーム",
      imageConverter: "画像変換",
    },
    tagline: "日常向けオンラインツール",
  },
  footer: {
    description:
      "ブラウザですぐ使えるオンラインツールです。現在は画像形式とサイズの変換を利用できます。",
    toolsTitle: "公開中のツール",
  },
  toolCard: {
    firstBatch: "おすすめ",
    footerHint: "単一画像の素早い処理向け",
    openTool: "ツールを開く",
  },
  home: {
    metadata: {
      description:
        "Meathill Tools はブラウザでそのまま使えるオンラインツールを提供します。現在は画像形式とサイズ変換を中心に、ローカル処理、高速利用、検索に強いページ構成を重視しています。",
      keywords: [
        "オンラインツール",
        "ブラウザツール",
        "画像変換",
        "画像リサイズ",
        "png jpg 変換",
      ],
      title: "オンラインツール",
    },
    structuredData: {
      toolListName: "Meathill Tools 一覧",
    },
    hero: {
      badges: {
        scalable: "ローカル処理",
        seo: "アップロード不要",
        stack: "すぐ書き出し",
      },
      description:
        "画像をアップロードせずに、形式変換、リサイズ、書き出しまでをブラウザ内で完結できます。",
      primaryCta: "画像変換を使う",
      secondaryCta: "公開中のツールを見る",
      title: "開いてすぐ使えるオンライン画像変換。",
    },
    strategy: {
      description:
        "よくある画像変換作業を、できるだけ少ない手順で終えられるようにしています。",
      indexedPagesDescription:
        "画像を選び、形式やサイズを決めて、そのまま結果を生成できます。",
      indexedPagesTitle: "すぐ使える",
      lightweightExpansionDescription:
        "結果をプレビューしてから保存できるので、ちょっとした変換にも向いています。",
      lightweightExpansionTitle: "確認して保存",
      localProcessingDescription:
        "画像処理はすべてブラウザ内で完結し、元画像はアップロードされません。",
      localProcessingTitle: "ローカル処理",
      title: "使いやすいポイント",
    },
    tools: {
      description:
        "各ツールには専用ページ、専用タイトル、専用説明を用意し、ユーザーが検索から直接問題解決ページに到達できるようにしています。",
      title: "公開中のツール",
    },
    info: {
      expansionMatrixDescription:
        "PNG、JPG/JPEG、WebP の変換とリサイズに対応しています。",
      expansionMatrixTitle: "よく使う形式に対応",
      highFrequencyDescription:
        "縦横比を固定すれば、片方を変えるだけでもう片方が自動で調整されます。",
      highFrequencyTitle: "サイズ変更が簡単",
      substantialPagesDescription:
        "変換後はその場でプレビューしてダウンロードできます。",
      substantialPagesTitle: "仕上がりを確認できる",
    },
  },
  imageConverter: {
    metadata: {
      description:
        "PNG、JPG、WebP の形式変換とリサイズをオンラインで行えます。すべてブラウザ内で処理され、アップロード不要なので、素早い形式変更やサイズ調整に向いています。",
      keywords: [
        "画像変換",
        "画像リサイズ",
        "png jpg 変換",
        "webp png 変換",
        "ブラウザ画像圧縮",
      ],
      title: "画像形式とサイズの変換",
    },
    hero: {
      badges: {
        category: "画像ツール",
        localProcessing: "ブラウザ内処理",
        singleImage: "単一画像",
      },
      description:
        "PNG、JPG、WebP の形式変換、画像のリサイズ、結果の書き出しをブラウザ内で行えます。ファイルはサーバーへアップロードされません。",
      title: "画像形式とサイズの変換",
    },
    scenarios: {
      description:
        "複雑な画像編集ではなく、形式変換やリサイズを手早く済ませたい場面に向いています。",
      privacy:
        "プライバシーを重視し、第三者サービスに画像をアップロードしたくない場合。",
      ratio: "縦横比を固定したまま、手計算せずにサイズを変更したい場合。",
      title: "こんなときに便利",
      transform:
        "PNG を JPG / WebP に変換したり、大きな画像を Web 向けサイズに縮小したい場合。",
    },
    tool: {
      category: "画像ツール",
      description:
        "PNG、JPG、WebP の形式変換とリサイズをオンラインで行えます。処理はすべてブラウザ内で完結し、アップロード不要なので、素早い圧縮、サイズ変更、形式変更に向いています。",
      faq: [
        {
          answer:
            "いいえ。画像はブラウザ内で処理され、サーバーには送信されません。",
          question: "画像はサーバーにアップロードされますか？",
        },
        {
          answer:
            "現在は PNG、JPG/JPEG、WebP の 3 形式で、単一画像の変換とリサイズに対応しています。",
          question: "対応している画像形式は何ですか？",
        },
        {
          answer:
            "JPEG は透明度をサポートしていません。透明背景がある画像を JPEG に書き出すと、白背景で補完されます。",
          question: "透明背景を JPEG にするとどうなりますか？",
        },
      ],
      features: [
        "PNG、JPG、WebP の相互変換に対応",
        "幅と高さを自由に指定でき、縦横比の固定にも対応",
        "JPEG / WebP の品質調整に対応",
        "結果画像をその場でプレビューしてダウンロード可能",
        "ローカル処理でアップロード不要",
      ],
      keywords: [
        "画像変換",
        "画像リサイズ",
        "png jpg 変換",
        "webp png 変換",
        "ブラウザ画像圧縮",
      ],
      name: "画像形式とサイズの変換",
      steps: [
        "PNG、JPG、または WebP の画像を 1 枚アップロードします。",
        "出力形式を選び、必要ならサイズを入力します。",
        "必要に応じて縦横比固定や圧縮品質を調整します。",
        "結果を生成し、プレビューしてダウンロードします。",
      ],
      summary: "ブラウザ内で画像形式の変換、サイズ変更、品質調整を行います。",
    },
    content: {
      faqDescription: "使う前によく気になるポイントをまとめています。",
      faqTitle: "よくある質問",
      privacyDescription: "使い始める前に知っておきたい点です。",
      privacyItems: [
        "画像はサーバーにアップロードされず、変換はすべてブラウザ内で行われます。",
        "JPEG は透明背景に対応していないため、透明部分は白で補完されます。",
        "HEIC、アニメーション GIF、SVG 書き出し、複数画像の一括変換には未対応です。",
      ],
      privacyTitle: "利用上の注意",
      stepsDescription: "次の手順で変換できます。",
      stepsTitle: "使い方",
      supportDescription: "現在の入出力形式は PNG、JPG/JPEG、WebP です。",
      supportTitle: "対応形式",
    },
    client: {
      badges: {
        firstVersion: "単一画像",
        localProcessing: "ブラウザ内処理",
        stale: "設定が変更されました",
        stalePreview: "再生成が必要",
        supportedFormats: "対応形式: {formats}",
      },
      upload: {
        chooseImage: "画像を選択",
        clear: "クリア",
        description:
          "下のエリアに画像をドラッグするか、ボタンから画像を 1 枚選択してください。現在は単一画像のみ対応し、サーバーへはアップロードしません。",
        emptyDescription:
          "PNG、JPG/JPEG、WebP に対応しています。リサイズ、出力形式の切り替え、品質調整が行えます。",
        emptyTitle: "画像をドロップして開始",
        pendingResult: "設定を調整して結果を生成してください",
        reselect: "別の画像を選ぶ",
        resultLabel: "結果画像",
        sourceLabel: "元画像",
        title: "元画像をアップロード",
      },
      settings: {
        aspectLockDescription:
          "有効にすると片方のサイズ変更に合わせてもう片方も自動で更新されます。",
        aspectLockTitle: "元の比率を固定",
        description:
          "まず出力形式を選び、その後でサイズを変更するか決めます。JPEG と WebP では品質も調整できます。",
        download: "画像をダウンロード",
        generate: "結果を生成",
        height: "高さ (px)",
        heightPlaceholder: "例: 800",
        quality: "出力品質",
        qualityAria: "出力品質",
        qualityDescription:
          "品質を上げるほど通常はファイルサイズも大きくなります。まずは 82 前後から試すのがおすすめです。",
        regenerate: "結果を再生成",
        targetFormat: "出力形式",
        title: "変換設定",
        width: "幅 (px)",
        widthPlaceholder: "例: 1200",
      },
      preview: {
        alt: "{label} のプレビュー",
        emptyDescription:
          "生成後、ここに結果画像が表示され、そのままプレビューとダウンロードができます。",
      },
      errors: {
        blobFailed:
          "ブラウザで結果画像を生成できませんでした。もう一度お試しください。",
        canvasUnsupported:
          "このブラウザは Canvas に対応していないため、画像変換を利用できません。",
        convertFailed:
          "変換に失敗しました。しばらくしてから再度お試しください。",
        imageBroken:
          "画像を読み込めませんでした。ファイルが壊れていないか確認してください。",
        invalidDimensions: "幅と高さは 0 より大きい整数である必要があります。",
        readFailed:
          "画像の読み込みに失敗しました。別のファイルでお試しください。",
        unsupportedFormat:
          "この形式はまだ対応していません。{formats} の画像をアップロードしてください。",
        unsupportedOutput: "このブラウザでは現在 {format} を書き出せません。",
        uploadFirst: "先に画像をアップロードしてください。",
      },
    },
    formats: {
      jpg: {
        description: "非可逆圧縮。写真向け。透明部分は白背景になります",
        label: "JPG",
      },
      png: {
        description: "可逆圧縮。スクリーンショット、アイコン、透明背景向け",
        label: "PNG",
      },
      webp: {
        description: "圧縮率が高く、Web 画像向け",
        label: "WebP",
      },
    },
  },
};
