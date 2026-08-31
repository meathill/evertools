# EverTools Design System

## Theme

以浅色暖中性为默认，保留现有暗色模式。产品界面采用克制配色，品牌黄只用于主要动作、当前状态和品牌入口。

## Colors

- Page: `#fdfaf2`
- Surface: `#f6efde`
- Surface strong: `#ede2c5`
- Ink: `#3a2e23`
- Body ink: `#5a4938`
- Muted ink: `#8a7660`
- Brand: `#e6c34a`
- Brand warm: `#e6a23a`
- Brand deep: `#b3851c`
- Danger: `#c44a32`

统一使用现有 CSS token，不在组件中写第二套近似颜色。

## Typography

- Display: Fraunces，仅用于品牌名和营销标题。
- UI and body: Nunito。
- Code and metadata: JetBrains Mono。
- 正文 16px，UI 14px，元信息最小 12px；只使用偶数字号。

## Shape and Elevation

- 默认圆角 6px，常用范围 4px 至 10px，装饰区域最大 14px。
- 任务组件使用 1px 暖色描边和轻阴影。
- 主要品牌动作可使用实色 press 阴影；Popover、Menu 和 Sheet 才使用模糊阴影。

## Layout

- 4px 间距基准，组件常用 8px 至 16px，区块间距不超过 56px。
- 工具页保持高信息密度，正文宽度控制在 65ch 至 75ch。
- 桌面端品牌与产品导航同层；移动端折叠站点切换，不增加第二条 Header。

## Components

- Brand Header：Meathill Studio、当前产品、站点切换和产品自己的操作区。
- Brand Footer：产品说明、Meathill LLC 法律声明、最多 6 个同组入口和全部产品。
- Breadcrumb：`Meathill Studio > EverTools > 当前页面`，视觉结构与 JSON-LD 一致。
- 工作区组件继续复用现有 Base UI 体系，不因品牌统一重新发明控件。

## Motion and Accessibility

- 交互反馈 120ms 至 180ms，只动画 opacity 和 transform。
- 不使用弹簧、长距离位移或装饰性循环动画。
- 所有交互态覆盖 hover、focus-visible、active、disabled 和 loading。
- 遵守 `prefers-reduced-motion`。
