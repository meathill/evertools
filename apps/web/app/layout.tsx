import type { ReactNode } from "react";
import "./globals.css";

// `<html>` / `<body>` 由 `app/[locale]/layout.tsx` 渲染——只有它拿得到 locale，
// 才能给 `<html lang>` 填对值（本站 7 语言）。根布局在 [locale] 之上，
// 渲染顺序也在它之前，读不到 locale，所以这里只做透传。
// app/ 下除 [locale] 外只有 route handler 与 metadata 文件，都不需要 HTML 外壳。
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
