import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import TeamFeed from "./TeamFeed";

export const metadata = { title: "Team — Influential Leadership Challenge" };

const navy   = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const mid    = "oklch(52% 0.008 260)";

export default async function ChallengeTeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/challenge/team");

  const admin = createAdminClient();

  const { data: enrollments } = await admin
    .from("challenge_enrollments")
    .select("current_day, group_id")
    .eq("user_id", user.id)
    .limit(1);

  const enrollment = enrollments?.[0] ?? null;
  if (!enrollment?.group_id) redirect("/dashboard");

  const groupId = enrollment.group_id;
  const myCurrentDay: number = enrollment.current_day ?? 1;
  const previousDay = myCurrentDay - 1;
  const hasPreviousDay = myCurrentDay > 1;

  // Fetch members and group in parallel
  const [{ data: rawMembers }, { data: groupData }] = await Promise.all([
    admin.from("challenge_group_members").select("user_id, role").eq("group_id", groupId),
    admin.from("challenge_groups").select("id, name, facilitator_id").eq("id", groupId).single(),
  ]);

  const memberIds = (rawMembers ?? []).map((m: { user_id: string }) => m.user_id);
  const facilitatorId = (groupData as { id: string; name: string; facilitator_id: string } | null)?.facilitator_id;
  const allUserIds = [...new Set([...memberIds, user.id, ...(facilitatorId ? [facilitatorId] : [])])];

  // Parallel: profiles, enrollments, peer answers, modules
  const [profilesRes, enrollmentsRes, answersRes, modulesRes] = await Promise.all([
    admin.from("profiles").select("id, first_name, last_name").in("id", allUserIds),
    admin.from("challenge_enrollments").select("user_id, current_day").in("user_id", allUserIds),
    admin.from("challenge_journal_entries")
      .select("user_id, day_number, peer_answer")
      .in("user_id", allUserIds)
      .not("peer_answer", "is", null)
      .neq("peer_answer", "")
      .order("day_number", { ascending: false }),
    admin.from("challenge_modules")
      .select("day_number, title, core_idea, peer_question")
      .order("day_number", { ascending: false }),
  ]);

  type ProfileRow = { id: string; first_name: string | null; last_name: string | null };
  const profiles = new Map<string, ProfileRow>(
    ((profilesRes.data ?? []) as ProfileRow[]).map(p => [p.id, p])
  );
  const enrollmentMap = new Map<string, number>(
    ((enrollmentsRes.data ?? []) as { user_id: string; current_day: number | null }[])
      .map(e => [e.user_id, e.current_day ?? 1])
  );

  function memberName(uid: string): string {
    const p = profiles.get(uid);
    return p ? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Member" : "Member";
  }

  // Build member list (deduplicated by user_id)
  const memberRoleMap = new Map<string, string>(
    (rawMembers ?? []).map((m: { user_id: string; role: string }) => [m.user_id, m.role])
  );
  if (facilitatorId && !memberRoleMap.has(facilitatorId)) {
    memberRoleMap.set(facilitatorId, "facilitator");
  }

  type MemberInfo = { user_id: string; name: string; current_day: number; role: string; is_me: boolean };
  const members: MemberInfo[] = allUserIds.map(uid => ({
    user_id: uid,
    name: memberName(uid),
    current_day: enrollmentMap.get(uid) ?? 1,
    role: memberRoleMap.get(uid) ?? "member",
    is_me: uid === user.id,
  }));

  // Build answers by day (string keys for safe JSON serialization)
  type PeerEntry = { user_id: string; name: string; answer: string };
  const answersByDay: Record<string, PeerEntry[]> = {};
  for (const a of (answersRes.data ?? []) as { user_id: string; day_number: number; peer_answer: string | null }[]) {
    if (!a.peer_answer?.trim()) continue;
    const key = String(a.day_number);
    if (!answersByDay[key]) answersByDay[key] = [];
    answersByDay[key].push({ user_id: a.user_id, name: memberName(a.user_id), answer: a.peer_answer });
  }

  type ModuleInfo = { day_number: number; title: string; core_idea: string | null; peer_question: string | null };
  const moduleMap: Record<string, ModuleInfo> = Object.fromEntries(
    ((modulesRes.data ?? []) as ModuleInfo[]).map(m => [String(m.day_number), m])
  );

  const daysWithAnswers = Object.keys(answersByDay).map(Number).sort((a, b) => b - a);
  const previousModule = hasPreviousDay ? moduleMap[String(previousDay)] ?? null : null;
  const previousAnswers: PeerEntry[] = hasPreviousDay ? (answersByDay[String(previousDay)] ?? []) : [];
  const feedDays = daysWithAnswers.filter(d => d !== previousDay);

  const groupName = (groupData as { name: string } | null)?.name ?? "Your Team";

  return (
    <div style={{ minHeight: "calc(100dvh - 80px)", background: "oklch(97% 0.005 80)" }}>
      {/* Top bar */}
      <div style={{ background: navy, padding: "0.875rem clamp(1rem, 4vw, 2rem)", display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <Link href="/dashboard" style={{ color: "oklch(72% 0.04 260)", textDecoration: "none", fontSize: "0.75rem", fontFamily: "var(--font-montserrat)", flexShrink: 0 }}>
          ← Dashboard
        </Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/il-challenge-icon.png" alt="" width={28} height={28} style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(97% 0.005 80)", letterSpacing: "0.08em", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {groupName}
        </span>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: orange, marginBottom: "0.375rem" }}>
            Influential Leadership Challenge
          </p>
          <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "clamp(1.375rem, 3vw, 1.75rem)", color: navy, lineHeight: 1.2, marginBottom: "1.25rem" }}>
            {groupName}
          </h1>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.8rem", color: navy, background: "transparent", border: "1px solid oklch(82% 0.006 260)", padding: "0.6rem 1rem", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}
            >
              ← Back
            </Link>
            <Link
              href={`/challenge/day/${myCurrentDay}`}
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "white", background: orange, padding: "0.6rem 1.25rem", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}
            >
              Today: Day {myCurrentDay} →
            </Link>
          </div>
        </div>

        {/* Member list */}
        <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: "0.875rem" }}>
            Team Members
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {members.map(m => (
              <div key={m.user_id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: m.is_me ? orange : "oklch(88% 0.06 260)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, color: m.is_me ? "white" : navy }}>
                      {m.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: m.is_me ? 700 : 500, fontSize: "0.875rem", color: navy }}>
                      {m.name}{m.is_me ? " (you)" : ""}
                    </span>
                    {m.role === "facilitator" && (
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 600, color: orange, marginLeft: "0.5rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        Facilitator
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: mid, flexShrink: 0 }}>
                  Day {m.current_day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured: previous day responses */}
        {hasPreviousDay && (
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, marginBottom: "0.875rem" }}>
              Yesterday — Day {previousDay}
            </p>

            {/* Module context card */}
            <div style={{ background: navy, borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
              {previousModule ? (
                <>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "white", marginBottom: previousModule.core_idea ? "0.5rem" : 0 }}>
                    {previousModule.title}
                  </p>
                  {previousModule.core_idea && (
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(75% 0.04 260)", lineHeight: 1.65, marginBottom: previousModule.peer_question ? "1rem" : 0 }}>
                      {previousModule.core_idea}
                    </p>
                  )}
                  {previousModule.peer_question && (
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 600, color: orange, margin: 0 }}>
                      {previousModule.peer_question}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "white", margin: 0 }}>
                  Day {previousDay}
                </p>
              )}
            </div>

            {/* Responses */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {previousAnswers.map((a, i) => (
                <div key={i} style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: a.user_id === user.id ? orange : mid, marginBottom: "0.4rem" }}>
                    {a.user_id === user.id ? "You" : a.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(28% 0.008 260)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                    {a.answer}
                  </p>
                </div>
              ))}
              {members
                .filter(m => !previousAnswers.find(a => a.user_id === m.user_id))
                .map(m => (
                  <div key={m.user_id} style={{ background: "oklch(97% 0.005 80)", border: "1px dashed oklch(88% 0.006 80)", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(72% 0.006 260)", marginBottom: "0.25rem" }}>
                      {m.is_me ? "You" : m.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", color: "oklch(68% 0.006 260)", fontStyle: "italic", margin: 0 }}>
                      No response yet
                    </p>
                  </div>
                ))}
              {previousAnswers.length === 0 && members.length === 0 && (
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid }}>
                  No responses yet for Day {previousDay}.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Day 1 welcome state */}
        {!hasPreviousDay && (
          <div style={{ background: "white", border: "1px solid oklch(88% 0.006 80)", borderRadius: "12px", padding: "1.75rem 1.5rem", marginBottom: "2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: navy, marginBottom: "0.5rem" }}>
              The journey starts here.
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: mid, lineHeight: 1.65, marginBottom: "1.25rem" }}>
              Complete Day 1 and share your response — it will appear here for the whole team.
            </p>
            <Link
              href="/challenge/day/1"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.875rem", color: "white", background: orange, padding: "0.75rem 1.75rem", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}
            >
              Open Day 1 →
            </Link>
          </div>
        )}

        {/* Historical feed */}
        {feedDays.length > 0 && (
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: mid, marginBottom: "0.875rem" }}>
              Previous Days
            </p>
            <TeamFeed
              days={feedDays}
              answersByDay={answersByDay}
              moduleMap={moduleMap}
              currentUserId={user.id}
              members={members}
            />
          </div>
        )}

      </div>
    </div>
  );
}
