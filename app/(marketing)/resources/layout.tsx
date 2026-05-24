import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AppBottomNav } from "../../(app)/ClientLayout";
import ScrollTracker from "@/components/ScrollTracker";
import { ResourceViewTracker } from "@/components/ResourceViewTracker";

export default async function ResourcesLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let hasCoachAccess = false;
  if (user) {
    const admin = createAdminClient();
    const { data: membership } = await admin
      .from("memberships")
      .select("coach_access, is_admin")
      .eq("user_id", user.id)
      .single();
    hasCoachAccess = membership?.coach_access === true || membership?.is_admin === true;
  }

  const showNav = !!user;

  return (
    <>
      <div style={showNav ? { paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" } : undefined}>
        {children}
      </div>
      <ScrollTracker />
      <ResourceViewTracker />
      {showNav && <AppBottomNav hasCoachAccess={hasCoachAccess} />}
    </>
  );
}
