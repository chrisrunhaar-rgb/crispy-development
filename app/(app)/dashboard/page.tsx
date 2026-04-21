import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { signOut } from "@/app/auth/actions";
import PwaInstall from "@/components/PwaInstall";
import ContactCoach from "@/components/ContactCoach";
import AddTeamContentForm from "@/components/AddTeamContentForm";
import PushNotificationToggle from "@/components/PushNotificationToggle";
import SendNotificationForm from "@/components/SendNotificationForm";
import InviteButton from "@/components/InviteButton";
import TeamLanguageSelector from "@/components/TeamLanguageSelector";
import { RESOURCES } from "@/lib/resources-data";
import ResourceCard from "@/components/ResourceCard";
import TeamJourney from "@/components/TeamJourney";
import TeamCommsSection from "@/components/TeamCommsSection";
import TeamRoster, { type RosterMember } from "@/components/TeamRoster";
import PeerGroupsSection, { type InitiatedGroup, type JoinedGroup, type PeerMember, type PeerBroadcast } from "@/components/PeerGroupsSection";
import TimezoneDetector from "@/components/TimezoneDetector";
import TeamAssessmentSelector from "./TeamAssessmentSelector";

export const metadata = {
  title: "Dashboard — Crispy Development",
};

type Module = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: string;
  pathway: string;
  is_free: boolean;
  order_index: number;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; joined?: string; join?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { tab, joined, join } = await searchParams;
  const firstName = user.user_metadata?.first_name ?? user.email?.split("@")[0] ?? "there";
  const pathway = (user.user_metadata?.pathway as string) ?? "personal";
  const savedResources = (user.user_metadata?.saved_resources ?? []) as string[];
  const resourceNotes = (user.user_metadata?.resource_notes ?? {}) as Record<string, string>;
  const resourceRatings = (user.user_metadata?.resource_ratings ?? {}) as Record<string, number>;
  const resourceRead = (user.user_metadata?.resource_read ?? []) as string[];
  const completedAssessments = new Set<string>([
    ...(user.user_metadata?.mindset_completed_at ? ["fixed-growth-mindset"] : []),
    ...(user.user_metadata?.rlgl_completed_at ? ["red-light-green-light"] : []),
    ...(user.user_metadata?.smart_goal_saved_at ? ["smart-goals"] : []),
    ...(user.user_metadata?.thinking_style_completed_at ? ["three-thinking-styles"] : []),
    ...(user.user_metadata?.wheel_of_life_saved_at ? ["wheel-of-life"] : []),
    ...(user.user_metadata?.disc_completed_at ? ["disc"] : []),
    ...(user.user_metadata?.karunia_completed_at ? ["karunia-rohani"] : []),
  ]);
  const thinkingStyleResult = (user.user_metadata?.thinking_style_result ?? null) as string | null;
  const thinkingStyleScores = (user.user_metadata?.thinking_style_scores ?? null) as { C: number; H: number; I: number } | null;
  const discResult = (user.user_metadata?.disc_result ?? null) as string | null;
  const discScores = (user.user_metadata?.disc_scores ?? null) as { D: number; I: number; S: number; C: number } | null;
  const karuniaTopGifts = (user.user_metadata?.karunia_top_gifts ?? null) as string[] | null;
  const karuniaScores = (user.user_metadata?.karunia_scores ?? null) as Record<string, number> | null;
  const wheelOfLifeScores = (user.user_metadata?.wheel_of_life_scores ?? null) as Record<string, number> | null;
  const peerGroupId = user.user_metadata?.peer_group_id as string | undefined;
  const userTimezone = user.user_metadata?.timezone as string | undefined;

  const admin = createAdminClient();

  // ── Team pathway checks ──
  let teamApplicationStatus: string | null = null;
  let teamRecord: { id: string; name: string; language: string; current_step: number; finalized_steps: number[]; selected_assessments: string[] } | null = null;
  const isLeaderByMeta = user.user_metadata?.is_leader === true;

  if (pathway === "team" || isLeaderByMeta) {
    // If metadata already marks this user as a leader, skip the application table
    // and go directly to the teams table — more reliable than a two-hop RLS chain.
    if (isLeaderByMeta) {
      teamApplicationStatus = "approved";
      const { data: team } = await admin
        .from("teams")
        .select("id, name, language, current_step, finalized_steps, selected_assessments")
        .eq("leader_user_id", user.id)
        .maybeSingle();
      teamRecord = team ?? null;
    } else {
      const { data: application } = await supabase
        .from("team_applications")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();
      teamApplicationStatus = application?.status ?? null;

      if (teamApplicationStatus === "approved") {
        const { data: team } = await supabase
          .from("teams")
          .select("id, name, language, current_step, finalized_steps, selected_assessments")
          .eq("leader_user_id", user.id)
          .maybeSingle();
        teamRecord = team ?? null;
      }
    }
  }

  // ── Check if user was invited to a team (any pathway) ──
  // Users invited via link keep their original pathway metadata but are in team_members
  let memberOfTeam: { id: string; name: string; selected_assessments: string[] } | null = null;
  if (!isLeaderByMeta) {
    const { data: memberRow } = await admin
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (memberRow) {
      const { data: mt } = await admin
        .from("teams")
        .select("id, name, selected_assessments")
        .eq("id", memberRow.team_id)
        .maybeSingle();
      memberOfTeam = mt ? { ...mt, selected_assessments: mt.selected_assessments ?? [] } : null;
    }
  }

  const isTeamLeader = (pathway === "team" || isLeaderByMeta) && teamApplicationStatus === "approved";
  const hasTeam = isTeamLeader || !!memberOfTeam;

  // ── Peer group data (new system) ──
  let initiatedGroups: InitiatedGroup[] = [];
  let joinedGroups: JoinedGroup[] = [];
  let joinGroup: { id: string; name: string; current_topic: string | null } | null = null;

  // Fetch initiated groups
  const { data: initiatedRows } = await admin
    .from("peer_groups")
    .select("id, name, region, timezone, is_open, current_topic, language")
    .eq("initiator_user_id", user.id)
    .order("created_at", { ascending: true });

  if (initiatedRows && initiatedRows.length > 0) {
    type PeerGroupRow = { id: string; name: string; region: string; timezone: string; is_open: boolean; current_topic: string | null; language: string };
    type PeerMemberRow = { group_id: string; user_id: string; status: string; questionnaire_answers: { location: string; experience: string; contribution: string } | null };
    type PeerBroadcastRow = { id: string; group_id: string; message: string; sent_at: string };

    const initiatedGroupIds = initiatedRows.map((g: PeerGroupRow) => g.id);
    const [{ data: allPeerMembers }, { data: allPeerBroadcasts }] = await Promise.all([
      admin.from("peer_group_members").select("group_id, user_id, status, questionnaire_answers").in("group_id", initiatedGroupIds),
      admin.from("peer_broadcasts").select("id, group_id, message, sent_at").in("group_id", initiatedGroupIds).order("sent_at", { ascending: false }),
    ]);

    const peerMemberIds = [...new Set((allPeerMembers ?? []).map((m: PeerMemberRow) => m.user_id))];
    const peerProfileMap = new Map<string, { id: string; email: string | null; first_name: string | null; last_name: string | null }>();
    if (peerMemberIds.length > 0) {
      const { data: peerProfiles } = await admin.from("profiles").select("id, email, first_name, last_name").in("id", peerMemberIds);
      (peerProfiles ?? []).forEach((p: { id: string; email: string | null; first_name: string | null; last_name: string | null }) => peerProfileMap.set(p.id, p));
    }

    const peerProgressMap = new Map<string, number>();
    {
      const allPeerProgressIds = [...peerMemberIds, user.id];
      const { data: peerProgressRows } = await admin
        .from("user_progress")
        .select("user_id")
        .in("user_id", allPeerProgressIds)
        .eq("status", "completed");
      (peerProgressRows ?? []).forEach((p: { user_id: string }) => {
        peerProgressMap.set(p.user_id, (peerProgressMap.get(p.user_id) ?? 0) + 1);
      });
    }

    const initiatorFullName = `${user.user_metadata?.first_name ?? ""} ${user.user_metadata?.last_name ?? ""}`.trim() || firstName;

    initiatedGroups = (initiatedRows as PeerGroupRow[]).map(g => ({
      ...g,
      members: [
        {
          id: user.id,
          name: initiatorFullName,
          email: user.email ?? "",
          status: "active" as const,
          questionnaireAnswers: null,
          completedModules: peerProgressMap.get(user.id) ?? 0,
          isInitiator: true,
        } satisfies PeerMember,
        ...((allPeerMembers ?? []) as PeerMemberRow[])
          .filter(m => m.group_id === g.id)
          .map(m => {
            const p = peerProfileMap.get(m.user_id);
            return {
              id: m.user_id,
              name: p ? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || (p.email ?? "Member") : "Member",
              email: p?.email ?? "",
              status: (m.status === "pending" ? "pending" : "active") as "pending" | "active",
              questionnaireAnswers: m.questionnaire_answers,
              completedModules: peerProgressMap.get(m.user_id) ?? 0,
            } satisfies PeerMember;
          }),
      ],
      broadcasts: ((allPeerBroadcasts ?? []) as PeerBroadcastRow[])
        .filter(b => b.group_id === g.id)
        .map(b => ({ id: b.id, message: b.message, sent_at: b.sent_at }) satisfies PeerBroadcast),
    }));
  }

  // Fetch joined groups (active member, not initiator)
  const { data: joinedMemberRows } = await admin
    .from("peer_group_members")
    .select("group_id, status")
    .eq("user_id", user.id)
    .eq("status", "active");
  const initiatedGroupIdSet = new Set((initiatedRows ?? []).map((g: { id: string }) => g.id));
  const joinedGroupIds = (joinedMemberRows ?? [])
    .map((m: { group_id: string }) => m.group_id)
    .filter((id: string) => !initiatedGroupIdSet.has(id));

  if (joinedGroupIds.length > 0) {
    type PeerGroupRow2 = { id: string; name: string; region: string; timezone: string; is_open: boolean; current_topic: string | null; language: string };
    type PeerMemberRow2 = { group_id: string; user_id: string; status: string };

    const [{ data: joinedGroupRows }, { data: joinedMembersAll }] = await Promise.all([
      admin.from("peer_groups").select("id, name, region, timezone, is_open, current_topic, language").in("id", joinedGroupIds),
      admin.from("peer_group_members").select("group_id, user_id, status").in("group_id", joinedGroupIds).eq("status", "active"),
    ]);

    const joinedMemberProfileIds = [...new Set((joinedMembersAll ?? []).map((m: PeerMemberRow2) => m.user_id))];
    const joinedProfileMap = new Map<string, { id: string; email: string | null; first_name: string | null; last_name: string | null }>();
    if (joinedMemberProfileIds.length > 0) {
      const { data: joinedProfiles } = await admin.from("profiles").select("id, email, first_name, last_name").in("id", joinedMemberProfileIds);
      (joinedProfiles ?? []).forEach((p: { id: string; email: string | null; first_name: string | null; last_name: string | null }) => joinedProfileMap.set(p.id, p));
    }

    const joinedProgressMap = new Map<string, number>();
    if (joinedMemberProfileIds.length > 0) {
      const { data: joinedProgressRows } = await admin
        .from("user_progress")
        .select("user_id")
        .in("user_id", joinedMemberProfileIds)
        .eq("status", "completed");
      (joinedProgressRows ?? []).forEach((p: { user_id: string }) => {
        joinedProgressMap.set(p.user_id, (joinedProgressMap.get(p.user_id) ?? 0) + 1);
      });
    }

    const initiatorIds = new Set<string>();
    // For each joined group, find who initiated it (initiator_user_id)
    const { data: joinedGroupInitiators } = await admin
      .from("peer_groups")
      .select("id, initiator_user_id")
      .in("id", joinedGroupIds);
    const groupInitiatorMap = new Map<string, string>();
    (joinedGroupInitiators ?? []).forEach((g: { id: string; initiator_user_id: string }) => {
      groupInitiatorMap.set(g.id, g.initiator_user_id);
      initiatorIds.add(g.initiator_user_id);
    });

    joinedGroups = ((joinedGroupRows ?? []) as PeerGroupRow2[]).map(g => ({
      ...g,
      members: ((joinedMembersAll ?? []) as PeerMemberRow2[])
        .filter(m => m.group_id === g.id)
        .map(m => {
          const p = joinedProfileMap.get(m.user_id);
          return {
            id: m.user_id,
            name: p ? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || (p.email ?? "Member") : "Member",
            email: p?.email ?? "",
            status: "active" as const,
            questionnaireAnswers: null,
            completedModules: joinedProgressMap.get(m.user_id) ?? 0,
            isInitiator: groupInitiatorMap.get(g.id) === m.user_id,
          } satisfies PeerMember;
        }),
    }));
  }

  // If join param is present in URL, fetch that group's info
  if (join) {
    const { data: joinGroupRow } = await admin
      .from("peer_groups")
      .select("id, name, current_topic, is_open")
      .eq("id", join)
      .maybeSingle();
    if (joinGroupRow?.is_open) {
      joinGroup = { id: joinGroupRow.id, name: joinGroupRow.name, current_topic: joinGroupRow.current_topic };
    }
  }

  const hasInitiatedGroups = initiatedGroups.length > 0;
  const hasJoinedGroups = joinedGroups.length > 0;
  const hasPeer = (pathway === "peer" && !!peerGroupId) || hasInitiatedGroups || hasJoinedGroups || !!joinGroup;

  // Determine active tab — personal is always the safe default
  const currentTab =
    tab === "team" && hasTeam ? "team"
    : (tab === "peer" || !!joinGroup) && hasPeer ? "peer"
    : "personal";

  // ── Modules + progress (personal & peer) ──
  let modules: Module[] = [];
  let completedIds = new Set<string>();

  const { data: allMods } = await supabase
    .from("modules")
    .select("id, slug, title, description, type, pathway, is_free, order_index")
    .order("order_index", { ascending: true });
  modules = allMods ?? [];

  const { data: progress } = await supabase
    .from("user_progress")
    .select("module_id")
    .eq("user_id", user.id)
    .eq("status", "completed");
  completedIds = new Set((progress ?? []).map((p: { module_id: string }) => p.module_id));

  // ── Team leader data ──
  let teamMembers: { id: string; name: string; email: string; completed: number; title: string | null; tenureLabel: string | null }[] = [];
  let teamContent: Module[] = [];
  if (isTeamLeader && teamRecord) {
    // Fetch members with profile fields
    const { data: memberRows } = await admin
      .from("team_members")
      .select("user_id, title, tenure_label")
      .eq("team_id", teamRecord.id);
    type MemberRow = { user_id: string; title: string | null; tenure_label: string | null };
    const memberMeta = new Map<string, { title: string | null; tenureLabel: string | null }>(
      (memberRows ?? []).map((m: MemberRow) => [m.user_id, { title: m.title, tenureLabel: m.tenure_label }])
    );
    const memberIds = [...memberMeta.keys()];
    if (memberIds.length > 0) {
      const [{ data: memberProfiles }, { data: allProgress }] = await Promise.all([
        admin.from("profiles").select("id, email, first_name, last_name").in("id", memberIds),
        admin.from("user_progress").select("user_id, module_id").in("user_id", memberIds).eq("status", "completed"),
      ]);
      const progressByUser = new Map<string, number>();
      (allProgress ?? []).forEach((p: { user_id: string; module_id: string }) => {
        progressByUser.set(p.user_id, (progressByUser.get(p.user_id) ?? 0) + 1);
      });
      teamMembers = (memberProfiles ?? []).map((u: { id: string; email: string | null; first_name: string | null; last_name: string | null }) => ({
        id: u.id,
        name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || (u.email ?? "Member"),
        email: u.email ?? "",
        completed: progressByUser.get(u.id) ?? 0,
        title: memberMeta.get(u.id)?.title ?? null,
        tenureLabel: memberMeta.get(u.id)?.tenureLabel ?? null,
      }));
    }

    // Fetch team content selection
    const { data: tcRows } = await supabase
      .from("team_content")
      .select("module_id")
      .eq("team_id", teamRecord.id);
    const selectedIds = new Set((tcRows ?? []).map((r: { module_id: string }) => r.module_id));
    teamContent = modules.filter(m => selectedIds.has(m.id));
  }

  // ── Team journey step completions + broadcasts ──
  type StepCompletionRow = { user_id: string; step_number: number; completed_at: string };
  type BroadcastRow = { id: string; message: string; sent_at: string };
  let teamStepCompletions: StepCompletionRow[] = [];
  let teamBroadcasts: BroadcastRow[] = [];
  if (isTeamLeader && teamRecord) {
    const [{ data: scRows }, { data: bcRows }] = await Promise.all([
      admin.from("team_step_data").select("user_id, step_number, completed_at").eq("team_id", teamRecord.id),
      admin.from("team_broadcasts").select("id, message, sent_at").eq("team_id", teamRecord.id).order("sent_at", { ascending: false }).limit(20),
    ]);
    teamStepCompletions = (scRows ?? []) as StepCompletionRow[];
    teamBroadcasts = (bcRows ?? []) as BroadcastRow[];
  }

  // ── Team member content + roster (invited via link) ──
  let memberTeamContent: Module[] = [];
  let memberTeamRoster: RosterMember[] = [];
  let memberTeamLeaderName: string | undefined;
  if (memberOfTeam) {
    const { data: tcRows } = await admin
      .from("team_content")
      .select("module_id")
      .eq("team_id", memberOfTeam.id);
    const selectedIds = new Set((tcRows ?? []).map((r: { module_id: string }) => r.module_id));
    memberTeamContent = modules.filter(m => selectedIds.has(m.id));

    // Fetch roster + team leader in parallel
    const [{ data: rosterRows }, { data: leaderTeam }] = await Promise.all([
      admin.from("team_members").select("user_id, title, tenure_label").eq("team_id", memberOfTeam.id),
      admin.from("teams").select("leader_user_id").eq("id", memberOfTeam.id).maybeSingle(),
    ]);
    type RosterRow = { user_id: string; title: string | null; tenure_label: string | null };
    const rosterMeta = new Map<string, { title: string | null; tenureLabel: string | null }>(
      (rosterRows ?? []).map((r: RosterRow) => [r.user_id, { title: r.title, tenureLabel: r.tenure_label }])
    );
    const rosterIds = [...rosterMeta.keys()];
    const leaderProfileId = leaderTeam?.leader_user_id;

    // Fetch profiles for roster members + leader in one query
    const allProfileIds = [...new Set([...rosterIds, ...(leaderProfileId ? [leaderProfileId] : [])])];
    if (allProfileIds.length > 0) {
      const { data: allProfiles } = await admin
        .from("profiles")
        .select("id, email, first_name, last_name")
        .in("id", allProfileIds);
      const profileMap = new Map((allProfiles ?? []).map((u: { id: string; email: string | null; first_name: string | null; last_name: string | null }) => [u.id, u]));

      memberTeamRoster = rosterIds.map(id => {
        const u = profileMap.get(id);
        return {
          id,
          name: u ? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || (u.email ?? "Member") : "Member",
          email: u?.email ?? "",
          title: rosterMeta.get(id)?.title ?? null,
          tenureLabel: rosterMeta.get(id)?.tenureLabel ?? null,
        };
      });

      if (leaderProfileId) {
        const lp = profileMap.get(leaderProfileId);
        if (lp) memberTeamLeaderName = `${lp.first_name ?? ""} ${lp.last_name ?? ""}`.trim() || undefined;
      }
    }
  }

  // ── All coach messages for this user ──
  let userMessages: { id: string; message: string; subject: string | null; created_at: string; reply: string | null; replied_at: string | null; status: string; message_type: string }[] = [];
  {
    const { data: msgs } = await supabase
      .from("coach_messages")
      .select("id, message, subject, created_at, reply, replied_at, status, message_type")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    userMessages = (msgs ?? []) as CoachMsg[];
  }
  const leaderMessages = userMessages.filter(m => m.message_type !== "peer");
  const peerMessages = userMessages.filter(m => m.message_type === "peer");


  const tabLabel = currentTab === "team" ? "Team Dashboard" : currentTab === "peer" ? "Peer Group" : "Personal Dashboard";

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>
      <TimezoneDetector savedTimezone={userTimezone} />

      {/* ── DASHBOARD HEADER ── */}
      <div style={{ background: "oklch(30% 0.12 260)", paddingTop: "1.75rem", borderBottom: "1px solid oklch(22% 0.10 260)" }}>
        <div className="container-wide">

          {/* Top row: title + utilities */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", paddingBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              {/* CD logo mark */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-icon.png"
                alt="Crispy Development"
                style={{ width: "38px", height: "38px", objectFit: "contain", marginTop: "0.1rem", flexShrink: 0 }}
              />
              <div>
                <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>
                  {tabLabel}
                </p>
                <h1 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.375rem", color: "oklch(97% 0.005 80)", lineHeight: 1.2 }}>
                  Welcome back, {firstName}.
                </h1>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <PushNotificationToggle />
              <PwaInstall />
              <form action={signOut}>
                <button type="submit" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", color: "oklch(62% 0.006 260)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Sign out
                </button>
              </form>
            </div>
          </div>

          {/* 3-Tab switcher */}
          <div style={{ paddingBottom: "1.75rem", display: "flex", justifyContent: "center" }}>
            <div>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "oklch(52% 0.04 260)",
                textAlign: "center",
                marginBottom: "0.5rem",
              }}>
                Dashboards
              </p>
              <div style={{ display: "inline-flex", border: "1px solid oklch(42% 0.06 260 / 0.5)" }}>
                {(["personal", "team", "peer"] as const).map((t) => {
                  const labels = { personal: "Personal", team: "Team", peer: "Peer Group" };
                  const active = currentTab === t;
                  const enabled = t === "personal" || (t === "team" && hasTeam) || (t === "peer" && hasPeer);
                  const href = t === "personal" ? "/dashboard" : `/dashboard?tab=${t}`;
                  const sharedStyle: React.CSSProperties = {
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "0.55rem 1.375rem",
                    background: active ? "oklch(65% 0.15 45)" : "transparent",
                    color: active ? "white" : "oklch(65% 0.15 45)",
                    border: "none",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap" as const,
                    minWidth: "100px",
                    textAlign: "center" as const,
                  };
                  if (!enabled) {
                    return (
                      <span key={t} style={{ ...sharedStyle, color: "oklch(42% 0.04 260)", cursor: "not-allowed" }}>
                        {labels[t]}
                      </span>
                    );
                  }
                  return (
                    <Link key={t} href={href} style={{ ...sharedStyle, textDecoration: "none", display: "inline-block" }}>
                      {labels[t]}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        {joined === "1" && (
          <div style={{ background: "oklch(65% 0.15 45 / 0.1)", border: "1px solid oklch(65% 0.15 45 / 0.25)", padding: "1rem 1.5rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1rem" }}>🎉</span>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(38% 0.008 260)", fontWeight: 600 }}>
              You&apos;ve joined the team! Your leader&apos;s content will appear in your library below.
            </p>
          </div>
        )}

        {currentTab === "personal" && (
          <>
            {pathway === "team" && teamApplicationStatus === "pending" && <TeamApplicationPending firstName={firstName} />}
            {pathway === "team" && !teamApplicationStatus && <TeamApplicationPrompt />}
            <PersonalDashboard modules={modules} completedIds={completedIds} savedResources={savedResources} resourceNotes={resourceNotes} resourceRatings={resourceRatings} resourceRead={resourceRead} completedAssessments={completedAssessments} thinkingStyleResult={thinkingStyleResult} thinkingStyleScores={thinkingStyleScores} discResult={discResult} discScores={discScores} wheelOfLifeScores={wheelOfLifeScores} karuniaTopGifts={karuniaTopGifts} karuniaScores={karuniaScores} />
          </>
        )}

        {currentTab === "team" && isTeamLeader && (
          <TeamLeaderDashboard
            teamRecord={teamRecord}
            teamMembers={teamMembers}
            teamContent={teamContent}
            allModules={modules}
            language={teamRecord?.language ?? "en"}
            messages={leaderMessages}
            stepCompletions={teamStepCompletions}
            broadcasts={teamBroadcasts}
            leaderName={firstName}
            leaderId={user.id}
            finalizedSteps={teamRecord?.finalized_steps ?? []}
            selectedAssessments={teamRecord?.selected_assessments ?? []}
          />
        )}

        {currentTab === "team" && !isTeamLeader && memberOfTeam && (
          <TeamMemberDashboard
            team={memberOfTeam}
            teamContent={memberTeamContent}
            allModules={modules}
            completedIds={completedIds}
            roster={memberTeamRoster}
            leaderName={memberTeamLeaderName}
          />
        )}

        {currentTab === "peer" && (
          <PeerGroupsSection
            initiatedGroups={initiatedGroups}
            joinedGroups={joinedGroups}
            coachMessages={peerMessages}
            initiatorName={firstName}
            joinGroup={joinGroup}
            userTimezone={userTimezone ?? null}
            totalModules={modules.length}
          />
        )}
      </div>
    </div>
  );
}

// ── Personal Dashboard ──────────────────────────────────────────────────────

// Build a lookup from all published resources in resources-data.ts
const RESOURCE_META = Object.fromEntries(
  RESOURCES.filter(r => r.slug).map(r => [
    r.slug as string,
    { title: r.title, description: r.description, path: `/resources/${r.slug}`, time: r.time, format: r.format },
  ])
);

const THINKING_STYLE_LABELS: Record<string, string> = {
  C: "Conceptual", H: "Holistic", I: "Intuitional",
  CH: "Conceptual · Holistic", CI: "Conceptual · Intuitional", HI: "Holistic · Intuitional",
  CHI: "Balanced",
};

const WHEEL_SEGMENTS = [
  { key: "family",     label: "Family",           color: "#3b5fa0" },
  { key: "finance",    label: "Finance",           color: "#c4762a" },
  { key: "relaxation", label: "Relaxation",        color: "#2a8f8f" },
  { key: "ministry",   label: "Ministry",          color: "#b83820" },
  { key: "spiritual",  label: "Spiritual",         color: "#8a6415" },
  { key: "community",  label: "Community",         color: "#2a8a64" },
  { key: "learning",   label: "Learning",          color: "#6a3a9e" },
  { key: "health",     label: "Health",            color: "#2e8a40" },
];

const DISC_RESULT_TEXT: Record<string, string> = {
  D:  "You lead with boldness and results. Your greatest strength is driving action and cutting through indecision. Growth edge: slow down enough to bring people with you — not just past them.",
  I:  "You lead with energy and relationships. Your greatest strength is inspiring others and creating momentum. Growth edge: follow through on commitments and develop your eye for detail.",
  S:  "You lead with patience and loyalty. Your greatest strength is creating environments where people feel safe and valued. Growth edge: practise taking initiative and speaking your concerns earlier.",
  C:  "You lead with precision and expertise. Your greatest strength is bringing rigour and quality to everything. Growth edge: learn to act with less-than-perfect information and share your insights more openly.",
  DI: "You combine boldness with people-energy — driving results while keeping others inspired. A powerful combination in leading diverse teams.",
  DS: "You balance directness with steadiness — goal-focused yet able to create stable, loyal teams. You lead with both force and consistency.",
  DC: "You combine drive with precision — results-oriented and quality-obsessed. Your challenge: don't let perfectionism slow momentum.",
  IS: "You blend enthusiasm with warmth — inspiring people while genuinely caring for them. A gift in relational and cross-cultural contexts.",
  IC: "You combine persuasion with precision — engaging communicator and careful thinker. Balance spontaneity with follow-through.",
  SC: "You bring steadiness and rigour together — reliable, patient, and quality-driven. A trusted anchor for any team.",
};

const DISC_SLICES = [
  { key: "D", label: "Dominance",        fill: "#C44A2A" },
  { key: "I", label: "Influence",         fill: "#C48A1A" },
  { key: "S", label: "Steadiness",        fill: "#2E7A40" },
  { key: "C", label: "Conscientiousness", fill: "#2B5FAC" },
] as const;

function discPolarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function discSlicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const span = endDeg - startDeg;
  if (span >= 359.9) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`;
  }
  const s = discPolarXY(cx, cy, r, startDeg);
  const e = discPolarXY(cx, cy, r, endDeg);
  const large = span > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)} Z`;
}

function DiscPieCard({ result, scores }: { result: string; scores: { D: number; I: number; S: number; C: number } }) {
  const cx = 60, cy = 60, r = 54, gap = 1.5;
  let angle = 0;
  const slices = DISC_SLICES.map(s => {
    const pct = scores[s.key as keyof typeof scores];
    const span = (pct / 100) * 360;
    const start = angle + gap / 2;
    const end = angle + span - gap / 2;
    angle += span;
    return { ...s, pct, start, end };
  });

  const resultText = DISC_RESULT_TEXT[result] ?? null;

  return (
    <div>
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", marginBottom: "1rem" }}>
        {/* Pie chart */}
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
          {slices.map(s => (
            <path key={s.key} d={discSlicePath(cx, cy, r, s.start, s.end)} fill={s.fill} />
          ))}
          {/* Inner ring for donut effect */}
          <circle cx={cx} cy={cy} r={28} fill="white" />
          <text x={cx} y={cy - 5} textAnchor="middle" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 900, fontSize: "14px", fill: "#1a1a2e" }}>
            {result}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontFamily: "var(--font-montserrat)", fontSize: "7px", fill: "#6b6b8a", letterSpacing: "0.04em" }}>
            DISC
          </text>
        </svg>
        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
          {slices.map(s => (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "8px", height: "8px", background: s.fill, flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: "oklch(42% 0.008 260)", flex: 1 }}>{s.label}</span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", fontWeight: 700, color: "oklch(28% 0.008 260)" }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      {resultText && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.65, color: "oklch(42% 0.008 260)", marginBottom: "0.875rem" }}>
          {resultText}
        </p>
      )}
      <Link href="/resources/disc" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
        Retake quiz →
      </Link>
    </div>
  );
}

function PersonalDashboard({ modules, completedIds, savedResources = [], resourceNotes = {}, resourceRatings = {}, resourceRead = [], completedAssessments = new Set(), thinkingStyleResult = null, thinkingStyleScores = null, discResult = null, discScores = null, wheelOfLifeScores = null, karuniaTopGifts = null, karuniaScores = null }: {
  modules: Module[];
  completedIds: Set<string>;
  savedResources?: string[];
  resourceNotes?: Record<string, string>;
  resourceRatings?: Record<string, number>;
  resourceRead?: string[];
  completedAssessments?: Set<string>;
  thinkingStyleResult?: string | null;
  thinkingStyleScores?: { C: number; H: number; I: number } | null;
  discResult?: string | null;
  discScores?: { D: number; I: number; S: number; C: number } | null;
  wheelOfLifeScores?: Record<string, number> | null;
  karuniaTopGifts?: string[] | null;
  karuniaScores?: Record<string, number> | null;
}) {
  const savedItems = savedResources.filter(s => RESOURCE_META[s]);
  const total = savedItems.length;
  // Progress = completed modules from DB (real tracking) or fall back to saved count proxy
  const completed = modules.filter(m => completedIds.has(m.id)).length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "start" }}>

      {/* Left: saved resource list */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.125rem", color: "oklch(22% 0.005 260)" }}>
            My Personal Development Journey
          </h2>
          <Link href="/resources" style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.08em", color: "oklch(30% 0.12 260)", textDecoration: "none",
            border: "1px solid oklch(30% 0.12 260)", padding: "0.35rem 0.875rem",
            whiteSpace: "nowrap",
          }}>
            Browse Library →
          </Link>
        </div>

        {savedItems.length === 0 ? (
          <div style={{ paddingBlock: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)", lineHeight: 1.6 }}>
              No resources saved yet. Browse the library and tap <strong>Save to Dashboard</strong> on any resource.
            </p>
            <Link href="/resources" className="btn-primary" style={{ alignSelf: "flex-start", fontSize: "0.78rem", padding: "0.6rem 1.25rem" }}>
              Go to Library →
            </Link>
          </div>
        ) : (
          <div>
            {savedItems.map(slug => {
              const meta = RESOURCE_META[slug];
              return (
                <ResourceCard
                  key={slug}
                  slug={slug}
                  title={meta.title}
                  format={meta.format}
                  time={meta.time}
                  path={meta.path}
                  initialNote={resourceNotes[slug] ?? ""}
                  initialRating={resourceRatings[slug] ?? 0}
                  initialRead={resourceRead.includes(slug) || completedAssessments.has(slug)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Right: progress + assessments */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="stat-block">
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>My Progress</p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2.5rem", color: "oklch(30% 0.12 260)", lineHeight: 1 }}>
            {total}<span style={{ fontSize: "1.25rem", color: "oklch(72% 0.006 260)", fontWeight: 300 }}> saved</span>
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", marginTop: "0.375rem" }}>
            resources in your library
          </p>
          {total > 0 && (
            <div style={{ height: "4px", background: "oklch(88% 0.008 80)", marginTop: "1rem" }}>
              <div style={{ height: "100%", width: `${progressPct}%`, background: "oklch(65% 0.15 45)", transition: "width 0.5s ease" }} />
            </div>
          )}
        </div>

        {/* Wheel of Life result card */}
        {wheelOfLifeScores ? (
          <div className="stat-block">
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Wheel of Life</p>
            {(() => {
              const avg = (Object.values(wheelOfLifeScores).reduce((a, b) => a + b, 0) / Object.values(wheelOfLifeScores).length).toFixed(1);
              const lowest = WHEEL_SEGMENTS.slice().sort((a, b) => (wheelOfLifeScores[a.key] ?? 5) - (wheelOfLifeScores[b.key] ?? 5))[0];
              // Mini wheel SVG constants
              const WCX = 150, WCY = 150, WMAXR = 85, WLABELR = 107;
              const wSectorPath = (i: number, r: number) => {
                const a1 = (-90 + i * 45 - 22.5) * Math.PI / 180;
                const a2 = (-90 + i * 45 + 22.5) * Math.PI / 180;
                return `M ${WCX} ${WCY} L ${(WCX + r * Math.cos(a1)).toFixed(2)} ${(WCY + r * Math.sin(a1)).toFixed(2)} A ${r} ${r} 0 0 1 ${(WCX + r * Math.cos(a2)).toFixed(2)} ${(WCY + r * Math.sin(a2)).toFixed(2)} Z`;
              };
              const wPoint = (i: number, score: number): [number, number] => {
                const rad = (-90 + i * 45) * Math.PI / 180;
                const r = (score / 10) * WMAXR;
                return [WCX + r * Math.cos(rad), WCY + r * Math.sin(rad)];
              };
              const wLabelAnchor = (angle: number): { anchor: "middle" | "start" | "end"; dy: number } => {
                if (angle > 67.5 && angle < 112.5) return { anchor: "middle", dy: 13 };
                if (angle < -67.5 && angle > -112.5) return { anchor: "middle", dy: -5 };
                if (angle >= -22.5 && angle <= 22.5) return { anchor: "start", dy: 4 };
                if (angle > 22.5 && angle <= 67.5) return { anchor: "start", dy: 4 };
                if (angle > 112.5) return { anchor: "end", dy: 4 };
                if (angle < -22.5 && angle >= -67.5) return { anchor: "start", dy: 4 };
                return { anchor: "end", dy: 4 };
              };
              const orderedScores = WHEEL_SEGMENTS.map(s => wheelOfLifeScores[s.key] ?? 5);
              const polygonPts = orderedScores.map((s, i) => wPoint(i, s).map(v => v.toFixed(2)).join(",")).join(" ");
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.875rem" }}>
                    <div style={{ border: "1px solid oklch(88% 0.008 80)", padding: "0.75rem", background: "white", display: "inline-block" }}>
                    <svg viewBox="0 0 300 300" width="280" height="280" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: "100%", height: "auto", display: "block" }}>
                      <rect width="300" height="300" fill="oklch(97% 0.005 80)" />
                      {/* Sector fills */}
                      {WHEEL_SEGMENTS.map((seg, i) => (
                        <path key={seg.key} d={wSectorPath(i, WMAXR)} fill={seg.color} opacity="0.13" />
                      ))}
                      {/* Grid rings */}
                      {[2, 4, 6, 8, 10].map(ring => (
                        <circle key={ring} cx={WCX} cy={WCY} r={(ring / 10) * WMAXR} fill="none" stroke="#1b3a6b" strokeWidth={ring === 10 ? 1.2 : 0.5} opacity="0.15" />
                      ))}
                      {/* Spoke lines */}
                      {WHEEL_SEGMENTS.map((seg, i) => {
                        const [x, y] = wPoint(i, 10);
                        return <line key={seg.key} x1={WCX} y1={WCY} x2={x} y2={y} stroke="#1b3a6b" strokeWidth="0.5" opacity="0.12" />;
                      })}
                      {/* Score polygon */}
                      <polygon points={polygonPts} fill="rgba(27,58,107,0.18)" stroke="#1b3a6b" strokeWidth="1.5" strokeLinejoin="round" />
                      {/* Score dots */}
                      {WHEEL_SEGMENTS.map((seg, i) => {
                        const score = wheelOfLifeScores[seg.key] ?? 5;
                        const [x, y] = wPoint(i, score);
                        return <circle key={seg.key} cx={x} cy={y} r="3.5" fill={seg.color} stroke="white" strokeWidth="1.2" />;
                      })}
                      {/* Segment labels */}
                      {WHEEL_SEGMENTS.map((seg, i) => {
                        const angle = -90 + i * 45;
                        const rad = angle * Math.PI / 180;
                        const lx = WCX + WLABELR * Math.cos(rad);
                        const ly = WCY + WLABELR * Math.sin(rad);
                        const { anchor, dy } = wLabelAnchor(angle);
                        const score = wheelOfLifeScores[seg.key] ?? 5;
                        return (
                          <g key={seg.key}>
                            <text x={lx} y={ly + dy} textAnchor={anchor} fontSize="7.5" fontWeight="700" fontFamily="Montserrat, sans-serif" fill={seg.color} letterSpacing="0.02em">{seg.label}</text>
                            <text x={lx} y={ly + dy + 10} textAnchor={anchor} fontSize="9" fontWeight="800" fontFamily="Montserrat, sans-serif" fill={seg.color}>{score}</text>
                          </g>
                        );
                      })}
                      {/* Center avg */}
                      <circle cx={WCX} cy={WCY} r="20" fill="white" stroke="#1b3a6b" strokeWidth="0.8" opacity="0.9" />
                      <text x={WCX} y={WCY - 1} textAnchor="middle" fontSize="12" fontWeight="800" fontFamily="Montserrat, sans-serif" fill="#1b3a6b">{avg}</text>
                      <text x={WCX} y={WCY + 10} textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="Montserrat, sans-serif" fill="#1b3a6b" opacity="0.6" letterSpacing="0.05em">AVG</text>
                    </svg>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(52% 0.008 260)", marginBottom: "0.625rem" }}>
                    Focus area: <span style={{ fontWeight: 700, color: lowest.color }}>{lowest.label}</span>
                  </p>
                  <Link href="/resources/wheel-of-life" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
                    Update scores →
                  </Link>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="stat-block" style={{ background: "oklch(97% 0.005 80)" }}>
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.5rem", fontSize: "0.62rem" }}>Wheel of Life</p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(58% 0.008 260)", lineHeight: 1.6, marginBottom: "0.875rem" }}>
              Rate 8 areas of your life and see where to grow.
            </p>
            <Link href="/resources/wheel-of-life" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
              Take the assessment →
            </Link>
          </div>
        )}

        {/* Thinking Style result card */}
        {thinkingStyleResult && thinkingStyleScores ? (
          <div className="stat-block">
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.625rem", fontSize: "0.62rem" }}>My Thinking Style</p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: "oklch(22% 0.005 260)", marginBottom: "1rem", lineHeight: 1.3 }}>
              {THINKING_STYLE_LABELS[thinkingStyleResult] ?? thinkingStyleResult}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
              {[
                { key: "C", label: "Conceptual", color: "oklch(48% 0.18 250)", pct: thinkingStyleScores.C },
                { key: "H", label: "Holistic", color: "oklch(48% 0.18 145)", pct: thinkingStyleScores.H },
                { key: "I", label: "Intuitional", color: "oklch(48% 0.18 300)", pct: thinkingStyleScores.I },
              ].map(bar => (
                <div key={bar.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: "oklch(52% 0.008 260)", fontWeight: 600 }}>{bar.label}</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: "oklch(52% 0.008 260)", fontWeight: 700 }}>{bar.pct}%</span>
                  </div>
                  <div style={{ height: "5px", background: "oklch(88% 0.008 80)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${bar.pct}%`, background: bar.color }} />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/resources/three-thinking-styles" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
              Retake quiz →
            </Link>
          </div>
        ) : (
          <div className="stat-block" style={{ background: "oklch(97% 0.005 80)" }}>
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.5rem", fontSize: "0.62rem" }}>My Thinking Style</p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(58% 0.008 260)", lineHeight: 1.6, marginBottom: "0.875rem" }}>
              Discover whether you lead with structure, relationships, or intuition.
            </p>
            <Link href="/resources/three-thinking-styles" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
              Take the quiz →
            </Link>
          </div>
        )}

        {/* DISC result card */}
        {discResult && discScores ? (
          <div className="stat-block">
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "1rem", fontSize: "0.62rem" }}>My DISC Profile</p>
            <DiscPieCard result={discResult} scores={discScores} />
          </div>
        ) : (
          <div className="stat-block" style={{ background: "oklch(97% 0.005 80)" }}>
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.5rem", fontSize: "0.62rem" }}>My DISC Profile</p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(58% 0.008 260)", lineHeight: 1.6, marginBottom: "0.875rem" }}>
              Discover your behavioural style and how it shapes the way you lead.
            </p>
            <Link href="/resources/disc" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
              Take the quiz →
            </Link>
          </div>
        )}

        {/* Karunia Rohani result card */}
        {karuniaTopGifts && karuniaTopGifts.length > 0 && karuniaScores ? (
          <div className="stat-block">
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.625rem", fontSize: "0.62rem" }}>Karunia Rohani</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "1rem" }}>
              {karuniaTopGifts.slice(0, 3).map((key, idx) => {
                const KARUNIA_LABELS: Record<string, string> = {
                  melayani: "Melayani", murah_hati: "Murah Hati", keramahan: "Keramahan",
                  bahasa_roh: "Bahasa Roh", menyembuhkan: "Menyembuhkan", menguatkan: "Menguatkan",
                  memberi: "Memberi", hikmat: "Hikmat", pengetahuan: "Pengetahuan",
                  iman: "Iman", kerasulan: "Kerasulan", penginjilan: "Penginjilan",
                  bernubuat: "Bernubuat", mengajar: "Mengajar", gembala: "Gembala",
                  memimpin: "Memimpin", administrasi: "Administrasi", mukjizat: "Mukjizat",
                  tafsir_bahasa_roh: "Tafsir Bahasa Roh",
                };
                const score = karuniaScores[key] ?? 0;
                const pct = Math.round((score / 12) * 100);
                return (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: "oklch(52% 0.008 260)", fontWeight: 600 }}>
                        {idx + 1}. {KARUNIA_LABELS[key] ?? key}
                      </span>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.68rem", color: "oklch(48% 0.18 145)", fontWeight: 700 }}>{score}/12</span>
                    </div>
                    <div style={{ height: "5px", background: "oklch(88% 0.008 145)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "oklch(48% 0.18 145)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <Link href="/resources/karunia-rohani" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
              Ulangi tes →
            </Link>
          </div>
        ) : (
          <div className="stat-block" style={{ background: "oklch(97% 0.005 80)" }}>
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.5rem", fontSize: "0.62rem" }}>Karunia Rohani</p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(58% 0.008 260)", lineHeight: 1.6, marginBottom: "0.875rem" }}>
              Temukan karunia rohani yang Allah berikan kepadamu.
            </p>
            <Link href="/resources/karunia-rohani" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>
              Temukan karunia rohanimu →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Team Leader Dashboard ───────────────────────────────────────────────────

type CoachMsg = { id: string; message: string; subject: string | null; created_at: string; reply: string | null; replied_at: string | null; status: string; message_type: string };

function TeamLeaderDashboard({
  teamRecord,
  teamMembers,
  teamContent,
  allModules,
  language,
  messages,
  stepCompletions,
  broadcasts,
  leaderName,
  leaderId,
  finalizedSteps,
  selectedAssessments,
}: {
  teamRecord: { id: string; name: string; language: string; current_step: number; finalized_steps: number[]; selected_assessments: string[] } | null;
  teamMembers: { id: string; name: string; email: string; completed: number; title: string | null; tenureLabel: string | null }[];
  teamContent: Module[];
  allModules: Module[];
  language: string;
  messages: CoachMsg[];
  stepCompletions: { user_id: string; step_number: number; completed_at: string }[];
  broadcasts: { id: string; message: string; sent_at: string }[];
  leaderName: string;
  leaderId: string;
  finalizedSteps: number[];
  selectedAssessments: string[];
}) {
  if (!teamRecord) {
    return (
      <div style={{ maxWidth: "480px" }}>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>Team Pathway</p>
        <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(22% 0.005 260)", marginBottom: "0.875rem" }}>
          Setting up your team...
        </h2>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)", marginBottom: "2rem" }}>
          Your application has been approved. Your team dashboard will be ready shortly.
        </p>
      </div>
    );
  }

  const journeyMembers = teamMembers.map(m => ({ id: m.id, name: m.name, email: m.email }));
  const rosterMembers: RosterMember[] = teamMembers.map(m => ({
    id: m.id,
    name: m.name,
    email: m.email,
    title: m.title,
    tenureLabel: m.tenureLabel,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

      {/* Top bar: language selector */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <TeamLanguageSelector currentLanguage={(language as "en" | "id" | "nl") || "en"} />
      </div>

      {/* THE TEAM roster */}
      <TeamRoster
        teamId={teamRecord.id}
        teamName={teamRecord.name}
        leaderName={leaderName}
        members={rosterMembers}
        isLeader={true}
        language={(language as "en" | "id" | "nl") || "en"}
      />

      {/* Assessment selector */}
      <TeamAssessmentSelector
        teamId={teamRecord.id}
        initialSelected={selectedAssessments}
      />

      {/* Team Journey — the main feature */}
      <TeamJourney
        teamId={teamRecord.id}
        teamName={teamRecord.name}
        leaderName={leaderName}
        leaderUserId={leaderId}
        currentStep={teamRecord.current_step ?? 1}
        teamMembers={journeyMembers}
        stepCompletions={stepCompletions}
        isLeader={true}
        finalizedSteps={finalizedSteps}
        selectedAssessments={selectedAssessments}
      />

      {/* Compact comms section */}
      <TeamCommsSection
        teamId={teamRecord.id}
        coachMessages={messages}
        broadcasts={broadcasts}
      />
    </div>
  );
}

// ── Team Member Dashboard (invited, non-leader) ─────────────────────────────

function TeamMemberDashboard({
  team,
  teamContent,
  allModules,
  completedIds,
  roster = [],
  leaderName,
}: {
  team: { id: string; name: string; selected_assessments: string[] };
  teamContent: Module[];
  allModules: Module[];
  completedIds: Set<string>;
  roster?: RosterMember[];
  leaderName?: string;
}) {
  const items = teamContent.length > 0 ? teamContent : allModules.filter(m => m.is_free);
  const completed = items.filter(m => completedIds.has(m.id)).length;
  const total = items.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Team roster — read-only for members */}
      {roster.length > 0 && (
        <TeamRoster
          teamId={team.id}
          teamName={team.name}
          leaderName={leaderName}
          members={roster}
          isLeader={false}
        />
      )}

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "start" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.125rem", color: "oklch(22% 0.005 260)" }}>
            Your team content
          </h2>
          <span className="pathway-badge team" style={{ fontSize: "0.58rem" }}>{team.name}</span>
        </div>
        {items.length === 0 ? (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(55% 0.008 260)", lineHeight: 1.6 }}>
            Your team leader hasn&apos;t selected content yet. Check back soon.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {items.map((item, i) => {
              const isCompleted = completedIds.has(item.id);
              return (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: "1.5rem",
                  paddingBlock: "1.25rem",
                  borderTop: i === 0 ? "none" : "1px solid oklch(88% 0.008 80)",
                }}>
                  <div style={{
                    width: "36px", height: "36px", flexShrink: 0,
                    background: isCompleted ? "oklch(65% 0.15 45)" : "oklch(88% 0.008 80)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isCompleted ? (
                      <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 700 }}>✓</span>
                    ) : (
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(52% 0.008 260)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9375rem", color: "oklch(22% 0.005 260)", marginBottom: "0.2rem" }}>
                      {item.title}
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(55% 0.008 260)" }}>
                      {item.type}
                    </p>
                  </div>
                  {item.slug ? (
                    <Link href={`/resources/${item.slug}`} style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700,
                      letterSpacing: "0.08em", color: isCompleted ? "oklch(55% 0.008 260)" : "oklch(30% 0.12 260)",
                      textDecoration: "none", whiteSpace: "nowrap",
                    }}>
                      {isCompleted ? "Review" : "Read →"}
                    </Link>
                  ) : (
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(65% 0.15 45)", whiteSpace: "nowrap" }}>
                      Coming soon
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="stat-block">
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Progress</p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2.5rem", color: "oklch(30% 0.12 260)", lineHeight: 1 }}>
            {completed}<span style={{ fontSize: "1.5rem", color: "oklch(72% 0.006 260)", fontWeight: 300 }}>/{total}</span>
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", marginTop: "0.375rem" }}>resources completed</p>
          <div style={{ height: "4px", background: "oklch(88% 0.008 80)", marginTop: "1rem" }}>
            <div style={{ height: "100%", width: `${total > 0 ? Math.round((completed / total) * 100) : 0}%`, background: "oklch(65% 0.15 45)", transition: "width 0.5s ease" }} />
          </div>
        </div>
        <div className="stat-block">
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>Your Team</p>
          <span className="pathway-badge team">{team.name}</span>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", marginTop: "0.75rem", lineHeight: 1.5 }}>
            Content curated by your team leader.
          </p>
        </div>
      </div>
    </div>

    {/* Assessment steps added by team leader */}
    {team.selected_assessments.length > 0 && (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <p className="t-label" style={{ color: "oklch(65% 0.15 45)", fontSize: "0.62rem", margin: 0 }}>Team Assessments</p>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.125rem", color: "oklch(22% 0.005 260)", margin: 0 }}>
            Your team&apos;s assessment pathway
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {TEAM_ASSESSMENTS.filter(a => team.selected_assessments.includes(a.id)).map((a, i) => (
            <div key={a.id} style={{
              display: "flex", alignItems: "center", gap: "1.5rem",
              paddingBlock: "1.25rem",
              borderTop: i === 0 ? "none" : "1px solid oklch(88% 0.008 80)",
            }}>
              <div style={{
                width: "36px", height: "36px", flexShrink: 0,
                background: "oklch(65% 0.15 45 / 0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 700, color: "oklch(65% 0.15 45)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9375rem", color: "oklch(22% 0.005 260)", marginBottom: "0.2rem" }}>
                  {a.label}
                </p>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(55% 0.008 260)" }}>
                  Assessment
                </p>
              </div>
              <Link href={a.href} style={{
                fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.08em", color: "oklch(30% 0.12 260)",
                textDecoration: "none", whiteSpace: "nowrap",
              }}>
                Take test →
              </Link>
            </div>
          ))}
        </div>
      </div>
    )}
    </div>
  );
}

const TEAM_ASSESSMENTS = [
  { id: "disc", label: "DISC Profile", href: "/resources/disc" },
  { id: "karunia-rohani", label: "Karunia Rohani", href: "/resources/karunia-rohani" },
  { id: "three-thinking-styles", label: "Three Thinking Styles", href: "/resources/three-thinking-styles" },
  { id: "wheel-of-life", label: "Wheel of Life", href: "/resources/wheel-of-life" },
  { id: "myers-briggs", label: "Myers-Briggs (MBTI)", href: "#" },
  { id: "16-personalities", label: "16 Personalities", href: "#" },
  { id: "enneagram", label: "Enneagram", href: "#" },
  { id: "big-five", label: "Big Five (OCEAN)", href: "#" },
];

// ── State components ────────────────────────────────────────────────────────

function TeamApplicationPrompt() {
  return (
    <div style={{ background: "oklch(30% 0.12 260 / 0.06)", border: "1px solid oklch(88% 0.008 80)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
      <div>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", fontSize: "0.62rem", marginBottom: "0.25rem" }}>Team Pathway</p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", color: "oklch(22% 0.005 260)" }}>
          Ready to lead your team? Apply for Team Leader access.
        </p>
      </div>
      <Link href="/apply" className="btn-primary" style={{ fontSize: "0.78rem", padding: "0.6rem 1.25rem", whiteSpace: "nowrap" }}>
        Apply →
      </Link>
    </div>
  );
}

function TeamApplicationPending({ firstName }: { firstName: string }) {
  return (
    <div style={{ background: "oklch(65% 0.15 45 / 0.08)", border: "1px solid oklch(65% 0.15 45 / 0.2)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
      <span style={{ fontSize: "1.1rem" }}>🧭</span>
      <div>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", fontSize: "0.62rem", marginBottom: "0.2rem" }}>Team Application Under Review</p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(38% 0.008 260)" }}>
          Thanks {firstName} — Chris reviews every application personally. You&apos;ll hear back by email.
        </p>
      </div>
    </div>
  );
}

// ── Fallback static data (if DB empty) ──────────────────────────────────────

const fallbackModules = [
  { id: "1", slug: "three-thinking-styles", title: "Three Thinking Styles", type: "module", is_free: true, order_index: 1, description: null, pathway: "both" },
  { id: "2", slug: "cultural-intelligence-foundations", title: "Cultural Intelligence Foundations", type: "module", is_free: false, order_index: 2, description: null, pathway: "both" },
  { id: "3", slug: "conflict-across-cultures", title: "Conflict Across Cultures", type: "module", is_free: false, order_index: 3, description: null, pathway: "both" },
  { id: "4", slug: "leading-multicultural-teams", title: "Leading Multicultural Teams", type: "module", is_free: false, order_index: 4, description: null, pathway: "team" },
  { id: "5", slug: "personal-leadership-identity", title: "Personal Leadership Identity", type: "module", is_free: false, order_index: 5, description: null, pathway: "personal" },
];
