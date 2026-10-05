import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "chris.runhaar@world-outreach.com";

/**
 * Same rule as requireModuleAccess for live_paid modules, but returns a boolean
 * instead of redirecting: active personal membership, or a seat on / lead of a team.
 */
export async function hasPaidAccess(userId: string | null, userEmail?: string | null): Promise<boolean> {
  if (!userId) return false;
  if (userEmail === ADMIN_EMAIL) return true;

  const admin = createAdminClient();
  const [{ data: membership }, { data: teamMember }, { data: teamLeader }] = await Promise.all([
    admin.from("memberships").select("subscription_active").eq("user_id", userId).maybeSingle(),
    admin.from("team_members").select("id").eq("user_id", userId).maybeSingle(),
    admin.from("teams").select("id").eq("leader_user_id", userId).maybeSingle(),
  ]);
  return membership?.subscription_active === true || !!teamMember || !!teamLeader;
}
