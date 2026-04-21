# Pending Tweaks — Phase 1 Polish

Collected before Phase 2. Implement all in one deploy when Chris says go.

## Phase 2 Build Queue

### P2-A: Three Thinking Styles content page
- Fully public (no login required)
- Also linked from the logged-in library
- Full content from Content Library source file
- 20-question quiz with 7 result types
- Links to free library + CTAs to join community at bottom of page

### P2-B: Library in personal dashboard
- Resources list with progress tracking per user
- Progress bars per module
- Modules seeded in DB: 5 modules (3 both-pathway, 1 team, 1 personal)

### P2-C: Peer Groups system
- World map showing all active peer groups
- Group size: 3-25 people
- One initiator per group (lead role)
- "Initiate a New Peer Group" button with application form (similar to team leader form)
- Groups show: pathway, timezone, open/closed status
- Peer Group page accessible from homepage (third pathway alongside Personal + Team)

### P2-D: Peer Group initiator application form
- Similar to team leader application
- Fields TBD (region, timezone, focus/pathway, why they want to initiate)
- Reviewed and approved by Chris

### P2-E: Admin dashboard — 3 tabs
- Tab 1: Members (all users)
- Tab 2: Team Leaders (approved applications)
- Tab 3: Peer Group Initiators (approved peer group applications)
- Currently only shows pending applications + messages

### P2-F: Pricing
- Everything free for now
- Gating strategy to be decided later

## Phase 1 Polish Queue

### 1. Team Application Form — placeholder text
**Field: "What organisation or movement are you part of?"**
- Change placeholder from: `e.g. SIM International, OMF, local church, NGO...`
- Change to: `e.g. organisation, church, NGO...`

**Field: "What kind of cross-cultural work does your team do?"**
- Change placeholder from: `e.g. Church planting in Southeast Asia, NGO in the Middle East...`
- Change to: `e.g. community development in Southeast Asia, NGO in the Middle East...`

**Reason:** No missions-world smell — keeps the platform accessible to organisations in sensitive areas where that language is a risk.

### 2. Favicon / bookmark icon
- Replace the generic favicon with the Crispy logo (`logo-icon.png`)
- Apply to: browser tab icon, bookmarks, iOS home screen shortcut
- We have `public/logo-icon.png` already — just needs wiring up properly in Next.js metadata + manifest

### 3. Hero — "RAISING LEADERS WHO CROSS CULTURES" label
- The orange uppercase tagline above the main heading is too small
- Increase font size so it reads more clearly

### 5. Page-specific quotes in CTA sections
Each page has a pull-quote above "Ready to start your pathway?" — currently the same on every page. Make them unique per page, same Cormorant Garamond italic style, each drawing people toward community.

Draft quotes (to confirm with Chris before implementing):
- **Home:** "Leadership that endures is leadership that is grounded." *(current — keep)*
- **Personal (/personal):** "You cannot lead others through what you have not navigated yourself."
- **Team (/team):** "The strongest teams are built by leaders who know how to be known."
- **Resources (/resources):** "Every tool is only as good as the hands — and the heart — behind it."
- **Signup (/signup):** "The journey starts before you feel ready. That is precisely the point."

Chris to confirm or replace any of these.

### 7. Pathway section — 3 cards with illustrated figures
Currently shows 2 pathways (Personal + Team). Expand to 3 and add a visual figure + orange pathway arrow to each card:

- **Personal**: Single lone figure, orange dotted/curved path arrow leading toward the CTA button — "you, on your own journey"
- **Team**: Figure at the front with smaller figures behind/following — leader and team walking the same path
- **Peer Group** (new card): Figure walking toward a circle of others — seeking community, finding your group

Creative direction: SVG silhouettes, minimal and bold, navy/orange palette. The arrow/path is the visual thread that connects all 3 — same motif, different formation of people.

Section label changes from "TWO PATHWAYS" → "THREE PATHWAYS" (or "CHOOSE YOUR PATH").

### 6. Language selector — flag dropdown in nav
- Flag dropdown in navigation for language switching
- Languages confirmed: English 🇬🇧, Dutch 🇳🇱, Spanish 🇪🇸, French 🇫🇷, Portuguese 🇵🇹, Indonesian 🇮🇩
- Use Next.js i18n routing
- Build infrastructure + placeholder flags now; translations added per language later

### 4. Hero — compass logo positioning on wide screens
- On wide screens the compass floats too far to the right edge
- It should stay close to the text column — constrain the hero layout to a max-width container so the compass never drifts away from the heading on large monitors
