import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AppLocale } from "@/i18n/routing";
import type { ToolDefinition } from "@/lib/content";
import { getLocalizedPathname } from "@/lib/site";

type ToolCardProps = {
  locale: AppLocale;
  tool: ToolDefinition;
};

export function ToolCard({ locale, tool }: ToolCardProps) {
  return (
    <Card
      className="group h-full overflow-hidden text-ink! no-underline! transition-transform hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      render={<Link href={getLocalizedPathname(locale, tool.href)} />}
    >
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <Badge size="lg" variant="outline">
            {tool.category}
          </Badge>
          <ArrowRightIcon className="size-4 shrink-0 text-mute transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
        </div>
        <div className="space-y-1.5">
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription className="leading-relaxed">
            {tool.summary}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
