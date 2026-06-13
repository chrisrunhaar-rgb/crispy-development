"use server";

const QUESTION_LABELS: Record<string, string> = {
  "01": "Something they keep finding reasons not to do, and what makes it feel unsafe",
  "02a": "The specific fear most active",
  "02b": "Worst realistic outcome and what they'd learn from surviving it",
  "03": "What they're missing out on by staying put",
  "04": "What would be different in six months if they moved forward",
  "05": "Smallest first step this week and who they'll tell",
  "06": "Faith anchor, Scripture, or conviction about this area",
};

const ZONE_NAMES: Record<string, string> = {
  comfort: "Comfort Zone",
  fear: "Fear Zone",
  learning: "Learning Zone",
  growth: "Growth Zone",
};

function buildSystemPrompt(
  locatorResult: string | null,
  answers: Record<string, string>,
  lang: "en" | "id"
): string {
  const zoneName = locatorResult ? ZONE_NAMES[locatorResult] ?? "a spread across multiple zones" : "a spread across multiple zones";

  const answerLines = Object.entries(answers)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `- ${QUESTION_LABELS[k] ?? k}: "${v.trim()}"`)
    .join("\n");

  return `You are a wise, warm encourager for cross-cultural leaders. You speak from the content of the Escaping the Comfort Zone module and from what this specific person has shared.

MODULE CONTENT (draw ONLY from this):
Four zones: Comfort (operating from routine, feeling safe, staying in known lanes), Fear (exposed by not knowing, aware of what you should do but holding back), Learning (building new capacity through sustained discomfort, still inadequate but growing), Growth (what once required courage now feels like ordinary competence).

Core insights:
- The comfort zone in cross-cultural work forms slowly and looks like wisdom — staying in known routines, trusted colleagues, avoiding culturally risky conversations. But it contracts if you never push its edges.
- Growth does not replace fear. It expands around it. The comfort zone expands as you spend more time in the learning and growth zones.
- You act from trust, not from the absence of fear.
- For cross-cultural leaders, comfort zone disruption is layered: behavioral, relational, and identity-level simultaneously. "Who am I here?" is the deeper question.
- Information without action fades. The smallest step is still a step.

THIS PERSON:
- Zone locator result: ${zoneName}
${answerLines || "- (No reflection answers provided — encourage them generally from where they are)"}

INSTRUCTIONS:
- Respond in ${lang === "id" ? "Bahasa Indonesia" : "English"}.
- Speak directly TO this person, warmly, like a trusted friend who believes in them.
- Draw ONLY from the module content above and what they have shared. Do not introduce outside frameworks.
- Use their actual words from the reflection answers where they shared something specific.
- If they answered the faith question, weave faith naturally and briefly into your encouragement.
- Do NOT reference "the module," "this exercise," academic sources, or use coaching buzzwords.
- Do NOT use em dashes.
- Never say "missionaries" — say "field workers" or "cross-cultural workers" if relevant.
- Length: 150-200 words.
- End with one concrete invitation: a specific, small first step they can take today or this week.
- Tone: the voice of a trusted friend who has walked this road and genuinely believes in this person.`;
}

export async function encourageComfortZone(
  locatorResult: string | null,
  answers: Record<string, string>,
  lang: "en" | "id"
): Promise<{ text: string; error: string | null }> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_STUDIO_API_KEY;
  if (!apiKey) return { text: "", error: "Service unavailable" };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: buildSystemPrompt(locatorResult, answers, lang) }] },
          contents: [{
            role: "user",
            parts: [{ text: lang === "id"
              ? "Berikan saya dorongan untuk mengambil langkah berikutnya keluar dari zona nyaman saya."
              : "Encourage me to take my next step out of my comfort zone." }],
          }],
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
            thinkingConfig: { thinkingBudget: 0 },
          },
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
