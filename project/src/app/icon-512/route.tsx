import { ImageResponse } from "next/og";

/** Stable-URL icon for manifest.ts's `icons` array (Android install prompt + iOS 16.4+ manifest-aware installs). */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#7c3aed",
        }}
      >
        <span style={{ fontSize: 256, fontWeight: 800, color: "#fff7ed", letterSpacing: "-0.03em" }}>GP</span>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
