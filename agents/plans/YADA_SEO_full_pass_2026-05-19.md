# PLAN: Full SEO Pass — All Live Modules
**Date:** 2026-05-19  
**Owner:** Yada  
**Status:** Awaiting Chris approval

---

## Context

13 modules are live (Live Free or Live Paid). DISC already has the full SEO treatment from prior phases. 12 modules still need it.

Structural SEO (Phases 1–3) is DONE on all pages:
- Canonical tags ✅
- OpenGraph + Twitter Card ✅
- Breadcrumb schema ✅
- Related Resources / internal linking ✅
- LearningResource JSON-LD ✅
- Dynamic sitemap ✅

What DISC has that the other 12 don't:
1. FAQ schema (FAQPage JSON-LD, Google rich results)
2. Long-form content section (800–1200 words, keyword-targeted)
3. Keyword-optimized meta description

---

## Modules in scope (12)

**Live Free (5):**
- 5languages
- cultural-intelligence
- healthy-conflict
- johari-window
- vision-casting

**Live Paid (7):**
- 16-personalities
- big-five
- enneagram
- karunia-rohani
- power-distance
- three-thinking-styles
- wheel-of-life

---

## Deliverables per module

1. **FAQ schema** — 5–6 Q&A pairs per module, FAQPage JSON-LD added to page.tsx. Enables Google rich results (expandable Q&A in search).
2. **Long-form content section** — 800–1200 words keyword-targeted section, inserted into [Module]Client.tsx. Targets search queries like "what is [topic]", "how to use [framework]", etc.
3. **Keyword meta description** — overrides generic description with a search-optimized one.

---

## Agent assignments

| Agent | Task |
|---|---|
| NOVA | Keyword research: what does each module rank for / should rank for? Top 3 keywords per module. |
| VERA | Source research: 3–5 Christian + credible sources per module for content expansion |
| CLEO | Write all FAQ Q&A sets + long-form content sections (800–1200 words each) |
| THEO | Implement: FAQ schema in page.tsx + content section in Client.tsx + meta description update |
| BEAU | Brand check: tone + visual integration of new content sections |

---

## Phases

### Phase 1 — Research (NOVA + VERA in parallel, all 12 modules)
- NOVA: keyword research for all 12 → ranked keyword targets
- VERA: source gathering for all 12 → 3–5 sources per module
- Output: Research brief per module

### Phase 2 — Content writing (CLEO)
- Writes FAQ Q&A (5–6 questions) per module
- Writes long-form section (800–1200 words) per module
- Input: Phase 1 research briefs
- Output: 12 content packages (text files)

### Phase 3 — Implementation (THEO)
- Adds FAQ schema to each page.tsx
- Adds content section to each Client.tsx
- Updates meta descriptions
- Deploys to Vercel
- Output: 12 modules updated on crispyleaders.com

### Phase 4 — QA (BEAU + VERA)
- BEAU: brand + visual check per module (tone, layout fit)
- VERA: citation check — all claims in live modules verified
- Any issues → THEO fixes → re-deploy

---

## Batching approach

Run in 3 batches of 4 modules to keep quality high:

**Batch 1 (priority — free tier = most visibility):**
cultural-intelligence, healthy-conflict, johari-window, vision-casting

**Batch 2:**
5languages, enneagram, power-distance, three-thinking-styles

**Batch 3:**
16-personalities, big-five, karunia-rohani, wheel-of-life

---

## Notes

- DISC is the quality benchmark — match its standard
- Christian sources first (per research protocol)
- No em dashes. No "missionaries". Warm, practical, faith-rooted voice.
- karunia-rohani is Indonesian-primary — content expansion in ID, FAQ in EN + ID
- All content goes through Chris approval before Phase 3 begins

---

## Timeline estimate

Phase 1: 1 session  
Phase 2: 2–3 sessions (CLEO writes, Chris spot-checks batch by batch)  
Phase 3: 1–2 sessions (THEO implements per batch)  
Phase 4: 1 session  

Total: 5–7 sessions across 2–3 weeks depending on Chris review pace.

---

## Approval required

Chris approves this plan → Phase 1 begins immediately.
Chris reviews content batch by batch before THEO implements.
