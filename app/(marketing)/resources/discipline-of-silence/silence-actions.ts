"use server";

import Anthropic from "@anthropic-ai/sdk";

interface AssessmentSummary {
  dimension: string;
  selectedOption: string;
}

interface OpenAnswers {
  area: string;
  challenge: string;
  impact: string;
}

export async function generateSilenceAdvice(
  assessmentSummary: AssessmentSummary[],
  openAnswers: OpenAnswers
): Promise<string> {
  const client = new Anthropic();

  const assessmentContext = assessmentSummary
    .map(({ dimension, selectedOption }) => `${dimension}: ${selectedOption}`)
    .join("\n");

  const prompt = `You are a warm, faith-rooted leadership coach. A cross-cultural leader just completed the Discipline of Silence module on crispyleaders.com.

Their self-assessment showed:
${assessmentContext}

They reflected:
- Where they want to grow: "${openAnswers.area || "Not specified"}"
- Biggest challenge: "${openAnswers.challenge || "Not specified"}"
- What would change: "${openAnswers.impact || "Not specified"}"

Write 3-4 sentences of personalized advice and encouragement. Be specific to what they shared. Reference silence as a spiritual discipline. End with a brief faith-rooted blessing. Warm, direct, no em dashes, no generic phrases.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== "text") return "Keep pressing in. Silence will reward your faithfulness.";
  return block.text;
}
