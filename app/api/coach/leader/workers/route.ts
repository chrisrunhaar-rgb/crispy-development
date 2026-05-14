import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  // Get workers assigned to this leader
  const { data: assignments } = await admin
    .from("wp_leader_assignments")
    .select("worker_user_id, assigned_at")
    .eq("leader_user_id", user.id);

  if (!assignments || assignments.length === 0) {
    return NextResponse.json({ workers: [] });
  }

  const workerIds = assignments.map(a => a.worker_user_id);

  // Get worker profiles
  const { data: profiles } = await admin
    .from("wp_worker_profiles")
    .select("user_id, name, organisation, location")
    .in("user_id", workerIds);

  // Get session stats per worker — only sessions the worker chose to share
  const { data: sessions } = await admin
    .from("wp_sessions")
    .select("user_id, id, status, started_at, session_number")
    .in("user_id", workerIds)
    .eq("status", "completed")
    .eq("shared_with_leader", true)
    .order("started_at", { ascending: false });

  // Get recent whiteboard themes (focus_today only — no transcripts)
  const recentSessionIds = (sessions ?? [])
    .reduce<string[]>((acc, s) => {
      const workerSessions = acc.filter(id =>
        (sessions ?? []).find(s2 => s2.id === id)?.user_id === s.user_id
      );
      if (workerSessions.length < 3) acc.push(s.id);
      return acc;
    }, []);

  const { data: whiteboards } = await admin
    .from("wp_whiteboards")
    .select("session_id, user_id, focus_today, key_insights, action_steps")
    .in("session_id", recentSessionIds);

  // Get auth user names
  const { data: authUsers } = await admin.auth.admin.listUsers();
  const userMap = new Map(
    (authUsers?.users ?? []).map(u => [
      u.id,
      `${u.user_metadata?.first_name ?? ""} ${u.user_metadata?.last_name ?? ""}`.trim() || u.email,
    ])
  );

  // Build worker summaries
  const now = Date.now();
  const workers = workerIds.map(wid => {
    const profile = profiles?.find(p => p.user_id === wid);
    const workerSessions = (sessions ?? []).filter(s => s.user_id === wid);
    const lastSession = workerSessions[0];
    const totalSessions = workerSessions.length;
    const wbs = (whiteboards ?? []).filter(w => w.user_id === wid);

    const daysSinceLastSession = lastSession
      ? Math.floor((now - new Date(lastSession.started_at).getTime()) / 86400000)
      : null;

    // Alert logic
    let alert: string | null = null;
    if (totalSessions === 0) alert = "No sessions yet";
    else if (daysSinceLastSession !== null && daysSinceLastSession > 21) alert = `No session in ${daysSinceLastSession} days`;

    // Recent themes (focus areas only)
    const recentThemes = wbs
      .map(w => w.focus_today)
      .filter(Boolean) as string[];

    return {
      user_id: wid,
      name: profile?.name ?? userMap.get(wid) ?? "Unknown",
      organisation: profile?.organisation ?? null,
      location: profile?.location ?? null,
      total_sessions: totalSessions,
      last_session_at: lastSession?.started_at ?? null,
      days_since_last_session: daysSinceLastSession,
      recent_themes: recentThemes,
      alert,
    };
  });

  // Sort: alerts first, then by days since last session
  workers.sort((a, b) => {
    if (a.alert && !b.alert) return -1;
    if (!a.alert && b.alert) return 1;
    if (a.days_since_last_session === null) return 1;
    if (b.days_since_last_session === null) return -1;
    return b.days_since_last_session - a.days_since_last_session;
  });

  return NextResponse.json({ workers });
}
