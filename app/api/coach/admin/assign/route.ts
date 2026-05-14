import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function assertAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from("memberships").select("is_admin").eq("user_id", userId).single();
  return data?.is_admin === true;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!await assertAdmin(supabase, user.id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { leader_user_id, worker_user_id } = await req.json();
  if (!leader_user_id || !worker_user_id) return NextResponse.json({ error: "Both IDs required" }, { status: 400 });

  const admin = createAdminClient();
  const { data: assignment, error } = await admin
    .from("wp_leader_assignments")
    .insert({ leader_user_id, worker_user_id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ assignment });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!await assertAdmin(supabase, user.id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("wp_leader_assignments").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
