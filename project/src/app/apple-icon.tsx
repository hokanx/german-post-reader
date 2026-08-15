import fs from "node:fs";
import path from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS Home Screen icon must be fully opaque — iOS applies its own rounded-
 * square mask, so this uses the full-bleed "app icon store" variant of the
 * brand mark (see src/brand-assets/README.md), not the pre-rounded one.
 */
export default function AppleIcon() {
  const buffer = fs.readFileSync(path.join(process.cwd(), "src/brand-assets/apple-icon.png"));
  return new Response(buffer, { headers: { "Content-Type": contentType } });
}
