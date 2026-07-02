"use client";

import {
  CircleCheckIcon,
  CircleXIcon,
  RotateCwIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { SitemapValidatorReportCard } from "@/components/tools/sitemap-validator-report-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { useSitemapValidator } from "@/hooks/use-sitemap-validator";
import type { CheckStatus } from "@/lib/sitemap/validator";
import type { LocaleContent } from "@/messages/types";

type SitemapValidatorClientProps = {
  content: LocaleContent["sitemapValidator"];
};

const OVERALL_META = {
  fail: {
    icon: CircleXIcon,
    tone: "border-danger/30 bg-danger-bg text-danger",
  },
  pass: {
    icon: CircleCheckIcon,
    tone: "border-success/30 bg-success-bg text-success",
  },
  warn: {
    icon: TriangleAlertIcon,
    tone: "border-warning/30 bg-warning-bg text-warning",
  },
} as const;

export function SitemapValidatorClient({
  content,
}: SitemapValidatorClientProps) {
  const controller = useSitemapValidator();
  const { client } = content;
  const {
    errorCode,
    handleResubmit,
    handleSubmit,
    handleUrlChange,
    isFetching,
    result,
    urlInput,
  } = controller;

  const overallText = {
    fail: client.result.overallFail,
    pass: client.result.overallPass,
    warn: client.result.overallWarn,
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-ink shadow-press-ink">
        <CardHeader className="border-b border-rule bg-paper-deep/50">
          <CardTitle>{client.url.label}</CardTitle>
          <CardDescription>{client.url.hint}</CardDescription>
        </CardHeader>
        <CardPanel>
          <form className="flex flex-wrap gap-3" onSubmit={handleSubmit}>
            <input
              className="h-9 min-w-0 flex-1 rounded-lg border border-rule-strong bg-card px-3 text-ink text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              inputMode="url"
              onChange={handleUrlChange}
              placeholder={client.url.placeholder}
              type="url"
              value={urlInput}
            />
            <Button loading={isFetching} type="submit" variant="press">
              <SearchIcon />
              {client.url.submit}
            </Button>
            {result ? (
              <Button
                loading={isFetching}
                onClick={handleResubmit}
                variant="outline"
              >
                <RotateCwIcon />
                {client.url.resubmit}
              </Button>
            ) : null}
          </form>
        </CardPanel>
      </Card>

      {errorCode ? (
        <div className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2.5 text-danger text-sm">
          {(client.errors as Record<string, string>)[errorCode] ??
            client.errors.UNKNOWN}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-6">
          {(() => {
            const meta = OVERALL_META[result.report.overall as CheckStatus];
            const Icon = meta.icon;
            return (
              <div
                className={`flex items-center gap-2.5 rounded-lg border px-4 py-3 font-semibold text-sm ${meta.tone}`}
              >
                <Icon className="size-5 shrink-0" />
                {overallText[result.report.overall as CheckStatus]}
              </div>
            );
          })()}
          <SitemapValidatorReportCard client={client} report={result.report} />
        </div>
      ) : !isFetching && !errorCode ? (
        <div className="rounded-lg border border-rule-strong border-dashed bg-paper-deep/25 px-4 py-10 text-center">
          <div className="font-semibold text-ink text-lg">
            {client.url.emptyTitle}
          </div>
          <p className="mx-auto mt-2 max-w-md text-mute text-sm leading-6">
            {client.url.emptyDescription}
          </p>
        </div>
      ) : null}
    </div>
  );
}
