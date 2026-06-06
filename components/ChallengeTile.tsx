'use client';

import { useState } from 'react';
import Link from 'next/link';

const navy   = 'oklch(22% 0.10 260)';
const orange = 'oklch(65% 0.15 45)';
const mid    = 'oklch(52% 0.008 260)';

function getEncouragement(day: number): string {
  if (day <= 9)  return "Great start. One day at a time.";
  if (day <= 18) return "Momentum is building. Keep the habit.";
  if (day <= 27) return "Consistency shapes character. You're proving it.";
  if (day <= 36) return "Going deeper. Stay the course.";
  if (day <= 45) return "More than halfway. Your leadership is growing.";
  if (day <= 55) return "Almost there. Don't stop now.";
  return "The final stretch. Finish strong.";
}

export default function ChallengeTile({
  currentDay,
  userRole,
  firstName,
}: {
  currentDay: number;
  userRole: 'solo' | 'facilitator' | 'member';
  firstName: string;
}) {
  const [open, setOpen] = useState(false);
  const pct = Math.round((currentDay / 62) * 100);

  return (
    <>
      {/* ── Dashboard tile ── */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 0, width: '100%', textAlign: 'left',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/il-challenge-icon.png"
          alt="Influential Leadership Challenge"
          width={64}
          height={64}
          style={{ borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: orange, marginBottom: '0.25rem',
          }}>
            Influential Leadership Challenge
          </p>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.875rem', color: navy }}>
            Day {currentDay} of 62
          </p>
          <div style={{ marginTop: '0.375rem', height: '3px', background: 'oklch(88% 0.008 80)', borderRadius: '2px', width: '120px' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: orange, borderRadius: '2px' }} />
          </div>
        </div>
        <span style={{ color: mid, fontSize: '0.75rem', flexShrink: 0 }}>›</span>
      </button>

      {/* ── Popup modal ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'oklch(0% 0 0 / 0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '1.5rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'oklch(98% 0.003 80)',
              borderRadius: '16px',
              padding: '2rem 1.75rem',
              width: '100%',
              maxWidth: '360px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0',
              position: 'relative',
              boxShadow: '0 24px 64px oklch(10% 0.05 260 / 0.25)',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.1rem', color: mid, lineHeight: 1,
                padding: '0.25rem',
              }}
            >
              ✕
            </button>

            {/* Icon */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/il-challenge-icon.png"
              alt=""
              width={88}
              height={88}
              style={{ borderRadius: '50%', objectFit: 'cover', marginBottom: '1.25rem' }}
            />

            {/* Challenge label */}
            <p style={{
              fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: orange,
              marginBottom: '0.5rem', textAlign: 'center',
            }}>
              Influential Leadership Challenge
            </p>

            {/* Day count */}
            <p style={{
              fontFamily: 'var(--font-montserrat)', fontWeight: 900,
              fontSize: '1.5rem', color: navy, lineHeight: 1.1,
              textAlign: 'center', marginBottom: '0.75rem',
            }}>
              Day {currentDay} <span style={{ fontSize: '1rem', fontWeight: 400, color: mid }}>of 62</span>
            </p>

            {/* Progress bar */}
            <div style={{ width: '180px', height: '5px', background: 'oklch(88% 0.008 80)', borderRadius: '3px', marginBottom: '1rem' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: orange, borderRadius: '3px' }} />
            </div>

            {/* Encouragement */}
            <p style={{
              fontFamily: 'var(--font-montserrat)', fontSize: '0.8125rem',
              color: mid, lineHeight: 1.65, textAlign: 'center',
              marginBottom: '1.5rem', maxWidth: '280px',
            }}>
              {userRole === 'member'
                ? `Your group walks through this together, ${firstName}. A new session opens on your group schedule.`
                : `${getEncouragement(currentDay)} Keep going, ${firstName}.`}
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', width: '100%' }}>
              <Link
                href={`/challenge/day/${currentDay}`}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  background: orange, color: 'white',
                  fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.875rem',
                  padding: '0.8125rem 1rem', borderRadius: '8px', textDecoration: 'none',
                }}
              >
                {userRole === 'member' ? `Open Day ${currentDay} →` : `Continue Day ${currentDay} →`}
              </Link>

              <Link
                href="/challenge/journal"
                onClick={() => setOpen(false)}
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  background: 'transparent', color: navy,
                  fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.875rem',
                  padding: '0.8125rem 1rem', borderRadius: '8px', textDecoration: 'none',
                  border: '1px solid oklch(82% 0.006 260)',
                }}
              >
                My Journal
              </Link>

              {userRole !== 'solo' && (
                <Link
                  href="/challenge/team"
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'center',
                    background: 'transparent', color: navy,
                    fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.875rem',
                    padding: '0.8125rem 1rem', borderRadius: '8px', textDecoration: 'none',
                    border: '1px solid oklch(82% 0.006 260)',
                  }}
                >
                  Team →
                </Link>
              )}

              {userRole === 'facilitator' && (
                <Link
                  href="/challenge/facilitator"
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'center',
                    background: 'transparent', color: mid,
                    fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.8rem',
                    padding: '0.625rem 1rem', textDecoration: 'none',
                    borderTop: '1px solid oklch(90% 0.006 260)',
                    marginTop: '0.25rem', paddingTop: '0.875rem',
                  }}
                >
                  Facilitator Settings →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
