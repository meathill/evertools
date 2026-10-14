import {
  buildIndexNowPayload,
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
} from "@/lib/indexnow";

async function submitIndexNow(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const payload = buildIndexNowPayload();

  if (dryRun) {
    console.log(
      `dry-run ${payload.urlList.length} urls -> ${payload.keyLocation}`,
    );
    return;
  }

  const keyResponse = await fetch(payload.keyLocation);
  const keyBody = (await keyResponse.text()).trim();
  if (!keyResponse.ok || keyBody !== INDEXNOW_KEY) {
    throw new Error(
      `IndexNow key is not live at ${payload.keyLocation} (HTTP ${keyResponse.status}). Deploy first, then rerun.`,
    );
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    body: JSON.stringify(payload),
    headers: { "content-type": "application/json; charset=utf-8" },
    method: "POST",
  });

  if (response.status !== 200 && response.status !== 202) {
    const detail = (await response.text()).trim();
    throw new Error(
      `IndexNow rejected the batch (HTTP ${response.status})${detail ? `: ${detail}` : ""}.`,
    );
  }

  console.log(
    `IndexNow accepted ${payload.urlList.length} URLs (HTTP ${response.status}).`,
  );
}

submitIndexNow().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
