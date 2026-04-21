import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ForwardTogetherClient from "./ForwardTogetherClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Forward Together — Team Pathway | Crispy Development",
  description: "The final module. Celebrate how far you've come, reflect on the journey, and co-write your team's declaration for what comes next.",
};

export default async function ForwardTogetherPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <ForwardTogetherClient user={user} />;
}
