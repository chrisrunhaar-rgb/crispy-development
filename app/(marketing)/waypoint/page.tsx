import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import WayPointPreview from "./WayPointPreview";

export const metadata: Metadata = {
  title: "WayPoint: AI Voice Coaching for Cross-Cultural Leaders | Crispy Development",
  description:
    "A private AI voice coaching conversation whenever you need one. Not advice, but the right questions to help you find your own clarity.",
};

export default async function WayPointPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <WayPointPreview isLoggedIn={!!user} />;
}
