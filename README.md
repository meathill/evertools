# evertools

[tools.meathill.com](https://tools.meathill.com) —— 一组本地处理的小工具集合。图片、PDF、JSON、Markdown 等操作都在浏览器里完成，不上传原始文件到服务器。

## 已上线工具

- [图片格式与尺寸转换](https://tools.meathill.com/tools/image-converter) —— 在浏览器本地把 HEIC 等照片转成 JPG/PNG/WebP，并完成尺寸缩放与质量调整
- [PDF 文字编辑器](https://tools.meathill.com/tools/pdf-text-editor) —— 在浏览器本地完成 PDF 文本替换，并尽量保留原字体外观
- [JSON 查看器](https://tools.meathill.com/tools/json-viewer) —— 在浏览器本地把 JSON 格式化成可折叠的树，支持搜索和展开嵌套 JSON
- [OG 图片校验](https://tools.meathill.com/tools/og-image-validator) —— 抓取网址的 Open Graph / Twitter 标签，预览多平台分享卡片并校验配图
- [Markdown 转 PDF](https://tools.meathill.com/tools/markdown-to-pdf) —— 在浏览器里把 Markdown 渲染成格式化预览，再通过打印导出为手机友好的 PDF
- [Sitemap 校验器](https://tools.meathill.com/tools/sitemap-validator) —— 抓取 sitemap.xml 并按协议校验结构、条目字段与体积上限，快速定位问题

## 技术栈

- Monorepo：pnpm workspace（`apps/web` 是唯一应用），Node.js >= 24
- 前端：Next.js 16（Turbopack）+ React 19 + TypeScript + Tailwind v4
- 状态管理 zustand；UI 基于 base-ui，图标用 lucide-react
- 国际化 next-intl，7 语言（zh/en/ja/th/vi/es/pt）
- 测试 vitest；格式化/静态检查 biome
- 部署 opennextjs-cloudflare，跑在 Cloudflare Workers

## 开发

```bash
pnpm install
pnpm dev          # 启动开发服务器
pnpm test         # 跑测试
pnpm typecheck    # 类型检查
pnpm run format   # biome 格式化
```

详见 [TESTING.md](TESTING.md) 和 [DEPLOYMENT.md](DEPLOYMENT.md)。开发中积累的框架知识和踩坑记录见 [DEV_NOTE.md](DEV_NOTE.md)。

## 目录结构

```
apps/web/
  app/            # Next.js App Router 页面
  components/     # UI 组件（tools/ 为各工具的客户端交互组件）
  hooks/          # 客户端交互逻辑
  lib/            # 纯逻辑（解析/格式化/校验），便于单测
  messages/       # 7 语言文案
  stores/         # zustand 状态
```
