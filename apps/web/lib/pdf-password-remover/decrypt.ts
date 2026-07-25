import {
  createPdfPasswordRemoverError,
  PDF_PASSWORD_REMOVER_ERROR_CODES,
} from "@/lib/pdf-password-remover/errors";

export const INPUT_PATH = "/input.pdf";
export const OUTPUT_PATH = "/output.pdf";

// 实测（qpdf 12.2.0 wasm 构建）退出码与官方文档不符：所有 "invalid password"
// 错误都直接 exit 2，不走 --requires-password / --is-encrypted 文档中的特殊码路径。
// 实测矩阵：
//   --decrypt 空密码：无密码文件 0；仅权限密码 0；需要密码 2
//   --is-encrypted（仅在文件可打开时可靠）：加密 0；未加密 2
//   --requires-password 带密码：密码正确 3；密码错误/未加密 2
export type QpdfRunResult = {
  exitCode: number;
  output?: Uint8Array;
};

export type QpdfRunner = (
  args: string[],
  outputPath?: string,
) => Promise<QpdfRunResult>;

export type DetectResult =
  | { status: "password-required" }
  | { status: "not-encrypted" }
  | { status: "owner-only"; output: Uint8Array };

export function buildDecryptArgs(password: string): string[] {
  return [`--password=${password}`, "--decrypt", INPUT_PATH, OUTPUT_PATH];
}

export function buildIsEncryptedArgs(): string[] {
  return ["--is-encrypted", INPUT_PATH];
}

export function buildRequiresPasswordArgs(password: string): string[] {
  return [`--password=${password}`, "--requires-password", INPUT_PATH];
}

// PDF 规范允许 %PDF- 头出现在文件前 1024 字节内。
export function looksLikePdf(bytes: Uint8Array): boolean {
  const head = bytes.subarray(0, 1024);
  const marker = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-
  outer: for (let i = 0; i + marker.length <= head.length; i += 1) {
    for (let j = 0; j < marker.length; j += 1) {
      if (head[i + j] !== marker[j]) {
        continue outer;
      }
    }
    return true;
  }
  return false;
}

function isSuccessWithOutput(
  result: QpdfRunResult,
): result is QpdfRunResult & { output: Uint8Array } {
  return (
    (result.exitCode === 0 || result.exitCode === 3) &&
    result.output !== undefined &&
    result.output.length > 0
  );
}

// 空密码试解：成功即拿到解锁结果（仅权限密码场景一步到位），失败说明需要密码。
export async function detectAndUnlock(run: QpdfRunner): Promise<DetectResult> {
  const attempt = await run(buildDecryptArgs(""), OUTPUT_PATH);

  if (!isSuccessWithOutput(attempt)) {
    return { status: "password-required" };
  }

  const probe = await run(buildIsEncryptedArgs());
  if (probe.exitCode === 0) {
    return { status: "owner-only", output: attempt.output };
  }
  return { status: "not-encrypted" };
}

export async function decryptWithPassword(
  run: QpdfRunner,
  password: string,
): Promise<Uint8Array> {
  const verify = await run(buildRequiresPasswordArgs(password));
  if (verify.exitCode !== 3) {
    throw createPdfPasswordRemoverError(
      PDF_PASSWORD_REMOVER_ERROR_CODES.INVALID_PASSWORD,
    );
  }

  const result = await run(buildDecryptArgs(password), OUTPUT_PATH);
  if (isSuccessWithOutput(result)) {
    return result.output;
  }

  throw createPdfPasswordRemoverError(
    PDF_PASSWORD_REMOVER_ERROR_CODES.DECRYPT_FAILED,
    `exit code ${result.exitCode}`,
  );
}
