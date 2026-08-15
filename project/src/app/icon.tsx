import fs from "node:fs";
import path from "node:path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Real brand mark (see src/brand-assets/README.md) rendered ahead of time at the exact favicon size — no per-request image generation needed. */
export default function Icon() {
  const buffer = fs.readFileSync(path.join(process.cwd(), "src/brand-assets/icon.png"));
  return new Response(buffer, { headers: { "Content-Type": contentType } });
}
