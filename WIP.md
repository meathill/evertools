# 当前任务

> 追踪进行中的短期任务，完成后及时清理（见 AGENTS.md）。

## 目标

新增「简繁转换」工具（`/tools/chinese-converter`）：简体 ⇄ 繁体互转，繁体侧支持
标准/台湾/港澳三种地区惯用词。纯客户端转换（`opencc-js`，动态 import 懒加载），
参照 `html-to-markdown` 的文本转换类工具模式。

## Todo

- [ ] 安装 `opencc-js`，核实 `Converter`/`ConverterFactory` 实际类型签名
- [ ] `lib/chinese-converter.ts` 核心转换逻辑（方向+地区 → OpenCC locale 映射，converter 缓存）
- [ ] `lib/chinese-converter.test.ts` 单测
- [ ] `components/tools/chinese-converter-client.tsx` 客户端组件
- [ ] `app/[locale]/tools/chinese-converter/page.tsx` + `opengraph-image.tsx`
- [ ] `lib/content.ts` 注册 `getChineseConverterTool` + `lib/content.test.ts` 用例
- [ ] 七语言文案：`messages/{zh,en,ja,th,vi,es,pt}.ts` 新增 `chineseConverter` 命名空间
- [ ] `README.md` 加条目；`DEV_NOTE.md` 补 opencc-js 懒加载小节
- [ ] `pnpm test` / `typecheck` / `format` / `build` 全部通过
- [ ] 抽查构建产物确认 opencc-js 分包不在首屏；浏览器实测方向切换/地区切换/复制

## 备注

- 方向+地区 → locale 对照：cn↔t（标准）、cn↔twp（台湾）、cn↔hkp（港澳）
- 完整方案见 plan：`~/.claude/plans/valiant-splashing-stroustrup.md`
