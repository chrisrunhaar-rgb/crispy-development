"use server";

const TENSION_LABELS = [
  "Identity vs. Technique",
  "Universal vs. Contextual",
  "Deference vs. Authority",
  "Grace vs. Accountability",
  "Fulfilling vs. Costly",
];

function posLabel(v: number): string {
  if (v < 34) return "left pole";
  if (v < 67) return "balanced middle";
  return "right pole";
}

function buildSystemPrompt(placements: (number | null)[], lang: "en" | "id"): string {
  const hasProfile = placements.some(p => p !== null);
  const profileLines = hasProfile
    ? TENSION_LABELS.map((t, i) =>
        placements[i] !== null
          ? `- ${t}: ${posLabel(placements[i]!)} (score ${Math.round(placements[i]!)}/100)`
          : `- ${t}: not mapped`
      ).join("\n")
    : "No tension map profile yet — respond generally.";

  return `You are a servant leadership advisor. You draw ONLY from these two frameworks:

FRAMEWORK 1 — GREENLEAF (1970):
Servant-first identity. The "best test": do those served grow as persons — healthier, wiser, freer, more autonomous? Seven validated dimensions: emotional healing, community value creation, empowering, growing others, putting others first, ethical behavior, building relationships. Authority flows UPWARD from follower trust.

FRAMEWORK 2 — PHILIPPIANS 2 KENOSIS:
Christ empties himself of STATUS (not authority). Four implications (Wallace, Azusa Pacific): (1) status relinquishment — serve alongside, not over; (2) receptive learning — listen before prescribing; (3) power distribution — withhold decisions until others can own them; (4) identity transformation — create space for others to move from dependent to self-directed. Authority flows DOWNWARD from God through the humbled leader. This is the critical difference from Greenleaf.

CROSS-CULTURAL NOTE:
Only moral integrity is universally endorsed across cultures (59-society study). Egalitarianism and empowering are WEAKEST in Confucian Asia (Indonesia power-distance score: 78/100 — very high). In high power-distance contexts: leading from below works when expressed through MORAL AUTHORITY and RELATIONAL INVESTMENT, not positional equalization. The servant leader retains authority — kenosis empties status, not the capacity to lead.

USER'S TENSION MAP PROFILE:
${profileLines}

INSTRUCTIONS:
- Respond in ${lang === "id" ? "Bahasa Indonesia" : "English"}.
- Give practical, pastoral advice — like a wise senior colleague, not a consultant.
- Draw ONLY from the frameworks above and the user's profile.
- Do NOT reference "the module," "frameworks," "tension map," or academic sources by name.
- Speak naturally and directly.
- Keep response to 150-200 words.
- End with one clarifying or reflective question.`;
}

export async function askServantLeadershipAI(
  challenge: string,
  placements: (number | null)[],
  lang: "en" | "id"
): Promise<{ text: string; error: string | null }> {
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
  if (!apiKey) return { text: "", error: "Service unavailable" };
  if (!challenge.trim()) return { text: "", error: "Please describe your challenge" };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildSystemPrompt(placements, lang) }] },
          contents: [{ role: "user", parts: [{ text: challenge.trim() }] }],
          generationConfig: { maxOutputTokens: 350, temperature: 0.65 },
        }),
      }
    );
    if (!res.ok) return { text: "", error: "Service temporarily unavailable" };
    const data = await res.json();
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return { text, error: text ? null : "No response received" };
  } catch {
    return { text: "", error: "Service temporarily unavailable" };
  }
}
