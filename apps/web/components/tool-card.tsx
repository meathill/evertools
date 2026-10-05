import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { AppLocale } from "@/i18n/routing";
import type { ToolDefinition } from "@/lib/content";
import { getLocalizedPathname } from "@/lib/site";

type ToolCardProps = {
  locale: AppLocale;
  tool: ToolDefinition;
};

/**
 * 纯服务端卡片：不依赖 "use client" 的 Card/Badge，避免工具列表走客户端边界后
 * 再插入内容。明确 min-height + 图标宽高，降低字体/图标晚到时的 CLS。
 */
export function ToolCard({ locale, tool }: ToolCardProps) {
  return (
    <Link
      className="group flex h-full min-h-[9.5rem] flex-col overflow-hidden rounded-lg border border-rule-strong bg-card text-card-foreground text-ink! no-underline! shadow-sm transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      href={getLocalizedPathname(locale, tool.href)}
      prefetch={false}
    >
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex h-6.5 min-w-6.5 shrink-0 items-center justify-center rounded-sm border border-input bg-background px-[calc(--spacing(1.5)-1px)] font-medium text-base text-foreground sm:h-5.5 sm:min-w-5.5 sm:text-sm dark:bg-input/32">
            {tool.category}
          </span>
          <ArrowRightIcon
            aria-hidden
            className="size-4 shrink-0 text-mute transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
            height={16}
            width={16}
          />
        </div>
        <div className="space-y-1.5">
          <div className="font-semibold text-ink text-lg leading-snug">
            {tool.name}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {tool.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}
