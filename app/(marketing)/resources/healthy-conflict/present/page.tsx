import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/require-module-access";
import PresentClient from "./PresentClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "healthy-conflict";

export const metadata: Metadata = {
  title: "Present: Creating Healthy Conflict",
  robots: { index: false, follow: false },
};

export default async function PresentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await requireModuleAccess(supabase, user?.id ?? null, RESOURCE_SLUG, user?.email ?? null);

  return <PresentClient />;
}
