import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSitemapEntries, renderSitemapXml } from "@/lib/sitemap-document";

const webRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const entries = buildSitemapEntries();
const destination = path.join(webRoot, "public/sitemap.xml");

writeFileSync(destination, renderSitemapXml(entries));
console.log(`Wrote ${entries.length} URLs to ${destination}`);
