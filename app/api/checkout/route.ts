import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { plan, currency, quantity } = body as { plan: "personal" | "team" | "additional_seat"; currency: "usd" | "idr"; quantity?: number };

  if (!plan || !["personal", "team", "additional_seat"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // Stripe not yet connected — wire here when UK Ltd account is ready
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ ready: false, checkoutUrl: null });
  }

  // ── Stripe integration (uncomment when STRIPE_SECRET_KEY is set) ──
  //
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  //
  // const priceIds: Record<string, Partial<Record<string, string>>> = {
  //   personal: {
  //     usd: process.env.STRIPE_PRICE_PERSONAL_USD!,
  //     idr: process.env.STRIPE_PRICE_PERSONAL_IDR!,
  //   },
  //   team: {
  //     usd: process.env.STRIPE_PRICE_TEAM_USD!,
  //     idr: process.env.STRIPE_PRICE_TEAM_IDR!,
  //   },
  //   additional_seat: {
  //     usd: process.env.STRIPE_PRICE_SEAT_USD!,
  //   },
  // }
  //
  // const priceId = priceIds[plan][currency] ?? priceIds[plan]["usd"]
  //
  // const session = await stripe.checkout.sessions.create({
  //   mode: "payment",
  //   line_items: [{ price: priceId, quantity: quantity ?? 1 }],
  //   success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?seats_added=1`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
  //   metadata: { plan, currency, quantity: String(quantity ?? 1) },
  // })
  //
  // return NextResponse.json({ ready: true, checkoutUrl: session.url })

  return NextResponse.json({ ready: false, checkoutUrl: null });
}
