import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const size = { width: 1080, height: 1920 };
export const contentType = "image/png";

// Brand-only, language-neutral: next/og's renderer (satori) has unreliable
// Arabic script shaping, so no per-language text is baked into this image —
// the exciting localized message lives in the share caption text instead
// (see ShareButtonsCopy.posterCaptionText). "4 FREE LETTERS" and "Papkram"
// are literal strings, not FREE_LETTER_LIMIT — this route has no `dynamic`
// export, so Next statically renders and caches it once; if the free-letter
// limit ever changes, this file needs a manual edit (same trade-off
// opengraph-image.tsx already accepts for its own hardcoded copy).

const HOLE_COUNT_H = 14;
const HOLE_COUNT_V = 9;

/** Mirrors stamp-badge.tsx's perforation algorithm, reimplemented with literal hex fills — satori renders inline styles only, no Tailwind classes or CSS variables. */
function perforationHoles(width: number, height: number) {
  const holes: { cx: number; cy: number }[] = [];
  for (let i = 0; i < HOLE_COUNT_H; i++) {
    const x = (width / (HOLE_COUNT_H - 1)) * i;
    holes.push({ cx: x, cy: 0 }, { cx: x, cy: height });
  }
  for (let i = 1; i < HOLE_COUNT_V - 1; i++) {
    const y = (height / (HOLE_COUNT_V - 1)) * i;
    holes.push({ cx: 0, cy: y }, { cx: width, cy: y });
  }
  return holes;
}

function loadFont(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath));
}

export async function GET() {
  const bricolage800 = loadFont(
    "node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff",
  );
  const inter600 = loadFont("node_modules/@fontsource/inter/files/inter-latin-600-normal.woff");

  const stampWidth = 480;
  const stampHeight = 310;
  const holes = perforationHoles(stampWidth, stampHeight);
  const stampMaskId = "poster-stamp-perforation";

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
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
            padding: "56px 72px",
            borderRadius: "56px",
            border: "10px solid #1a0a2e",
            boxShadow: "28px 28px 0 0 #1a0a2e",
            backgroundColor: "#7c3aed",
            transform: "rotate(-3deg)",
          }}
        >
          <svg width={220} height={220} viewBox="0 0 512 512">
            <rect x="50" y="52" width="404" height="404" rx="122" fill="#1A0A2E" />
            <rect x="28" y="24" width="404" height="404" rx="122" fill="#FB9A4B" stroke="#1A0A2E" strokeWidth="16" />
            <g transform="translate(230,226)">
              <rect x="-105" y="-70" width="210" height="140" rx="26" fill="#FFFFFF" stroke="#1A0A2E" strokeWidth="15" />
              <path
                d="M-93 -56 L0 12 L93 -56"
                fill="none"
                stroke="#1A0A2E"
                strokeWidth="15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
          <span
            style={{
              fontFamily: "Bricolage Grotesque",
              fontSize: 140,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Papkram
          </span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 72,
            transform: "rotate(3deg)",
            position: "relative",
            width: stampWidth,
            height: stampHeight,
          }}
        >
          {/* satori doesn't support SVG <text> nodes, so the label is a
              plain HTML span overlaid on the (text-free) perforated shape. */}
          <svg
            style={{ position: "absolute", top: 0, left: 0 }}
            width={stampWidth}
            height={stampHeight}
            viewBox={`0 0 ${stampWidth} ${stampHeight}`}
          >
            <mask id={stampMaskId}>
              <rect x="0" y="0" width={stampWidth} height={stampHeight} fill="white" />
              {holes.map((hole, i) => (
                <circle key={i} cx={hole.cx} cy={hole.cy} r="13" fill="black" />
              ))}
            </mask>
            <rect
              x="0"
              y="0"
              width={stampWidth}
              height={stampHeight}
              rx="12"
              fill="#fb923c"
              mask={`url(#${stampMaskId})`}
            />
            <rect
              x="0"
              y="0"
              width={stampWidth}
              height={stampHeight}
              rx="12"
              fill="none"
              stroke="#1a0a2e"
              strokeWidth="6"
              mask={`url(#${stampMaskId})`}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Bricolage Grotesque",
                fontWeight: 800,
                fontSize: 44,
                color: "#1a0a2e",
                letterSpacing: "0.02em",
              }}
            >
              4 FREE LETTERS
            </span>
          </div>
        </div>

        <span
          style={{
            marginTop: 64,
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 44,
            color: "#1a0a2e",
          }}
        >
          papkram.de
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage Grotesque", data: bricolage800, weight: 800, style: "normal" },
        { name: "Inter", data: inter600, weight: 600, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
