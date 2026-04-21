import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import KaruniaTeamClient from "./KaruniaTeamClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Karunia Rohani — Tim | Crispy Development",
  description:
    "Ketika tim tahu karunia masing-masing anggota, mereka bisa saling melengkapi untuk membangun tubuh Kristus bersama.",
};

export default async function KaruniaTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <KaruniaTeamClient user={user ?? null} />;
}
