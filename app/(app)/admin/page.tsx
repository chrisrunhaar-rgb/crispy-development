import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { approveApplication, declineApplication, markMessageRead, approvePeerApplication, declinePeerApplication, adminDeletePeerGroup, adminSetPeerGroupOpen, adminSetPeerGroupName } from "./actions";
import AdminReplyForm from "./AdminReplyForm";
import AdminBroadcastForm from "./AdminBroadcastForm";
import AdminLeaderRow from "./AdminLeaderRow";

export const metadata = {
  title: "Community Dashboard — Crispy Development",
};

const ADMIN_USER_ID = "e04e4310-075a-4df5-9113-4fe7f993afe6";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== ADMIN_USER_ID) redirect("/");

  const { tab } = await searchParams;
  const activeTab = tab === "leaders" ? "leaders" : tab === "peers" ? "peers" : "members";

  const admin = createAdminClient();

  // ── Members tab ──
  let allUsers: Array<{ id: string; email?: string; created_at: string; user_metadata: Record<string, string> }> = [];
  let progressCounts = new Map<string, number>();

  if (activeTab === "members") {
    const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 200 });
    allUsers = (users ?? []).filter(u => u.id !== ADMIN_USER_ID).map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      user_metadata: u.user_metadata ?? {},
    }));

    // Fetch module completion counts for all users
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

    // Map teams by leader user_id → {id, name}
    const teamByLeaderUserId = new Map<string, { id: string; name: string }>();
    (t.data ?? []).forEach((row: { leader_user_id: string; name: string; id: string }) => {
      teamNameByLeader.set(row.leader_user_id, row.name);
      teamByLeaderUserId.set(row.leader_user_id, { id: row.id, name: row.name });
    });

    // Fetch all users with progress counts for team members
    const { data: { users: allAuthUsers } } = await admin.auth.admin.listUsers({ perPage: 200 });
    const { data: progressRows } = await admin.from("user_progress").select("user_id").eq("status", "completed");
    const memberProgressCounts = new Map<string, number>();
    (progressRows ?? []).forEach((r: { user_id: string }) => {
      memberProgressCounts.set(r.user_id, (memberProgressCounts.get(r.user_id) ?? 0) + 1);
    });

    // Group team members by team_id, then map to leader
    const membersByTeamId = new Map<string, TeamMemberRow[]>();
    (allAuthUsers ?? []).forEach(u => {
      const tid = u.user_metadata?.team_id;
      if (tid) {
        teamMemberCountByLeader.set(tid, (teamMemberCountByLeader.get(tid) ?? 0) + 1);
        const existing = membersByTeamId.get(tid) ?? [];
        existing.push({
          name: `${u.user_metadata?.first_name ?? ""} ${u.user_metadata?.last_name ?? ""}`.trim() || (u.email ?? ""),
          email: u.email ?? "",
          completed: memberProgressCounts.get(u.id) ?? 0,
        });
        membersByTeamId.set(tid, existing);
      }
    });

    // Map members to leader user_id
    teamByLeaderUserId.forEach((team, leaderUserId) => {
      teamMembersByLeaderId.set(leaderUserId, membersByTeamId.get(team.id) ?? []);
    });

    // Group messages by leader user_id
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

    // Fetch member counts for all groups
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

  // Stats (always show)
  const _memberCountRes = await admin.auth.admin.listUsers({ perPage: 1 });
  const memberCount = (_memberCountRes.data as { total?: number } | undefined)?.total ?? 0;
  const { count: pendingTeamCount } = await admin.from("team_applications").select("id", { count: "exact", head: true }).eq("status", "pending");
  const { count: pendingPeerCount } = await admin.from("peer_group_applications").select("id", { count: "exact", head: true }).eq("status", "pending");
  const { count: newMessagesCount } = await admin.from("coach_messages").select("id", { count: "exact", head: true }).eq("status", "new");

  const TABS = [
    { key: "members", label: "Members" },
    { key: "leaders", label: "Team Leaders", badge: pendingTeamCount ?? 0 },
    { key: "peers", label: "Peer Initiators", badge: pendingPeerCount ?? 0 },
  ];

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 120px)" }}>

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
              <Stat label="Total Members" value={(memberCount ?? 0) - 1} />
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
          <section>
            <h2 style={sectionHeading}>Notify All Members</h2>
            <AdminBroadcastForm />
          </section>
        )}

        {activeTab === "members" && (
          <section>
            <h2 style={sectionHeading}>All Members ({allUsers.length})</h2>
            {allUsers.length === 0 ? (
              <p style={emptyText}>No members yet.</p>
            ) : (
              <div style={{ background: "oklch(88% 0.008 80)", display: "flex", flexDirection: "column", gap: "1px" }}>
                {/* Column headers */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 110px 60px 60px 80px 90px 130px",
                  gap: "1rem",
                  padding: "0.625rem 1.5rem",
                  background: "oklch(94% 0.006 80)",
                }}>
                  {["Member", "Pathway", "Team", "Peer", "Modules", "Timezone", "Joined"].map(h => (
                    <p key={h} style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(52% 0.008 260)", margin: 0 }}>{h}</p>
                  ))}
                </div>

                {/* Member rows */}
                {allUsers.map(u => {
                  const firstName = u.user_metadata?.first_name ?? "";
                  const lastName = u.user_metadata?.last_name ?? "";
                  const fullName = `${firstName} ${lastName}`.trim() || "—";
                  const pathway = u.user_metadata?.pathway ?? "personal";
                  const hasTeam = pathway === "team" || !!u.user_metadata?.team_id;
                  const hasPeer = pathway === "peer" || !!u.user_metadata?.peer_group_id;
                  const modulesCompleted = progressCounts.get(u.id) ?? 0;
                  const timezone = u.user_metadata?.timezone ?? null;

                  return (
                    <div key={u.id} style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 110px 60px 60px 80px 90px 130px",
                      gap: "1rem",
                      padding: "0.875rem 1.5rem",
                      background: "oklch(99% 0.002 80)",
                      alignItems: "center",
                    }}>
                      <div>
                        <p style={nameStyle}>{fullName}</p>
                        <p style={metaStyle}>{u.email}</p>
                      </div>
                      <span style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        padding: "0.2rem 0.5rem",
                        display: "inline-block",
                        background: "oklch(30% 0.12 260 / 0.08)",
                        color: "oklch(30% 0.12 260)",
                      }}>
                        {pathway.toUpperCase()}
                      </span>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", fontWeight: hasTeam ? 700 : 400, color: hasTeam ? "oklch(45% 0.14 145)" : "oklch(72% 0.008 260)", margin: 0 }}>
                        {hasTeam ? "Yes" : "—"}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", fontWeight: hasPeer ? 700 : 400, color: hasPeer ? "oklch(45% 0.14 145)" : "oklch(72% 0.008 260)", margin: 0 }}>
                        {hasPeer ? "Yes" : "—"}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 700, color: modulesCompleted > 0 ? "oklch(30% 0.12 260)" : "oklch(72% 0.008 260)", margin: 0 }}>
                        {modulesCompleted > 0 ? modulesCompleted : "—"}
                      </p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: timezone ? "oklch(38% 0.008 260)" : "oklch(72% 0.008 260)", margin: 0, fontWeight: timezone ? 600 : 400 }}>
                        {timezone ?? "—"}
                      </p>
                      <p style={metaStyle}>{formatDate(u.created_at)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ── LEADERS TAB ── */}
        {activeTab === "leaders" && (
          <>
            {/* Pending applications */}
            <section>
              <h2 style={sectionHeading}>
                Pending Applications
                {pendingTeam.length > 0 && <Badge>{pendingTeam.length}</Badge>}
              </h2>
              {pendingTeam.length === 0 ? (
                <p style={emptyText}>No pending applications.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                  {pendingTeam.map((app) => (
                    <div key={app.id as string} style={{ background: "oklch(99% 0.002 80)", padding: "1.5rem 2rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "start" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                        <div>
                          <p style={nameStyle}>{app.first_name as string} {app.last_name as string}</p>
                          <p style={metaStyle}>{app.user_email as string} · Applied {formatDate(app.created_at as string)}</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                          <Field label="Organisation" value={app.organisation as string} />
                          <Field label="Team size" value={app.team_size as string} />
                          <Field label="Work type" value={app.work_type as string} />
                        </div>
                        <div>
                          <p style={fieldLabelStyle}>Their reason</p>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.6, color: "oklch(32% 0.008 260)" }}>{app.reason as string}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", minWidth: "120px" }}>
                        <form action={approveApplication}>
                          <input type="hidden" name="applicationId" value={app.id as string} />
                          <input type="hidden" name="userId" value={app.user_id as string} />
                          <button type="submit" style={approveBtn}>Approve ✓</button>
                        </form>
                        <form action={declineApplication}>
                          <input type="hidden" name="applicationId" value={app.id as string} />
                          <button type="submit" style={declineBtn}>Decline</button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Active leaders — accordion rows */}
            <section>
              <h2 style={sectionHeading}>Active Team Leaders ({approvedLeaders.length})</h2>
              {approvedLeaders.length === 0 ? (
                <p style={emptyText}>No approved team leaders yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                  {approvedLeaders.map((leader) => (
                    <AdminLeaderRow
                      key={leader.id as string}
                      leader={{
                        id: leader.id as string,
                        user_id: leader.user_id as string,
                        first_name: leader.first_name as string,
                        last_name: leader.last_name as string,
                        user_email: leader.user_email as string,
                        organisation: leader.organisation as string,
                        team_size: leader.team_size as string,
                        work_type: leader.work_type as string,
                        reason: leader.reason as string,
                        reviewed_at: leader.reviewed_at as string,
                      }}
                      teamName={teamNameByLeader.get(leader.user_id as string) ?? null}
                      teamMembers={teamMembersByLeaderId.get(leader.user_id as string) ?? []}
                      messages={messagesByLeaderId.get(leader.user_id as string) ?? []}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ── PEERS TAB ── */}
        {activeTab === "peers" && (
          <>
            <section>
              <h2 style={sectionHeading}>
                Pending Peer Group Applications
                {pendingPeers.length > 0 && <Badge>{pendingPeers.length}</Badge>}
              </h2>
              {pendingPeers.length === 0 ? (
                <p style={emptyText}>No pending peer group applications.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                  {pendingPeers.map((app) => (
                    <div key={app.id as string} style={{ background: "oklch(99% 0.002 80)", padding: "1.5rem 2rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "start" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                        <div>
                          <p style={nameStyle}>{app.first_name as string} {app.last_name as string}</p>
                          <p style={metaStyle}>{app.user_email as string} · Applied {formatDate(app.created_at as string)}</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                          <Field label="Region" value={app.region as string} />
                          <Field label="Timezone" value={app.timezone as string} />
                          <Field label="Pathway" value={app.pathway as string} />
                          {app.group_size_pref ? <Field label="Preferred size" value={String(app.group_size_pref)} /> : null}
                        </div>
                        <div>
                          <p style={fieldLabelStyle}>Why they want to initiate</p>
                          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.6, color: "oklch(32% 0.008 260)" }}>{app.reason as string}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", minWidth: "120px" }}>
                        <form action={approvePeerApplication}>
                          <input type="hidden" name="applicationId" value={app.id as string} />
                          <input type="hidden" name="userId" value={app.user_id as string} />
                          <button type="submit" style={approveBtn}>Approve ✓</button>
                        </form>
                        <form action={declinePeerApplication}>
                          <input type="hidden" name="applicationId" value={app.id as string} />
                          <button type="submit" style={declineBtn}>Decline</button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 style={sectionHeading}>Active Peer Group Initiators ({approvedInitiators.length})</h2>
              {approvedInitiators.length === 0 ? (
                <p style={emptyText}>No approved peer group initiators yet.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", background: "oklch(88% 0.008 80)" }}>
                  {approvedInitiators.map((init) => (
                    <div key={init.id as string} style={{ background: "oklch(99% 0.002 80)", padding: "1.5rem" }}>
                      <p style={nameStyle}>{init.first_name as string} {init.last_name as string}</p>
                      <p style={metaStyle}>{init.user_email as string}</p>
                      <div style={{ marginTop: "0.875rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                        <Field label="Region" value={init.region as string} />
                        <Field label="Timezone" value={init.timezone as string} />
                        <Field label="Pathway" value={init.pathway as string} />
                      </div>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.008 260)", marginTop: "0.75rem" }}>
                        Approved {formatDate(init.reviewed_at as string)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

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
