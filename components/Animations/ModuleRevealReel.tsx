import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
} from 'remotion';

const NAVY = '#1B3A6B';
const ORANGE = '#E07540';
const OFF_WHITE = '#F8F7F4';
const WHITE = '#FFFFFF';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Timing constants (frames at 30fps, total 600 = 20s)
const T = {
  // Phase 1: Navy open with logo icon
  LOGO_OPEN_IN:  [0, 20],
  LOGO_OPEN_OUT: [50, 80],
  // Phase 2: Jungle fades in
  JUNGLE_IN:     [35, 85],
  JUNGLE_OUT:    [445, 510],
  // Phase 3: Text fly-by
  TEXT_START:    175,
  HOOK_START:    210,
  ACCENT_START:  185,
  TEXT_OUT:      [415, 455],
  // Watermark during footage
  MARK_IN:       [90, 115],
  MARK_OUT:      [445, 475],
  // Phase 4: End card
  END_CARD_IN:   [510, 545],
  END_LOGO:      [535, 560],
  END_LINE1:     [550, 572],
  END_LINE2:     [562, 582],
  END_LINE3:     [574, 595],
};

export interface ModuleRevealReelProps {
  moduleName?: string;
  hookLine?: string;
  videoFile?: string;
  musicFile?: string;
}

export const ModuleRevealReel: React.FC<ModuleRevealReelProps> = ({
  moduleName = 'LEADERSHIP ALTITUDES',
  hookLine = 'Leadership needs altitude.',
  videoFile = 'clips/jungle_aerial_module.mp4',
  musicFile,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ── Phase 1: Navy intro — logo fades in then out as jungle takes over ──────
  const logoOpenOpacity = Math.min(
    interpolate(frame, T.LOGO_OPEN_IN, [0, 1], clamp),
    interpolate(frame, T.LOGO_OPEN_OUT, [1, 0], clamp),
  );

  // ── Phase 2: Jungle footage ───────────────────────────────────────────────
  const jungleOpacity = Math.min(
    interpolate(frame, T.JUNGLE_IN, [0, 1], clamp),
    interpolate(frame, T.JUNGLE_OUT, [1, 0], clamp),
  );

  // ── Phase 3: Text fly-by — text feels embedded in the jungle ─────────────
  // The text "exists" deep in the scene and the camera flies toward it,
  // then it settles at reading position (scale-down + blur clears + tilt resolves)
  const textFlyIn = spring({
    frame: Math.max(0, frame - T.TEXT_START),
    fps,
    config: {mass: 1.5, damping: 24, stiffness: 65},
  });

  const textScale    = interpolate(textFlyIn, [0, 1], [3.8, 1.0], clamp);
  const textBlur     = interpolate(textFlyIn, [0, 0.35], [14, 0], clamp);
  const textTiltX    = interpolate(textFlyIn, [0, 1], [18, 0], clamp);  // slight 3D tilt as depth resolves
  const textDriftX   = interpolate(textFlyIn, [0, 1], [-60, 0], clamp); // slight lateral drift = fly-by feel
  const textSpacing  = interpolate(textFlyIn, [0, 1], [0, 7], clamp);   // letter spacing expands as it settles

  const textOpacity = Math.min(
    interpolate(frame, [T.TEXT_START, T.TEXT_START + 18], [0, 1], clamp),
    interpolate(frame, T.TEXT_OUT, [1, 0], clamp),
  );

  const accentScaleX = interpolate(
    frame, [T.ACCENT_START + 12, T.ACCENT_START + 38], [0, 1], clamp,
  );
  const accentOpacity = Math.min(
    interpolate(frame, [T.ACCENT_START + 12, T.ACCENT_START + 28], [0, 1], clamp),
    interpolate(frame, T.TEXT_OUT, [1, 0], clamp),
  );

  // Hook line enters slightly after module name, rises in from below
  const hookOpacity = Math.min(
    interpolate(frame, [T.HOOK_START, T.HOOK_START + 22], [0, 1], clamp),
    interpolate(frame, T.TEXT_OUT, [1, 0], clamp),
  );
  const hookY = interpolate(frame, [T.HOOK_START, T.HOOK_START + 28], [36, 0], clamp);

  // ── Watermark during footage ───────────────────────────────────────────────
  const markOpacity = Math.min(
    interpolate(frame, T.MARK_IN, [0, 0.72], clamp),
    interpolate(frame, T.MARK_OUT, [0.72, 0], clamp),
  );

  // ── Phase 4: End card ─────────────────────────────────────────────────────
  const endCardOpacity  = interpolate(frame, T.END_CARD_IN, [0, 1], clamp);
  const endLogoOpacity  = interpolate(frame, T.END_LOGO, [0, 1], clamp);
  const endLine1Opacity = interpolate(frame, T.END_LINE1, [0, 1], clamp);
  const endLine2Opacity = interpolate(frame, T.END_LINE2, [0, 1], clamp);
  const endLine3Opacity = interpolate(frame, T.END_LINE3, [0, 1], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: NAVY}}>
      {musicFile && <Audio src={staticFile(musicFile)} />}

      {/* ── Phase 1: Logo icon centered on navy ── */}
      <AbsoluteFill style={{zIndex: 10, opacity: logoOpenOpacity, pointerEvents: 'none'}}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Img
            src={staticFile('logo-icon.png')}
            style={{width: 120, height: 120, objectFit: 'contain'}}
          />
        </div>
      </AbsoluteFill>

      {/* ── Phase 2-3: Jungle footage ── */}
      <AbsoluteFill style={{zIndex: 1, opacity: jungleOpacity}}>
        <OffthreadVideo
          src={staticFile(videoFile)}
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'}}
          playbackRate={0.55}
          loop
        />
        {/* Vignette — grounds the text visually in the scene */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.0) 25%, rgba(0,0,0,0.50) 100%)',
        }} />
        {/* Subtle navy mid-band — helps text read against bright jungle */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(27,58,107,0) 25%, rgba(27,58,107,0.30) 50%, rgba(27,58,107,0) 75%)',
        }} />
      </AbsoluteFill>

      {/* ── Phase 3: Text embedded in scene (fly-by depth effect) ── */}
      <AbsoluteFill style={{zIndex: 20, pointerEvents: 'none'}}>

        {/* Module name — scales down from scene depth as camera "arrives" */}
        <div style={{
          position: 'absolute',
          top: '41%',
          left: 0, right: 0,
          textAlign: 'center',
          opacity: textOpacity,
          filter: `blur(${textBlur}px)`,
          transform: `perspective(900px) rotateX(${textTiltX}deg) scale(${textScale}) translateX(${textDriftX}px)`,
          transformOrigin: 'center center',
        }}>
          <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 52,
            fontWeight: 800,
            color: WHITE,
            letterSpacing: textSpacing,
            textTransform: 'uppercase',
            lineHeight: 1,
            // Deep shadow sells the "exists in the jungle" illusion
            textShadow: '0 0 60px rgba(27,58,107,0.9), 0 0 20px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.6)',
          }}>
            {moduleName}
          </div>
        </div>

        {/* Orange accent line — wipes in after module name resolves */}
        <div style={{
          position: 'absolute',
          top: 'calc(41% + 74px)',
          left: '50%',
          transform: `translateX(-50%) scaleX(${accentScaleX})`,
          transformOrigin: 'center',
          width: 200,
          height: 3,
          backgroundColor: ORANGE,
          borderRadius: 2,
          opacity: accentOpacity,
        }} />

        {/* Hook line — rises up from below */}
        <div style={{
          position: 'absolute',
          top: 'calc(41% + 100px)',
          left: 56, right: 56,
          textAlign: 'center',
          opacity: hookOpacity,
          transform: `translateY(${hookY}px)`,
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 36,
            fontWeight: 500,
            fontStyle: 'italic',
            color: OFF_WHITE,
            lineHeight: 1.35,
            textShadow: '0 2px 20px rgba(0,0,0,0.75)',
          }}>
            {hookLine}
          </div>
        </div>

        {/* Small logo watermark — top right during footage */}
        <Img
          src={staticFile('logo-icon-dark-badge.png')}
          style={{
            position: 'absolute',
            top: 52, right: 52,
            height: 56, width: 'auto',
            opacity: markOpacity,
          }}
        />
      </AbsoluteFill>

      {/* ── Phase 4: End card ── */}
      <AbsoluteFill style={{
        zIndex: 30,
        backgroundColor: NAVY,
        opacity: endCardOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
      }}>
        {/* Orange top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 5, backgroundColor: ORANGE,
          opacity: endLogoOpacity,
        }} />

        <Img
          src={staticFile('logo-name-transp.png')}
          style={{
            height: 68, width: 'auto',
            opacity: endLogoOpacity,
            marginBottom: 36,
          }}
        />

        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: WHITE,
          letterSpacing: 0.5,
          opacity: endLine1Opacity,
          textAlign: 'center',
        }}>
          Now available
          <span style={{color: ORANGE}}> · </span>
          crispyleaders.com
        </div>

        <div style={{
          width: 180, height: 2, backgroundColor: ORANGE,
          margin: '22px auto',
          opacity: endLine2Opacity,
        }} />

        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: OFF_WHITE,
          opacity: endLine2Opacity * 0.72,
          textAlign: 'center',
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          A Christian leadership development platform
        </div>

        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: ORANGE,
          opacity: endLine3Opacity,
          textAlign: 'center',
          letterSpacing: 2.5,
          textTransform: 'uppercase',
        }}>
          For those who cross cultures.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
