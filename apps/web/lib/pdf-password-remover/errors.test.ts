import { describe, expect, it } from "vitest";
import {
  createPdfPasswordRemoverError,
  PDF_PASSWORD_REMOVER_ERROR_CODES,
  parsePdfPasswordRemoverError,
} from "@/lib/pdf-password-remover/errors";

describe("createPdfPasswordRemoverError / parsePdfPasswordRemoverError", () => {
  it.each(Object.values(PDF_PASSWORD_REMOVER_ERROR_CODES))(
    "round-trips %s without detail",
    (code) => {
      const error = createPdfPasswordRemoverError(code);
      expect(parsePdfPasswordRemoverError(error)).toEqual({
        code,
        detail: undefined,
      });
    },
  );

  it("round-trips code with detail", () => {
    const error = createPdfPasswordRemoverError(
      PDF_PASSWORD_REMOVER_ERROR_CODES.DECRYPT_FAILED,
      "exit code 2",
    );
    expect(parsePdfPasswordRemoverError(error)).toEqual({
      code: PDF_PASSWORD_REMOVER_ERROR_CODES.DECRYPT_FAILED,
      detail: "exit code 2",
    });
  });

  it("keeps detail containing separator", () => {
    const error = createPdfPasswordRemoverError(
      PDF_PASSWORD_REMOVER_ERROR_CODES.LOAD_FAILED,
      "a::b",
    );
    expect(parsePdfPasswordRemoverError(error)).toEqual({
      code: PDF_PASSWORD_REMOVER_ERROR_CODES.LOAD_FAILED,
      detail: "a::b",
    });
  });

  it("returns null code for unknown error message", () => {
    expect(parsePdfPasswordRemoverError(new Error("boom"))).toEqual({
      code: null,
      detail: "boom",
    });
  });

  it("returns null code for non-error values", () => {
    expect(parsePdfPasswordRemoverError("boom")).toEqual({ code: null });
  });
});
