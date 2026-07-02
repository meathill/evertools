# DEPLOYMENT

本项目通过 [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) 把 Next.js 应用构建成
Cloudflare Workers 可运行的产物。部署目标是 Cloudflare Workers（`wrangler.jsonc` 里的
`tools-meathill-com`），线上地址 https://tools.meathill.com。没有 CI/CD，部署靠手动执行。

## 部署

```bash
pnpm run deploy   # 等价于 pnpm --filter web deploy
```

实际执行链路（见 `apps/web/package.json`）：

1. `copy:pdf-worker` —— 把 `pdfjs-dist` 的 worker 文件拷到 `public/pdf/`（PDF 文字编辑器依赖，必须先执行）
2. `opennextjs-cloudflare build` —— 构建出 `.open-next/` 产物
3. `opennextjs-cloudflare deploy` —— 通过 wrangler 发布到 Cloudflare Workers

需要有对应 Cloudflare 账号的 wrangler 登录态（`wrangler login`），或配置好 `CLOUDFLARE_API_TOKEN`。

## 本地预览生产构建

```bash
pnpm --filter web preview   # 构建 + 在本地用 workerd 运行，贴近线上环境
```

用于验证只在 Cloudflare Workers 运行时才会暴露的问题（如 Node API 兼容性），比 `pnpm dev` 更接近生产环境。

## 关键配置（`apps/web/wrangler.jsonc`）

- `name`: `tools-meathill-com` —— Worker 名称
- `compatibility_flags: ["nodejs_compat"]` —— 依赖部分 Node API（详见 DEV_NOTE.md 的 workerd 库选型记录）
- `assets` —— 静态资源绑定，指向 `.open-next/assets`
- 未设置 `export const runtime`：OpenNext 把所有 server 端逻辑打进一个 worker 运行，
  `runtime="edge"` 是 Vercel 专用配置，在此无效

## 环境变量 / Secrets

如需新增需要保密的配置，用 `wrangler secret put <NAME>` 管理，不要写进 `wrangler.jsonc` 或提交到仓库。
