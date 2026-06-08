import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/i18n/routing";
import {
  CONVERSION_PAIRS,
  conversionFormatLabel,
  conversionSlug,
} from "@/lib/conversions";
import { getLocalizedPathname } from "@/lib/site";

type ConversionLinksProps = {
  currentSlug?: string;
  locale: AppLocale;
  title: string;
};

// 站内互链：让所有转换落地页彼此可达、非孤儿，向搜索引擎传递权重。
export function ConversionLinks({
  currentSlug,
  locale,
  title,
}: ConversionLinksProps) {
  const pairs = CONVERSION_PAIRS.filter(
    (pair) => conversionSlug(pair) !== currentSlug,
  );

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardPanel>
        <ul className="flex flex-wrap gap-2">
          {pairs.map((pair) => {
            const slug = conversionSlug(pair);

            return (
              <li key={slug}>
                <Link
                  className="inline-flex items-center gap-1.5 rounded-md border border-rule-strong bg-paper-deep/40 px-3 py-1.5 font-medium text-ink-soft text-sm transition-colors hover:border-ink hover:bg-yellow hover:text-ink"
                  href={getLocalizedPathname(locale, `/tools/${slug}`)}
                >
                  {conversionFormatLabel(pair.from)}
                  <ArrowRightIcon className="size-3.5" />
                  {conversionFormatLabel(pair.to)}
                </Link>
              </li>
            );
          })}
        </ul>
      </CardPanel>
    </Card>
  );
}
