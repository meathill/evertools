# DEV_NOTE

开发过程中积累、需要长期关注的基建/框架知识，避免重复踩坑。

## Tailwind v4 + 设计系统接线（重要）

设计系统定义在 `apps/web/app/globals.css`。有几个 v4 的坑直接决定"代码写了到底有没有生效"：

### 1. 只有 `@theme` 里的 token 才会生成 utility 类

Tailwind v4 **只为 `@theme` 块里声明的 token 生成 utility**。仅写在 `:root` 的自定义属性
不会产生 utility——`class="bg-yellow"` / `shadow-press-ink` / `border-ink` / `font-display`
会**静默失效**（编译产物里根本没有这条规则），元素回退到默认样式，但不会报错。

- 新增品牌色 / 阴影 / 字体时，**必须**在 `@theme` 里注册，否则对应 utility 不存在。
- 本仓库沿用 `--font-sans` 的 inline 自引用写法：`@theme inline { --color-x: var(--color-x); }`，
  这样 utility 引用 `var(--color-x)`，dark 仍由 `.dark{}` 覆盖同名变量实现。
- 例外：Tailwind 自带默认 token 名（`--text-2xl`、`--shadow-sm`、`--font-sans/mono`、`--radius-*`）
  即使只在 `:root` 覆盖值也生效，因为默认 utility 已经 `var()` 引用了这些名字。品牌自定义名
  （`yellow`/`paper-deep`/`press-*`/`display`）不在此列。
- **改完务必验证**：`pnpm --filter web build` 后 grep `.next` 里是否出现
  `.bg-yellow{` / `.shadow-press-ink{` / `.font-display{` 等规则。

### 2. 未分层的基础元素样式会盖过 utility

`globals.css` 里直接写的 `h1..h6 { font-family: ... }`、`a { color: ... }`、`p { color: ... }`
是 **unlayered** 的，优先级高于 Tailwind 的 `@layer utilities`。所以在元素上写 `font-display`、
`text-ink` 这类 utility 可能被基础元素规则盖掉。

- 现状：基础 `h1..h6` 不再硬编码 `font-family`，默认继承 body 的 Nunito；营销标题靠
  `.font-display` / `.h-hero` 显式切到 Fraunces（brand=衬线，app/工具内=无衬线）。
- 给元素加 utility 不生效时，先查是不是被 unlayered 的基础元素规则盖了。

### 3. 暗色模式：品牌 token 自动翻转，别再手写 `dark:`

`.dark{}` 已经把每个品牌 token 翻到暗色值（`bg-cream`/`text-ink` 等自动适配明暗）。
**不要**再给品牌色加 `dark:` 覆盖——`text-ink` 在暗色下本就是浅色，`dark:text-cream`
反而把它压回深色（不可见）。`dark:bg-ink` 同理会把头部反成亮色。

### 4. mui-mark.png 自带白底

吉祥物素材是白底，明色背景下融合、暗色下会出现刺眼白块。大尺寸装饰用它时按主题处理
（首页 hero 的吉祥物用 `dark:lg:hidden` 暗色下隐藏）。

## 新增一个工具的标准步骤

工具页的样板（metadata、结构化数据、hero/内容卡布局）已抽成共享件，新增工具按约定走即可：

1. **注册工具**：在 `lib/content.ts` 新增 `getXxxTool(content)`，填好
   `applicationCategory` / `totalTime` / `stepsTitle` 等字段，并加进 `getTools()`。
2. **建页面**：`app/[locale]/tools/<slug>/page.tsx` 里，`generateMetadata` 一行委托给
   `generateToolPageMetadata`（`lib/tool-page.ts`），页面体调 `buildToolStructuredData`
   并渲染 `ToolPageLayout`（`components/tool-page/`），把工具的客户端组件作为 children 传入。
   页面只需提供三处差异：第三个 badge、scenarios 的图标+文案行、infoCard（privacy 或 limits）。
3. **分层**：客户端交互组件放 `components/tools/`，纯逻辑（解析/格式化/错误映射）放 `lib/` 便于单测。
4. **补全 7 国文案**：`messages/*.ts` 为 `zh/en/ja/th/vi/es/pt` 全部补齐；类型以 `zh.ts` 为准
   （`LocaleContent = DeepWiden<typeof zhMessages>`），漏翻会直接类型报错。
5. **锁 SEO 输出**：结构化数据/metadata 统一由 `lib/tool-page.ts` 产出，改动后跑
   `lib/tool-page.test.ts`，它锁定了四个 schema.org 块的键序与字段（即 `JSON.stringify` 的字节序）。

## pdfjs-dist 锁定 4.10.38

更高版本的 `getTextContent` 会崩溃，故锁在 4.10.38。升级前务必先跑通 PDF 文本编辑器的解析路径。
worker 文件由 `pnpm copy:pdf-worker` 拷到 `public/pdf/`，`dev` / `build` 脚本已自动带上，别手动改。

## 图片转换器 HEIC 支持（heic-to）

- **浏览器原生 `<img>` 只有 Safari 能解码 HEIC**。`lib/image-converter.ts` 的 `loadImage()` 用
  `new Image()`，Chrome/Firefox/Edge 遇 HEIC 会 `onerror`，所以**不能**让 canvas 直接吃 HEIC。
- 方案：`normalizeSourceFile()` 在选文件时检测 HEIC（MIME 或 `.heic/.heif` 后缀——很多系统
  `file.type` 为空，必须后缀兜底），用 **heic-to**（`await import("heic-to")` 动态加载）解码成
  JPEG `File`，之后下游预览/canvas/转换完全按普通图片处理。HEIC **仅作输入**（canvas 跨浏览器
  无法编码 HEIC）。
- **动态 import 是硬要求**：heic-to 自带 libheif WASM（~3MB），必须只在上传 HEIC 时加载独立
  chunk，别在模块顶层 import。它内部用 Web Worker + Blob 内联 WASM，无需额外 Next 资源配置，
  也不卡主线程。若遇 CSP `unsafe-eval` 报错，改用 `heic-to/csp`。
- 中间格式用 JPEG q0.92：HEIC 本就有损、典型输出也有损，二次压缩不可感知；好处是内存低，且
  归一化后 `image.type==="image/jpeg"` → 默认输出自动落 JPG（适合照片）。

## xxx-to-ooo 转换落地页（/tools/[conversion]）

- 为「heic to jpg」等高搜索词建的专属 SEO 落地页，配对配置在 `lib/conversions.ts`（9 个）。
- 路由 `app/[locale]/tools/[conversion]/page.tsx` 与静态工具目录**同级共存**：Next 静态段优先，
  `image-converter` 等不被遮蔽；`dynamicParams = false` + `generateStaticParams` 只放行白名单
  slug，其余 404。
- 落地页 =「模板化 SEO 外壳 + 预设输出格式」：`getConversionTool()` 用 `{from}/{to}` 插值生成
  标题/描述/关键词，正文（features/steps/faq）直接复用 `imageConverter.tool.*`，避免写 9×7 份
  文案；客户端通过 `ImageConverterClient` 的 `initialOutputFormat` 预设目标格式。
- 新增配对只需往 `CONVERSION_PAIRS` 加一行，路由 / sitemap / 站内链接（`ConversionLinks`）自动覆盖。
