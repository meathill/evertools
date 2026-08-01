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
import { type FormEvent, useMemo, useRef, useState } from "react";
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
import { useFileDropInput } from "@/hooks/use-file-drop-input";
import { formatBytes } from "@/lib/format";
import {
  decryptWithPassword,
  detectAndUnlock,
  looksLikePdf,
  type QpdfRunner,
} from "@/lib/pdf-password-remover/decrypt";
import { getPdfPasswordRemoverErrorMessage } from "@/lib/pdf-password-remover/error-messages";
import {
  PDF_PASSWORD_REMOVER_ERROR_CODES,
  parsePdfPasswordRemoverError,
} from "@/lib/pdf-password-remover/errors";
import {
  type EngineProgress,
  isEngineLoaded,
  loadEngine,
  runQpdf,
} from "@/lib/pdf-password-remover/qpdf";
import {
  buildOutputFilename,
  isAcceptedPdfType,
  MAX_PDF_FILE_SIZE,
  type Phase,
  type ResultKind,
} from "@/lib/pdf-password-remover/types";
import type { LocaleContent } from "@/messages/types";

type PdfPasswordRemoverClientProps = {
  content: LocaleContent["pdfPasswordRemover"];
};

export function PdfPasswordRemoverClient({
  content,
}: PdfPasswordRemoverClientProps) {
  const client = content.client;

  const inputBytesRef = useRef<Uint8Array | null>(null);
  const resultBytesRef = useRef<Uint8Array | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [fileMeta, setFileMeta] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [resultKind, setResultKind] = useState<ResultKind | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const [engineOpen, setEngineOpen] = useState(false);
  const [enginePercent, setEnginePercent] = useState<number | null>(null);
  const [engineError, setEngineError] = useState(false);

  const runner = useRef<QpdfRunner>((args, outputPath) => {
    const bytes = inputBytesRef.current;
    if (!bytes) {
      return Promise.reject(
        new Error(PDF_PASSWORD_REMOVER_ERROR_CODES.UNSUPPORTED_FORMAT),
      );
    }
    return runQpdf(bytes, args, outputPath);
  });

  function handleFatal(error: unknown) {
    const parsed = parsePdfPasswordRemoverError(error);
    setFatalError(
      getPdfPasswordRemoverErrorMessage(
        parsed.code,
        parsed.detail ?? null,
        content,
      ),
    );
    setPhase("error");
  }

  async function ensureEngine(): Promise<boolean> {
    if (isEngineLoaded()) {
      return true;
    }
    setEngineError(false);
    setEnginePercent(null);
    setEngineOpen(true);
    try {
      await loadEngine((progress: EngineProgress) => {
        setEnginePercent(
          progress.total
            ? Math.min(
                100,
                Math.round((progress.received / progress.total) * 100),
              )
            : null,
        );
      });
      setEngineOpen(false);
      return true;
    } catch {
      setEngineError(true);
      return false;
    }
  }

  async function runDetection() {
    setPhase("detecting");
    try {
      const result = await detectAndUnlock(runner.current);
      if (result.status === "password-required") {
        setPhase("need-password");
        return;
      }
      if (result.status === "owner-only") {
        resultBytesRef.current = result.output;
        setResultKind("owner-only");
      } else {
        resultBytesRef.current = inputBytesRef.current;
        setResultKind("not-encrypted");
      }
      setPhase("done");
    } catch (error) {
      handleFatal(error);
    }
  }

  async function startProcessing() {
    const loaded = await ensureEngine();
    if (!loaded) {
      return;
    }
    await runDetection();
  }

  async function handleFile(file: File) {
    setFatalError(null);
    setPasswordError(false);
    setPassword("");
    setResultKind(null);
    resultBytesRef.current = null;

    if (
      !isAcceptedPdfType(file.type) &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      inputBytesRef.current = null;
      setFileMeta(null);
      setFatalError(
        getPdfPasswordRemoverErrorMessage(
          PDF_PASSWORD_REMOVER_ERROR_CODES.UNSUPPORTED_FORMAT,
          null,
          content,
        ),
      );
      setPhase("error");
      return;
    }
    if (file.size > MAX_PDF_FILE_SIZE) {
      inputBytesRef.current = null;
      setFileMeta(null);
      setFatalError(
        getPdfPasswordRemoverErrorMessage(
          PDF_PASSWORD_REMOVER_ERROR_CODES.FILE_TOO_LARGE,
          null,
          content,
        ),
      );
      setPhase("error");
      return;
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!looksLikePdf(bytes)) {
      inputBytesRef.current = null;
      setFileMeta(null);
      setFatalError(
        getPdfPasswordRemoverErrorMessage(
          PDF_PASSWORD_REMOVER_ERROR_CODES.UNSUPPORTED_FORMAT,
          null,
          content,
        ),
      );
      setPhase("error");
      return;
    }

    inputBytesRef.current = bytes;
    setFileMeta({ name: file.name, size: file.size });
    await startProcessing();
  }

  const drop = useFileDropInput((files) => {
    const file = files[0];
    if (file) {
      void handleFile(file);
    }
  });

  async function handleSubmitPassword(event: FormEvent) {
    event.preventDefault();
    if (phase === "decrypting") {
      return;
    }
    setPasswordError(false);
    setPhase("decrypting");
    try {
      const output = await decryptWithPassword(runner.current, password);
      resultBytesRef.current = output;
      setResultKind("user-password");
      setPhase("done");
    } catch (error) {
      const parsed = parsePdfPasswordRemoverError(error);
      if (parsed.code === PDF_PASSWORD_REMOVER_ERROR_CODES.INVALID_PASSWORD) {
        setPasswordError(true);
        setPhase("need-password");
        return;
      }
      handleFatal(error);
    }
  }

  function handleDownload() {
    const bytes = resultBytesRef.current;
    if (!bytes || !fileMeta) {
      return;
    }
    const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = buildOutputFilename(fileMeta.name);
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handleReset() {
    inputBytesRef.current = null;
    resultBytesRef.current = null;
    setFileMeta(null);
    setPassword("");
    setPasswordError(false);
    setResultKind(null);
    setFatalError(null);
    setPhase("idle");
  }

  const resultMessage = useMemo(() => {
    switch (resultKind) {
      case "user-password":
        return client.result.userPasswordSuccess;
      case "owner-only":
        return client.result.ownerOnlySuccess;
      case "not-encrypted":
        return client.result.notEncryptedSuccess;
      default:
        return null;
    }
  }, [resultKind, client.result]);

  const isBusy = phase === "detecting" || phase === "decrypting";

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
