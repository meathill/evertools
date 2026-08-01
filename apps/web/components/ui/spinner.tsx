import { Loader2Icon } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

export function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof Loader2Icon>): React.ReactElement {
  return (
    // biome-ignore lint/a11y/useSemanticElements: 渲染的是 <svg> 图标，role="status" 是 ARIA 允许的用法；<output> 语义上属于表单计算结果
    <Loader2Icon
      aria-label="Loading"
      className={cn("animate-spin", className)}
      role="status"
      {...props}
    />
  );
}
