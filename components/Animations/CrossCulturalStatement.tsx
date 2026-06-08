import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const CrossCulturalStatement: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const NAVY = '#0F2347';
  const ORANGE = '#E07540';
  const WHITE = '#F8F7F4';

  const words = [
    {text: 'LEAD', start: 10},
    {text: 'ACROSS', start: 35},
    {text: 'CULTURES.', start: 60, color: ORANGE},
  ];

  const bar1Width = interpolate(frame, [85, 115], [0, 520], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const line1Opacity = interpolate(frame, [90, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const line1Y = interpolate(frame, [90, 120], [15, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const line2Opacity = interpolate(frame, [115, 145], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const line2Y = interpolate(frame, [115, 145], [15, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const brandOpacity = interpolate(frame, [150, 175], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        fontFamily: "'Montserrat', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 80px',
        overflow: 'hidden',
      }}
    >
      <div style={{display: 'flex', gap: 28, marginBottom: 28, alignItems: 'baseline', flexWrap: 'nowrap'}}>
        {words.map((word, i) => {
          const wProgress = spring({frame: frame - word.start, fps, config: {damping: 18, stiffness: 110}});
          const wY = interpolate(wProgress, [0, 1], [50, 0]);
          const wOpacity = interpolate(frame, [word.start, word.start + 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{
              opacity: wOpacity,
              transform: `translateY(${wY}px)`,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 100,
              fontWeight: 700,
              color: (word as any).color || WHITE,
              letterSpacing: '-1px',
              lineHeight: 1,
            }}>
              {word.text}
            </div>
          );
        })}
      </div>

      <div style={{
        width: bar1Width,
        height: 3,
        backgroundColor: ORANGE,
        marginBottom: 40,
        borderRadius: 2,
      }} />

      <div style={{textAlign: 'center', maxWidth: 680}}>
        <div style={{
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '0.14em',
          color: 'rgba(248,247,244,0.80)',
          marginBottom: 18,
        }}>
          ASSESSMENT TOOLS · COACHING · TRAINING
        </div>
        <div style={{
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
          fontSize: 15,
          fontWeight: 400,
          letterSpacing: '0.10em',
          color: 'rgba(248,247,244,0.48)',
        }}>
          FOR FIELD WORKERS AND GLOBAL LEADERS
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 44,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: brandOpacity,
      }}>
        <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" stroke={ORANGE} strokeWidth="5"/>
          <line x1="50" y1="10" x2="50" y2="90" stroke={ORANGE} strokeWidth="3.5"/>
          <line x1="10" y1="50" x2="90" y2="50" stroke={ORANGE} strokeWidth="3.5"/>
          <circle cx="50" cy="50" r="6" fill={ORANGE}/>
          <polygon points="50,14 54,28 46,28" fill={WHITE}/>
        </svg>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: WHITE,
        }}>CRISPY DEVELOPMENT</span>
      </div>
    </AbsoluteFill>
  );
};
