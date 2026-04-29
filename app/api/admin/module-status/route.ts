import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "chris.runhaar@world-outreach.com";
const VALID_STATUSES = ["development", "live_free", "live_paid"] as const;
type ModuleStatus = typeof VALID_STATUSES[number];

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { slug, status } = body as { slug?: string; status?: string };

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }
  if (!status || !VALID_STATUSES.includes(status as ModuleStatus)) {
    return NextResponse.json({ error: "status must be development | live_free | live_paid" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("module_status")
    .upsert({ slug, status, updated_at: new Date().toISOString() }, { onConflict: "slug" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slug, status });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from("module_status").select("slug, status, updated_at").order("slug");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
