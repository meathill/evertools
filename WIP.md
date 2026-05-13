# 当前任务

## 目标

- 完成首版工具站初始化并准备首个 git 提交
- 将站点改造成基于 `next-intl` 的多语言版本
- 覆盖中文、英文、日文、泰文、越南文、西班牙文、葡萄牙文
- 补齐多语言 SEO：`hreflang`、多语言 `metadata`、`sitemap`

## Todo

- [x] 创建 `AGENTS.md` 并建立 `CLAUDE.md`、`GEMINI.md` 软链
- [x] 初始化 monorepo 根配置
- [x] 创建 `apps/web` 并接入 Cloudflare OpenNext
- [x] 接入 `CossUI`、`zustand`、基础站点布局
- [x] 实现首个图片格式与尺寸转换工具
- [x] 补充首版 SEO：metadata、robots、sitemap、结构化数据
- [x] 补充测试并确认首版构建可用
- [ ] 接入 `next-intl` 基础设施与 locale 路由
- [ ] 提取首页、导航、页脚、工具页与工具面板文案
- [ ] 补齐多语言 SEO 与 locale-aware metadata
- [ ] 增加语言切换入口
- [ ] 重新运行 format、typecheck、test、build

## 备注

- git 远端 `origin` 已配置，但当前环境缺少 `user.name` / `user.email`，暂时无法直接创建首个提交
