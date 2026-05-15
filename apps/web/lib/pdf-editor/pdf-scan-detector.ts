export type ScanDetectionInput = {
  pageCount: number;
  totalTextChars: number;
};

export function detectScannedPdf(input: ScanDetectionInput): boolean {
  if (input.pageCount <= 0) {
    return true;
  }

  const threshold = Math.max(20, input.pageCount * 5);

  return input.totalTextChars < threshold;
}
