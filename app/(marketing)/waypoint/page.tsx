import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import WayPointContent from "./WayPointContent";

export const metadata: Metadata = {
  title: "WayPoint — AI Voice Coaching for Cross-Cultural Leaders | Crispy Development",
  description:
    "A private AI voice coaching conversation whenever you need one. Not advice — the right questions. Find your own clarity. Available to Crispy Leaders members.",
};

export default async function WayPointPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <WayPointContent isLoggedIn={!!user} />;
}
