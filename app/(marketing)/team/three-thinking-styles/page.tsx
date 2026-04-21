import { createClient } from "@/lib/supabase/server";
import ThinkingStylesTeamClient from "./ThinkingStylesTeamClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Three Thinking Styles — Team | Crispy Development",
};

export default async function ThinkingStylesTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <ThinkingStylesTeamClient user={user ?? null} />;
}
