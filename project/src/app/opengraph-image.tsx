import { ImageResponse } from "next/og";
import { DEMO_MODE } from "@/lib/constants";

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
            gap: 28,
            padding: "24px 48px",
            borderRadius: "36px",
            border: "6px solid #1a0a2e",
            boxShadow: "16px 16px 0 0 #1a0a2e",
            backgroundColor: "#7c3aed",
            transform: "rotate(-2deg)",
          }}
        >
          <svg width={80} height={80} viewBox="0 0 512 512">
            <rect x="50" y="52" width="404" height="404" rx="122" fill="#1A0A2E" />
            <rect x="28" y="24" width="404" height="404" rx="122" fill="#FB9A4B" stroke="#1A0A2E" strokeWidth="16" />
            <g transform="translate(230,226)">
              <rect x="-105" y="-70" width="210" height="140" rx="26" fill="#FFFFFF" stroke="#1A0A2E" strokeWidth="15" />
              <path d="M-93 -56 L0 12 L93 -56" fill="none" stroke="#1A0A2E" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
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
          {DEMO_MODE
            ? "Free demo now. We'll email you when we fully launch."
            : "Plain-language summaries, deadlines, and reply drafts."}
        </span>
      </div>
    ),
    { ...size },
  );
}
