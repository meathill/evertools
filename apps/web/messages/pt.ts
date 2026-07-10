import type { LocaleContent } from "./types";

export const ptMessages: LocaleContent = {
  metadata: {
    defaultTitle: "Ferramentas online",
    siteDescription:
      "Meathill Tools oferece ferramentas online que funcionam diretamente no navegador. Processamento local, sem upload, gratuito.",
    siteTitle: "Meathill Tools",
  },
  header: {
    languageSwitcherLabel: "Idioma",
    localProcessing: "Processamento local",
    nav: {
      home: "Inicio",
    },
    tagline: "Ferramentas praticas online",
    theme: {
      dark: "Escuro",
      light: "Claro",
      system: "Sistema",
    },
  },
  footer: {
    description:
      "Ferramentas online que funcionam diretamente no navegador. Sem instalacao, sem cadastro.",
    toolsTitle: "Ferramentas disponiveis",
  },
  home: {
    metadata: {
      description:
        "Meathill Tools oferece ferramentas online para usar imediatamente no navegador. Conversao de imagens, redimensionamento e edicao de texto PDF.",
      keywords: [
        "ferramentas online",
        "ferramentas de navegador",
        "conversor de imagens",
        "redimensionar imagem",
        "editor de texto pdf",
      ],
      title: "Ferramentas online",
    },
    structuredData: {
      toolListName: "Lista de ferramentas do Meathill Tools",
    },
    hero: {
      badges: {
        scalable: "Processamento local",
        seo: "Sem instalacao",
        stack: "Gratuito",
      },
      description:
        "Ferramentas online que funcionam diretamente no navegador. Sem instalar software, sem enviar arquivos — abra e use.",
      secondaryCta: "Ver ferramentas",
      title: "Ferramentas online, abra e use.",
    },
    strategy: {
      description:
        "Focado em resolver problemas do dia a dia com o minimo de etapas possivel.",
      indexedPagesDescription:
        "Selecione um arquivo, ajuste as configuracoes, visualize o resultado — tudo em uma pagina.",
      indexedPagesTitle: "Comece imediatamente",
      lightweightExpansionDescription:
        "Visualize o resultado antes de decidir baixar.",
      lightweightExpansionTitle: "Visualize e baixe",
      localProcessingDescription:
        "Os arquivos sao processados totalmente no navegador, o que e mais rapido e melhor para a privacidade.",
      localProcessingTitle: "Processamento local",
      title: "Por que usar",
    },
    tools: {
      description: "Ferramentas atualmente disponiveis para uso imediato.",
      title: "Ferramentas disponiveis",
    },
    info: {
      expansionMatrixDescription:
        "Cada ferramenta suporta formatos comuns para necessidades cotidianas.",
      expansionMatrixTitle: "Formatos comuns",
      highFrequencyDescription:
        "Focado em resolver problemas frequentes e pequenos sem sobre-projetar.",
      highFrequencyTitle: "Pequeno e focado",
      substantialPagesDescription:
        "Sem cadastro nem instalacao: abra a pagina, processe seu arquivo e baixe o resultado.",
      substantialPagesTitle: "Zero barreiras",
    },
  },
  imageConverter: {
    metadata: {
      description:
        "Converta imagens PNG, JPG e WebP online e redimensione no navegador. Os arquivos ficam no seu dispositivo, ideal para mudancas rapidas de formato, tamanho e exportacao.",
      keywords: [
        "conversor de imagens",
        "redimensionar imagem online",
        "png para jpg",
        "webp para png",
        "comprimir imagem navegador",
      ],
      title: "Conversor de formato e tamanho de imagens",
    },
    hero: {
      badges: {
        category: "Ferramenta de imagem",
        localProcessing: "Processamento no navegador",
        singleImage: "Conversao em lote",
      },
      description:
        "Converta fotos HEIC do iPhone para JPG, PNG ou WebP, converta entre PNG, JPG e WebP e redimensione imagens diretamente no navegador sem enviar arquivos para o servidor.",
      title: "Conversor de formato e tamanho de imagens",
    },
    scenarios: {
      description:
        "Se voce so precisa de uma mudanca rapida de formato, tamanho ou exportacao, esta ferramenta mantem tudo simples.",
      privacy:
        "Voce se importa com privacidade e nao quer enviar arquivos para um servico de terceiros.",
      ratio:
        "Voce quer manter a proporcao sem calcular largura e altura manualmente.",
      title: "Boa para tarefas como estas",
      transform:
        "Voce quer transformar PNG em JPG ou WebP, ou reduzir uma imagem grande para um tamanho mais adequado para a web.",
    },
    tool: {
      category: "Ferramenta de imagem",
      description:
        "Converta fotos HEIC/HEIF do iPhone para JPG, PNG ou WebP, converta entre PNG, JPG e WebP e redimensione online. Tudo roda no navegador sem upload, ideal para compressao rapida, redimensionamento e troca de formato.",
      faq: [
        {
          answer:
            "Nao. O processamento acontece totalmente no seu navegador e os arquivos nao sao enviados ao servidor.",
          question: "Minha imagem sera enviada?",
        },
        {
          answer:
            "Converte HEIC/HEIF (fotos do iPhone) para JPG, PNG e WebP, alem de conversao e redimensionamento de uma unica imagem entre PNG, JPG/JPEG e WebP.",
          question: "Quais formatos de imagem sao suportados?",
        },
        {
          answer:
            "Sim. Basta enviar o arquivo .heic/.heif: seu navegador o decodifica localmente e converte para JPG, PNG ou WebP, sem upload.",
          question: "Posso converter fotos HEIC do iPhone?",
        },
        {
          answer:
            "JPEG nao suporta transparencia. Se a imagem original tiver pixels transparentes, o JPEG exportado usara fundo branco.",
          question: "O que acontece com fundos transparentes em JPEG?",
        },
      ],
      features: [
        "Converta fotos HEIC/HEIF do iPhone para JPG, PNG ou WebP",
        "Converta entre PNG, JPG e WebP",
        "Defina largura e altura personalizadas com opcao de bloquear a proporcao",
        "Ajuste a qualidade de JPEG e WebP",
        "Visualize e baixe a imagem resultante diretamente",
        "Processamento local sem upload",
      ],
      keywords: [
        "conversor de imagens",
        "redimensionar imagem online",
        "png para jpg",
        "webp para png",
        "comprimir imagem navegador",
        "heic para jpg",
        "heic to jpg",
        "converter heic",
        "conversor de fotos iphone",
      ],
      name: "Conversor de formato e tamanho de imagens — Compativel com HEIC",
      steps: [
        "Envie uma imagem PNG, JPG, WebP ou HEIC.",
        "Escolha o formato de saida e informe as dimensoes desejadas se precisar.",
        "Opcionalmente bloqueie a proporcao e ajuste a qualidade de compressao.",
        "Gere o resultado, visualize e baixe a imagem convertida.",
      ],
      summary:
        "Converta fotos HEIC e outras para JPG/PNG/WebP, redimensione e ajuste a qualidade totalmente no navegador.",
    },
    content: {
      faqDescription: "Algumas perguntas comuns antes de comecar.",
      faqTitle: "Perguntas frequentes",
      privacyDescription:
        "Algumas limitacoes e observacoes importantes antes de usar a ferramenta.",
      privacyItems: [
        "As imagens nunca sao enviadas. Toda a conversao acontece no seu navegador.",
        "JPEG nao suporta transparencia, entao areas transparentes serao preenchidas com branco.",
        "GIF animado e exportacao SVG ainda nao sao suportados.",
      ],
      privacyTitle: "Observacoes e limitacoes",
      stepsDescription: "Siga estes passos para converter sua imagem.",
      stepsTitle: "Como usar",
      supportDescription:
        "PNG, JPG/JPEG, WebP e HEIC/HEIF podem ser importados; para exportar estao disponiveis PNG, JPG/JPEG e WebP (HEIC apenas como entrada).",
      supportTitle: "Formatos suportados",
    },
    client: {
      badges: {
        localProcessing: "Processamento no navegador",
        stale: "Configuracao alterada",
        staleCount: "{count} precisam ser geradas novamente",
        stalePreview: "Gerar novamente",
        supportedFormats: "Suporta {formats}",
      },
      batch: {
        downloadAria: "Baixar {name}",
        overCapRejected:
          "Suporta ate {max} imagens por vez; {rejected} foram ignoradas.",
        partiallyRejected:
          "{accepted} imagens adicionadas; {rejected} foram ignoradas (formato nao suportado).",
        progressLabel: "Convertendo {done} de {total}",
        removeAria: "Remover {name}",
        statusConverting: "Convertendo",
        statusDone: "Concluida",
        statusError: "Falhou",
        statusPending: "Pendente",
        zipEmpty: "Ainda nao ha imagens geradas para baixar em ZIP.",
      },
      upload: {
        addMore: "Adicionar mais",
        chooseImage: "Escolher imagem",
        clear: "Limpar",
        clearAll: "Limpar tudo",
        decoding: "Decodificando foto HEIC…",
        description:
          "Arraste imagens para a area abaixo ou clique no botao para escolher um ou mais arquivos. Tudo e processado no navegador e nunca e enviado.",
        emptyDescription:
          "Suporta PNG, JPG/JPEG, WebP e HEIC (fotos do iPhone). Voce pode redimensionar a imagem, mudar o formato de saida e ajustar a qualidade.",
        emptyTitle: "Solte uma imagem para comecar",
        pendingResult: "Ajuste as configuracoes e gere o resultado",
        reselect: "Escolher outra",
        resultLabel: "Resultado",
        selectedCount: "{count} imagens selecionadas",
        sourceLabel: "Original",
        title: "Enviar imagem",
      },
      settings: {
        cropAnchorAria: "{vertical} {horizontal}",
        cropAnchorDescription:
          "Escolha qual area da imagem manter; o excedente sera cortado.",
        cropAnchorTitle: "Posicao do corte",
        cropHorizontal: {
          center: "Centro",
          left: "Esquerda",
          right: "Direita",
        },
        cropVertical: {
          bottom: "Embaixo",
          middle: "Centro",
          top: "Em cima",
        },
        description:
          "Escolha primeiro o formato de saida e depois decida se quer mudar largura e altura. JPEG e WebP tambem permitem controlar a qualidade.",
        download: "Baixar imagem",
        downloadAll: "Baixar tudo em ZIP",
        generate: "Gerar resultado",
        generateAll: "Gerar tudo",
        height: "Altura (px)",
        heightPlaceholder: "ex.: 800",
        modeCrop: "Cortar para preencher",
        modeLock: "Bloquear proporcao",
        modeStretch: "Esticar livremente",
        preset: "Tamanhos predefinidos",
        presetCustom: "Tamanho personalizado",
        presetGroups: {
          appStore: "Capturas para lojas de apps",
          screen: "Telas comuns",
          social: "Redes sociais",
        },
        presetNames: {
          fourK: "4K UHD",
          fullHd: "Full HD 1080p",
          googlePlayFeature: "Grafico de destaque do Google Play",
          googlePlayPhone: "Captura de celular do Google Play",
          hd: "HD 720p",
          instagramSquare: "Instagram quadrado",
          ipadProTwelvePointNine: "iPad Pro de 12,9 polegadas",
          iphoneFivePointFive: "iPhone de 5,5 polegadas",
          iphoneSixPointFive: "iPhone de 6,5 polegadas",
          iphoneSixPointNine: "iPhone de 6,9 polegadas",
          ogImage: "Imagem OG",
          qhd: "2K QHD",
          svga: "SVGA",
          twitterCard: "Cartao do X/Twitter",
          wechatCover: "Capa de conta oficial do WeChat",
          xiaohongshuPortrait: "Xiaohongshu vertical",
          youtubeCover: "Miniatura do YouTube",
        },
        quality: "Qualidade de saida",
        qualityAria: "Qualidade de saida",
        qualityDescription:
          "Maior qualidade normalmente significa arquivo maior. Comecar perto de 82 costuma ser uma boa escolha.",
        regenerate: "Gerar novamente",
        resizeModeDescription:
          "Bloquear proporcao mantem a imagem sem distorcao; esticar livremente muda largura e altura de forma independente; cortar para preencher escala pela proporcao maior e corta o excedente.",
        resizeModeTitle: "Modo de redimensionamento",
        targetFormat: "Formato de saida",
        title: "Configuracoes de conversao",
        width: "Largura (px)",
        widthPlaceholder: "ex.: 1200",
      },
      preview: {
        alt: "Previa de {label}",
        emptyDescription:
          "A imagem gerada aparecera aqui para que voce possa visualizar e baixar diretamente.",
      },
      errors: {
        blobFailed:
          "O navegador nao conseguiu gerar a imagem de saida. Tente novamente.",
        canvasUnsupported:
          "Este navegador nao suporta Canvas, entao a conversao de imagem nao esta disponivel.",
        convertFailed: "A conversao falhou. Tente novamente mais tarde.",
        imageBroken:
          "Nao foi possivel ler a imagem. Verifique se o arquivo nao esta corrompido.",
        invalidDimensions:
          "Largura e altura devem ser numeros inteiros maiores que 0.",
        readFailed: "Falha ao ler a imagem. Tente outro arquivo.",
        unsupportedFormat:
          "Este formato ainda nao e suportado. Envie uma imagem {formats}.",
        unsupportedOutput:
          "Este navegador nao consegue exportar {format} agora.",
        uploadFirst: "Envie uma imagem primeiro.",
      },
    },
    formats: {
      jpg: {
        description:
          "Com perdas, ideal para fotos; areas transparentes ficam brancas",
        label: "JPG",
      },
      png: {
        description:
          "Sem perdas, ideal para capturas de tela, icones e transparencia",
        label: "PNG",
      },
      webp: {
        description: "Maior compressao, ideal para imagens web",
        label: "WebP",
      },
    },
    conversions: {
      description:
        "Converta {from} para {to} online, gratis e com privacidade, direto no navegador. Sem upload nem cadastro; seus arquivos nunca saem do dispositivo.",
      keywords: [
        "{from} para {to}",
        "converter {from} para {to}",
        "{from} para {to} online",
        "{from} to {to}",
      ],
      relatedTitle: "Conversoes populares",
      title: "Conversor de {from} para {to}",
    },
  },
  imageCropper: {
    metadata: {
      description:
        "Corte imagens online com total liberdade: arraste a area de selecao para recortar PNG, JPG, WebP e HEIC com precisao, com proporcoes comuns como 1:1 e 16:9. Todo o processamento acontece no navegador, sem enviar a imagem.",
      keywords: [
        "cortar imagem online",
        "recortar foto",
        "image cropper",
        "crop image online",
        "corte livre",
        "cortar 16:9",
      ],
      title: "Cortar imagens online",
    },
    hero: {
      badges: {
        category: "Ferramenta de imagem",
        freeCrop: "Corte com selecao livre",
        localProcessing: "Processamento no navegador",
      },
      description:
        "Envie uma imagem e arraste a area de selecao diretamente sobre ela para cortar qualquer regiao, ou trave com um clique proporcoes comuns como 1:1, 4:3 ou 16:9. Suporta PNG, JPG, WebP e fotos HEIC do iPhone; tudo e processado no navegador, sem enviar nada ao servidor.",
      title: "Cortar imagens online",
    },
    scenarios: {
      cover:
        "Voce quer cortar a imagem em uma proporcao fixa, como avatar ou capa, sem calcular pixels manualmente.",
      description:
        "Ideal para remover rapidamente o excesso e exportar na proporcao certa; nao serve para edicoes complexas.",
      precise:
        "Uma captura de tela tem conteudo a mais e voce precisa selecionar com precisao a area que quer manter.",
      privacy:
        "Voce se importa com privacidade e nao quer enviar imagens para um servico de terceiros.",
      title: "Boa para tarefas como estas",
    },
    tool: {
      category: "Ferramenta de imagem",
      description:
        "Corte imagens online com liberdade: arraste a area de selecao sobre a imagem para recortar com precisao, use proporcoes predefinidas como 1:1, 4:3 ou 16:9 e exporte para PNG, JPG ou WebP. Todo o processamento acontece no navegador, sem enviar a imagem.",
      faq: [
        {
          answer:
            "Nao. O processamento acontece totalmente no seu navegador e os arquivos nao sao enviados ao servidor.",
          question: "Minha imagem sera enviada para um servidor?",
        },
        {
          answer:
            "PNG, JPG/JPEG, WebP e HEIC/HEIF (fotos do iPhone) podem ser importados; para exportar estao disponiveis PNG, JPG e WebP.",
          question: "Quais formatos de imagem sao suportados?",
        },
        {
          answer:
            'Escolha uma proporcao predefinida (como 1:1 ou 16:9) e a area de selecao ficara travada nessa proporcao, sem deformar ao arrastar as alcas; com "Livre" voce pode ajustar como quiser.',
          question: "Como corto com uma proporcao fixa?",
        },
        {
          answer:
            "JPEG nao suporta transparencia. Se a imagem original tiver fundo transparente, ao exportar para JPG ele sera preenchido automaticamente com fundo branco.",
          question:
            "O que acontece com fundos transparentes ao exportar para JPG?",
        },
      ],
      features: [
        "Arraste a area de selecao diretamente sobre a imagem para cortar qualquer regiao",
        "Proporcoes predefinidas comuns: 1:1, 4:3, 3:2, 16:9 e 9:16",
        "Mostra em tempo real as dimensoes em pixels da selecao na imagem original",
        "Exporte para PNG, JPG ou WebP com qualidade ajustavel",
        "Suporta fotos HEIC/HEIF do iPhone como entrada",
        "Processamento local, sem enviar a imagem original",
      ],
      keywords: [
        "cortar imagem online",
        "recortar foto",
        "image cropper",
        "crop image online",
        "corte livre",
        "cortar 16:9",
        "cortar 1:1",
        "cortar avatar",
        "ferramenta para cortar imagem",
      ],
      name: "Corte de imagens (selecao livre)",
      steps: [
        "Envie uma imagem PNG, JPG, WebP ou HEIC.",
        "Arraste a area de selecao sobre a imagem ou escolha uma proporcao predefinida.",
        "Escolha o formato de exportacao e ajuste a qualidade se precisar.",
        "Gere o resultado, visualize e baixe a imagem cortada.",
      ],
      summary:
        "Corte imagens arrastando uma area de selecao diretamente no navegador, com proporcoes predefinidas e exportacao para PNG/JPG/WebP.",
    },
    content: {
      faqDescription: "Algumas perguntas comuns antes de comecar.",
      faqTitle: "Perguntas frequentes",
      privacyDescription:
        "Vale conhecer estas observacoes antes de usar a ferramenta.",
      privacyItems: [
        "As imagens nunca sao enviadas a um servidor; todo o corte acontece no seu navegador.",
        "O tamanho exportado e exatamente o tamanho em pixels da selecao na imagem original, sem redimensionamento extra.",
        "JPEG nao suporta fundo transparente, entao na exportacao ele sera preenchido automaticamente com branco.",
      ],
      privacyTitle: "Observacoes de uso",
      stepsDescription: "Siga estes passos para concluir o corte.",
      stepsTitle: "Como usar",
      supportDescription:
        "PNG, JPG/JPEG, WebP e HEIC/HEIF podem ser importados; para exportar estao disponiveis PNG, JPG/JPEG e WebP (HEIC apenas como entrada).",
      supportTitle: "Formatos suportados",
    },
    client: {
      badges: {
        localProcessing: "Processamento no navegador",
        supportedFormats: "Suporta {formats}",
      },
      upload: {
        chooseImage: "Escolher imagem",
        clear: "Limpar",
        decoding: "Decodificando foto HEIC…",
        description:
          "Arraste uma imagem para a area abaixo ou clique no botao para escolher. Tudo e processado localmente e nunca e enviado ao servidor.",
        emptyDescription:
          "Suporta PNG, JPG/JPEG, WebP e HEIC (fotos do iPhone). Depois de enviar, arraste a area de selecao diretamente sobre a imagem para cortar.",
        emptyTitle: "Solte uma imagem para comecar a cortar",
        reselect: "Escolher outra",
        sourceLabel: "Original",
        title: "Enviar e cortar",
      },
      crop: {
        aspects: {
          fourThree: "4:3",
          free: "Livre",
          nineSixteen: "9:16",
          sixteenNine: "16:9",
          square: "1:1",
          threeTwo: "3:2",
        },
        aspectTitle: "Proporcao do corte",
        originalLabel: "Original {width} x {height} px",
        selectionLabel: "Selecao {width} x {height} px",
      },
      settings: {
        description:
          "Ajuste primeiro a area de selecao a esquerda e depois escolha o formato de exportacao. JPEG e WebP tambem permitem controlar a qualidade de compressao.",
        download: "Baixar imagem",
        generate: "Gerar resultado",
        pendingResult: "Ajuste a selecao e gere o resultado",
        quality: "Qualidade de saida",
        qualityAria: "Qualidade de saida",
        qualityDescription:
          "Maior qualidade normalmente significa arquivo maior. Comecar perto de 82 costuma ser uma boa escolha.",
        regenerate: "Gerar novamente",
        resultLabel: "Resultado",
        targetFormat: "Formato de exportacao",
        title: "Configuracoes de exportacao",
      },
      preview: {
        alt: "Previa de {label}",
        emptyDescription:
          "A imagem gerada aparecera aqui para que voce possa visualizar e baixar diretamente.",
      },
      errors: {
        blobFailed:
          "O navegador nao conseguiu gerar a imagem de saida. Tente novamente.",
        canvasUnsupported:
          "Este navegador nao suporta Canvas, entao o corte de imagem nao esta disponivel.",
        cropFailed: "O corte falhou. Tente novamente mais tarde.",
        imageBroken:
          "Nao foi possivel ler a imagem. Verifique se o arquivo nao esta corrompido.",
        invalidSelection:
          "Primeiro selecione uma area de corte valida sobre a imagem.",
        readFailed: "Falha ao ler a imagem. Tente outro arquivo.",
        unsupportedFormat:
          "Este formato ainda nao e suportado. Envie uma imagem {formats}.",
        unsupportedOutput:
          "Este navegador nao consegue exportar {format} agora.",
        uploadFirst: "Envie uma imagem primeiro.",
      },
    },
    formats: {
      jpg: {
        description:
          "Com perdas, ideal para fotos; fundos transparentes ficam brancos",
        label: "JPG",
      },
      png: {
        description:
          "Sem perdas, ideal para capturas de tela, icones e transparencia",
        label: "PNG",
      },
      webp: {
        description: "Maior compressao, ideal para imagens web",
        label: "WebP",
      },
    },
  },
  pdfTextEditor: {
    metadata: {
      description:
        "Edite o texto existente de um PDF online. Tudo acontece no seu navegador, o arquivo nao e enviado para nenhum servidor e voce pode baixar o resultado na hora.",
      keywords: [
        "editar PDF online",
        "editor de texto PDF",
        "modificar texto PDF",
        "editor PDF no navegador",
        "edit pdf online",
        "pdf text editor",
      ],
      title: "Editor de texto PDF online",
    },
    hero: {
      badges: {
        beta: "Beta",
        category: "Ferramenta de documentos",
        localProcessing: "Processamento no navegador",
      },
      description:
        "Envie um PDF, clique no texto da pagina para edita-lo e baixe o resultado. Tudo acontece no seu navegador, o arquivo nunca sai do seu dispositivo.",
      title: "Edite o texto existente de um PDF no seu navegador",
    },
    scenarios: {
      description:
        "Otimo para corrigir nomes, datas, enderecos e outros textos ja presentes no PDF.",
      edit: "Voce quer mudar pouco texto sem comprar um editor PDF de desktop.",
      fontReuse:
        "Voce quer manter a aparencia original do PDF e mudar a fonte o minimo possivel.",
      privacy:
        "Seu PDF tem informacoes sensiveis que voce nao quer enviar para servicos de terceiros.",
      title: "Bom para casos como estes",
    },
    tool: {
      category: "Ferramenta de documentos",
      description:
        "Edite o texto existente de um PDF online. Tudo e processado no navegador, sem upload do arquivo, e voce baixa o resultado apos editar.",
      faq: [
        {
          answer:
            "Nao. O PDF e analisado, editado e exportado totalmente no seu navegador. Nada e enviado ao servidor.",
          question: "Meu PDF sera enviado para algum servidor?",
        },
        {
          answer:
            "Reutilizamos a fonte embutida do PDF sempre que possivel. Se os novos caracteres nao estiverem na fonte original, usamos Noto Sans SC como reserva e voce ainda pode enviar sua propria fonte TTF/OTF.",
          question: "As fontes ficam quebradas depois de editar?",
        },
        {
          answer:
            "Ainda nao. PDFs escaneados nao tem camada de texto, a ferramenta detecta e pede um PDF de texto real.",
          question: "Posso editar PDFs escaneados (imagem)?",
        },
        {
          answer:
            "Ainda nao. A V1 so substitui texto existente. Adicionar caixas de texto novas, editar imagens e dividir paginas chegara em versoes futuras.",
          question: "Posso adicionar caixas de texto novas?",
        },
      ],
      features: [
        "Detecta texto existente com posicao, tamanho e fonte",
        "Clique em qualquer bloco para edita-lo no lugar",
        "Reutiliza fontes embutidas e recorre a Noto Sans SC para CJK",
        "Permite enviar sua fonte TTF/OTF como reserva",
        "Funciona totalmente no navegador sem upload",
      ],
      keywords: [
        "editar PDF online",
        "editor de texto PDF",
        "modificar texto PDF",
        "editor PDF no navegador",
        "edit pdf online",
        "pdf text editor",
      ],
      name: "Editor de texto PDF online",
      steps: [
        "Envie um PDF com camada de texto real.",
        "Clique em qualquer texto na previa para entrar no modo edicao.",
        "Se for detectado CJK, aguarde a fonte de reserva Noto Sans SC carregar.",
        "Revise as mudancas e baixe o PDF editado.",
      ],
      summary:
        "Substitua texto dentro de um PDF no navegador mantendo a aparencia da fonte original.",
    },
    content: {
      faqDescription: "Algumas perguntas comuns antes de comecar.",
      faqTitle: "Perguntas frequentes",
      limitsDescription: "A V1 deixa de fora os seguintes cenarios.",
      limitsItems: [
        "PDFs escaneados (imagem) sem camada de texto sao detectados e ignorados.",
        "Adicionar caixas de texto, editar imagens, reordenar ou excluir paginas virao em versoes futuras.",
        "PDFs protegidos por senha ainda nao podem ser desbloqueados.",
        "Texto colorido e exportado em preto por enquanto; selecao manual de cor esta planejada.",
      ],
      limitsTitle: "Limitacoes conhecidas",
      stepsDescription: "Siga estes passos para editar o seu PDF.",
      stepsTitle: "Como usar",
      supportDescription:
        "A ferramenta detecta a camada de texto editavel e permite alterar no lugar.",
      supportTitle: "O que a ferramenta faz",
    },
    client: {
      badges: {
        beta: "Beta",
        localProcessing: "Processamento no navegador",
        scannedDetected: "PDF escaneado detectado",
        supportedFormats: "Compativel com PDF",
      },
      upload: {
        choosePdf: "Escolher PDF",
        clear: "Limpar",
        description:
          "Arraste um PDF para a area abaixo ou clique no botao para escolher. O arquivo nao sai do navegador.",
        emptyDescription:
          "Compativel com PDFs com camada de texto real. Teste primeiro com um arquivo pequeno.",
        emptyTitle: "Solte um PDF para comecar",
        maxSizeHint: "Tamanho maximo {size}.",
        pageCountLabel: "{count} paginas",
        reselect: "Escolher outro",
        title: "Enviar PDF",
      },
      scanned: {
        description:
          "Este PDF nao tem camada de texto editavel (provavelmente e um escaneio ou imagem). Faca OCR primeiro ou use um PDF de texto.",
        title: "PDFs escaneados ainda nao sao suportados",
      },
      viewer: {
        nextPage: "Proxima pagina",
        pageOf: "Pagina {current} / {total}",
        prevPage: "Pagina anterior",
        zoomIn: "Mais zoom",
        zoomOut: "Menos zoom",
      },
      editor: {
        activeBlockTitle: "Bloco de texto ativo",
        clickToEditHint:
          "Clique no texto para editar. Pressione Esc ou Enter para sair.",
        description: "Blocos editados ganham fundo amarelo.",
        editedCount: "{count} blocos editados",
        escToExit: "Pressione Esc ou clique fora para sair do modo edicao.",
        overflowWarning:
          "O texto excede a area original. A fonte sera reduzida ao exportar.",
        resetBlock: "Descartar esta edicao",
        title: "Editar texto",
      },
      fonts: {
        acceptedFontTypes: "Arquivos de fonte TTF ou OTF suportados.",
        cjkFailed:
          "Nao foi possivel carregar Noto Sans SC. Verifique sua rede ou envie uma fonte.",
        cjkIdle: "Fonte de reserva ainda nao carregada",
        cjkLoading: "Carregando Noto Sans SC",
        cjkReady: "Noto Sans SC pronta",
        description:
          "Preferimos a fonte embutida; carregamos Noto Sans SC para CJK; recorremos a sua fonte enviada quando faltar caractere.",
        removeUserFont: "Remover",
        title: "Estrategia de fontes",
        uploadFontButton: "Enviar fonte",
        userFontLoaded: "Fonte carregada: {name}",
      },
      export: {
        button: "Baixar PDF",
        buttonEdited: "Baixar PDF editado",
        cleanHint:
          "Sem edicoes ainda. O download retornara o arquivo original.",
        description:
          "Quando estiver tudo certo, clique no botao para baixar o PDF editado.",
        editedHint: "Sera exportado o PDF com {count} edicoes.",
        exporting: "Exportando",
        missingGlyphChars: "Caracteres ausentes: {chars}",
        title: "Baixar",
      },
      errors: {
        cjkFontLoadFailed:
          "Nao foi possivel baixar Noto Sans SC. Verifique sua rede ou envie uma fonte.",
        encryptedNotSupported: "PDFs com senha ainda nao sao suportados.",
        exportFailed: "A exportacao falhou. Tente novamente mais tarde.",
        fileTooLarge: "Arquivo muito grande. Maximo {size}.",
        fontEmbedFailed:
          "Nao foi possivel incorporar a fonte. Usamos a fonte de reserva.",
        fontMissingGlyph:
          "Algumas edicoes tinham caracteres que a fonte original nao suporta. Foi usada a fonte de reserva ou a mudanca foi mantida.",
        loadFailed:
          "Nao foi possivel analisar o PDF. Verifique se o arquivo nao esta corrompido.",
        loadFailedDetail: "Nao foi possivel analisar o PDF: {detail}",
        scannedNotSupported: "PDFs escaneados ainda nao sao suportados.",
        unsupportedFont:
          "Arquivo de fonte invalido. Apenas TTF ou OTF sao aceitos.",
        unsupportedFormat: "Tipo de arquivo nao suportado. Envie um PDF.",
        workerFailed:
          "O PDF Worker nao iniciou. Atualize a pagina e tente novamente.",
      },
    },
  },
  ogImageValidator: {
    metadata: {
      description:
        "Informe uma URL para buscar e validar as tags Open Graph e Twitter Card, previa os cards de compartilhamento no Facebook, X, LinkedIn, Discord e Slack, e verifique as dimensoes, proporcao e tamanho do og:image. Voce tambem pode enviar uma imagem para validar diretamente.",
      keywords: [
        "validador og image",
        "open graph debugger",
        "twitter card validator",
        "previa de compartilhamento social",
        "og:image tamanho",
        "validador opengraph",
        "verificador og image",
      ],
      title:
        "Validador de OG Image / Depurador de previa de compartilhamento social",
    },
    hero: {
      badges: {
        category: "Ferramenta SEO",
        platforms: "Previa em 5 plataformas",
        realtime: "Verificacao ao vivo",
      },
      description:
        "Informe uma URL para buscar e analisar as tags Open Graph / Twitter Card, previa como ela aparece ao ser compartilhada no Facebook, X, LinkedIn, Discord e Slack, e valide as dimensoes, proporcao, tamanho e formato do og:image. Voce tambem pode enviar uma imagem para valida-la separadamente.",
      title: "Validador de OG Image e previa de compartilhamento social",
    },
    scenarios: {
      description:
        "Ideal para verificar a aparencia antes de publicar, nao para monitoramento em massa.",
      debug:
        "Seu link compartilhado nao mostra imagem ou titulo nas redes sociais e voce quer depurar as tags OG.",
      optimize:
        "Voce quer confirmar que as dimensoes, proporcao e tamanho do og:image atendem aos requisitos de cada plataforma para melhorar o CTR.",
      preview:
        "Antes de publicar um artigo ou landing page, voce quer ver como ele ficara ao ser compartilhado em cada plataforma.",
      title: "Bom para estes casos",
    },
    tool: {
      category: "Ferramenta SEO",
      description:
        "Busque as tags Open Graph e Twitter Card de qualquer URL online, previa os cards de compartilhamento para Facebook, X, LinkedIn, Discord e Slack, e valide as dimensoes, proporcao, tamanho e formato do og:image. Voce tambem pode enviar uma imagem para validacao offline.",
      faq: [
        {
          answer:
            "O modo URL busca a pagina no servidor para analisar as tags (o navegador nao pode buscar paginas de outras origens); apenas le o conteudo publico e nao armazena nada. O modo de envio roda totalmente no seu navegador e nunca faz upload da imagem.",
          question: "Como meus dados sao tratados ao validar uma URL?",
        },
        {
          answer:
            "Alguns sites retornam conteudo simplificado para requisicoes nao-navegador ou injetam tags OG via JavaScript; essas paginas podem nao expor todas as tags, o que e esperado.",
          question: "Por que alguns sites nao podem ser analisados?",
        },
        {
          answer:
            "1200×630 pixels com proporcao aproximada de 1.91:1 e a recomendacao mais comum. Abaixo de 600×315 algumas plataformas mostram um card pequeno, e abaixo de 200×200 a imagem geralmente nao e exibida.",
          question: "Qual o tamanho recomendado para og:image?",
        },
        {
          answer:
            "Aproximadamente 8MB para Facebook / Discord e 5MB para X / LinkedIn / Slack. Consulte sempre a documentacao oficial de cada plataforma; esta ferramenta sinaliza problemas com base nesses limites.",
          question:
            "Quais sao os limites de tamanho de arquivo por plataforma?",
        },
      ],
      features: [
        "Busque as tags Open Graph e Twitter Card de qualquer URL",
        "Previa os cards de compartilhamento para Facebook, X, LinkedIn, Discord e Slack",
        "Valide as dimensoes, proporcao (1.91:1), tamanho e formato do og:image",
        "Diagnostico de aprovacao / aviso / falha por plataforma",
        "Envie uma imagem para validar dimensoes e proporcao offline",
        "Resolve fallbacks de twitter:image→og:image e og:title→title",
      ],
      keywords: [
        "validador og image",
        "open graph debugger",
        "twitter card validator",
        "previa de compartilhamento social",
        "og:image tamanho",
        "previa de card de compartilhamento",
        "validador opengraph",
        "verificador og image",
      ],
      name: "Validador de OG Image — Depurador de previa de compartilhamento social",
      steps: [
        'Mude para "Via URL" e cole a URL da pagina que deseja verificar.',
        "Clique em Verificar e aguarde enquanto buscamos e analisamos as tags OG / Twitter da pagina.",
        "Revise as previas dos cards de compartilhamento por plataforma e o relatorio de dimensoes, proporcao, tamanho e tags.",
        'Ou mude para "Enviar imagem" para validar uma unica imagem conforme as especificacoes de cada plataforma.',
      ],
      summary:
        "Busque as tags Open Graph / Twitter de uma URL, previa cards de compartilhamento multiplas plataformas e valide a imagem.",
    },
    content: {
      faqDescription: "Algumas perguntas comuns antes de comecar.",
      faqTitle: "Perguntas frequentes",
      privacyDescription: "Algumas observacoes antes de usar.",
      privacyItems: [
        "O modo URL precisa que o servidor busque a pagina por voce (para contornar os limites de origem cruzada do navegador); le apenas conteudo publico e nao armazena nada.",
        "Enderecos privados, loopback e de rede interna sao bloqueados pela politica de seguranca e nao podem ser buscados.",
        "O modo de envio valida totalmente no seu navegador; a imagem nunca sai do seu dispositivo.",
      ],
      privacyTitle: "Observacoes",
      stepsDescription: "Siga os passos abaixo para executar uma verificacao.",
      stepsTitle: "Como usar",
      supportDescription:
        "Valida tags Open Graph, Twitter Card e SEO basico, cobrindo os cards de compartilhamento do Facebook, X, LinkedIn, Discord e Slack.",
      supportTitle: "O que e verificado",
    },
    client: {
      modes: {
        upload: "Enviar imagem",
        url: "Via URL",
      },
      url: {
        emptyDescription:
          "Cole uma URL de pagina publica e buscaremos as tags OG / Twitter e mostraremos a previa dos cards de compartilhamento para cada plataforma.",
        emptyTitle: "Informe uma URL para comecar",
        fetching: "Buscando e analisando a pagina…",
        hint: "Informe a URL completa (incluindo https://) cuja aparencia de compartilhamento voce quer verificar.",
        label: "URL da pagina",
        placeholder: "https://example.com/article",
        resubmit: "Verificar novamente",
        submit: "Verificar",
      },
      upload: {
        choose: "Escolher imagem",
        clear: "Limpar",
        decoding: "Lendo imagem…",
        description:
          "Arraste uma imagem para a area abaixo ou clique para escolher. Valida apenas dimensoes, proporcao, tamanho e formato localmente — nada e enviado.",
        dropHint: "Solte para carregar a imagem",
        emptyDescription:
          "Suporta PNG, JPG, WebP e GIF. Valida dimensoes, proporcao e tamanho conforme as especificacoes OG de cada plataforma.",
        emptyTitle: "Solte uma imagem para validar",
        reselect: "Escolher outra",
        title: "Enviar imagem",
      },
      result: {
        dimensionsUnknown: "Dimensoes desconhecidas",
        generalTitle: "Verificacoes gerais",
        noImage: "Nenhum og:image encontrado",
        overallFail: "Problemas encontrados",
        overallPass: "Tudo certo",
        overallWarn: "Ha margem para melhorar",
        platformsTitle: "Diagnostico por plataforma",
        previewTitle: "Previas dos cards de compartilhamento",
        sizeUnknown: "Tamanho desconhecido",
        sourceLabel: "Origem da imagem",
        tagsTitle: "Tags analisadas",
      },
      status: {
        fail: "Falhou",
        pass: "Passou",
        warn: "Aviso",
      },
      platforms: {
        discord: "Discord",
        facebook: "Facebook",
        linkedin: "LinkedIn",
        slack: "Slack",
        twitter: "X (Twitter)",
      },
      checks: {
        "image-dimensions": "Dimensoes da imagem",
        "image-ratio": "Proporcao de aspecto",
        "platform-filesize": "Tamanho do arquivo",
        "platform-format": "Formato da imagem",
        "platform-min-size": "Tamanho minimo",
        "platform-required-tags": "Tags obrigatorias",
        "tag-description": "Descricao (description)",
        "tag-image-alt": "Texto alternativo da imagem (og:image:alt)",
        "tag-og-image": "Imagem (og:image)",
        "tag-og-url": "URL canonica (og:url)",
        "tag-title": "Titulo (og:title / title)",
        "tag-twitter-card": "Tipo de card (twitter:card)",
      },
      details: {
        "image-dimensions":
          "{width}×{height} px (recomendado {idealWidth}×{idealHeight})",
        "image-ratio": "{ratio} : 1 (recomendado {idealRatio} : 1)",
        missing: "Ausente",
        "platform-filesize": "{size} / limite {max}",
        "platform-format": "{format}",
        "platform-min-size":
          "{width}×{height} px (minimo {minWidth}×{minHeight})",
        present: "Definido",
        requiredTagsMissing: "Ausente {missing}",
        unknown: "Nao foi possivel ler",
      },
      errors: {
        BLOCKED_HOST:
          "Este endereco e bloqueado pela politica de seguranca (enderecos privados / locais / internos nao podem ser buscados).",
        FETCH_FAILED:
          "Nao foi possivel conectar ao site de destino. Verifique se a URL esta acessivel.",
        FETCH_TIMEOUT:
          "A busca expirou — o site de destino respondeu muito devagar. Tente novamente mais tarde.",
        INVALID_URL: "URL invalida. Informe uma URL http(s) completa.",
        NOT_HTML:
          "Esta URL nao retornou uma pagina web, entao as tags nao podem ser analisadas.",
        TOO_MANY_REDIRECTS:
          "Redirecionamentos demais — nao foi possivel buscar esta URL.",
        UPSTREAM_ERROR:
          "O site de destino retornou um erro; a pagina pode nao existir ou estar temporariamente indisponivel.",
        UNKNOWN: "A validacao falhou. Tente novamente mais tarde.",
      },
    },
  },
  jsonViewer: {
    metadata: {
      description:
        "Cole JSON online e formate como uma arvore recolhivel com cores por tipo. Pesquise e filtre, e expanda strings JSON aninhadas. Tudo roda localmente no seu navegador — otimo para inspecionar requisicoes e respostas HTTP.",
      keywords: [
        "formatar JSON",
        "visualizador JSON",
        "json viewer",
        "json formatter",
        "arvore json",
        "ferramenta json online",
      ],
      title: "Formatador e visualizador de arvore JSON",
    },
    hero: {
      badges: {
        category: "Ferramentas para desenvolvedores",
        localProcessing: "Roda no seu navegador",
        nested: "Suporte a JSON aninhado",
      },
      description:
        "Cole JSON e formate na hora como uma arvore expansivel e recolhivel. Cores por tipo, pesquisa e filtro, e analise de strings JSON aninhadas — feito para inspecionar requisicoes e respostas HTTP, com dados que nunca saem do seu navegador.",
      title: "Formatador e visualizador de arvore JSON",
    },
    scenarios: {
      description:
        "Ideal para ver e depurar JSON rapidamente, nao para editar dados em grande escala.",
      local:
        "Voce se importa com privacidade e nao quer colar dados de API em um site de terceiros.",
      nested:
        "Ha uma string JSON com escape aninhada dentro de um corpo HTTP e voce quer expandi-la.",
      search:
        "Voce trabalha com uma resposta grande e quer pesquisar um campo ou valor e ir ate ele.",
      title: "Util quando voce precisa",
    },
    tool: {
      category: "Ferramentas para desenvolvedores",
      description:
        "Cole JSON online e formate como uma arvore recolhivel com cores por tipo. Pesquise e filtre, e expanda strings JSON aninhadas. Tudo roda localmente no seu navegador — otimo para inspecionar requisicoes e respostas HTTP.",
      faq: [
        {
          answer:
            "Nao. A analise, a formatacao e a pesquisa acontecem localmente no seu navegador; seus dados nunca sao enviados a um servidor.",
          question: "Meu JSON e enviado para um servidor?",
        },
        {
          answer:
            "Ele mostra por que a analise falhou e indica a linha e a coluna exatas para voce corrigir rapidamente.",
          question: "O que acontece se meu JSON for invalido?",
        },
        {
          answer:
            "Respostas HTTP costumam guardar um trecho de JSON como string dentro de um campo. Quando essa string e detectada, voce pode clicar em um botao para expandi-la em uma subarvore.",
          question: "O que significa “analisar strings JSON aninhadas”?",
        },
      ],
      features: [
        "Formata ao colar e mostra uma arvore expansivel e recolhivel",
        "Colore os valores por tipo: string / number / boolean / null",
        "Pesquisa chaves e valores, destaca correspondencias e expande automaticamente, com modo somente correspondencias",
        "Expande ou recolhe todos os nos de uma vez e copia o JSON formatado",
        "Detecta e expande strings JSON aninhadas dentro dos campos",
      ],
      keywords: [
        "formatar JSON",
        "visualizador JSON",
        "json viewer",
        "json formatter",
        "arvore json",
        "ferramenta json online",
      ],
      name: "Formatador e visualizador de arvore JSON",
      steps: [
        "Cole ou digite JSON na caixa a esquerda.",
        "A direita, ele e formatado na hora como uma arvore recolhivel e colorida por tipo.",
        "Use a caixa de pesquisa para localizar um campo ou valor e ative “Somente correspondencias” se precisar.",
        "Para strings JSON aninhadas, clique no botao do no para expandi-las; copie o resultado formatado quando precisar.",
      ],
      summary:
        "Formata JSON como uma arvore recolhivel localmente no seu navegador, com pesquisa e expansao de JSON aninhado.",
    },
    content: {
      faqDescription: "Algumas perguntas comuns antes de comecar.",
      faqTitle: "Perguntas frequentes",
      privacyDescription: "Bom saber antes de usar.",
      privacyItems: [
        "Nada e enviado — a analise e a pesquisa rodam inteiramente no seu navegador.",
        "Ha suporte a JSON padrao; comentarios, virgulas finais e outra sintaxe nao padrao falharao na analise.",
        "Expandir por completo um JSON muito grande pode ficar lento — recolha primeiro ou use a pesquisa para navegar.",
      ],
      privacyTitle: "Observacoes",
      stepsDescription: "Siga estes passos para ver seu JSON.",
      stepsTitle: "Como usar",
      supportDescription:
        "Recursos praticos pensados para inspecionar requisicoes e respostas HTTP.",
      supportTitle: "Recursos principais",
    },
    client: {
      empty: {
        description:
          "Cole JSON a esquerda e a arvore formatada e recolhivel aparecera aqui.",
        title: "Cole JSON para comecar",
      },
      error: {
        location: "Linha {line}, coluna {column}",
        title: "Nao foi possivel analisar o JSON",
      },
      input: {
        clear: "Limpar",
        placeholder:
          "Cole JSON aqui, por exemplo o corpo de uma requisicao ou resposta HTTP…",
        title: "Entrada JSON",
      },
      status: {
        characters: "{count} caracteres",
        invalid: "JSON invalido",
        valid: "JSON valido",
      },
      toolbar: {
        collapseAll: "Recolher tudo",
        copied: "Copiado",
        copy: "Copiar",
        expandAll: "Expandir tudo",
        onlyMatches: "Somente correspondencias",
        searchPlaceholder: "Pesquisar chaves ou valores…",
      },
      tree: {
        parseNested: "Analisar como JSON",
      },
    },
  },
  markdownToPdf: {
    metadata: {
      description:
        "Converta Markdown gerado por IA em PDF formatado, legivel em celular e computador. Suporta titulos, listas, tabelas e blocos de codigo. Todo o processamento ocorre localmente no seu navegador.",
      keywords: [
        "markdown para pdf",
        "markdown to pdf",
        "saida IA para PDF",
        "formatar markdown",
        "PDF para celular",
      ],
      title: "Markdown para PDF",
    },
    hero: {
      badges: {
        category: "Ferramentas de documentos",
        localProcessing: "Processamento local no navegador",
        mobileFriendly: "Compativel com celular",
      },
      description:
        "Cole seu Markdown de IA, veja uma previa formatada em tempo real e exporte para PDF via impressao do navegador. A largura padrao para celular permite que amigos leiam no telefone sem dar zoom.",
      title: "Markdown para PDF",
    },
    scenarios: {
      description:
        "Otimo para converter texto de IA em documentos formatados e compartilhaveis.",
      ai: "Recebeu uma resposta em Markdown de IA e quer enviar um documento formatado para amigos que nao conhecem Markdown.",
      share:
        "Amigos nao conseguem exibir Markdown no celular e precisam de um PDF com formatacao visivel.",
      privacy:
        "O conteudo e sensivel e voce nao quer fazer upload para um servidor de terceiros.",
      title: "Ideal para",
    },
    tool: {
      category: "Ferramentas de documentos",
      description:
        "Converta Markdown do ChatGPT, Claude ou outras IAs em PDF formatado, gratis e online. Legivel no celular sem dar zoom. Suporta titulos, listas, tabelas e codigo. Processamento local no navegador, sem upload.",
      faq: [
        {
          answer:
            "Nao. O Markdown e renderizado para HTML localmente no seu navegador e nunca e enviado a um servidor.",
          question: "Meu conteudo sera enviado para um servidor?",
        },
        {
          answer:
            "Clique em 'Baixar PDF' para abrir uma nova aba. A caixa de dialogo de impressao do navegador aparece automaticamente; escolha 'Salvar como PDF' para exportar.",
          question: "Como exportar para PDF?",
        },
        {
          answer:
            "A largura padrao 'Compativel com celular' e de ~105mm, proxima a largura portrait do telefone, para que o PDF preencha a tela sem zoom. Voce pode mudar para A5 ou A4.",
          question: "Por que definir uma largura de pagina?",
        },
        {
          answer:
            "Uma mensagem de pop-up bloqueado aparecera. Clique no icone de pop-up na barra de endereco do navegador para permitir pop-ups deste site e tente novamente.",
          question: "Nada acontece quando clico em 'Baixar PDF'. O que fazer?",
        },
        {
          answer:
            "Sim. Cole texto do ChatGPT, Claude, Gemini ou qualquer ferramenta de IA diretamente. O conversor suporta Markdown GFM padrao que quase todos os assistentes de IA produzem.",
          question:
            "Posso usar saida do ChatGPT, Claude ou outras ferramentas de IA?",
        },
      ],
      features: [
        "Suporta titulos (H1-H6), paragrafos, negrito, italico e links",
        "Suporta listas ordenadas, nao ordenadas e de tarefas",
        "Suporta tabelas GFM",
        "Suporta blocos de codigo delimitados (```) com quebra de linha automatica",
        "Suporta citacoes",
        "Tres larguras de pagina: Compativel com celular / A5 / A4",
        "Processamento local no navegador — o conteudo nunca sai do seu dispositivo",
        "Projetado para saida do ChatGPT, Claude e outros assistentes de IA",
      ],
      keywords: [
        "markdown para pdf",
        "markdown to pdf",
        "ChatGPT para PDF",
        "Claude para PDF",
        "saida IA para PDF",
        "converter markdown para pdf gratis",
        "converter markdown para pdf online",
        "PDF para celular",
        "ferramenta de documentos online",
      ],
      name: "Markdown para PDF",
      steps: [
        "Cole seu Markdown no painel esquerdo — uma previa em tempo real aparece a direita.",
        "Escolha uma largura de pagina: 'Compativel com celular' para compartilhar no celular, 'A5' para uso geral.",
        "Clique em 'Baixar PDF' e escolha 'Salvar como PDF' na caixa de dialogo de impressao do navegador.",
      ],
      summary:
        "Renderize Markdown no navegador e exporte como PDF compativel com celular via impressao do navegador.",
    },
    content: {
      faqDescription: "Perguntas comuns antes de comecar.",
      faqTitle: "Perguntas frequentes",
      privacyDescription: "Leia estas notas antes de usar a ferramenta.",
      privacyItems: [
        "O Markdown e renderizado localmente no seu navegador e nunca e carregado para um servidor.",
        "Clique em 'Baixar PDF' para abrir uma nova aba, depois escolha 'Salvar como PDF' na caixa de dialogo de impressao.",
        "Se pop-ups estiverem bloqueados, permita pop-ups deste site na barra de endereco do navegador e tente novamente.",
        "A largura padrao 'Compativel com celular' produz um PDF que preenche a tela do celular sem zoom.",
      ],
      privacyTitle: "Notas",
      stepsDescription: "Siga estes passos para exportar seu PDF.",
      stepsTitle: "Como usar",
      supportDescription: "Baseado em GFM (GitHub Flavored Markdown).",
      supportTitle: "Formatos suportados",
    },
    client: {
      empty: {
        description:
          "Insira Markdown a esquerda para ver uma previa formatada em tempo real aqui.",
        title: "Cole Markdown para visualizar",
      },
      input: {
        clear: "Limpar",
        placeholder:
          "Cole aqui o Markdown gerado por IA, ou escreva o seu…\n\n# Titulo\n\n**Negrito** e *italico*\n\n- Item de lista 1\n- Item de lista 2\n\n```\nbloco de codigo\n```",
        title: "Entrada Markdown",
      },
      preview: {
        title: "Visualizacao",
      },
      toolbar: {
        estimatedPages: "~{count} pagina(s)",
        pageWidth: "Largura da pagina",
        pageWidthOptions: {
          a4: "Padrao (A4 210mm)",
          a5: "Universal (A5 148mm)",
          phone: "Compativel com celular (105mm)",
        },
        popupBlockedWarning:
          "Pop-up bloqueado. Clique no icone de pop-up na barra de endereco do navegador para permitir pop-ups deste site e tente novamente.",
        print: "Baixar PDF",
        wordCount: "{count} caracteres",
      },
    },
  },
  sitemapValidator: {
    hero: {
      badges: {
        category: "Ferramenta SEO",
        instant: "Resultado em uma unica busca",
        protocol: "Verificacao de conformidade com o protocolo",
      },
      description:
        "Informe a URL de um sitemap.xml e nos vamos buscar e validar de acordo com o protocolo sitemaps.org: se o elemento raiz e valido, se cada URL tem um <loc> valido, e se lastmod, priority e changefreq estao no formato correto, alem de avisar se o numero de entradas ou o tamanho do arquivo ultrapassam os limites do protocolo.",
      title: "Validador de Sitemap",
    },
    scenarios: {
      description:
        "Ideal para uma verificacao rapida de conformidade do sitemap; nao verifica se cada link listado esta acessivel.",
      audit:
        "Fazer uma checagem periodica de um sitemap em producao apos redesenhos ou migracoes.",
      launch:
        "Antes de lancar um site novo ou um redesenho, confirmar que o sitemap.xml em si esta bem formado.",
      seo: "Antes de enviar um sitemap para os motores de busca, encontrar entradas que seriam rejeitadas ou ignoradas.",
      title: "Util nestas situacoes",
    },
    tool: {
      category: "Ferramenta SEO",
      description:
        "Busca um sitemap.xml online e valida sua estrutura de acordo com o protocolo sitemaps.org: tipo do elemento raiz, se cada <loc> e valido, se lastmod/priority/changefreq seguem a especificacao, alem de URLs duplicadas e limites de numero de entradas e tamanho de arquivo. Suporta arquivos de indice de sitemap.",
      faq: [
        {
          answer:
            "O servidor busca essa URL em seu nome para analisa-la (o navegador nao consegue ler conteudo de outra origem), le uma unica vez e nao armazena. Enderecos privados, de loopback ou internos sao bloqueados pela politica de seguranca.",
          question:
            "O que acontece com o conteudo do meu sitemap durante a validacao?",
        },
        {
          answer:
            "Mostramos o resultado da validacao do proprio arquivo de indice e se o <loc> de cada sitemap filho e valido. Para evitar buscas ilimitadas, ainda nao validamos recursivamente as entradas dentro dos sitemaps filhos.",
          question:
            "Como os arquivos de indice de sitemap (sitemapindex) sao validados?",
        },
        {
          answer:
            "Esta ferramenta verifica apenas estrutura e conformidade com o protocolo; nao visita as paginas listadas no sitemap, entao nao detecta links quebrados.",
          question: "Ela verifica se os links listados realmente funcionam?",
        },
        {
          answer:
            "Pelo protocolo sitemaps.org, um sitemap admite no maximo 50.000 URLs e nao deve ultrapassar 50MB sem compressao; ultrapassar qualquer um dos limites e marcado como erro.",
          question:
            "Existe limite de numero de entradas ou tamanho de arquivo?",
        },
      ],
      features: [
        "Busca qualquer URL de sitemap.xml e analisa sua estrutura",
        "Detecta um sitemap comum (urlset) versus um indice de sitemap (sitemapindex)",
        "Valida se cada <loc> e uma URL absoluta valida",
        "Valida lastmod, priority e changefreq de acordo com o formato do protocolo",
        "Detecta URLs duplicadas e avisa quando os limites de entradas ou tamanho sao ultrapassados",
        "Entradas com problema sao mostradas como uma amostra limitada para nao travar a pagina em sitemaps enormes",
      ],
      keywords: [
        "validador de sitemap",
        "sitemap validator",
        "verificar sitemap.xml",
        "conformidade de sitemap",
        "indice de sitemap",
        "sitemapindex",
        "ferramenta seo sitemap",
        "checar sitemap antes de enviar",
      ],
      name: "Validador de Sitemap",
      steps: [
        "Cole a URL completa do sitemap.xml que voce quer verificar.",
        "Clique em Validar e aguarde o servidor buscar e analisar o arquivo.",
        "Revise as verificacoes gerais: tipo do elemento raiz, numero de entradas, tamanho, URLs duplicadas e mais.",
        "Para cada entrada com problema, veja se falta o <loc> ou se algum campo tem formato invalido.",
      ],
      summary:
        "Busca o sitemap.xml e valida sua estrutura, campos das entradas e limites de tamanho de acordo com o protocolo.",
    },
    content: {
      faqDescription: "Algumas perguntas comuns antes de comecar.",
      faqTitle: "Perguntas frequentes",
      privacyDescription:
        "Algumas limitacoes e observacoes importantes antes de usar a ferramenta.",
      privacyItems: [
        "A validacao exige que o servidor busque o sitemap alvo em seu nome (para contornar as restricoes de origem cruzada do navegador); a leitura e feita uma unica vez e nunca e armazenada.",
        "Enderecos privados, de loopback ou internos sao bloqueados pela politica de seguranca e nao podem ser buscados.",
        "Verifica apenas estrutura e conformidade com o protocolo; nao visita as paginas do sitemap, entao nao detecta links quebrados.",
      ],
      privacyTitle: "Observacoes",
      stepsDescription: "Siga estes passos para validar um sitemap.",
      stepsTitle: "Como funciona",
      supportDescription:
        "Cobre as regras principais do protocolo sitemaps.org: estrutura raiz, formato dos campos de URL, limites de entradas e tamanho.",
      supportTitle: "O que e verificado",
    },
    client: {
      url: {
        emptyDescription:
          "Cole a URL de um sitemap.xml de acesso publico e vamos buscar e validar sua estrutura de acordo com o protocolo.",
        emptyTitle: "Informe uma URL para comecar a validar",
        hint: "Informe a URL completa do sitemap.xml (incluindo https://).",
        label: "URL do sitemap",
        placeholder: "https://example.com/sitemap.xml",
        resubmit: "Validar novamente",
        submit: "Validar",
      },
      result: {
        entryCount: "{count} URL(s) encontradas",
        generalTitle: "Verificacoes gerais",
        issuesTitle: "Problemas por entrada",
        noIssues: "Nenhum problema encontrado no nivel das entradas.",
        overallFail: "Problemas encontrados",
        overallPass: "Todas as verificacoes passaram",
        overallWarn: "Algumas melhorias sugeridas",
        rootTypeSitemapindex: "Indice de sitemap (sitemapindex)",
        rootTypeUnknown: "Elemento raiz nao reconhecido",
        rootTypeUrlset: "Sitemap comum (urlset)",
        showingSample:
          "Mostrando as primeiras {shown} de {total} entradas com problema",
      },
      status: {
        fail: "Falhou",
        pass: "Passou",
        warn: "Sugestao",
      },
      checks: {
        "byte-size-limit": "Limite de tamanho de arquivo (50MB)",
        "changefreq-invalid": "Valor de <changefreq> invalido",
        "content-truncated": "Conteudo foi truncado",
        "duplicate-locs": "URLs duplicadas",
        "entry-count-limit": "Limite de entradas (50.000)",
        "entry-count-zero": "Existe ao menos uma entrada valida",
        "gzip-unsupported": "Sitemap comprimido com Gzip",
        "lastmod-invalid": "Formato de <lastmod> invalido",
        "loc-invalid": "<loc> nao e uma URL valida",
        "loc-missing": "Falta <loc>",
        "priority-invalid": "<priority> fora do intervalo 0.0-1.0",
        "root-element": "Elemento raiz e valido",
      },
      details: {
        "byte-size-limit": "{bytes} / limite {maxBytes}",
        "changefreq-invalid": "Valor: {changefreq}",
        "content-truncated":
          "Foram lidos {bytes}; o conteudo pode estar incompleto",
        "duplicate-locs": "Encontrada(s) {count} duplicata(s)",
        "entry-count-limit": "{count} entradas / limite {maxEntries}",
        "lastmod-invalid": "Valor: {lastmod}",
        "loc-invalid": "Valor: {loc}",
        "priority-invalid": "Valor: {priority}",
      },
      errors: {
        BLOCKED_HOST:
          "Esse endereco foi bloqueado pela politica de seguranca (enderecos privados, locais ou internos nao podem ser buscados).",
        FETCH_FAILED:
          "Nao foi possivel conectar ao site de destino. Verifique se a URL esta acessivel.",
        FETCH_TIMEOUT:
          "A busca expirou porque o site de destino demorou demais para responder. Tente novamente mais tarde.",
        INVALID_URL: "URL invalida. Informe uma URL http(s) completa.",
        TOO_MANY_REDIRECTS:
          "Redirecionamentos demais; nao foi possivel buscar essa URL.",
        UNKNOWN: "A validacao falhou. Tente novamente mais tarde.",
        UPSTREAM_ERROR:
          "O site de destino retornou um erro; o arquivo pode nao existir ou estar temporariamente indisponivel.",
      },
    },
  },
  htmlToMarkdown: {
    metadata: {
      description:
        "Cole conteudo copiado de uma pagina web, ou codigo HTML, e converta em Markdown limpo com um clique. Mantem titulos, negrito, links, listas, tabelas e blocos de codigo — tudo roda localmente no seu navegador, nada e enviado.",
      keywords: [
        "html para markdown",
        "pagina web para markdown",
        "colar para markdown",
        "html to markdown",
        "conversor html para markdown online",
      ],
      title: "Pagina web para Markdown",
    },
    hero: {
      badges: {
        category: "Ferramenta de conteudo",
        localProcessing: "Roda no seu navegador",
        pasteReady: "Cole e converta",
      },
      description:
        "Selecione e copie conteudo de qualquer pagina web, depois cole aqui — ou cole o codigo HTML diretamente. A conversao para Markdown limpo acontece na hora, mantendo titulos, negrito, italico, links, listas, tabelas e blocos de codigo. Tudo roda localmente no seu navegador; nada e enviado.",
      title: "Pagina web para Markdown",
    },
    scenarios: {
      description:
        "Otimo para transformar conteudo de paginas web em notas ou documentos Markdown, nao para reproduzir layouts complexos.",
      dev: "Voce precisa converter rapidamente um trecho de HTML para Markdown durante o desenvolvimento.",
      migrate:
        "Voce esta migrando conteudo HTML de um site antigo ou CMS para documentos Markdown.",
      notes:
        "Voce encontrou um bom artigo e quer guardar os pontos principais como notas em Markdown.",
      title: "Otimo para",
    },
    tool: {
      category: "Ferramenta de conteudo",
      description:
        "Converta conteudo de paginas web ou codigo HTML em Markdown online: suporta titulos, negrito, italico, tachado, links, imagens, listas ordenadas/nao ordenadas, citacoes, tabelas e blocos de codigo. Ao colar conteudo rico, a estrutura HTML da area de transferencia e lida automaticamente; colar codigo HTML diretamente funciona da mesma forma. Tudo roda localmente no seu navegador — nada e enviado.",
      faq: [
        {
          answer:
            "Nao. Colar, analisar e converter acontece tudo localmente no seu navegador; nada e enviado a um servidor.",
          question: "Meu conteudo e enviado para um servidor?",
        },
        {
          answer:
            "Selecione o conteudo desejado na pagina web, copie e cole na caixa de entrada — a ferramenta le automaticamente a estrutura HTML rica da area de transferencia e converte.",
          question: "Como converto um artigo de uma pagina web para Markdown?",
        },
        {
          answer:
            "Sim. Cole ou digite o texto do codigo HTML diretamente — funciona igual a colar conteudo rico.",
          question: "Posso colar o codigo HTML diretamente?",
        },
        {
          answer:
            "Sim, tabelas no estilo GFM e blocos de codigo com cercas sao suportados, e os blocos de codigo tentam detectar a anotacao de linguagem original.",
          question: "Tabelas e blocos de codigo sao convertidos corretamente?",
        },
        {
          answer:
            "Nao exatamente. So e mantida a formatacao comum que o Markdown consegue expressar (titulos, listas, links etc.) — layout, estilos e design complexos nao sao preservados.",
          question: "O resultado ficara identico a pagina web original?",
        },
      ],
      features: [
        "Le automaticamente a estrutura HTML da area de transferencia ao colar conteudo rico; tambem suporta colar codigo HTML diretamente",
        "Suporta titulos, negrito, italico, tachado, links e imagens",
        "Suporta listas ordenadas/nao ordenadas (incluindo aninhadas) e citacoes (incluindo aninhadas)",
        "Suporta tabelas GFM e blocos de codigo com cercas, com deteccao automatica de linguagem",
        "Roda localmente no seu navegador — nada e enviado",
        "Copia o resultado com um clique",
      ],
      keywords: [
        "html para markdown",
        "pagina web para markdown",
        "colar para markdown",
        "html to markdown",
        "conversor html para markdown online",
      ],
      name: "Pagina web para Markdown",
      steps: [
        "Selecione e copie conteudo de qualquer pagina web, ou prepare um trecho de codigo HTML.",
        "Cole na caixa de entrada a esquerda — o lado direito converte para Markdown na hora.",
        "Clique em copiar e cole o resultado nas suas notas, documentos ou CMS.",
      ],
      summary:
        "Converte conteudo de paginas web ou codigo HTML colado em Markdown, localmente no seu navegador.",
    },
    content: {
      faqDescription: "Algumas perguntas comuns antes de comecar.",
      faqTitle: "Perguntas frequentes",
      privacyDescription: "Algumas coisas uteis de saber antes de usar.",
      privacyItems: [
        "Nada e enviado — a conversao acontece inteiramente no seu navegador.",
        "Colar conteudo rico le automaticamente a estrutura HTML da area de transferencia; tambem e possivel colar ou editar o codigo HTML diretamente.",
        "Layout, estilos e design complexos nao sao preservados — so e convertida a formatacao comum que o Markdown consegue expressar.",
      ],
      privacyTitle: "Bom saber",
      stepsDescription: "Siga estes passos para converter seu conteudo.",
      stepsTitle: "Como usar",
      supportDescription:
        "Cobre a formatacao mais usada na escrita e documentacao do dia a dia.",
      supportTitle: "Formatacao suportada",
    },
    client: {
      empty: {
        description:
          "Cole conteudo de pagina web ou codigo HTML a esquerda, e o Markdown convertido aparecera aqui.",
        title: "Cole conteudo para comecar",
      },
      error:
        "Nao foi possivel converter esse conteudo agora — tente colar algo mais simples, ou use o codigo HTML diretamente.",
      input: {
        clear: "Limpar",
        placeholder:
          "Cole aqui conteudo copiado de uma pagina web, ou cole o codigo HTML diretamente…",
        title: "Conteudo da pagina web",
      },
      output: {
        title: "Resultado em Markdown",
      },
      status: {
        characters: "{count} caracteres",
      },
      toolbar: {
        copied: "Copiado",
        copy: "Copiar",
      },
    },
  },
};
