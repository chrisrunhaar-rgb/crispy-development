import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  useCurrentFrame,
  interpolate,
  staticFile,
} from 'remotion';

const NAVY = '#1B3A6B';
const ORANGE = '#E07540';
const OFF_WHITE = '#F8F7F4';
const WHITE = '#FFFFFF';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Total: 800 frames = 26.7 seconds at 30fps
//
// 0–60    Navy open + large logo
// 40–100  Jungle fades in
// 55–90   Opening logo fades out
// 120–180 Module name + hook fade in
// 155–210 Accent line wipes in
// 300–345 Module name + hook + accent fade out
// 345–400 Sub line fades in alone (contemplative pause)
// 460–500 Sub line fades out
// 480–560 Jungle fades out
// 480–535 End card text fades in over jungle
// 550–610 Navy bg fades in
// 610–800 End card holds (190 frames = 6.3s)
// 760–800 Fade to black

const T = {
  LOGO_OPEN_IN:   [0, 25] as [number, number],
  LOGO_OPEN_HOLD: [25, 55] as [number, number],
  LOGO_OPEN_OUT:  [55, 90] as [number, number],

  JUNGLE_IN:      [40, 100] as [number, number],
  JUNGLE_OUT:     [490, 560] as [number, number],

  TEXT_IN:        [120, 180] as [number, number],
  TITLE_OUT:      [470, 515] as [number, number],  // logo + module name fade with jungle

  ACCENT_IN:      [155, 210] as [number, number],
  HOOK_IN:        [185, 245] as [number, number],
  HOOK_OUT:       [300, 345] as [number, number],  // only hook fades out

  SUBLINE_IN:     [345, 400] as [number, number],
  SUBLINE_OUT:    [460, 500] as [number, number],

  END_LOGO:       [475, 530] as [number, number],
  END_LINE1:      [495, 550] as [number, number],
  END_DIV:        [515, 560] as [number, number],
  END_LINE2:      [530, 575] as [number, number],
  END_LINE3:      [548, 590] as [number, number],

  END_BG:         [550, 610] as [number, number],

  FADE_BLACK:     [760, 800] as [number, number],
};

export interface ModuleRevealReelProps {
  moduleName?: string;
  hookLine?: string;
  subLine?: string;
  videoFile?: string;
  musicFile?: string;
}

export const ModuleRevealReel: React.FC<ModuleRevealReelProps> = ({
  moduleName = 'LEADERSHIP ALTITUDES',
  hookLine = 'Leadership needs altitude.',
  subLine,
  videoFile = 'clips/jungle_aerial_module.mp4',
  musicFile,
}) => {
  const frame = useCurrentFrame();

  // ── Music volume: smooth fade in + slow fade out ──────────────────────────
  const musicVolume = Math.min(
    interpolate(frame, [0, 90], [0, 1], clamp),
    interpolate(frame, [740, 800], [1, 0], clamp),
  );

  // ── Opening logo on navy ──────────────────────────────────────────────────
  const logoOpenOpacity = (() => {
    const inVal  = interpolate(frame, T.LOGO_OPEN_IN, [0, 1], clamp);
    const outVal = interpolate(frame, T.LOGO_OPEN_OUT, [1, 0], clamp);
    if (frame < T.LOGO_OPEN_HOLD[0]) return inVal;
    if (frame < T.LOGO_OPEN_OUT[0]) return 1;
    return outVal;
  })();

  // ── Jungle footage ────────────────────────────────────────────────────────
  const jungleOpacity = Math.min(
    interpolate(frame, T.JUNGLE_IN, [0, 1], clamp),
    interpolate(frame, T.JUNGLE_OUT, [1, 0], clamp),
  );

  // ── Logo + module name: stay up, fade out late with jungle ───────────────
  const titleOpacity = Math.min(
    interpolate(frame, T.TEXT_IN, [0, 1], clamp),
    interpolate(frame, T.TITLE_OUT, [1, 0], clamp),
  );

  // ── Accent + hook: fade out early to make room for subline ───────────────
  const accentScaleX = Math.min(
    interpolate(frame, T.ACCENT_IN, [0, 1], clamp),
    interpolate(frame, T.HOOK_OUT, [1, 0], clamp),
  );
  const hookOpacity = Math.min(
    interpolate(frame, T.HOOK_IN, [0, 1], clamp),
    interpolate(frame, T.HOOK_OUT, [1, 0], clamp),
  );

  // ── Sub line: replaces hook, logo + title still visible ──────────────────
  const subLineOpacity = Math.min(
    interpolate(frame, T.SUBLINE_IN, [0, 1], clamp),
    interpolate(frame, T.SUBLINE_OUT, [1, 0], clamp),
  );

  // ── End card ──────────────────────────────────────────────────────────────
  const endBgOpacity    = interpolate(frame, T.END_BG, [0, 1], clamp);
  const endLogoOpacity  = interpolate(frame, T.END_LOGO, [0, 1], clamp);
  const endLine1Opacity = interpolate(frame, T.END_LINE1, [0, 1], clamp);
  const endDivOpacity   = interpolate(frame, T.END_DIV, [0, 1], clamp);
  const endLine2Opacity = interpolate(frame, T.END_LINE2, [0, 1], clamp);
  const endLine3Opacity = interpolate(frame, T.END_LINE3, [0, 1], clamp);

  // ── Fade to black ─────────────────────────────────────────────────────────
  const fadeToBlack = interpolate(frame, T.FADE_BLACK, [0, 1], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: NAVY}}>
      {musicFile && (
        <Audio src={staticFile(musicFile)} startFrom={2100} volume={musicVolume} />
      )}

      {/* ── Opening: large logo centred on navy ── */}
      <AbsoluteFill style={{zIndex: 10, opacity: logoOpenOpacity, pointerEvents: 'none'}}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Img
            src={staticFile('logo-icon.png')}
            style={{width: 260, height: 260, objectFit: 'contain'}}
          />
        </div>
      </AbsoluteFill>

      {/* ── Jungle footage ── */}
      <AbsoluteFill style={{zIndex: 1, opacity: jungleOpacity}}>
        <OffthreadVideo
          src={staticFile(videoFile)}
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'}}
          playbackRate={0.55}
          loop
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.0) 20%, rgba(0,0,0,0.55) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(27,58,107,0) 20%, rgba(27,58,107,0.35) 50%, rgba(27,58,107,0) 80%)',
        }} />
      </AbsoluteFill>

      {/* ── Middle text: module name + hook ── */}
      <AbsoluteFill style={{zIndex: 20, pointerEvents: 'none'}}>

        {/* Module name */}
        <div style={{
          position: 'absolute',
          top: '38%',
          left: 0, right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
        }}>
          <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 58,
            fontWeight: 800,
            color: WHITE,
            letterSpacing: 8,
            textTransform: 'uppercase',
            lineHeight: 1,
            textShadow: '0 0 40px rgba(27,58,107,0.85), 0 4px 16px rgba(0,0,0,0.65)',
          }}>
            {moduleName}
          </div>
        </div>

        {/* Orange accent line */}
        <div style={{
          position: 'absolute',
          top: 'calc(38% + 76px)',
          left: '50%',
          transform: `translateX(-50%) scaleX(${accentScaleX})`,
          transformOrigin: 'center',
          width: 220,
          height: 3,
          backgroundColor: ORANGE,
          borderRadius: 2,
          opacity: accentScaleX,
        }} />

        {/* Hook line */}
        <div style={{
          position: 'absolute',
          top: 'calc(38% + 106px)',
          left: 64, right: 64,
          textAlign: 'center',
          opacity: hookOpacity,
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 38,
            fontWeight: 500,
            fontStyle: 'italic',
            color: OFF_WHITE,
            lineHeight: 1.4,
            textShadow: '0 2px 18px rgba(0,0,0,0.75)',
          }}>
            {hookLine}
          </div>
        </div>

        {/* Sub line — replaces hook in same spot, logo + title still visible */}
        {subLine && (
          <div style={{
            position: 'absolute',
            top: 'calc(38% + 106px)',
            left: 64, right: 64,
            textAlign: 'center',
            opacity: subLineOpacity,
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 38,
              fontWeight: 400,
              fontStyle: 'italic',
              color: OFF_WHITE,
              lineHeight: 1.4,
              textShadow: '0 2px 18px rgba(0,0,0,0.75)',
            }}>
              {subLine}
            </div>
          </div>
        )}

        {/* Logo icon — centred above module name, stays visible with title */}
        <div style={{
          position: 'absolute',
          top: '26%',
          left: 0, right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: titleOpacity,
        }}>
          <Img
            src={staticFile('logo-icon-dark-badge.png')}
            style={{height: 220, width: 'auto'}}
          />
        </div>
      </AbsoluteFill>

      {/* ── End card content — fades in over jungle before navy arrives ── */}
      <AbsoluteFill style={{
        zIndex: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <Img
          src={staticFile('logo-icon.png')}
          style={{
            height: 220, width: 'auto',
            opacity: endLogoOpacity,
            marginBottom: 48,
          }}
        />

        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 24,
          fontWeight: 600,
          color: OFF_WHITE,
          letterSpacing: 4,
          textTransform: 'uppercase',
          opacity: endLine1Opacity * 0.85,
          marginBottom: 16,
          textAlign: 'center',
          textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        }}>
          Now available
        </div>

        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 86,
          fontWeight: 700,
          color: ORANGE,
          letterSpacing: 1,
          opacity: endLine1Opacity,
          textAlign: 'center',
          lineHeight: 1,
          marginBottom: 44,
          textShadow: '0 2px 20px rgba(0,0,0,0.7)',
        }}>
          crispyleaders.com
        </div>

        <div style={{
          width: 200, height: 2,
          backgroundColor: OFF_WHITE,
          opacity: endDivOpacity * 0.35,
          marginBottom: 36,
        }} />

        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 22,
          fontWeight: 400,
          color: OFF_WHITE,
          opacity: endLine2Opacity * 0.80,
          textAlign: 'center',
          letterSpacing: 1.5,
          marginBottom: 14,
          textShadow: '0 2px 8px rgba(0,0,0,0.6)',
        }}>
          A Christian leadership development platform.
        </div>

        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 22,
          fontWeight: 600,
          color: ORANGE,
          opacity: endLine3Opacity,
          textAlign: 'center',
          letterSpacing: 1.5,
          textShadow: '0 2px 8px rgba(0,0,0,0.6)',
        }}>
          For those who cross cultures.
        </div>
      </AbsoluteFill>

      {/* ── End card navy background — arrives after text ── */}
      <AbsoluteFill style={{
        zIndex: 28,
        backgroundColor: NAVY,
        opacity: endBgOpacity,
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 6, backgroundColor: ORANGE,
        }} />
      </AbsoluteFill>

      {/* ── Fade to black ── */}
      {fadeToBlack > 0 && (
        <AbsoluteFill style={{
          zIndex: 50,
          backgroundColor: '#000000',
          opacity: fadeToBlack,
        }} />
      )}
    </AbsoluteFill>
  );
};
