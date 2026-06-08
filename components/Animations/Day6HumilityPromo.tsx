import React from 'react';
import {AbsoluteFill, Audio, useCurrentFrame, interpolate, spring, useVideoConfig, staticFile} from 'remotion';

export const Day6HumilityPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const NAVY = '#0F2347';
  const NAVY_DARK = '#07101F';
  const ORANGE = '#E07540';
  const WHITE = '#F8F7F4';

  // Background
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});

  // "DAY 6" label — fades in at frame 15
  const labelOpacity = interpolate(frame, [15, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // "HUMILITY" — springs up at frame 35
  const titleProgress = spring({frame: frame - 35, fps, config: {damping: 18, stiffness: 90}});
  const titleY = interpolate(titleProgress, [0, 1], [80, 0]);
  const titleOpacity = interpolate(frame, [35, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Orange accent bar — draws at frame 80
  const barWidth = interpolate(frame, [80, 120], [0, 400], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Quote — appears at frame 110
  const quoteOpacity = interpolate(frame, [110, 160], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const quoteY = interpolate(frame, [110, 160], [20, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // "The better the leader..." — appears at frame 190
  const line1Opacity = interpolate(frame, [190, 230], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // CTA section — appears at 85% of total duration (frame 590 of 695)
  const ctaOpacity = interpolate(frame, [590, 630], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ctaY = interpolate(frame, [590, 630], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Crispy logo compass
  const logoOpacity = interpolate(frame, [620, 660], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY_DARK,
        opacity: bgOpacity,
        fontFamily: "'Montserrat', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Voiceover audio */}
      <Audio src={staticFile("audio/day6-humility-vo.wav")} />

      {/* Subtle background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 30% 50%, rgba(15,35,71,0.8) 0%, ${NAVY_DARK} 70%)`,
      }} />

      {/* Left vertical accent line */}
      <div style={{
        position: 'absolute',
        left: 64,
        top: 0,
        bottom: 0,
        width: 3,
        backgroundColor: ORANGE,
        opacity: interpolate(frame, [10, 40], [0, 0.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }} />

      {/* Main content */}
      <div style={{
        position: 'absolute',
        left: 96,
        right: 80,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 0',
      }}>
        {/* "DAY 6 · CHARACTER" label */}
        <div style={{
          opacity: labelOpacity,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.22em',
          color: ORANGE,
          textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          Day 6 · Character
        </div>

        {/* "HUMILITY" */}
        <div style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 110,
          fontWeight: 700,
          lineHeight: 0.95,
          color: WHITE,
          letterSpacing: '-2px',
          marginBottom: 32,
        }}>
          HUMILITY
        </div>

        {/* Orange bar */}
        <div style={{
          width: barWidth,
          height: 3,
          backgroundColor: ORANGE,
          marginBottom: 36,
          borderRadius: 2,
        }} />

        {/* Quote */}
        <div style={{
          opacity: quoteOpacity,
          transform: `translateY(${quoteY}px)`,
          fontSize: 20,
          fontWeight: 400,
          fontStyle: 'italic',
          lineHeight: 1.6,
          color: 'rgba(248,247,244,0.75)',
          maxWidth: 620,
          marginBottom: 28,
        }}>
          &ldquo;The better the leader,<br />the more humble the leader.&rdquo;
        </div>

        {/* Core insight line */}
        <div style={{
          opacity: line1Opacity,
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: 'rgba(248,247,244,0.55)',
          maxWidth: 560,
          lineHeight: 1.7,
        }}>
          Arrogance does not yield influence. Humility does.
        </div>

        {/* CTA section */}
        <div style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
        }}>
          <div style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.10em',
            color: WHITE,
            marginBottom: 8,
          }}>
            60 DAYS. FREE.
          </div>
          <div style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.12em',
            color: 'rgba(248,247,244,0.45)',
            marginBottom: 4,
          }}>
            THE INFLUENTIAL LEADERSHIP CHALLENGE
          </div>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: ORANGE,
          }}>
            crispyleaders.com/challenge
          </div>
        </div>
      </div>

      {/* Compass logo — bottom right */}
      <div style={{
        position: 'absolute',
        bottom: 48,
        right: 64,
        opacity: logoOpacity,
      }}>
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" stroke={ORANGE} strokeWidth="4"/>
          <line x1="50" y1="10" x2="50" y2="90" stroke={ORANGE} strokeWidth="3"/>
          <line x1="10" y1="50" x2="90" y2="50" stroke={ORANGE} strokeWidth="3"/>
          <circle cx="50" cy="50" r="5" fill={ORANGE}/>
          <polygon points="50,14 54,28 46,28" fill={WHITE}/>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
