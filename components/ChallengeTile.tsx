'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

const navy   = 'oklch(22% 0.10 260)';
const orange = 'oklch(65% 0.15 45)';
const mid    = 'oklch(52% 0.008 260)';

function getEncouragementKey(day: number): string {
  if (day <= 9)  return 'tileEncourage1';
  if (day <= 18) return 'tileEncourage2';
  if (day <= 27) return 'tileEncourage3';
  if (day <= 36) return 'tileEncourage4';
  if (day <= 45) return 'tileEncourage5';
  if (day <= 55) return 'tileEncourage6';
  return 'tileEncourage7';
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
  const { t } = useLanguage();
  const c = t.challenge;
  const [open, setOpen] = useState(false);
  const pct = Math.round((currentDay / 62) * 100);

  const encouragement = (c as Record<string, string>)[getEncouragementKey(currentDay)] ?? '';
  const keepGoing = c.tileKeepGoing.replace('{name}', firstName);
  const groupMessage = c.tileGroupMessage.replace('{name}', firstName);

  const mainCta = userRole === 'member'
    ? c.tileOpenDay.replace('{n}', String(currentDay))
    : c.tileContinueDay.replace('{n}', String(currentDay));

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
          alt={c.certChallengeName}
          width={64}
          height={64}
          style={{ borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: orange, marginBottom: '0.25rem',
          }}>
            {c.certChallengeName}
          </p>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.875rem', color: navy }}>
            {c.journalDayLabel} {currentDay} {c.tileOf62}
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
              {c.certChallengeName}
            </p>

            {/* Day count */}
            <p style={{
              fontFamily: 'var(--font-montserrat)', fontWeight: 900,
              fontSize: '1.5rem', color: navy, lineHeight: 1.1,
              textAlign: 'center', marginBottom: '0.75rem',
            }}>
              {c.journalDayLabel} {currentDay} <span style={{ fontSize: '1rem', fontWeight: 400, color: mid }}>{c.tileOf62}</span>
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
              {userRole === 'member' ? groupMessage : `${encouragement} ${keepGoing}`}
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
                {mainCta}
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
                {c.journalMyJournal}
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
                  {c.tileTeam}
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
                  {c.tileFacilitatorSettings}
                </Link>
              )}

              {userRole !== 'facilitator' && (
                <Link
                  href="/challenge/settings"
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
                  {c.tileNotifSettings}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
