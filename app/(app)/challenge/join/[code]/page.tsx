import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import JoinGroupClient from "./JoinGroupClient";

export const metadata = { title: "Join Group — Influential Leadership Challenge" };

export default async function JoinGroupPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/challenge/join/${code}`);

  const admin = createAdminClient();
  const { data: group } = await admin
    .from("challenge_groups")
    .select("id, name, description, facilitator_id, max_members, schedule_days")
    .eq("group_code", code.toUpperCase())
    .maybeSingle();

  if (!group) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "var(--font-montserrat)", color: "oklch(22% 0.10 260)", textAlign: "center" }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.75rem" }}>Invalid invite link</h2>
          <p style={{ fontSize: "0.875rem", color: "oklch(52% 0.008 260)" }}>This invite may have expired or the group is no longer active.</p>
        </div>
      </div>
    );
  }

  const { count } = await admin
    .from("challenge_group_members")
    .select("id", { count: "exact", head: true })
    .eq("group_id", group.id);

  const isFull = (count ?? 0) >= group.max_members;

  const { data: alreadyMember } = await admin
    .from("challenge_group_members")
    .select("id")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (alreadyMember) redirect("/challenge/day/1");

  return (
    <JoinGroupClient
      code={code.toUpperCase()}
      groupName={group.name}
      groupDescription={group.description}
      scheduleDays={group.schedule_days ?? []}
      memberCount={count ?? 0}
      maxMembers={group.max_members}
      isFull={isFull}
    />
  );
}
