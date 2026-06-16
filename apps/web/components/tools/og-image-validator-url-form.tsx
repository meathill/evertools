import { RotateCwIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import type { OgImageValidatorController } from "@/hooks/use-og-image-validator";
import type { LocaleContent } from "@/messages/types";

type UrlFormProps = {
  content: LocaleContent["ogImageValidator"];
  controller: OgImageValidatorController;
};

export function OgImageValidatorUrlForm({ content, controller }: UrlFormProps) {
  const { client } = content;
  const {
    handleResubmit,
    handleSubmit,
    handleUrlChange,
    isFetching,
    result,
    urlInput,
  } = controller;
  const hasUrlResult = result?.mode === "url";

  return (
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
          {hasUrlResult ? (
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
  );
}
