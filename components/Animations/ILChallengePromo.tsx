import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const ILChallengePromo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const NAVY = '#0F2347';
  const ORANGE = '#E07540';
  const WHITE = '#F8F7F4';

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  const sixtyProgress = spring({frame: frame - 25, fps, config: {damping: 20, stiffness: 120}});
  const sixtyY = interpolate(sixtyProgress, [0, 1], [120, 0]);
  const sixtyOpacity = interpolate(frame, [25, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const sessionsProgress = spring({frame: frame - 65, fps, config: {damping: 22, stiffness: 100}});
  const sessionsY = interpolate(sessionsProgress, [0, 1], [40, 0]);
  const sessionsOpacity = interpolate(frame, [65, 95], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const barWidth = interpolate(frame, [100, 145], [0, 320], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const freeOpacity = interpolate(frame, [120, 155], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const freeX = interpolate(frame, [120, 155], [-30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const challengeOpacity = interpolate(frame, [155, 185], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const challengeY = interpolate(frame, [155, 185], [25, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const urlOpacity = interpolate(frame, [180, 205], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        opacity: bgOpacity,
        fontFamily: "'Montserrat', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 80px',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(135deg, transparent, transparent 60px, rgba(224,117,64,0.03) 60px, rgba(224,117,64,0.03) 61px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        opacity: sixtyOpacity,
        transform: `translateY(${sixtyY}px)`,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 200,
        fontWeight: 700,
        lineHeight: 1,
        color: WHITE,
        letterSpacing: '-4px',
        marginBottom: -10,
      }}>
        60
      </div>

      <div style={{
        opacity: sessionsOpacity,
        transform: `translateY(${sessionsY}px)`,
        fontSize: 52,
        fontWeight: 700,
        letterSpacing: '0.18em',
        color: WHITE,
        marginBottom: 36,
      }}>
        SESSIONS.
      </div>

      <div style={{
        width: barWidth,
        height: 4,
        backgroundColor: ORANGE,
        marginBottom: 32,
        borderRadius: 2,
      }} />

      <div style={{
        opacity: freeOpacity,
        transform: `translateX(${freeX}px)`,
        fontSize: 28,
        fontWeight: 600,
        letterSpacing: '0.12em',
        color: ORANGE,
        marginBottom: 20,
      }}>
        COMPLETELY FREE.
      </div>

      <div style={{
        opacity: challengeOpacity,
        transform: `translateY(${challengeY}px)`,
        fontSize: 20,
        fontWeight: 500,
        letterSpacing: '0.1em',
        color: 'rgba(248,247,244,0.70)',
        marginBottom: 48,
        maxWidth: 600,
        lineHeight: 1.5,
      }}>
        THE INFLUENTIAL LEADERSHIP CHALLENGE
      </div>

      <div style={{
        opacity: urlOpacity,
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: 'rgba(248,247,244,0.45)',
      }}>
        crispyleaders.com/challenge
      </div>

      <div style={{
        position: 'absolute',
        bottom: 40,
        right: 60,
        opacity: urlOpacity * 0.8,
        width: 44,
        height: 44,
      }}>
        <svg viewBox="0 0 100 100" fill="none" width="44" height="44">
          <circle cx="50" cy="50" r="46" stroke={ORANGE} strokeWidth="4"/>
          <line x1="50" y1="10" x2="50" y2="90" stroke={ORANGE} strokeWidth="3"/>
          <line x1="10" y1="50" x2="90" y2="50" stroke={ORANGE} strokeWidth="3"/>
          <circle cx="50" cy="50" r="6" fill={ORANGE}/>
          <polygon points="50,14 53,26 47,26" fill={WHITE}/>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
