import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { approveApplication, declineApplication, markMessageRead, approvePeerApplication, declinePeerApplication, adminDeletePeerGroup, adminSetPeerGroupOpen, adminSetPeerGroupName } from "./actions";
import AdminReplyForm from "./AdminReplyForm";
import AdminBroadcastForm from "./AdminBroadcastForm";
import AdminLeaderRow from "./AdminLeaderRow";
import AdminSidebar from "@/components/AdminSidebar";
import MembersTab from "./MembersTab";
import ContentTab from "./ContentTab";
import TeamLeadersTab from "./TeamLeadersTab";
import PeerInitiatorsTab from "./PeerInitiatorsTab";

export const metadata = {
  title: "Community Dashboard — Crispy Development",
};

const ASSESSMENT_KEYS = [
  "disc_completed_at",
  "thinking_style_completed_at",
  "wheel_of_life_saved_at",
  "karunia_completed_at",
];

type ContentModule = { slug: string; title: string; created: string; updated: string; languages: string[] };
type ContentGroup = { category: string; modules: ContentModule[] };

const CONTENT_MODULES: ContentGroup[] = [
  {
    category: "Assessments",
    modules: [
      { slug: "disc", title: "DISC Profile", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "wheel-of-life", title: "Wheel of Life", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "three-thinking-styles", title: "Three Thinking Styles", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "karunia-rohani", title: "Karunia Rohani", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "enneagram", title: "Enneagram", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "myers-briggs", title: "Myers-Briggs", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "big-five", title: "Big Five", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "16-personalities", title: "16 Personalities", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
    ],
  },
  {
    category: "Cross-Cultural Leadership",
    modules: [
      { slug: "cultural-intelligence", title: "Cultural Intelligence", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "power-distance", title: "Power Distance", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "time-and-culture", title: "Time & Culture", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "intercultural-communication", title: "Intercultural Communication", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "building-trust-across-cultures", title: "Building Trust Across Cultures", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "giving-feedback-across-cultures", title: "Giving Feedback Across Cultures", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "conflict-resolution", title: "Conflict Resolution", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
    ],
  },
  {
    category: "Thinking & Decisions",
    modules: [
      { slug: "six-thinking-hats", title: "Six Thinking Hats", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "cognitive-biases", title: "Cognitive Biases", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "fixed-growth-mindset", title: "Fixed vs Growth Mindset", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "decision-making", title: "Decision Making", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "ladder-of-inference", title: "Ladder of Inference", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "johari-window", title: "Johari Window", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
    ],
  },
  {
    category: "Leadership",
    modules: [
      { slug: "leadership-altitudes", title: "Leadership Altitudes", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "servant-leadership", title: "Servant Leadership", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "vision-casting", title: "Vision Casting", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "managing-up", title: "Managing Up", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "storytelling-leadership", title: "Storytelling for Leaders", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "smart-goals", title: "SMART Goals", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "above-below-the-line", title: "Above & Below the Line", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "red-light-green-light", title: "Red Light Green Light", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "raising-next-generation", title: "Raising the Next Generation", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "team-health", title: "Team Health", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
    ],
  },
  {
    category: "Personal Growth",
    modules: [
      { slug: "emotional-intelligence", title: "Emotional Intelligence", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "overcoming-procrastination", title: "Overcoming Procrastination", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "escaping-the-comfort-zone", title: "Escaping the Comfort Zone", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "sabbath-leadership", title: "Sabbath Leadership", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "leaders-are-readers", title: "Leaders Are Readers", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "attention-retention", title: "Attention & Retention", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
      { slug: "debriefing-reflection", title: "Debriefing & Reflection", created: "2026-04-21", updated: "2026-04-21", languages: ["EN", "ID", "NL"] },
    ],
  },
  {
    category: "Training",
    modules: [
      { slug: "zoom-training", title: "Zoom Training (EN)", created: "2026-04-21", updated: "2026-04-21", languages: ["EN"] },
      { slug: "zoom-training-id", title: "Zoom Training (ID)", created: "2026-04-21", updated: "2026-04-21", languages: ["ID"] },
      { slug: "teams-training", title: "Teams Training (EN)", created: "2026-04-21", updated: "2026-04-21", languages: ["EN"] },
      { slug: "teams-training-id", title: "Teams Training (ID)", created: "2026-04-21", updated: "2026-04-21", languages: ["ID"] },
    ],
  },
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== "chris.runhaar@world-outreach.com") redirect("/");

  const { tab } = await searchParams;
  const activeTab = tab === "leaders" ? "leaders" : tab === "peers" ? "peers" : tab === "content" ? "content" : "members";

  const admin = createAdminClient();

  // ── Always fetch all users ──
  const { data: { users: allAuthUsers } } = await admin.auth.admin.listUsers({ perPage: 200 });
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  type UserRow = { id: string; email?: string; created_at: string; last_sign_in_at: string | null; user_metadata: Record<string, unknown> };
  const allUsers: UserRow[] = (allAuthUsers ?? []).filter(u => u.email !== "chris.runhaar@gmail.com").map(u => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    user_metadata: u.user_metadata ?? {},
  }));

  const activeInLast30 = allUsers.filter(u =>
    u.last_sign_in_at && new Date(u.last_sign_in_at) >= thirtyDaysAgo
  ).length;

  // ── Members tab ──
  let progressCounts = new Map<string, number>();

  if (activeTab === "members") {
    const { data: progressRows } = await admin
      .from("user_progress")
      .select("user_id")
      .eq("status", "completed");
    (progressRows ?? []).forEach((r: { user_id: string }) => {
      progressCounts.set(r.user_id, (progressCounts.get(r.user_id) ?? 0) + 1);
    });
  }

  // ── Leaders tab ──
  type CoachMsgRow = { id: string; message: string; subject: string | null; reply: string | null; replied_at: string | null; created_at: string; status: string; user_id: string };
  type TeamMemberRow = { name: string; email: string; completed: number };
  let pendingTeam: Record<string, unknown>[] = [];
  let approvedLeaders: Record<string, unknown>[] = [];
  let teamNameByLeader = new Map<string, string>();
  let teamMemberCountByLeader = new Map<string, number>();
  let teamMembersByLeaderId = new Map<string, TeamMemberRow[]>();
  let messagesByLeaderId = new Map<string, CoachMsgRow[]>();

  if (activeTab === "leaders") {
    const [p, a, m, t] = await Promise.all([
      admin.from("team_applications").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      admin.from("team_applications").select("*").eq("status", "approved").order("reviewed_at", { ascending: false }),
      admin.from("coach_messages").select("*").not("message_type", "eq", "peer").order("created_at", { ascending: false }),
      admin.from("teams").select("leader_user_id, name, id"),
    ]);
    pendingTeam = (p.data ?? []) as Record<string, unknown>[];
    approvedLeaders = (a.data ?? []) as Record<string, unknown>[];

    const teamByLeaderUserId = new Map<string, { id: string; name: string }>();
    (t.data ?? []).forEach((row: { leader_user_id: string; name: string; id: string }) => {
      teamNameByLeader.set(row.leader_user_id, row.name);
      teamByLeaderUserId.set(row.leader_user_id, { id: row.id, name: row.name });
    });

    const { data: progressRows } = await admin.from("user_progress").select("user_id").eq("status", "completed");
    const memberProgressCounts = new Map<string, number>();
    (progressRows ?? []).forEach((r: { user_id: string }) => {
      memberProgressCounts.set(r.user_id, (memberProgressCounts.get(r.user_id) ?? 0) + 1);
    });

    const membersByTeamId = new Map<string, TeamMemberRow[]>();
    (allAuthUsers ?? []).forEach(u => {
      const tid = u.user_metadata?.team_id;
      if (tid) {
        teamMemberCountByLeader.set(tid as string, (teamMemberCountByLeader.get(tid as string) ?? 0) + 1);
        const existing = membersByTeamId.get(tid as string) ?? [];
        existing.push({
          name: `${u.user_metadata?.first_name ?? ""} ${u.user_metadata?.last_name ?? ""}`.trim() || (u.email ?? ""),
          email: u.email ?? "",
          completed: memberProgressCounts.get(u.id) ?? 0,
        });
        membersByTeamId.set(tid as string, existing);
      }
    });

    teamByLeaderUserId.forEach((team, leaderUserId) => {
      teamMembersByLeaderId.set(leaderUserId, membersByTeamId.get(team.id) ?? []);
    });

    (m.data ?? []).forEach((msg: CoachMsgRow) => {
      const existing = messagesByLeaderId.get(msg.user_id) ?? [];
      existing.push(msg);
      messagesByLeaderId.set(msg.user_id, existing);
    });
  }

  // ── Peers tab ──
  let pendingPeers: Record<string, unknown>[] = [];
  let approvedInitiators: Record<string, unknown>[] = [];
  let peerMessages: Record<string, unknown>[] = [];
  type PeerGroupAdmin = { id: string; name: string; region: string; timezone: string; is_open: boolean; current_topic: string | null; language: string; initiator_user_id: string; created_at: string; memberCount: number };
  let allPeerGroups: PeerGroupAdmin[] = [];

  if (activeTab === "peers") {
    const [pp, ap, pm, pg] = await Promise.all([
      admin.from("peer_group_applications").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      admin.from("peer_group_applications").select("*").eq("status", "approved").order("reviewed_at", { ascending: false }),
      admin.from("coach_messages").select("*").eq("message_type", "peer").order("created_at", { ascending: false }).limit(30),
      admin.from("peer_groups").select("id, name, region, timezone, is_open, current_topic, language, initiator_user_id, created_at").order("created_at", { ascending: true }),
    ]);
    pendingPeers = (pp.data ?? []) as Record<string, unknown>[];
    approvedInitiators = (ap.data ?? []) as Record<string, unknown>[];
    peerMessages = (pm.data ?? []) as Record<string, unknown>[];

    const groupIds = (pg.data ?? []).map((g: { id: string }) => g.id);
    if (groupIds.length > 0) {
      const { data: memberCounts } = await admin
        .from("peer_group_members")
        .select("group_id")
        .in("group_id", groupIds)
        .eq("status", "active");
      const countMap = new Map<string, number>();
      (memberCounts ?? []).forEach((m: { group_id: string }) => {
        countMap.set(m.group_id, (countMap.get(m.group_id) ?? 0) + 1);
      });
      allPeerGroups = (pg.data ?? []).map((g: Omit<PeerGroupAdmin, "memberCount">) => ({
        ...g,
        memberCount: countMap.get(g.id) ?? 0,
      }));
    } else {
      allPeerGroups = [];
    }
  }

  // ── Content tab ──
  const contentSaveCounts = new Map<string, number>();
  const contentReadCounts = new Map<string, number>();
  if (activeTab === "content") {
    allUsers.forEach(u => {
      const saved = u.user_metadata?.saved_resources;
      if (Array.isArray(saved)) {
        (saved as string[]).forEach(slug => {
          contentSaveCounts.set(slug, (contentSaveCounts.get(slug) ?? 0) + 1);
        });
      }
      const read = u.user_metadata?.resource_read;
      if (Array.isArray(read)) {
        (read as string[]).forEach(slug => {
          contentReadCounts.set(slug, (contentReadCounts.get(slug) ?? 0) + 1);
        });
      }
    });
  }

  // ── Stats ──
  const { count: pendingTeamCount } = await admin.from("team_applications").select("id", { count: "exact", head: true }).eq("status", "pending");
  const { count: pendingPeerCount } = await admin.from("peer_group_applications").select("id", { count: "exact", head: true }).eq("status", "pending");
  const { count: newMessagesCount } = await admin.from("coach_messages").select("id", { count: "exact", head: true }).eq("status", "new");

  const memberCount = allUsers.length;

  const TABS = [
    { key: "members", label: "Members" },
    { key: "leaders", label: "Team Leaders", badge: pendingTeamCount ?? 0 },
    { key: "peers", label: "Peer Initiators", badge: pendingPeerCount ?? 0 },
    { key: "content", label: "Content" },
  ];

  // Members list for broadcast form targeting
  const membersList = allUsers.map(u => ({
    id: u.id,
    name: `${u.user_metadata?.first_name ?? ""} ${u.user_metadata?.last_name ?? ""}`.trim(),
    email: u.email ?? "",
  }));

  return (
    <div style={{ background: "#FAFBFC", minHeight: "100dvh", display: "flex" }}>
      <AdminSidebar />

      <div className="ds-main" style={{ flex: 1, minHeight: "100dvh" }}>
        {/* Header */}
      <div style={{ background: "oklch(30% 0.12 260)", paddingTop: "2rem", borderBottom: "1px solid oklch(22% 0.10 260)" }}>
        <div className="container-wide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>Admin Only</p>
              <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)" }}>
                Community Dashboard
              </h1>
            </div>
            <div style={{ display: "flex", gap: "2rem" }}>
              <Stat label="Total Members" value={memberCount} />
              <Stat label="Active 30 Days" value={activeInLast30} />
              <Stat label="Pending Leaders" value={pendingTeamCount ?? 0} accent />
              <Stat label="Pending Groups" value={pendingPeerCount ?? 0} accent />
              <Stat label="New Messages" value={newMessagesCount ?? 0} />
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: "0" }}>
            {TABS.map(t => (
              <Link
                key={t.key}
                href={`/admin?tab=${t.key}`}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  padding: "0.875rem 1.5rem",
                  color: activeTab === t.key ? "oklch(97% 0.005 80)" : "oklch(55% 0.04 260)",
                  background: activeTab === t.key ? "oklch(97% 0.005 80 / 0.08)" : "transparent",
                  borderBottom: activeTab === t.key ? "2px solid oklch(65% 0.15 45)" : "2px solid transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "color 0.15s",
                }}
              >
                {t.label}
                {(t.badge ?? 0) > 0 && (
                  <span style={{ background: "oklch(65% 0.15 45)", color: "white", fontSize: "0.62rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "2px" }}>
                    {t.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem", display: "flex", flexDirection: "column", gap: "3rem" }}>

        {/* ── MEMBERS TAB ── */}
        {activeTab === "members" && (
          <MembersTab
            users={allUsers}
            progressCounts={progressCounts}
            membersList={membersList}
          />
        )}

        {/* ── LEADERS TAB ── */}
        {activeTab === "leaders" && (
          <TeamLeadersTab
            pendingApplications={pendingTeam.map(app => ({
              id: app.id as string,
              user_id: app.user_id as string,
              first_name: app.first_name as string,
              last_name: app.last_name as string,
              email: app.user_email as string,
              application_text: app.reason as string,
              created_at: app.created_at as string,
              status: 'pending' as const,
              team_name: teamNameByLeader.get(app.user_id as string),
              member_count: teamMemberCountByLeader.get(app.user_id as string),
            }))}
            approvedLeaders={approvedLeaders.map(leader => ({
              id: leader.id as string,
              user_id: leader.user_id as string,
              first_name: leader.first_name as string,
              last_name: leader.last_name as string,
              email: leader.user_email as string,
              created_at: leader.created_at as string,
              status: 'approved' as const,
              reviewed_at: leader.reviewed_at as string,
              team_name: teamNameByLeader.get(leader.user_id as string),
              member_count: teamMemberCountByLeader.get(leader.user_id as string),
              member_details: teamMembersByLeaderId.get(leader.user_id as string),
            }))}
            onApprove={(id) => {
              // Trigger approval action
              const form = document.createElement('form');
              form.method = 'post';
              form.action = '';
              const input1 = document.createElement('input');
              input1.type = 'hidden';
              input1.name = 'applicationId';
              input1.value = id;
              form.appendChild(input1);
            }}
            onDecline={(id) => {
              // Trigger decline action
              const form = document.createElement('form');
              form.method = 'post';
              form.action = '';
              const input1 = document.createElement('input');
              input1.type = 'hidden';
              input1.name = 'applicationId';
              input1.value = id;
              form.appendChild(input1);
            }}
          />
        )}

        {/* ── PEERS TAB ── */}
        {activeTab === "peers" && (
          <>
            <PeerInitiatorsTab
              pendingApplications={pendingPeers.map(app => ({
                id: app.id as string,
                user_id: app.user_id as string,
                first_name: app.first_name as string,
                last_name: app.last_name as string,
                email: app.user_email as string,
                application_text: app.reason as string,
                created_at: app.created_at as string,
                status: 'pending' as const,
              }))}
              approvedInitiators={approvedInitiators.map(init => ({
                id: init.id as string,
                user_id: init.user_id as string,
                first_name: init.first_name as string,
                last_name: init.last_name as string,
                email: init.user_email as string,
                created_at: init.created_at as string,
                status: 'approved' as const,
                reviewed_at: init.reviewed_at as string,
              }))}
              peerGroups={allPeerGroups}
              onApprove={(id) => {
                // Trigger approval action
                const form = document.createElement('form');
                form.method = 'post';
                form.action = '';
                const input1 = document.createElement('input');
                input1.type = 'hidden';
                input1.name = 'applicationId';
                input1.value = id;
                form.appendChild(input1);
              }}
              onDecline={(id) => {
                // Trigger decline action
                const form = document.createElement('form');
                form.method = 'post';
                form.action = '';
                const input1 = document.createElement('input');
                input1.type = 'hidden';
                input1.name = 'applicationId';
                input1.value = id;
                form.appendChild(input1);
              }}
            />

            {/* All peer groups management */}
            <section>
              <h2 style={sectionHeading}>All Peer Groups ({allPeerGroups.length})</h2>
              {allPeerGroups.length === 0 ? (
                <p style={emptyText}>No peer groups yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                  {allPeerGroups.map(group => (
                    <div key={group.id} style={{ background: "oklch(99% 0.002 80)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: "220px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem", flexWrap: "wrap" }}>
                          <form action={adminSetPeerGroupName} style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
                            <input type="hidden" name="groupId" value={group.id} />
                            <input
                              type="text"
                              name="name"
                              defaultValue={group.name}
                              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.9375rem", color: "oklch(22% 0.005 260)", border: "1px solid oklch(84% 0.008 80)", padding: "0.2rem 0.5rem", background: "white", minWidth: "160px" }}
                            />
                            <button type="submit" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.3rem 0.625rem", background: "oklch(30% 0.12 260)", color: "white", border: "none", cursor: "pointer" }}>
                              Rename
                            </button>
                          </form>
                          <span style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.58rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "0.2rem 0.5rem",
                            background: group.is_open ? "oklch(55% 0.15 145 / 0.12)" : "oklch(88% 0.008 80)",
                            color: group.is_open ? "oklch(42% 0.14 145)" : "oklch(55% 0.008 260)",
                          }}>
                            {group.is_open ? "Open" : "Closed"}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                          <Field label="Region" value={group.region} />
                          <Field label="Timezone" value={group.timezone} />
                          <Field label="Language" value={group.language.toUpperCase()} />
                          <Field label="Members" value={String(group.memberCount)} />
                          {group.current_topic && <Field label="Topic" value={group.current_topic} />}
                        </div>
                        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(62% 0.008 260)", marginTop: "0.5rem" }}>
                          Created {formatDate(group.created_at)}
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flexShrink: 0 }}>
                        <form action={adminSetPeerGroupOpen}>
                          <input type="hidden" name="groupId" value={group.id} />
                          <input type="hidden" name="isOpen" value={group.is_open ? "false" : "true"} />
                          <button type="submit" style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            padding: "0.4rem 0.875rem",
                            border: `1px solid ${group.is_open ? "oklch(62% 0.008 260)" : "oklch(42% 0.14 145)"}`,
                            background: "white",
                            color: group.is_open ? "oklch(52% 0.008 260)" : "oklch(42% 0.14 145)",
                            cursor: "pointer",
                            width: "100%",
                          }}>
                            {group.is_open ? "Close" : "Open"}
                          </button>
                        </form>
                        <form action={adminDeletePeerGroup}>
                          <input type="hidden" name="groupId" value={group.id} />
                          <button type="submit" style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            padding: "0.4rem 0.875rem",
                            border: "1px solid oklch(45% 0.18 25)",
                            background: "white",
                            color: "oklch(45% 0.18 25)",
                            cursor: "pointer",
                            width: "100%",
                          }}>
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Peer initiator messages */}
            <section>
              <h2 style={sectionHeading}>
                Peer Initiator Messages
                {peerMessages.filter(m => m.status === "new").length > 0 && (
                  <Badge>{peerMessages.filter(m => m.status === "new").length}</Badge>
                )}
              </h2>
              {peerMessages.length === 0 ? (
                <p style={emptyText}>No messages from peer initiators yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                  {peerMessages.map((msg) => (
                    <div key={msg.id as string} style={{ background: "oklch(99% 0.002 80)", padding: "1.5rem 2rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                        <div>
                          <p style={nameStyle}>{msg.first_name as string} {msg.last_name as string}</p>
                          <p style={metaStyle}>{msg.user_email as string} · {formatDate(msg.created_at as string)}</p>
                        </div>
                        {msg.status === "new" && <span style={newBadge}>New</span>}
                      </div>
                      {msg.subject ? <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", color: "oklch(30% 0.12 260)", marginBottom: "0.5rem" }}>{String(msg.subject)}</p> : null}
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.6, color: "oklch(32% 0.008 260)" }}>{msg.message as string}</p>
                      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", alignItems: "center" }}>
                        {(msg.status === "new" || msg.status === "read") && (
                          <form action={markMessageRead}>
                            <input type="hidden" name="messageId" value={msg.id as string} />
                            <button type="submit" style={{ background: "none", border: "none", fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(62% 0.008 260)", cursor: "pointer" }}>
                              {msg.status === "new" ? "Mark read" : ""}
                            </button>
                          </form>
                        )}
                        {msg.status === "replied" && (
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(45% 0.14 145)", fontWeight: 700 }}>✓ Replied</span>
                        )}
                      </div>
                      <AdminReplyForm
                        messageId={msg.id as string}
                        existingReply={(msg.reply as string | null) ?? null}
                        repliedAt={(msg.replied_at as string | null) ?? null}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ── CONTENT TAB ── */}
        {activeTab === "content" && (
          <ContentTab
            modules={CONTENT_MODULES.flatMap(group =>
              group.modules.map(mod => ({
                ...mod,
                category: group.category,
                created_at: mod.created,
                updated_at: mod.updated,
                reads: contentReadCounts.get(mod.slug) ?? 0,
                saves: contentSaveCounts.get(mod.slug) ?? 0,
              }))
            )}
          />
        )}

      </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: "oklch(65% 0.15 45)", color: "white", fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", marginLeft: "0.75rem" }}>
      {children}
    </span>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div style={{ textAlign: "right" }}>
      <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.75rem", color: accent && value > 0 ? "oklch(65% 0.15 45)" : "oklch(97% 0.005 80)", lineHeight: 1 }}>{value}</p>
      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(62% 0.15 260)" }}>{label}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "oklch(62% 0.006 260)" }}>{label}: </span>
      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(32% 0.008 260)" }}>{value}</span>
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const sectionHeading: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "0.72rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "oklch(52% 0.008 260)",
  marginBottom: "1rem",
  display: "flex",
  alignItems: "center",
};

const emptyText: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.875rem",
  color: "oklch(62% 0.008 260)",
};

const nameStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "1rem",
  color: "oklch(22% 0.005 260)",
};

const metaStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.8125rem",
  color: "oklch(55% 0.008 260)",
  marginTop: "0.125rem",
};

const fieldLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "oklch(52% 0.008 260)",
  marginBottom: "0.375rem",
};

const newBadge: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.65rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "oklch(65% 0.15 45)",
  background: "oklch(65% 0.15 45 / 0.1)",
  padding: "0.25rem 0.625rem",
};

const approveBtn: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "0.75rem",
  letterSpacing: "0.06em",
  color: "white",
  background: "oklch(45% 0.14 145)",
  border: "none",
  padding: "0.625rem 1rem",
  cursor: "pointer",
};

const declineBtn: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-montserrat)",
  fontWeight: 600,
  fontSize: "0.75rem",
  letterSpacing: "0.06em",
  color: "oklch(45% 0.008 260)",
  background: "oklch(92% 0.004 80)",
  border: "1px solid oklch(82% 0.008 80)",
  padding: "0.625rem 1rem",
  cursor: "pointer",
};
