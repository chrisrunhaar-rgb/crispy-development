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

export default function TeamResultsGrid({
  members,
  results,
}: {
  members: TeamResultMember[];
  results: TeamMemberResult[];
}) {
  if (members.length === 0) return null;

  // Build lookup: userId → { resultType → result }
  const lookup = new Map<string, Map<string, TeamMemberResult>>();
  for (const r of results) {
    if (!lookup.has(r.user_id)) lookup.set(r.user_id, new Map());
    lookup.get(r.user_id)!.set(r.result_type, r);
  }

  const hasAny = results.length > 0;
  if (!hasAny) {
    return (
      <div>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>Team Results</p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(55% 0.008 260)", lineHeight: 1.6 }}>
          No results yet. Results from modules 4–7 will appear here once team members complete them.
        </p>
      </div>
    );
  }

  const RESULT_TYPES = [
    { key: "comm_style", label: "Comm Style", href: "/team/communication-culture" },
    { key: "trust", label: "Trust Score", href: "/team/trust-psychological-safety" },
    { key: "contribution_zone", label: "Contribution Zone", href: "/team/roles-contribution" },
    { key: "conflict_style", label: "Conflict Style", href: "/team/navigating-conflict" },
  ];

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

                  {/* Comm Style */}
                  <td style={{ padding: "0.875rem 0.75rem" }}>
                    {(() => {
                      const r = memberResults?.get("comm_style");
                      if (!r?.result_key) return <span style={{ color: "oklch(72% 0.006 260)", fontSize: "0.72rem" }}>—</span>;
                      const meta = COMM_STYLE_LABELS[r.result_key];
                      return meta ? <Pill label={meta.name} color={meta.color} /> : <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(38% 0.008 260)" }}>{r.result_key}</span>;
                    })()}
                  </td>

                  {/* Trust Score */}
                  <td style={{ padding: "0.875rem 0.75rem" }}>
                    {(() => {
                      const r = memberResults?.get("trust");
                      if (!r?.result_key) return <span style={{ color: "oklch(72% 0.006 260)", fontSize: "0.72rem" }}>—</span>;
                      return <TrustBadge avg={parseFloat(r.result_key)} />;
                    })()}
                  </td>

                  {/* Contribution Zone */}
                  <td style={{ padding: "0.875rem 0.75rem" }}>
                    {(() => {
                      const r = memberResults?.get("contribution_zone");
                      if (!r?.result_key) return <span style={{ color: "oklch(72% 0.006 260)", fontSize: "0.72rem" }}>—</span>;
                      const color = ZONE_COLORS[r.result_key] ?? "oklch(42% 0.008 260)";
                      return <Pill label={r.result_key} color={color} />;
                    })()}
                  </td>

                  {/* Conflict Style */}
                  <td style={{ padding: "0.875rem 0.75rem" }}>
                    {(() => {
                      const r = memberResults?.get("conflict_style");
                      if (!r?.result_key) return <span style={{ color: "oklch(72% 0.006 260)", fontSize: "0.72rem" }}>—</span>;
                      const meta = CONFLICT_STYLE_LABELS[r.result_key];
                      return meta ? <Pill label={meta.name} color={meta.color} /> : <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(38% 0.008 260)" }}>{r.result_key}</span>;
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
