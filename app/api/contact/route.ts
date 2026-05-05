import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin.from("contact_messages").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    if (error) {
      console.error("contact insert error:", error);
      return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }

    // Notify hello@crispyleaders.com via Resend
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
          reply_to: email.trim(),
          subject: `New message from ${name.trim()}`,
          html: `<p><strong>Name:</strong> ${name.trim()}</p><p><strong>Email:</strong> ${email.trim()}</p><p><strong>Message:</strong></p><p>${message.trim().replace(/\n/g, "<br>")}</p>`,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
