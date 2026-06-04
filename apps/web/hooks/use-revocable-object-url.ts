import { useCallback, useEffect, useRef } from "react";

// 管理单个 object URL 的生命周期：替换时撤销旧的，组件卸载时撤销当前的。
// 返回的 replace 函数传入新 URL 或 null（清空）。
export function useRevocableObjectUrl() {
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    };
  }, []);

  return useCallback((nextUrl: string | null) => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }

    urlRef.current = nextUrl;
  }, []);
}
