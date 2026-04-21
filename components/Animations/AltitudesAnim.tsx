import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const ALTITUDES = [
  { ft: "5,000 ft",  label: "FT 5K",  role: "Team Member",          focus: "Execution",              span: "~4",   color: "#2D5EAA", hue: 220 },
  { ft: "10,000 ft", label: "FT 10K", role: "Team Leader",           focus: "People Development",     span: "~50",  color: "#B87030", hue: 35  },
  { ft: "20,000 ft", label: "FT 20K", role: "National Organisation", focus: "Systems & Culture",       span: "~200", color: "#2D8C5A", hue: 145 },
  { ft: "30,000 ft", label: "FT 30K", role: "Field Director",        focus: "Cross-Cultural Strategy", span: "~20",  color: "#6B4AA8", hue: 280 },
  { ft: "40,000 ft", label: "FT 40K", role: "International Org",     focus: "Vision & Legacy",         span: "~800", color: "#A04B2C", hue: 20  },
];

// Render top → bottom (40k at top, 5k at bottom)
const BANDS = [...ALTITUDES].reverse();

const NAVY = "#1B3A6B";
const NAVY_DARK = "#0D1E3A";
const ORANGE = "#E07540";
const OFF_WHITE = "#F8F7F4";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export const AltitudesAnim: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const COMP_WIDTH = 1280;
  const COMP_HEIGHT = 720;
  const BAND_H = 108;
  const BANDS_TOTAL = BANDS.length * BAND_H + (BANDS.length - 1) * 3;
  const BANDS_TOP = (COMP_HEIGHT - BANDS_TOTAL) / 2;
  const LEFT_COL = 180;
  const RIGHT_COL = 260;

  // Title entrance
  const titleOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const titleY  = interpolate(frame, [0, 14], [-16, 0], { extrapolateRight: "clamp" });

  // Bands: 5k appears first (altitudeIndex 0 = 5k, 4 = 40k)
  // In BANDS array index 0 = 40k (top), 4 = 5k (bottom)
  // We want 5k (bandIndex 4) to appear at frame 10, 40k (bandIndex 0) at frame 50
  const getBandTiming = (bandIdx: number) => {
    const altitudeIdx = 4 - bandIdx; // 0=5k→earliest
    return 10 + altitudeIdx * 12;
  };

  // Spotlight sequence (each band highlights after all are in)
  const getSpotlight = (bandIdx: number) => {
    const start = 95 + bandIdx * 12;
    return interpolate(frame, [start, start + 6, start + 16], [0, 1, 0.3], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  // Climb line: draws upward after all bands in
  const climbH = interpolate(frame, [80, 100], [0, BANDS_TOTAL], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Plane icon: climbs up the left side
  const planeFraction = interpolate(frame, [82, 102], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const planeY = BANDS_TOP + BANDS_TOTAL - planeFraction * BANDS_TOTAL;
  const planeOp = interpolate(frame, [80, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Footer
  const footerOp = interpolate(frame, [50, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`,
        fontFamily: "Montserrat, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(248,247,244,0.04) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }} />

      {/* Title */}
      <div style={{
        position: "absolute",
        top: 36,
        left: LEFT_COL,
        opacity: titleOp,
        transform: `translateY(${titleY}px)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 24, height: 3, background: ORANGE }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: ORANGE }}>
            Crispy Development
          </span>
        </div>
        <p style={{ fontSize: 24, fontWeight: 700, color: OFF_WHITE, margin: 0, letterSpacing: "0.02em" }}>
          Leadership Altitudes
        </p>
      </div>

      {/* Altitude label column header */}
      <div style={{
        position: "absolute",
        top: BANDS_TOP - 36,
        left: 32,
        opacity: titleOp,
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: `rgba(248,247,244,0.3)` }}>
          Altitude
        </span>
      </div>

      {/* Bands */}
      {BANDS.map((alt, idx) => {
        const appearAt = getBandTiming(idx);
        const bandOp = interpolate(frame, [appearAt, appearAt + 10], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const sweepW = interpolate(frame, [appearAt, appearAt + 18], [0, COMP_WIDTH - LEFT_COL - RIGHT_COL], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const textOp = interpolate(frame, [appearAt + 10, appearAt + 22], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const spotlight = getSpotlight(idx);
        const rgb = hexToRgb(alt.color);

        const bandTop = BANDS_TOP + idx * (BAND_H + 3);

        return (
          <div
            key={alt.ft}
            style={{
              position: "absolute",
              left: 0,
              top: bandTop,
              width: COMP_WIDTH,
              height: BAND_H,
              opacity: bandOp,
            }}
          >
            {/* Full band background fill */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: `rgba(${rgb}, ${0.06 + spotlight * 0.14})`,
              transition: "none",
            }} />

            {/* Colored fill block that sweeps in from LEFT_COL */}
            <div style={{
              position: "absolute",
              left: LEFT_COL,
              top: 0,
              height: BAND_H,
              width: sweepW,
              background: `linear-gradient(90deg, rgba(${rgb}, 0.28) 0%, rgba(${rgb}, 0.06) 60%, transparent 100%)`,
            }} />

            {/* Altitude number — left column */}
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: LEFT_COL,
              height: BAND_H,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingLeft: 32,
              opacity: textOp,
            }}>
              <span style={{
                fontSize: 22,
                fontWeight: 800,
                color: alt.color,
                letterSpacing: "-0.01em",
                lineHeight: 1,
                display: "block",
                marginBottom: 4,
              }}>{alt.ft}</span>
              <div style={{ width: 28, height: 2, background: alt.color, opacity: 0.5 }} />
            </div>

            {/* Role + Focus */}
            <div style={{
              position: "absolute",
              left: LEFT_COL + 28,
              top: 0,
              height: BAND_H,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              opacity: textOp,
            }}>
              <span style={{
                fontSize: 20,
                fontWeight: 700,
                color: OFF_WHITE,
                letterSpacing: "0.01em",
                marginBottom: 8,
                display: "block",
              }}>{alt.role}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: alt.color,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>{alt.focus}</span>
                <span style={{
                  fontSize: 12,
                  color: `rgba(248,247,244,0.4)`,
                  fontWeight: 500,
                }}>Span {alt.span}</span>
              </div>
            </div>

            {/* Right: span indicator dots */}
            <div style={{
              position: "absolute",
              right: 40,
              top: 0,
              height: BAND_H,
              display: "flex",
              alignItems: "center",
              opacity: textOp * (0.4 + spotlight * 0.5),
            }}>
              <span style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: `rgba(${rgb}, 0.9)`,
                letterSpacing: "0.04em",
              }}>
                {alt.span} people
              </span>
            </div>

            {/* Horizontal rule below band */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: LEFT_COL,
              right: RIGHT_COL,
              height: 1,
              background: `rgba(248,247,244,0.05)`,
            }} />

            {/* Spotlight right glow */}
            {spotlight > 0.05 && (
              <div style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 320,
                background: `linear-gradient(to left, rgba(${rgb}, 0.12), transparent)`,
                opacity: spotlight,
                pointerEvents: "none",
              }} />
            )}
          </div>
        );
      })}

      {/* Climb line */}
      <div style={{
        position: "absolute",
        left: LEFT_COL - 1,
        top: BANDS_TOP + BANDS_TOTAL - climbH,
        width: 2,
        height: climbH,
        background: `linear-gradient(to top, ${ORANGE}, rgba(224,117,64,0.05))`,
      }} />

      {/* Plane SVG climbing */}
      {planeOp > 0 && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: LEFT_COL - 24,
            top: planeY - 12,
            opacity: planeOp,
            filter: `drop-shadow(0 0 8px ${ORANGE})`,
            transform: "rotate(-45deg)",
            overflow: "visible",
          }}
        >
          <path
            d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"
            fill={ORANGE}
          />
        </svg>
      )}

      {/* Orange bottom rule */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 3,
        background: ORANGE,
        opacity: interpolate(frame, [4, 14], [0, 1], { extrapolateRight: "clamp" }),
      }} />

      {/* Footer */}
      <div style={{
        position: "absolute",
        bottom: 16,
        right: 28,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: `rgba(248,247,244,0.2)`,
        opacity: footerOp,
      }}>
        crispyleaders.com
      </div>
    </AbsoluteFill>
  );
};
