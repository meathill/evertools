import { createRequire } from "node:module";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import {
  decryptWithPassword,
  detectAndUnlock,
  INPUT_PATH,
  type QpdfRunner,
} from "@/lib/pdf-password-remover/decrypt";
import { parsePdfPasswordRemoverError } from "@/lib/pdf-password-remover/errors";

// 跑真 wasm 的端到端验证：加密样本由 qpdf 自己生成，无需提交二进制 fixture。
const require = createRequire(import.meta.url);
const gluePath = require.resolve("@neslinesli93/qpdf-wasm");
const wasmPath = path.join(path.dirname(gluePath), "qpdf.wasm");

type QpdfInstance = {
  callMain: (args: string[]) => number;
  FS: {
    writeFile: (filePath: string, data: Uint8Array) => void;
    readFile: (filePath: string) => Uint8Array;
  };
};

type QpdfFactory = (options: {
  locateFile: () => string;
}) => Promise<QpdfInstance>;

const factory = require("@neslinesli93/qpdf-wasm") as QpdfFactory;

function createRunner(inputBytes: Uint8Array): QpdfRunner {
  return async (args, outputPath) => {
    const instance = await factory({ locateFile: () => wasmPath });
    instance.FS.writeFile(INPUT_PATH, inputBytes);
    const exitCode = instance.callMain(args);
    let output: Uint8Array | undefined;
    if (outputPath !== undefined && (exitCode === 0 || exitCode === 3)) {
      output = instance.FS.readFile(outputPath);
    }
    return { exitCode, output };
  };
}

async function createPlainPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([200, 200]);
  page.drawText("hello qpdf", { x: 40, y: 100, size: 12 });
  return doc.save();
}

async function encryptPdf(
  plainBytes: Uint8Array,
  userPassword: string,
  ownerPassword: string,
): Promise<Uint8Array> {
  const instance = await factory({ locateFile: () => wasmPath });
  instance.FS.writeFile("/plain.pdf", plainBytes);
  const exitCode = instance.callMain([
    "--encrypt",
    userPassword,
    ownerPassword,
    "256",
    "--",
    "/plain.pdf",
    "/encrypted.pdf",
  ]);
  expect(exitCode).toBe(0);
  return instance.FS.readFile("/encrypted.pdf");
}

describe("qpdf wasm integration", () => {
  it("detects an unencrypted file", async () => {
    const plain = await createPlainPdf();
    await expect(detectAndUnlock(createRunner(plain))).resolves.toMatchObject({
      status: "not-encrypted",
    });
  });

  it("removes a user password and produces a loadable PDF", async () => {
    const plain = await createPlainPdf();
    const encrypted = await encryptPdf(plain, "user-secret", "owner-secret");
    const run = createRunner(encrypted);

    await expect(detectAndUnlock(run)).resolves.toMatchObject({
      status: "password-required",
    });

    const decrypted = await decryptWithPassword(run, "user-secret");
    const reloaded = await PDFDocument.load(decrypted);
    expect(reloaded.getPageCount()).toBe(1);
  });

  it("rejects a wrong password with INVALID_PASSWORD", async () => {
    const plain = await createPlainPdf();
    const encrypted = await encryptPdf(plain, "user-secret", "owner-secret");

    try {
      await decryptWithPassword(createRunner(encrypted), "wrong");
      expect.unreachable();
    } catch (error) {
      expect(parsePdfPasswordRemoverError(error).code).toBe("INVALID_PASSWORD");
    }
  });

  it("unlocks owner-password-only files without a password", async () => {
    const plain = await createPlainPdf();
    const encrypted = await encryptPdf(plain, "", "owner-secret");
    const result = await detectAndUnlock(createRunner(encrypted));

    expect(result.status).toBe("owner-only");
    if (result.status !== "owner-only") {
      return;
    }
    const reloaded = await PDFDocument.load(result.output);
    expect(reloaded.getPageCount()).toBe(1);
  });
}, 60_000);
