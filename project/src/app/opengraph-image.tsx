import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff7ed",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 48px",
            borderRadius: "36px",
            border: "6px solid #1a0a2e",
            boxShadow: "16px 16px 0 0 #1a0a2e",
            backgroundColor: "#7c3aed",
            transform: "rotate(-2deg)",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Papkram
          </span>
        </div>
        <span
          style={{
            marginTop: 40,
            fontSize: 32,
            color: "#1a0a2e",
            fontWeight: 500,
          }}
        >
          Plain-language summaries, deadlines, and reply drafts.
        </span>
      </div>
    ),
    { ...size },
  );
}
