import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { siteIcons } from "@/lib/site";

const webRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const PNG_SIGNATURE = "89504e470d0a1a0a";

function readPngSize(bytes: Buffer): { height: number; width: number } {
  expect(bytes.subarray(0, 8).toString("hex")).toBe(PNG_SIGNATURE);
  expect(bytes.subarray(12, 16).toString("ascii")).toBe("IHDR");
  return {
    height: bytes.readUInt32BE(20),
    width: bytes.readUInt32BE(16),
  };
}

describe("site icons", () => {
  it("points Yandex at a 120px PNG and a 32px ICO", () => {
    expect(siteIcons).toEqual({
      icon: [
        { sizes: "120x120", type: "image/png", url: "/icon.png" },
        { sizes: "32x32", type: "image/x-icon", url: "/favicon.ico" },
      ],
    });
  });

  it("serves a real 120px PNG", async () => {
    const bytes = await readFile(path.join(webRoot, "public/icon.png"));

    expect(readPngSize(bytes)).toEqual({ height: 120, width: 120 });
  });

  it("serves a 32px ICO whose payload is a PNG", async () => {
    const bytes = await readFile(path.join(webRoot, "public/favicon.ico"));

    expect(bytes.readUInt16LE(0)).toBe(0);
    expect(bytes.readUInt16LE(2)).toBe(1);
    expect(bytes.readUInt16LE(4)).toBe(1);
    expect(bytes[6]).toBe(32);
    expect(bytes[7]).toBe(32);

    const imageOffset = bytes.readUInt32LE(18);
    expect(bytes.subarray(imageOffset, imageOffset + 8).toString("hex")).toBe(
      PNG_SIGNATURE,
    );
    expect(readPngSize(bytes.subarray(imageOffset))).toEqual({
      height: 32,
      width: 32,
    });
  });
});
