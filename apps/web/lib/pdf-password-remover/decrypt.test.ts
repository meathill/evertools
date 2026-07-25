import { describe, expect, it } from "vitest";
import {
  buildDecryptArgs,
  buildIsEncryptedArgs,
  buildRequiresPasswordArgs,
  decryptWithPassword,
  detectAndUnlock,
  INPUT_PATH,
  looksLikePdf,
  OUTPUT_PATH,
  type QpdfRunner,
  type QpdfRunResult,
} from "@/lib/pdf-password-remover/decrypt";
import { parsePdfPasswordRemoverError } from "@/lib/pdf-password-remover/errors";

function createRunner(results: readonly QpdfRunResult[]): {
  run: QpdfRunner;
  calls: string[][];
} {
  const calls: string[][] = [];
  let index = 0;
  const run: QpdfRunner = (args) => {
    calls.push(args);
    const result = results[index] ?? results[results.length - 1];
    index += 1;
    return Promise.resolve(result);
  };
  return { run, calls };
}

const bytes = new Uint8Array([1, 2, 3]);

describe("arg builders", () => {
  it("builds decrypt args, keeping special characters intact", () => {
    expect(buildDecryptArgs("a=b c::d")).toEqual([
      "--password=a=b c::d",
      "--decrypt",
      INPUT_PATH,
      OUTPUT_PATH,
    ]);
  });

  it("builds requires-password and is-encrypted args", () => {
    expect(buildRequiresPasswordArgs("pw")).toEqual([
      "--password=pw",
      "--requires-password",
      INPUT_PATH,
    ]);
    expect(buildIsEncryptedArgs()).toEqual(["--is-encrypted", INPUT_PATH]);
  });
});

describe("looksLikePdf", () => {
  it("accepts a leading %PDF- marker", () => {
    expect(looksLikePdf(new TextEncoder().encode("%PDF-1.7\n..."))).toBe(true);
  });

  it("rejects content without the marker", () => {
    expect(looksLikePdf(new TextEncoder().encode("not a pdf"))).toBe(false);
  });
});

describe("detectAndUnlock", () => {
  it("returns password-required when empty-password decrypt fails", async () => {
    const { run, calls } = createRunner([{ exitCode: 2 }]);
    await expect(detectAndUnlock(run)).resolves.toEqual({
      status: "password-required",
    });
    expect(calls).toEqual([
      ["--password=", "--decrypt", INPUT_PATH, OUTPUT_PATH],
    ]);
  });

  it("returns owner-only with output when the file is encrypted but opens empty", async () => {
    const { run } = createRunner([
      { exitCode: 0, output: bytes },
      { exitCode: 0 },
    ]);
    await expect(detectAndUnlock(run)).resolves.toEqual({
      status: "owner-only",
      output: bytes,
    });
  });

  it("returns not-encrypted when the file is not encrypted", async () => {
    const { run } = createRunner([
      { exitCode: 0, output: bytes },
      { exitCode: 2 },
    ]);
    await expect(detectAndUnlock(run)).resolves.toEqual({
      status: "not-encrypted",
    });
  });
});

describe("decryptWithPassword", () => {
  it("verifies password then returns decrypted output", async () => {
    const { run, calls } = createRunner([
      { exitCode: 3 },
      { exitCode: 0, output: bytes },
    ]);
    await expect(decryptWithPassword(run, "secret")).resolves.toBe(bytes);
    expect(calls).toEqual([
      ["--password=secret", "--requires-password", INPUT_PATH],
      ["--password=secret", "--decrypt", INPUT_PATH, OUTPUT_PATH],
    ]);
  });

  it("treats decrypt exit 3 (warnings) as success", async () => {
    const { run } = createRunner([
      { exitCode: 3 },
      { exitCode: 3, output: bytes },
    ]);
    await expect(decryptWithPassword(run, "secret")).resolves.toBe(bytes);
  });

  it("throws INVALID_PASSWORD when verification fails", async () => {
    const { run, calls } = createRunner([{ exitCode: 2 }]);
    await expect(decryptWithPassword(run, "wrong")).rejects.toThrow(
      "INVALID_PASSWORD",
    );
    expect(calls).toHaveLength(1);
  });

  it("throws DECRYPT_FAILED when decrypt errors after verification", async () => {
    const { run } = createRunner([{ exitCode: 3 }, { exitCode: 2 }]);
    await expect(decryptWithPassword(run, "secret")).rejects.toThrow(
      "DECRYPT_FAILED::exit code 2",
    );
  });

  it("throws DECRYPT_FAILED when decrypt succeeds without output", async () => {
    const { run } = createRunner([{ exitCode: 3 }, { exitCode: 0 }]);
    await expect(decryptWithPassword(run, "secret")).rejects.toThrow(
      "DECRYPT_FAILED",
    );
  });

  it("propagates the correct error code", async () => {
    const { run } = createRunner([{ exitCode: 2 }]);
    try {
      await decryptWithPassword(run, "wrong");
      expect.unreachable();
    } catch (error) {
      expect(parsePdfPasswordRemoverError(error).code).toBe("INVALID_PASSWORD");
    }
  });
});
