import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, lang } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = lang === "id"
    ? process.env.MAILCHIMP_LIST_ID_ID
    : process.env.MAILCHIMP_LIST_ID_EN;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !listId || !server) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const res = await fetch(
    `https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        tags: ["leadership-bytes", lang === "id" ? "lang-id" : "lang-en"],
      }),
    }
  );

  if (res.status === 400) {
    const data = await res.json();
    if (data.title === "Member Exists") {
      return NextResponse.json({ ok: true, already: true });
    }
    return NextResponse.json({ error: data.detail || "Subscribe failed" }, { status: 400 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
