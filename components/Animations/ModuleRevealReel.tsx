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
// 0–45    Jungle fades in from black
// 120–180 Logo + module name fade in
// 155–210 Accent line wipes in
// 185–245 Hook line fades in
// 300–345 Hook fades out
// 390–450 Sub line fades in
// 510–550 Sub line fades out
// 520–565 Logo + module name + accent fade out
// 545–615 Jungle fades out
// 580–630 End card logo fades in
// 600–660 End card text fades in
// 610–660 Navy bg fades in
// 760–800 Fade to black

const T = {
  JUNGLE_IN:      [0, 45] as [number, number],
  JUNGLE_OUT:     [545, 615] as [number, number],

  TEXT_IN:        [120, 180] as [number, number],
  TITLE_OUT:      [520, 565] as [number, number],

  ACCENT_IN:      [155, 210] as [number, number],
  HOOK_IN:        [185, 245] as [number, number],
  HOOK_OUT:       [300, 345] as [number, number],

  SUBLINE_IN:     [390, 450] as [number, number],
  SUBLINE_OUT:    [510, 550] as [number, number],

  END_LOGO:       [580, 630] as [number, number],
  END_LINE1:      [600, 645] as [number, number],
  END_DIV:        [620, 660] as [number, number],
  END_LINE2:      [635, 675] as [number, number],
  END_LINE3:      [653, 690] as [number, number],

  END_BG:         [610, 660] as [number, number],

  FADE_BLACK:     [850, 890] as [number, number],
};

export interface ModuleRevealReelProps {
  moduleName?: string;
  hookLine?: string;
  subLine?: string;
  videoFile?: string;
  musicFile?: string;
  musicStartFrom?: number;
  moduleIcon?: string;
  videoPlaybackRate?: number;
  titleOffset?: number;
  verticalShift?: number;
  titleFontSize?: number;
  endCardLine1?: string;
  endCardLine3?: string;
  endCardLine4?: string;
  logoBelow?: boolean;
  logoBelowOffset?: number;
}

export const ModuleRevealReel: React.FC<ModuleRevealReelProps> = ({
  moduleName = 'LEADERSHIP ALTITUDES',
  hookLine = 'Leadership needs altitude.',
  subLine,
  videoFile = 'clips/jungle_aerial_module.mp4',
  musicFile,
  musicStartFrom = 2100,
  moduleIcon = 'logo-icon.png',
  videoPlaybackRate = 0.55,
  titleOffset = 76,
  verticalShift = 0,
  titleFontSize = 58,
  endCardLine1 = 'Now available',
  endCardLine3 = 'A Christian leadership development platform.',
  endCardLine4 = 'For those who cross cultures.',
  logoBelow = false,
  logoBelowOffset = 0,
}) => {
  const frame = useCurrentFrame();

  const musicVolume = Math.min(
    interpolate(frame, [0, 90], [0, 1], clamp),
    interpolate(frame, [830, 890], [1, 0], clamp),
  );

  const jungleOpacity = Math.min(
    interpolate(frame, T.JUNGLE_IN, [0, 1], clamp),
    interpolate(frame, T.JUNGLE_OUT, [1, 0], clamp),
  );

  const titleOpacity = Math.min(
    interpolate(frame, T.TEXT_IN, [0, 1], clamp),
    interpolate(frame, T.TITLE_OUT, [1, 0], clamp),
  );

  const accentScaleX = Math.min(
    interpolate(frame, T.ACCENT_IN, [0, 1], clamp),
    interpolate(frame, T.TITLE_OUT, [1, 0], clamp),
  );

  const hookOpacity = Math.min(
    interpolate(frame, T.HOOK_IN, [0, 1], clamp),
    interpolate(frame, T.HOOK_OUT, [1, 0], clamp),
  );

  const subLineOpacity = Math.min(
    interpolate(frame, T.SUBLINE_IN, [0, 1], clamp),
    interpolate(frame, T.SUBLINE_OUT, [1, 0], clamp),
  );

  const endBgOpacity    = interpolate(frame, T.END_BG, [0, 1], clamp);
  const endLogoOpacity  = interpolate(frame, T.END_LOGO, [0, 1], clamp);
  const endLine1Opacity = interpolate(frame, T.END_LINE1, [0, 1], clamp);
  const endDivOpacity   = interpolate(frame, T.END_DIV, [0, 1], clamp);
  const endLine2Opacity = interpolate(frame, T.END_LINE2, [0, 1], clamp);
  const endLine3Opacity = interpolate(frame, T.END_LINE3, [0, 1], clamp);

  const fadeToBlack = interpolate(frame, T.FADE_BLACK, [0, 1], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      {musicFile && (
        <Audio src={staticFile(musicFile)} startFrom={musicStartFrom} volume={musicVolume} />
      )}

      {/* ── Jungle footage ── */}
      <AbsoluteFill style={{zIndex: 1, opacity: jungleOpacity}}>
        <OffthreadVideo
          src={staticFile(videoFile)}
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'}}
          playbackRate={videoPlaybackRate}
          volume={0}
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

      {/* ── Middle text: logo + module name + hook ── */}
      <AbsoluteFill style={{zIndex: 20, pointerEvents: 'none'}}>

        {/* Logo icon — centred above module name */}
        <div style={{
          position: 'absolute',
          top: logoBelow
            ? `calc(${44 + verticalShift}% + ${titleOffset + 120 + logoBelowOffset}px)`
            : `${26 + verticalShift}%`,
          left: 0, right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: titleOpacity,
        }}>
          <Img
            src={staticFile(moduleIcon)}
            style={{width: 220, height: 220, objectFit: 'contain'}}
          />
        </div>

        {/* Module name */}
        <div style={{
          position: 'absolute',
          top: `${44 + verticalShift}%`,
          left: 0, right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
        }}>
          <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: titleFontSize,
            fontWeight: 800,
            color: WHITE,
            letterSpacing: 8,
            textTransform: 'uppercase',
            lineHeight: 1.15,
            whiteSpace: 'pre-line',
            textShadow: '0 0 40px rgba(27,58,107,0.85), 0 4px 16px rgba(0,0,0,0.65)',
          }}>
            {moduleName}
          </div>
        </div>

        {/* Orange accent line */}
        <div style={{
          position: 'absolute',
          top: `calc(${44 + verticalShift}% + ${titleOffset}px)`,
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
          top: `calc(${44 + verticalShift}% + ${titleOffset + 30}px)`,
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
            whiteSpace: 'pre-line',
            textShadow: '0 2px 18px rgba(0,0,0,0.75)',
          }}>
            {hookLine}
          </div>
        </div>

        {/* Sub line — replaces hook, logo + title still visible */}
        {subLine && (
          <div style={{
            position: 'absolute',
            top: `calc(${44 + verticalShift}% + ${titleOffset + 30}px)`,
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
              whiteSpace: 'pre-line',
              textShadow: '0 2px 18px rgba(0,0,0,0.75)',
            }}>
              {subLine}
            </div>
          </div>
        )}
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
            width: 220, height: 220, objectFit: 'contain',
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
          {endCardLine1}
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
          {endCardLine3}
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
          {endCardLine4}
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
