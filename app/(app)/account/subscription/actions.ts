"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispyleaders.com";

// Creates a Stripe Billing Portal session and redirects the user into it —
// this is what makes the pricing FAQ's "cancel any time from your account
// dashboard" promise real. Works for both a Personal subscriber and a Team
// leader (whichever row on their account carries a stripe_customer_id).
export async function createPortalSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const restrictedKey = process.env.STRIPE_RESTRICTED_KEY;
  if (!restrictedKey) redirect("/account/subscription?portal=unavailable");

  const admin = createAdminClient();
  const [{ data: membership }, { data: team }] = await Promise.all([
    admin.from("memberships").select("stripe_customer_id").eq("user_id", user.id).maybeSingle(),
    admin.from("teams").select("stripe_customer_id").eq("leader_user_id", user.id).maybeSingle(),
  ]);

  const customerId = membership?.stripe_customer_id ?? team?.stripe_customer_id ?? null;
  if (!customerId) redirect("/account/subscription?portal=unavailable");

  const stripe = new Stripe(restrictedKey, { apiVersion: "2026-08-26.dahlia" });
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/account/subscription`,
  });

  redirect(session.url);
}

// Sends a subscriber's billing/subscription question to the Crispy inbox via
// Resend — same pattern as app/api/contact/route.ts (hello@crispyleaders.com).
export async function submitSubscriptionQuestion(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const message = (formData.get("message") as string | null)?.trim();
  if (!message) redirect("/account/subscription?question=empty");

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Crispy Leaders <noreply@crispyleaders.com>",
        to: "hello@crispyleaders.com",
        reply_to: user.email,
        subject: `Subscription question from ${user.email}`,
        html: `<p><strong>From:</strong> ${user.email}</p><p><strong>User ID:</strong> ${user.id}</p><p><strong>Question:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
      }),
    });
  }

  redirect("/account/subscription?question=sent");
}
