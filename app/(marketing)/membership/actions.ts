"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitMembershipApplication(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const organization = (formData.get("organization") as string | null)?.trim() ?? "";
  const role = (formData.get("role") as string | null)?.trim() ?? "";
  const locationCultures = (formData.get("location_cultures") as string | null)?.trim() ?? "";
  const faithShare = (formData.get("faith_share") as string | null)?.trim() ?? "";
  const leadershipChallenge = (formData.get("leadership_challenge") as string | null)?.trim() ?? "";
  const referralSource = (formData.get("referral_source") as string | null)?.trim() ?? "";
  const preferredLanguage = (formData.get("preferred_language") as string | null) === "id" ? "id" : "en";

  if (!name || !email) return { error: "Name and email are required." };
  if (!email.includes("@")) return { error: "Please enter a valid email address." };

  const supabase = await createClient();
  const { error } = await supabase.from("membership_applications").insert({
    name,
    email: email.toLowerCase(),
    organization: organization || null,
    role: role || null,
    location_cultures: locationCultures || null,
    faith_share: faithShare || null,
    leadership_challenge: leadershipChallenge || null,
    referral_source: referralSource || null,
    preferred_language: preferredLanguage,
    status: "pending",
  });

  if (error) {
    if (error.message.includes("duplicate") || error.message.includes("unique")) {
      return { error: "An application with this email already exists." };
    }
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
