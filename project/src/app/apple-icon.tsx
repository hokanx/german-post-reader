import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS Home Screen icon must be fully opaque — iOS applies its own rounded-
 * square mask, so a transparent background shows as black behind the mask.
 */
export default function AppleIcon() {
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
        <span
          style={{
            fontSize: 92,
            fontWeight: 800,
            color: "#fff7ed",
            letterSpacing: "-0.03em",
          }}
        >
          GP
        </span>
      </div>
    ),
    { ...size },
  );
}
