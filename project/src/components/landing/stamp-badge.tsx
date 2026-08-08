const HOLE_COUNT_H = 14;
const HOLE_COUNT_V = 9;

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

/**
 * The hero's signature element: a rotated postal-stamp badge with a
 * perforated edge (SVG mask punching circular holes out of the rect),
 * standing in for the generic "sticker" ornament MASTER.md calls for —
 * specific to a product about physical letters, not a generic badge shape.
 */
export function StampBadge({
  label,
  className,
  dir = "ltr",
}: {
  label: string;
  className?: string;
  dir?: "ltr" | "rtl";
}) {
  const width = 168;
  const height = 108;
  const holes = perforationHoles(width, height);
  const maskId = "stamp-perforation";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={label}
    >
      <mask id={maskId}>
        <rect x="0" y="0" width={width} height={height} fill="white" />
        {holes.map((hole, i) => (
          <circle key={i} cx={hole.cx} cy={hole.cy} r="4.5" fill="black" />
        ))}
      </mask>
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="4"
        className="fill-accent"
        mask={`url(#${maskId})`}
      />
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx="4"
        fill="none"
        strokeWidth="2"
        className="stroke-foreground"
        mask={`url(#${maskId})`}
      />
      <text
        x={width / 2}
        y={height / 2 + 5}
        textAnchor="middle"
        className="fill-accent-foreground"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "15px",
          // letter-spacing breaks Arabic's cursive letter-joining (each
          // letter falls back to isolated form instead of its correct
          // medial/final shape) - only apply it for LTR scripts.
          letterSpacing: dir === "rtl" ? "normal" : "0.02em",
          direction: dir,
          unicodeBidi: "isolate",
        }}
      >
        {label}
      </text>
    </svg>
  );
}
