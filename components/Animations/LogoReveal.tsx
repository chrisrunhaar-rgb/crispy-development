import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img } from "remotion";

const NAVY = "#1B3A6B";
const NAVY_DARK = "#0D1E3A";
const ORANGE = "#E07540";
const WHITE = "#F8F7F4";

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ────────────────────────────────────────────────
  const bgOp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // ── Orange rules sweep in from edges ─────────────────────────
  const ruleScale = interpolate(frame, [6, 22], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── "WELCOME TO" label ────────────────────────────────────────
  const welcomeOp = interpolate(frame, [18, 32], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const welcomeY = interpolate(frame, [18, 32], [12, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Logo icon springs up ──────────────────────────────────────
  const iconSpring = spring({ frame: frame - 24, fps, config: { damping: 20, stiffness: 140, mass: 0.7 } });
  const iconScale = interpolate(iconSpring, [0, 1], [0.5, 1]);
  const iconOp = interpolate(frame, [24, 38], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── "CRISPY DEVELOPMENT" wordmark ────────────────────────────
  const wordmarkOp = interpolate(frame, [48, 62], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const wordmarkY = interpolate(frame, [48, 62], [14, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Orange divider ────────────────────────────────────────────
  const dividerW = interpolate(frame, [60, 72], [0, 160], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Tagline ───────────────────────────────────────────────────
  const taglineOp = interpolate(frame, [72, 88], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [72, 88], [10, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Dot grid breathe ─────────────────────────────────────────
  const dotOp = interpolate(frame, [8, 24], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`,
        opacity: bgOp,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Montserrat, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(248,247,244,0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: dotOp,
      }} />

      {/* Concentric arcs — bottom-right atmospheric glow */}
      <div style={{
        position: "absolute",
        bottom: -200,
        right: -200,
        width: 600,
        height: 600,
        borderRadius: "50%",
        border: "1px solid rgba(248,247,244,0.04)",
        opacity: dotOp,
      }}>
        <div style={{
          position: "absolute", inset: 80,
          borderRadius: "50%",
          border: "1px solid rgba(248,247,244,0.04)",
        }}>
          <div style={{
            position: "absolute", inset: 80,
            borderRadius: "50%",
            border: `1px solid rgba(224,117,64,0.12)`,
          }} />
        </div>
      </div>

      {/* Orange top rule — sweeps from left */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 4,
        background: ORANGE,
        transformOrigin: "left",
        transform: `scaleX(${ruleScale})`,
      }} />

      {/* Orange bottom rule — sweeps from right */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 4,
        background: ORANGE,
        transformOrigin: "right",
        transform: `scaleX(${ruleScale})`,
      }} />

      {/* ── Centred content ── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 0,
      }}>

        {/* "WELCOME TO" */}
        <div style={{
          opacity: welcomeOp,
          transform: `translateY(${welcomeY}px)`,
          marginBottom: 28,
        }}>
          <span style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: ORANGE,
          }}>
            Welcome to
          </span>
        </div>

        {/* Logo icon */}
        <div style={{
          opacity: iconOp,
          transform: `scale(${iconScale})`,
          marginBottom: 28,
        }}>
          <Img
            src="/logo-icon-dark-badge.png"
            style={{
              width: 120,
              height: 120,
              objectFit: "contain",
              filter: "drop-shadow(0 0 32px rgba(224,117,64,0.4))",
            }}
          />
        </div>

        {/* CRISPY DEVELOPMENT wordmark */}
        <div style={{
          opacity: wordmarkOp,
          transform: `translateY(${wordmarkY}px)`,
          marginBottom: 0,
        }}>
          <div style={{
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: WHITE,
            lineHeight: 1,
            marginBottom: 6,
          }}>
            CRISPY
          </div>
          <div style={{
            fontSize: 17,
            fontWeight: 300,
            letterSpacing: "0.44em",
            textTransform: "uppercase",
            color: `rgba(248,247,244,0.55)`,
          }}>
            Development
          </div>
        </div>

        {/* Orange divider */}
        <div style={{
          width: dividerW,
          height: 2,
          background: ORANGE,
          marginTop: 28,
          marginBottom: 28,
          borderRadius: 1,
        }} />

        {/* Tagline */}
        <div style={{
          opacity: taglineOp,
          transform: `translateY(${taglineY}px)`,
        }}>
          <p style={{
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: "0.04em",
            color: `rgba(248,247,244,0.65)`,
            margin: 0,
            fontStyle: "italic",
            fontFamily: "Cormorant Garamond, Cormorant, Georgia, serif",
          }}>
            Raising leaders who cross cultures.
          </p>
        </div>

      </div>
    </AbsoluteFill>
  );
};
