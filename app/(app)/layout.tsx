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

  // Sync cookie to metadata on every authenticated page load — prevents stale cookie
  // overriding the user's explicit language preference (e.g. after group creation)
  const metaLang = ((user?.user_metadata as Record<string, unknown>)?.language_preference as string) === "id" ? "id" : "en";

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `document.cookie="crispy-lang=${metaLang};path=/;max-age=31536000;samesite=lax"` }} />
      <ClientLayout hasCoachAccess={hasCoachAccess}>
        {children}
      </ClientLayout>
    </>
  );
}
