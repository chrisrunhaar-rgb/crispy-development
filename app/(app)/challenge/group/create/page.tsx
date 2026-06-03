import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateGroupForm from "./CreateGroupForm";

export const metadata = { title: "Create a Group — Influential Leadership Challenge" };

export default async function CreateGroupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/challenge/group/create");

  return (
    <div style={{ minHeight: "calc(100dvh - 80px)", background: "oklch(97% 0.005 80)", paddingBlock: "3rem", paddingInline: "1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <CreateGroupForm />
    </div>
  );
}
