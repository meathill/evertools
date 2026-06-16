"use client";

import {
  CircleCheckIcon,
  CircleXIcon,
  GlobeIcon,
  ImageUpIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { OgImageValidatorPreviews } from "@/components/tools/og-image-validator-previews";
import { OgImageValidatorReportCard } from "@/components/tools/og-image-validator-report-card";
import { OgImageValidatorUploadCard } from "@/components/tools/og-image-validator-upload-card";
import { OgImageValidatorUrlForm } from "@/components/tools/og-image-validator-url-form";
import { Button } from "@/components/ui/button";
import { useOgImageValidator } from "@/hooks/use-og-image-validator";
import type { CheckStatus } from "@/lib/og/validator";
import type { LocaleContent } from "@/messages/types";

type OgImageValidatorClientProps = {
  content: LocaleContent["ogImageValidator"];
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

export function OgImageValidatorClient({
  content,
}: OgImageValidatorClientProps) {
  const controller = useOgImageValidator();
  const { client } = content;
  const { errorCode, isFetching, mode, result } = controller;

  const overallText = {
    fail: client.result.overallFail,
    pass: client.result.overallPass,
    warn: client.result.overallWarn,
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex gap-2">
        <Button
          onClick={() => controller.handleModeChange("url")}
          variant={mode === "url" ? "press" : "outline"}
        >
          <GlobeIcon />
          {client.modes.url}
        </Button>
        <Button
          onClick={() => controller.handleModeChange("upload")}
          variant={mode === "upload" ? "press" : "outline"}
        >
          <ImageUpIcon />
          {client.modes.upload}
        </Button>
      </div>

      {mode === "url" ? (
        <OgImageValidatorUrlForm content={content} controller={controller} />
      ) : (
        <OgImageValidatorUploadCard content={content} controller={controller} />
      )}

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

          <OgImageValidatorPreviews client={client} result={result} />
          <OgImageValidatorReportCard client={client} report={result.report} />
        </div>
      ) : mode === "url" && !isFetching && !errorCode ? (
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
