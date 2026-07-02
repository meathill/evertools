import { CircleCheckIcon, CircleXIcon, TriangleAlertIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { formatBytes } from "@/lib/format";
import type {
  CheckResult,
  CheckStatus,
  EntryIssue,
  SitemapRootType,
  ValidationReport,
} from "@/lib/sitemap/validator";
import type { LocaleContent } from "@/messages/types";

type ClientContent = LocaleContent["sitemapValidator"]["client"];

type ReportCardProps = {
  client: ClientContent;
  report: ValidationReport;
};

const STATUS_META = {
  fail: { icon: CircleXIcon, tone: "text-danger" },
  pass: { icon: CircleCheckIcon, tone: "text-success" },
  warn: { icon: TriangleAlertIcon, tone: "text-warning" },
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
  if (!values) return null;
  switch (check.id) {
    case "byte-size-limit":
      return interpolate(details[check.id], {
        bytes: formatBytes(Number(values.bytes)),
        maxBytes: formatBytes(Number(values.maxBytes)),
      });
    case "content-truncated":
      return interpolate(details[check.id], {
        bytes: formatBytes(Number(values.bytes)),
      });
    default:
      return details[check.id] ? interpolate(details[check.id], values) : null;
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

function IssueRow({
  client,
  issue,
}: {
  client: ClientContent;
  issue: EntryIssue;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-rule-strong bg-cream/40 p-4">
      <div className="truncate font-mono text-ink text-xs">
        {issue.loc ?? "—"}
      </div>
      <div className="space-y-2">
        {issue.checks.map((check) => (
          <CheckRow check={check} client={client} key={check.id} />
        ))}
      </div>
    </div>
  );
}

function rootTypeLabel(
  rootType: SitemapRootType,
  client: ClientContent,
): string {
  if (rootType === "urlset") return client.result.rootTypeUrlset;
  if (rootType === "sitemapindex") return client.result.rootTypeSitemapindex;
  return client.result.rootTypeUnknown;
}

export function SitemapValidatorReportCard({
  client,
  report,
}: ReportCardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{client.result.generalTitle}</CardTitle>
        </CardHeader>
        <CardPanel className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-mute text-xs">
            <Badge variant="outline">
              {rootTypeLabel(report.rootType, client)}
            </Badge>
            <span>
              {interpolate(client.result.entryCount, {
                count: report.entryCount,
              })}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {report.general.map((check) => (
              <CheckRow check={check} client={client} key={check.id} />
            ))}
          </div>
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{client.result.issuesTitle}</CardTitle>
        </CardHeader>
        <CardPanel className="space-y-3">
          {report.issues.length === 0 ? (
            <p className="text-ink-soft text-sm">{client.result.noIssues}</p>
          ) : (
            <>
              {report.totalIssueCount > report.issues.length ? (
                <p className="text-mute text-xs">
                  {interpolate(client.result.showingSample, {
                    shown: report.issues.length,
                    total: report.totalIssueCount,
                  })}
                </p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                {report.issues.map((issue, index) => (
                  <IssueRow
                    client={client}
                    issue={issue}
                    key={`${issue.loc}-${index}`}
                  />
                ))}
              </div>
            </>
          )}
        </CardPanel>
      </Card>
    </div>
  );
}
