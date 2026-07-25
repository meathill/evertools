import {
  INPUT_PATH,
  type QpdfRunResult,
} from "@/lib/pdf-password-remover/decrypt";
import {
  createPdfPasswordRemoverError,
  PDF_PASSWORD_REMOVER_ERROR_CODES,
} from "@/lib/pdf-password-remover/errors";

// 此 glue 构建（Emscripten）只识别 locateFile（无 wasmBinary/printErr 选项），
// 所以 wasm 由我们 fetch（带下载进度）后转成 blob URL 交给 locateFile。
export type QpdfInstance = {
  callMain: (args: string[]) => number;
  FS: {
    writeFile: (path: string, data: Uint8Array) => void;
    readFile: (path: string) => Uint8Array;
    unlink: (path: string) => void;
  };
};

type QpdfFactory = (options: {
  locateFile: () => string;
}) => Promise<QpdfInstance>;

export type EngineProgress = {
  received: number;
  total: number | null;
};

const CDN_SOURCES = [
  {
    js: "https://cdn.jsdelivr.net/npm/@neslinesli93/qpdf-wasm@0.3.0/dist/qpdf.js",
    wasm: "https://cdn.jsdelivr.net/npm/@neslinesli93/qpdf-wasm@0.3.0/dist/qpdf.wasm",
  },
  {
    js: "https://unpkg.com/@neslinesli93/qpdf-wasm@0.3.0/dist/qpdf.js",
    wasm: "https://unpkg.com/@neslinesli93/qpdf-wasm@0.3.0/dist/qpdf.wasm",
  },
] as const;

let cachedFactory: QpdfFactory | null = null;
let cachedWasmUrl: string | null = null;

// glue 是 UMD：拉取源码后用 CommonJS 外壳求值取出工厂，避免依赖 <script> onload
// 时序与全局 window.Module 清理（两者在 React 严格模式下并发挂载时不可靠）。
async function loadGlueFactory(src: string): Promise<QpdfFactory> {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`failed to load qpdf glue: ${src} (${response.status})`);
  }
  const source = await response.text();
  const moduleShim: { exports: { default?: QpdfFactory } | QpdfFactory } = {
    exports: {},
  };
  const evaluate = new Function("module", "exports", source) as (
    module: typeof moduleShim,
    exports: typeof moduleShim.exports,
  ) => void;
  evaluate(moduleShim, moduleShim.exports);
  const exported = moduleShim.exports as
    | QpdfFactory
    | { default?: QpdfFactory };
  const factory = typeof exported === "function" ? exported : exported.default;
  if (typeof factory !== "function") {
    throw new Error(`qpdf glue exported no factory: ${src}`);
  }
  return factory;
}

async function fetchWasmWithProgress(
  url: string,
  onProgress?: (progress: EngineProgress) => void,
): Promise<string> {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`failed to fetch qpdf.wasm: ${url} (${response.status})`);
  }

  const contentLength = Number(response.headers.get("content-length"));
  const total =
    Number.isFinite(contentLength) && contentLength > 0 ? contentLength : null;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    received += value.length;
    onProgress?.({ received, total });
  }

  const blob = new Blob(chunks as BlobPart[], { type: "application/wasm" });
  return URL.createObjectURL(blob);
}

// 严格懒加载：仅在用户选择文件后调用。主 CDN 失败自动改用备用 CDN，全部失败抛 LOAD_FAILED。
export async function loadEngine(
  onProgress?: (progress: EngineProgress) => void,
): Promise<void> {
  if (cachedFactory && cachedWasmUrl) {
    return;
  }

  let lastError: unknown = null;
  for (const source of CDN_SOURCES) {
    try {
      const factory = cachedFactory ?? (await loadGlueFactory(source.js));
      const wasmUrl = await fetchWasmWithProgress(source.wasm, onProgress);
      cachedFactory = factory;
      cachedWasmUrl = wasmUrl;
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw createPdfPasswordRemoverError(
    PDF_PASSWORD_REMOVER_ERROR_CODES.LOAD_FAILED,
    lastError instanceof Error ? lastError.message : undefined,
  );
}

export function isEngineLoaded(): boolean {
  return cachedFactory !== null && cachedWasmUrl !== null;
}

// 每次运行创建全新实例（callMain 退出后运行时状态不可复用）；wasm 走内存 blob，无网络成本。
export async function runQpdf(
  inputBytes: Uint8Array,
  args: string[],
  outputPath?: string,
): Promise<QpdfRunResult> {
  await loadEngine();
  const factory = cachedFactory;
  const wasmUrl = cachedWasmUrl;
  if (!factory || !wasmUrl) {
    throw createPdfPasswordRemoverError(
      PDF_PASSWORD_REMOVER_ERROR_CODES.LOAD_FAILED,
    );
  }

  // qpdf 把 "invalid password" 等诊断写到 console.error（此 glue 构建不支持 printErr
  // 选项），且 Emscripten 在实例化时就绑定了当前的 console.error 引用。检测阶段的空密码
  // 试解本就会产生这类预期输出，因此从实例化到 callMain 全程临时接管 console.error，
  // 避免污染控制台与 Next 报错浮层。整段是同步执行，不会漏接其他日志。
  const originalError = console.error;
  console.error = () => {};
  let instance: QpdfInstance;
  let exitCode: number;
  try {
    instance = await factory({ locateFile: () => wasmUrl });
    instance.FS.writeFile(INPUT_PATH, inputBytes);
    exitCode = instance.callMain(args);
  } finally {
    console.error = originalError;
  }

  let output: Uint8Array | undefined;
  if (outputPath !== undefined && (exitCode === 0 || exitCode === 3)) {
    output = instance.FS.readFile(outputPath);
  }

  return { exitCode, output };
}
