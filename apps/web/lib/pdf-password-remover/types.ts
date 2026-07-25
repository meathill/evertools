export const ACCEPTED_PDF_TYPES = ["application/pdf"] as const;

export const MAX_PDF_FILE_SIZE = 50 * 1024 * 1024;

export type ResultKind = "not-encrypted" | "owner-only" | "user-password";

export type Phase =
  | "idle"
  | "loading-engine"
  | "detecting"
  | "need-password"
  | "decrypting"
  | "done"
  | "error";

export function isAcceptedPdfType(type: string): boolean {
  return (ACCEPTED_PDF_TYPES as readonly string[]).includes(type);
}

export function buildOutputFilename(sourceName: string): string {
  const baseName = sourceName.replace(/\.[^.]+$/, "").trim() || "document";
  return `${baseName}-unlocked.pdf`;
}
