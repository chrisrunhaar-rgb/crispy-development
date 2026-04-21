import { createClient } from "@/lib/supabase/server";
import DiscTeamClient from "./DiscTeamClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "DISC Profile — Team | Crispy Development",
};

export default async function DiscTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <DiscTeamClient user={user ?? null} />;
}
