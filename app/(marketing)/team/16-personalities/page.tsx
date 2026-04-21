import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Personalities16TeamClient from "./Personalities16TeamClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "16 Personalities — Team | Crispy Development",
  description:
    "Discover how each temperament contributes to team culture — and how the Assertive/Turbulent dimension shapes how your team responds to pressure and feedback.",
};

export default async function Personalities16TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <Personalities16TeamClient user={user ?? null} />;
}
