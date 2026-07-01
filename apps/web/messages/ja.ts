import type { LocaleContent } from "./types";

export const jaMessages: LocaleContent = {
  metadata: {
    defaultTitle: "オンラインツール",
    siteDescription:
      "Meathill Tools はブラウザでそのまま使えるオンラインツールを提供します。ローカル処理、アップロード不要、無料で利用可能。",
    siteTitle: "Meathill Tools",
  },
  header: {
    languageSwitcherLabel: "言語",
    localProcessing: "ローカル処理",
    nav: {
      home: "ホーム",
      imageConverter: "画像変換",
      pdfTextEditor: "PDF テキスト編集",
    },
    tagline: "日常向けオンラインツール",
    theme: {
      dark: "ダーク",
      light: "ライト",
      system: "システム",
    },
  },
  footer: {
    description:
      "ブラウザですぐ使えるオンラインツールです。インストール不要、登録不要。",
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
        "Meathill Tools はブラウザでそのまま使えるオンラインツールを提供します。画像形式変換、リサイズ、PDF テキスト編集。",
      keywords: [
        "オンラインツール",
        "ブラウザツール",
        "画像変換",
        "画像リサイズ",
        "PDF テキスト編集",
      ],
      title: "オンラインツール",
    },
    structuredData: {
      toolListName: "Meathill Tools 一覧",
    },
    hero: {
      badges: {
        scalable: "ローカル処理",
        seo: "インストール不要",
        stack: "無料で利用",
      },
      description:
        "ブラウザで直接使えるオンラインツールです。ソフトウェアのインストールもファイルのアップロードも不要 — 開いてすぐ使えます。",
      secondaryCta: "ツールを見る",
      title: "オンラインツール、開いてすぐ使えます。",
    },
    strategy: {
      description:
        "日常の小さな問題を、できるだけ少ない手順で解決することに特化しています。",
      indexedPagesDescription:
        "ファイルを選択して設定を調整し、結果をプレビュー — すべて1ページで完結します。",
      indexedPagesTitle: "すぐ使える",
      lightweightExpansionDescription:
        "ダウンロードする前に結果をプレビューできます。",
      lightweightExpansionTitle: "確認してから保存",
      localProcessingDescription:
        "ファイルはすべてブラウザ内で処理され、サーバーには送信されません。",
      localProcessingTitle: "ローカル処理",
      title: "使いやすいポイント",
    },
    tools: {
      description: "現在利用可能なツールです。",
      title: "公開中のツール",
    },
    info: {
      expansionMatrixDescription:
        "各ツールは日常的なニーズに対応する一般的な形式をサポートしています。",
      expansionMatrixTitle: "一般的な形式に対応",
      highFrequencyDescription:
        "過度な設計を避け、頻繁に発生する小規模な問題の解決に特化しています。",
      highFrequencyTitle: "小さく集中",
      substantialPagesDescription:
        "登録不要、インストール不要。ページを開いてファイルを処理し、結果をダウンロードできます。",
      substantialPagesTitle: "ゼロバリア",
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
        singleImage: "一括変換対応",
      },
      description:
        "iPhone の HEIC 写真を JPG/PNG/WebP に変換でき、PNG、JPG、WebP の相互変換やリサイズもブラウザ内で行えます。ファイルはサーバーへアップロードされません。",
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
        "iPhone の HEIC/HEIF 写真を JPG、PNG、WebP に変換し、PNG、JPG、WebP の相互変換やリサイズもオンラインで行えます。処理はすべてブラウザ内で完結し、アップロード不要なので、素早い圧縮、サイズ変更、形式変更に向いています。",
      faq: [
        {
          answer:
            "いいえ。画像はブラウザ内で処理され、サーバーには送信されません。",
          question: "画像はサーバーにアップロードされますか？",
        },
        {
          answer:
            "HEIC/HEIF（iPhone 写真）を JPG、PNG、WebP に変換でき、PNG、JPG/JPEG、WebP の単一画像変換とリサイズにも対応しています。",
          question: "対応している画像形式は何ですか？",
        },
        {
          answer:
            "はい。.heic/.heif ファイルをアップロードするだけで、ブラウザ内でデコードして JPG、PNG、WebP に変換します。アップロードは行いません。",
          question: "iPhone の HEIC 写真を変換できますか？",
        },
        {
          answer:
            "JPEG は透明度をサポートしていません。透明背景がある画像を JPEG に書き出すと、白背景で補完されます。",
          question: "透明背景を JPEG にするとどうなりますか？",
        },
      ],
      features: [
        "iPhone の HEIC/HEIF 写真を JPG、PNG、WebP に変換",
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
        "heic jpg 変換",
        "heic to jpg",
        "iPhone 写真 変換",
      ],
      name: "画像形式とサイズの変換 — HEIC を JPG に変換",
      steps: [
        "PNG、JPG、WebP、または HEIC の画像を 1 枚アップロードします。",
        "出力形式を選び、必要ならサイズを入力します。",
        "必要に応じて縦横比固定や圧縮品質を調整します。",
        "結果を生成し、プレビューしてダウンロードします。",
      ],
      summary:
        "ブラウザ内で HEIC などの写真を JPG/PNG/WebP に変換し、サイズ変更や品質調整も行います。",
    },
    content: {
      faqDescription: "使う前によく気になるポイントをまとめています。",
      faqTitle: "よくある質問",
      privacyDescription: "使い始める前に知っておきたい点です。",
      privacyItems: [
        "画像はサーバーにアップロードされず、変換はすべてブラウザ内で行われます。",
        "JPEG は透明背景に対応していないため、透明部分は白で補完されます。",
        "アニメーション GIF と SVG 書き出しには未対応です。",
      ],
      privacyTitle: "利用上の注意",
      stepsDescription: "次の手順で変換できます。",
      stepsTitle: "使い方",
      supportDescription:
        "入力は PNG、JPG/JPEG、WebP、HEIC/HEIF に対応。出力は PNG、JPG/JPEG、WebP です（HEIC は入力のみ）。",
      supportTitle: "対応形式",
    },
    client: {
      badges: {
        localProcessing: "ブラウザ内処理",
        stale: "設定が変更されました",
        staleCount: "{count} 件が再生成待ち",
        stalePreview: "再生成が必要",
        supportedFormats: "対応形式: {formats}",
      },
      batch: {
        downloadAria: "{name} をダウンロード",
        overCapRejected:
          "一度に処理できるのは最大 {max} 枚までです。{rejected} 枚をスキップしました。",
        partiallyRejected:
          "{accepted} 枚を追加しました。{rejected} 枚は非対応形式のためスキップしました。",
        progressLabel: "{total} 枚中 {done} 枚を変換中",
        removeAria: "{name} を削除",
        statusConverting: "変換中",
        statusDone: "完了",
        statusError: "失敗",
        statusPending: "待機中",
        zipEmpty: "まだ ZIP でダウンロードできる画像がありません。",
      },
      upload: {
        addMore: "さらに追加",
        chooseImage: "画像を選択",
        clear: "クリア",
        clearAll: "すべてクリア",
        decoding: "HEIC 写真をデコード中…",
        description:
          "下のエリアに画像をドラッグするか、ボタンから 1 枚以上の画像を選択してください。すべてブラウザ内で処理され、サーバーへはアップロードしません。",
        emptyDescription:
          "PNG、JPG/JPEG、WebP、HEIC（iPhone 写真）に対応しています。リサイズ、出力形式の切り替え、品質調整が行えます。",
        emptyTitle: "画像をドロップして開始",
        pendingResult: "設定を調整して結果を生成してください",
        reselect: "別の画像を選ぶ",
        resultLabel: "結果画像",
        selectedCount: "{count} 枚の画像を選択中",
        sourceLabel: "元画像",
        title: "元画像をアップロード",
      },
      settings: {
        cropAnchorAria: "{vertical}{horizontal}",
        cropAnchorDescription:
          "画像のどの領域を残すかを選びます。はみ出した部分は切り取られます。",
        cropAnchorTitle: "切り抜き位置",
        cropHorizontal: {
          center: "中央",
          left: "左",
          right: "右",
        },
        cropVertical: {
          bottom: "下",
          middle: "中央",
          top: "上",
        },
        description:
          "まず出力形式を選び、その後でサイズを変更するか決めます。JPEG と WebP では品質も調整できます。",
        download: "画像をダウンロード",
        downloadAll: "ZIP でまとめてダウンロード",
        generate: "結果を生成",
        generateAll: "すべて生成",
        height: "高さ (px)",
        heightPlaceholder: "例: 800",
        modeCrop: "切り抜いて合わせる",
        modeLock: "比率を固定",
        modeStretch: "自由に伸縮",
        quality: "出力品質",
        qualityAria: "出力品質",
        qualityDescription:
          "品質を上げるほど通常はファイルサイズも大きくなります。まずは 82 前後から試すのがおすすめです。",
        regenerate: "結果を再生成",
        resizeModeDescription:
          "比率を固定すると画像が歪みません。自由に伸縮では幅と高さを個別に変更できます。切り抜いて合わせるでは大きい方の比率で拡大し、はみ出しを切り取ります。",
        resizeModeTitle: "リサイズ方法",
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
    conversions: {
      description:
        "{from} を {to} にブラウザ内で無料変換。アップロードや登録は不要で、ファイルは端末から外に出ません。",
      keywords: [
        "{from} {to} 変換",
        "{from} to {to}",
        "{from} を {to} に変換",
        "{from} {to} 無料",
      ],
      relatedTitle: "よく使う変換",
      title: "{from} を {to} に変換",
    },
  },
  pdfTextEditor: {
    metadata: {
      description:
        "PDF 内の既存テキストをオンラインで編集できます。すべての処理はブラウザ内で行われ、ファイルはアップロードされず、編集後すぐにダウンロードできます。",
      keywords: [
        "PDF 編集",
        "PDF テキスト編集",
        "オンライン PDF",
        "edit pdf online",
        "pdf text editor",
        "ローカル PDF 編集",
      ],
      title: "オンライン PDF テキストエディタ",
    },
    hero: {
      badges: {
        beta: "ベータ版",
        category: "ドキュメントツール",
        localProcessing: "ブラウザでローカル処理",
      },
      description:
        "PDF をアップロードし、ページ上のテキストをクリックして編集し、結果をダウンロードできます。処理はブラウザ内で完結し、ファイルが外部に送信されることはありません。",
      title: "ブラウザで PDF の既存テキストを編集",
    },
    scenarios: {
      description:
        "PDF 内の氏名・日付・住所など既存テキストの軽微な修正に適しています。",
      edit: "高価なデスクトップ PDF エディタを買わずに、少量のテキストを直したい場合。",
      fontReuse:
        "元の PDF の見た目をできるだけ保ち、編集後のフォント変化を最小限にしたい場合。",
      privacy:
        "契約書や履歴書など機密性の高い PDF を、第三者サーバーへアップロードしたくない場合。",
      title: "こんな場面に",
    },
    tool: {
      category: "ドキュメントツール",
      description:
        "PDF の既存テキストをオンラインで編集します。処理はブラウザ内で完結し、ファイルをアップロードせずに編集結果をダウンロードできます。",
      faq: [
        {
          answer:
            "いいえ。PDF はブラウザ内で解析・編集・書き出しまで行い、サーバーには送信されません。",
          question: "PDF はアップロードされますか？",
        },
        {
          answer:
            "可能な限り PDF に埋め込まれたフォントを再利用します。新しい文字が元のフォントに含まれていない場合は、Noto Sans SC に自動でフォールバックし、ユーザー側で TTF/OTF フォントをアップロードすることもできます。",
          question: "編集後にフォントは崩れますか？",
        },
        {
          answer:
            "現時点では未対応です。スキャン PDF にはテキストレイヤがないため、検出時に通知して別のテキスト PDF を選ぶよう案内します。",
          question: "スキャン（画像）PDF も編集できますか？",
        },
        {
          answer:
            "現時点では未対応です。V1 は既存テキストの置き換えのみをサポートし、新しいテキストボックス追加・画像編集・ページ分割などは今後の対応予定です。",
          question: "新しいテキストボックスを追加できますか？",
        },
      ],
      features: [
        "PDF 内テキストの位置・サイズ・フォントを解析",
        "クリックで元の位置のままテキストを編集",
        "埋め込みフォントを優先利用し、必要に応じて Noto Sans SC にフォールバック",
        "TTF/OTF フォントのアップロードに対応",
        "すべての処理はブラウザ内で完結",
      ],
      keywords: [
        "PDF 編集",
        "PDF テキスト編集",
        "オンライン PDF",
        "edit pdf online",
        "pdf text editor",
        "ローカル PDF 編集",
      ],
      name: "オンライン PDF テキストエディタ",
      steps: [
        "テキストレイヤがある PDF をアップロードします。",
        "プレビューで編集したいテキストをクリックします。",
        "CJK が含まれる場合は Noto Sans SC の読み込みを待ちます。",
        "内容を確認したら編集済み PDF をダウンロードします。",
      ],
      summary:
        "PDF テキストをブラウザ内で置き換え、元のフォントの見た目をできる限り保ちます。",
    },
    content: {
      faqDescription: "始める前によくある質問。",
      faqTitle: "よくある質問",
      limitsDescription: "V1 では以下のシナリオには対応していません。",
      limitsItems: [
        "スキャン（画像）PDF：テキストレイヤがないため検出して案内します。",
        "新規テキストボックス追加・画像編集・ページ並び替え／削除は今後対応予定です。",
        "パスワード保護された PDF：現時点では解除できません。",
        "カラーテキスト：書き出し時は黒色で出力されます（色選択は計画中）。",
      ],
      limitsTitle: "既知の制限",
      stepsDescription: "下記の手順で編集できます。",
      stepsTitle: "使い方",
      supportDescription:
        "編集可能なテキストレイヤを自動で検出し、その場で編集できます。",
      supportTitle: "できること",
    },
    client: {
      badges: {
        beta: "ベータ版",
        localProcessing: "ブラウザでローカル処理",
        scannedDetected: "スキャン PDF を検出",
        supportedFormats: "PDF 対応",
      },
      upload: {
        choosePdf: "PDF を選ぶ",
        clear: "クリア",
        description:
          "下の領域に PDF をドラッグするか、ボタンから選択してください。処理はブラウザ内で完結します。",
        emptyDescription:
          "テキストレイヤを持つ PDF に対応しています。まずは小さなファイルでお試しください。",
        emptyTitle: "PDF をドロップして編集開始",
        maxSizeHint: "1 ファイルあたり最大 {size} まで。",
        pageCountLabel: "全 {count} ページ",
        reselect: "選び直す",
        title: "PDF をアップロード",
      },
      scanned: {
        description:
          "この PDF にはテキストレイヤがありません（スキャンや画像 PDF の可能性）。OCR を行うか、テキストベースの PDF を使用してください。",
        title: "スキャン PDF は未対応",
      },
      viewer: {
        nextPage: "次のページ",
        pageOf: "{current} / {total} ページ",
        prevPage: "前のページ",
        zoomIn: "拡大",
        zoomOut: "縮小",
      },
      editor: {
        activeBlockTitle: "編集中のブロック",
        clickToEditHint:
          "テキストをクリックすると編集できます。Esc または Enter で終了します。",
        description: "黄色背景は編集済みブロックを示します。",
        editedCount: "{count} 件編集済み",
        escToExit: "Esc または空白をクリックして編集を終了。",
        overflowWarning:
          "テキストが元の領域を超えています。書き出し時に自動で縮小します。",
        resetBlock: "この変更を取り消す",
        title: "テキストを編集",
      },
      fonts: {
        acceptedFontTypes: "TTF / OTF フォントに対応。",
        cjkFailed:
          "Noto Sans SC の読み込みに失敗しました。回線を確認するか、フォントをアップロードしてください。",
        cjkIdle: "フォールバックフォントは未読込",
        cjkLoading: "Noto Sans SC を読み込み中",
        cjkReady: "Noto Sans SC の準備完了",
        description:
          "PDF 埋め込みフォントを優先し、CJK 時は Noto Sans SC を自動取得、不足時はアップロードしたフォントへフォールバックします。",
        removeUserFont: "削除",
        title: "フォント戦略",
        uploadFontButton: "フォントをアップロード",
        userFontLoaded: "フォント読込済: {name}",
      },
      export: {
        button: "PDF をダウンロード",
        buttonEdited: "編集後の PDF をダウンロード",
        cleanHint: "まだ編集していません。元の PDF がダウンロードされます。",
        description:
          "問題なければボタンをクリックして編集後の PDF を取得します。",
        editedHint: "{count} 件の変更を反映して書き出します。",
        exporting: "書き出し中",
        missingGlyphChars: "不足文字: {chars}",
        title: "ダウンロード",
      },
      errors: {
        cjkFontLoadFailed:
          "Noto Sans SC の取得に失敗しました。回線確認またはフォントをアップロードしてください。",
        encryptedNotSupported: "パスワード保護された PDF は未対応です。",
        exportFailed: "書き出しに失敗しました。後でもう一度お試しください。",
        fileTooLarge: "ファイルが大きすぎます（最大 {size}）。",
        fontEmbedFailed:
          "フォント埋め込みに失敗したため、フォールバックを使用しました。",
        fontMissingGlyph:
          "一部の編集に元フォントが含まない文字が含まれていたため、フォールバックを使用または変更を見送りました。",
        loadFailed:
          "PDF の解析に失敗しました。ファイルが破損していないか確認してください。",
        loadFailedDetail: "PDF の解析に失敗: {detail}",
        scannedNotSupported: "スキャン PDF は未対応です。",
        unsupportedFont:
          "不正なフォントファイルです。TTF / OTF のみ対応します。",
        unsupportedFormat:
          "このファイル形式は未対応です。PDF をアップロードしてください。",
        workerFailed:
          "PDF Worker の起動に失敗しました。ページを再読込してください。",
      },
    },
  },
  ogImageValidator: {
    metadata: {
      description:
        "URL を入力すると Open Graph・Twitter Card タグを取得して検証し、Facebook、X、LinkedIn、Discord、Slack でのシェアカードをプレビューできます。og:image の寸法・比率・ファイルサイズも確認可能。画像を直接アップロードして検証することもできます。",
      keywords: [
        "OG 画像 検証",
        "open graph デバッガ",
        "twitter card 検証",
        "SNS シェアプレビュー",
        "og:image サイズ",
        "opengraph バリデータ",
        "OG 画像チェッカー",
      ],
      title: "OG 画像バリデータ / ソーシャルシェアプレビューデバッガ",
    },
    hero: {
      badges: {
        category: "SEO ツール",
        platforms: "5 プラットフォーム対応",
        realtime: "リアルタイムタグチェック",
      },
      description:
        "URL を入力すると Open Graph / Twitter Card タグを取得・解析し、Facebook、X、LinkedIn、Discord、Slack でのシェア表示をプレビューできます。og:image の寸法・比率・ファイルサイズ・形式も検証できます。単独の画像をアップロードして検証することも可能です。",
      title: "OG 画像 & ソーシャルシェアプレビューバリデータ",
    },
    scenarios: {
      description:
        "公開前のシェア表示を確認するのに適しており、大量の URL を一括監視する用途には向きません。",
      debug:
        "SNS でリンクをシェアしても画像やタイトルが表示されない場合に、OG タグをデバッグできます。",
      optimize:
        "og:image の寸法・比率・サイズが各プラットフォームの要件を満たしているか確認し、クリック率を改善したい場合。",
      preview:
        "記事やランディングページを公開する前に、各プラットフォームでどう表示されるか確認したい場合。",
      title: "こんな場面に",
    },
    tool: {
      category: "SEO ツール",
      description:
        "任意の URL の Open Graph・Twitter Card タグをオンラインで取得し、Facebook、X、LinkedIn、Discord、Slack のシェアカードをプレビューして、og:image の寸法・比率・ファイルサイズ・形式を検証します。画像をアップロードしてオフラインで検証することもできます。",
      faq: [
        {
          answer:
            "URL モードではサーバー側がページを取得してタグを解析します（ブラウザのクロスオリジン制限を回避するため）。読み取るのは公開コンテンツのみで、データは保存しません。アップロードモードはブラウザ内で完結し、画像は外部に送信されません。",
          question: "URL を検証する際、データはどう扱われますか？",
        },
        {
          answer:
            "サイトによっては非ブラウザリクエストに対して簡略化されたコンテンツを返したり、OG タグを JavaScript で動的に挿入したりする場合があります。そのようなページではタグが正常に取得できないことがありますが、これは想定内の動作です。",
          question: "解析できないサイトがあるのはなぜですか？",
        },
        {
          answer:
            "1200×630 ピクセル・比率 1.91:1 が一般的な推奨値です。600×315 未満では一部プラットフォームで小さいカードが表示され、200×200 未満では画像が読み込まれないことがあります。",
          question: "og:image の推奨サイズは？",
        },
        {
          answer:
            "Facebook / Discord は約 8MB、X / LinkedIn / Slack は約 5MB が上限の目安です。各プラットフォームの公式ドキュメントに従い、このツールはそれらのしきい値に基づいて問題を検出します。",
          question: "プラットフォームごとのファイルサイズ上限は？",
        },
      ],
      features: [
        "任意の URL の Open Graph・Twitter Card タグを取得",
        "Facebook、X、LinkedIn、Discord、Slack のシェアカードをプレビュー",
        "og:image の寸法・比率（1.91:1）・ファイルサイズ・形式を検証",
        "プラットフォームごとの合格 / 警告 / 不合格の診断結果を表示",
        "画像をアップロードして寸法と比率をオフラインで検証",
        "twitter:image→og:image、og:title→title のフォールバックを解決",
      ],
      keywords: [
        "OG 画像 検証",
        "open graph デバッガ",
        "twitter card 検証",
        "SNS シェアプレビュー",
        "og:image サイズ",
        "シェアカードプレビュー",
        "opengraph バリデータ",
        "OG 画像チェッカー",
      ],
      name: "OG 画像バリデータ — ソーシャルシェアプレビューデバッガ",
      steps: [
        "「URL から」に切り替えて、確認したいページの URL を貼り付けます。",
        "「チェック」をクリックすると、ページの OG / Twitter タグを取得・解析します。",
        "プラットフォームごとのシェアカードプレビューと、寸法・比率・サイズ・タグのレポートを確認します。",
        "または「画像をアップロード」に切り替えて、単一画像を各プラットフォームの仕様に基づいて検証します。",
      ],
      summary:
        "URL の Open Graph / Twitter タグを取得し、マルチプラットフォームのシェアカードをプレビューして画像を検証します。",
    },
    content: {
      faqDescription: "始める前によくある質問。",
      faqTitle: "よくある質問",
      privacyDescription: "使い始める前に知っておきたい点。",
      privacyItems: [
        "URL モードでは、ブラウザのクロスオリジン制限を回避するためにサーバーがページを取得します。読み取るのは公開コンテンツのみで、データは保存しません。",
        "プライベート・ループバック・内部ネットワークアドレスはセキュリティポリシーによりブロックされ、取得できません。",
        "アップロードモードはブラウザ内で完結し、画像がデバイス外に出ることはありません。",
      ],
      privacyTitle: "ご利用にあたって",
      stepsDescription: "以下の手順で検証を実行できます。",
      stepsTitle: "使い方",
      supportDescription:
        "Open Graph・Twitter Card・基本的な SEO タグを検証し、Facebook、X、LinkedIn、Discord、Slack のシェアカードをカバーします。",
      supportTitle: "チェック対象",
    },
    client: {
      modes: {
        upload: "画像をアップロード",
        url: "URL から",
      },
      url: {
        emptyDescription:
          "公開されているページの URL を貼り付けると、OG / Twitter タグを取得して各プラットフォームのシェアカードをプレビューします。",
        emptyTitle: "URL を入力して開始",
        fetching: "ページを取得・解析中…",
        hint: "シェア表示を確認したいページの完全な URL（https:// を含む）を入力してください。",
        label: "ページ URL",
        placeholder: "https://example.com/article",
        resubmit: "再チェック",
        submit: "チェック",
      },
      upload: {
        choose: "画像を選択",
        clear: "クリア",
        decoding: "画像を読み込み中…",
        description:
          "下のエリアに画像をドラッグするか、クリックして選択してください。寸法・比率・サイズ・形式をローカルで検証します。アップロードは行いません。",
        dropHint: "ドロップして読み込む",
        emptyDescription:
          "PNG、JPG、WebP、GIF に対応。各プラットフォームの OG 仕様に基づいて寸法・比率・サイズを検証します。",
        emptyTitle: "画像をドロップして検証",
        reselect: "選び直す",
        title: "画像をアップロード",
      },
      result: {
        dimensionsUnknown: "寸法不明",
        generalTitle: "総合チェック",
        noImage: "og:image が見つかりません",
        overallFail: "問題が見つかりました",
        overallPass: "すべて問題なし",
        overallWarn: "改善の余地あり",
        platformsTitle: "プラットフォームごとの診断",
        previewTitle: "シェアカードプレビュー",
        sizeUnknown: "サイズ不明",
        sourceLabel: "画像ソース",
        tagsTitle: "取得したタグ",
      },
      status: {
        fail: "不合格",
        pass: "合格",
        warn: "警告",
      },
      platforms: {
        discord: "Discord",
        facebook: "Facebook",
        linkedin: "LinkedIn",
        slack: "Slack",
        twitter: "X (Twitter)",
      },
      checks: {
        "image-dimensions": "画像の寸法",
        "image-ratio": "アスペクト比",
        "platform-filesize": "ファイルサイズ",
        "platform-format": "画像形式",
        "platform-min-size": "最小サイズ",
        "platform-required-tags": "必須タグ",
        "tag-description": "説明 (description)",
        "tag-image-alt": "画像の代替テキスト (og:image:alt)",
        "tag-og-image": "画像 (og:image)",
        "tag-og-url": "正規 URL (og:url)",
        "tag-title": "タイトル (og:title / title)",
        "tag-twitter-card": "カードタイプ (twitter:card)",
      },
      details: {
        "image-dimensions":
          "{width}×{height} px（推奨: {idealWidth}×{idealHeight}）",
        "image-ratio": "{ratio} : 1（推奨: {idealRatio} : 1）",
        missing: "未設定",
        "platform-filesize": "{size} / 上限 {max}",
        "platform-format": "{format}",
        "platform-min-size":
          "{width}×{height} px（最小: {minWidth}×{minHeight}）",
        present: "設定済み",
        requiredTagsMissing: "{missing} が不足",
        unknown: "読み取れません",
      },
      errors: {
        BLOCKED_HOST:
          "このアドレスはセキュリティポリシーによりブロックされています（プライベート / ローカル / 内部ネットワークアドレスは取得できません）。",
        FETCH_FAILED:
          "対象サイトに接続できませんでした。URL が正しく、アクセス可能か確認してください。",
        FETCH_TIMEOUT:
          "取得がタイムアウトしました。対象サイトの応答が遅すぎます。後でもう一度お試しください。",
        INVALID_URL:
          "無効な URL です。http(s) で始まる完全な URL を入力してください。",
        NOT_HTML:
          "この URL は Web ページを返しませんでした。タグを解析できません。",
        TOO_MANY_REDIRECTS: "リダイレクトが多すぎて取得できませんでした。",
        UPSTREAM_ERROR:
          "対象サイトがエラーを返しました。ページが存在しないか、一時的に利用できない可能性があります。",
        UNKNOWN: "検証に失敗しました。後でもう一度お試しください。",
      },
    },
  },
  jsonViewer: {
    metadata: {
      description:
        "JSON を貼り付けるだけで、型ごとに色分けされた折りたたみ可能なツリーに整形します。検索・絞り込みや、ネストされた JSON 文字列の展開にも対応。処理はすべてブラウザ内で完結するため、HTTP リクエストやレスポンスの確認に最適です。",
      keywords: [
        "JSON 整形",
        "JSON ビューア",
        "json viewer",
        "json formatter",
        "json ツリー",
        "オンライン json ツール",
      ],
      title: "JSON フォーマッター & ツリービューア",
    },
    hero: {
      badges: {
        category: "開発者ツール",
        localProcessing: "ブラウザ内で処理",
        nested: "ネスト JSON 対応",
      },
      description:
        "JSON を貼り付けると、すぐに展開・折りたたみできるツリーに整形します。型ごとの色分け、検索・絞り込み、ネストされた JSON 文字列の解析に対応。HTTP リクエストやレスポンスの確認のために作られ、データはブラウザの外に出ません。",
      title: "JSON フォーマッター & ツリービューア",
    },
    scenarios: {
      description:
        "JSON をすばやく確認・デバッグする用途に最適で、大規模なデータ編集には向きません。",
      local:
        "プライバシーが気になり、API データを第三者サイトに貼り付けたくない。",
      nested:
        "HTTP ボディ内にエスケープされた JSON 文字列がネストされていて、展開して確認したい。",
      search:
        "レスポンスが大きく、特定のフィールドや値を検索してすぐ見つけたい。",
      title: "こんなときに便利",
    },
    tool: {
      category: "開発者ツール",
      description:
        "JSON を貼り付けるだけで、型ごとに色分けされた折りたたみ可能なツリーに整形します。検索・絞り込みや、ネストされた JSON 文字列の展開にも対応。処理はすべてブラウザ内で完結するため、HTTP リクエストやレスポンスの確認に最適です。",
      faq: [
        {
          answer:
            "いいえ。解析・整形・検索はすべてブラウザ内で行われ、データがサーバーに送信されることはありません。",
          question: "JSON データはサーバーにアップロードされますか？",
        },
        {
          answer:
            "解析に失敗した原因を表示し、該当する行と列を特定するので、すばやく修正できます。",
          question: "JSON の形式が正しくない場合はどうなりますか？",
        },
        {
          answer:
            "HTTP レスポンスでは、1 つの JSON が文字列としてフィールド内に格納されることがよくあります。そのような文字列を検出すると、ボタンでサブツリーとして展開できます。",
          question: "「ネストされた JSON 文字列を解析」とは？",
        },
      ],
      features: [
        "貼り付けるだけで整形し、展開・折りたたみ可能なツリーに表示",
        "string / number / boolean / null など型ごとに色分け",
        "キーと値を検索し、ヒットを強調表示して自動展開。一致のみ表示も可能",
        "すべてのノードを一括で展開・折りたたみ、整形した JSON をコピー",
        "フィールド内にネストされた JSON 文字列を検出して展開",
      ],
      keywords: [
        "JSON 整形",
        "JSON ビューア",
        "json viewer",
        "json formatter",
        "json ツリー",
        "オンライン json ツール",
      ],
      name: "JSON フォーマッター & ツリービューア",
      steps: [
        "左側のテキストボックスに JSON を貼り付けるか入力します。",
        "右側で即座に折りたたみ可能な、型ごとに色分けされたツリーに整形されます。",
        "検索ボックスでフィールドや値を探し、必要に応じて「一致のみ表示」をオンにします。",
        "ネストされた JSON 文字列は、ノードのボタンで展開します。必要なときは整形結果をコピーできます。",
      ],
      summary:
        "ブラウザ内で JSON を折りたたみ可能なツリーに整形し、検索とネスト JSON の展開に対応。",
    },
    content: {
      faqDescription: "始める前によくある質問。",
      faqTitle: "よくある質問",
      privacyDescription: "使う前に知っておきたいこと。",
      privacyItems: [
        "アップロードは行われず、解析と検索はすべてブラウザ内で完結します。",
        "標準的な JSON に対応します。コメントや末尾カンマなどの非標準な記法は解析に失敗します。",
        "非常に大きな JSON をすべて展開すると遅くなることがあります。折りたたむか検索で移動してください。",
      ],
      privacyTitle: "ご利用にあたって",
      stepsDescription: "次の手順で JSON を確認できます。",
      stepsTitle: "使い方",
      supportDescription:
        "HTTP リクエストとレスポンスの確認を中心に作られた実用的な機能。",
      supportTitle: "主な機能",
    },
    client: {
      empty: {
        description:
          "左側に JSON を貼り付けると、整形された折りたたみ可能なツリーがここに表示されます。",
        title: "JSON を貼り付けて開始",
      },
      error: {
        location: "{line} 行 {column} 列",
        title: "JSON を解析できませんでした",
      },
      input: {
        clear: "クリア",
        placeholder:
          "ここに JSON を貼り付けます（例：HTTP リクエストやレスポンスのボディ）…",
        title: "JSON 入力",
      },
      status: {
        characters: "{count} 文字",
        invalid: "無効な JSON",
        valid: "有効な JSON",
      },
      toolbar: {
        collapseAll: "すべて折りたたむ",
        copied: "コピーしました",
        copy: "コピー",
        expandAll: "すべて展開",
        onlyMatches: "一致のみ表示",
        searchPlaceholder: "キーや値を検索…",
      },
      tree: {
        parseNested: "JSON として解析",
      },
    },
  },
  markdownToPdf: {
    metadata: {
      description:
        "AIが生成したMarkdownを、スマホとPCで読みやすいPDFに変換します。見出し、リスト、表、コードブロックに対応。すべての処理はブラウザ内で行われます。",
      keywords: [
        "markdown pdf変換",
        "markdown to pdf",
        "AI出力 PDF",
        "markdownフォーマット",
        "スマホ対応PDF",
      ],
      title: "Markdown を PDF に変換",
    },
    hero: {
      badges: {
        category: "ドキュメントツール",
        localProcessing: "ブラウザローカル処理",
        mobileFriendly: "スマホ対応",
      },
      description:
        "AIのMarkdown出力を貼り付けてリアルタイムプレビューを確認し、ブラウザ印刷でPDFに書き出します。デフォルトのスマホ対応幅で、友人がスマホで拡大なしに読めます。",
      title: "Markdown を PDF に変換",
    },
    scenarios: {
      description: "AIテキストを共有可能なドキュメントに変換するのに最適です。",
      ai: "AIからMarkdownの返信を受け取り、Markdownを知らない友人に整形されたドキュメントを送りたい。",
      share: "友人のスマホでMarkdownが表示できず、書式付きPDFが必要な場合。",
      privacy:
        "内容が機密でサードパーティサーバーにアップロードしたくない場合。",
      title: "こんな場面に",
    },
    tool: {
      category: "ドキュメントツール",
      description:
        "ChatGPT・Claude など AI が出力した Markdown を無料でフォーマット済み PDF に変換します。スマホで拡大不要、PC でも読みやすい。見出し・リスト・表・コードブロックに対応、すべてブラウザ内で処理しアップロード不要。",
      faq: [
        {
          answer:
            "しません。MarkdownはブラウザでHTMLにレンダリングされ、サーバーには送信されません。",
          question: "コンテンツはサーバーにアップロードされますか？",
        },
        {
          answer:
            "'PDFをダウンロード'をクリックして新しいタブを開きます。ブラウザの印刷ダイアログで'PDFとして保存'を選択してください。",
          question: "PDFに書き出すにはどうすればいいですか？",
        },
        {
          answer:
            "デフォルトの'スマホ対応'幅は約105mmで、スマホの縦画面幅に近く、拡大なしにPDFが表示されます。A5やA4に切り替えることもできます。",
          question: "ページ幅を設定する理由は？",
        },
        {
          answer:
            "ポップアップブロックのメッセージが表示されます。ブラウザのアドレスバーのポップアップアイコンをクリックしてサイトのポップアップを許可し、再試行してください。",
          question:
            "'PDFをダウンロード'をクリックしても何も起きません。どうすればいいですか？",
        },
        {
          answer:
            "はい。ChatGPT、Claude、Gemini など、あらゆる AI ツールの出力をそのまま貼り付けられます。GFM 標準に対応しており、ほぼすべての AI が生成する Markdown 形式に対応しています。",
          question: "ChatGPT、Claude などの AI 出力を直接使えますか？",
        },
      ],
      features: [
        "見出し(H1〜H6)、段落、太字、斜体、リンクに対応",
        "番号付きリスト、箇条書き、タスクリストに対応",
        "GFMテーブルに対応",
        "フェンスコードブロック（```）に対応、自動折り返しあり",
        "引用ブロックに対応",
        "3種類のページ幅：スマホ対応 / A5 / A4",
        "ブラウザローカル処理 — コンテンツがデバイスから出ることはありません",
        "ChatGPT・Claude などの AI 出力に最適化 — そのまま貼り付けて変換可能",
      ],
      keywords: [
        "markdown pdf変換",
        "markdown to pdf",
        "ChatGPT PDF変換",
        "Claude PDF変換",
        "AI出力 PDF",
        "markdownオンライン変換",
        "無料markdown pdf",
        "スマホ対応PDF",
        "オンラインドキュメントツール",
      ],
      name: "Markdown を PDF に変換",
      steps: [
        "左側のパネルにMarkdownを貼り付けると、右側にリアルタイムプレビューが表示されます。",
        "ページ幅を選択：スマホ共有なら'スマホ対応'、汎用なら'A5'。",
        "'PDFをダウンロード'をクリックし、ブラウザの印刷ダイアログで'PDFとして保存'を選択します。",
      ],
      summary:
        "ブラウザでMarkdownをレンダリングし、ブラウザ印刷でスマホ対応PDFとして書き出します。",
    },
    content: {
      faqDescription: "開始前のよくある質問。",
      faqTitle: "よくある質問",
      privacyDescription: "ツールを使用する前にこれらのメモをお読みください。",
      privacyItems: [
        "Markdownはブラウザ内でレンダリングされ、サーバーにはアップロードされません。",
        "'PDFをダウンロード'をクリックして新しいタブを開き、印刷ダイアログで'PDFとして保存'を選択します。",
        "ポップアップがブロックされている場合は、ブラウザのアドレスバーでポップアップを許可して再試行してください。",
        "デフォルトの'スマホ対応'幅で、スマホ画面に拡大なしにフィットするPDFが生成されます。",
      ],
      privacyTitle: "注意事項",
      stepsDescription: "以下の手順でPDFを書き出します。",
      stepsTitle: "使い方",
      supportDescription: "GFM（GitHub Flavored Markdown）に基づいています。",
      supportTitle: "対応フォーマット",
    },
    client: {
      empty: {
        description:
          "左側にMarkdownを入力すると、ここにリアルタイムのプレビューが表示されます。",
        title: "Markdownを貼り付けてプレビュー",
      },
      input: {
        clear: "クリア",
        placeholder:
          "AIが生成したMarkdownをここに貼り付けるか、自分で書いてください…\n\n# 見出し\n\n**太字** と *斜体*\n\n- リスト項目1\n- リスト項目2\n\n```\nコードブロック\n```",
        title: "Markdown入力",
      },
      preview: {
        title: "プレビュー",
      },
      toolbar: {
        estimatedPages: "約{count}ページ",
        pageWidth: "ページ幅",
        pageWidthOptions: {
          a4: "標準（A4 210mm）",
          a5: "汎用（A5 148mm）",
          phone: "スマホ対応（105mm）",
        },
        popupBlockedWarning:
          "ポップアップがブロックされています。ブラウザのアドレスバーのポップアップアイコンをクリックしてサイトのポップアップを許可し、再試行してください。",
        print: "PDFをダウンロード",
        wordCount: "{count}文字",
      },
    },
  },
};
