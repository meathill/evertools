"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/ads";

type AdSenseUnitProps = {
  /** AdSense 广告位 ID；未配置时不渲染、不预留空间。 */
  slotId: string | undefined;
};

// 336x280：移动端 412 视口去掉左右 padding 后放得下，桌面端 mx-auto 居中。
const UNIT_WIDTH = 336;
const UNIT_HEIGHT = 280;

/**
 * 固定尺寸手动广告位。ins 在 SSR HTML 里就占据精确空间，广告填充时
 * 不会引起布局位移——这是它相对自动广告的核心价值。
 * 槽位 ID 必须在 AdSense 控制台建为同尺寸（336x280）的固定单元，
 * 尺寸不一致时创意会被裁切而不是位移。
 */
export function AdSenseUnit({ slotId }: AdSenseUnitProps) {
  useEffect(() => {
    if (!slotId) {
      return;
    }

    // adsbygoogle.js 是 lazyOnload，这里 push 只进队列，脚本加载后统一处理。
    const queue = ((window as { adsbygoogle?: unknown[] }).adsbygoogle ??= []);
    queue.push({});
  }, [slotId]);

  if (!slotId) {
    return null;
  }

  return (
    <div
      className="mx-auto my-6"
      style={{ height: UNIT_HEIGHT, width: UNIT_WIDTH }}
    >
      <ins
        className="adsbygoogle block"
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        style={{ height: UNIT_HEIGHT, width: UNIT_WIDTH }}
      />
    </div>
  );
}
