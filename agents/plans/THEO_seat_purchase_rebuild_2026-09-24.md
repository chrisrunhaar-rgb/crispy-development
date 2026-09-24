# Plan: Rebuild "Add a Seat" as a $15 one-time purchase

**Agent**: THEO
**Date**: 2026-09-24
**Status**: PENDING APPROVAL

## Objective

Remove the old, non-functional "$49 Add a Seat" button on the team dashboard and replace it with a working $15-per-seat one-time purchase, priced the same as a normal Personal plan seat, so a team leader can actually buy extra seats when their team is full — one at a time, or several at once (e.g. buy 7 seats in a single $105 checkout).

## Background

The current "Add a Seat" button on the team page always fails. It tries to buy something called `additional_seat`, but that option was never actually built into the payment system, so clicking it just shows an error message ("coming soon"). Nobody has ever been charged the $49 shown — it's dead code.

Separately, the site's main pricing page already sells a Personal plan seat as a **one-time $15 payment for permanent access** — no subscription. Chris asked that the seat-purchase price match that normal Personal pathway, so this plan reuses the exact same $15 price already live on the pricing page rather than creating a new one.

## Proposed Action

1. Remove the broken $49 button, its copy ("+ Add a Seat — $49" / "+ Tambah Kursi — $49"), and the dead `additional_seat` request it sends.
2. Replace it with a small quantity picker (1, 2, 3… however many seats are needed) and a button that charges $15 × that quantity in one Stripe checkout, then sends the buyer to pay.
3. When payment succeeds, automatically raise that team's seat limit by however many seats were bought, so the leader can immediately start inviting — no manual step for Chris or Yada, and no need to check out multiple times.

## Steps

1. **Payment page** (`app/api/checkout/route.ts`): add a new purchase option for "buy N seats," using the exact same $15 Stripe price already live on the Personal plan with a quantity attached (Stripe natively supports charging quantity × price in a single checkout — no new pricing object needed). Confirm the buyer is that team's actual leader, and cap quantity at a sane upper limit (e.g. 50) before allowing the purchase.
2. **Payment confirmation** (`app/api/webhooks/stripe/route.ts`): when Stripe confirms the payment went through, increase that team's seat limit by the exact quantity purchased in the database.
3. **Team page** (`components/TeamRoster.tsx`): remove the $49 button and copy entirely; add a quantity picker plus a working "+ Add Seats — $15 each" button (English and Indonesian) that shows the running total (e.g. "7 seats — $105") and sends the leader to Stripe checkout for that amount.
4. Test end-to-end on a test team before going live: fill a team to its seat limit, buy a single seat, confirm the limit goes up by one; separately test buying several seats at once (e.g. 7) and confirm the limit goes up by exactly that many and only one charge occurs.

## Risks

- **Risk**: Someone other than the team's real leader could try to trigger this purchase for a team they don't own → mitigation: server checks the logged-in user is that team's leader before creating the Stripe checkout session, same pattern already used elsewhere in the code.
- **Risk**: Stripe confirms payment but the seat-limit increase fails to save (rare, e.g. a database hiccup) → mitigation: same safe pattern already used for coaching-minute purchases — Stripe automatically retries the confirmation until it succeeds, so the seat limit isn't silently lost.
- **Risk**: A refund on a seat purchase wouldn't automatically lower the seat limit back down → mitigation: this is already true for other one-time purchases on the site (manual step if it ever happens); flagging so it's a known, accepted limitation rather than a surprise.

## Timeline

Same session once approved — this is a contained change to 3 files, testable immediately after.

## Budget / Cost Impact

No new cost. This makes an already-broken $49 feature correctly charge $15 instead (a price decrease, matching the existing Personal seat price) — no new Stripe products or fees involved.

## Requires

Go-ahead from Chris (this is live checkout/billing code, per standing Plan Mode rule).

## Agent Recommendation

Proceed, including the multi-seat quantity picker — this closes a real gap (a leader with 15 people currently can't add seats at all, let alone in bulk), and letting them buy several at once in one checkout is a small addition on top of the same wiring, not a separate build. Matching the price to the $15 Personal price is simpler (reuses an existing, already-live Stripe price) and keeps pricing consistent across the site.

## Decision

- [x] APPROVED — proceed
- [ ] APPROVED WITH CHANGES — [note changes]
- [ ] REJECTED — [reason]

_Chris approved via Telegram 2026-09-24: "please build"_
