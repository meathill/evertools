import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import type { AppLocale } from "@/i18n/routing";
import type { ToolDefinition } from "@/lib/content";
import { getLocalizedPathname } from "@/lib/site";
import type { LocaleContent } from "@/messages/types";

type ToolCardProps = {
  content: LocaleContent["toolCard"];
  locale: AppLocale;
  tool: ToolDefinition;
};

export function ToolCard({ content, locale, tool }: ToolCardProps) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="gap-3 border-b border-rule bg-paper-deep/40">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline">{tool.category}</Badge>
          <span className="text-mono text-xs text-mute">
            {content.firstBatch}
          </span>
        </div>
        <div className="space-y-2">
          <CardTitle>{tool.name}</CardTitle>
          <CardDescription className="leading-relaxed">
            {tool.summary}
          </CardDescription>
        </div>
      </CardHeader>

      <CardPanel className="space-y-4">
        <p className="text-ink-soft text-sm leading-relaxed">
          {tool.description}
        </p>
        <ul className="space-y-2 text-sm text-ink-soft">
          {tool.features.slice(0, 3).map((feature) => (
            <li className="flex gap-2" key={feature}>
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-yellow-deep" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardPanel>

      <CardFooter className="justify-between border-t border-rule bg-fluff/40">
        <span className="text-mono text-xs text-mute">
          {content.footerHint}
        </span>
        <Button
          render={<Link href={getLocalizedPathname(locale, tool.href)} />}
          size="sm"
          variant="press"
        >
          {content.openTool}
          <ArrowRightIcon />
        </Button>
      </CardFooter>
    </Card>
  );
}
