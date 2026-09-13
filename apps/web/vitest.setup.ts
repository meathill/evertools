// jsdom/Node 24 下全局 localStorage 不可用（Node 需要 --localstorage-file），
// 而 zustand persist 的 createJSONStorage 在模块加载时就求值一次。
// 这里提供一个内存版兜底，保证需要 localStorage 的测试（设置持久化等）
// 在任何环境下都能跑；真实浏览器里的 localStorage 不受影响。
function isLocalStorageUsable(): boolean {
  try {
    const storage = globalThis.localStorage;

    if (!storage || typeof storage.getItem !== "function") {
      return false;
    }

    storage.getItem("__evertools_probe__");

    return true;
  } catch {
    return false;
  }
}

if (!isLocalStorageUsable()) {
  const records = new Map<string, string>();

  const memoryStorage: Storage = {
    clear: () => {
      records.clear();
    },
    getItem: (key: string) =>
      records.has(key) ? (records.get(key) as string) : null,
    key: (index: number) => Array.from(records.keys())[index] ?? null,
    get length() {
      return records.size;
    },
    removeItem: (key: string) => {
      records.delete(key);
    },
    setItem: (key: string, value: string) => {
      records.set(key, String(value));
    },
  };

  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: memoryStorage,
    writable: true,
  });
}
