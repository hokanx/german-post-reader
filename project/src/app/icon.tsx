import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#fff7ed",
            letterSpacing: "-0.03em",
          }}
        >
          P
        </span>
      </div>
    ),
    { ...size },
  );
}
