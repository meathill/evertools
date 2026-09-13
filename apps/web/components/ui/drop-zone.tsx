import type { DragEvent, MouseEvent, ReactNode } from "react";

type DropZoneProps = {
  children: ReactNode;
  /** 空状态下是否允许点击大框空白处直接打开文件选择框；有内容时保持 false，避免误触。 */
  clickable?: boolean;
  disabled?: boolean;
  isDragging: boolean;
  onBrowseClick?: () => void;
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
  clickable = false,
  disabled = false,
  isDragging,
  onBrowseClick,
  onDragLeave,
  onDragOver,
  onDrop,
}: DropZoneProps) {
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (!clickable || disabled || !onBrowseClick) {
      return;
    }

    // 点到内部可交互元素（选择/重选/清空按钮等）时放行，只处理点大框空白处的情况。
    const target = event.target as HTMLElement | null;

    if (
      target?.closest?.("button,a,input,select,textarea,label,[data-no-browse]")
    ) {
      return;
    }

    onBrowseClick();
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 拖放没有对应的 ARIA role，键盘路径由内部 Button + file input 提供，这里的 onClick 只是鼠标快捷方式
    // biome-ignore lint/a11y/useKeyWithClickEvents: 同上，键盘用户走内部按钮，不需要给整个放置区加键盘事件
    <div
      className={[
        "rounded-lg border-2 border-dashed p-5 transition-colors sm:p-6",
        isDragging
          ? "border-yellow bg-fluff/60"
          : "border-rule-strong bg-paper-deep/25",
        clickable && !disabled
          ? "cursor-pointer hover:border-yellow hover:bg-fluff/30"
          : null,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
}
