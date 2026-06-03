import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Browse Groups — Influential Leadership Challenge" };

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function BrowseGroupsPage() {
  const admin = createAdminClient();

  const { data: groups } = await admin
    .from("challenge_groups")
    .select("id, name, description, max_members, schedule_days")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  const groupIds = (groups ?? []).map(g => g.id);
  type CountRow = { group_id: string };
  const { data: memberRows } = groupIds.length > 0
    ? await admin.from("challenge_group_members").select("group_id").in("group_id", groupIds)
    : { data: [] as CountRow[] };

  const memberCounts: Record<string, number> = {};
  (memberRows as CountRow[] ?? []).forEach(r => {
    memberCounts[r.group_id] = (memberCounts[r.group_id] ?? 0) + 1;
  });

  const navy     = "oklch(22% 0.10 260)";
  const orange   = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const mid      = "oklch(52% 0.008 260)";

  return (
    <div style={{ background: offWhite, minHeight: "100dvh", padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 4rem)" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <Link href="/challenge" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: mid, textDecoration: "none", marginBottom: "1.5rem", display: "inline-block" }}>
          ← Back
        </Link>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.5rem" }}>
          Open groups
        </p>
        <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: navy, marginBottom: "0.5rem" }}>
          Find a group
        </h1>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: mid, lineHeight: 1.6, marginBottom: "2.5rem" }}>
          Browse open groups and apply to join one that fits your context.
        </p>

        {(!groups || groups.length === 0) ? (
          <div style={{ textAlign: "center", paddingBlock: "3rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: mid, marginBottom: "1.5rem" }}>
              No open groups yet. Be the first to create one.
            </p>
            <Link href="/challenge/group/create" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: offWhite, background: navy, padding: "0.75rem 1.75rem", borderRadius: "8px", textDecoration: "none" }}>
              Create a group →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {(groups ?? []).map(group => {
              const count = memberCounts[group.id] ?? 0;
              const spotsLeft = group.max_members - count;
              const isFull = spotsLeft <= 0;
              return (
                <div key={group.id} style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.25rem 1.5rem", opacity: isFull ? 0.6 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1rem", color: navy, marginBottom: "0.25rem" }}>{group.name}</p>
                      {group.description && (
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: mid, lineHeight: 1.5 }}>{group.description}</p>
                      )}
                    </div>
                    {isFull ? (
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: mid, whiteSpace: "nowrap" }}>Full</span>
                    ) : (
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(42% 0.14 145)", whiteSpace: "nowrap" }}>
                        {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: mid, marginBottom: "1rem" }}>
                    {(group.schedule_days ?? []).sort().map((d: number) => DAY_NAMES[d]).join(", ")}
                  </p>
                  {!isFull && (
                    <Link
                      href={`/challenge/group/${group.id}/apply`}
                      style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8125rem", color: offWhite, background: navy, padding: "0.5rem 1.25rem", borderRadius: "6px", textDecoration: "none", display: "inline-block" }}
                    >
                      Apply to join
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
