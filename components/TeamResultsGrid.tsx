"use client";

import Link from "next/link";

export type TeamMemberResult = {
  user_id: string;
  result_type: string;
  result_key: string | null;
  scores: Record<string, number>;
  completed_at: string;
};

export type TeamResultMember = {
  id: string;
  name: string;
};

const COMM_STYLE_LABELS: Record<string, { name: string; color: string }> = {
  A: { name: "Architect", color: "oklch(42% 0.18 250)" },
  D: { name: "Diplomat", color: "oklch(42% 0.18 145)" },
  C: { name: "Connector", color: "oklch(48% 0.18 45)" },
  N: { name: "Analyst", color: "oklch(42% 0.18 300)" },
};

const CONFLICT_STYLE_LABELS: Record<string, { name: string; color: string }> = {
  A: { name: "Avoider", color: "oklch(42% 0.14 260)" },
  C: { name: "Collaborator", color: "oklch(42% 0.14 145)" },
  M: { name: "Mediator", color: "oklch(48% 0.14 45)" },
};

const ZONE_COLORS: Record<string, string> = {
  Pioneer: "oklch(48% 0.18 45)",
  Builder: "oklch(42% 0.18 250)",
  Sustainer: "oklch(42% 0.14 145)",
  Connector: "oklch(48% 0.18 300)",
};

function TrustBadge({ avg }: { avg: number }) {
  const color = avg >= 4.5 ? "oklch(42% 0.14 145)"
    : avg >= 3.5 ? "oklch(55% 0.14 85)"
    : avg >= 2.5 ? "oklch(55% 0.14 55)"
    : "oklch(50% 0.18 20)";
  return (
    <span style={{
      fontFamily: "var(--font-montserrat)",
      fontWeight: 800,
      fontSize: "0.85rem",
      color,
    }}>
      {avg}<span style={{ fontSize: "0.65rem", fontWeight: 400, color: "oklch(60% 0.006 260)" }}>/5</span>
    </span>
  );
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontFamily: "var(--font-montserrat)",
      fontSize: "0.62rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      color,
      background: `color-mix(in oklch, ${color} 12%, white)`,
      padding: "2px 8px",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

// All possible result columns — always shown if data exists OR if selected by leader
const ALL_RESULT_TYPES: Record<string, { label: string; href: string; assessmentId?: string }> = {
  comm_style:        { label: "Comm Style",        href: "/team/communication-culture" },
  trust:             { label: "Trust Score",        href: "/team/trust-psychological-safety" },
  contribution_zone: { label: "Contribution Zone", href: "/team/roles-contribution" },
  conflict_style:    { label: "Conflict Style",     href: "/team/navigating-conflict" },
  disc:              { label: "DISC",               href: "/team/disc",                assessmentId: "disc" },
  wheel_of_life:     { label: "Wheel of Life",      href: "/team/wheel-of-life",       assessmentId: "wheel-of-life" },
  thinking_style:    { label: "Thinking Style",     href: "/team/three-thinking-styles", assessmentId: "three-thinking-styles" },
  enneagram:         { label: "Enneagram",          href: "/team/enneagram",           assessmentId: "enneagram" },

  personalities16:   { label: "16 Personalities",  href: "/team/16-personalities",    assessmentId: "16-personalities" },
  big_five:          { label: "Big Five",           href: "/team/big-five",            assessmentId: "big-five" },
  karunia:           { label: "Karunia Rohani",     href: "/team/karunia-rohani",      assessmentId: "karunia-rohani" },
};

export default function TeamResultsGrid({
  members,
  results,
  selectedAssessments = [],
}: {
  members: TeamResultMember[];
  results: TeamMemberResult[];
  selectedAssessments?: string[];
}) {
  if (members.length === 0) return null;

  // Build lookup: userId → { resultType → result }
  const lookup = new Map<string, Map<string, TeamMemberResult>>();
  for (const r of results) {
    if (!lookup.has(r.user_id)) lookup.set(r.user_id, new Map());
    lookup.get(r.user_id)!.set(r.result_type, r);
  }

  // Show columns: always show the 4 core team module columns + any selected assessment that has data
  const resultTypesInData = new Set(results.map(r => r.result_type));
  const RESULT_TYPES = Object.entries(ALL_RESULT_TYPES).filter(([key, meta]) => {
    if (!meta.assessmentId) return true; // always show core 4
    return selectedAssessments.includes(meta.assessmentId) || resultTypesInData.has(key);
  }).map(([key, meta]) => ({ key, ...meta }));

  const hasAny = results.length > 0;
  if (!hasAny) {
    return (
      <div>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>Team Results</p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(55% 0.008 260)", lineHeight: 1.6 }}>
          No results yet. Results from team modules and assessments will appear here once members complete them.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "1.25rem", fontSize: "0.62rem" }}>Team Results</p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid oklch(88% 0.008 80)" }}>
              <th style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "oklch(54% 0.008 260)",
                textAlign: "left",
                padding: "0.5rem 1rem 0.5rem 0",
                width: "160px",
              }}>
                Member
              </th>
              {RESULT_TYPES.map(rt => (
                <th key={rt.key} style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "oklch(54% 0.008 260)",
                  textAlign: "left",
                  padding: "0.5rem 0.75rem",
                }}>
                  <Link href={rt.href} style={{ color: "inherit", textDecoration: "none" }}>
                    {rt.label}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => {
              const memberResults = lookup.get(member.id);
              return (
                <tr key={member.id} style={{ borderBottom: "1px solid oklch(92% 0.004 80)", background: idx % 2 === 0 ? "white" : "oklch(98.5% 0.003 80)" }}>
                  <td style={{ padding: "0.875rem 1rem 0.875rem 0" }}>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.85rem", color: "oklch(22% 0.005 260)" }}>
                      {member.name}
                    </p>
                  </td>

                  {RESULT_TYPES.map(rt => (
                    <td key={rt.key} style={{ padding: "0.875rem 0.75rem" }}>
                      {(() => {
                        const r = memberResults?.get(rt.key);
                        if (!r?.result_key) return <span style={{ color: "oklch(72% 0.006 260)", fontSize: "0.72rem" }}>—</span>;
                        switch (rt.key) {
                          case "comm_style": {
                            const meta = COMM_STYLE_LABELS[r.result_key];
                            return meta ? <Pill label={meta.name} color={meta.color} /> : <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(38% 0.008 260)" }}>{r.result_key}</span>;
                          }
                          case "trust":
                            return <TrustBadge avg={parseFloat(r.result_key)} />;
                          case "contribution_zone": {
                            const color = ZONE_COLORS[r.result_key] ?? "oklch(42% 0.008 260)";
                            return <Pill label={r.result_key} color={color} />;
                          }
                          case "conflict_style": {
                            const meta = CONFLICT_STYLE_LABELS[r.result_key];
                            return meta ? <Pill label={meta.name} color={meta.color} /> : <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(38% 0.008 260)" }}>{r.result_key}</span>;
                          }
                          case "disc": {
                            const colors: Record<string, string> = { D: "oklch(48% 0.18 20)", I: "oklch(48% 0.14 85)", S: "oklch(42% 0.14 145)", C: "oklch(42% 0.18 250)" };
                            return <Pill label={r.result_key} color={colors[r.result_key] ?? "oklch(42% 0.008 260)"} />;
                          }
                          case "wheel_of_life":
                            return <TrustBadge avg={parseFloat(r.result_key)} />;
                          case "thinking_style": {
                            const labels: Record<string, string> = { C: "Conceptual", H: "Holistic", I: "Intuitional", CH: "C·H", CI: "C·I", HI: "H·I", CHI: "Balanced" };
                            return <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(42% 0.008 260)" }}>{labels[r.result_key] ?? r.result_key}</span>;
                          }
                          case "enneagram":
                            return <Pill label={`Type ${r.result_key}`} color="oklch(42% 0.14 260)" />;
                          case "personalities16":
                            return <Pill label={r.result_key} color="oklch(42% 0.14 200)" />;
                          case "big_five":
                            return <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(42% 0.008 260)" }}>{r.result_key}</span>;
                          case "karunia": {
                            const KARUNIA_LABELS: Record<string, string> = { melayani: "Melayani", murah_hati: "Murah Hati", keramahan: "Keramahan", memberi: "Memberi", hikmat: "Hikmat", iman: "Iman", memimpin: "Memimpin", mengajar: "Mengajar", gembala: "Gembala", bernubuat: "Bernubuat" };
                            return <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(42% 0.14 145)" }}>{KARUNIA_LABELS[r.result_key] ?? r.result_key}</span>;
                          }
                          default:
                            return <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(38% 0.008 260)" }}>{r.result_key}</span>;
                        }
                      })()}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
