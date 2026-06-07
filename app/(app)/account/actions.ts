"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const firstName = (formData.get("first_name") as string | null)?.trim() ?? "";
  const lastName = (formData.get("last_name") as string | null)?.trim() ?? "";

  if (!firstName) return { error: "First name is required" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ first_name: firstName, last_name: lastName })
    .eq("id", user.id);

  if (error) return { error: error.message };

  await supabase.auth.updateUser({
    data: { first_name: firstName, last_name: lastName },
  });

  revalidatePath("/account");
  revalidatePath("/dashboard");
  return { success: true };
}
