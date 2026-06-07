import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { trackDashboardAccess, trackAdminAction } from "@/lib/ga-events";
import AccountMenu from "@/components/AccountMenu";
import ContactCoach from "@/components/ContactCoach";
import AddTeamContentForm from "@/components/AddTeamContentForm";
import SendNotificationForm from "@/components/SendNotificationForm";
import InviteButton from "@/components/InviteButton";
import { RESOURCES } from "@/lib/resources-data";
import ResourceCard from "@/components/ResourceCard";
import AssessmentTileGrid from "./AssessmentTileGrid";
import TeamPreviewDashboard from "./TeamPreviewDashboard";
import ChallengeTile from "@/components/ChallengeTile";
import TeamJourney, { BASE_JOURNEY_STEPS, buildJourneySteps, getTypeLabel, TYPE_BADGE } from "@/components/TeamJourney";
import TeamCommsSection from "@/components/TeamCommsSection";
import TeamRoster, { type RosterMember } from "@/components/TeamRoster";
import TimezoneDetector from "@/components/TimezoneDetector";
import TeamAssessmentSelector from "./TeamAssessmentSelector";
import { type TeamMemberResult } from "@/components/TeamResultsGrid";
import { type FeedbackEntry } from "@/components/StepFeedback";
import DashboardTour from "./DashboardTour";
import GaEventTracker from "@/components/GaEventTracker";
import { TEAM_UI, type TeamLang } from "@/lib/team-i18n";
import AdminReplyNotification from "@/components/AdminReplyNotification";

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
  searchParams: Promise<{ tab?: string; joined?: string; member?: string; leader?: string; initiator?: string; tour?: string; ga?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { tab, joined, member, leader, initiator, tour, ga } = await searchParams;

  // Admin mode: check if current user is admin and a target user param exists
  const isAdmin = user.email === "chris.runhaar@world-outreach.com";
  const targetUserId = member ?? leader ?? initiator;
  let viewingAsAdmin = false;
  let viewedUserName = "";
  let metadata = user.user_metadata ?? {};
  let viewingUserId = user.id;

  if (isAdmin && targetUserId) {
    // Fetch target user's metadata
    const admin = createAdminClient();
    const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const targetUser = users?.find((u) => u.id === targetUserId);

    if (targetUser) {
      viewingAsAdmin = true;
      viewingUserId = targetUserId;
      metadata = targetUser.user_metadata ?? {};
      viewedUserName = `${metadata.first_name ?? ""} ${metadata.last_name ?? ""}`.trim() || (targetUser.email ?? "User");
    }
  }

  // Extract metadata from session user OR target user (if admin)
  const firstName = metadata.first_name ?? (viewingAsAdmin ? viewedUserName : user.email?.split("@")[0]) ?? "there";
  const pathway = (metadata.pathway as string) ?? "personal";
  const savedResources = (metadata.saved_resources ?? []) as string[];
  const resourceNotes = (metadata.resource_notes ?? {}) as Record<string, string>;
  const resourceRatings = (metadata.resource_ratings ?? {}) as Record<string, number>;
  const resourceRead = (metadata.resource_read ?? []) as string[];
  const completedAssessments = new Set<string>([
    ...(metadata.mindset_completed_at ? ["fixed-growth-mindset"] : []),
    ...(metadata.rlgl_completed_at ? ["red-light-green-light"] : []),
    ...(metadata.smart_goal_saved_at ? ["smart-goals"] : []),
    ...(metadata.thinking_style_completed_at ? ["three-thinking-styles"] : []),
    ...(metadata.wheel_of_life_saved_at ? ["wheel-of-life"] : []),
    ...(metadata.disc_completed_at ? ["disc"] : []),
    ...(metadata.karunia_completed_at ? ["karunia-rohani"] : []),
    ...(metadata.enneagram_completed_at ? ["enneagram"] : []),
    ...(metadata.big_five_completed_at ? ["big-five"] : []),

    ...(metadata.personalities16_completed_at ? ["16-personalities"] : []),
    ...(metadata.fivela_completed_at ? ["5languages"] : []),
  ]);
  const thinkingStyleResult = (metadata.thinking_style_result ?? null) as string | null;
  const thinkingStyleScores = (metadata.thinking_style_scores ?? null) as { C: number; H: number; I: number } | null;
  const discResult = (metadata.disc_result ?? null) as string | null;
  const discScores = (metadata.disc_scores ?? null) as { D: number; I: number; S: number; C: number } | null;
  const karuniaTopGifts = (metadata.karunia_top_gifts ?? null) as string[] | null;
  const karuniaScores = (metadata.karunia_scores ?? null) as Record<string, number> | null;
  const wheelOfLifeScores = (metadata.wheel_of_life_scores ?? null) as Record<string, number> | null;
  const wheelReflections = (metadata.wheel_reflections ?? null) as Record<string, { gratitude: string; action: string }> | null;
  const enneagramType = (metadata.enneagram_type ?? null) as number | null;
  const enneagramScores = (metadata.enneagram_scores ?? null) as Record<string, number> | null;
  const bigFiveScores = (metadata.big_five_scores ?? null) as Record<string, number> | null;

  const personalities16Type = (metadata.personalities16_type ?? null) as string | null;
  const personalities16Scores = (metadata.personalities16_scores ?? null) as Record<string, number> | null;
  const fivelaReceivingResult = (metadata.fivela_receiving_result ?? null) as string | null;
  const fivelaGivingResult = (metadata.fivela_giving_result ?? null) as string | null;
  const fivelaReceivingScores = (metadata.fivela_receiving_scores ?? null) as { A: number; B: number; C: number; D: number; E: number } | null;
  const fivelaGivingScores = (metadata.fivela_giving_scores ?? null) as { A: number; B: number; C: number; D: number; E: number } | null;
  const userTimezone = metadata.timezone as string | undefined;
  const languagePreference = ((metadata.language_preference ?? "en") as "en" | "id");

  const admin = createAdminClient();

  // ── Team pathway checks ──
  let teamApplicationStatus: string | null = null;
  let teamRecord: { id: string; name: string; language: string; current_step: number; finalized_steps: number[]; selected_assessments: string[]; max_seats?: number } | null = null;
  const isLeaderByMeta = metadata?.is_leader === true;

  if (pathway === "team" || isLeaderByMeta) {
    // If metadata already marks this user as a leader, skip the application table
    // and go directly to the teams table — more reliable than a two-hop RLS chain.
    if (isLeaderByMeta) {
      teamApplicationStatus = "approved";
      const { data: team } = await admin
        .from("teams")
        .select("id, name, language, current_step, finalized_steps, selected_assessments, max_seats")
        .eq("leader_user_id", viewingUserId)
        .maybeSingle();
      teamRecord = team ?? null;
    } else {
      const { data: application } = await supabase
        .from("team_applications")
        .select("status")
        .eq("user_id", viewingUserId)
        .maybeSingle();
      teamApplicationStatus = application?.status ?? null;

      if (teamApplicationStatus === "approved") {
        const { data: team } = await admin
          .from("teams")
          .select("id, name, language, current_step, finalized_steps, selected_assessments, max_seats")
          .eq("leader_user_id", viewingUserId)
          .maybeSingle();
        teamRecord = team ?? null;
      }
    }
  }

  // ── Check if user was invited to a team (any pathway) ──
  // Users invited via link keep their original pathway metadata but are in team_members
  let memberOfTeam: { id: string; name: string; language: string; selected_assessments: string[]; current_step: number; finalized_steps: number[] } | null = null;
  if (!isLeaderByMeta) {
    const { data: memberRow } = await admin
      .from("team_members")
      .select("team_id")
      .eq("user_id", viewingUserId)
      .maybeSingle();
    if (memberRow) {
      const { data: mt } = await admin
        .from("teams")
        .select("id, name, language, selected_assessments, current_step, finalized_steps")
        .eq("id", memberRow.team_id)
        .maybeSingle();
      memberOfTeam = mt ? { ...mt, language: mt.language ?? "en", selected_assessments: mt.selected_assessments ?? [], finalized_steps: mt.finalized_steps ?? [] } : null;
    }
  }

  // ── Coach access check ──
  const { data: membershipRow } = await admin
    .from("memberships")
    .select("coach_access, is_admin")
    .eq("user_id", viewingUserId)
    .maybeSingle();
  const hasCoachAccess = membershipRow?.coach_access === true || membershipRow?.is_admin === true;


  const isTeamLeader = (pathway === "team" || isLeaderByMeta) && teamApplicationStatus === "approved";
  const hasTeam = isTeamLeader || !!memberOfTeam;
  const isSubscriber = !!membershipRow || hasTeam;

  // Determine active tab — team tab always resolves so non-members see TeamPreviewDashboard
  const currentTab = tab === "team" ? "team" : "personal";

  // ── Modules + progress + messages — all independent, fired in parallel ──
  let modules: Module[] = [];
  let completedIds = new Set<string>();
  let userMessages: CoachMsg[] = [];

  const [{ data: allMods }, { data: progress }, { data: msgs }, { data: unseenReplies }, { data: challengeRow }] = await Promise.all([
    supabase
      .from("modules")
      .select("id, slug, title, description, type, pathway, is_free, order_index")
      .order("order_index", { ascending: true }),
    supabase
      .from("user_progress")
      .select("module_id")
      .eq("user_id", viewingUserId)
      .eq("status", "completed"),
    supabase
      .from("coach_messages")
      .select("id, message, subject, created_at, reply, replied_at, status, message_type")
      .eq("user_id", viewingUserId)
      .order("created_at", { ascending: true }),
    viewingAsAdmin ? Promise.resolve({ data: [] }) : supabase
      .from("module_comments")
      .select("id, module_slug, comment, admin_reply")
      .eq("user_id", user.id)
      .eq("status", "active")
      .eq("reply_seen", false)
      .not("admin_reply", "is", null),
    admin.from("challenge_enrollments").select("current_day, status, path").eq("user_id", viewingUserId).maybeSingle(),
  ]);
  modules = allMods ?? [];
  completedIds = new Set((progress ?? []).map((p: { module_id: string }) => p.module_id));
  const challengeCurrentDay = (challengeRow as { current_day: number; status: string; path: string } | null)?.current_day ?? null;
  const challengePath = (challengeRow as { current_day: number; status: string; path: string } | null)?.path ?? null;

  const { data: facilitatorGroups } = await admin
    .from("challenge_groups")
    .select("id, name")
    .eq("facilitator_id", viewingUserId)
    .limit(1);
  const facilitatorGroup = facilitatorGroups?.[0] ?? null;
  userMessages = (msgs ?? []) as CoachMsg[];
  const pendingReplies = (unseenReplies ?? []) as { id: string; module_slug: string; comment: string; admin_reply: string }[];

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

  // ── Sync personal assessment results into team_member_results (backfill for existing metadata) ──
  const activeTeamId = isTeamLeader ? teamRecord?.id : memberOfTeam?.id;
  if (activeTeamId) {
    const currentResults = isTeamLeader ? leaderTeamResults : memberTeamResults;
    const alreadySynced = new Set(currentResults.filter(r => r.user_id === user.id).map(r => r.result_type));

    type SyncEntry = { result_type: string; result_key: string; scores: Record<string, number> };
    const toSync: SyncEntry[] = [];
    if (discResult && discScores && !alreadySynced.has("disc"))
      toSync.push({ result_type: "disc", result_key: discResult, scores: discScores });
    if (enneagramType !== null && enneagramScores && !alreadySynced.has("enneagram"))
      toSync.push({ result_type: "enneagram", result_key: String(enneagramType), scores: enneagramScores });
    if (bigFiveScores && !alreadySynced.has("big_five")) {
      const topTrait = Object.entries(bigFiveScores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "O";
      toSync.push({ result_type: "big_five", result_key: topTrait, scores: bigFiveScores });
    }
    if (personalities16Type && personalities16Scores && !alreadySynced.has("personalities16"))
      toSync.push({ result_type: "personalities16", result_key: personalities16Type, scores: personalities16Scores });
    if (fivelaReceivingResult && fivelaReceivingScores && !alreadySynced.has("5languages"))
      toSync.push({ result_type: "5languages", result_key: fivelaReceivingResult, scores: fivelaReceivingScores });
    if (thinkingStyleResult && thinkingStyleScores && !alreadySynced.has("thinking_style"))
      toSync.push({ result_type: "thinking_style", result_key: thinkingStyleResult, scores: thinkingStyleScores });
    if (karuniaTopGifts && karuniaScores && !alreadySynced.has("karunia"))
      toSync.push({ result_type: "karunia", result_key: karuniaTopGifts[0] ?? "unknown", scores: karuniaScores });
    if (wheelOfLifeScores && !alreadySynced.has("wheel_of_life")) {
      const vals = Object.values(wheelOfLifeScores);
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      toSync.push({ result_type: "wheel_of_life", result_key: String(Math.round(avg * 10) / 10), scores: wheelOfLifeScores });
    }

    if (toSync.length > 0) {
      const now = new Date().toISOString();
      await Promise.all(
        toSync.map(e =>
          admin.from("team_member_results").upsert(
            { team_id: activeTeamId, user_id: user.id, result_type: e.result_type, result_key: e.result_key, scores: e.scores, completed_at: now },
            { onConflict: "team_id,user_id,result_type" }
          )
        )
      );
      const synced: TeamMemberResult[] = toSync.map(e => ({ user_id: user.id, result_type: e.result_type, result_key: e.result_key, scores: e.scores, completed_at: now }));
      if (isTeamLeader) leaderTeamResults = [...leaderTeamResults, ...synced];
      else memberTeamResults = [...memberTeamResults, ...synced];
    }
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

  const tabLabel = currentTab === "team"
    ? (languagePreference === "id" ? "Dasbor Tim" : "Team Dashboard")
    : (languagePreference === "id" ? "Dasbor Pribadi" : "Personal Dashboard");

  // ── Course progress for personal tab ──
  type CourseProgress = { courseId: string; slug: string; title: string; completed: number; total: number; firstIncompleteSlug: string | null };
  let courseProgress: CourseProgress[] = [];
  if (currentTab === "personal" || !currentTab) {
    const { data: courses } = await supabase
      .from("courses")
      .select("id, slug, title")
      .order("order_index");
    if (courses && courses.length > 0) {
      const { data: chapters } = await supabase
        .from("course_chapters")
        .select("id, slug, course_id, order_index")
        .in("course_id", courses.map((c: { id: string }) => c.id))
        .order("order_index");
      const progressClient = viewingAsAdmin ? admin : supabase;
      const { data: prog } = await progressClient
        .from("course_progress")
        .select("chapter_id")
        .eq("user_id", viewingUserId);
      const completedSet = new Set((prog ?? []).map((p: { chapter_id: string }) => p.chapter_id));
      courseProgress = (courses as { id: string; slug: string; title: string }[]).map((course) => {
        const chs = (chapters ?? []).filter((ch: { course_id: string }) => ch.course_id === course.id);
        const completed = chs.filter((ch: { id: string }) => completedSet.has(ch.id)).length;
        const firstIncomplete = chs.find((ch: { id: string }) => !completedSet.has(ch.id)) as { slug: string } | undefined;
        return { courseId: course.id, slug: course.slug, title: course.title, completed, total: chs.length, firstIncompleteSlug: firstIncomplete?.slug ?? null };
      });
      courseProgress = courseProgress.filter(cp => cp.completed > 0);
    }
  }

  return (
    <div style={{ background: "oklch(97% 0.005 80)", minHeight: "calc(100dvh - 80px)" }}>
      <TimezoneDetector savedTimezone={userTimezone} />
      <DashboardTour show={tour === "1"} />
      <GaEventTracker gaEvent={ga} pathway={pathway} />
      {pendingReplies.length > 0 && <AdminReplyNotification replies={pendingReplies} />}

      {/* Admin viewing banner */}
      {viewingAsAdmin && (
        <div style={{ background: "oklch(65% 0.15 45 / 0.1)", borderBottom: "2px solid oklch(65% 0.15 45)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1rem" }}>👁️</span>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(38% 0.008 260)", fontWeight: 600, margin: 0 }}>
            You are viewing <strong>{viewedUserName}</strong>'s dashboard (read-only)
          </p>
        </div>
      )}

      {/* ── DASHBOARD HEADER ── */}
      <div id="tour-header" style={{ background: "oklch(30% 0.12 260)", paddingTop: "1.75rem", borderBottom: "1px solid oklch(22% 0.10 260)", position: "relative" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "nowrap", gap: "1rem", paddingBottom: "1.5rem" }}>
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
                  {languagePreference === "id" ? `Selamat datang kembali, ${firstName}.` : `Welcome back, ${firstName}.`}
                </h1>
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <AccountMenu
                firstName={user.user_metadata?.first_name ?? firstName}
                lastName={user.user_metadata?.last_name}
                email={user.email ?? ""}
                currentLanguage={languagePreference}
              />
            </div>
          </div>

          {/* Tab switcher — pill capsule */}
          <div style={{ paddingBottom: "1.75rem", display: "flex", justifyContent: "center" }}>
            <div id="tour-tabs" style={{
              display: "inline-flex",
              background: "oklch(18% 0.09 260)",
              borderRadius: 100,
              padding: "5px",
              gap: "2px",
              boxShadow: "inset 0 1px 3px oklch(10% 0.05 260 / 0.4)",
            }}>
              {(["personal", "team"] as const).map((t) => {
                const labels = languagePreference === "id"
                  ? { personal: "Pribadi", team: "Tim" }
                  : { personal: "Personal", team: "Team" };
                const icons = {
                  personal: (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                  team: (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3.5 14c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="3.5" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M1 14c0-2.2 1.1-3.5 2.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="12.5" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M15 14c0-2.2-1.1-3.5-2.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                };
                const active = currentTab === t;
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
                  color: active ? "white" : "oklch(68% 0.06 260)",
                  cursor: "pointer",
                  textDecoration: "none",
                };

                return (
                  <Link key={t} href={href} style={pillStyle}>
                    {icons[t]}
                    {labels[t]}
                  </Link>
                );
              })}
              <Link href="/coach" style={{
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
                whiteSpace: "nowrap",
                transition: "background 0.15s ease, color 0.15s ease",
                background: "transparent",
                color: "oklch(68% 0.06 260)",
                cursor: "pointer",
                textDecoration: "none",
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="5" y="1" width="6" height="9" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 8.5C2 11.538 4.686 14 8 14s6-2.462 6-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="8" y1="14" x2="8" y2="15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                AI Coach
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide" style={{ paddingBlock: "3rem" }}>
        {joined === "1" && (
          <div style={{ background: "oklch(65% 0.15 45 / 0.1)", border: "1px solid oklch(65% 0.15 45 / 0.25)", padding: "1rem 1.5rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1rem" }}>🎉</span>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(38% 0.008 260)", fontWeight: 600 }}>
              {languagePreference === "id" ? "Anda telah bergabung dengan tim! Konten pemimpin Anda akan muncul di perpustakaan di bawah." : "You've joined the team! Your leader's content will appear in your library below."}
            </p>
          </div>
        )}

        {currentTab === "personal" && (
          <>
            {pathway === "team" && teamApplicationStatus === "pending" && <TeamApplicationPending firstName={firstName} lang={languagePreference} />}
            {pathway === "team" && !teamApplicationStatus && <TeamApplicationPrompt lang={languagePreference} />}
            <PersonalDashboard modules={modules} completedIds={completedIds} savedResources={savedResources} resourceNotes={resourceNotes} resourceRatings={resourceRatings} resourceRead={resourceRead} completedAssessments={completedAssessments} thinkingStyleResult={thinkingStyleResult} thinkingStyleScores={thinkingStyleScores} discResult={discResult} discScores={discScores} wheelOfLifeScores={wheelOfLifeScores} wheelReflections={wheelReflections} karuniaTopGifts={karuniaTopGifts} karuniaScores={karuniaScores} enneagramType={enneagramType} enneagramScores={enneagramScores} bigFiveScores={bigFiveScores}personalities16Type={personalities16Type} personalities16Scores={personalities16Scores} fivelaReceivingResult={fivelaReceivingResult} fivelaGivingResult={fivelaGivingResult} fivelaReceivingScores={fivelaReceivingScores} fivelaGivingScores={fivelaGivingScores} languagePreference={languagePreference} challengeCurrentDay={challengeCurrentDay} isFacilitator={!!facilitatorGroup} challengePath={challengePath} dashboardFirstName={firstName} isSubscriber={isSubscriber} />
            {courseProgress.length > 0 && <MyCourses courses={courseProgress} lang={languagePreference} />}
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

        {currentTab === "team" && !isTeamLeader && !memberOfTeam && (
          <TeamPreviewDashboard language={languagePreference} />
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

      </div>
    </div>
  );
}

// ── Personal Dashboard ──────────────────────────────────────────────────────

// Build a lookup from all published resources in resources-data.ts
const RESOURCE_META = Object.fromEntries(
  RESOURCES.filter(r => r.slug).map(r => [
    r.slug as string,
    { title: r.title, titleId: r.titleId, description: r.description, path: `/resources/${r.slug}`, time: r.time, format: r.format },
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

function PersonalDashboard({ modules, completedIds, savedResources = [], resourceNotes = {}, resourceRatings = {}, resourceRead = [], completedAssessments = new Set(), thinkingStyleResult = null, thinkingStyleScores = null, discResult = null, discScores = null, wheelOfLifeScores = null, wheelReflections = null, karuniaTopGifts = null, karuniaScores = null, enneagramType = null, enneagramScores = null, bigFiveScores = null, personalities16Type = null, personalities16Scores = null, fivelaReceivingResult = null, fivelaGivingResult = null, fivelaReceivingScores = null, fivelaGivingScores = null, languagePreference = "en", challengeCurrentDay = null, isFacilitator = false, challengePath = null, dashboardFirstName = "", isSubscriber = true }: {
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
  wheelReflections?: Record<string, { gratitude: string; action: string }> | null;
  karuniaTopGifts?: string[] | null;
  karuniaScores?: Record<string, number> | null;
  enneagramType?: number | null;
  enneagramScores?: Record<string, number> | null;
  bigFiveScores?: Record<string, number> | null;

  personalities16Type?: string | null;
  personalities16Scores?: Record<string, number> | null;
  fivelaReceivingResult?: string | null;
  fivelaGivingResult?: string | null;
  fivelaReceivingScores?: { A: number; B: number; C: number; D: number; E: number } | null;
  fivelaGivingScores?: { A: number; B: number; C: number; D: number; E: number } | null;
  languagePreference?: "en" | "id";
  challengeCurrentDay?: number | null;
  isFacilitator?: boolean;
  challengePath?: string | null;
  dashboardFirstName?: string;
  isSubscriber?: boolean;
}) {
  const savedItems = savedResources.filter(s => RESOURCE_META[s]);
  const total = savedItems.length;
  const completed = savedItems.filter(slug => resourceRead.includes(slug) || completedAssessments.has(slug)).length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "start" }}>

      {/* Left: saved resource list */}
      <div id="tour-journey">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.125rem", color: "oklch(22% 0.005 260)" }}>
            {languagePreference === "id" ? "Perjalanan Pengembangan Pribadi Saya" : "My Personal Development Journey"}
          </h2>
          <Link href="/resources" style={{
            fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.08em", color: "oklch(30% 0.12 260)", textDecoration: "none",
            border: "1px solid oklch(30% 0.12 260)", padding: "0.35rem 0.875rem",
            whiteSpace: "nowrap",
          }}>
            {languagePreference === "id" ? "Lihat Perpustakaan →" : "Browse Library →"}
          </Link>
        </div>

        {savedItems.length === 0 ? (
          <div style={{ paddingBlock: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(52% 0.008 260)", lineHeight: 1.6 }}>
              {languagePreference === "id"
                ? <span>Belum ada sumber daya yang disimpan. Lihat perpustakaan dan ketuk <strong>Simpan ke Dasbor</strong> pada sumber daya mana pun.</span>
                : <span>No resources saved yet. Browse the library and tap <strong>Save to Dashboard</strong> on any resource.</span>}
            </p>
            <Link href="/resources" className="btn-primary" style={{ alignSelf: "flex-start", fontSize: "0.78rem", padding: "0.6rem 1.25rem" }}>
              {languagePreference === "id" ? "Ke Perpustakaan →" : "Go to Library →"}
            </Link>
          </div>
        ) : (
          <div>
            {savedItems.map(slug => {
              const meta = RESOURCE_META[slug];
              const displayTitle = languagePreference === "id" && meta.titleId ? meta.titleId
                : meta.title;
              return (
                <ResourceCard
                  key={slug}
                  slug={slug}
                  title={displayTitle}
                  format={meta.format}
                  time={meta.time}
                  path={meta.path}
                  initialNote={resourceNotes[slug] ?? ""}
                  initialRating={resourceRatings[slug] ?? 0}
                  initialRead={resourceRead.includes(slug) || completedAssessments.has(slug)}
                  lang={languagePreference}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Right: progress + assessments */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Progress stat */}
        <div id="tour-progress" className="stat-block">
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", marginBottom: "0.75rem", fontSize: "0.62rem" }}>{languagePreference === "id" ? "Kemajuan Saya" : "My Progress"}</p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "2.5rem", color: "oklch(30% 0.12 260)", lineHeight: 1 }}>
            {completed}<span style={{ fontSize: "1.25rem", color: "oklch(72% 0.006 260)", fontWeight: 300 }}>/{total}</span>
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem", color: "oklch(52% 0.008 260)", marginTop: "0.375rem" }}>
            {languagePreference === "id" ? "sumber daya selesai" : "resources completed"}
          </p>
          {total > 0 && (
            <div style={{ height: "4px", background: "oklch(88% 0.008 80)", marginTop: "1rem" }}>
              <div style={{ height: "100%", width: `${progressPct}%`, background: "oklch(65% 0.15 45)", transition: "width 0.5s ease" }} />
            </div>
          )}
        </div>

        {/* ── Influential Leadership Challenge tile ── */}
        {challengeCurrentDay !== null && (
          <div>
            <p className="t-label" style={{ color: "oklch(52% 0.008 260)", fontSize: "0.62rem", marginBottom: "0.75rem" }}>
              {languagePreference === "id" ? "Tantangan Saya" : "My Challenge"}
            </p>
            <ChallengeTile
              currentDay={challengeCurrentDay}
              userRole={challengePath === "facilitator" ? "facilitator" : challengePath === "member" ? "member" : "solo"}
              firstName={dashboardFirstName}
            />
          </div>
        )}

        {/* ── Assessment tile grid (2 × 4) ── */}
        <div id="tour-assessments">
          <p className="t-label" style={{ color: "oklch(52% 0.008 260)", fontSize: "0.62rem", marginBottom: "0.75rem" }}>{languagePreference === "id" ? "Hasil Asesmen Saya" : "My Assessment Results"}</p>
          <AssessmentTileGrid
            discResult={discResult}
            discScores={discScores}
            wheelOfLifeScores={wheelOfLifeScores}
            wheelReflections={wheelReflections}
            thinkingStyleResult={thinkingStyleResult}
            thinkingStyleScores={thinkingStyleScores}
            karuniaTopGifts={karuniaTopGifts}
            karuniaScores={karuniaScores}
            enneagramType={enneagramType}
            enneagramScores={enneagramScores}
            bigFiveScores={bigFiveScores}

            personalities16Type={personalities16Type}
            personalities16Scores={personalities16Scores}
            fivelaReceivingResult={fivelaReceivingResult}
            fivelaGivingResult={fivelaGivingResult}
            fivelaReceivingScores={fivelaReceivingScores}
            fivelaGivingScores={fivelaGivingScores}
            languagePreference={languagePreference}
            isSubscriber={isSubscriber}
          />
        </div>

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
  const lang = (language as TeamLang) || "en";
  const ui = TEAM_UI[lang];

  if (!teamRecord) {
    return (
      <div style={{ maxWidth: "480px" }}>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>{ui.journeyLabel}</p>
        <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "1.5rem", color: "oklch(22% 0.005 260)", marginBottom: "0.875rem" }}>
          {ui.settingUpTeam}
        </h2>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(48% 0.008 260)", marginBottom: "2rem" }}>
          {ui.applicationApproved}
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* THE TEAM roster */}
      <TeamRoster
        teamId={teamRecord.id}
        teamName={teamRecord.name}
        leaderName={leaderName}
        members={rosterMembers}
        isLeader={true}
        maxSeats={(teamRecord as { max_seats?: number }).max_seats ?? 8}
        language={(language as "en" | "id") || "en"}
        currentLanguage={(language as "en" | "id") || "en"}
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
        teamResults={teamResults}
        language={(language as "en" | "id") || "en"}
      />

      {/* Compact comms section */}
      <TeamCommsSection
        teamId={teamRecord.id}
        coachMessages={messages}
        broadcasts={broadcasts}
        language={lang}
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
  team: { id: string; name: string; language: string; selected_assessments: string[]; current_step: number; finalized_steps: number[] };
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
  const lang = (team.language as TeamLang) || "en";
  const ui = TEAM_UI[lang];

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
          language={lang}
        />
      )}

      {/* Journey intro for members */}
      <div style={{ background: "oklch(65% 0.15 45 / 0.08)", borderLeft: "3px solid oklch(65% 0.15 45)", padding: "1.125rem 1.5rem" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: "oklch(30% 0.10 260)", lineHeight: 1.7, margin: 0 }}>
          {leaderName ? ui.memberIntroWithLeader(leaderName) : ui.memberIntroNoLeader}{" "}
          {ui.memberIntroContinue}
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
        teamResults={teamResults}
        language={(team.language as "en" | "id") || "en"}
      />


    </div>
  );
}

const TEAM_ASSESSMENTS = [
  { id: "disc", label: "DISC Profile", href: "/resources/disc" },
  { id: "karunia-rohani", label: "Karunia Rohani", href: "/resources/karunia-rohani" },
  { id: "three-thinking-styles", label: "Three Thinking Styles", href: "/resources/three-thinking-styles" },
  { id: "wheel-of-life", label: "Wheel of Life", href: "/resources/wheel-of-life" },

  { id: "16-personalities", label: "16 Personalities", href: "/resources/16-personalities" },
  { id: "enneagram", label: "Enneagram", href: "/resources/enneagram" },
  { id: "big-five", label: "Big Five (OCEAN)", href: "/resources/big-five" },
];

// ── State components ────────────────────────────────────────────────────────

function TeamApplicationPrompt({ lang = "en" }: { lang?: "en" | "id" }) {
  return (
    <div style={{ background: "oklch(30% 0.12 260 / 0.06)", border: "1px solid oklch(88% 0.008 80)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
      <div>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", fontSize: "0.62rem", marginBottom: "0.25rem" }}>{lang === "id" ? "Jalur Tim" : "Team Pathway"}</p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.9rem", color: "oklch(22% 0.005 260)" }}>
          {lang === "id" ? "Siap memimpin tim Anda? Daftar untuk akses Pemimpin Tim." : "Ready to lead your team? Apply for Team Leader access."}
        </p>
      </div>
      <Link href="/apply" className="btn-primary" style={{ fontSize: "0.78rem", padding: "0.6rem 1.25rem", whiteSpace: "nowrap" }}>
        {lang === "id" ? "Daftar →" : "Apply →"}
      </Link>
    </div>
  );
}

function TeamApplicationPending({ firstName, lang = "en" }: { firstName: string; lang?: "en" | "id" }) {
  return (
    <div style={{ background: "oklch(65% 0.15 45 / 0.08)", border: "1px solid oklch(65% 0.15 45 / 0.2)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
      <span style={{ fontSize: "1.1rem" }}>🧭</span>
      <div>
        <p className="t-label" style={{ color: "oklch(65% 0.15 45)", fontSize: "0.62rem", marginBottom: "0.2rem" }}>{lang === "id" ? "Aplikasi Tim Sedang Ditinjau" : "Team Application Under Review"}</p>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(38% 0.008 260)" }}>
          {lang === "id" ? `Terima kasih ${firstName} — setiap aplikasi ditinjau secara pribadi. Anda akan menerima kabar melalui email.` : `Thanks ${firstName} — every application is reviewed personally. You'll hear back by email.`}
        </p>
      </div>
    </div>
  );
}

// ── My Courses section ──────────────────────────────────────────────────────

function MyCourses({ courses, lang = "en" }: {
  courses: { courseId: string; slug: string; title: string; completed: number; total: number; firstIncompleteSlug: string | null }[];
  lang?: "en" | "id";
}) {
  const anyStarted = courses.some(c => c.completed > 0);
  return (
    <div style={{ marginTop: "3rem", paddingTop: "2.5rem", borderTop: "1px solid oklch(85% 0.008 80)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>
        <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "1.125rem", color: "oklch(22% 0.005 260)" }}>
          {lang === "id" ? "Kursus Saya" : "My Courses"}
        </h2>
        <Link href="/courses" style={{
          fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 700,
          letterSpacing: "0.08em", color: "oklch(30% 0.12 260)", textDecoration: "none",
          border: "1px solid oklch(30% 0.12 260)", padding: "0.35rem 0.875rem",
          whiteSpace: "nowrap",
        }}>
          {lang === "id" ? "Semua Kursus →" : "All Courses →"}
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {courses.map((course) => {
          const pct = course.total > 0 ? Math.round((course.completed / course.total) * 100) : 0;
          const done = course.completed === course.total && course.total > 0;
          const startSlug = course.firstIncompleteSlug ?? null;
          const href = startSlug
            ? `/courses/${course.slug}/${startSlug}`
            : `/courses/${course.slug}`;

          return (
            <Link
              key={course.courseId}
              href={href}
              style={{
                display: "block",
                textDecoration: "none",
                background: "oklch(100% 0 0)",
                border: "1px solid oklch(88% 0.008 80)",
                padding: "1rem 1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {/* Progress ring */}
                <MiniRing pct={pct} done={done} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.875rem",
                    color: "oklch(22% 0.10 260)", marginBottom: "0.375rem",
                  }}>
                    {course.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      flex: 1, height: "4px",
                      background: "oklch(90% 0.006 80)",
                      borderRadius: "2px", overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: done ? "oklch(45% 0.10 155)" : "oklch(65% 0.15 45)",
                        borderRadius: "2px",
                        transition: "width 0.3s ease",
                      }} />
                    </div>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "0.68rem",
                      color: "oklch(55% 0.008 260)", whiteSpace: "nowrap",
                    }}>
                      {course.completed}/{course.total} {lang === "id" ? "bab" : "chapters"}
                    </span>
                  </div>
                </div>
                <span style={{
                  fontFamily: "var(--font-montserrat)", fontWeight: 600, fontSize: "0.72rem",
                  color: done ? "oklch(45% 0.10 155)" : "oklch(65% 0.15 45)",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  {done ? (lang === "id" ? "Selesai ✓" : "Complete ✓") : course.completed > 0 ? (lang === "id" ? "Lanjutkan →" : "Continue →") : (lang === "id" ? "Mulai →" : "Start →")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {!anyStarted && (
        <p style={{
          fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.6,
          color: "oklch(55% 0.008 260)", marginTop: "0.75rem",
        }}>
          {lang === "id" ? "Kursus gratis untuk membantu Anda bekerja lebih baik lintas budaya. Mulai kapan saja." : "Free courses to help you work better across cultures. Start anytime."}
        </p>
      )}
    </div>
  );
}

function MiniRing({ pct, done }: { pct: number; done: boolean }) {
  const r = 12;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
      <circle cx="16" cy="16" r={r} fill="none" stroke="oklch(90% 0.008 80)" strokeWidth="2.5" />
      <circle
        cx="16" cy="16" r={r}
        fill="none"
        stroke={done ? "oklch(45% 0.10 155)" : "oklch(65% 0.15 45)"}
        strokeWidth="2.5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 16 16)"
      />
    </svg>
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
