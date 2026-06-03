import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ApplyForm from "./ApplyForm";

export const metadata = { title: "Apply to Join — Influential Leadership Challenge" };

export default async function ApplyPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/challenge/group/${groupId}/apply`);

  const admin = createAdminClient();
  const { data: group } = await admin
    .from("challenge_groups")
    .select("id, name, description, is_public")
    .eq("id", groupId)
    .maybeSingle();

  if (!group || !group.is_public) redirect("/challenge/group/browse");

  // Already applied?
  const { data: existing } = await admin
    .from("challenge_group_applications")
    .select("status")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div style={{ minHeight: "100dvh", background: "oklch(97% 0.005 80)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
      <ApplyForm
        groupId={groupId}
        groupName={group.name}
        existingStatus={existing?.status ?? null}
      />
    </div>
  );
}
