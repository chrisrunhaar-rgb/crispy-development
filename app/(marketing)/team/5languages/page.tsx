import { createClient } from "@/lib/supabase/server";
import FiveLanguagesTeamClient from "./FiveLanguagesTeamClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "5 Languages of Appreciation — Team | Crispy Development",
};

export default async function FiveLanguagesTeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <FiveLanguagesTeamClient user={user ?? null} />;
}
