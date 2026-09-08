"use client";

import {
  CheckCircle2Icon,
  FileTextIcon,
  KeyRoundIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  UnlockIcon,
  UploadIcon,
} from "lucide-react";
import { PdfPasswordRemoverLoadingDialog } from "@/components/tools/pdf-password-remover-loading-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { DropZone } from "@/components/ui/drop-zone";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usePdfPasswordRemover } from "@/hooks/use-pdf-password-remover";
import { formatBytes } from "@/lib/format";
import { MAX_PDF_FILE_SIZE } from "@/lib/pdf-password-remover/types";
import type { LocaleContent } from "@/messages/types";

type PdfPasswordRemoverClientProps = {
  content: LocaleContent["pdfPasswordRemover"];
};

export function PdfPasswordRemoverClient({
  content,
}: PdfPasswordRemoverClientProps) {
  const client = content.client;
  const {
    drop,
    engineError,
    engineOpen,
    enginePercent,
    fatalError,
    fileMeta,
    handleDownload,
    handleReset,
    handleSubmitPassword,
    isBusy,
    password,
    passwordError,
    phase,
    resultMessage,
    setPassword,
    startProcessing,
  } = usePdfPasswordRemover(content);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 p-6">
      <Card className="overflow-hidden border-2 border-ink shadow-press-ink">
        <CardHeader className="border-b border-rule/60 bg-paper-deep/35">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">
              <ShieldCheckIcon />
              {client.badges.localProcessing}
            </Badge>
            <Badge variant="outline">{client.badges.supportedFormats}</Badge>
            <Badge variant="secondary">{client.badges.noUpload}</Badge>
          </div>
          <div className="space-y-2">
            <CardTitle>{client.upload.title}</CardTitle>
            <CardDescription>{client.upload.description}</CardDescription>
          </div>
        </CardHeader>
        <CardPanel>
          <DropZone
            isDragging={drop.isDragging}
            onDragLeave={drop.handleDragLeave}
            onDragOver={drop.handleDragOver}
            onDrop={drop.handleDrop}
          >
            <input
              accept="application/pdf,.pdf"
              className="sr-only"
              id={drop.inputId}
              onChange={drop.handleFileInputChange}
              ref={drop.inputRef}
              type="file"
            />
            {fileMeta ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-ink text-sm">
                    {fileMeta.name}
                  </div>
                  <div className="text-mute text-xs">
                    {formatBytes(fileMeta.size)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={drop.handleBrowseClick}
                    size="sm"
                    variant="outline"
                  >
                    {client.upload.reselect}
                  </Button>
                  <Button onClick={handleReset} size="sm" variant="ghost">
                    <RefreshCcwIcon />
                    {client.upload.clear}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-56 flex-col items-center justify-center gap-4 text-center">
                <div className="flex size-14 items-center justify-center rounded-lg bg-yellow text-ink shadow-press-yellow">
                  <FileTextIcon className="size-6" />
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-ink text-lg">
                    {client.upload.emptyTitle}
                  </div>
                  <p className="max-w-md text-mute text-sm leading-6">
                    {client.upload.emptyDescription}
                  </p>
                </div>
                <Button
                  loading={isBusy}
                  onClick={drop.handleBrowseClick}
                  variant="press"
                >
                  <UploadIcon />
                  {client.upload.choosePdf}
                </Button>
                <p className="text-mute text-xs">
                  {client.upload.maxSizeHint.replace(
                    "{size}",
                    formatBytes(MAX_PDF_FILE_SIZE),
                  )}
                </p>
              </div>
            )}
          </DropZone>
        </CardPanel>
      </Card>

      {phase === "detecting" ? (
        <p className="text-center text-mute text-sm">
          {client.status.detecting}
        </p>
      ) : null}

      {phase === "need-password" || phase === "decrypting" ? (
        <Card className="border-2 border-ink shadow-press-ink">
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRoundIcon className="size-5 text-ink" />
              <CardTitle>{client.password.title}</CardTitle>
            </div>
            <CardDescription>{client.password.description}</CardDescription>
          </CardHeader>
          <CardPanel>
            <form className="space-y-4" onSubmit={handleSubmitPassword}>
              <Field>
                <FieldLabel htmlFor="pdf-password">
                  {client.password.label}
                </FieldLabel>
                <Input
                  autoComplete="off"
                  autoFocus
                  id="pdf-password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={client.password.placeholder}
                  type="password"
                  value={password}
                />
                {passwordError ? (
                  <p className="text-destructive text-sm">
                    {client.password.wrongPassword}
                  </p>
                ) : null}
              </Field>
              <Button
                disabled={password.length === 0}
                loading={phase === "decrypting"}
                type="submit"
                variant="press"
              >
                <UnlockIcon />
                {phase === "decrypting"
                  ? client.password.submitting
                  : client.password.submit}
              </Button>
            </form>
          </CardPanel>
        </Card>
      ) : null}

      {phase === "done" && resultMessage ? (
        <Card className="border-2 border-ink shadow-press-ink">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="size-5 text-emerald-600" />
              <CardTitle>{client.result.title}</CardTitle>
            </div>
            <CardDescription>{resultMessage}</CardDescription>
          </CardHeader>
          <CardPanel className="space-y-3">
            <Button onClick={handleDownload} variant="press">
              <UnlockIcon />
              {client.result.downloadButton}
            </Button>
            <p className="text-mute text-xs">{client.result.privacyNote}</p>
          </CardPanel>
        </Card>
      ) : null}

      {phase === "error" && fatalError ? (
        <Alert variant="error">
          <AlertTitle>{fatalError}</AlertTitle>
          <AlertDescription>
            <Button
              className="mt-1"
              onClick={handleReset}
              size="sm"
              variant="outline"
            >
              {client.upload.reselect}
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <PdfPasswordRemoverLoadingDialog
        content={client.loading}
        hasError={engineError}
        onRetry={() => void startProcessing()}
        open={engineOpen}
        percent={enginePercent}
      />
    </div>
  );
}
