import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import OnePagerViewer from "@/components/OnePagerViewer";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "healthy-conflict";

export const metadata: Metadata = {
  title: "One-pager: Healthy Conflict",
  robots: { index: false, follow: false },
};

export default async function OnePagerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await requireModuleAccess(supabase, user?.id ?? null, RESOURCE_SLUG, user?.email ?? null);

  return <OnePagerViewer slug={RESOURCE_SLUG} title={{ en: "Healthy Conflict", id: "Konflik yang Sehat" }} />;
}
