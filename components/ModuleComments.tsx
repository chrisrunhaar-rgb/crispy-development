import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ModuleCommentsClient from "./ModuleCommentsClient";

export type ModuleComment = {
  id: string;
  user_id: string;
  comment: string;
  visibility: string;
  status: string;
  admin_reply: string | null;
  reply_seen: boolean;
  created_at: string;
  display_name: string | null;
};

export default async function ModuleComments({ slug }: { slug: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let hasPaidAccess = false;
  let publishedComments: ModuleComment[] = [];
  let myComment: ModuleComment | null = null;

  if (user) {
    const admin = createAdminClient();

    const { data: membership } = await admin
      .from("memberships")
      .select("coach_access, is_admin")
      .eq("user_id", user.id)
      .single();
    hasPaidAccess = membership?.coach_access === true || membership?.is_admin === true;

    const { data: own } = await supabase
      .from("module_comments")
      .select("id, user_id, comment, visibility, status, admin_reply, reply_seen, created_at, display_name")
      .eq("module_slug", slug)
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    myComment = own ?? null;

    if (hasPaidAccess) {
      const { data: published } = await supabase
        .from("module_comments")
        .select("id, user_id, comment, visibility, status, admin_reply, reply_seen, created_at, display_name")
        .eq("module_slug", slug)
        .eq("visibility", "public_published")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(20);
      publishedComments = (published ?? []).filter(c => c.user_id !== user.id);
    }
  }

  return (
    <ModuleCommentsClient
      slug={slug}
      userId={user?.id ?? null}
      hasPaidAccess={hasPaidAccess}
      isLoggedIn={!!user}
      publishedComments={publishedComments}
      myComment={myComment}
    />
  );
}
