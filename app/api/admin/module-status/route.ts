import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "chris.runhaar@world-outreach.com";
const VALID_STATUSES = ["development", "live_free", "live_paid"] as const;
type ModuleStatus = typeof VALID_STATUSES[number];

const VALID_CATEGORIES = ["assessments", "cross-cultural", "leadership", "team-facilitation", "personal-development", "thinking-tools", "faith-calling", "self-care"] as const;
type LibraryCategory = typeof VALID_CATEGORIES[number];

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { slug, status, library_category } = body as { slug?: string; status?: string; library_category?: string };

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }
  if (status === undefined && library_category === undefined) {
    return NextResponse.json({ error: "at least one of status or library_category required" }, { status: 400 });
  }
  if (status !== undefined && !VALID_STATUSES.includes(status as ModuleStatus)) {
    return NextResponse.json({ error: "status must be development | live_free | live_paid" }, { status: 400 });
  }
  if (library_category !== undefined && library_category !== "" && !VALID_CATEGORIES.includes(library_category as LibraryCategory)) {
    return NextResponse.json({ error: "invalid library_category value" }, { status: 400 });
  }

  const upsertPayload: Record<string, string | null> = { slug, updated_at: new Date().toISOString() };
  if (status !== undefined) upsertPayload.status = status;
  if (library_category !== undefined) upsertPayload.library_category = library_category === "" ? null : library_category;

  const admin = createAdminClient();
  const { error } = await admin
    .from("module_status")
    .upsert(upsertPayload, { onConflict: "slug" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slug, status, library_category });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from("module_status").select("slug, status, library_category, updated_at").order("slug");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
