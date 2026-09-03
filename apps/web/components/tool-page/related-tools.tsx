import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/i18n/routing";
import type { ToolDefinition } from "@/lib/content";
import { getLocalizedPathname } from "@/lib/site";

type RelatedToolsProps = {
  items: readonly ToolDefinition[];
  locale: AppLocale;
  title: string;
};

// 跨工具互链：转换器 ↔ 裁切器互相可达，转换落地页也能进裁切器。
// 与 ConversionLinks（18 个转换配对互链）互补，不替代。
export function RelatedTools({ items, locale, title }: RelatedToolsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardPanel>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                className="group flex items-center justify-between gap-3 rounded-md border border-rule-strong bg-paper-deep/40 px-3 py-2.5 transition-colors hover:border-ink hover:bg-yellow"
                href={getLocalizedPathname(locale, item.href)}
              >
                <span>
                  <span className="block font-medium text-ink text-sm group-hover:text-[#3a2e23]">
                    {item.name}
                  </span>
                  <span className="block text-mute text-xs group-hover:text-[#3a2e23]/70">
                    {item.summary}
                  </span>
                </span>
                <ArrowRightIcon className="size-4 shrink-0 text-mute group-hover:text-[#3a2e23]" />
              </Link>
            </li>
          ))}
        </ul>
      </CardPanel>
    </Card>
  );
}
