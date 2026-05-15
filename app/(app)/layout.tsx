import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ClientLayout from "./ClientLayout";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <ClientLayout hasCoachAccess={hasCoachAccess}>
      {children}
    </ClientLayout>
  );
}
