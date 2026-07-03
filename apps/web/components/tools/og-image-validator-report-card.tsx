import { CircleCheckIcon, CircleXIcon, TriangleAlertIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { formatBytes } from "@/lib/format";
import type {
  CheckResult,
  CheckStatus,
  ValidationReport,
} from "@/lib/og/validator";
import type { LocaleContent } from "@/messages/types";

type ClientContent = LocaleContent["ogImageValidator"]["client"];

type ReportCardProps = {
  client: ClientContent;
  report: ValidationReport;
};

const STATUS_META = {
  fail: { badge: "error", icon: CircleXIcon, tone: "text-danger" },
  pass: { badge: "success", icon: CircleCheckIcon, tone: "text-success" },
  warn: { badge: "warning", icon: TriangleAlertIcon, tone: "text-warning" },
} as const;

function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

function formatDetail(
  check: CheckResult,
  client: ClientContent,
): string | null {
  const details = client.details as Record<string, string>;
  const values = check.values;
  switch (check.id) {
    case "image-dimensions":
    case "platform-min-size":
      return values
        ? interpolate(details[check.id], values)
        : client.result.dimensionsUnknown;
    case "image-ratio":
      return values
        ? interpolate(details["image-ratio"], values)
        : client.result.dimensionsUnknown;
    case "platform-filesize":
      return values
        ? interpolate(details["platform-filesize"], {
            max: formatBytes(Number(values.maxBytes)),
            size: formatBytes(Number(values.bytes)),
          })
        : client.result.sizeUnknown;
    case "platform-format":
      return values
        ? interpolate(details["platform-format"], values)
        : details.unknown;
    case "platform-required-tags":
      return check.status === "fail" && values
        ? interpolate(details.requiredTagsMissing, values)
        : null;
    default:
      return check.status === "pass" ? details.present : details.missing;
  }
}

function CheckRow({
  check,
  client,
}: {
  check: CheckResult;
  client: ClientContent;
}) {
  const meta = STATUS_META[check.status as CheckStatus];
  const Icon = meta.icon;
  const label = (client.checks as Record<string, string>)[check.id] ?? check.id;
  const detail = formatDetail(check, client);
  return (
    <div className="flex items-start gap-2.5">
      <Icon className={`mt-0.5 size-4 shrink-0 ${meta.tone}`} />
      <div className="min-w-0 flex-1">
        <div className="font-medium text-ink text-sm">{label}</div>
        {detail ? (
          <div className="text-mute text-xs leading-5">{detail}</div>
        ) : null}
      </div>
    </div>
  );
}

export function OgImageValidatorReportCard({
  client,
  report,
}: ReportCardProps) {
  return (
    <div className="space-y-6">
      {report.general.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{client.result.generalTitle}</CardTitle>
          </CardHeader>
          <CardPanel className="grid gap-3 sm:grid-cols-2">
            {report.general.map((check) => (
              <CheckRow check={check} client={client} key={check.id} />
            ))}
          </CardPanel>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{client.result.platformsTitle}</CardTitle>
        </CardHeader>
        <CardPanel className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {report.platforms.map((platform) => {
            const meta = STATUS_META[platform.status as CheckStatus];
            return (
              <div
                className="space-y-3 rounded-lg border border-rule-strong bg-cream/40 p-4"
                key={platform.platform}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-ink text-sm">
                    {(client.platforms as Record<string, string>)[
                      platform.platform
                    ] ?? platform.platform}
                  </span>
                  <Badge variant={meta.badge}>
                    {client.status[platform.status as CheckStatus]}
                  </Badge>
                </div>
                <div className="space-y-2.5">
                  {platform.checks.map((check) => (
                    <CheckRow check={check} client={client} key={check.id} />
                  ))}
                </div>
              </div>
            );
          })}
        </CardPanel>
      </Card>
    </div>
  );
}
