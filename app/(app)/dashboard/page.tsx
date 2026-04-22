import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AccountMenu from "@/components/AccountMenu";
import PwaInstall from "@/components/PwaInstall";
import ContactCoach from "@/components/ContactCoach";
import AddTeamContentForm from "@/components/AddTeamContentForm";
import PushNotificationToggle from "@/components/PushNotificationToggle";
import SendNotificationForm from "@/components/SendNotificationForm";
import InviteButton from "@/components/InviteButton";
import TeamLanguageSelector from "@/components/TeamLanguageSelector";
import PersonalLanguageSelector from "@/components/PersonalLanguageSelector";
import { RESOURCES } from "@/lib/resources-data";
import ResourceCard from "@/components/ResourceCard";
import AssessmentTileGrid from "./AssessmentTileGrid";
import TeamJourney from "@/components/TeamJourney";
import TeamCommsSection from "@/components/TeamCommsSection";
import TeamRoster, { type RosterMember } from "@/components/TeamRoster";
import PeerGroupsSection, { type InitiatedGroup, type JoinedGroup, type PeerMember, type PeerBroadcast } from "@/components/PeerGroupsSection";
import TimezoneDetector from "@/components/TimezoneDetector";
import TeamAssessmentSelector from "./TeamAssessmentSelector";
import TeamResultsGrid, { type TeamMemberResult, type TeamResultMember } from "@/components/TeamResultsGrid";
import { type FeedbackEntry } from "@/components/StepFeedback";

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
    ...(user.user_metadata?.enneagram_completed_at ? ["enneagram"] : []),
    ...(user.user_metadata?.big_five_completed_at ? ["big-five"] : []),
    ...(user.user_metadata?.mbti_completed_at ? ["myers-briggs"] : []),
    ...(user.user_metadata?.personalities16_completed_at ? ["16-personalities"] : []),
  ]);
  const thinkingStyleResult = (user.user_metadata?.thinking_style_result ?? null) as string | null;
  const thinkingStyleScores = (user.user_metadata?.thinking_style_scores ?? null) as { C: number; H: number; I: number } | null;
  const discResult = (user.user_metadata?.disc_result ?? null) as string | null;
  const discScores = (user.user_metadata?.disc_scores ?? null) as { D: number; I: number; S: number; C: number } | null;
  const karuniaTopGifts = (user.user_metadata?.karunia_top_gifts ?? null) as string[] | null;
  const karuniaScores = (user.user_metadata?.karunia_scores ?? null) as Record<string, number> | null;
  const wheelOfLifeScores = (user.user_metadata?.wheel_of_life_scores ?? null) as Record<string, number> | null;
  const enneagramType = (user.user_metadata?.enneagram_type ?? null) as number | null;
  const enneagramScores = (user.user_metadata?.enneagram_scores ?? null) as Record<string, number> | null;
  const bigFiveScores = (user.user_metadata?.big_five_scores ?? null) as Record<string, number> | null;
  const mbtiType = (user.user_metadata?.mbti_type ?? null) as string | null;
  const mbtiScores = (user.user_metadata?.mbti_scores ?? null) as Record<string, number> | null;
  const personalities16Type = (user.user_metadata?.personalities16_type ?? null) as string | null;
  const personalities16Scores = (user.user_metadata?.personalities16_scores ?? null) as Record<string, number> | null;
  const peerGroupId = user.user_metadata?.peer_group_id as string | undefined;
  const userTimezone = user.user_metadata?.timezone as string | undefined;
  const commStyle = (user.user_metadata?.comm_style ?? null) as string | null;
  const commStyleScores = (user.user_metadata?.comm_style_scores ?? null) as Record<string, number> | null;
  const trustAvg = (user.user_metadata?.trust_avg ?? null) as number | null;
  const trustScores = (user.user_metadata?.trust_scores ?? null) as Record<string, number> | null;
  const contributionZone = (user.user_metadata?.contribution_zone ?? null) as string | null;
  const contributionScores = (user.user_metadata?.contribution_scores ?? null) as Record<string, number> | null;
  const conflictStyle = (user.user_metadata?.conflict_style ?? null) as string | null;
  const conflictScores = (user.user_metadata?.conflict_scores ?? null) as Record<string, number> | null;
  const languagePreference = ((user.user_metadata?.language_preference ?? "en") as "en" | "id" | "nl");

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
  let memberOfTeam: { id: string; name: string; selected_assessments: string[]; current_step: number; finalized_steps: number[] } | null = null;
  if (!isLeaderByMeta) {
    const { data: memberRow } = await admin
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (memberRow) {
      const { data: mt } = await admin
        .from("teams")
        .select("id, name, selected_assessments, current_step, finalized_steps")
        .eq("id", memberRow.team_id)
        .maybeSingle();
      memberOfTeam = mt ? { ...mt, selected_assessments: mt.selected_assessments ?? [], finalized_steps: mt.finalized_steps ?? [] } : null;
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

  // ── Modules + progress + messages — all independent, fired in parallel ──
  let modules: Module[] = [];
  let completedIds = new Set<string>();
  let userMessages: CoachMsg[] = [];

  const [{ data: allMods }, { data: progress }, { data: msgs }] = await Promise.all([
    supabase
      .from("modules")
      .select("id, slug, title, description, type, pathway, is_free, order_index")
      .order("order_index", { ascending: true }),
    supabase
      .from("user_progress")
      .select("module_id")
      .eq("user_id", user.id)
      .eq("status", "completed"),
    supabase
      .from("coach_messages")
      .select("id, message, subject, created_at, reply, replied_at, status, message_type")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);
  modules = allMods ?? [];
  completedIds = new Set((progress ?? []).map((p: { module_id: string }) => p.module_id));
  userMessages = (msgs ?? []) as CoachMsg[];

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
  type FbRow = { user_id: string; step_number: number; comment: string; rating: number | null; updated_at: string };
  let leaderTeamResults: TeamMemberResult[] = [];
  let teamStepCompletions: StepCompletionRow[] = [];
  let teamBroadcasts: BroadcastRow[] = [];
  let leaderStepFeedback: Record<number, FeedbackEntry[]> = {};
  if (isTeamLeader && teamRecord) {
    const [{ data: scRows }, { data: bcRows }, { data: fbRows }, { data: ltResultRows }] = await Promise.all([
      admin.from("team_step_data").select("user_id, step_number, completed_at").eq("team_id", teamRecord.id),
      admin.from("team_broadcasts").select("id, message, sent_at").eq("team_id", teamRecord.id).order("sent_at", { ascending: false }).limit(20),
      admin.from("team_step_feedback").select("user_id, step_number, comment, rating, updated_at").eq("team_id", teamRecord.id),
      admin.from("team_member_results").select("user_id, result_type, result_key, scores, completed_at").eq("team_id", teamRecord.id),
    ]);
    teamStepCompletions = (scRows ?? []) as StepCompletionRow[];
    teamBroadcasts = (bcRows ?? []) as BroadcastRow[];
    leaderTeamResults = (ltResultRows ?? []) as TeamMemberResult[];

    if (fbRows && fbRows.length > 0) {
      const leaderFullName = `${user.user_metadata?.first_name ?? ""} ${user.user_metadata?.last_name ?? ""}`.trim() || firstName;
      const fbNameMap = new Map<string, string>();
      fbNameMap.set(user.id, leaderFullName);
      teamMembers.forEach(m => fbNameMap.set(m.id, m.name));
      for (const row of fbRows as FbRow[]) {
        if (!leaderStepFeedback[row.step_number]) leaderStepFeedback[row.step_number] = [];
        leaderStepFeedback[row.step_number].push({
          user_id: row.user_id,
          user_name: fbNameMap.get(row.user_id) ?? "Team member",
          comment: row.comment,
          rating: row.rating,
          updated_at: row.updated_at,
          is_current_user: row.user_id === user.id,
        });
      }
    }
  }

  // ── Step completions + results + feedback for team members — all fired in parallel ──
  let memberStepCompletions: StepCompletionRow[] = [];
  let memberTeamLeaderUserId: string | undefined;
  let memberTeamResults: TeamMemberResult[] = [];
  let mfbRowsForMember: FbRow[] | null = null;
  if (memberOfTeam) {
    const [{ data: mscRows }, { data: mResultRows }, { data: mfbRows }] = await Promise.all([
      admin.from("team_step_data").select("user_id, step_number, completed_at").eq("team_id", memberOfTeam.id),
      admin.from("team_member_results").select("user_id, result_type, result_key, scores, completed_at").eq("team_id", memberOfTeam.id),
      admin.from("team_step_feedback").select("user_id, step_number, comment, rating, updated_at").eq("team_id", memberOfTeam.id),
    ]);
    memberStepCompletions = (mscRows ?? []) as StepCompletionRow[];
    memberTeamResults = (mResultRows ?? []) as TeamMemberResult[];
    mfbRowsForMember = (mfbRows ?? []) as FbRow[];
  }

  // leaderTeamResults populated in team journey Promise.all above

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
        memberTeamLeaderUserId = leaderProfileId;
        const lp = profileMap.get(leaderProfileId);
        if (lp) memberTeamLeaderName = `${lp.first_name ?? ""} ${lp.last_name ?? ""}`.trim() || undefined;
      }
    }
  }

  // ── Step feedback for member dashboard — use pre-fetched mfbRowsForMember ──
  let memberStepFeedback: Record<number, FeedbackEntry[]> = {};
  if (memberOfTeam && mfbRowsForMember && mfbRowsForMember.length > 0) {
    const mfbNameMap = new Map<string, string>();
    if (memberTeamLeaderUserId && memberTeamLeaderName) mfbNameMap.set(memberTeamLeaderUserId, memberTeamLeaderName);
    memberTeamRoster.forEach(m => mfbNameMap.set(m.id, m.name));
    const myFullName = `${user.user_metadata?.first_name ?? ""} ${user.user_metadata?.last_name ?? ""}`.trim() || firstName;
    mfbNameMap.set(user.id, myFullName);
    for (const row of mfbRowsForMember) {
      if (!memberStepFeedback[row.step_number]) memberStepFeedback[row.step_number] = [];
      memberStepFeedback[row.step_number].push({
        user_id: row.user_id,
        user_name: mfbNameMap.get(row.user_id) ?? "Team member",
        comment: row.comment,
        rating: row.rating,
        updated_at: row.updated_at,
        is_current_user: row.user_id === user.id,
      });
    }
  }

  const leaderMessages = userMessages.filter(m => m.message_type !== "peer");
  const peerMessages = userMessages.filter(m => m.message_type === "peer");


  const tabLabel = currentTab === "team" ? "Team Dashboard" : currentTab === "peer" ? "Peer Group" : "Personal Dashboard";

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>
      <TimezoneDetector savedTimezone={userTimezone} />

      {/* ── DASHBOARD HEADER ── */}
      <div style={{ background: "oklch(30% 0.12 260)", paddingTop: "1.75rem", borderBottom: "1px solid oklch(22% 0.10 260)", position: "relative" }}>
        {/* Hero watermark logo — left side */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-icon-dark-badge.png"
          alt=""
          aria-hidden="true"
          style={{ position: "absolute", left: "-1rem", top: "50%", transform: "translateY(-50%)", width: "200px", height: "200px", objectFit: "contain", opacity: 0.06, pointerEvents: "none", userSelect: "none" }}
        />
        <div className="container-wide">

          {/* Top row: title + utilities */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", paddingBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
              {/* CD logo mark */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-icon-dark-badge.png"
                alt="Crispy Development"
                style={{ width: "64px", height: "64px", objectFit: "contain", flexShrink: 0 }}
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
            <div style={{ display: "flex", gap: "0.875rem", alignItems: "center", flexWrap: "wrap" }}>
              <PersonalLanguageSelector currentLanguage={languagePreference} compact />
              <PushNotificationToggle />
              <PwaInstall />
              <AccountMenu
                firstName={user.user_metadata?.first_name ?? firstName}
                lastName={user.user_metadata?.last_name}
                email={user.email ?? ""}
              />
            </div>
          </div>

          {/* 3-Tab switcher — pill capsule */}
          <div style={{ paddingBottom: "1.75rem", display: "flex", justifyContent: "center" }}>
            <div style={{
              display: "inline-flex",
              background: "oklch(18% 0.09 260)",
              borderRadius: 100,
              padding: "5px",
              gap: "2px",
              boxShadow: "inset 0 1px 3px oklch(10% 0.05 260 / 0.4)",
            }}>
              {(["personal", "team", "peer"] as const).map((t) => {
                const labels = { personal: "Personal", team: "Team", peer: "Peer Group" };
                const icons = {
                  personal: (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                  team: (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="10.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M1 14c0-2.761 2.015-4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M15 14c0-2.761-2.015-4.5-4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M5.5 9.5C5.5 11.985 6.515 14 8 14s2.5-2.015 2.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                  peer: (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 2v2M8 12v2M2 8h2M12 8h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                };
                const active = currentTab === t;
                const enabled = t === "personal" || (t === "team" && hasTeam) || (t === "peer" && hasPeer);
                const href = t === "personal" ? "/dashboard" : `/dashboard?tab=${t}`;

                const pillStyle: React.CSSProperties = {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "0.5rem 1.125rem",
                  borderRadius: 100,
                  border: "none",
                  whiteSpace: "nowrap" as const,
                  transition: "background 0.15s ease, color 0.15s ease",
                  background: active ? "oklch(65% 0.15 45)" : "transparent",
                  color: active ? "white" : enabled ? "oklch(68% 0.06 260)" : "oklch(40% 0.04 260)",
                  cursor: enabled ? "pointer" : "not-allowed",
                  textDecoration: "none",
                };

                if (!enabled) {
                  return (
                    <span key={t} style={pillStyle}>
                      {icons[t]}
                      {labels[t]}
                    </span>
                  );
                }
                return (
                  <Link key={t} href={href} style={pillStyle}>
                    {icons[t]}
                    {labels[t]}
                  </Link>
                );
              })}
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
            <PersonalDashboard modules={modules} completedIds={completedIds} savedResources={savedResources} resourceNotes={resourceNotes} resourceRatings={resourceRatings} resourceRead={resourceRead} completedAssessments={completedAssessments} thinkingStyleResult={thinkingStyleResult} thinkingStyleScores={thinkingStyleScores} discResult={discResult} discScores={discScores} wheelOfLifeScores={wheelOfLifeScores} karuniaTopGifts={karuniaTopGifts} karuniaScores={karuniaScores} enneagramType={enneagramType} enneagramScores={enneagramScores} bigFiveScores={bigFiveScores} mbtiType={mbtiType} mbtiScores={mbtiScores} personalities16Type={personalities16Type} personalities16Scores={personalities16Scores} commStyle={commStyle} commStyleScores={commStyleScores} trustAvg={trustAvg} trustScores={trustScores} contributionZone={contributionZone} contributionScores={contributionScores} conflictStyle={conflictStyle} conflictScores={conflictScores} languagePreference={languagePreference} />
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
            teamResults={leaderTeamResults}
            stepFeedback={leaderStepFeedback}
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
            leaderUserId={memberTeamLeaderUserId}
            currentUserId={user.id}
            stepCompletions={memberStepCompletions}
            teamResults={memberTeamResults}
            stepFeedback={memberStepFeedback}
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

function PersonalDashboard({ modules, completedIds, savedResources = [], resourceNotes = {}, resourceRatings = {}, resourceRead = [], completedAssessments = new Set(), thinkingStyleResult = null, thinkingStyleScores = null, discResult = null, discScores = null, wheelOfLifeScores = null, karuniaTopGifts = null, karuniaScores = null, enneagramType = null, enneagramScores = null, bigFiveScores = null, mbtiType = null, mbtiScores = null, personalities16Type = null, personalities16Scores = null, commStyle = null, commStyleScores = null, trustAvg = null, trustScores = null, contributionZone = null, contributionScores = null, conflictStyle = null, conflictScores = null, languagePreference = "en" }: {
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
  enneagramType?: number | null;
  enneagramScores?: Record<string, number> | null;
  bigFiveScores?: Record<string, number> | null;
  mbtiType?: string | null;
  mbtiScores?: Record<string, number> | null;
  personalities16Type?: string | null;
  personalities16Scores?: Record<string, number> | null;
  commStyle?: string | null;
  commStyleScores?: Record<string, number> | null;
  trustAvg?: number | null;
  trustScores?: Record<string, number> | null;
  contributionZone?: string | null;
  contributionScores?: Record<string, number> | null;
  conflictStyle?: string | null;
  conflictScores?: Record<string, number> | null;
  languagePreference?: "en" | "id" | "nl";
}) {
  const savedItems = savedResources.filter(s => RESOURCE_META[s]);
  const total = savedItems.length;
  const completed = savedItems.filter(slug => resourceRead.includes(slug) || completedAssessments.has(slug)).length;
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

        {/* Progress stat */}
        <div className="stat-block">
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>My Progress</p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2.5rem", color: "oklch(30% 0.12 260)", lineHeight: 1 }}>
            {completed}<span style={{ fontSize: "1.25rem", color: "oklch(72% 0.006 260)", fontWeight: 300 }}>/{total}</span>
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", marginTop: "0.375rem" }}>
            resources completed
          </p>
          {total > 0 && (
            <div style={{ height: "4px", background: "oklch(88% 0.008 80)", marginTop: "1rem" }}>
              <div style={{ height: "100%", width: `${progressPct}%`, background: "oklch(65% 0.15 45)", transition: "width 0.5s ease" }} />
            </div>
          )}
        </div>

        {/* ── Assessment tile grid (2 × 4) ── */}
        <div>
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", fontSize: "0.62rem", marginBottom: "0.75rem" }}>My Assessments</p>
          <AssessmentTileGrid
            discResult={discResult}
            discScores={discScores}
            wheelOfLifeScores={wheelOfLifeScores}
            thinkingStyleResult={thinkingStyleResult}
            thinkingStyleScores={thinkingStyleScores}
            karuniaTopGifts={karuniaTopGifts}
            karuniaScores={karuniaScores}
            enneagramType={enneagramType}
            enneagramScores={enneagramScores}
            bigFiveScores={bigFiveScores}
            mbtiType={mbtiType}
            mbtiScores={mbtiScores}
            personalities16Type={personalities16Type}
            personalities16Scores={personalities16Scores}
            languagePreference={languagePreference}
          />
        </div>

        {/* Comm Style result card */}
        {commStyle && commStyleScores && (() => {
          const COMM_STYLE_LABELS: Record<string, { name: string; color: string; description: string }> = {
            A: { name: "The Architect", color: "oklch(42% 0.18 250)", description: "Direct, structured, task-focused. You communicate with clarity and precision." },
            D: { name: "The Diplomat", color: "oklch(42% 0.18 145)", description: "Relational, harmony-seeking, indirect. You build bridges and smooth tensions." },
            C: { name: "The Connector", color: "oklch(48% 0.18 45)", description: "Warm, energetic, people-first. You inspire and bring people together." },
            N: { name: "The Analyst", color: "oklch(42% 0.18 300)", description: "Thoughtful, detail-oriented, logical. You communicate through data and precision." },
          };
          const meta = COMM_STYLE_LABELS[commStyle] ?? { name: commStyle, color: "oklch(42% 0.008 260)", description: "" };
          return (
            <div className="stat-block">
              <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.625rem", fontSize: "0.62rem" }}>My Communication Style</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: meta.color, marginBottom: "0.5rem" }}>{meta.name}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(42% 0.008 260)", lineHeight: 1.6, marginBottom: "0.875rem" }}>{meta.description}</p>
              {commStyleScores && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "0.875rem" }}>
                  {Object.entries(commStyleScores).sort(([,a],[,b]) => b - a).map(([key, pct]) => {
                    const labels: Record<string, string> = { A: "Architect", D: "Diplomat", C: "Connector", N: "Analyst" };
                    return (
                      <div key={key}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(52% 0.008 260)", fontWeight: 600 }}>{labels[key] ?? key}</span>
                          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, color: "oklch(38% 0.008 260)" }}>{pct}%</span>
                        </div>
                        <div style={{ height: "4px", background: "oklch(88% 0.008 80)" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: meta.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link href="/team/communication-culture" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>Retake quiz →</Link>
            </div>
          );
        })()}

        {/* Trust Score result card */}
        {trustAvg !== null && (
          <div className="stat-block">
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.625rem", fontSize: "0.62rem" }}>My Trust Score</p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2.5rem", color: "oklch(30% 0.12 260)", lineHeight: 1 }}>
              {trustAvg}<span style={{ fontSize: "1.25rem", color: "oklch(72% 0.006 260)", fontWeight: 300 }}>/5</span>
            </p>
            {(() => {
              const tier = trustAvg >= 4.5 ? { label: "High Trust", color: "oklch(42% 0.14 145)" }
                : trustAvg >= 3.5 ? { label: "Building Trust", color: "oklch(55% 0.14 85)" }
                : trustAvg >= 2.5 ? { label: "Fragile Trust", color: "oklch(55% 0.14 55)" }
                : { label: "Critical — Needs Attention", color: "oklch(50% 0.18 20)" };
              return <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: tier.color, fontWeight: 700, marginTop: "0.375rem", marginBottom: "0.875rem" }}>{tier.label}</p>;
            })()}
            {trustScores && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "0.875rem" }}>
                {Object.entries(trustScores).map(([key, val]) => (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(52% 0.008 260)", fontWeight: 600, textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</span>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, color: "oklch(38% 0.008 260)" }}>{val}/5</span>
                    </div>
                    <div style={{ height: "4px", background: "oklch(88% 0.008 80)" }}>
                      <div style={{ height: "100%", width: `${(val / 5) * 100}%`, background: "oklch(42% 0.14 145)" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/team/trust-psychological-safety" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>Retake assessment →</Link>
          </div>
        )}

        {/* Contribution Zone result card */}
        {contributionZone && contributionScores && (() => {
          const ZONE_META: Record<string, { color: string; description: string }> = {
            Pioneer: { color: "oklch(48% 0.18 45)", description: "You thrive in new territory — initiating, exploring, and building from scratch." },
            Builder: { color: "oklch(42% 0.18 250)", description: "You take ideas and turn them into systems — structuring, scaling, and executing." },
            Sustainer: { color: "oklch(42% 0.14 145)", description: "You keep things running — reliable, relational, and consistent." },
            Connector: { color: "oklch(48% 0.18 300)", description: "You link people, ideas, and resources — bridging gaps and building community." },
          };
          const meta = ZONE_META[contributionZone] ?? { color: "oklch(42% 0.008 260)", description: "" };
          return (
            <div className="stat-block">
              <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.625rem", fontSize: "0.62rem" }}>My Contribution Zone</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: meta.color, marginBottom: "0.5rem" }}>{contributionZone}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(42% 0.008 260)", lineHeight: 1.6, marginBottom: "0.875rem" }}>{meta.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "0.875rem" }}>
                {Object.entries(contributionScores).sort(([,a],[,b]) => b - a).map(([zone, score]) => (
                  <div key={zone}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(52% 0.008 260)", fontWeight: 600 }}>{zone}</span>
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, color: "oklch(38% 0.008 260)" }}>{score}</span>
                    </div>
                    <div style={{ height: "4px", background: "oklch(88% 0.008 80)" }}>
                      <div style={{ height: "100%", width: `${Math.min((score / 30) * 100, 100)}%`, background: meta.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/team/roles-contribution" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>Retake quiz →</Link>
            </div>
          );
        })()}

        {/* Conflict Style result card */}
        {conflictStyle && conflictScores && (() => {
          const CONFLICT_META: Record<string, { name: string; color: string; description: string }> = {
            A: { name: "Avoider", color: "oklch(42% 0.14 260)", description: "You step back from tension and prefer harmony over direct confrontation." },
            C: { name: "Collaborator", color: "oklch(42% 0.14 145)", description: "You work through conflict together — honest, patient, and solution-focused." },
            M: { name: "Mediator", color: "oklch(48% 0.14 45)", description: "You seek middle ground — balancing relationships and outcomes." },
          };
          const meta = CONFLICT_META[conflictStyle] ?? { name: conflictStyle, color: "oklch(42% 0.008 260)", description: "" };
          return (
            <div className="stat-block">
              <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.625rem", fontSize: "0.62rem" }}>My Conflict Style</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1rem", color: meta.color, marginBottom: "0.5rem" }}>{meta.name}</p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "oklch(42% 0.008 260)", lineHeight: 1.6, marginBottom: "0.875rem" }}>{meta.description}</p>
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.875rem" }}>
                {Object.entries(conflictScores).map(([key, score]) => {
                  const labels: Record<string, string> = { A: "Avoider", C: "Collaborator", M: "Mediator" };
                  const isTop = key === conflictStyle;
                  return (
                    <div key={key} style={{ flex: 1, textAlign: "center", padding: "0.5rem", background: isTop ? `${meta.color} / 0.1` : "oklch(95% 0.003 80)", outline: isTop ? `1.5px solid ${meta.color}` : "none" }}>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 700, color: isTop ? meta.color : "oklch(55% 0.008 260)", marginBottom: "0.2rem" }}>{labels[key] ?? key}</p>
                      <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "1rem", fontWeight: 800, color: isTop ? meta.color : "oklch(42% 0.008 260)" }}>{score}</p>
                    </div>
                  );
                })}
              </div>
              <Link href="/team/navigating-conflict" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700, color: "oklch(30% 0.12 260)", textDecoration: "none" }}>Retake quiz →</Link>
            </div>
          );
        })()}

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
  teamResults,
  stepFeedback = {},
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
  teamResults: TeamMemberResult[];
  stepFeedback?: Record<number, FeedbackEntry[]>;
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
        currentUserId={leaderId}
        currentStep={teamRecord.current_step ?? 1}
        teamMembers={journeyMembers}
        stepCompletions={stepCompletions}
        isLeader={true}
        finalizedSteps={finalizedSteps}
        selectedAssessments={selectedAssessments}
        stepFeedback={stepFeedback}
      />

      {/* Team Results Grid */}
      {(() => {
        const gridMembers: TeamResultMember[] = [
          { id: leaderId, name: leaderName },
          ...teamMembers.map(m => ({ id: m.id, name: m.name })),
        ];
        return (
          <TeamResultsGrid
            members={gridMembers}
            results={teamResults}
            selectedAssessments={selectedAssessments}
          />
        );
      })()}

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
  leaderUserId,
  currentUserId,
  stepCompletions = [],
  teamResults = [],
  stepFeedback = {},
}: {
  team: { id: string; name: string; selected_assessments: string[]; current_step: number; finalized_steps: number[] };
  teamContent: Module[];
  allModules: Module[];
  completedIds: Set<string>;
  roster?: RosterMember[];
  leaderName?: string;
  leaderUserId?: string;
  currentUserId?: string;
  stepCompletions?: { user_id: string; step_number: number; completed_at: string }[];
  teamResults?: TeamMemberResult[];
  stepFeedback?: Record<number, FeedbackEntry[]>;
}) {

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

      {/* Journey intro for members */}
      <div style={{ background: "oklch(65% 0.15 45 / 0.08)", borderLeft: "3px solid oklch(65% 0.15 45)", padding: "1.125rem 1.5rem" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(30% 0.10 260)", lineHeight: 1.7, margin: 0 }}>
          {leaderName ? (
            <><strong>{leaderName}</strong> created this journey for your team.</>
          ) : (
            <>Your team leader created this journey for your team.</>
          )}{" "}
          Each member works through each step at the same pace. You will receive a notification when the next step is unlocked. Enjoy the journey!
        </p>
      </div>

      {/* Team Journey — read-only for members, shows Open Content links */}
      <TeamJourney
        teamId={team.id}
        teamName={team.name}
        leaderName={leaderName}
        leaderUserId={leaderUserId}
        currentUserId={currentUserId}
        currentStep={team.current_step ?? 1}
        teamMembers={roster}
        stepCompletions={stepCompletions}
        isLeader={false}
        finalizedSteps={team.finalized_steps ?? []}
        selectedAssessments={team.selected_assessments ?? []}
        stepFeedback={stepFeedback}
      />

      {/* Team Results Grid — all members' quiz results */}
      {teamResults.length > 0 && (
        <TeamResultsGrid
          members={roster.map(m => ({ id: m.id, name: m.name }))}
          results={teamResults}
          selectedAssessments={team.selected_assessments}
        />
      )}

    </div>
  );
}

const TEAM_ASSESSMENTS = [
  { id: "disc", label: "DISC Profile", href: "/resources/disc" },
  { id: "karunia-rohani", label: "Karunia Rohani", href: "/resources/karunia-rohani" },
  { id: "three-thinking-styles", label: "Three Thinking Styles", href: "/resources/three-thinking-styles" },
  { id: "wheel-of-life", label: "Wheel of Life", href: "/resources/wheel-of-life" },
  { id: "myers-briggs", label: "Myers-Briggs (MBTI)", href: "/resources/myers-briggs" },
  { id: "16-personalities", label: "16 Personalities", href: "/resources/16-personalities" },
  { id: "enneagram", label: "Enneagram", href: "/resources/enneagram" },
  { id: "big-five", label: "Big Five (OCEAN)", href: "/resources/big-five" },
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
