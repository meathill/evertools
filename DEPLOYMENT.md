# DEPLOYMENT

本项目通过 [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) 把 Next.js 应用构建成
Cloudflare Workers 可运行的产物。部署目标是 Cloudflare Workers（`wrangler.jsonc` 里的
`tools-meathill-com`），线上地址 https://tools.meathill.com。

## 部署：推 master 即可，Cloudflare 自动构建

**不需要在本地跑部署命令。** Cloudflare Workers Builds 已经接了这个 GitHub 仓库，
push 到 `master` 就会自动构建并发布，几分钟后线上生效。

验证是否已经上线（别只看构建日志，直接打线上）：

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://tools.meathill.com/tools/heic-to-jpg
```

### 手动部署（几乎用不到）

```bash
pnpm run deploy   # 等价于 pnpm --filter web run deploy
```

链路见 `apps/web/package.json`：`copy:pdf-worker`（拷 pdfjs worker 到 `public/pdf/`）→
`opennextjs-cloudflare build` → `opennextjs-cloudflare deploy`。

两个已知的坑：

- 根 `package.json` 里必须写 `pnpm --filter web run deploy`，**不能省掉 `run`**。
  `deploy` 是 pnpm 的内置命令（把 workspace 包导出到目录），省掉会被它劫持，
  报 `ERR_PNPM_INVALID_DEPLOY_TARGET: This command requires one parameter`，跑不到脚本。
- 本地 wrangler 登录态未必够用：`npx wrangler whoami` 如果 Token Permissions 只有
  `account (read)` / `user (read)`，就没有 Workers 写权限；而且该登录态挂了多个账号，
  非交互模式下会报 *More than one account available*，需要 `CLOUDFLARE_ACCOUNT_ID=<id>`。
  正因如此，正常流程走自动部署，别在本地手发。

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
