import type { DragEvent, ReactNode } from "react";

type DropZoneProps = {
  children: ReactNode;
  isDragging: boolean;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
};

// 各上传卡共用的虚线拖放区。抽出来有两个理由：
// 1. 五处上传卡原本抄了同一串 className 和同一组 drag 事件；
// 2. ARIA 没有「放置区」对应的 role，键盘用户走的是区域内的 <label> + <input type="file">，
//    套 role="button" 反而是错的——把规则抑制集中在这一处，而不是让五个组件各写一遍。
export function DropZone({
  children,
  isDragging,
  onDragLeave,
  onDragOver,
  onDrop,
}: DropZoneProps) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 拖放没有对应的 ARIA role，键盘路径由内部 label + file input 提供
    <div
      className={[
        "rounded-lg border-2 border-dashed p-5 transition-colors sm:p-6",
        isDragging
          ? "border-yellow bg-fluff/60"
          : "border-rule-strong bg-paper-deep/25",
      ].join(" ")}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
}
