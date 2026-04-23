# DISC Redesign — Developer Implementation Guide

**Status:** Awaiting Chris approval before implementation  
**Target file:** `/app/(marketing)/resources/disc/DiscClient.tsx`  
**Complexity:** Medium (CSS + logic for color cycling)  

---

## Quick Reference: Color Values

```
// DISC Colors (use these values throughout)
D: oklch(52% 0.20 25)    // Red/Crimson
I: oklch(52% 0.18 80)    // Yellow/Gold
S: oklch(48% 0.18 145)   // Green/Teal
C: oklch(48% 0.18 250)   // Blue/Navy

// Crispy Brand
Navy: oklch(30% 0.12 260)
Orange: oklch(65% 0.15 45)
OffWhite: oklch(97% 0.005 80)
```

---

## Change 1: Assessment Section Background

**File location:** DiscClient.tsx, line ~844  
**Current code:**
```tsx
<section id="quiz-section" style={{ 
  paddingBlock: "clamp(4rem, 7vw, 7rem)", 
  background: "oklch(22% 0.10 260)",  // Dark navy
  position: "relative" 
}}>
```

**New code:**
```tsx
<section id="quiz-section" style={{ 
  paddingBlock: "clamp(4rem, 7vw, 7rem)", 
  background: "oklch(97% 0.005 80)",  // Off-white
  position: "relative",
  // Add 4-color gradient top bar
  borderTop: "4px solid transparent",
  backgroundImage: `linear-gradient(to right, 
    oklch(97% 0.005 80), oklch(97% 0.005 80)),
    linear-gradient(90deg, 
    oklch(52% 0.20 25) 0%,    // D-red
    oklch(52% 0.18 80) 33%,   // I-yellow
    oklch(52% 0.18 145) 66%,  // S-green
    oklch(48% 0.18 250) 100%  // C-blue
  )`,
  backgroundClip: "padding-box, border-box",
  backgroundOrigin: "padding-box, border-box",
}}>
```

**Alternative (simpler) using pseudo-element:**
```tsx
<section id="quiz-section" style={{ 
  paddingBlock: "clamp(4rem, 7vw, 7rem)", 
  background: "oklch(97% 0.005 80)",
  position: "relative"
}}>
  {/* Add this at the very top of the section */}
  <div style={{
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: "4px",
    background: `linear-gradient(90deg, 
      oklch(52% 0.20 25), oklch(52% 0.18 80), 
      oklch(48% 0.18 145), oklch(48% 0.18 250))`
  }} />
  {/* Rest of section content */}
</section>
```

---

## Change 2: Text Color on Light Background

**File location:** DiscClient.tsx, lines 846-857 (section labels and headings)  
**Current colors:** Designed for dark background
**Action:** Review all text colors in this section and adjust for light background legibility

**Current code example (line 846):**
```tsx
<p className="t-label" style={{ color: "oklch(65% 0.15 45)" }}>  // Orange label
```

**Verify:** This orange label is still legible on off-white background (should be fine)

**Lines to review:**
- L846: t-label (orange) — should be fine, high contrast
- L849: t-section heading — currently white ("oklch(97% 0.005 80)") — MUST CHANGE to dark text
- L852: body text color — currently "oklch(65% 0.04 260)" (dark) — should be fine

**Specific change needed (line 849):**
```tsx
// Old (white text on dark background):
<h2 className="t-section" style={{ color: "oklch(97% 0.005 80)" }}>

// New (dark text on light background):
<h2 className="t-section" style={{ color: "oklch(22% 0.005 260)" }}>  // Dark charcoal
```

---

## Change 3: Progress Bar Color Cycling

**File location:** DiscClient.tsx, lines 880-889 (progress bar display)  
**Current code:**
```tsx
<div style={{ height: "2px", background: "oklch(97% 0.005 80 / 0.08)" }}>
  <div style={{ 
    height: "100%", 
    background: "oklch(65% 0.15 45)",  // Static orange
    width: `${((currentQ + 1) / QS.length) * 100}%`, 
    transition: "width 0.4s ease" 
  }} />
</div>
```

**New code with 4-color cycling:**
```tsx
{/* Progress bar with color cycling */}
<div style={{ height: "2px", background: "oklch(97% 0.005 80 / 0.08)" }}>
  <div style={{ 
    height: "100%", 
    // Color cycles: D→I→S→C based on question group
    background: getProgressBarColor(currentQ),
    width: `${((currentQ + 1) / QS.length) * 100}%`, 
    transition: "width 0.4s ease, background 0.3s ease"
  }} />
</div>

{/* Update progress text color to match bar */}
<p style={{ 
  fontFamily: "var(--font-montserrat)", 
  fontSize: "0.72rem", 
  color: getProgressBarColor(currentQ)  // Change from static to dynamic
}}>
  {tr("Question", "Pertanyaan", "Vraag")} {currentQ + 1} {tr("of", "dari", "van")} {QS.length}
</p>
```

**Helper function to add (at top of component, near other utility functions):**
```tsx
const getProgressBarColor = (questionIndex: number) => {
  // 24 questions total: 6 per color
  const colorIndex = Math.floor(questionIndex / 6);
  const colors = [
    "oklch(52% 0.20 25)",    // D-red (Q 0-5)
    "oklch(52% 0.18 80)",    // I-yellow (Q 6-11)
    "oklch(48% 0.18 145)",   // S-green (Q 12-17)
    "oklch(48% 0.18 250)",   // C-blue (Q 18-23)
  ];
  return colors[colorIndex % 4];
};
```

---

## Change 4: Remove "Quiz" Language

**Search & Replace in DiscClient.tsx:**

| Find | Replace | Line(s) |
|------|---------|---------|
| "Begin the Quiz →" | "Begin the Assessment →" | ~873 |
| "Retake Quiz" | "Retake Assessment" | ~1060 |
| "Quiz Data" (comment) | "Assessment Data" | ~7 |
| Any other "Quiz" | "Assessment" | Full file |

**Example (line ~873):**
```tsx
// Old:
{tr("Begin the Quiz →", "Mulai Kuis →", "Begin de quiz →")}

// New:
{tr("Begin the Assessment →", "Mulai Assessment →", "Begin de assessment →")}
```

**Note:** These are in the translation function calls, so update all three language strings at once.

---

## Change 5: Type Summary Grid Color Enhancement (Optional)

**File location:** DiscClient.tsx, lines 685-708 (intro section 2x2 grid)  
**Current state:** White cards with type badges
**Enhancement:** Add subtle color wash to each card

**Current code:**
```tsx
<div style={{ background: "white", padding: "1.5rem" }}>
```

**New code:**
```tsx
<div style={{ 
  background: "white",
  padding: "1.5rem",
  // Add very subtle color tint from DISC type
  backgroundImage: `linear-gradient(
    135deg,
    ${type.colorVeryLight}40,
    transparent
  )`
}}>
```

**Result:** Each type cell gets a barely-visible color wash that hints at the DISC color system.

---

## Change 6: Type Detail Sections — Left Color Accent (Optional Enhancement)

**File location:** DiscClient.tsx, lines 715-839 (DISC type detail sections)  
**Current state:** Dark background with minimal color emphasis
**Enhancement:** Add prominent left border or color block

**Recommendation: Left border accent**

**Current code (line 716):**
```tsx
<section key={type.key} id={`disc-${type.key}`} style={{ 
  paddingBlock: "clamp(4rem, 7vw, 7rem)", 
  background: type.bg 
}}>
```

**New code:**
```tsx
<section key={type.key} id={`disc-${type.key}`} style={{ 
  paddingBlock: "clamp(4rem, 7vw, 7rem)", 
  background: type.bg,
  // Add left border color accent
  borderLeft: `4px solid ${type.color}`,
  paddingLeft: "calc(clamp(3rem, 6vw, 5rem) - 4px)"  // Adjust left padding to compensate
}}>
```

**Alternative: Thick left background block**
```tsx
<section style={{...}}>
  {/* Add this as the first child */}
  <div style={{
    position: "absolute",
    left: 0, top: 0, bottom: 0,
    width: "3rem",
    background: type.color
  }} />
  
  {/* Rest of container content with adjusted padding */}
  <div className="container-wide" style={{ paddingLeft: "4rem" }}>
    {/* existing content */}
  </div>
</section>
```

**Recommendation:** Use the left border (simpler, cleaner, responsive).

---

## Testing Checklist

After implementation, verify:

- [ ] **Color contrast**: Run WCAG AA checker on all text + background combinations
  - Dark text on light assessment background
  - Orange text on light background
  - All DISC color text on colored backgrounds
- [ ] **Mobile responsiveness**: Gradient bar, progress bar, color elements remain visible and aligned
- [ ] **Language rendering**: All 3 languages (EN/NL/ID) display correctly with new text
- [ ] **Progress bar animation**: Color transitions smoothly as questions progress
- [ ] **Assessment section**: Background loads correctly (off-white, not dark)
- [ ] **Type sections**: Color accents are visible on both desktop and mobile
- [ ] **Browser compatibility**: Test in latest Chrome, Firefox, Safari, Edge

---

## Rollback Plan

If issues arise:

1. **Assessment background**: Can quickly revert to original dark navy (oklch(22% 0.10 260))
2. **Progress bar colors**: Can simplify back to static orange (oklch(65% 0.15 45))
3. **Text colors**: Keep dark charcoal for legibility; revert to light text only if needed
4. **Type accents**: Can remove border/block additions without breaking layout

---

## Code Review Notes

**Areas of special attention:**
1. Progress bar color transitions don't lag or feel jerky
2. Gradient top bar renders correctly on all browsers
3. Text colors meet WCAG AA (4.5:1) contrast ratio
4. Mobile: No overflow or layout shift when adding borders/accents

---

**Prepared for:** Dev team  
**Estimated effort:** 1-2 hours (CSS updates + testing)  
**Review by:** QA before Chris sign-off
