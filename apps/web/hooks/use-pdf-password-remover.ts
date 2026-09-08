import { type FormEvent, useMemo, useRef, useState } from "react";
import { useFileDropInput } from "@/hooks/use-file-drop-input";
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

// PDF 去密码的状态机：文件校验 → 引擎懒加载 → 检测 → 输密码解密 → 下载。
// 纯编排逻辑从客户端组件里抽出，组件只剩 JSX；与 use-image-converter 系列 hook 同构。
export function usePdfPasswordRemover(
  content: LocaleContent["pdfPasswordRemover"],
) {
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

  const client = content.client;
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

  return {
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
  };
}

export type PdfPasswordRemoverController = ReturnType<
  typeof usePdfPasswordRemover
>;
