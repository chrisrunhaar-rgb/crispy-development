import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { approveApplication, declineApplication, markMessageRead, approvePeerApplication, declinePeerApplication, adminDeletePeerGroup, adminSetPeerGroupOpen, adminSetPeerGroupName, markContactMessageRead } from "./actions";
import AdminReplyForm from "./AdminReplyForm";
import AdminBroadcastForm from "./AdminBroadcastForm";
import AdminLeaderRow from "./AdminLeaderRow";
import AdminSidebar from "@/components/AdminSidebar";
import MembersTab from "./MembersTab";
import ContentTab from "./ContentTab";
import { RESOURCES } from "@/lib/resources-data";
import TeamLeadersTab from "./TeamLeadersTab";
import PeerInitiatorsTab from "./PeerInitiatorsTab";
import MembershipTab from "./MembershipTab";
import CommentsTab from "./CommentsTab";

export const metadata = {
  title: "Community Dashboard - Crispy Development",
};

const ASSESSMENT_KEYS = [
  "disc_completed_at",
  "thinking_style_completed_at",
  "wheel_of_life_saved_at",
  "karunia_completed_at",
  "fivela_completed_at",
  "enneagram_completed_at",
  "big_five_completed_at",
  "personalities16_completed_at",
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
  const activeTab = tab === "leaders" ? "leaders" : tab === "peers" ? "peers" : tab === "content" ? "content" : tab === "messages" ? "messages" : tab === "membership" ? "membership" : tab === "comments" ? "comments" : "members";

  const admin = createAdminClient();

  // â"€â"€ Always fetch all users â"€â"€
  const { data: { users: allAuthUsers } } = await admin.auth.admin.listUsers({ perPage: 200 });
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  type UserRow = { id: string; email?: string; created_at: string; last_sign_in_at: string | null; user_metadata: Record<string, unknown> };
  const allUsers: UserRow[] = (allAuthUsers ?? []).filter(u => u.email && u.email !== "chris.runhaar@gmail.com").map(u => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    user_metadata: u.user_metadata ?? {},
  }));

  const activeInLast30 = allUsers.filter(u =>
    u.last_sign_in_at && new Date(u.last_sign_in_at) >= thirtyDaysAgo
  ).length;

  // â"€â"€ Members tab â"€â"€
  let progressCounts = new Map<string, number>();
  type CoachEntry = { coach_access: boolean; coach_minutes_granted: number; subscription_active: boolean };
  let coachData = new Map<string, CoachEntry>();
  let teamSeatsMap = new Map<string, { filled: number; max: number }>();

  if (activeTab === "members") {
    const [progressResult, membershipResult, teamsResult] = await Promise.all([
      admin.from("user_progress").select("user_id").eq("status", "completed"),
      admin.from("memberships").select("user_id, coach_access, coach_minutes_granted, subscription_active"),
      admin.from("teams").select("leader_user_id, max_seats, team_members(count)"),
    ]);
    (progressResult.data ?? []).forEach((r: { user_id: string }) => {
      progressCounts.set(r.user_id, (progressCounts.get(r.user_id) ?? 0) + 1);
    });
    (membershipResult.data ?? []).forEach((m: { user_id: string; coach_access: boolean; coach_minutes_granted: number; subscription_active: boolean }) => {
      coachData.set(m.user_id, { coach_access: m.coach_access, coach_minutes_granted: m.coach_minutes_granted, subscription_active: m.subscription_active ?? false });
    });
    (teamsResult.data ?? []).forEach((t: { leader_user_id: string; max_seats: number | null; team_members: { count: number }[] }) => {
      const filled = t.team_members?.[0]?.count ?? 0;
      const max = t.max_seats ?? 8;
      teamSeatsMap.set(t.leader_user_id, { filled, max });
    });
  }

  // â"€â"€ Leaders tab â"€â"€
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

  // â"€â"€ Peers tab â"€â"€
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

  // â"€â"€ Messages tab â"€â"€
  type ContactMessage = { id: string; name: string; email: string; message: string; read: boolean; created_at: string };
  let contactMessages: ContactMessage[] = [];
  if (activeTab === "messages") {
    const { data } = await admin.from("contact_messages").select("*").order("created_at", { ascending: false });
    contactMessages = (data ?? []) as ContactMessage[];
  }

  // â"€â"€ Content tab â"€â"€
  const contentSaveCounts = new Map<string, number>();
  const contentReadCounts = new Map<string, number>();
  const moduleStatuses: Record<string, string> = {};
  const moduleCats: Record<string, string> = {};
  const moduleUpdated: Record<string, string> = {};
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
    const adminClient = createAdminClient();
    const { data: statusRows } = await adminClient.from("module_status").select("slug, status, library_category, updated_at");
    for (const row of statusRows ?? []) {
      if (row.status) moduleStatuses[row.slug] = row.status;
      if (row.library_category) moduleCats[row.slug] = row.library_category;
      if (row.updated_at) moduleUpdated[row.slug] = row.updated_at;
    }
  }

  // â"€â"€ Membership tab â"€â"€
  type MembershipApp = { id: string; created_at: string; name: string; email: string; organization: string | null; role: string | null; location_cultures: string | null; faith_share: string | null; leadership_challenge: string | null; referral_source: string | null; status: string; reviewed_at: string | null };
  type MemberInvite = { id: string; token: string; email: string | null; personal_note: string | null; pathway: string; created_at: string; expires_at: string; used_at: string | null };
  let membershipApplications: MembershipApp[] = [];
  let memberInvites: MemberInvite[] = [];

  if (activeTab === "membership") {
    const [apps, inv] = await Promise.all([
      admin.from("membership_applications").select("*").order("created_at", { ascending: false }),
      admin.from("member_invites").select("*").order("created_at", { ascending: false }),
    ]);
    membershipApplications = (apps.data ?? []) as MembershipApp[];
    memberInvites = (inv.data ?? []) as MemberInvite[];
  }

  // Comments tab
  type CommentAdminRow = { id: string; user_id: string; module_slug: string; comment: string; visibility: string; status: string; admin_reply: string | null; display_name: string | null; created_at: string; published_at: string | null };
  let allComments: CommentAdminRow[] = [];
  if (activeTab === "comments") {
    const { data: cRows } = await admin
      .from("module_comments")
      .select("id, user_id, module_slug, comment, visibility, status, admin_reply, display_name, created_at, published_at")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    allComments = (cRows ?? []) as CommentAdminRow[];
  }

  // Stats
  const { count: pendingTeamCount } = await admin.from("team_applications").select("id", { count: "exact", head: true }).eq("status", "pending");
  const { count: pendingPeerCount } = await admin.from("peer_group_applications").select("id", { count: "exact", head: true }).eq("status", "pending");
  const { count: newMessagesCount } = await admin.from("coach_messages").select("id", { count: "exact", head: true }).eq("status", "new");
  const { count: unreadContactCount } = await admin.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false);
  const { count: pendingMembershipCount } = await admin.from("membership_applications").select("id", { count: "exact", head: true }).eq("status", "pending");
  const { count: pendingCommentsCount } = await admin.from("module_comments").select("id", { count: "exact", head: true }).eq("status", "active").eq("visibility", "public_pending");

  const memberCount = allUsers.length;

  const TABS = [
    { key: "members", label: "Members" },
    { key: "membership", label: "Membership", badge: pendingMembershipCount ?? 0 },
    { key: "leaders", label: "Team Leaders", badge: pendingTeamCount ?? 0 },
    { key: "peers", label: "Peer Initiators", badge: pendingPeerCount ?? 0 },
    { key: "content", label: "Content" },
    { key: "messages", label: "Contact", badge: unreadContactCount ?? 0 },
    { key: "comments", label: "Field Comments", badge: pendingCommentsCount ?? 0 },
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

        {/* â"€â"€ MEMBERS TAB â"€â"€ */}
        {activeTab === "members" && (
          <MembersTab
            users={allUsers}
            progressCounts={progressCounts}
            membersList={membersList}
            coachData={coachData}
            teamSeatsMap={teamSeatsMap}
          />
        )}

        {/* â"€â"€ MEMBERSHIP TAB â"€â"€ */}
        {activeTab === "membership" && (
          <MembershipTab
            applications={membershipApplications}
            invites={memberInvites}
            siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispyleaders.com"}
          />
        )}

        {/* â"€â"€ LEADERS TAB â"€â"€ */}
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
          />
        )}

        {/* â"€â"€ PEERS TAB â"€â"€ */}
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
                          <p style={metaStyle}>{msg.user_email as string} Â· {formatDate(msg.created_at as string)}</p>
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
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(45% 0.14 145)", fontWeight: 700 }}>âœ" Replied</span>
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

        {/* â"€â"€ MESSAGES TAB â"€â"€ */}
        {activeTab === "messages" && (
          <section>
            <h2 style={sectionHeading}>Contact Messages ({contactMessages.length})</h2>
            {contactMessages.length === 0 ? (
              <p style={emptyText}>No messages yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {contactMessages.map(msg => (
                  <div key={msg.id} style={{ background: "white", border: `1px solid ${msg.read ? "oklch(90% 0.005 260)" : "oklch(65% 0.15 45)"}`, padding: "1.5rem", position: "relative" }}>
                    {!msg.read && <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", background: "oklch(65% 0.15 45)" }} />}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <div>
                        <p style={nameStyle}>{msg.name}</p>
                        <p style={metaStyle}><a href={`mailto:${msg.email}`} style={{ color: "inherit", textDecoration: "none" }}>{msg.email}</a> Â· {formatDate(msg.created_at)}</p>
                      </div>
                      {!msg.read && <span style={newBadge}>Unread</span>}
                    </div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.6, color: "oklch(32% 0.008 260)", whiteSpace: "pre-wrap" }}>{msg.message}</p>
                    {!msg.read && (
                      <form action={markContactMessageRead} style={{ marginTop: "0.75rem" }}>
                        <input type="hidden" name="id" value={msg.id} />
                        <button type="submit" style={{ background: "none", border: "none", fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(62% 0.008 260)", cursor: "pointer", padding: 0 }}>
                          Mark as read
                        </button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* COMMENTS TAB */}
        {activeTab === "comments" && (
          <CommentsTab comments={allComments} />
        )}

        {/* â"€â"€ CONTENT TAB â"€â"€ */}
        {activeTab === "content" && (
          <ContentTab
            modules={RESOURCES.map(r => ({
              slug: r.slug ?? r.id,
              title: r.title,
              category: r.format,
              created_at: "2026-04-21",
              updated_at: moduleUpdated[r.slug ?? r.id] ?? "2026-04-21",
              languages: r.languages.map(l => l.toUpperCase()),
              reads: contentReadCounts.get(r.slug ?? r.id) ?? 0,
              saves: contentSaveCounts.get(r.slug ?? r.id) ?? 0,
            }))}
            moduleStatuses={moduleStatuses}
            moduleCats={moduleCats}
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
  if (!iso) return "--";
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
