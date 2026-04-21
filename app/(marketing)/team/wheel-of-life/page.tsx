import { createClient } from "@/lib/supabase/server";
import WheelOfLifeTeamClient from "./WheelOfLifeTeamClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wheel of Life — Team | Crispy Development",
};

export default async function WheelOfLifeTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <WheelOfLifeTeamClient user={user ?? null} />;
}
