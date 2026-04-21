"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function postDiscussion(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to post." };

  const content = (formData.get("content") as string)?.trim();
  const moduleId = (formData.get("moduleId") as string) || null;
  const userName = (formData.get("userName") as string) || null;
  const parentId = (formData.get("parentId") as string) || null;

  if (!content || content.length < 3) return { error: "Post is too short." };
  if (content.length > 2000) return { error: "Post is too long (max 2000 characters)." };

  const { error } = await supabase
    .from("discussions")
    .insert({
      user_id: user.id,
      user_name: userName,
      module_id: moduleId || null,
      parent_id: parentId || null,
      content,
    });

  if (error) return { error: "Failed to post. Please try again." };

  revalidatePath("/community");
  return { success: true };
}
