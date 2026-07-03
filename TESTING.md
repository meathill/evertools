# TESTING

## 运行测试

```bash
pnpm test                                     # 全量跑一次（vitest run）
pnpm --filter web test -- --watch             # watch 模式
pnpm --filter web test -- lib/format.test.ts  # 只跑单个文件
pnpm typecheck                                # 类型检查，跟测试一起作为验收标准
```

`pnpm test` 等价于 `pnpm --filter web test`，底层是 `vitest run`，只收集 `**/*.test.ts`。

## 测试环境

- 默认 `environment: "node"`（见 `apps/web/vitest.config.ts`），跑纯逻辑测试速度快。
- 涉及 DOM/React hook 渲染的测试在文件顶部用 `// @vitest-environment jsdom` 单独声明，
  不影响其余测试的默认环境（目前只有 `hooks/use-image-converter.test.ts` 这样用）。
- jsdom 不实现 `URL.createObjectURL`、canvas 2D 渲染、图片解码，这类测试需要手动 mock——
  参考 `hooks/use-image-converter.test.ts` 里的 `MockImage`/`getContext`/`toBlob` mock 写法。

## 现状与覆盖范围

- `lib/` 下的纯逻辑（格式转换、校验、解析）覆盖较好。
- `lib/pdf-editor/` 的子模块（pdf-parser、pdf-exporter、pdf-fonts 等）覆盖薄弱，正在补充中。
- React 组件基本没有测试；hooks 里目前只有 `use-image-converter` 有测试。

## 新增测试的约定

按 `DEV_NOTE.md` 的分层约定：**客户端交互组件放 `components/tools/`，纯逻辑（解析/格式化/
错误映射）放 `lib/` 便于单测**。新增工具时优先把可测的部分抽成 `lib/` 下的纯函数，而不是把
逻辑埋在组件/hook 里再补集成测试。

修 bug 时，先写一个能稳定复现该 bug 的测试用例，确认它在修复前失败、修复后通过，再提交。
