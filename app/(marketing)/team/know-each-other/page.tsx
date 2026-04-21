import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import KnowEachOtherClient from "./KnowEachOtherClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "How to Really Know Each Other — Crispy Development",
  description: "Most teams know what each person does. Few teams know who each person is. A guide to building genuine knowledge, trust, and depth across cultural difference.",
};

export default async function KnowEachOtherPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <KnowEachOtherClient user={user} />;
}
