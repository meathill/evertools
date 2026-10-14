import { existsSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Node 能直接剥 TypeScript 类型，但不解析 tsconfig paths，也不给无后缀的相对导入补 .ts。
// 这个钩子只服务 scripts/ 下的一次性脚本，不参与 Next 构建。
const webRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

function isFile(file) {
  return existsSync(file) && statSync(file).isFile();
}

function pickFile(base) {
  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, "index.ts"),
    base,
  ];
  return candidates.find((file) => isFile(file)) ?? null;
}

function isProjectFile(parentURL) {
  if (!parentURL?.startsWith("file:")) return false;
  const file = fileURLToPath(parentURL);
  return (
    file.startsWith(webRoot + path.sep) &&
    !file.includes(`${path.sep}node_modules${path.sep}`)
  );
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const hit = pickFile(path.join(webRoot, specifier.slice(2)));
      if (hit) return nextResolve(pathToFileURL(hit).href, context);
    }

    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      isProjectFile(context.parentURL)
    ) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const hit = pickFile(path.resolve(parentDir, specifier));
      if (hit) return nextResolve(pathToFileURL(hit).href, context);
    }

    return nextResolve(specifier, context);
  },
});

const target = process.argv[2];
if (!target) {
  console.error("usage: node scripts/run-ts.mjs <file.ts> [args...]");
  process.exit(1);
}

await import(pathToFileURL(path.resolve(target)).href);
