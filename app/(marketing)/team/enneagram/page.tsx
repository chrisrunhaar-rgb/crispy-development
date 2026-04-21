import { createClient } from "@/lib/supabase/server";
import EnneagramTeamClient from "./EnneagramTeamClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Enneagram — Team | Crispy Development",
};

export default async function EnneagramTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <EnneagramTeamClient user={user ?? null} />;
}
