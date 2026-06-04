import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { StructuredData } from "@/components/structured-data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import type { ToolFaq } from "@/lib/content";

type ScenarioRow = {
  icon: LucideIcon;
  text: string;
};

type ToolInfoCard = {
  description: string;
  items: readonly string[];
  title: string;
};

type ToolContentSection = {
  faqDescription: string;
  faqTitle: string;
  stepsDescription: string;
  stepsTitle: string;
  supportDescription: string;
  supportTitle: string;
};

type ToolPageLayoutProps = {
  badges: readonly [string, string, string];
  children: ReactNode;
  contentSection: ToolContentSection;
  description: string;
  faq: readonly ToolFaq[];
  features: readonly string[];
  infoCard: ToolInfoCard;
  scenarios: {
    description: string;
    rows: readonly ScenarioRow[];
    title: string;
  };
  steps: readonly string[];
  structuredData: Array<Record<string, unknown>>;
  title: string;
};

export function ToolPageLayout({
  badges,
  children,
  contentSection,
  description,
  faq,
  features,
  infoCard,
  scenarios,
  steps,
  structuredData,
  title,
}: ToolPageLayoutProps) {
  return (
    <>
      <StructuredData data={structuredData} />

      <section className="border-b border-rule">
        <div className="absolute inset-0 bg-sun" />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:py-18">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="yellow">{badges[0]}</Badge>
              <Badge variant="info">{badges[1]}</Badge>
              <Badge variant="outline">{badges[2]}</Badge>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-display font-bold text-4xl tracking-tight text-ink leading-tight sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-3xl text-base text-ink-soft leading-relaxed sm:text-lg">
                {description}
              </p>
            </div>
          </div>

          <Card className="border-2 border-ink shadow-press-ink">
            <CardHeader className="border-b border-rule bg-paper-deep/50">
              <CardTitle>{scenarios.title}</CardTitle>
              <CardDescription>{scenarios.description}</CardDescription>
            </CardHeader>
            <CardPanel className="space-y-4 text-sm text-ink-soft leading-relaxed">
              {scenarios.rows.map((row) => {
                const Icon = row.icon;
                return (
                  <div className="flex gap-3" key={row.text}>
                    <Icon className="mt-0.5 size-4.5 shrink-0 text-yellow-deep" />
                    <p>{row.text}</p>
                  </div>
                );
              })}
            </CardPanel>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {children}
      </section>

      <section className="border-t border-rule bg-fluff/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <ContentCard
              description={contentSection.supportDescription}
              items={features}
              title={contentSection.supportTitle}
            />
            <ContentCard
              description={contentSection.stepsDescription}
              items={steps}
              ordered
              title={contentSection.stepsTitle}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{infoCard.title}</CardTitle>
                <CardDescription>{infoCard.description}</CardDescription>
              </CardHeader>
              <CardPanel className="space-y-3 text-ink-soft text-sm leading-relaxed">
                {infoCard.items.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </CardPanel>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{contentSection.faqTitle}</CardTitle>
                <CardDescription>
                  {contentSection.faqDescription}
                </CardDescription>
              </CardHeader>
              <CardPanel className="space-y-4">
                {faq.map((item) => (
                  <div className="space-y-1" key={item.question}>
                    <h3 className="font-bold text-ink text-sm">
                      {item.question}
                    </h3>
                    <p className="text-ink-soft text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </CardPanel>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

type ContentCardProps = {
  description: string;
  items: readonly string[];
  ordered?: boolean;
  title: string;
};

function ContentCard({
  description,
  items,
  ordered = false,
  title,
}: ContentCardProps) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardPanel>
        <ListTag className="space-y-3 text-ink-soft text-sm leading-relaxed">
          {items.map((item, index) => (
            <li className="flex gap-3" key={item}>
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-yellow text-ink font-mono text-xs font-bold shadow-press-yellow">
                {ordered ? index + 1 : "•"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ListTag>
      </CardPanel>
    </Card>
  );
}
