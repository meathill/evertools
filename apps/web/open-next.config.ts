import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// issue #5：Next 16.3 + cache interception 会触发无限 _rsc/segment prefetch
// 上游 opennextjs-cloudflare#1348 未合并前保持关闭，避免 Worker 请求跑量。
export default defineCloudflareConfig({
  enableCacheInterception: false,
});
