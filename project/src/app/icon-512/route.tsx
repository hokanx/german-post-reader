import fs from "node:fs";
import path from "node:path";

/** Stable-URL icon for manifest.ts's `icons` array (Android install prompt + iOS 16.4+ manifest-aware installs). Real brand mark, pre-rendered — see src/brand-assets/README.md. */
export async function GET() {
  const buffer = fs.readFileSync(path.join(process.cwd(), "public/icon-512.png"));
  return new Response(buffer, { headers: { "Content-Type": "image/png" } });
}
