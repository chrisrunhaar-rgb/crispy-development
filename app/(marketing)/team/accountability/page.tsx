import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AccountabilityClient from "./AccountabilityClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Accountability & Follow-Through — Team Pathway | Crispy Development",
  description: "Build a team culture where commitments are kept, follow-through is honoured, and accountability feels supportive — not punitive.",
};

export default async function AccountabilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const lang = ((user?.user_metadata?.language_preference ?? "en") as "en" | "id");
  return <AccountabilityClient user={user} lang={lang} />;
}
