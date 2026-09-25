import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const NAVY = '#1B3A6B';
const ORANGE = '#E07540';
const OFF_WHITE = '#F8F7F4';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Total: 1440 frames = 48s at 30fps (music 0:10–0:58 of the source track)
//
// Each card is 3s: black screen and sentence fade in together (15f), hold (60f),
// fade out together (15f). The footage pauses while the screen is fully black.
//
// 0–120      Drone fades in slowly from black (4s)
// 180–270    Card 1
// 480–570    Card 2
// 780–870    Card 3
// 1050–1160  End card, same format as ModuleRevealReel; navy full at 1110 (0:37)
// 1380–1440  Fade to black

const FADE = 15;
const HOLD = 60;
const CARDS = [180, 480, 780];
const END_BG: [number, number] = [1080, 1110];
const T = {
  END_LOGO:  [1050, 1100] as [number, number],
  END_LINE1: [1070, 1115] as [number, number],
  END_DIV:   [1090, 1130] as [number, number],
  END_LINE2: [1105, 1145] as [number, number],
  END_LINE3: [1123, 1160] as [number, number],
};
const TOTAL = 1440;

// Loaded under its own name so the end card keeps the exact look of the earlier reels.
const CARD_FONT = 'CrispyMontserrat';

const COPY = {
  en: {
    cards: [
      ['Every leader carries a story.'],
      ['Some carry it across borders,', 'languages and cultures.'],
      ["You don't have to walk alone."],
    ],
    eyebrow: 'Development. Coaching. A path to grow.',
    line3: 'A Christian leadership development platform.',
    line4: 'For those who cross cultures.',
  },
  id: {
    cards: [
      ['Setiap pemimpin membawa sebuah kisah.'],
      ['Sebagian membawanya melintasi batas negara,', 'bahasa, dan budaya.'],
      ['Kamu tidak perlu berjalan sendirian.'],
    ],
    eyebrow: 'Pengembangan. Coaching. Bertumbuh.',
    line3: 'Platform pengembangan kepemimpinan Kristen.',
    line4: 'Untuk mereka yang melintasi budaya.',
  },
};

// Drone segments sit between the fully-black parts of each card.
const SEGMENTS = (() => {
  const segs: {from: number; to: number; offset: number}[] = [];
  let from = 0;
  let offset = 0;
  for (const c of CARDS) {
    const to = c + FADE;
    segs.push({from, to, offset});
    offset += to - from;
    from = c + FADE + HOLD;
  }
  segs.push({from, to: END_BG[1], offset});
  return segs;
})();

const useCardFont = () => {
  const [handle] = useState(() => delayRender('Loading font'));
  useEffect(() => {
    const face = new FontFace(CARD_FONT, `url(${staticFile('fonts/montserrat.woff2')}) format('woff2')`, {
      weight: '300 800',
    });
    face
      .load()
      .then((f) => document.fonts.add(f))
      .finally(() => continueRender(handle));
  }, [handle]);
};

// One line of Montserrat 700 is roughly 0.64em per character; fit the longest line into 940px.
const fitSize = (lines: string[], max: number) =>
  Math.min(max, Math.floor(940 / (Math.max(...lines.map((l) => l.length)) * 0.64)));

export type CrispyRevealReelProps = {
  lang?: 'en' | 'id';
  videoFile?: string;
  musicFile?: string;
};

export const CrispyRevealReel: React.FC<CrispyRevealReelProps> = ({
  lang = 'en',
  videoFile = 'clips/crispy_reveal_islands.mp4',
  musicFile = 'audio/crispy_reveal_music.mp3',
}) => {
  useCardFont();
  const frame = useCurrentFrame();
  const copy = COPY[lang];

  // Eased so the picture emerges slowly; a linear ramp looks fully clear after ~1s.
  const introBlack = 1 - Math.pow(interpolate(frame, [0, 120], [0, 1], clamp), 2.5);
  const cardOpacity = CARDS.map((c) =>
    interpolate(frame, [c, c + FADE, c + FADE + HOLD, c + 2 * FADE + HOLD], [0, 1, 1, 0], clamp),
  );

  const endBgOpacity = interpolate(frame, END_BG, [0, 1], clamp);
  const endLogoOpacity = interpolate(frame, T.END_LOGO, [0, 1], clamp);
  const endLine1Opacity = interpolate(frame, T.END_LINE1, [0, 1], clamp);
  const endDivOpacity = interpolate(frame, T.END_DIV, [0, 1], clamp);
  const endLine2Opacity = interpolate(frame, T.END_LINE2, [0, 1], clamp);
  const endLine3Opacity = interpolate(frame, T.END_LINE3, [0, 1], clamp);
  const fadeToBlack = interpolate(frame, [TOTAL - 60, TOTAL], [0, 1], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile(musicFile)} />

      {SEGMENTS.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.to - s.from}>
          <OffthreadVideo
            src={staticFile(videoFile)}
            trimBefore={s.offset}
            muted
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>
      ))}

      <AbsoluteFill style={{backgroundColor: '#000', opacity: introBlack}} />

      {/* ── Black cards: screen and sentence fade in and out together ── */}
      {CARDS.map((_, i) => {
        const o = cardOpacity[i];
        if (o <= 0) return null;
        const lines = copy.cards[i];
        return (
          <AbsoluteFill
            key={i}
            style={{backgroundColor: '#000', opacity: o, alignItems: 'center', justifyContent: 'center'}}
          >
            {lines.map((line) => (
              <div
                key={line}
                style={{
                  fontFamily: `'${CARD_FONT}', sans-serif`,
                  fontWeight: 700,
                  fontSize: fitSize(lines, 52),
                  lineHeight: 1.35,
                  color: ORANGE,
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                {line}
              </div>
            ))}
          </AbsoluteFill>
        );
      })}

      {/* ── End card content (same format as ModuleRevealReel) ── */}
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
          {copy.eyebrow}
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
          {copy.line3}
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
          {copy.line4}
        </div>
      </AbsoluteFill>

      {/* ── End card navy background — arrives after text ── */}
      <AbsoluteFill style={{zIndex: 28, backgroundColor: NAVY, opacity: endBgOpacity}}>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundColor: ORANGE}} />
      </AbsoluteFill>

      {fadeToBlack > 0 && (
        <AbsoluteFill style={{zIndex: 50, backgroundColor: '#000000', opacity: fadeToBlack}} />
      )}
    </AbsoluteFill>
  );
};
