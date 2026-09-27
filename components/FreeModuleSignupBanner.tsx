import { createAdminClient } from "@/lib/supabase/admin";
import SignupBanner from "@/components/SignupBanner";

// Server wrapper: shows the SignupBanner at the end of a module, only when the
// visitor is logged out AND the module is currently set to "Free" in admin.
export default async function FreeModuleSignupBanner({ slug, isLoggedIn }: { slug: string; isLoggedIn: boolean }) {
  if (isLoggedIn) return null;
  const admin = createAdminClient();
  const { data } = await admin.from("module_status").select("status").eq("slug", slug).maybeSingle();
  if (data?.status !== "live_free") return null;
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(40px, 6vw, 64px) 16px" }}>
      <SignupBanner redirectTo="/dashboard" />
    </div>
  );
}
