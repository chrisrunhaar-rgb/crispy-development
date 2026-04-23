# DISC Assessment Page — Visual Redesign Brief

**Status:** Ready for Chris approval  
**Version:** 1.0  
**Date:** 2026-04-23  
**Prepared by:** BEAU (Brand Director)  

---

## Executive Summary

The current DISC page is dark, text-heavy, and underutilizes the 4-color DISC framework. Chris's brief: make it **bright, colorful, visually distinctive, and immediately engaging**.

This redesign flips the visual strategy: dark backgrounds → light, airy foundation. Static type cards → dynamic color blocks. "Quiz" language → "Assessment" terminology.

**Key changes:**
1. Remove "Quiz" language throughout
2. Swap dark section background for bright, inviting layout
3. Apply DISC 4-color system prominently and purposefully
4. Create visual hierarchy that makes the assessment feel like an adventure, not a form
5. Bright, encouraging tone while maintaining Crispy's professional credibility

---

## Current State Audit

### What's Working
- Solid DISC type definitions and content (motivations, fears, strengths, blindspots)
- Clear structure (intro → detailed type profiles → assessment)
- Accessible color palette within DISC types
- Multi-language support (EN/NL/ID)

### What Needs Fixing
- **Dark background (oklch 22% 0.10 260)** — contradicts brief for "bright"
- **"Quiz" terminology** — feels reductive; should be "Assessment" or "Self-Reflection"
- **4x2 summary grid** — too static, doesn't showcase DISC colors
- **Type detail sections** — adequate but visually muted; colors could be brighter and more prominent
- **Lack of visual diversity** — most sections are dark navy with white text; limited use of the 4 DISC colors
- **CTA buttons** — not clearly differentiated; assessment entry feels passive

---

## Visual Design Direction

### Color Strategy: The 4-Color System

Use the DISC colors as **primary visual drivers**, not just accent indicators.

| DISC Type | Current Color | Recommended Use | Visual Role |
|-----------|---------------|-----------------|-------------|
| **D** — Dominance | oklch(52% 0.20 25) | Hero CTA buttons, progress indicators, decisive moments | Energy, action, forward momentum |
| **I** — Influence | oklch(52% 0.18 80) | Social moments, team collaboration, engagement | Warmth, connection, enthusiasm |
| **S** — Steadiness | oklch(48% 0.18 145) | Support, safety, grounding sections | Trust, stability, care |
| **C** — Conscientiousness | oklch(48% 0.18 250) | Detail, accuracy, learning, reflection | Clarity, depth, precision |

**Application strategy:**
- **Hero/Intro sections**: Crispy navy + orange (maintain brand)
- **DISC type detail sections**: Keep existing dark backgrounds BUT add large, bright color blocks showing each type's color to the left or as a visual accent bar
- **Assessment section**: SWAP from dark navy to **off-white/bright background** with a prominent 4-color gradient bar at the top
- **Progress visualization**: Use DISC colors progressively — first question uses D color, second I, third S, fourth C, then cycle (visual rhythm)
- **Result display**: Highlight primary type color prominently; use all 4 DISC colors in the score breakdown chart

### Layout & UX Refinements

#### 1. Intro Section (No Major Change)
- Keep current layout (text left, 2x2 type summary right)
- **Enhancement**: Make the 2x2 summary grid more colorful
  - Background for each cell = type's colorVeryLight (e.g., D cell has light red tint)
  - Type badge = full color (darker, saturated)
  - Text remains dark for contrast

#### 2. Type Detail Sections
- **Current**: Dark background (type.bg) with text
- **New**: Keep dark background BUT add visual weight to color
  - Add a **thick left border** or **left color block** (2-3rem wide) in that type's color
  - OR introduce a **large circular badge** (4-6rem diameter) in the top-left corner with that type's color
  - Goal: make the color **unmissable** and **memorable**

#### 3. Assessment Section (Major Change)
- **Current background**: oklch(22% 0.10 260) [dark navy]
- **New background**: oklch(97% 0.005 80) [off-white/cream, Crispy's page background]
- **New decoration**: Top border with 4-color gradient
  ```
  linear-gradient(90deg, D-color, I-color, S-color, C-color)
  ```
- **Result of change**: Bright, open, inviting atmosphere
- **Maintain**: Dark text for questions and options (legibility)

#### 4. Progress Bar During Assessment
- Current: Single orange/coral line
- **New**: 4-color rotating system
  - As user progresses through questions, progress bar cycles through DISC colors
  - Q1-6: D-color progress bar
  - Q7-12: I-color progress bar
  - Q13-18: S-color progress bar
  - Q19-24: C-color progress bar
  - Creates visual rhythm and reinforces the 4-type framework

#### 5. Result Page
- Keep current layout (identity badge + tagline + score bars)
- **Enhancement**: Make score bars more visually prominent
  - Increase bar height for primary type (already doing this)
  - Use full saturation colors (currently slightly muted)
  - Ensure color contrast is WCAG AA

#### 6. CTA Buttons
- **"Take the Assessment" button**: Keep Crispy orange (brand consistency)
- **"Begin the Assessment" button** (in assessment section): Consider using D-color (crimsony red) to signal the start of something bold and important
- **"Save My Result" button**: Use S-color (green/teal) to signal safety and saving

---

## Copy Changes: Removing "Quiz"

### Search & Replace Tasks (for CLEO/Dev)

All instances of the word "Quiz" or "quiz" to be replaced:

| Current Text | Replacement | Context |
|--------------|------------|---------|
| "Begin the Quiz →" | "Begin the Assessment →" | Assessment intro button |
| "Retake Quiz" | "Retake Assessment" | Result page button |
| "Discover your DISC style." | "Discover your DISC profile." | Assessment section heading |
| Any reference to "Quiz Data" in code comments | "Assessment Data" | Internal documentation |

**Language note**: Use "Assessment," "Self-Reflection," or "Self-Discovery" instead of "Quiz." The tone should feel reflective and growth-oriented, not evaluative.

---

## Detailed Implementation Specs

### Section-by-Section Breakdown

#### A. Page Intro (Remains Mostly Unchanged)
**Background:** off-white (current)  
**Grid layout:** 2-column (text left, 2x2 type summary right)  

**2x2 Type Summary Grid Enhancement:**
```
Each cell:
- Background: type's colorVeryLight (light tint of the DISC color)
- Border: 1px solid light gray (current dividers are fine)
- Type badge:
  - Size: 2rem × 2rem (current)
  - Background: type's colorVeryLight
  - Border: 2px solid type's color (thicker, more visible)
  - Font color: type's color (darker, saturated)
- Label + tagline: Unchanged
```

**Result**: Each type cell gets a subtle color wash that introduces the viewer to the 4-color system before diving into detail.

---

#### B. Type Detail Sections (Enhanced)
**Background:** type.bg (dark, keep current)  
**New visual element:** Add a **color accent** to the left

**Option 1 — Left Border Block (Recommended):**
```
- Left side: Solid color block, 3rem wide, full height of type section
- Color: type's full color (D=red, I=yellow, S=green, C=blue)
- Effect: Creates a visual anchor; the color is the first thing you see
- Text and content: Offset to the right by padding, unchanged layout
```

**Option 2 — Large Circular Badge (Alternative):**
```
- Position: Top-left corner, overlapping with text
- Size: 6rem diameter
- Background: type's color
- Content: Type letter (D/I/S/C) in white, very large and bold
- Effect: More playful, slightly higher visual weight
```

**Recommendation**: Use Option 1 (left border block) for professional polish; Option 2 if Chris wants more visual drama.

---

#### C. Assessment Section (Major Redesign)
**Current state:** Dark navy background (oklch(22% 0.10 260))  
**New state:** Off-white background (oklch(97% 0.005 80))

**Changes:**

1. **Section background**: Swap to off-white/cream
2. **Top accent bar**: Add a 4-color gradient bar (4-6px height) at the top of the section
   ```
   background: linear-gradient(90deg, 
     oklch(52% 0.20 25) 0%,    // D — red
     oklch(52% 0.18 80) 33%,   // I — yellow
     oklch(48% 0.18 145) 66%,  // S — green
     oklch(48% 0.18 250) 100%  // C — blue
   );
   ```
3. **Question/answer text**: Change from light gray to dark charcoal (better legibility on light background)
4. **Answer options**: Keep semi-transparent backgrounds; ensure WCAG contrast
5. **Progress bar**: Add 4-color cycling system (see below)

**Progress Bar Enhancement:**
```
Current: Single-color bar showing percent progress

New: 4-color bar that changes color based on question group
- Questions 1-6: Gradient through D-color (red/crimson)
- Questions 7-12: Gradient through I-color (yellow/gold)
- Questions 13-18: Gradient through S-color (green/teal)
- Questions 19-24: Gradient through C-color (blue/navy)

Visual effect: As users progress, they "move through" each DISC type, 
reinforcing the framework and creating visual momentum
```

**Question Progress Text:**
- Change "Question X of 24" styling
- Color: Current color group (changes with each section)
- Effect: Subtle visual feedback that they're progressing through a coherent system

---

#### D. Result Page
**Background:** Keep current off-white  
**Identity badge and score display:** Minimal changes needed (already good)

**Enhancement — Result Score Bars:**
- Primary type bar: Keep large, prominent
- Secondary type bar: Ensure it's visually distinct (already done with opacity)
- Color saturation: Use full-saturation DISC colors (not muted)
- Label styling: Ensure WCAG AA contrast

**Example:**
```
D-type (Dominance):
- Bar color: oklch(52% 0.20 25) [full red]
- Background: oklch(97% 0.005 80 / 0.1) [light tint]
- Label: oklch(52% 0.20 25) [matches bar]
```

---

### Visual Hierarchy Summary

**Hierarchy from most to least prominent:**

1. **DISC 4-color blocks** — Use them as primary visual anchor (assessment area, type sections)
2. **Crispy brand colors** (navy + orange) — Hero sections, main CTAs, structural elements
3. **Off-white/light gray** — Breathing room, dividers, secondary surfaces
4. **Text** (dark charcoal) — Body copy, legibility

---

## Brightness & Warmth Assessment

### Current State
- Dark navy hero section for assessment
- Cool, tech-forward feel
- Feels slightly intimidating (dark, formal)

### New State
- Bright off-white assessment section
- Warm, inviting color accents (4 DISC colors)
- Feels like exploration, not evaluation
- Maintains professional credibility through Crispy brand structure

---

## Accessibility Checklist

- [ ] DISC color text on color backgrounds meets WCAG AA (4.5:1 contrast minimum)
- [ ] Progress bar color changes accompanied by text/number indicators (not color-only)
- [ ] All color-conveyed information (e.g., primary vs secondary type) has text labels
- [ ] Focus states on buttons are visible and meet WCAG standards
- [ ] Mobile: All color blocks and bars scale responsively

---

## Mobile Responsiveness

### Key Changes for Small Screens
1. **Type detail sections (left color block)**:
   - On mobile: Move color block to top, full width (instead of left side)
   - Or: Use top border instead of left border
2. **Assessment section**: Works as-is; gradient bar remains full-width
3. **Progress bar**: Remains visible on mobile (high priority)
4. **Type summary grid**: Already responsive (auto-fit); color enhancements don't break responsiveness

---

## Copy Tone Recommendations (for CLEO)

**Current tone:** Evaluative, clinical ("Take the Quiz, see your results")  
**Recommended tone:** Reflective, empowering ("Discover your profile, understand yourself better")

**Example rewrite:**
- "Begin the Quiz →" → "Discover Your DISC Profile →"
- "Retake Quiz" → "Explore Your Profile Again"
- Messaging around results should emphasize self-understanding, not judgment

---

## Files to Modify

**Frontend component:**
- `/app/(marketing)/resources/disc/DiscClient.tsx` (primary)

**Changes scope:**
- Background colors (section backgrounds)
- DISC color application (more prominent, varied use)
- Progress bar styling (4-color rotation)
- Text replacements ("Quiz" → "Assessment")
- Accent bars/borders (type sections, assessment section)
- Button styling (optional: D-color for assessment start)

**No changes needed:**
- Page metadata
- Quiz data/questions
- Result calculation logic
- Multi-language support (all copy replacements work in all languages)

---

## Design Decision Log

| Decision | Rationale |
|----------|-----------|
| Swap assessment section to bright background | Chris's brief: "The page is really dark" — light background creates the requested "bright" feel |
| Use DISC colors as primary visual drivers | 4-color system is the page's core framework; making colors prominent reinforces learning and visual distinctiveness |
| Progress bar cycles through 4 colors | Creates visual rhythm, reinforces the 4-type framework, makes progress feel like a journey through DISC types |
| Keep type detail sections dark but add color accent | Maintains focus on content while introducing the color system prominently |
| Remove "Quiz" terminology | Assessment is more accurate and respectful; "quiz" implies right/wrong answers; this is self-discovery |
| Increase color saturation of DISC colors | Ensures colors are bold, memorable, and clearly distinguishable from secondary UI elements |

---

## Chris's Approval Checklist

Before implementation begins, please confirm:

- [ ] **Bright background strategy**: Off-white assessment section is the right direction
- [ ] **4-color DISC system**: Making colors more prominent and visible is desired
- [ ] **"Quiz" removal**: Preferred terminology is "Assessment" or "Profile Discovery"
- [ ] **Type section accents**: Left color block (Option 1) vs. circular badge (Option 2) — which feels more Crispy?
- [ ] **Progress bar colors**: 4-color cycling strategy adds visual interest without feeling gimmicky
- [ ] **Overall tone**: Bright, colorful, inviting, yet professional — does this match your vision?
- [ ] **Timeline**: Ready to hand off to dev for implementation

---

## Next Steps

1. **Chris reviews and approves** this brief
2. **CLEO reviews copy changes** (confirm tone and "Assessment" language)
3. **Dev implements** CSS and JSX changes to DiscClient.tsx
4. **Testing**: Verify DISC colors meet WCAG AA, mobile responsiveness, multi-language rendering
5. **QA**: Visual review against this brief; Chris final sign-off

---

**Design discipline applied**: /shape (planning UX and UI), /impeccable (visual polish and brand consistency), /colorize (strategic color application)

---

**Prepared by:** BEAU, Brand Director  
**Reviewed by:** —  
**Approved by:** —
